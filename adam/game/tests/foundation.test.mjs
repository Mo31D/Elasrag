import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fresh,
  createProfile,
  switchProfile,
  reward,
  evidence,
  recordEvent,
} from '../src/progress.js';
import {
  nextContent,
  budgetAllows,
  inspectCandidate,
  approveCandidate,
} from '../src/factory.js';
test('family profiles keep mission, skills, credits and XP separate', () => {
  const s = fresh();
  s.clues = ['empty'];
  s.missionStep = 2;
  reward(s, 'mission', 5);
  evidence(s, 'notice', true);
  createProfile(s, 'joseph', 'Joseph', 4);
  switchProfile(s, 'joseph');
  assert.equal(s.profiles.joseph.xp, 0);
  assert.deepEqual(s.clues, []);
  assert.deepEqual(s.profiles.joseph.skills, {});
  s.clues = ['cloth'];
  s.missionStep = 3;
  reward(s, 'mission', 5);
  switchProfile(s, 'explorer');
  assert.equal(s.missionStep, 2);
  assert.deepEqual(s.clues, ['empty']);
  assert.equal(s.profiles.explorer.xp, 5);
  assert.equal(s.profiles.joseph.xp, 5);
  assert.equal(s.rewardModule.enabled, false);
});
test('learning events are bounded and omit raw text and speech', () => {
  const s = fresh();
  for (let i = 0; i < 505; i++)
    recordEvent(
      s,
      'skill_attempted',
      {
        skill: 'notice',
        correct: true,
        rawSpeech: 'private',
        answerText: 'private',
      },
      i,
    );
  const events = s.profiles.explorer.events;
  assert.equal(events.length, 500);
  assert.ok(events.every((e) => !('rawSpeech' in e) && !('answerText' in e)));
});
test('planner respects prerequisites and reuses approved content', () => {
  const out = nextContent({
    skills: [
      { id: 'a', prerequisites: [] },
      { id: 'b', prerequisites: ['a'] },
      { id: 'c', prerequisites: null },
    ],
    mastery: { a: 'Review due' },
    catalog: [{ id: 'lesson-a', skill: 'a', status: 'approved' }],
  });
  assert.deepEqual(out, [{ type: 'reuse', skill: 'a', lesson: 'lesson-a' }]);
});
test('generation budgets default off and account for reserved spend', () => {
  assert.equal(
    budgetAllows({ spent: 0, reserved: 0, requests: 0 }, 0.1, {
      enabled: false,
      maxSpend: 1,
      maxRequests: 5,
    }),
    false,
  );
  assert.equal(
    budgetAllows({ spent: 0.4, reserved: 0.5, requests: 1 }, 0.2, {
      enabled: true,
      maxSpend: 1,
      maxRequests: 5,
    }),
    false,
  );
  assert.equal(
    budgetAllows({ spent: 0.1, reserved: 0.1, requests: 1 }, 0.2, {
      enabled: true,
      maxSpend: 1,
      maxRequests: 5,
    }),
    true,
  );
});
test('candidate checks quarantine wrong arithmetic and require review', () => {
  const c = {
    version: 1,
    id: 'sum',
    objective: 'Add numbers',
    choices: ['5', '6'],
    answer: 0,
    verification: {
      type: 'arithmetic',
      left: 2,
      right: 3,
      operator: '+',
      expected: 5,
    },
  };
  assert.equal(inspectCandidate(c).status, 'needs_review');
  assert.equal(inspectCandidate({ ...c, answer: 1 }).status, 'quarantined');
  assert.throws(() => approveCandidate(c, {}));
  assert.equal(
    approveCandidate(c, {
      reviewerId: 'parent',
      answerChecked: true,
      languageChecked: true,
      curriculumChecked: true,
      at: 123,
    }).status,
    'approved',
  );
});
