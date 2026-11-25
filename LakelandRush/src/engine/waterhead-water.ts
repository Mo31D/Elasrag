import * as THREE from 'three';
import type { LakeData } from '../types/game';

export const WATERHEAD_WATER_BOUNDS = [-120, -530, 380, 650] as const;

export function buildWaterheadShoreDistance(lake: LakeData | null) {
  const [x0, z0, width, depth] = WATERHEAD_WATER_BOUNDS;
  const edge = 128;
  const distance = new Uint8Array(edge * edge);
  const segments: Array<[number, number, number, number]> = [];
  for (const ring of lake?.outerRings ?? []) {
    for (let i = 0; i < ring.length; i++) {
      const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % ring.length];
      if (Math.max(ax, bx) < x0 - 35 || Math.min(ax, bx) > x0 + width + 35
        || Math.max(az, bz) < z0 - 35 || Math.min(az, bz) > z0 + depth + 35) continue;
      segments.push([ax, az, bx, bz]);
    }
  }
  for (let row = 0; row < edge; row++) {
    const z = z0 + (row + .5) / edge * depth;
    for (let col = 0; col < edge; col++) {
      const x = x0 + (col + .5) / edge * width;
      let near = 30 * 30;
      for (const [ax, az, bx, bz] of segments) {
        const dx = bx - ax, dz = bz - az;
        const u = THREE.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1), 0, 1);
        const ex = x - ax - dx * u, ez = z - az - dz * u;
        near = Math.min(near, ex * ex + ez * ez);
      }
      distance[row * edge + col] = Math.round(Math.sqrt(near) / 30 * 255);
    }
  }
  const texture = new THREE.DataTexture(distance, edge, edge, THREE.RedFormat);
  texture.magFilter = texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
