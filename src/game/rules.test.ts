import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_COMBO,
  applyCollisionPenalty,
  awardFlowEvent,
  buildRunResult,
  commitRunToSaveData,
  createDefaultSaveData,
  createInitialScoringState,
  tickScoring,
} from './rules';
import type { RouteDefinition } from '../types/game';

const SAMPLE_ROUTE: RouteDefinition = {
  id: 'waterhead_ambleside',
  title: 'Waterhead & Ambleside Scramble',
  subtitle: 'Lakeside pier to Market Cross',
  difficulty: 'Accessible',
  mode: 'sprint',
  startName: 'Waterhead Pier',
  finishName: 'Ambleside Market Cross',
  lengthMeters: 1600,
  targetTimeSec: 85,
  parScore: 9500,
  waypoints: [
    [0, 0],
    [0, -1600],
  ],
  corridorHalfWidth: 7.5,
  landmarks: [],
};

test('combo multiplier builds up on consecutive flow events and caps at MAX_COMBO', () => {
  let state = createInitialScoringState();
  for (let i = 0; i < 15; i++) {
    const res = awardFlowEvent(state, 100, 1.5, true);
    state = res.state;
  }
  assert.equal(state.combo, MAX_COMBO);
  assert.equal(state.tokensCollected, 15);
  assert.ok(state.score > 5000);
});

test('tickScoring resets combo when timer expires and accumulates speed points', () => {
  let state = createInitialScoringState();
  state = awardFlowEvent(state, 100, 3.0, false).state;
  state = awardFlowEvent(state, 100, 3.0, false).state;
  assert.equal(state.combo, 2);

  state = tickScoring(state, 5.0, false);
  assert.equal(state.combo, 1);
  assert.ok(state.score > 200);
});

test('collision penalty decrements hearts, resets combo, and slows runner', () => {
  let state = createInitialScoringState();
  state = awardFlowEvent(state, 100, 10.0, false).state;
  state = awardFlowEvent(state, 100, 5.0, false).state;
  const beforeSpeed = state.speedMps;

  state = applyCollisionPenalty(state);
  assert.equal(state.hearts, 2);
  assert.equal(state.combo, 1);
  assert.ok(state.speedMps < beforeSpeed);
});

test('run results and save data persist best score and highest medal', () => {
  let state = createInitialScoringState();
  state.score = 11200;
  state.topSpeedMps = 28;
  state.maxCombo = 7;
  state.tokensCollected = 18;

  const res = buildRunResult(SAMPLE_ROUTE, true, 'Finish Line Reached', state, 72, 1600, 24);
  assert.equal(res.medal, 'Gold');
  assert.equal(res.isNewBest, true);

  let save = createDefaultSaveData();
  save = commitRunToSaveData(save, res);
  assert.equal(save.totalRuns, 1);
  assert.equal(save.records[SAMPLE_ROUTE.id].medal, 'Gold');

  const lowerRes = buildRunResult(
    SAMPLE_ROUTE,
    true,
    'Finish Line Reached',
    { ...state, score: 4000 },
    110,
    1600,
    24,
    save.records[SAMPLE_ROUTE.id],
  );
  assert.equal(lowerRes.isNewBest, false);
  save = commitRunToSaveData(save, lowerRes);
  assert.equal(save.records[SAMPLE_ROUTE.id].bestScore, 11200);
  assert.equal(save.records[SAMPLE_ROUTE.id].medal, 'Gold');
});
