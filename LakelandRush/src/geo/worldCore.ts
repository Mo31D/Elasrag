import { worldToLatLon } from './projection';

export type Point = [number, number];
export type WorldWay = { nodeIds: number[]; geometry: 'Polygon' | 'LineString'; tags: Record<string, string> };
export interface WorldCore {
  schemaVersion: 2;
  region: string;
  bboxWgs84: [number, number, number, number];
  legacyToBng: [[number, number, number], [number, number, number]];
  sampledTransformResidualM: number;
  nodes: Record<string, Point>;
  ways: Record<string, WorldWay>;
  layers: { roads: string[]; buildings: string[]; water: string[]; land: string[]; rail: string[];
    places: Array<string | { id: string; point: Point; tags: Record<string, string> }> };
  source: { attribution: string; licence: string; url: string };
  entities: Array<{ id: string; kind: string; name?: string; website?: string; premisesId?: string;
    buildingRef?: string; locationRef?: string; verification: string }>;
}

export function worldToBng(core: WorldCore, [x,z]: Point): Point {
  const [[e,ex,ez], [n,nx,nz]] = core.legacyToBng;
  return [e + x*ex + z*ez, n + x*nx + z*nz];
}

export function bngToWorld(core: WorldCore, [easting,northing]: Point): Point {
  const [[e,ex,ez], [n,nx,nz]] = core.legacyToBng;
  const de = easting-e;
  const dn = northing-n;
  const det = ex*nz - ez*nx;
  return [(de*nz - dn*ez)/det, (dn*ex - de*nx)/det];
}

export function bngToLatLon(core: WorldCore, point: Point) {
  return worldToLatLon(...bngToWorld(core, point));
}

export function segmentDistance([x,z]: Point, [ax,az]: Point, [bx,bz]: Point) {
  const dx = bx-ax, dz = bz-az;
  const t = Math.max(0, Math.min(1, ((x-ax)*dx + (z-az)*dz)/(dx*dx + dz*dz || 1)));
  return Math.hypot(x-ax-t*dx, z-az-t*dz);
}

export async function loadWorldCore(): Promise<WorldCore> {
  const result = await fetch(`${import.meta.env.BASE_URL}world-core/ambleside-v2.json`);
  if (!result.ok) throw new Error('World Core package unavailable');
  const core: WorldCore = await result.json();
  if (core.schemaVersion !== 2) throw new Error('Unsupported World Core package');
  return core;
}
