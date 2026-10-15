import './style.css';
import roadmap from '../public/data/curriculum-roadmap.json';
import {
  words,
  chapters,
  puzzles as year6Puzzles,
  starterPuzzles,
  skills,
  validateLesson,
  type LessonPackage,
} from './content';
import {
  fresh,
  load,
  KEY,
  reward,
  evidence,
  status,
  createProfile,
  switchProfile,
  captureRun,
  recordEvent,
} from './progress.js';
import {
  narration,
  segment,
  stop,
  replay,
  mediaStore,
  setAudio,
} from './audio';
function currentPuzzles() {
  return starterPuzzles(profile().year ?? 6);
}
const app = document.querySelector<HTMLDivElement>('#app')!;
const storage: Pick<Storage, 'getItem' | 'setItem'> = (() => {
  try {
    return window.localStorage;
  } catch {
    return {
      getItem: (_key: string) => null,
      setItem: () => {
        throw new Error('Storage unavailable');
      },
    };
  }
})();
let state: any = load(storage),
  view = 'map',
  listenDone = false,
  hinted = false,
  mathIndex = 0,
  mathExtension = false,
  mathSolved = false;
let recallWords = words,
  chosen: string[] = [],
  reviewIndex = 0,
  reviewHinted = false,
  returnFocus: HTMLElement | null = null,
  custom: LessonPackage | null = null;
