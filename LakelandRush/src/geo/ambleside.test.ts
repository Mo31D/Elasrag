import assert from 'node:assert/strict';
import { test } from 'node:test';
import navigation from '../data/ambleside-navigation.json';

test('the two main approaches share the mapped fork and reach distinct town junctions', () => {
  const [lakeRoad, borransRoad, oldLakeRoad] = navigation.approaches;
  assert.equal(lakeRoad.nodeIds[0], 232013);
  assert.equal(borransRoad.nodeIds[0], 232013);
  assert.deepEqual(lakeRoad.points[0], borransRoad.points[0]);
  assert.equal(lakeRoad.nodeIds.at(-1), 232039);
  assert.equal(borransRoad.nodeIds.at(-1), 232028);
  assert.ok(lakeRoad.nodeIds.includes(oldLakeRoad.nodeIds[0]));
  assert.ok(lakeRoad.nodeIds.includes(oldLakeRoad.nodeIds.at(-1)!));
  for (const route of navigation.approaches) {
    assert.equal(route.nodeIds.length, route.points.length);
    const length = route.points.slice(1).reduce((total, [x, z], i) =>
      total + Math.hypot(x - route.points[i][0], z - route.points[i][1]), 0);
    assert.ok(Math.abs(length - route.lengthM) < .1);
  }
});

test('landmark travel includes mapped shop, attractions and practical stops', () => {
  const stops = new Map(navigation.stops.map(stop => [stop.id, stop]));
  for (const id of ['black-sheep', 'picnic', 'bridge-house', 'market', 'rothay-bridge', 'rothay-park',
    'tesco', 'coop', 'hills', 'galava', 'car-park']) {
    assert.ok(stops.get(id)?.osmIds.length, id);
  }
  assert.deepEqual(stops.get('black-sheep')?.osmIds, [4231695543, 423598927]);
});
