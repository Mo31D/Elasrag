import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import ts from 'typescript';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const temp = new URL('../.test-build/', import.meta.url);
await mkdir(temp, { recursive: true });
for (const file of ['main', 'content', 'audio']) {
  let text = await readFile(
    new URL('../src/' + file + '.ts', import.meta.url),
    'utf8',
  );
  text = text
    .replace(
      /import roadmap from ["']\.\.\/public\/data\/curriculum-roadmap\.json["'];/,
      'const roadmap=' +
        (await readFile(
          new URL('../public/data/curriculum-roadmap.json', import.meta.url),
          'utf8',
        )) +
        ';',
    )
    .replace(/import ["']\.\/style\.css["'];/, '')
    .replace(/from ["']\.\/content["']/, "from './content.mjs'")
    .replace(/from ["']\.\/audio["']/, "from './audio.mjs'")
    .replace(/from ["']\.\/visual-tools\.js["']/, "from '../src/visual-tools.js'")
    .replace(/from ["']\.\/daily-learning\.js["']/, "from '../src/daily-learning.js'")
    .replace(/from ["']\.\/progress\.js["']/, "from '../src/progress.js'");
  await writeFile(
    new URL(file + '.mjs', temp),
    ts.transpileModule(text, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
    }).outputText,
  );
}
const { validateLesson } = await import(new URL('content.mjs', temp));
test('lesson schema rejects executable shapes and malformed answers', () => {
  assert.equal(validateLesson({ version: 1 }), false);
  const x = {
    version: 1,
    id: 'garden-clue',
    title: 'Garden',
    subject: 'English',
    objective: 'Learn',
    year: 3,
    vocabulary: [],
    question: 'Why?',
    choices: ['a', 'b'],
    answer: 0,
    hint: 'Look',
  };
  assert.ok(validateLesson(x));
  assert.equal(validateLesson({ ...x, answer: 2 }), false);
  assert.equal(validateLesson({ ...x, choices: 'a' }), false);
  assert.equal(validateLesson({ ...x, id: '../script' }), false);
});
test('complete detective and maths journey in simulated DOM, including refresh and reward deduplication', async () => {
  const win = new Window({ url: 'http://example.test/adam/' });
  for (const key of [
    'document',
    'localStorage',
    'HTMLElement',
    'HTMLInputElement',
    'HTMLButtonElement',
    'Event',
  ])
    globalThis[key] = win[key];
  globalThis.window = win;
  globalThis.confirm = () => false;
  win.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  win.HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  class FakeAudio extends win.EventTarget {
    currentTime = 0;
    playbackRate = 1;
    src = '';
    paused = true;
    constructor(src) {
      super();
      this.src = src;
    }
    async play() {
      this.paused = false;
    }
    pause() {
      this.paused = true;
    }
  }
  globalThis.Audio = FakeAudio;
  document.body.innerHTML = '<div id="app"></div>';
  await import(new URL('main.mjs', temp));
  const click = (id) => {
    const b = document.querySelector(`[data-action="${id}"]`);
    assert.ok(b, `button ${id} exists`);
    assert.ok(!b.disabled, `button ${id} enabled`);
    b.click();
  };
  const tick = () => new Promise((r) => setImmediate(r));
  const text = () => document.querySelector('#app').textContent;
  const stored = () => JSON.parse(localStorage.getItem('ala-adventure-v1'));
  assert.ok(document.querySelectorAll('.adventure-card').length >= 4);
  assert.match(text(), /LESSON 01/);
  assert.match(text(), /MATHS QUEST/);
  assert.match(text(), /WORD COLLECTION/);
  assert.ok(document.querySelector('.adventure-card[data-action="mission"]'));
  assert.ok(document.querySelector('.adventure-card[data-action="maths"]'));
  assert.ok(document.querySelector('.adventure-card[data-action="words"]'));
  assert.ok(document.querySelector('.adventure-card[data-action="science"]'));
  assert.match(text(), /Begin investigation/);
  assert.match(text(), /Family missions/);
  click('mission');
  click('next');
  assert.match(text(), /inspect the empty stand/);
  click('clue-empty');
  assert.match(document.querySelector('dialog').textContent, /notice/);
  click('close');
  click('read');
  click('next');
  assert.match(text(), /A puzzling discovery/);
  click('notice-correct');
  assert.match(text(), /choose Read instead first/);
  click('read');
  click('notice-wrong');
  click('notice-correct');
  assert.match(text(), /Follow the golden trail/);
  click('read');
  click('investigate-correct');
  assert.match(text(), /Inspect the glitter/);
  click('clue-glitter');
  click('close');
  click('clue-cloth');
  click('close');
  click('investigate-correct');
  assert.match(text(), /A worry disappears/);
  click('read');
  click('relieved-correct');
  assert.match(text(), /Repair the detective report/);
  for (const n of [2, 3, 1, 0]) click('block-' + n);
  click('sentence-check');
  assert.match(text(), /One last memory check/);
  for (const [w, a] of [
    ['notice', 0],
    ['puzzled', 1],
    ['investigate', 2],
    ['relieved', 0],
  ]) {
    click(`recall-${w}-${a}-mission`);
    click('recall-next-mission');
  }
  assert.match(text(), /STAR DETECTIVE/);
  assert.ok(stored().profiles.explorer.missions.trophy);
  const earned = stored().profiles.explorer.xp;
  assert.equal(earned, 20);
  assert.equal(stored().missionStep, 6);
  click('map');
  click('mission');
  assert.equal(stored().profiles.explorer.xp, earned);
  click('map');
  // Reload the module as a fresh application, keeping persisted local state.
  await import(new URL('main.mjs?reload=1', temp));
  assert.match(text(), /Reopen case/);
  click('maths');
  assert.match(text(), /Small steps/);
  click('engine-0');
  const answer = document.querySelector('#math-answer');
  answer.value = '70';
  document
    .querySelector('#math-form')
    .dispatchEvent(new win.Event('submit', { cancelable: true }));
  assert.match(text(), /make the question clearer/);
  answer.value = '700';
  document
    .querySelector('#math-form')
    .dispatchEvent(new win.Event('submit', { cancelable: true }));
  assert.match(text(), /hundreds column/);
  const after = stored().profiles.explorer.xp;
  document
    .querySelector('#math-form')
    .dispatchEvent(new win.Event('submit', { cancelable: true }));
  assert.equal(stored().profiles.explorer.xp, after);
  click('extension');
  document.querySelector('#math-answer').value = '8000';
  document
    .querySelector('#math-form')
    .dispatchEvent(new win.Event('submit', { cancelable: true }));
  assert.match(text(), /new problem/);
  for (const [index, value] of [
    [1, '4'],
    [2, '15'],
    [3, '10'],
    [4, '250'],
    [5, '60'],
  ]) {
    click('engine-' + index);
    document.querySelector('#math-answer').value = value;
    document
      .querySelector('#math-form')
      .dispatchEvent(new win.Event('submit', { cancelable: true }));
  }
  assert.equal(stored().maths.length, 6);
  click('map');
  click('parent');
  assert.match(document.querySelector('dialog').textContent, /Reward Credits/);
  assert.match(document.querySelector('dialog').textContent, /Disabled/);
  click('profiles');
  document.querySelector('#explorer-name').value = 'Joseph';
  document.querySelector('#explorer-year').value = '4';
  document
    .querySelector('#profile-form')
    .dispatchEvent(new win.Event('submit', { cancelable: true }));
  assert.match(text(), /Welcome, Joseph/);
  assert.equal(stored().profiles[stored().activeProfile].xp, 0);
  click('maths');
  click('engine-0');
  assert.match(text(), /Value of 7/);
  document.querySelector('#math-answer').value = '700';
  document
    .querySelector('#math-form')
    .dispatchEvent(new win.Event('submit', { cancelable: true }));
  assert.match(text(), /hundreds column/);
  click('engine-1');
  assert.match(text(), /24 ÷ 6/);
  click('engine-2');
  assert.match(text(), /3\/4 of 20/);
  click('map');
  click('mission');
  assert.match(text(), /recording addresses Adam/);
  click('map');
  click('parent');
  click('profiles');
  click('profile:explorer');
  assert.match(text(), /Welcome, Adam/);
  assert.equal(stored().maths.length, 6);
  click('daily');
  assert.match(text(),/A little learning/);
  click('map');click('maths');click('beacon');click('beacon-next');
  const submitBeacon=value=>{document.querySelector('#beacon-answer').value=value;document.querySelector('#beacon-form').dispatchEvent(new win.Event('submit',{cancelable:true}));};
  submitBeacon('12');assert.match(text(),/Try again when ready/);submitBeacon('400');click('beacon-next');
  const {beaconExample}=await import('../src/daily-learning.js');submitBeacon(String(beaconExample(2).answer));click('beacon-next');submitBeacon(String(beaconExample(3).answer));
  assert.ok(stored().profiles.explorer.daily.completed.includes('maths'));
  click('daily');click('daily-words');assert.match(document.querySelector('dialog').textContent,/Recall trail/);
  for(let i=0;i<3;i++){
    click('notebook-help');const term=document.querySelector('#notebook-feedback').textContent.split(':')[0];
    click('notebook-choice:'+term);assert.match(document.querySelector('#notebook-feedback').textContent,/Supported practice saved/);click('notebook-next');
  }
  assert.ok(stored().profiles.explorer.daily.completed.includes('words'));
  click('daily');click('daily-words');
  for(let i=0;i<3;i++){
    click('notebook-help');const term=document.querySelector('#notebook-feedback').textContent.split(':')[0];
    document.querySelector('#notebook-spelling').value=term;
    document.querySelector('#notebook-answer').dispatchEvent(new win.Event('submit',{cancelable:true}));click('notebook-next');
  }
  click('daily');click('daily-words');
  for(let i=0;i<3;i++){
    const n=document.querySelectorAll('[data-action^="notebook-part:"]').length;
    for(let part=n-1;part>=0;part--)click('notebook-part:'+part);
    click('notebook-check');assert.match(document.querySelector('#notebook-feedback').textContent,/practice saved/);click('notebook-next');
  }
  click('daily');click('journal');assert.match(document.querySelector('dialog').textContent,/Start a short recall/);
  await tick();
});
