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
  grid: { rows: number; cols: number; minX: number; maxX: number; minZ: number; maxZ: number; heights: number[] },
  x: number,
  z: number,
): number {
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

  const h00 = heights[r0 * cols + c0] ?? 0;
  const h10 = heights[r0 * cols + c1] ?? 0;
  const h01 = heights[r1 * cols + c0] ?? 0;
  const h11 = heights[r1 * cols + c1] ?? 0;

  const h0 = h00 + (h10 - h00) * tx;
  const h1 = h01 + (h11 - h01) * tx;
  return h0 + (h1 - h0) * tz;
}

/**
 * Bilinearly interpolates terrain height (in meters relative to Windermere lake datum 0m).
 * Uses high-resolution UK Environment Agency LiDAR DTM inside the Waterhead–Ambleside corridor
 * and smoothly blends into the wider Copernicus EU-DEM 25m basin grid at boundaries.
 */
export function sampleTerrainHeight(
  terrain: TerrainGridData | null,
  x: number,
  z: number,
): number {
  if (!terrain || terrain.heights.length === 0) {
    return proceduralFallbackHeight(x, z);
  }
  const baseH = sampleGrid(terrain, x, z);
  const d = terrain.detail;
  if (!d || d.heights.length === 0) return baseH;

  if (x >= d.minX && x <= d.maxX && z >= d.minZ && z <= d.maxZ) {
    const detH = sampleGrid(d, x, z);
    const margin = 85;
    const dx = Math.min(x - d.minX, d.maxX - x);
    const dz = Math.min(z - d.minZ, d.maxZ - z);
    const edge = Math.min(dx, dz);
    if (edge >= margin) return detH;
    const t = Math.max(0, Math.min(1, edge / margin));
    return baseH + (detH - baseH) * t;
  }
  return baseH;
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