let cloudMissions: { id: string; title: string }[] = [];
try {
  const c = JSON.parse(storage.getItem('ala-lesson') || 'null');
  if (validateLesson(c)) custom = c;
} catch {}
const esc = (s: unknown) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
const icon = (id: string) => {
  const common =
    'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const paths: Record<string, string> = {
    glass:
      '<circle cx="26" cy="26" r="17"/><path d="M39 39L55 55M18 23Q23 14 30 18"/>',
    eye: '<path d="M4 32Q32 0 60 32Q32 64 4 32Z"/><circle cx="32" cy="32" r="10"/>',
    puzzled:
      '<circle cx="32" cy="34" r="23"/><path d="M17 23L25 26M39 26L47 23M23 44Q32 37 41 44"/><circle cx="23" cy="32" r="1"/><circle cx="41" cy="32" r="1"/>',
    relieved:
      '<circle cx="32" cy="32" r="24"/><path d="M16 28Q22 20 28 28M36 28Q42 20 48 28M20 40Q32 54 44 40"/>',
    book: '<path d="M7 10H26Q32 10 32 17Q32 10 39 10H57V51H39Q32 51 32 57Q32 51 25 51H7ZM32 17V54M15 22H24M15 31H24M40 22H50M40 31H50"/>',
    star: '<path d="M32 5L40 23 60 25 45 39 49 59 32 49 15 59 19 39 4 25 24 23Z"/>',
    map: '<path d="M5 15L23 7 42 16 59 8V49L42 57 23 49 5 57ZM23 7V49M42 16V57"/>',
    gear: '<circle cx="32" cy="32" r="11"/><path d="M25 5H39L42 15 53 18 59 30 52 38 51 50 39 56 30 50 18 53 8 42 13 31 8 21 19 12Z"/>',
    trophy:
      '<path d="M18 8H46V24Q46 38 32 40Q18 38 18 24ZM18 14H7V24Q7 35 22 35M46 14H57V24Q57 35 42 35M32 40V53M20 56H44"/>',
    crystal:
      '<path d="M32 4L51 19 56 43 32 60 8 43 13 19ZM32 4L23 25 32 60 42 25ZM13 19L23 25 42 25 51 19"/>',
    sound:
      '<path d="M8 24H20L34 12V52L20 40H8ZM43 23Q53 32 43 41M49 14Q66 32 49 50"/>',
    pause: '<path d="M21 13V51M43 13V51"/>',
    play: '<path d="M20 10L53 32 20 54Z"/>',
    check: '<path d="M10 33L25 48 55 16"/>',
  };
  return `<svg ${common}>${paths[id] || paths.glass}</svg>`;
};
function save() {
  captureRun(state);
  try {
    storage.setItem(KEY, JSON.stringify(state));
  } catch {
    toast(
      'This browser cannot save progress. Export a backup from the parent desk.',
    );
  }
}
function profile() {
  return state.profiles[state.activeProfile];
}
function xp(id: string, amount: number) {
  const n = reward(state, id, amount);
  save();
  if (n) toast(`+${n} XP · Adventure progress saved`);
}
function toast(text: string) {
  let t = document.querySelector('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.setAttribute('role', 'status');
    document.body.append(t);
  }
  t.textContent = text;
  setTimeout(() => t?.remove(), 4500);
}
function button(id: string, label: string, cls = '') {
  return `<button data-action="${id}" class="${cls}">${label}</button>`;
}
function shell(
  content: string,
  place: string,
  displayName = profile().displayName || 'Adam',
) {
  app.innerHTML = `<main class="game ${view}" ${!state.settings.motion ? 'data-still="true"' : ''}><header class="hud"><button class="identity" data-action="map" aria-label="Adventure map"><span class="crest">A</span><span>${esc(displayName)}<span class="sub">LEARNING ADVENTURES</span></span></button><div class="place"><span class="dot"></span>${place}</div><div class="hud-actions"><span class="xp">${icon('star')} <b>${profile().xp}</b> XP <small>LV ${1 + Math.floor(profile().xp / 25)}</small></span>${button('journal', icon('book'), 'icon-btn')}${button('settings', icon('gear'), 'icon-btn')}</div></header>${content}<footer class="game-footer"><span>THE ADVENTURE ATLAS <i>✦</i> CHAPTER ONE</span><div>${button('parent', 'Parent desk', 'quiet')}${button('fullscreen', '⛶ Full screen', 'quiet')}</div></footer></main><dialog id="overlay" aria-labelledby="dialog-title"></dialog>`;
  document
    .querySelector('[data-action="journal"]')
    ?.setAttribute('aria-label', 'Detective notebook');
  document
    .querySelector('[data-action="settings"]')
    ?.setAttribute('aria-label', 'Settings');
  bind();
}
function map() {
  stop();
  view = 'map';
  const done = profile().missions.trophy;
  shell(
    `<section class="atlas" aria-label="Adventure world map"><img class="atlas-art" src="/adam/assets/atlas.svg" alt="Floating islands connected by a trail of light, with a school and a crystal tower"><div class="map-heading"><p class="eyebrow">YOUR NEXT DISCOVERY AWAITS</p><h1>A little curiosity.<br>A whole new world.</h1><p>Welcome, ${esc(profile().displayName || 'Adam')}! Your adventure is about to begin.</p></div><div class="map-label school"><span class="region">01 / MYSTERY CITY</span><h2>The missing trophy</h2><p>${done ? 'Case solved. Revisit the evidence.' : 'A curious gap. A golden trail. One school mystery.'}</p>${button('mission', `${done ? 'Reopen case' : state.missionStep ? 'Continue investigation' : 'Begin investigation'} <span>→</span>`, 'primary')}<small>ENGLISH · 5–15 MIN · ${done ? '✓ STAR DETECTIVE' : '4 WORDS TO DISCOVER'}</small></div><div class="map-label tower"><span class="region">02 / NUMBER KINGDOM</span><h2>The crystal engines</h2><p>Restore three engines with mathematical reasoning.</p>${button('maths', 'Explore the engines →', 'secondary')}<small>YEAR ${profile().year || 6} · ${state.maths.length}/3 ENGINES RESTORED</small></div><div class="map-compass">N<br><span>✧</span><br>S</div><div class="map-bottom">${button('reviews', `${icon('book')} ${dueSkills().length ? 'Recall trail · ' + dueSkills().length + ' due' : 'Recall trail · practise words'}`, 'map-chip')}${custom ? button('custom', `Imported quest · ${esc(custom.title)}`, 'map-chip') : ''}${cloudMissions.length ? cloudMissions.map((mission) => button('cloud-mission:' + mission.id, `English expedition · ${esc(mission.title)}`, 'map-chip')).join('') : button('cloud', 'Secure missions · parent sign-in', 'map-chip')}<span class="future">Discovery Laboratory · a future expedition</span></div></section>`,
    'The Adventure Atlas',
  );
}
function dueSkills() {
  return words.filter((w) => status(profile().skills[w.id]) === 'Review due');
}
function storyStep() {
  return Math.max(0, Math.min(6, Math.trunc(state.missionStep) || 0));
}
function mission() {
  recordEvent(state, 'scene_entered', { mission: 'trophy' });
  stop();
  view = 'mission';
  listenDone = false;
  hinted = false;
  chosen = [];
  const step = storyStep();
  const scene = step <= 1 ? step : step === 2 ? 2 : 3;
  const titles = [
    'Inspect the cabinet',
    'A puzzling discovery',
    'Follow the golden trail',
    'A worry disappears',
    'Repair the detective report',
    'One last memory check',
    'Case closed',
  ];
  const objectives = [
    'Examine the cabinet. What is unusual?',
    'Explain what Maya and Leo noticed.',
    'Collect two clues and decide where to investigate.',
    'Use the evidence to explain how the detectives feel.',
    'Build a complete sentence that explains a feeling.',
    'Apply the four words in new situations.',
    'The trophy is safe. Your evidence solved the case.',
  ];
  let content = '';
  if (step === 0)
    content = `<div class="hotspot empty" >${button('clue-empty', `${icon('glass')}<span>Inspect empty stand</span>`, 'spot')}</div><div class="hotspot poster">${button('clue-poster', 'Examine noticeboard', 'spot small')}</div>`;
  if (step === 2)
    content = `<div class="hotspot glitter">${button('clue-glitter', `${icon('glass')}<span>Inspect gold glitter</span>`, 'spot')}</div><div class="hotspot cloth">${button('clue-cloth', 'Examine polishing cloth', 'spot')}</div><div class="hotspot window">${button('clue-window', 'Examine window', 'spot small')}</div>`;
  if (step === 3)
    content = `<div class="hotspot trophy">${button('clue-trophy', `${icon('trophy')}<span>Inspect the trophy</span>`, 'spot')}</div>`;
  const c = chapters[Math.min(step, 5)];
  shell(
    `<section class="mission-stage"><img class="scene-art" src="/adam/assets/scene-${scene}.svg" alt="${['Maya and Leo beside the trophy cabinet, where a green stand is empty', 'Maya and Leo looking puzzled beside the cabinet', 'The detectives investigate a golden glitter trail', 'Mr Clark with the safe trophy and a polishing cloth'][scene]}"><div class="scene-vignette"></div><div class="quest-banner"><span>CASE 001 <i>✦</i> ${step < 6 ? `STEP ${step + 1} / 6` : 'COMPLETE'}</span><h1>${titles[step]}</h1><p>${objectives[step]}</p><progress max="6" value="${step}" aria-label="Mission progress"></progress></div><aside class="inventory-rail"><span>EVIDENCE</span>${['empty', 'glitter', 'cloth', 'trophy'].map((k) => `<div class="evidence-slot ${state.clues.includes(k) ? 'found' : ''}" title="${k}">${icon(k === 'trophy' ? 'trophy' : 'glass')}<small>${state.clues.includes(k) ? '✓' : '?'}</small></div>`).join('')}</aside>${content}<div id="word-cue" class="word-cue" hidden></div><div class="mission-bottom"><div class="audio-bar">${step < 5 ? button('listen', `${icon('play')} Hear the story`, 'audio-btn') : ''}${step < 5 ? button('pause', icon('pause'), 'icon-btn') : ''}<span id="audio-status" role="status">${step < 5 ? (profile().displayName === 'Adam' ? 'Original British narration · scene summary below' : 'Original recording addresses Adam · personalised text available') : 'Think, explore, and take your time'}</span>${step < 5 ? button('read', 'Read instead', 'quiet') : ''}</div><div class="dialogue"><div class="speaker-avatar">${icon(step === 6 ? 'trophy' : 'glass')}</div><div><span class="eyebrow">${step === 6 ? 'ADVENTURE ACADEMY' : 'DETECTIVE CLUB'}</span><p id="caption">${step < 5 ? c.caption : step === 5 ? 'The words can help with other mysteries too. Ready to try?' : 'You used careful observation and explained your reasoning.'}</p><div id="task">${taskMarkup(step)}</div><p id="feedback" class="feedback" role="status"></p></div></div></div></section>`,
    'Mystery City / School',
  );
  if (step === 5) {
    reviewIndex = 0;
    recallWords = words;
    renderRecall(false);
  }
  if (step === 6) {
    complete();
  }
}
function taskMarkup(step: number) {
  if (step === 0)
    return `<p class="task-note">Start with the story, or read the caption. Then examine the empty stand.</p>${button('next', 'Follow the mystery →', 'primary')}`;
  if (step === 1)
    return `<p class="task-note">What did they notice? You can say your idea aloud, think it, or choose below. There is no hurry.</p><div class="choices">${button('notice-correct', 'The empty trophy stand')}${button('notice-wrong', 'A broken window')}</div>`;
  if (step === 2)
    return `<p class="task-note">Find the glitter and the cloth, then choose your next move.</p><div class="choices">${button('investigate-correct', 'Investigate the art room')}${button('investigate-wrong', 'Decide it was stolen without checking')}</div>`;
  if (step === 3)
    return `<p class="task-note">The trophy is safe. How do they feel now?</p><div class="choices">${button('relieved-correct', 'Relieved')}${button('relieved-wrong', 'Puzzled')}</div>`;
  if (step === 4)
    return `<p class="task-note">Tap the blocks in order. Tap a chosen block to return it.</p><div id="sentence-output" class="sentence-output" aria-label="Your sentence"></div><div id="blocks" class="blocks">${['the trophy was safe.', 'because', 'I felt', 'relieved'].map((x, i) => button('block-' + i, x)).join('')}</div><div class="choices">${button('sentence-check', 'Seal the report', 'primary')}${button('sentence-hint', 'Show a model', 'quiet')}</div><p class="task-note">Optional: tell someone about a time you felt relieved, or think of a sentence. No recording or speech scoring.</p>`;
  if (step === 6)
    return `<div class="award-title">${icon('trophy')} STAR DETECTIVE</div><p>Your notebook now holds four useful words. Return on another day to recall them.</p>${button('map', 'Return to the atlas →', 'primary')}`;
  return '';
}
function feedback(s: string) {
  const p = document.querySelector('#feedback');
  if (p) p.textContent = s;
}
function readReady() {
  listenDone = true;
  const s = document.querySelector('#audio-status');
  if (s) s.textContent = 'Story ready · explore at your own pace';
}
function next() {
  const step = storyStep();
  if (step === 0 && (!state.clues.includes('empty') || !listenDone)) {
    feedback(
      'Hear the story or choose Read instead, then inspect the empty stand.',
    );
    return;
  }
  stop();
  state.missionStep = Math.min(6, step + 1);
  save();
  mission();
}
function complete() {
  const p = profile();
  if (!p.missions.trophy)
    recordEvent(state, 'mission_completed', { mission: 'trophy' });
  p.missions.trophy = true;
  xp('mission:trophy', state.settings.missionXP);
  save();
}
function openDialog(title: string, body: string) {
  stop();
  returnFocus = document.activeElement as HTMLElement;
  const d = document.querySelector<HTMLDialogElement>('#overlay')!;
  d.innerHTML = `<div class="modal-head"><span class="eyebrow">ADVENTURE ACADEMY</span>${button('close', '✕', 'close')}</div><h2 id="dialog-title">${title}</h2>${body}`;
  d.showModal();
  d.querySelector<HTMLButtonElement>('.close')?.focus();
  bind(d);
}
function closeDialog() {
  const d = document.querySelector<HTMLDialogElement>('#overlay');
  d?.close();
  returnFocus?.focus();
}
function wordCard(id: string) {
  const w = words.find((w) => w.id === id)!;
  openDialog(
    w.label,
    `<div class="word-illustration">${icon(w.icon)}</div><p class="definition">${w.definition}</p><blockquote>${w.example}</blockquote><div class="choices">${button('hear-' + id, `${icon('sound')} Hear in the original story`, 'secondary')}${button('slow-' + id, 'Gentler replay', 'quiet')}</div><p class="muted">You may try saying it, think it, or simply listen. Take as long as you like.</p>${button('close', 'Back to the investigation →', 'primary')}`,
  );
}
function journal() {
  openDialog(
    'Detective notebook',
    `<p>Evidence and words collected on this device.</p><div class="journal-grid">${words.map((w) => `<button class="journal-word" data-action="word-${w.id}">${icon(w.icon)}<strong>${w.label}</strong><small>${status(profile().skills[w.id])}</small></button>`).join('')}</div><h3>Evidence pouch</h3><p>${state.clues.length ? state.clues.map((k: string) => ({ empty: 'Empty trophy stand', glitter: 'Gold glitter trail', cloth: 'Polishing cloth', trophy: 'Trophy safe with Mr Clark' })[k as string] || k).join(' · ') : 'Your first clue is waiting at the school.'}</p><p class="muted">Mastery needs independent answers and later recall. Listening alone earns no mastery.</p>`,
  );
}
function renderRecall(review: boolean) {
  const list = recallWords;
  const w = list[reviewIndex];
  if (!w) {
    if (review) {
      closeDialog();
      toast('Recall trail complete. Your next review has been scheduled.');
      map();
    } else {
      next();
    }
    return;
  }
  reviewHinted = false;
  const body = `<p class="eyebrow">RECALL ${reviewIndex + 1} / ${list.length}</p><p class="recall-question">${w.recall}</p><div class="choices">${w.choices.map((c, i) => button(`recall-${w.id}-${i}-${review ? 'review' : 'mission'}`, c)).join('')}</div>${button('recallhint-' + w.id, 'I need a clue', 'quiet')}<p id="recall-feedback" role="status"></p>`;
  if (review) openDialog('The recall trail', body);
  else document.querySelector('#task')!.innerHTML = body;
  bind(
    review
      ? document.querySelector('#overlay')!
      : document.querySelector('#task')!,
  );
}
function maths(index = 0) {
  stop();
  view = 'maths';
  mathIndex = index;
  mathSolved = false;
  hinted = false;
  mathExtension = false;
  drawMaths();
}
function mathsModel(model: string) {
  if (model === 'halves')
    return '<div class="ratio-model" aria-label="Four equal pieces; two coloured"><span class="quarter lit"></span><span class="quarter lit"></span><span class="quarter"></span><span class="quarter"></span></div><p>Two quarters cover the same amount as one half.</p>';
  if (model === 'groups')
    return (
      '<div class="group-model" aria-label="Four boxes of six crystals">' +
      Array.from({ length: 4 }, () => '<span>● ● ●<br>● ● ●</span>').join('') +
      '</div>'
    );
  if (model === 'sequence')
    return '<div class="machine"><span>4</span><b>+4</b><span>8</span><b>+4</b><span>12</span></div>';

  if (model === 'fraction')
    return `<div class="fraction-model" aria-label="24 equal pieces, 18 coloured">${Array.from({ length: 24 }, (_, i) => `<button class="piece ${i < 18 ? 'lit' : ''}" data-action="piece" aria-label="Piece ${i + 1}, ${i < 18 ? 'coloured' : 'uncoloured'}" aria-pressed="${i < 18}"></button>`).join('')}</div><p class="muted">Explore the pieces by tapping them. Reset restores 18 of 24.</p>${button('model-reset', 'Reset pieces', 'quiet')}`;
  if (model === 'ratio')
    return `<div class="ratio-model" aria-label="2 amber parts and 3 blue parts">${[0, 1, 2, 3, 4].map((i) => `<span class="crystal ${i < 2 ? 'amber' : ''}">${icon('crystal')}</span>`).join('')}</div><p>2 amber parts + 3 blue parts = 5 equal parts</p>`;
  return `<div class="machine"><span>?</span><b>× 3</b><b>+ 5</b><span>26</span></div><p>Input → multiply → add → output</p>`;
}
function drawMaths() {
  const p = currentPuzzles()[mathIndex];
  shell(
    `<section class="engine-world"><div class="engine-mountains"></div><div class="engine-heading"><span class="eyebrow">NUMBER KINGDOM / ENGINE ${mathIndex + 1} OF 3</span><h1>${p.name}</h1><p>Make the crystals glow. Take any route that helps you reason.</p></div><div class="engine-layout"><div class="engine-art"><div class="giant-crystal ${state.maths.includes(p.id) ? 'restored' : ''}">${icon('crystal')}</div><div class="engine-pedestal"></div><span>${state.maths.includes(p.id) ? 'ENGINE RESTORED' : 'AWAITING YOUR SIGNAL'}</span><div class="engine-selector">${currentPuzzles()
      .map((q, i) =>
        button(
          'engine-' + i,
          `${state.maths.includes(q.id) ? '✓' : i + 1}`,
          'engine-node ' + (i === mathIndex ? 'active' : ''),
        ),
      )
      .join(
        '',
      )}</div></div><section class="puzzle-panel"><span class="eyebrow">YEAR ${profile().year || 6} / ${p.id.toUpperCase()}</span><h2>${p.prompt}</h2><p id="math-question">${p.question}</p><div id="math-model">${mathsModel(p.model)}</div><form id="math-form"><label for="math-answer">Your answer</label><div class="answer-row"><input id="math-answer" autocomplete="off" maxlength="20" aria-describedby="math-question" placeholder="${p.model === 'fraction' || p.model === 'halves' ? 'e.g. 1/2' : 'Enter a number'}"><button class="primary">Activate engine →</button></div></form><div class="choices">${button('math-hint', 'Help me reason', 'quiet')}${button('math-language', 'Explain the question', 'quiet')}</div><p id="feedback" class="feedback" role="status"></p><div id="math-next"></div></section></div></section>`,
    'Number Kingdom / Crystal engines',
  );
  document.querySelector('#math-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    checkMath();
  });
}
function checkMath() {
  const p = currentPuzzles()[mathIndex],
    input = document
      .querySelector<HTMLInputElement>('#math-answer')!
      .value.replace(/\s/g, '');
  const answer = mathExtension ? p.extensionAnswer : p.answer;
  if (input !== answer) {
    hinted = true;
    feedback(`Try another way. ${p.hint}`);
    evidence(state, p.id, false);
    save();
    return;
  }
  evidence(state, p.id, true, hinted);
  if (!mathExtension) {
    if (!state.maths.includes(p.id)) state.maths.push(p.id);
    xp('engine:' + p.id, state.settings.missionXP);
    if (!hinted) xp('independent:' + p.id, state.settings.independentXP);
  } else if (!hinted) xp('extension:' + p.id, state.settings.applicationXP);
  mathSolved = true;
  save();
  feedback(
    `${mathExtension ? 'You applied the method in a new problem. ' : ''}${mathExtension ? p.extensionExplain : p.explain}`,
  );
  document.querySelector('.giant-crystal')?.classList.add('restored');
  document.querySelector('#math-next')!.innerHTML =
    `${!mathExtension ? button('extension', 'Try a stretch puzzle', 'secondary') : ''}${button('engine-' + ((mathIndex + 1) % 3), mathIndex === 2 ? 'Revisit the first engine' : 'Next engine →', 'primary')}${button('map', 'Return to atlas', 'quiet')}`;
  bind(document.querySelector('#math-next')!);
}
function download(name: string, value: unknown) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }),
  );
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function parent() {
  openDialog(
    'Parent desk',
    `${button('profiles', 'Choose or add an explorer', 'secondary')}${button('cloud', 'Secure family learning', 'secondary')}<p class="muted">Progress and imported files stay in this browser on this device. Clearing browser data removes them. This screen has no authentication; anyone using this device can open it. Export private backups when needed.</p><div class="parent-stats"><div><b>${profile().xp}</b><span>Adventure XP</span></div><div><b>${state.maths.length}/3</b><span>Maths engines</span></div><div><b>Disabled</b><span>Reward Credits</span></div></div>${button('curriculum', 'Explore Year 1–6 planning map', 'secondary')}<details open><summary>Skill evidence and review schedule</summary><div class="skill-table"><table><thead><tr><th>Skill</th><th>State</th><th>Independent days</th><th>Next review</th></tr></thead><tbody>${[
      ...skills.filter((s) => s.subject === 'English'),
      ...currentPuzzles().map((p) => ({
        id: p.id,
        stage: 'Year ' + (profile().year || 6),
      })),
    ]
      .map((s) => {
        const v = profile().skills[s.id];
        return `<tr><td>${esc(s.id)}<small>${esc(s.stage)}</small></td><td>${status(v)}</td><td>${v?.independent || 0}</td><td>${v?.due ? new Date(v.due).toLocaleDateString('en-GB') : 'Not scheduled'}</td></tr>`;
      })
      .join(
        '',
      )}</tbody></table></div><p class="muted">Review intervals: 1, 3, 7, 14, 30 days. Secure requires at least four independent days including three later reviews. A clue or correction records supported practice. This is learning evidence, not a formal assessment. Word checks assess meaning in context; independent spoken or written vocabulary use has not been assessed.</p></details><details><summary>Original narration and audio import</summary><p>The supplied narrator is bundled (160.4 seconds). A replacement is local only and must be the same recording. Source cue positions remain provisional until checked by listening.</p><label>Choose original WAV or MP3<input type="file" id="audio-file" accept="audio/wav,audio/mpeg"></label><p id="upload-feedback" role="status"></p><div class="choices">${words.map((w) => button('hear-' + w.id, esc(w.label), 'quiet')).join('')}</div></details><details><summary>Import a lesson and preview</summary><p>Version 1 supports local text and vocabulary quests with one decision challenge. Images, multi-scene audio authoring and online publishing are future work.</p>${button('template', 'Download lesson template', 'secondary')}<label>Lesson JSON (up to 100 KB)<input id="lesson-file" type="file" accept=".json,application/json"></label><div id="lesson-preview"></div></details><details><summary>Adventure reward settings</summary><p>XP is separate from mastery. Repeat completions cannot farm XP. Reward Credits and device control are disabled.</p><form id="xp-form"><label>Mission XP<input id="mission-xp" type="number" min="0" max="50" value="${state.settings.missionXP}"></label><label>Independent understanding XP<input id="independent-xp" type="number" min="0" max="20" value="${state.settings.independentXP}"></label><label>New application XP<input id="application-xp" type="number" min="0" max="20" value="${state.settings.applicationXP}"></label><button class="secondary">Save XP rules</button></form></details><details><summary>Local learning activity</summary><p>${profile().events?.filter((e: any) => e.at >= Date.now() - 7 * 86400000).length || 0} learning events in the last 7 days. ${(profile().events || []).filter((e: any) => e.type === 'skill_attempted' && e.correct).length} correct recorded skill attempts.</p><p class="muted">At most 500 events per explorer are kept. Active-time estimates count only short intervals between learning actions while visible; they are not surveillance or proof of attention.</p><div class="event-list">${(
      profile().events || []
    )
      .slice(-15)
      .reverse()
      .map(
        (e: any) =>
          `<p><small>${new Date(e.at).toLocaleString('en-GB')} · ${esc(e.type)} ${esc(e.skill || e.mission || '')}</small></p>`,
      )
      .join(
        '',
      )}</div></details><details><summary>Private backup and device data</summary>${button('export-progress', 'Export private progress', 'secondary')}${button('delete-progress', 'Reset local progress', 'quiet')}<p>No child account, microphone access, advertising, trackers or cloud synchronisation. Speaking practice is optional and is never scored. Support for a stammer itself should be guided by a qualified speech and language therapist.</p></details>`,
  );
  document
    .querySelector('#audio-file')!
    .addEventListener('change', audioImport);
  document
    .querySelector('#lesson-file')!
    .addEventListener('change', lessonImport);
  document.querySelector('#xp-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    for (const [id, key] of [
      ['mission-xp', 'missionXP'],
      ['independent-xp', 'independentXP'],
      ['application-xp', 'applicationXP'],
    ])
      state.settings[key] = Number(
        (document.getElementById(id) as HTMLInputElement).value,
      );
    save();
    toast('XP rules saved for future achievements.');
  });
}
async function audioImport(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  const msg = document.querySelector('#upload-feedback')!;
  if (f.size > 20 * 1024 * 1024) {
    msg.textContent = 'Choose an audio file smaller than 20 MB.';
    return;
  }
  const url = URL.createObjectURL(f),
    test = new Audio(url);
  test.onloadedmetadata = async () => {
    if (Math.abs(test.duration - 160.4) > 2) {
      msg.textContent =
        'This is a different timeline. Choose the original 160.4-second recording.';
      URL.revokeObjectURL(url);
      return;
    }
    try {
      await mediaStore(f);
      setAudio(url);
      msg.textContent = 'Original narration saved locally in this browser.';
    } catch {
      URL.revokeObjectURL(url);
      msg.textContent =
        'Audio could not be saved. The bundled narrator remains available.';
    }
  };
  test.onerror = () => {
    URL.revokeObjectURL(url);
    msg.textContent = 'This audio format could not be read.';
  };
}
async function lessonImport(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  const box = document.querySelector('#lesson-preview')!;
  try {
    if (f.size > 100000) throw Error('Choose a JSON file under 100 KB.');
    const v = JSON.parse(await f.text());
    if (!validateLesson(v))
      throw Error(
        'Invalid lesson package. Use the downloadable version 1 template.',
      );
    box.innerHTML = `<h3>${esc(v.title)}</h3><p>${esc(v.objective)}</p><p>${esc(v.question)}</p><p>Year ${v.year} · ${v.vocabulary.length} words · ${v.choices.length} choices</p><button class="primary" id="save-lesson">Save locally and play</button>`;
    box.querySelector('#save-lesson')!.addEventListener('click', () => {
      try {
        storage.setItem('ala-lesson', JSON.stringify(v));
        custom = v;
        closeDialog();
        customQuest();
      } catch {
        box.textContent = 'Storage is unavailable. Nothing was saved.';
      }
    });
  } catch (err) {
    box.textContent = String((err as Error).message);
  }
}
function customQuest() {
  if (!custom) return;
  view = 'custom';
  shell(
    `<section class="custom-world"><span class="eyebrow">LOCAL IMPORTED QUEST · YEAR ${custom.year}</span><h1>${esc(custom.title)}</h1><p>${esc(custom.objective)}</p><div class="puzzle-panel"><div class="custom-vocab">${custom.vocabulary.map((w) => `<p><b>${esc(w.word)}</b> ${esc(w.definition)}</p>`).join('')}</div><h2>${esc(custom.question)}</h2><div class="choices">${custom.choices.map((c, i) => button('custom-answer-' + i, esc(c))).join('')}</div>${button('custom-hint', 'Hint', 'quiet')}<p id="feedback" role="status"></p>${button('map', 'Return to atlas', 'secondary')}</div></section>`,
    'Imported expedition',
  );
}
function settings() {
  openDialog(
    'Make yourself comfortable',
    `<div class="settings-list">${button('sound', `${state.settings.sound ? '✓' : '○'} Story sound ${state.settings.sound ? 'on' : 'off'}`, 'secondary')}${button('motion', `${state.settings.motion ? '✓' : '○'} Gentle movement ${state.settings.motion ? 'on' : 'off'}`, 'secondary')}${button('break', 'Take a break', 'secondary')}</div><p>There are no speaking timers. Use sound, captions, touch or keyboard at your own pace. Press Escape to close an overlay.</p>`,
  );
}
function bind(root: ParentNode = app) {
  root
    .querySelectorAll<HTMLButtonElement>('button[data-action]')
    .forEach((b) => {
      b.onclick = () => action(b.dataset.action!, b);
    });
}
let lastLearningAction = 0;
function cloudHooks() {
  return {
    openDialog,
    closeDialog,
    shell,
    map,
    setView: (v: string) => {
      view = v;
    },
    setCloudMissions: (missions: { id: string; title: string }[]) => {
      cloudMissions = missions;
    },
  };
}
async function action(id: string, b: HTMLButtonElement) {
  if (id.startsWith('cloud-mission:')) {
    try {
      const cloud = await import('./cloud');
      await cloud.playCloudMission(
        id.slice('cloud-mission:'.length),
        cloudHooks(),
      );
    } catch {
      toast(
        'The secure mission could not load. Your local adventure is still available.',
      );
    }
    return;
  }
  if (id === 'cloud') {
    try {
      const cloud = await import('./cloud');
      await cloud.openCloudDesk(cloudHooks());
    } catch {
      toast(
        'The cloud module could not load. Your local adventure is still available.',
      );
    }
    return;
  }
  if (
    (view === 'mission' || view === 'maths') &&
    !document.hidden &&
    !['parent', 'settings', 'map', 'close'].includes(id)
  ) {
    const now = Date.now();
    if (lastLearningAction && now - lastLearningAction < 30000)
      recordEvent(state, 'active_interval', {
        activeMs: now - lastLearningAction,
      });
    lastLearningAction = now;
  } else lastLearningAction = 0;
  if (id === 'profiles') {
    profilesDialog();
    return;
  }
  if (id.startsWith('profile:')) {
    stop();
    switchProfile(state, id.slice(8));
    save();
    closeDialog();
    map();
    return;
  }

  if (id === 'curriculum') {
    openDialog(
      'The learning roadmap',
      `<p class="muted">${esc(roadmap.notice)}</p>${[
        ...new Set(roadmap.skills.map((s) => s.subject)),
      ]
        .map(
          (subject) =>
            `<details><summary>${esc(subject)}</summary>${roadmap.skills
              .filter((s) => s.subject === subject)
              .map(
                (s) =>
                  `<p><b>${esc(s.id)} · ${esc(s.stage)}</b><br>${esc(s.objective)}<br><small>${esc(s.sourceType)} · ${esc(s.sequencing)}</small></p>`,
              )
              .join('')}</details>`,
        )
        .join('')}`,
    );
    return;
  }
  if (id === 'map') {
    map();
    return;
  }
  if (id === 'mission') {
    recordEvent(state, 'mission_started', { mission: 'trophy' });
    if (state.missionStep === 6) {
      state.missionStep = 0;
      state.clues = [];
      save();
    }
    mission();
    return;
  }
  if (id === 'maths') {
    maths();
    return;
  }
  if (id === 'journal') {
    journal();
    return;
  }
  if (id === 'settings') {
    settings();
    return;
  }
  if (id === 'parent') {
    parent();
    return;
  }
  if (id === 'close') {
    closeDialog();
    return;
  }
  if (id === 'fullscreen') {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      toast(
        'Full screen is unavailable here. The game still works in this window.',
      );
    }
    return;
  }
  if (id === 'listen') {
    const c = chapters[Math.min(storyStep(), 5)];
    if (!state.settings.sound) {
      feedback('Sound is off. Use Read instead, or turn it on in Settings.');
      return;
    }
    try {
      await segment(c.start, c.end, readReady);
      document.querySelector('#audio-status')!.textContent =
        'Narration playing · pause whenever you like';
    } catch {
      feedback('Audio could not start. Try again, or choose Read instead.');
    }
    return;
  }
  if (id === 'pause') {
    narration.pause();
    document.querySelector('#audio-status')!.textContent =
      'Paused · Hear the story replays this chapter';
    return;
  }
  if (id === 'read') {
    stop();
    readReady();
    feedback('Read the caption above. The investigation will wait for you.');
    return;
  }
  if (id === 'next') {
    next();
    return;
  }
  if (id.startsWith('clue-')) {
    const k = id.slice(5);
    if (
      ['empty', 'glitter', 'cloth', 'trophy'].includes(k) &&
      !state.clues.includes(k)
    )
      state.clues.push(k);
    save();
    const facts: Record<string, [string, string]> = {
      empty: [
        'notice',
        'The other trophies are still here. The green stand is empty. You notice the gap.',
      ],
      glitter: [
        'investigate',
        'Gold glitter leads towards the art room. It is a clue, not proof of theft.',
      ],
      cloth: [
        'investigate',
        'A polishing cloth lies near the art room. What might it have been used for?',
      ],
      trophy: [
        'relieved',
        'Mr Clark was polishing the trophy. It is safe. The detectives feel relieved.',
      ],
    };
    if (facts[k]) {
      feedback(facts[k][1]);
      wordCard(facts[k][0]);
    } else
      feedback(
        k === 'window'
          ? 'The window is closed and unbroken. It does not explain the missing trophy.'
          : 'The noticeboard celebrates Year 6. Nothing here explains the empty stand.',
      );
    document
      .querySelectorAll('.evidence-slot')
      .forEach((e, i) =>
        e.classList.toggle(
          'found',
          state.clues.includes(['empty', 'glitter', 'cloth', 'trophy'][i]),
        ),
      );
    return;
  }
  if (id.startsWith('word-')) {
    wordCard(id.slice(5));
    return;
  }
  if (id.startsWith('hear-') || id.startsWith('slow-')) {
    const w = words.find((w) => w.id === id.slice(5))!;
    try {
      await replay(...w.cue, id.startsWith('slow') ? 0.9 : 1);
    } catch {
      toast('Replay could not start. Try again.');
    }
    return;
  }
  if (
    ['notice-correct', 'investigate-correct', 'relieved-correct'].includes(id)
  ) {
    if (!listenDone) {
      feedback('Hear this chapter or choose Read instead first.');
      return;
    }
    if (
      id === 'investigate-correct' &&
      (!state.clues.includes('glitter') || !state.clues.includes('cloth'))
    ) {
      feedback(
        'Inspect the glitter and the polishing cloth first. Your decision needs evidence.',
      );
      return;
    }
    const skill =
      id === 'notice-correct'
        ? 'puzzled'
        : id === 'relieved-correct'
          ? 'relieved'
          : 'investigate';
    evidence(state, skill, true, hinted);
    save();
    next();
    return;
  }
  if (id.endsWith('-wrong')) {
    hinted = true;
    feedback(
      id.startsWith('notice')
        ? 'Look at the cabinet: one green stand is empty.'
        : 'Check the evidence. What does it tell us?',
    );
    return;
  }
  if (id.startsWith('block-')) {
    const i = id.slice(6);
    chosen.push(i);
    b.disabled = true;
    drawSentence();
    return;
  }
  if (id.startsWith('unblock-')) {
    const n = Number(id.slice(8));
    chosen.splice(n, 1);
    drawSentence();
    return;
  }
  if (id === 'sentence-hint') {
    hinted = true;
    feedback(
      'Model: I felt relieved because the trophy was safe. Try rebuilding it yourself.',
    );
    return;
  }
  if (id === 'sentence-check') {
    if (chosen.join(',') !== '2,3,1,0') {
      hinted = true;
      feedback(
        'Start with I felt, add a feeling, then because and the reason.',
      );
      return;
    }
    evidence(state, 'sentence', true, hinted);
    if (!hinted) xp('independent:sentence', state.settings.independentXP);
    save();
    next();
    return;
  }
  if (id === 'reviews') {
    reviewIndex = 0;
    recallWords = dueSkills().length ? dueSkills() : words;
    renderRecall(true);
    return;
  }
  if (id.startsWith('recallhint-')) {
    reviewHinted = true;
    const w = words.find((w) => w.id === id.slice(11))!;
    document.querySelector('#recall-feedback')!.textContent = w.definition;
    return;
  }
  if (id.startsWith('recall-next-')) {
    reviewIndex++;
    renderRecall(id.endsWith('review'));
    return;
  }
  if (id.startsWith('recall-')) {
    const [, word, index, mode] = id.split('-');
    const w = words.find((w) => w.id === word)!;
    if (Number(index) !== w.answer) {
      reviewHinted = true;
      document.querySelector('#recall-feedback')!.textContent =
        `Try using the meaning: ${w.definition}`;
      evidence(state, word, false);
      save();
      return;
    }
    const review = mode === 'review';
    const wasDue = status(profile().skills[word]) === 'Review due';
    evidence(state, word, true, reviewHinted);
    if (!reviewHinted && !review)
      xp('independent:word:' + word, state.settings.independentXP);
    if (review && wasDue && !reviewHinted)
      xp(
        'review:' + word + ':' + new Date().toISOString().slice(0, 10),
        state.settings.applicationXP,
      );
    save();
    const target = document.querySelector('#recall-feedback')!;
    target.innerHTML = `<span>${esc(w.example)} ${reviewHinted ? 'That was supported practice.' : 'You used the meaning in a new situation.'}</span>${button('recall-next-' + mode, 'Continue →', 'primary')}`;
    document
      .querySelectorAll<HTMLButtonElement>('.choices [data-action^="recall-"]')
      .forEach((x) => (x.disabled = true));
    bind(target);
    return;
  }
  if (id.startsWith('engine-')) {
    maths(Number(id.slice(7)));
    return;
  }
  if (id.includes('hint'))
    recordEvent(state, 'hint_used', {
      skill: view === 'maths' ? currentPuzzles()[mathIndex].id : 'sentence',
    });
  if (id === 'math-hint') {
    hinted = true;
    feedback(currentPuzzles()[mathIndex].hint);
    return;
  }
  if (id === 'math-language') {
    if (profile().year === 4) {
      hinted = true;
      feedback(currentPuzzles()[mathIndex].hint);
      return;
    }
    hinted = true;
    feedback(
      (
        {
          fractions:
            'Simplest form means an equivalent fraction whose numerator and denominator have no common factor except 1.',
          ratio:
            'A ratio compares equal parts. Altogether means the total of both colours.',
          algebra:
            'Input is the starting number. Output is the result. An inverse operation undoes a step.',
        } as Record<string, string>
      )[currentPuzzles()[mathIndex].id],
    );
    return;
  }
  if (id === 'piece') {
    b.classList.toggle('lit');
    b.setAttribute('aria-pressed', String(b.classList.contains('lit')));
    return;
  }
  if (id === 'model-reset') {
    document.querySelector('#math-model')!.innerHTML = mathsModel('fraction');
    bind(document.querySelector('#math-model')!);
    return;
  }
  if (id === 'extension' && mathSolved) {
    mathExtension = true;
    hinted = false;
    document.querySelector('#math-question')!.textContent =
      currentPuzzles()[mathIndex].extension;
    document.querySelector('#math-model')!.innerHTML =
      '<p class="muted">Apply the same reasoning to this new situation.</p>';
    (document.querySelector('#math-answer') as HTMLInputElement).value = '';
    feedback(
      'A new context. Explain your method aloud, on paper, or in your head.',
    );
    document.querySelector('#math-next')!.innerHTML = '';
    return;
  }
  if (id === 'export-progress') {
    download('private-adventure-progress.json', state);
    return;
  }
  if (id === 'delete-progress') {
    if (
      confirm(
        'Reset all learning progress on this device? Export a backup first if you want to keep it.',
      )
    ) {
      state = fresh();
      save();
      closeDialog();
      map();
    }
    return;
  }
  if (id === 'template') {
    download('lesson-template.json', {
      version: 1,
      id: 'garden-clue',
      title: 'The garden clue',
      subject: 'English',
      objective: 'Choose a word that explains a feeling.',
      year: 3,
      vocabulary: [
        { word: 'curious', definition: 'Wanting to find out more.' },
      ],
      question: 'You want to find out what is inside a strange box. You feel…',
      choices: ['curious', 'relieved', 'tired'],
      answer: 0,
      hint: 'Think about wanting to discover something.',
    });
    return;
  }
  if (id === 'custom') {
    customQuest();
    return;
  }
  if (id === 'custom-hint') {
    feedback(custom!.hint);
    return;
  }
  if (id.startsWith('custom-answer-')) {
    feedback(
      Number(id.slice(14)) === custom!.answer
        ? 'You connected the word with its meaning. This local preview does not award mastery or credits.'
        : custom!.hint,
    );
    return;
  }
  if (id === 'sound') {
    state.settings.sound = !state.settings.sound;
    save();
    settings();
    return;
  }
  if (id === 'motion') {
    state.settings.motion = !state.settings.motion;
    save();
    document
      .querySelector('.game')
      ?.setAttribute('data-still', String(!state.settings.motion));
    settings();
    return;
  }
  if (id === 'break') {
    openDialog(
      'A natural stopping point',
      `<p>Your progress is saved. Stretch, get some water, or do something away from the screen. Your adventure will be here when you return.</p>${button('map', 'Save and return to the atlas', 'primary')}`,
    );
    return;
  }
}
function drawSentence() {
  const blocks = ['the trophy was safe.', 'because', 'I felt', 'relieved'];
  document.querySelector('#sentence-output')!.innerHTML = chosen.length
    ? chosen
        .map((id, i) =>
          button('unblock-' + i, blocks[Number(id)], 'selected-block'),
        )
        .join('')
    : '<span>Your report goes here…</span>';
  document
    .querySelectorAll<HTMLButtonElement>('#blocks button')
    .forEach((b, i) => (b.disabled = chosen.includes(String(i))));
  bind(document.querySelector('#sentence-output')!);
}
narration.addEventListener('timeupdate', () => {
  if (view !== 'mission') return;
  const t = narration.currentTime;
  const cue = document.querySelector<HTMLElement>('#word-cue');
  if (!cue) return;
  const w = words.find((w) => t >= w.cue[0] && t < w.cue[1]);
  cue.hidden = !w;
  if (w) {
    cue.innerHTML = `${icon(w.icon)}<b>${w.label}</b><span>${w.definition}</span>`;
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stop();
    lastLearningAction = 0;
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') stop();
});
function profilesDialog() {
  openDialog(
    'Choose your explorer',
    `<p>Each explorer keeps a separate adventure on this device.</p><div class="choices">${Object.entries(
      state.profiles,
    )
      .map(([id, p]: [string, any]) =>
        button(
          'profile:' + id,
          esc(p.displayName || 'Adam') + ' · Year ' + (p.year || 6),
          'secondary',
        ),
      )
      .join(
        '',
      )}</div><details><summary>Welcome a new explorer</summary><form id="profile-form"><label for="explorer-name">First name or nickname</label><input id="explorer-name" maxlength="30" required autocomplete="off"><label for="explorer-year">Playable starting stage</label><select id="explorer-year"><option value="6">England · Year 6</option><option value="4">England · Year 4</option></select><p>British English · England primary curriculum</p><p class="muted">Year 4 and Year 6 maths starter sets are supported. English begins with the shared foundation mystery; no prior ability is assumed. More stages and Egyptian Arabic are planned, not selectable yet. The original narrator still says Adam; text greetings use your nickname.</p><button class="primary">Start my adventure →</button><p id="profile-feedback" role="status"></p></form></details>`,
  );
  document.querySelector('#profile-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const name = (
        document.querySelector('#explorer-name') as HTMLInputElement
      ).value;
      const year = Number(
        (document.querySelector('#explorer-year') as HTMLSelectElement).value,
      );
      const id = 'explorer-' + Date.now().toString(36);
      createProfile(state, id, name, year);
      switchProfile(state, id);
      save();
      closeDialog();
      map();
    } catch (err) {
      document.querySelector('#profile-feedback')!.textContent = (
        err as Error
      ).message;
    }
  });
}

map();
mediaStore()
  .then((blob) => {
    if (blob) setAudio(URL.createObjectURL(blob));
  })
  .catch(() => {});
