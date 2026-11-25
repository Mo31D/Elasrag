import type { LakeData, TerrainGridData } from '../types/game';

export const ORIGIN_LAT = 54.4175;
export const ORIGIN_LON = -2.9635;
export const LAKE_DATUM_M = 39.0;

export const METERS_PER_DEG_LAT = 111319.5;
export const METERS_PER_DEG_LON = 111319.5 * Math.cos((ORIGIN_LAT * Math.PI) / 180);

export function latLonToWorld(lat: number, lon: number): [number, number] {
  const x = (lon - ORIGIN_LON) * METERS_PER_DEG_LON;
  const z = -(lat - ORIGIN_LAT) * METERS_PER_DEG_LAT;
  return [x, z];
}

export function worldToLatLon(x: number, z: number): [number, number] {
  const lat = ORIGIN_LAT - z / METERS_PER_DEG_LAT;
  const lon = ORIGIN_LON + x / METERS_PER_DEG_LON;
  return [lat, lon];
}

export function distance2D(ax: number, az: number, bx: number, bz: number): number {
  const dx = bx - ax;
  const dz = bz - az;
  return Math.hypot(dx, dz);
}

function sampleGrid(
  grid: { rows: number; cols: number; minX: number; maxX: number; minZ: number; maxZ: number; heights: Array<number | null> },
  x: number,
  z: number,
): number | null {
  const { rows, cols, minX, maxX, minZ, maxZ, heights } = grid;
  const u = Math.max(0, Math.min(1, (x - minX) / (maxX - minX)));
  // row 0 corresponds to minLat (maxZ, southernmost), row rows-1 corresponds to maxLat (minZ, northernmost)
  const v = Math.max(0, Math.min(1, (maxZ - z) / (maxZ - minZ)));

  const fc = u * (cols - 1);
  const fr = v * (rows - 1);
  const c0 = Math.floor(fc);
  const r0 = Math.floor(fr);
  const c1 = Math.min(cols - 1, c0 + 1);
  const r1 = Math.min(rows - 1, r0 + 1);
  const tx = fc - c0;
  const tz = fr - r0;

  const corners: Array<[number | null, number]> = [
    [heights[r0 * cols + c0], (1 - tx) * (1 - tz)],
    [heights[r0 * cols + c1], tx * (1 - tz)],
    [heights[r1 * cols + c0], (1 - tx) * tz],
    [heights[r1 * cols + c1], tx * tz],
  ];
  let result = 0;
  for (const [height, weight] of corners) {
    if (weight <= 1e-9) continue;
    if (height == null) return null;
    result += height * weight;
  }
  return result;
}

/**
 * Samples the coarse grid or the fine mesh triangles in the Waterhead survey.
 * Null survey nodes borrow the coarse elevation. The outer 85 m blends the datums.
 */
export function sampleTerrainHeight(
  terrain: TerrainGridData | null,
  x: number,
  z: number,
): number {
  if (!terrain || terrain.heights.length === 0) return proceduralFallbackHeight(x, z);
  const detail = terrain.detail;
  const base = (px: number, pz: number) => sampleGrid(terrain, px, pz) ?? proceduralFallbackHeight(px, pz);
  if (!detail || x < detail.minX || x > detail.maxX || z < detail.minZ || z > detail.maxZ) {
    return base(x, z);
  }

  const { rows, cols, minX, maxX, minZ, maxZ, heights } = detail;
  const dx = (maxX - minX) / (cols - 1);
  const dz = (maxZ - minZ) / (rows - 1);
  const col = (x - minX) / dx;
  const row = (z - minZ) / dz;
  const c = Math.min(cols - 2, Math.floor(col));
  const r = Math.min(rows - 2, Math.floor(row));
  const u = col - c;
  const v = row - r;

  const node = (nr: number, nc: number): number => {
    const px = minX + nc * dx;
    const pz = minZ + nr * dz;
    // The package stores southern rows first, while the mesh builds north to south.
    const measured = heights[(rows - 1 - nr) * cols + nc];
    const blend = Math.min(1, Math.min(px - minX, maxX - px, pz - minZ, maxZ - pz) / 85);
    if (measured != null && blend === 1) return measured;
    const coarse = base(px, pz);
    return measured == null ? coarse : coarse + (measured - coarse) * blend;
  };
  if (Math.abs(col - Math.round(col)) < 1e-8 && Math.abs(row - Math.round(row)) < 1e-8) {
    return node(Math.round(row), Math.round(col));
  }
  // The terrain index buffer uses the diagonal from south-west to north-east.
  return u + v <= 1
    ? (1 - u - v) * node(r, c) + u * node(r, c + 1) + v * node(r + 1, c)
    : (u + v - 1) * node(r + 1, c + 1) + (1 - v) * node(r, c + 1) + (1 - u) * node(r + 1, c);
}

