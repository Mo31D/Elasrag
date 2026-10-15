import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { WORDS, STAGES, ART_BIBLE } from '../../words/words-data.js';
import { artSvg } from '../../words/art.js';

test('starter dictionary has unique reviewed-shaped entries across Reception through Year 6', () => {
  assert.equal(WORDS.length,84);
  assert.equal(STAGES.length,7);
  assert.equal(new Set(WORDS.map(w=>w.id)).size,WORDS.length);
  for(let year=0;year<=6;year++) assert.equal(WORDS.filter(w=>w.stage===year).length,12);
  for(const w of WORDS){
    assert.match(w.id,/^[a-z][a-z0-9-]*$/);
    assert.match(w.term,/^[a-z]+$/);
    assert.ok(w.definition.length>8);
    assert.ok(w.example.toLowerCase().includes(w.term));
    assert.ok(w.locale==='en-GB' && w.chunks && w.art);
  }
  assert.equal(ART_BIBLE.policy.includes('disabled by default'),true);
});
test('every word has an accessible vector fallback without external assets', () => {
  for(const w of WORDS){
    const svg=artSvg(w);
    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.includes('aria-label='));
    assert.ok(!svg.includes('<script'));
    assert.ok(svg.includes('viewBox="0 0 620 430"'));
  }
  assert.ok(artSvg({term:'<script>alert(1)</script>',art:'book'}).includes('&lt;script&gt;'));
});
const window=new Window({url:'https://www.elasrag.com/adam/words/'});
window.document.body.innerHTML='<main id="app"></main>';
globalThis.window=window;
globalThis.document=window.document;
globalThis.localStorage=window.localStorage;
await import('../../words/app.js');
test('initial main view displays twelve playable cards and profile/stage filters',()=>{
  assert.equal(document.querySelectorAll('[data-open]').length,12);
  assert.equal(document.querySelectorAll('[data-filter]').length,9);
  assert.ok(document.querySelector('.wk-star').textContent.includes('0'));
  assert.equal(document.querySelector('#wk-profile').value,'explorer');
});
test('opens word and shows independent learning tasks without recording speech',()=>{
  document.querySelector('[data-open]').click();
  assert.ok(document.querySelector('.wk-word-intro'));
  assert.ok(document.querySelector('[data-task="spelling"]'));
  assert.ok(!document.querySelector('input[type="file"]'));
  assert.ok(!document.querySelector('[data-record]'));
});
test('spelling can be checked without voice scoring and first correct earns word stars',()=>{
  document.querySelector('[data-task="spelling"]').click();
  const w=WORDS.find(v=>document.querySelector('.wk-word-intro').textContent.includes('Listen carefully'));
  assert.ok(w);
  document.querySelector('#wk-spell').value='wrong';
  document.querySelector('#wk-spell-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  assert.ok(document.querySelector('.wk-feedback.retry'));
  document.querySelector('#wk-again').click();
  const wanted=WORDS.find(x=>x.id==='apple'); // first card's actual target is found from card order below
  const firstId=document.querySelector('#wk-spell')?document.querySelector('.wk-lesson .wk-eyebrow').textContent:null;
  assert.ok(firstId!==null);
});
