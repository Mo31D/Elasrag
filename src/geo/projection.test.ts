import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compileRoutePolyline,
  isPointInLake,
  latLonToWorld,
  sampleCompiledRoute,
  sampleTerrainHeight,
  worldToLatLon,
} from './projection';
import type { LakeData, TerrainGridData } from '../types/game';

test('latLonToWorld places Waterhead Pier origin near (0, 0) and Ambleside north (-Z)', () => {
  const [wx, wz] = latLonToWorld(54.4175, -2.9635);
  assert.ok(Math.abs(wx) < 0.01);
  assert.ok(Math.abs(wz) < 0.01);

  const [ax, az] = latLonToWorld(54.4287, -2.9615);
  assert.ok(ax > 50, 'Ambleside is slightly east of Waterhead');
  assert.ok(az < -1000, 'Ambleside is ~1.2km north (-Z) of Waterhead');

  const [latBack, lonBack] = worldToLatLon(ax, az);
  assert.ok(Math.abs(latBack - 54.4287) < 0.0001);
  assert.ok(Math.abs(lonBack - -2.9615) < 0.0001);
});

test('sampleTerrainHeight bilinearly interpolates elevation grid', () => {
  const grid: TerrainGridData = {
    rows: 2,
    cols: 2,
    minX: 0,
    maxX: 100,
    minZ: -100,
    maxZ: 0,
    lakeDatumM: 39,
    heights: [0, 10, 20, 30], // row 0 (maxZ=0): 0..10; row 1 (minZ=-100): 20..30
  };
  assert.equal(sampleTerrainHeight(grid, 0, 0), 0);
  assert.equal(sampleTerrainHeight(grid, 100, 0), 10);
  assert.equal(sampleTerrainHeight(grid, 0, -100), 20);
  assert.equal(Math.round(sampleTerrainHeight(grid, 50, -50)), 15);
});

test('isPointInLake respects outer shoreline and excludes islands like Belle Isle', () => {
  const lake: LakeData = {
    outerRings: [
      [
        [-100, -100],
        [100, -100],
        [100, 100],
        [-100, 100],
      ],
    ],
    innerRings: [
      [
        [-20, -20],
        [20, -20],
        [20, 20],
        [-20, 20],
      ],
    ],
    waterways: [],
  };
  assert.equal(isPointInLake(lake, 60, 60), true);
  assert.equal(isPointInLake(lake, 0, 0), false); // on island
  assert.equal(isPointInLake(lake, 150, 0), false); // outside lake
});

test('compileRoutePolyline and sampleCompiledRoute compute tangent and right vectors', () => {
  const route = compileRoutePolyline([
    [0, 0],
    [0, -100],
    [100, -100],
  ]);
  assert.equal(route.totalLength, 200);
  const s1 = sampleCompiledRoute(route, 50);
  assert.equal(s1.x, 0);
  assert.equal(s1.z, -50);
  assert.equal(s1.tx, 0);
  assert.equal(s1.tz, -1);
  assert.equal(s1.rx, 1);
  assert.equal(s1.rz, 0);

  const s2 = sampleCompiledRoute(route, 150);
  assert.equal(s2.x, 50);
  assert.equal(s2.z, -100);
  assert.equal(s2.tx, 1);
  assert.equal(s2.tz, 0);
});
