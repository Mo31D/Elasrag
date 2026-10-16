import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fresh, reward, evidence, status, load, KEY } from '../src/progress.js';
test('missions cannot farm XP', () => {
  const s = fresh();
  assert.equal(reward(s, 'mission:1', 5), 5);
  assert.equal(reward(s, 'mission:1', 5), 0);
  assert.equal(s.profiles.explorer.xp, 5);
});
test('mastery requires independent recall on later days', () => {
  const s = fresh(),
    start = Date.UTC(2026, 9, 15, 12);
  evidence(s, 'notice', true, false, start);
  assert.equal(status(s.profiles.explorer.skills.notice, start), 'Practising');
  evidence(s, 'notice', true, false, start + 100);
  assert.equal(s.profiles.explorer.skills.notice.independent, 1);
  for (const day of [1, 4, 11])
    evidence(s, 'notice', true, false, start + day * 86400000);
  assert.equal(
    status(s.profiles.explorer.skills.notice, start + 11 * 86400000),
    'Secure',
  );
  assert.equal(
    status(s.profiles.explorer.skills.notice, start + 30 * 86400000),
    'Review due',
  );
});
test('supported practice never counts as independent', () => {
  const s = fresh();
  evidence(s, 'relieved', true, true, Date.now());
  assert.equal(s.profiles.explorer.skills.relieved.independent, 0);
  assert.equal(status(s.profiles.explorer.skills.relieved), 'Learning');
});
test('invalid saved progress recovers and valid state round-trips', () => {
  assert.equal(load({ getItem: () => '{oops' }).version, 1);
  const s = fresh();
  s.missionStep = 3;
  s.clues = ['empty'];
  assert.deepEqual(load({ getItem: () => JSON.stringify(s) }), s);
});
test('guided practice followed by a different independent challenge counts one independent day',()=>{
 const state=fresh(),now=Date.parse('2026-10-16T12:00:00Z');
 evidence(state,'place-value',true,true,now);evidence(state,'place-value',true,false,now+1000);
 assert.equal(state.profiles.explorer.skills['place-value'].independent,1);
 evidence(state,'place-value',true,true,now+2000);evidence(state,'place-value',true,false,now+3000);
 assert.equal(state.profiles.explorer.skills['place-value'].independent,1);
});
