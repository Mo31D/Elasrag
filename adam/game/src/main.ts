import {dailyPlan,finishDaily,reviewOrder,beaconLesson,beaconExample} from './daily-learning.js';
import './style.css';
import {discoverWord,notebookWords,SCIENCE_VOCABULARY} from '../public/shared/notebook.js';
import {WORDS} from '../../words/words-data.js';
import { mountVisualTool } from './visual-tools.js';
import {learningSummary,readScience,resetLocalLearning,LOCAL_RESET_KEYS} from '../public/shared/learning-progress.js';
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
  mathSolved = false,
  mathAttempts = 0;
let recallWords = words,
  chosen: string[] = [],
  reviewIndex = 0,
  reviewHinted = false,
  returnFocus: HTMLElement | null = null,
  custom: LessonPackage | null = null;
const CLOUD_MISSION_CACHE = 'ala-approved-missions-v1';
let cloudMissions: { id: string; title: string }[] = (() => {
  try {
    const value = JSON.parse(storage.getItem(CLOUD_MISSION_CACHE) || '[]');
    return Array.isArray(value)
      ? value.filter(
          (item) =>
            item &&
            typeof item.id === 'string' &&
            typeof item.title === 'string',
        ).slice(0, 6)
      : [];
  } catch {
    return [];
  }
})();
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
    flask:
      '<path d="M24 6H40M27 6V25L12 50Q8 57 18 57H46Q56 57 52 50L37 25V6M18 43H46M26 49H30M36 51H38"/>' ,
    crystal:
      '<path d="M32 4L51 19 56 43 32 60 8 43 13 19ZM32 4L23 25 32 60 42 25ZM13 19L23 25 42 25 51 19"/>',
    sound:
      '<path d="M8 24H20L34 12V52L20 40H8ZM43 23Q53 32 43 41M49 14Q66 32 49 50"/>',
    pause: '<path d="M21 13V51M43 13V51"/>',
    play: '<path d="M20 10L53 32 20 54Z"/>',
    check: '<path d="M10 33L25 48 55 16"/>',
    empty:
      '<path d="M12 48H52M18 42H46M22 34H42"/><path d="M18 13H46V27" stroke-dasharray="4 5"/><path d="M23 17L18 13 23 9M41 31L46 27 41 23"/>',
    glitter:
      '<path d="M32 5L36 24 55 28 36 32 32 51 28 32 9 28 28 24Z"/><path d="M50 8V20M44 14H56M13 43V53M8 48H18"/>',
    cloth:
      '<path d="M10 17Q21 8 31 18T54 17V45Q43 55 32 45T10 46Z"/><path d="M11 29Q22 20 32 30T54 29"/>',
  };
  return `<svg ${common}>${paths[id] || paths.glass}</svg>`;
};
// Resume with the authoritative progress ledger after returning from standalone games.
// Otherwise the browser back-forward cache can restore stale XP and overwrite awards.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) { state = load(storage); map(); }
});
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
function mathsUnlocked(p: any) {
  return !(p.requires || []).some((id: string) => !state.maths.includes(id));
}
function recommendedMathIndex() {
  const list = currentPuzzles();
  const due = list.findIndex((p) => status(profile().skills[p.id]) === 'Review due');
  if (due >= 0) return due;
  const next = list.findIndex((p) => mathsUnlocked(p) && !state.maths.includes(p.id));
  return next >= 0 ? next : 0;
}
function xp(id: string, amount: number) {
  const n = reward(state, id, amount);
  save();
  const total=learningSummary(window.localStorage,state.activeProfile).xp;
  const hud=document.querySelector('.hud-actions .xp');
  if(hud)hud.innerHTML=`${icon('star')} <b>${total}</b> XP <small>LV ${1+Math.floor(total/25)}</small>`;
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
  const totalXP=learningSummary(window.localStorage,state.activeProfile).xp;
  app.innerHTML = `<main class="game ${view}" ${!state.settings.motion ? 'data-still="true"' : ''}><header class="hud"><button class="identity" data-action="map" aria-label="Adventure map"><span class="crest">A</span><span>${esc(displayName)}<span class="sub">LEARNING ADVENTURES</span></span></button><div class="place"><span class="dot"></span>${place}</div><div class="hud-actions"><span class="xp">${icon('star')} <b>${totalXP}</b> XP <small>LV ${1 + Math.floor(totalXP / 25)}</small></span>${button('journal', icon('book'), 'icon-btn')}${button('settings', icon('gear'), 'icon-btn')}</div></header>${content}<footer class="game-footer"><span>THE ADVENTURE ATLAS <i>✦</i> CHAPTER ONE</span><div>${button('parent', 'Parent desk', 'quiet')}${button('fullscreen', '⛶ Full screen', 'quiet')}</div></footer></main><dialog id="overlay" aria-labelledby="dialog-title"></dialog>`;
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
  const reviews = dueSkills().length;
  const missionState = done
    ? 'CASE SOLVED'
    : state.missionStep
      ? 'IN PROGRESS'
      : 'NEW CASE';
  const mathsTotal = currentPuzzles().length;
  const mathsDone = currentPuzzles().filter((p) => state.maths.includes(p.id)).length;
  const mathsState = mathsDone
    ? `${mathsDone}/${mathsTotal} RESTORED`
    : 'READY TO BEGIN';
  const learning = learningSummary(window.localStorage,state.activeProfile);
  const lab = readScience(window.localStorage,state.activeProfile);
  const scienceComplete = learning.scienceXP>0 || lab.step>=4;
  const cloudCards = cloudMissions
    .map(
      (mission, index) =>
        `<button type="button" class="adventure-card generated-card" data-action="cloud-mission:${esc(mission.id)}" aria-label="Open generated English mission, ${esc(mission.title)}"><span class="adventure-card-top"><span class="adventure-index">ENGLISH EXPEDITION ${String(index + 1).padStart(2, '0')}</span><span class="adventure-state">APPROVED</span></span><span class="adventure-emblem">${icon('star')}</span><span class="region">MYSTERY CITY · GENERATED MISSION</span><strong>${esc(mission.title)}</strong><span class="adventure-copy">A reviewed vocabulary and sentence-building mission prepared for this family.</span><span class="adventure-action">Begin expedition <b>→</b></span><small>SECURE FAMILY CONTENT · PROGRESS SAVED</small></button>`,
    )
    .join('');
  shell(
    `<section class="atlas" aria-label="Adventure world map"><img class="atlas-art" src="/adam/assets/atlas.svg" alt="Floating islands connected by a trail of light, with a school and a crystal tower"><div class="map-heading"><p class="eyebrow">THE ADVENTURE ATLAS</p><h1>Choose your next<br>adventure.</h1><p>Welcome, ${esc(profile().displayName || 'Adam')}. Pick a destination and continue your journey.</p></div><div class="daily-launch"><span class="eyebrow">YOUR NEXT SMALL ADVENTURE</span><h2>My adventure today</h2><p>Recall a few words, build one maths skill and explore a discovery. Take a break whenever you like.</p>${button('daily','Continue today’s adventure →','primary')}</div><div class="adventure-deck" aria-label="Available adventures"><button type="button" class="adventure-card mystery-card" data-action="mission" aria-label="${done ? 'Reopen' : state.missionStep ? 'Continue' : 'Begin'} lesson one, The missing trophy"><span class="adventure-card-top"><span class="adventure-index">LESSON 01</span><span class="adventure-state">${missionState}</span></span><span class="adventure-emblem">${icon('glass')}</span><span class="region">MYSTERY CITY · ENGLISH</span><strong>The missing trophy</strong><span class="adventure-copy">${done ? 'Case solved. Revisit the evidence and vocabulary.' : 'Follow a golden trail, examine clues and repair the detective report.'}</span><span class="adventure-action">${done ? 'Reopen case' : state.missionStep ? 'Continue investigation' : 'Begin investigation'} <b>→</b></span><small>5–15 MIN · ${done ? '✓ STAR DETECTIVE' : '4 WORDS TO DISCOVER'}</small></button><button type="button" class="adventure-card maths-card" data-action="maths" aria-label="Open Number Kingdom"><span class="adventure-card-top"><span class="adventure-index">MATHS QUEST</span><span class="adventure-state">${mathsState}</span></span><span class="adventure-emblem">${icon('crystal')}</span><img class="adventure-feature-art" src="/adam/assets/quest-maths.svg" alt="" loading="lazy" aria-hidden="true"><span class="region">NUMBER KINGDOM · CONFIDENCE PATH</span><strong>The crystal pathways</strong><span class="adventure-copy">Short Year 3–6 checks separate question language from mathematical thinking.</span><span class="adventure-action">${mathsDone ? 'Continue your path' : 'Start the recommended path'} <b>→</b></span><small>YEAR ${profile().year || 6} · ${mathsDone}/${mathsTotal} PATHS TRIED</small></button><button type="button" class="adventure-card words-card" data-action="words" aria-label="Enter Word Kingdom"><span class="adventure-card-top"><span class="adventure-index">WORD COLLECTION</span><span class="adventure-state">${reviews ? `${reviews} REVIEW${reviews === 1 ? '' : 'S'} DUE` : 'READY'}</span></span><span class="adventure-emblem">${icon('book')}</span><span class="region">WORD KINGDOM · BRITISH ENGLISH</span><strong>The living library</strong><span class="adventure-copy">Discover, hear and master curriculum spelling and useful school vocabulary.</span><span class="adventure-action">Enter the library <b>→</b></span><small>COMPLETE WORD ACTIVITIES TO EARN ADVENTURE XP</small></button><button type="button" class="adventure-card science-card" data-action="science" aria-label="Enter Discovery Laboratory"><span class="adventure-card-top"><span class="adventure-index">SCIENCE MISSION</span><span class="adventure-state">${scienceComplete?'COMPLETE':lab.step?'IN PROGRESS':'NEW LAB'}</span></span><span class="adventure-emblem">${icon('flask')}</span><img class="adventure-feature-art" src="/adam/assets/quest-science.svg" alt="" loading="lazy" aria-hidden="true"><span class="region">DISCOVERY LABORATORY · MATERIALS</span><strong>The dissolving mystery</strong><span class="adventure-copy">Predict, test and explain why sugar seems to disappear but sand does not.</span><span class="adventure-action">${scienceComplete?'Revisit the laboratory':lab.step?'Continue the experiment':'Enter the laboratory'} <b>→</b></span><small>${scienceComplete?'✓ EVIDENCE EXPLORER · 10 XP EARNED':'MATERIALS · SCIENTIFIC THINKING · 10 XP TO EARN'}</small></button>${cloudCards}</div><div class="map-compass">N<br><span>✧</span><br>S</div><div class="map-bottom">${button('reviews', `${icon('book')} ${reviews ? 'Recall trail · ' + reviews + ' due' : 'Recall trail · practise words'}`, 'map-chip')}${custom ? button('custom', `Imported quest · ${esc(custom.title)}`, 'map-chip') : ''}${button('cloud', cloudMissions.length ? 'Manage family missions' : 'Family missions', 'map-chip')}</div></section>`,
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
    `<section class="mission-stage"><img class="scene-art" src="/adam/assets/scene-${scene}.svg" alt="${['Maya and Leo beside the trophy cabinet, where a green stand is empty', 'Maya and Leo looking puzzled beside the cabinet', 'The detectives investigate a golden glitter trail', 'Mr Clark with the safe trophy and a polishing cloth'][scene]}"><div class="scene-vignette"></div><div class="quest-banner"><span>CASE 001 <i>✦</i> ${step < 6 ? `STEP ${step + 1} / 6` : 'COMPLETE'}</span><h1>${titles[step]}</h1><p>${objectives[step]}</p><progress max="6" value="${step}" aria-label="Mission progress"></progress></div><aside class="inventory-rail" aria-label="Collected evidence"><span>EVIDENCE</span>${['empty', 'glitter', 'cloth', 'trophy'].map((k) => `<div class="evidence-slot ${state.clues.includes(k) ? 'found' : ''}" title="${k}" aria-label="${k}: ${state.clues.includes(k) ? 'found' : 'not found'}">${icon(k)}<small>${state.clues.includes(k) ? '✓' : '?'}</small></div>`).join('')}</aside>${content}<div id="word-cue" class="word-cue" hidden></div><div class="mission-bottom"><div class="audio-bar">${step < 5 ? button('listen', `${icon('play')} Hear the story`, 'audio-btn') : ''}${step < 5 ? button('pause', icon('pause'), 'icon-btn') : ''}<span id="audio-status" role="status">${step < 5 ? (profile().displayName === 'Adam' ? 'Original British narration · scene summary below' : 'Original recording addresses Adam · personalised text available') : 'Think, explore, and take your time'}</span>${step < 5 ? button('read', 'Read instead', 'quiet') : ''}</div><div class="dialogue"><div class="speaker-avatar">${icon(step === 6 ? 'trophy' : 'glass')}</div><div><span class="eyebrow">${step === 6 ? 'ADVENTURE ACADEMY' : 'DETECTIVE CLUB'}</span><p id="caption">${step === 4 ? 'The evidence is clear. Now repair the detective report in your own order.' : step < 5 ? c.caption : step === 5 ? 'The words can help with other mysteries too. Ready to try?' : 'You used careful observation and explained your reasoning.'}</p><div id="task">${taskMarkup(step)}</div><p id="feedback" class="feedback" role="status"></p></div></div></div></section>`,
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
  finishDaily(p,'discovery');
  xp('mission:trophy', state.settings.missionXP);
  save();
}
function openDialog(title: string, body: string) {
  stop();
  returnFocus = document.activeElement as HTMLElement;
  const d = document.querySelector<HTMLDialogElement>('#overlay')!;
  d.classList.remove('notebook-dialog');
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
  discoverWord(window.localStorage,state.activeProfile,{term:w.label,definition:w.definition,example:w.example},'The missing trophy');
  openDialog(
    w.label,
    `<div class="word-illustration">${icon(w.icon)}</div><p class="definition">${w.definition}</p><blockquote>${w.example}</blockquote><div class="choices">${button('notebook-one:'+esc(w.label),'Practise this word','primary')}${button('hear-' + id, `${icon('sound')} Hear in the original story`, 'secondary')}${button('slow-' + id, 'Gentler replay', 'quiet')}</div><p class="muted">You may try saying it, think it, or simply listen. Take as long as you like.</p>${button(view==='mission'?'close':'journal',view==='mission'?'Back to the investigation →':'← All collected words','primary')}`,
  );
}
function journal() {
  // Recover previously practised collection words without treating catalogue views as learning.
  try {
    const saved=JSON.parse(storage.getItem('ala-word-kingdom-v1')||'{}').learners?.[state.activeProfile]?.words||{};
    for(const w of WORDS) if(Object.values(saved[w.id]||{}).some((v:any)=>v.days>0||v.due>0))
      discoverWord(window.localStorage,state.activeProfile,{...w,practised:true},'Word Kingdom');
  } catch {}
  if(readScience(window.localStorage,state.activeProfile).step>=1)
    SCIENCE_VOCABULARY.forEach(w=>discoverWord(window.localStorage,state.activeProfile,w,'The dissolving mystery'));
  const entries=notebookWords(window.localStorage,state.activeProfile) as any[];
  const combined=new Map<string,any>(words.map(w=>[w.label,{term:w.label,definition:w.definition,example:w.example,sources:['The missing trophy'],original:w.id}]));
  for(const entry of entries) combined.set(entry.term.toLowerCase(),{...combined.get(entry.term.toLowerCase()),...entry});
  const list=[...combined.values()].sort((a,b)=>a.term.localeCompare(b.term,'en-GB'));
  openDialog('Detective notebook',
    `<p class="notebook-intro">Your discoveries across stories, Word Kingdom and science. Finding a word starts its journey; mastery comes from later independent practice.</p>${button('notebook-review','Start a short recall trail →','primary')}<div class="notebook-toolbar"><span>${list.length} collected words</span><label class="sr-only" for="notebook-search">Find a collected word</label><input id="notebook-search" type="search" placeholder="Find a word…" autocomplete="off"></div><div class="journal-grid notebook-collection">${list.map(w=>`<button class="journal-word" data-notebook-term="${esc(w.term.toLowerCase())}" data-action="notebook:${esc(w.term.toLowerCase())}"><span class="notebook-mark">${icon(w.original?words.find(x=>x.id===w.original)!.icon:'book')}</span><strong>${esc(w.term)}</strong><small>${esc(w.sources.join(' · '))}</small><small>${(()=>{const all=[0,1,2].map(i=>profile().skills['notebook:'+w.term+':'+i]).filter(Boolean);const due=all.map(x=>x.due).filter(Boolean).sort()[0];return due?'Review '+new Date(due).toLocaleDateString('en-GB'):'Ready for first recall';})()}</small><span class="notebook-state">${w.original?status(profile().skills[w.original]):w.practised?'Practising':'Discovered'}</span></button>`).join('')}</div><p id="notebook-empty" hidden>No collected words match that search.</p><details class="notebook-evidence"><summary>Evidence pouch · ${state.clues.length} clues</summary><p>${state.clues.length?state.clues.map((k:string)=>({empty:'Empty trophy stand',glitter:'Gold glitter trail',cloth:'Polishing cloth',trophy:'Trophy safe with Mr Clark'}[k]||k)).join(' · '):'Your first clue is waiting at the school.'}</p></details>`);
  document.querySelector('#overlay')?.classList.add('notebook-dialog');
  document.querySelector('#notebook-search')?.addEventListener('input',(event)=>{
    const query=(event.target as HTMLInputElement).value.trim().toLowerCase();let count=0;
    document.querySelectorAll<HTMLElement>('[data-notebook-term]').forEach(card=>{card.hidden=!card.textContent?.toLowerCase().includes(query);if(!card.hidden)count++;});
    document.querySelector<HTMLElement>('#notebook-empty')!.hidden=count>0;
  });
}
function collectedWord(term:string) {
  const stored=notebookWords(window.localStorage,state.activeProfile).find((w:any)=>w.term.toLowerCase()===term) as any;
  const original=words.find(w=>w.label===term);
  if(original)return wordCard(original.id);
  if(!stored)return;
  openDialog(esc(stored.term),`<p class="definition">${esc(stored.definition)}</p><blockquote>${esc(stored.example)}</blockquote><p class="muted">Found in ${esc(stored.sources.join(' · '))}. Discovery is separate from mastery.</p><div class="choices">${button('notebook-one:'+esc(term),'Practise this word','primary')}${button('notebook-hear:'+esc(term),'♫ Hear word','secondary')}${button('journal','← All collected words','quiet')}</div>`);
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
let beaconStage=0,beaconAssisted=false,beaconIndependent=true,beaconDay=0;
let notebookQueue:any[]=[],notebookIndex=0,notebookFacet=0,notebookAssisted=false,notebookChosen:number[]=[];
function daily(){
 state=load(storage);stop();view='daily';const plan=dailyPlan(profile());const lab=readScience(window.localStorage,state.activeProfile);if(plan.scienceAtStart===undefined)plan.scienceAtStart=!!lab.completed;if((!plan.scienceAtStart&&lab.completed)||(profile().events||[]).some((e:any)=>e.type==='mission_completed'&&e.at>=plan.startedAt))finishDaily(profile(),'discovery');save();
 const tasks=[['words','Recall trail','Three collected words, one small activity each.'],['maths','Build a maths skill','A worked example, guided practice and a fresh challenge.'],['discovery','Make a discovery','Continue a story, approved mission or science experiment.']];
 shell(`<section class="daily-world"><span class="eyebrow">MY ADVENTURE TODAY · ${esc(plan.day)}</span><h1>A little learning.<br>A real adventure.</h1><p>About 10–15 minutes, at your pace. There is no timer or daily streak.</p><ol class="daily-steps">${tasks.map(([id,title,copy])=>`<li class="${plan.completed.includes(id)?'done':''}"><span class="daily-seal">${plan.completed.includes(id)?'✓':tasks.findIndex(t=>t[0]===id)+1}</span><div><h2>${title}</h2><p>${copy}</p><button class="${plan.completed.includes(id)?'quiet':'primary'}" data-action="daily-${id}">${plan.completed.includes(id)?'Revisit':'Begin'} →</button></div></li>`).join('')}</ol>${plan.completed.length===3?'<p class="daily-finish" role="status">Today’s journey is complete. This is a good place to rest or do something offline.</p>':'<p class="muted">Your completed steps stay saved if you leave. Opening an activity earns no XP.</p>'}${button('map','← Adventure Atlas','quiet')}</section>`,'Today’s adventure');
}
function startBeacon(){stop();view='beacon';beaconStage=0;beaconAssisted=false;beaconIndependent=true;beaconDay=Date.now();drawBeacon();}
function drawBeacon(){
 const e=beaconExample(beaconStage,beaconDay),guided=beaconStage<2;
 shell(`<section class="daily-world beacon-world"><span class="eyebrow">NUMBER KINGDOM · STEP ${beaconStage+1} OF 4</span><h1>${beaconLesson.title}</h1><p class="lesson-stage">${beaconLesson.stages[beaconStage]}</p><section class="beacon-panel"><p>A digit is a single number symbol. Its <b>value</b> tells us how much it represents in this position.</p><h2>What is the value of ${e.digit} in ${e.number}?</h2><div class="beacon-columns" aria-label="Place value columns">${e.number.replace(',','').split('').map((d:string,i:number)=>`<span class="${Number(d)===e.digit?'lit':''}"><small>${["10,000s","1,000s","100s","10s","1s"][i]}</small><b>${d}</b></span>`).join('')}</div>${guided?`<p>${e.digit} is in the <b>${e.column}</b> column. Each one is worth ${e.unit.toLocaleString('en-GB')}.</p><p class="math-equation">${e.digit} × ${e.unit.toLocaleString('en-GB')} = ${beaconStage===0?e.answer.toLocaleString('en-GB'):'?'}</p>`:'<p>Use the column headings if they help. The picture does not show the answer.</p>'}${beaconStage===0?button('beacon-next','Now let me try →','primary'):`<form id="beacon-form"><label for="beacon-answer">The digit represents</label><input id="beacon-answer" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="Enter its value"><button class="primary">Check my thinking →</button></form>${button('beacon-hint','Show a smaller step','quiet')}`}<p id="beacon-feedback" role="status" class="feedback"></p><div id="beacon-next"></div></section>${button('daily','← Today’s adventure','quiet')}${button('maths','All maths paths','quiet')}</section>`,'The place-value beacon');
 document.querySelector('#beacon-form')?.addEventListener('submit',event=>{
  event.preventDefault();const input=document.querySelector<HTMLInputElement>('#beacon-answer')!;
  const raw=input.value.replace(/[ ,]/g,'');if(!raw)return;
  const correct=/^\d+$/.test(raw)&&Number(raw)===e.answer;
  const target=document.querySelector('#beacon-feedback')!;
  if(!correct){beaconAssisted=true;recordEvent(state,'skill_attempted',{skill:'place-value',correct:false,assisted:true});save();target.textContent=`Look at the ${e.column} column. The digit ${e.digit} represents ${e.digit} groups of ${e.unit.toLocaleString('en-GB')}. Try again when ready.`;recordEvent(state,'math_language_support',{skill:'place-value',attempt:beaconStage});save();return;}
  input.disabled=true;document.querySelector<HTMLButtonElement>('#beacon-form button')!.disabled=true;
  if(beaconStage>=2)beaconIndependent=beaconIndependent&&!beaconAssisted;
  target.textContent=`${e.digit} ${e.column} means ${e.answer.toLocaleString('en-GB')}. ${beaconAssisted||beaconStage===1?'That was useful supported practice.':'You worked out the value yourself.'}`;
  if(beaconStage===3){
   evidence(state,'place-value',true,!beaconIndependent);if(!state.maths.includes('place-value'))state.maths.push('place-value');
   xp('engine:place-value',state.settings.missionXP);if(beaconIndependent)xp('independent:place-value',state.settings.independentXP);
   finishDaily(profile(),'maths');save();
   document.querySelector('#beacon-next')!.innerHTML=`<p>A review is scheduled for a later day. Finishing once is not secure mastery.</p>${button('daily','Return to today’s adventure →','primary')}`;
  }else document.querySelector('#beacon-next')!.innerHTML=button('beacon-next',beaconStage===1?'Try a new number independently →':'Use the skill in a new place →','primary');
  bind(document.querySelector('#beacon-next')!);
 });
}
function notebookReview(){
 // Collect the original lesson vocabulary too; discovery itself gives no learning credit.
 words.forEach(w=>discoverWord(window.localStorage,state.activeProfile,{term:w.label,definition:w.definition,example:w.example},'The missing trophy'));
 notebookQueue=reviewOrder(notebookWords(window.localStorage,state.activeProfile),profile().skills).slice(0,3);
 notebookIndex=0;notebookFacet=0;drawNotebookReview();
}
function drawNotebookReview(){
 const w=notebookQueue[notebookIndex];
 if(!w){if(notebookQueue.length>=3)finishDaily(profile(),'words');save();openDialog('Recall trail complete',`<p>You practised ${notebookQueue.length} collected words. The next reviews are scheduled.</p>${button('daily','Back to today’s adventure →','primary')}`);return;}
 notebookAssisted=false;notebookChosen=[];
 const counts=profile().notebookFacets||{};const facet=(counts[w.term]||0)%3;notebookFacet=facet;
 const chunks=w.example.trim().split(/\s+/);
 // Reverse a known complete sentence; accessible buttons provide a drag-free reconstruction.
 const pieces=[...chunks].reverse();
 const alternatives=[w,...notebookWords(window.localStorage,state.activeProfile).filter((x:any)=>x.term!==w.term&&x.definition!==w.definition)].slice(0,3).sort((a,b)=>a.term.localeCompare(b.term));
 openDialog(`Recall trail · ${notebookIndex+1} of ${notebookQueue.length}`,`<span class="eyebrow">${['MEANING','SPELLING','SENTENCE'][facet]}</span>${facet===0?`<h3>Which word means:</h3><p class="definition">${esc(w.definition)}</p><div class="choices">${alternatives.map((a:any)=>button('notebook-choice:'+esc(a.term),esc(a.term),'secondary')).join('')}</div>`:facet===1?`<p class="definition">${esc(w.definition)}</p><p>${esc(w.example.replace(new RegExp(w.term,'gi'),'_____'))}</p><form id="notebook-answer"><label for="notebook-spelling">Write the missing word</label><input id="notebook-spelling" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="60"><button class="primary">Check spelling</button></form>`:`<p>Rebuild the example sentence about <b>${esc(w.term)}</b>.</p><p id="notebook-sentence" class="sentence-drop" aria-live="polite">Tap the words in order.</p><div class="choices">${pieces.map((part:string,i:number)=>button('notebook-part:'+i,esc(part),'secondary')).join('')}</div><div class="choices">${button('notebook-undo','Undo last word','quiet')}${button('notebook-check','Check sentence','primary')}</div>`}<div class="choices">${button('notebook-help','Show a model','quiet')}${button('notebook-review-hear','♫ Device voice','quiet')}${button('journal','Stop and return to notebook','quiet')}</div><p id="notebook-feedback" role="status"></p><div id="notebook-continue"></div>`);
 document.querySelector('#notebook-answer')?.addEventListener('submit',e=>{e.preventDefault();checkNotebook(document.querySelector<HTMLInputElement>('#notebook-spelling')!.value.trim().toLowerCase()===w.term.toLowerCase());});
}
function checkNotebook(correct:boolean){
 const w=notebookQueue[notebookIndex],target=document.querySelector('#notebook-feedback')!;
 if(!correct){notebookAssisted=true;evidence(state,'notebook:'+w.term+':'+notebookFacet,false,true);save();target.textContent='Try another way. Use Show a model whenever it helps.';return;}
 evidence(state,'notebook:'+w.term+':'+notebookFacet,true,notebookAssisted);profile().notebookFacets??={};profile().notebookFacets[w.term]=(profile().notebookFacets[w.term]||0)+1;discoverWord(window.localStorage,state.activeProfile,{...w,practised:true},'Detective notebook');
 if(!notebookAssisted)xp('notebook:'+w.term+':'+notebookFacet,1);
 save();target.textContent=notebookAssisted?'Supported practice saved. We will revisit this word later.':'Independent practice saved. We will revisit this word later.';
 document.querySelectorAll<HTMLButtonElement>('#overlay button').forEach(b=>{if(b.dataset.action?.startsWith('notebook-'))b.disabled=true;});
 document.querySelector('#notebook-continue')!.innerHTML=button('notebook-next','Next word →','primary');bind(document.querySelector('#notebook-continue')!);
}
function maths(index = -1) {
  stop();
  view = 'maths';
  if (index < 0) return mathsHub();
  if (!currentPuzzles()[index] || !mathsUnlocked(currentPuzzles()[index])) {toast('Try the foundation paths first.');return mathsHub();}
  mathIndex = index;
  mathSolved = false;
  mathAttempts = 0;
  hinted = true; // The initial path includes a worked picture: count it as guided practice.
  mathExtension = false;
  drawMaths();
}
function mathsHub() {
  const list = currentPuzzles();
  const recommended = recommendedMathIndex();
  shell(
    `<section class="maths-hub"><div class="maths-hub-heading"><span class="eyebrow">NUMBER KINGDOM · CONFIDENCE MAP</span><h1>Small steps. Strong thinking.</h1><p>Earlier-year review is a strength check, not going backwards. The map recommends one useful next step and unlocks Year 6 bridges only when their foundations have been tried.</p><button class="primary" data-action="${recommended===0?'beacon':'engine-'+recommended}">Start recommended path →</button>${button('beacon','Learn place value step by step','secondary')}</div><div class="maths-paths">${list.map((p, i) => { const unlocked=mathsUnlocked(p), skillState=status(profile().skills[p.id]); return `<button class="maths-path ${state.maths.includes(p.id) ? 'complete' : ''} ${!unlocked ? 'locked' : ''}" ${unlocked ? `data-action="engine-${i}"` : 'disabled'}><span>${!unlocked ? 'LOCKED · BUILD FOUNDATIONS' : skillState === 'Review due' ? 'REVIEW DUE' : state.maths.includes(p.id) ? '✓ COMPLETED ONCE' : `CHECK · YEAR ${p.reviewYear}`}</span><b>${esc(p.strand)}</b><strong>${esc(p.name)}</strong><small>${esc(p.objective)}</small><i>${!unlocked ? `First: ${(p.requires || []).map((id:string)=>list.find(x=>x.id===id)?.name || id).join(' and ')}` : state.maths.includes(p.id) ? 'Practise or review again' : i === recommended ? 'Recommended next step →' : 'Start this short quest →'}</i></button>`; }).join('')}</div><div class="maths-later"><b>How mastery works</b><span>Try</span><span>Review later</span><span>Apply</span><p>One correct answer completes a path once. Secure mastery needs correct independent work again on later days.</p></div></section>`,
    'Number Kingdom / Choose a path',
  );
}
function mathsModel(model: string) {
  if (model === 'place-value')
    return '<div class="place-value-model" aria-label="Place value columns"><span><small>10,000s</small>3</span><span><small>1,000s</small>4</span><span class="lit"><small>100s</small>7</span><span><small>10s</small>8</span><span><small>1s</small>2</span></div>';
  if (model === 'groups')
    return (
      '<div class="group-model" aria-label="Four boxes of six crystals">' +
      Array.from({ length: 4 }, () => '<span>● ● ●<br>● ● ●</span>').join('') +
      '</div>'
    );
  if (model === 'fraction-amount')
    return `<div class="fraction-amount" aria-label="20 lanterns in four equal groups">${Array.from({ length: 20 }, (_, i) => `<span class="${i < 15 ? 'lit' : ''}"></span>`).join('')}</div><p>4 equal groups of 5. Use 3 groups.</p>`;
  if (model === 'percent')
    return '<div class="percent-model" aria-label="A whole split into four equal parts"><span class="lit">25%</span><span></span><span></span><span></span></div><p>25% is one of four equal parts: one quarter.</p>';
  if (model === 'measure')
    return '<div class="measure-model" aria-label="Two and a half metres shown as 200 and 50 centimetres"><span>2 m<br><b>200 cm</b></span><i>+</i><span>0.5 m<br><b>50 cm</b></span></div>';
  if (model === 'triangle')
    return '<div class="triangle-model" aria-label="Triangle with angles 55 degrees, 65 degrees and an unknown angle"><span>55°</span><span>65°</span><span>?</span></div>';
  if (model === 'subtraction') return '<div class="math-equation" aria-label="Column subtraction"><span>4,302</span><span>− 1,578</span><b>?</b></div>';
  if (model === 'decimal') return '<div class="math-equation decimal-model" aria-label="Decimals aligned by decimal point"><span>2.35</span><span>+ 1.40</span><b>?</b></div>';
  if (model === 'rectangle') return '<div class="rectangle-model" aria-label="Rectangle eight metres by five metres"><span>8 m</span><b>5 m</b><i>around the edge</i></div>';
  if (model === 'coordinates') return '<div class="coordinate-model" aria-label="Coordinate grid with a point at three comma five"><span style="--x:3;--y:5">◆</span><b>(3, 5)</b></div>';
  if (model === 'chart') return '<div class="bar-model" aria-label="Bar chart showing 18 on Monday and 27 on Tuesday"><span style="--h:60%">Mon <b>18</b></span><span style="--h:90%">Tue <b>27</b></span></div>';
  if (model === 'two-step') return '<div class="step-model"><span>6 boxes × 8 maps</span><b>then</b><span>48 maps − 13 used</span></div>';
  if (model === 'ratio') return '<div class="step-model"><span>2 explorers → 6 fruit</span><b>double</b><span>4 explorers → ? fruit</span></div>';
  if (model === 'algebra') return '<div class="step-model"><span>□ + 7 = 19</span><b>undo +7</b><span>19 − 7 = □</span></div>';
  return '';
}
function drawMaths() {
  const p = currentPuzzles()[mathIndex];
  shell(
    `<section class="engine-world"><div class="engine-mountains"></div><div class="engine-heading"><span class="eyebrow">NUMBER KINGDOM / PATH ${mathIndex + 1} OF ${currentPuzzles().length}</span><h1>${p.name}</h1><p>No timer. Read one part at a time, use the picture, and ask for a smaller step whenever you need it.</p></div><div class="engine-layout"><div class="engine-art"><div class="giant-crystal ${state.maths.includes(p.id) ? 'restored' : ''}">${icon('crystal')}</div><div class="engine-pedestal"></div><span>${state.maths.includes(p.id) ? 'PATH COMPLETED' : 'READY WHEN YOU ARE'}</span><div class="engine-selector">${currentPuzzles()
      .map((q, i) =>
        button(
          'engine-' + i,
          `${state.maths.includes(q.id) ? '✓' : i + 1}`,
          'engine-node ' + (i === mathIndex ? 'active' : ''),
        ),
      )
      .join(
        '',
      )}</div>${button('maths', '← All maths paths', 'quiet')}</div><section class="puzzle-panel"><span class="eyebrow">${esc(p.strand)} · YEAR ${p.reviewYear} FOUNDATION · GUIDED PRACTICE</span><details class="math-worked"><summary>Watch a worked example</summary><p>${esc(p.explain)}</p></details><div class="math-brief"><p><b>What you know</b>${esc(p.known)}</p><p><b>What to find</b>${esc(p.find)}</p></div><h2>${p.prompt}</h2><p id="math-question">${p.question}</p><div id="math-model">${mathsModel(p.model)}</div><form id="math-form"><label for="math-answer">Your answer</label><div class="answer-row"><input id="math-answer" inputmode="decimal" autocomplete="off" maxlength="20" aria-describedby="math-question" placeholder="Enter a number"><button class="primary">Check my thinking →</button></div></form><div class="choices">${button('math-hint', 'Show one small step', 'quiet')}${button('math-language', 'Explain the words', 'quiet')}</div><p id="feedback" class="feedback" role="status"></p><div id="math-next"></div></section></div></section>`,
    'Number Kingdom / Crystal engines',
  );
  const tools = document.createElement('div');
  document.querySelector('#math-model')!.after(tools);
  mountVisualTool(tools, p.model, () => { hinted = true; });
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
  const normal = input.toLowerCase().replace(/,/g, '');
  const accepted = mathExtension ? [answer] : (p.acceptedAnswers || [answer]);
  if (!accepted.map((x) => String(x).toLowerCase().replace(/[\s,]/g, '')).includes(normal)) {
    hinted = true;
    mathAttempts++;
    recordEvent(state, mathAttempts === 1 ? 'math_language_support' : 'math_strategy_support', { skill: p.id, attempt: mathAttempts });
    feedback(mathAttempts === 1
      ? `Let’s make the question clearer. ${p.language}`
      : mathAttempts === 2
        ? `Here is one smaller step: ${p.hint}`
        : `Worked model: ${p.explain} You can copy the method, then try the stretch question when ready.`);
    evidence(state, p.id, false);
    save();
    return;
  }
  evidence(state, p.id, true, hinted);
  if (!mathExtension) {
    if (!state.maths.includes(p.id)) state.maths.push(p.id);
    xp('engine:' + p.id, state.settings.missionXP);
    if (!hinted) xp('independent:' + p.id, state.settings.independentXP);
  } else if (!hinted) {xp('extension:' + p.id, state.settings.applicationXP);xp('independent:' + p.id,state.settings.independentXP);}
  mathSolved = true;
  finishDaily(profile(),'maths');
  save();
  feedback(
    `${mathExtension ? 'You applied the method in a new problem. ' : ''}${mathExtension ? p.extensionExplain : p.explain}`,
  );
  document.querySelector('.giant-crystal')?.classList.add('restored');
  document.querySelector('#math-next')!.innerHTML =
    `${!mathExtension ? button('extension', 'Try a stretch puzzle', 'secondary') : ''}${button('engine-' + ((mathIndex + 1) % currentPuzzles().length), mathIndex === currentPuzzles().length - 1 ? 'Revisit the first path' : 'Next path →', 'primary')}${button('maths', 'All maths paths', 'quiet')}${button('map', 'Return to atlas', 'quiet')}`;
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
function parentInsights() {
  const attempts = (profile().events || []).filter((e: any) => e.type === 'skill_attempted');
  const recent = attempts.filter((e: any) => e.at >= Date.now() - 7 * 86400000);
  const supported = recent.filter((e: any) => e.assisted || !e.correct).length;
  const due = currentPuzzles().filter((p) => status(profile().skills[p.id]) === 'Review due');
  const next = currentPuzzles()[recommendedMathIndex()];
  return {
    recent: recent.length,
    supported,
    due,
    recommendation: due.length
      ? `Review ${due[0].name}; it is due now and has already been seen before.`
      : next
        ? `Try ${next.name} next. It is the first useful unlocked step on the confidence map.`
        : 'Repeat a familiar path in a new context.',
  };
}
function parent() {
  openDialog(
    'Parent desk',
    `${button('profiles', 'Choose or add an explorer', 'secondary')}${button('cloud', 'Secure family learning', 'secondary')}<p class="muted">Progress is saved in this browser. Optional private cloud snapshots can copy one explorer’s game progress between devices; imported audio remains device-only. Clearing browser data removes local records. This screen has no authentication; anyone using this device can open it. Export private backups when needed.</p><div class="parent-stats"><div><b>${learningSummary(window.localStorage,state.activeProfile).xp}</b><span>Adventure XP · all missions</span></div><div><b>${currentPuzzles().filter((p) => state.maths.includes(p.id)).length}/${currentPuzzles().length}</b><span>Maths paths</span></div><div><b>${learningSummary(window.localStorage,state.activeProfile).scienceCompleted ? 'Complete':'Not yet'}</b><span>Science laboratory</span></div><div><b>${learningSummary(window.localStorage,state.activeProfile).wordStars}</b><span>Word Stars · separate</span></div><div><b>Disabled</b><span>Reward Credits</span></div></div>${button('curriculum', 'Explore Year 1–6 planning map', 'secondary')}<details open><summary>Skill evidence and review schedule</summary><div class="skill-table"><table><thead><tr><th>Skill</th><th>State</th><th>Independent days</th><th>Next review</th></tr></thead><tbody>${[
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
      )}</tbody></table></div><p class="muted">Review intervals: 1, 3, 7, 14, 30 days. Secure requires at least four independent days including three later reviews. A clue or correction records supported practice. This is learning evidence, not a formal assessment. Word checks assess meaning in context; independent spoken or written vocabulary use has not been assessed.</p></details><details><summary>Original narration and audio import</summary><p>The supplied narrator is bundled (160.4 seconds). A replacement is local only and must be the same recording. Source cue positions remain provisional until checked by listening.</p><label>Choose original WAV or MP3<input type="file" id="audio-file" accept="audio/wav,audio/mpeg"></label><p id="upload-feedback" role="status"></p><div class="choices">${words.map((w) => button('hear-' + w.id, esc(w.label), 'quiet')).join('')}</div></details><details><summary>Import a lesson and preview</summary><p>Version 1 supports local text and vocabulary quests with one decision challenge. Images, multi-scene audio authoring and online publishing are future work.</p>${button('template', 'Download lesson template', 'secondary')}<label>Lesson JSON (up to 100 KB)<input id="lesson-file" type="file" accept=".json,application/json"></label><div id="lesson-preview"></div></details><details><summary>Adventure reward settings</summary><p>XP is separate from mastery. Repeat completions cannot farm XP. Reward Credits and device control are disabled.</p><form id="xp-form"><label>Mission XP<input id="mission-xp" type="number" min="0" max="50" value="${state.settings.missionXP}"></label><label>Independent understanding XP<input id="independent-xp" type="number" min="0" max="20" value="${state.settings.independentXP}"></label><label>New application XP<input id="application-xp" type="number" min="0" max="20" value="${state.settings.applicationXP}"></label><button class="secondary">Save XP rules</button></form></details><details><summary>Local learning activity</summary><p>Try a 10–15 minute session with Adam. Record whether wording, the visual model or unfamiliar content was the obstacle. The app cannot infer his experience from clicks alone.</p><p>${profile().events?.filter((e: any) => e.at >= Date.now() - 7 * 86400000).length || 0} learning events in the last 7 days. ${(profile().events || []).filter((e: any) => e.type === 'skill_attempted' && e.correct).length} correct recorded skill attempts.</p><p class="muted">At most 500 events per explorer are kept. Active-time estimates count only short intervals between learning actions while visible; they are not surveillance or proof of attention.</p><div class="event-list">${(
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
      )}</div></details><details><summary>Private backup and device data</summary>${button('export-progress', 'Export ALL local progress', 'secondary')}${button('delete-progress', 'Reset all device learning progress', 'quiet')}<p class="muted">This resets every explorer’s on-device Adventure XP, maths answers, science experiment and Word Kingdom stars/reviews. It does not delete Supabase cloud progress, approved lessons or external backups. Cloud deletion requires separate parent-authorised management.</p><p>No child account, microphone access, advertising or trackers. Optional private device saves are available through Secure family learning; they require an explicit parent Save or Restore. Speaking practice is optional and is never scored. Support for a stammer itself should be guided by a qualified speech and language therapist.</p></details>`,
  );
  const totals=learningSummary(window.localStorage,state.activeProfile);
  document.querySelector('#overlay .parent-stats')?.insertAdjacentHTML('afterend',`<details class="xp-rules"><summary>How the adventure points connect</summary><p>One Adventure XP total across local stories, maths, Word Kingdom, science and linked approved cloud missions.</p><p><b>${totals.localXP} local XP + ${totals.cloudXP} confirmed cloud XP = ${totals.xp} Adventure XP</b></p><p>Stories and maths use the rules below. Completing all independent Word Kingdom activities for a word gives 3 Adventure XP once; the science investigation gives 10 once. Word Stars track word practice separately. Opening cards and replaying audio earn no XP. Reward Credits remain disabled.</p><p class="muted">Cloud totals use the last authenticated server snapshot, matched only to one explorer with the same name and school year. Reconnecting refreshes the snapshot without granting points again.</p></details>`);
  const insight = parentInsights();
  const stats = document.querySelector('#overlay .parent-stats');
  stats?.insertAdjacentHTML('afterend', `<section class="parent-insight"><span class="eyebrow">THIS WEEK · LOCAL LEARNING SIGNALS</span><h3>Recommended next step</h3><p>${esc(insight.recommendation)}</p><div><span><b>${insight.recent}</b> skill attempts</span><span><b>${insight.supported}</b> needed a clue or retry</span><span><b>${insight.due.length}</b> maths reviews due</span></div><h4>Record a quick observation</h4><p class="muted">Choose only what you observed. No free-text answer or voice recording is stored.</p><div class="choices">${button('observe-independent','Understood independently','quiet')}${button('observe-language','Question wording needed explaining','quiet')}${button('observe-model','A visual maths model helped','quiet')}${button('observe-unfamiliar','Topic was unfamiliar','quiet')}</div><p id="observation-status" role="status"></p></section>`);
  if (stats?.nextElementSibling) bind(stats.nextElementSibling);
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
  custom.vocabulary.forEach(w=>discoverWord(window.localStorage,state.activeProfile,w,custom!.title));
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
    restoreLocalProgress: () => {state=load(storage);},
    refreshCloudProgress: async () => {
      const cloud = await import('./cloud');
      await cloud.restoreCloudSession(cloudHooks());
    },
    setView: (v: string) => {
      view = v;
    },
    setCloudMissions: (missions: { id: string; title: string }[]) => {
      cloudMissions = missions;
      try {
        storage.setItem(CLOUD_MISSION_CACHE, JSON.stringify(missions));
      } catch {}
    },
  };
}
async function action(id: string, b: HTMLButtonElement) {
  if(id==='daily'){closeDialog();daily();return;}
  if(id==='daily-words'||id==='notebook-review'){notebookReview();return;}
  if(id.startsWith('notebook-one:')){const term=id.slice(13),w=notebookWords(window.localStorage,state.activeProfile).find((x:any)=>x.term===term);if(w){notebookQueue=[w];notebookIndex=0;drawNotebookReview();}return;}
  if(id==='daily-maths'){const index=recommendedMathIndex();if(index===0)startBeacon();else maths(index);return;}
  if(id==='beacon'){startBeacon();return;}
  if(id==='daily-discovery'){closeDialog();openDialog('Choose a discovery',`<p>Continue a familiar adventure or explore an approved mission. Completing learning, rather than opening it, marks this step.</p>${button('mission','The missing trophy','secondary')}${button('science','The dissolving mystery','secondary')}${cloudMissions.map(m=>button('cloud-mission:'+esc(m.id),esc(m.title),'secondary')).join('')}`);return;}
  if(id==='beacon-next'){beaconStage++;beaconAssisted=false;drawBeacon();return;}
  if(id==='beacon-hint'){beaconAssisted=true;const e=beaconExample(beaconStage,beaconDay);document.querySelector('#beacon-feedback')!.textContent=`The ${e.column} column counts groups of ${e.unit.toLocaleString('en-GB')}. Multiply ${e.digit} by ${e.unit.toLocaleString('en-GB')}.`;return;}
  if(id==='notebook-next'){notebookIndex++;drawNotebookReview();return;}
  if(id==='notebook-review-hear'){if(!window.speechSynthesis){toast('Device speech is unavailable. Use the written example.');return;}const u=new SpeechSynthesisUtterance(notebookQueue[notebookIndex].term);u.lang='en-GB';u.voice=speechSynthesis.getVoices().find(v=>v.lang==='en-GB')||null;speechSynthesis.cancel();speechSynthesis.speak(u);return;}
  if(id==='notebook-help'){notebookAssisted=true;const w=notebookQueue[notebookIndex];document.querySelector('#notebook-feedback')!.textContent=`${w.term}: ${w.definition} ${w.example}`;return;}
  if(id.startsWith('notebook-choice:')){checkNotebook(id.slice(16)===notebookQueue[notebookIndex].term);return;}
  if(id.startsWith('notebook-part:')){const n=Number(id.slice(14));if(!notebookChosen.includes(n)){notebookChosen.push(n);b.disabled=true;document.querySelector('#notebook-sentence')!.textContent=notebookChosen.map(i=>notebookQueue[notebookIndex].example.trim().split(/\s+/).reverse()[i]).join(' ');}return;}
  if(id==='notebook-undo'){const n=notebookChosen.pop();document.querySelector<HTMLButtonElement>(`[data-action="notebook-part:${n}"]`)?.removeAttribute('disabled');document.querySelector('#notebook-sentence')!.textContent=notebookChosen.map(i=>notebookQueue[notebookIndex].example.trim().split(/\s+/).reverse()[i]).join(' ');return;}
  if(id==='notebook-check'){checkNotebook(notebookChosen.map(i=>notebookQueue[notebookIndex].example.trim().split(/\s+/).reverse()[i]).join(' ')===notebookQueue[notebookIndex].example.trim());return;}
  if(id.startsWith('notebook:')){collectedWord(id.slice(9));return;}
  if(id.startsWith('notebook-hear:')){
    if(!window.speechSynthesis){toast('Device speech is unavailable. The meaning is written above.');return;}
    window.speechSynthesis.cancel();const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase()==='en-gb');
    const utterance=new SpeechSynthesisUtterance(id.slice(14));utterance.lang='en-GB';utterance.voice=voice||null;utterance.rate=.9;window.speechSynthesis.speak(utterance);return;
  }

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
    state=load(storage);map();
    return;
  }
  if (id === 'words') {
    window.location.assign('/adam/words/');
    return;
  }
  if (id === 'science') {
    window.location.assign('/adam/science/');
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
  if (id.startsWith('observe-')) {
    const kind = id.slice(8);
    if (['independent','language','model','unfamiliar'].includes(kind)) {
      recordEvent(state, `parent_observation_${kind}`, { status: 'observed' });
      save();
      const note = document.querySelector('#observation-status');
      if (note) note.textContent = 'Observation saved on this device. It will inform the next review choice.';
    }
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
    hinted = true;
    feedback(currentPuzzles()[mathIndex].language);
    return;
  }
  if (id === 'piece') {
    b.classList.toggle('lit');
    b.setAttribute('aria-pressed', String(b.classList.contains('lit')));
    return;
  }
  if (id === 'extension' && mathSolved) {
    mathExtension = true;
    hinted = false;
    document.querySelector('.puzzle-panel h2')!.textContent='Try independently';
    document.querySelectorAll<HTMLElement>('.math-brief,.math-worked,.puzzle-panel .visual-tool').forEach(n=>n.hidden=true);
    document.querySelector('.puzzle-panel .eyebrow')!.textContent='APPLY THE METHOD · A NEW SITUATION';
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
    const local=Object.fromEntries(LOCAL_RESET_KEYS.map(key=>[key,storage.getItem(key)]));
    download('private-all-learning-progress.json',{exportedAt:new Date().toISOString(),scope:'this device only',local});
    return;
  }
  if (id === 'delete-progress') {
    if (
      confirm(
        'Erase ALL device learning progress for EVERY explorer, including Maths, Science, Word Kingdom and Adventure XP? This cannot be undone. Cloud progress remains unchanged. Export a backup first if needed.',
      )
    ) {
      state = fresh();
      resetLocalLearning(window.localStorage,state);
      cloudMissions = [];
      custom = null;
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

if(!storage.getItem(KEY))save();
map();
void import('./cloud')
  .then(async (cloud) => {
    if (await cloud.restoreCloudSession(cloudHooks())) map();
  })
  .catch(() => {});
mediaStore()
  .then((blob) => {
    if (blob) setAudio(URL.createObjectURL(blob));
  })
  .catch(() => {});