export function proceduralFallbackHeight(x: number, z: number): number {
  const valleyDist = Math.abs(x + z * 0.08);
  const hill = Math.max(0, (valleyDist - 280) * 0.14);
  return Math.max(0, hill + Math.sin(x * 0.008) * Math.cos(z * 0.008) * 6);
}

export function pointInRing(x: number, z: number, ring: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const zi = ring[i][1];
    const xj = ring[j][0];
    const zj = ring[j][1];
    const intersect =
      zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function isPointInLake(lake: LakeData | null, x: number, z: number): boolean {
  if (!lake) return false;
  let inOuter = false;
  for (const ring of lake.outerRings) {
    if (pointInRing(x, z, ring)) {
      inOuter = true;
      break;
    }
  }
  if (!inOuter) return false;
  // Exclude islands such as Belle Isle
  for (const island of lake.innerRings) {
    if (pointInRing(x, z, island)) {
      return false;
    }
  }
  return true;
}

export interface RouteSample {
  x: number;
  z: number;
  tx: number; // unit tangent X
  tz: number; // unit tangent Z
  rx: number; // unit right X (90deg clockwise from forward)
  rz: number; // unit right Z
  distance: number;
  progress: number;
}

export interface CompiledRoute {
  points: Array<[number, number]>;
  cumDist: number[];
  totalLength: number;
}

export function compileRoutePolyline(waypoints: Array<[number, number]>): CompiledRoute {
  if (waypoints.length < 2) {
    return { points: waypoints, cumDist: [0], totalLength: 0 };
  }
  const cumDist: number[] = [0];
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    total += distance2D(
      waypoints[i - 1][0],
      waypoints[i - 1][1],
      waypoints[i][0],
      waypoints[i][1],
    );
    cumDist.push(total);
  }
  return { points: waypoints, cumDist, totalLength: total };
}

export function sampleCompiledRoute(route: CompiledRoute, dist: number): RouteSample {
  const clamped = Math.max(0, Math.min(route.totalLength, dist));
  const { points, cumDist, totalLength } = route;
  if (points.length < 2 || totalLength <= 0) {
    return { x: 0, z: 0, tx: 0, tz: -1, rx: 1, rz: 0, distance: 0, progress: 0 };
  }

  let idx = 0;
  while (idx < cumDist.length - 2 && cumDist[idx + 1] < clamped) {
    idx++;
  }
  const segStart = cumDist[idx];
  const segEnd = cumDist[idx + 1];
  const segLen = Math.max(0.001, segEnd - segStart);
  const t = Math.max(0, Math.min(1, (clamped - segStart) / segLen));

  const ax = points[idx][0];
  const az = points[idx][1];
  const bx = points[idx + 1][0];
  const bz = points[idx + 1][1];

  const x = ax + (bx - ax) * t;
  const z = az + (bz - az) * t;
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz) || 1;
  const tx = dx / len;
  const tz = dz / len;
  // Right-hand vector perpendicular to (tx, tz) in XZ plane (+X right when facing -Z North)
  const rx = -tz;
  const rz = tx;

  return {
    x,
    z,
    tx,
    tz,
    rx,
    rz,
    distance: clamped,
    progress: clamped / totalLength,
  };
}
