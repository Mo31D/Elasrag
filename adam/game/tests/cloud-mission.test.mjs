import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import ts from 'typescript';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chooseSkill } from '../backend/supabase/functions/learning-api/lesson.js';
const temp = new URL('../.test-build/', import.meta.url);
await mkdir(temp, { recursive: true });
const source = await readFile(
  new URL('../src/cloud-mission.ts', import.meta.url),
  'utf8',
);
await writeFile(
  new URL('cloud-mission.mjs', temp),
  ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText,
);
const { playCloudLesson } = await import(new URL('cloud-mission.mjs', temp));
const fixture = {
  version: 1,
  template: 'feeling-detective-v1',
  title: 'The sealed envelope',
  word: 'curious',
  definition: 'Wanting to find out more.',
  example: 'I felt curious when I saw the envelope.',
  story: [
    'A sealed envelope lay on the table.',
    'A detective wanted to find out more.',
  ],
  question: 'Which word means: Wanting to find out more.',
  choices: ['curious', 'relieved', 'puzzled'],
  answer: 0,
  hint: 'Wanting to learn about something.',
  sentenceParts: [
    'I felt',
    'curious',
    'because',
    'I wanted to know what was inside.',
  ],
};
test('next skill routing prefers due reviews then new words, skipping practice not due', () => {
  const available = [{ id: 'a' }, { id: 'b' }],
    now = Date.now();
  assert.equal(
    chooseSkill(
      available,
      [
        {
          skill_id: 'a',
          state: 'Practising',
          next_review_at: new Date(now + 86400000).toISOString(),
        },
      ],
      [],
      now,
    ).id,
    'b',
  );
  assert.equal(
    chooseSkill(
      available,
      [
        {
          skill_id: 'a',
          state: 'Practising',
          next_review_at: new Date(now - 1).toISOString(),
        },
      ],
      [],
      now,
    ).id,
    'a',
  );
  assert.equal(
    chooseSkill([{ id: 'b' }], [], [{ skill_id: 'b', requires_id: 'a' }], now),
    undefined,
  );
});
test('approved data-driven mission hides the model during recall and submits vocabulary and sentence evidence', async () => {
  const win = new Window({ url: 'https://example.test' });
  globalThis.document = win.document;
  globalThis.window = win;
  const calls = [];
  let name;
  const hooks = {
    openDialog() {},
    closeDialog() {},
    setView() {},
    map() {},
    shell(html, place, nickname) {
      document.body.innerHTML = html;
      name = nickname;
    },
  };
  const gateway = {
    async request(action, data) {
      calls.push({ action, data });
      return {
        correct:
          data.kind === 'vocabulary'
            ? data.answer === 0
            : data.answer.join(',') === '0,1,2,3',
        xp: data.kind === 'vocabulary' ? 3 : 7,
        complete: data.kind === 'sentence',
      };
    },
  };
  assert.throws(
    () =>
      playCloudLesson(
        { status: 'pending_review', content: fixture },
        { id: 'student', nickname: 'Explorer' },
        hooks,
        gateway,
      ),
    /approved/,
  );
  playCloudLesson(
    { id: 'lesson', status: 'approved', content: fixture },
    { id: 'student', nickname: 'Explorer' },
    hooks,
    gateway,
  );
  const click = async (id) => {
    const b = document.querySelector('[data-cloud="' + id + '"]');
    assert.ok(b, 'control ' + id + ' exists');
    await b.onclick();
  };
  await click('continue');
  await click('continue');
  assert.ok(document.querySelector('h2'));
  await click('practice');
  assert.equal(document.querySelector('h2'), null);
  await click('answer:0');
  for (const n of [0, 1, 2, 3]) await click('part:' + n);
  await click('check');
  assert.match(document.body.textContent, /EXPEDITION COMPLETE/);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].data.studentId, 'student');
  assert.equal(calls[1].data.kind, 'sentence');
  assert.equal(name, 'Explorer');
});
