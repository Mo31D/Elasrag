import {collectCloudWord} from '../public/shared/notebook.js';
import type { CloudContent, Hooks } from './cloud';
const esc = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
const btn = (id: string, label: string, cls = 'secondary') =>
  `<button type="button" data-cloud="${id}" class="${cls}">${label}</button>`;
function message(text: string) {
  const node = document.querySelector('#cloud-message');
  if (node) node.textContent = text;
}
function speakBritish(text: string, slow = false) {
  if (!('speechSynthesis' in window)) {
    message('Speech is unavailable in this browser. Use the written word instead.');
    return;
  }
  window.speechSynthesis.cancel();
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.toLowerCase() === 'en-gb') || voices.find((v) => v.lang.toLowerCase().startsWith('en-'));
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB'; utterance.voice = voice || null;
  utterance.rate = slow ? 0.78 : 0.92; utterance.pitch = 1;
  utterance.onerror = () => message('The device voice did not play. Try again or read the text.');
  window.speechSynthesis.speak(utterance);
  message(voice?.lang.toLowerCase().startsWith('en-gb') ? 'Playing the British English voice installed on this device.' : 'Playing the best English voice available on this device.');
}
export function feelingIllustration(word: string) {
  const mouth =
    word === 'relieved' || word === 'confident'
      ? 'M22 40Q32 52 42 40'
      : 'M22 43Q32 35 42 43';
  return `<svg viewBox="0 0 64 64" role="img" aria-label="${esc(word)} feeling illustration"><circle cx="32" cy="32" r="27" fill="#f2d28e" stroke="#426d69" stroke-width="2"/><path d="M18 21L26 24M38 24L46 21" stroke="#426d69" stroke-width="3"/><circle cx="23" cy="30" r="3" fill="#264f52"/><circle cx="41" cy="30" r="3" fill="#264f52"/><path d="${mouth}" fill="none" stroke="#264f52" stroke-width="3" stroke-linecap="round"/>${word === 'curious' || word === 'puzzled' ? '<text x="48" y="15" font-size="18" fill="#426d69">?</text>' : ''}</svg>`;
}
// Reusable data-driven mission template; only an approved immutable lesson is accepted.
export function playCloudLesson(
  row: any,
  student: any,
  hooks: Hooks,
  gateway: {
    request: (action: string, args: Record<string, unknown>) => Promise<any>;
  },
) {
  if (row.status !== 'approved') throw Error('An approved lesson is required.');
  const l = row.content as CloudContent;
  if (
    l.template !== 'feeling-detective-v1' ||
    !Array.isArray(l.story) ||
    !Array.isArray(l.sentenceParts)
  )
    throw Error('Unsupported lesson template');
  let scene = 0,
    stage: 'story' | 'word' | 'vocabulary' | 'sentence' | 'complete' = 'story',
    assisted = false,
    selected: number[] = [],
    busy = false,
    totalXP = 0,
    activeMs = 0,
    lastAction = 0;
  const requests = new Map<string, string>();
  hooks.closeDialog();
  hooks.setView('cloud');
  const show = () => {
    if(stage==='word') collectCloudWord(window.localStorage,student,row);
    hooks.shell(
      `<section class="cloud-expedition"><img class="cloud-world-art" src="/adam/assets/atlas.svg" alt="The adventure islands"><div class="cloud-story-card"><p class="eyebrow">${esc(student.nickname)} / ENGLISH EXPEDITION</p><h1>${esc(l.title)}</h1>${
        stage === 'story'
          ? `<img class="cloud-characters" src="/adam/assets/characters.svg" alt="Maya and Leo, the school detectives"><p class="cloud-story">${esc(l.story[scene])}</p>${btn('continue', scene < l.story.length - 1 ? 'Explore the next clue →' : 'Discover the word →', 'primary')}`
          : stage === 'word'
            ? `<div class="word-illustration">${feelingIllustration(l.word)}</div><h2>${esc(l.word)}</h2><p>${esc(l.definition)}</p><blockquote>${esc(l.example)}</blockquote><div class="choices">${btn('hear-word','♫ Hear word')}${btn('hear-slow','Slower')}${btn('hear-example','Hear example')}</div><p class="muted">Device-generated speech is a fallback, not approved studio audio. No recording or network call is used.</p>${btn('practice', 'Try without the model →', 'primary')}`
            : stage === 'vocabulary'
              ? `<p>${esc(l.question)}</p><div class="choices">${l.choices.map((c, i) => btn('answer:' + i, esc(c))).join('')}</div>${btn('hint', 'A little help', 'quiet')}`
              : stage === 'sentence'
                ? `<p>Rebuild the detective's report. Tap a chosen piece to return it.</p><div class="sentence-output">${selected.map((n, i) => btn('undo:' + i, esc(l.sentenceParts[n]))).join('') || 'Your sentence goes here…'}</div><div class="blocks">${[
                    3, 1, 0, 2,
                  ]
                    .filter((n) => !selected.includes(n))
                    .map((n) => btn('part:' + n, esc(l.sentenceParts[n])))
                    .join(
                      '',
                    )}</div><div class="choices">${btn('check', 'Seal the report', 'primary')}${btn('hint', 'Show a model', 'quiet')}</div><p class="muted">Optional: say your idea, think it, or explain it to someone. There is no timer or speech score.</p>`
                : `<div class="award-title">✦ EXPEDITION COMPLETE</div><p>You connected a word with its meaning and rebuilt an explanation.</p><p>${totalXP} Adventure XP saved securely in this session. Review evidence is saved for ${esc(student.nickname)}.</p>${btn('return', 'Return to the atlas', 'primary')}`
      }<p id="cloud-message" class="feedback" role="status"></p><p class="muted">${stage === 'complete' ? '' : 'Progress is recorded only when your answer reaches the server. '}This generated mission currently uses text and illustrations. Episode 1 keeps its original narration.</p></div></section>`,
      'Family expedition',
      student.nickname,
    );
    document.querySelectorAll<HTMLButtonElement>('[data-cloud]').forEach(
      (b) =>
        (b.onclick = async () => {
          const action = b.dataset.cloud!;
          if (busy) return;
          const now = Date.now();
          if (lastAction && !document.hidden && now - lastAction < 30000)
            activeMs = Math.min(30000, activeMs + now - lastAction);
          lastAction = now;
          if (action === 'return') {
            try {await hooks.refreshCloudProgress?.();} catch {}
            hooks.map();
            return;
          }
          if (action === 'hear-word' || action === 'hear-slow' || action === 'hear-example') {
            speakBritish(action === 'hear-example' ? l.example : l.word, action === 'hear-slow');
            return;
          }
          if (action === 'practice') {
            stage = 'vocabulary';
            show();
            return;
          }
          if (action === 'continue') {
            if (scene < l.story.length - 1) scene++;
            else stage = 'word';
            show();
            return;
          }
          if (action === 'hint') {
            assisted = true;
            message(stage === 'sentence' ? l.sentenceParts.join(' ') : l.hint);
            return;
          }
          if (action.startsWith('part:')) {
            selected.push(Number(action.slice(5)));
            show();
            return;
          }
          if (action.startsWith('undo:')) {
            selected.splice(Number(action.slice(5)), 1);
            show();
            return;
          }
          if (action.startsWith('answer:') || action === 'check') {
            if (action === 'check' && selected.length !== 4) {
              message('Choose all four parts first.');
              return;
            }
            const kind = stage === 'vocabulary' ? 'vocabulary' : 'sentence',
              answer =
                kind === 'vocabulary'
                  ? Number(action.slice(7))
                  : selected.slice();
            const key = JSON.stringify({ kind, answer, assisted });
            if (!requests.has(key)) requests.set(key, crypto.randomUUID());
            busy = true;
            lastAction = 0;
            b.disabled = true;
            try {
              const result = await gateway!.request('attempt', {
                studentId: student.id,
                lessonId: row.id,
                attemptId: requests.get(key),
                kind,
                answer,
                assisted,
                activeMs,
              });
              activeMs = 0;
              totalXP += result.xp || 0;
              if(result.correct) {collectCloudWord(window.localStorage,student,row,true);try {await hooks.refreshCloudProgress?.();} catch {}}
              if (!result.correct) {
                assisted = true;
                message(
                  kind === 'vocabulary'
                    ? l.hint
                    : 'Begin with I felt, then the feeling, because and its reason.',
                );
              } else {
                stage = kind === 'vocabulary' ? 'sentence' : 'complete';
                assisted = false;
                show();
              }
            } catch (e) {
              message(
                (e as Error).message +
                  ' Your answer has not been confirmed. You may retry.',
              );
            } finally {
              busy = false;
              b.disabled = false;
            }
          }
        }),
    );
  };
  show();
}
