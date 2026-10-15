import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { WORDS, STAGES, ART_BIBLE } from '../../words/words-data.js';
import { artSvg } from '../../words/art.js';
import { DFE_34_ENTRIES,DFE_56_ENTRIES,DFE_34_VARIANTS,DFE_56_VARIANTS,DFE_Y1_EXCEPTION_EXAMPLES,DFE_Y2_EXCEPTION_EXAMPLES } from '../../words/curriculum-dfe.js';
import { curriculumLinks,belongsToBand,sourceLabel,CURRICULUM_BANDS } from '../../words/curriculum-index.js';

test('starter dictionary has unique reviewed-shaped entries across Reception through Year 6', () => {
  assert.ok(WORDS.length>=560);
  assert.equal(STAGES.length,7);
  assert.equal(new Set(WORDS.map(w=>w.id)).size,WORDS.length);
  for(let year=0;year<=6;year++) assert.ok(WORDS.filter(w=>w.stage===year).length>=45);
  for(const w of WORDS){
    assert.match(w.id,/^[a-z][a-z0-9-]*$/);
    assert.match(w.term,/^[A-Za-z]+$/);
    assert.ok(w.definition.length>8);
    assert.ok(w.example.toLowerCase().includes(w.term.toLowerCase()));
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
  assert.equal(document.querySelectorAll('[data-filter]').length,8);
  assert.ok(document.querySelector('.wk-star').textContent.includes('0'));
  assert.equal(document.querySelector('#wk-profile').value,'explorer');
});
test('school language is a distinct reviewed collection, not statutory spelling or enrichment',()=>{
 const selector=document.querySelector('#wk-collection');selector.value='school';
 selector.dispatchEvent(new window.Event('change',{bubbles:true}));
 assert.equal(document.querySelector('#wk-collection').value,'school');
 assert.ok(document.querySelectorAll('[data-open]').length>0);
 assert.match(document.querySelector('.wk-word .wk-stage').textContent,/School vocabulary/);
 selector.value='curriculum';selector.dispatchEvent(new window.Event('change',{bubbles:true}));
});
test('opens word and shows independent learning tasks without recording speech',()=>{
  document.querySelector('[data-open]').click();
  assert.ok(document.querySelector('.wk-focus-layer'));
  assert.ok(document.querySelector('.wk-living-card'));
  assert.equal(document.querySelector('[data-task="spelling"]'),null);
  document.querySelector('#wk-flip').click();
  assert.ok(document.querySelector('#wk-practise'));
  document.querySelector('#wk-practise').click();
  assert.ok(document.querySelector('[data-task="spelling"]'));
  assert.ok(!document.querySelector('input[type="file"]'));
  assert.ok(!document.querySelector('[data-record]'));
});
test('spelling can be checked without voice scoring and first correct earns word stars',()=>{
  const selectedWord = document.querySelector('.wk-word-info h1').textContent.trim().toLowerCase();
  document.querySelector('[data-task="spelling"]').click();
  document.querySelector('#wk-spell').value='wrong';
  document.querySelector('#wk-spell-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  assert.ok(document.querySelector('.wk-feedback.retry'));
  document.querySelector('#wk-again').click();
  document.querySelector('#wk-spell').value=selectedWord;
  document.querySelector('#wk-spell-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  assert.ok(document.querySelector('.wk-feedback.good'));
  assert.ok(document.querySelector('.wk-feedback').textContent.includes('+2 word stars'));
  document.querySelector('#wk-again').click();
  document.querySelector('#wk-spell').value=selectedWord;
  document.querySelector('#wk-spell-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  assert.ok(!document.querySelector('.wk-feedback').textContent.includes('+2 word stars'));
  assert.equal(JSON.parse(localStorage.getItem('ala-word-kingdom-v1')).learners.explorer.stars,2);
});

test('game link returns to existing Adam Atlas, and stage filters are cumulative',()=>{
 document.querySelector('#wk-to-map').click();
 document.querySelector('[data-filter="y56"]').click();
 assert.equal(document.querySelectorAll('[data-open]').length,12);
 assert.equal(document.querySelector('.wk-back').getAttribute('href'),'/adam/');
 document.querySelector('[data-filter="all"]').click();
 assert.equal(document.querySelectorAll('[data-open]').length,12); // first page of expanded lexicon
 assert.ok(document.querySelector('.wk-section-bar').textContent.includes('collection'));
});

test('theme options never offer an empty stage and counts reflect selected year',()=>{
 document.querySelector('[data-filter="eyfs"]').click();
 const available=new Map();
 for(const w of WORDS.filter(w=>belongsToBand(w,'eyfs')))available.set(w.theme,(available.get(w.theme)||0)+1);
 const options=[...document.querySelectorAll('#wk-theme option')].slice(1);
 assert.equal(options.length,available.size);
 for(const option of options){
   assert.equal(option.textContent,option.value+' ('+available.get(option.value)+')');
 }
});

test('two-year DfE statutory lists have exactly 100 entries each without assigning individual school years',()=>{
 assert.equal(DFE_34_ENTRIES.length,100);
 assert.equal(DFE_56_ENTRIES.length,100);
 assert.equal(new Set(DFE_34_ENTRIES).size,100);
 assert.equal(new Set(DFE_56_ENTRIES).size,100);
 assert.equal(CURRICULUM_BANDS.find(x=>x.id==='y34').label,'Years 3–4');
 assert.equal(CURRICULUM_BANDS.find(x=>x.id==='y56').label,'Years 5–6');
});
test('DfE classifications distinguish statutory words from non-statutory examples and enrichment',()=>{
 const a=WORDS.find(w=>w.id==='accommodate');
 const b=WORDS.find(w=>w.id==='unhappy');
 const c=WORDS.find(w=>w.id==='strategy');
 assert.ok(curriculumLinks(a).some(s=>s.kind==='statutory'&&s.stage===5));
 assert.ok(curriculumLinks(b).some(s=>s.kind==='dfe-example'&&s.stage===1));
 assert.ok(!curriculumLinks(c).length);
 assert.match(sourceLabel(a),/DfE statutory/);
 assert.match(sourceLabel(b),/DfE example/);
 assert.match(sourceLabel(c),/Extra practice/);
});
test('No new curriculum-specific word was fabricated outside official DfE lists or spelling examples',()=>{
 const accepted=new Set(WORDS.filter(w=>curriculumLinks(w).length).map(w=>w.id));
 const newCards=WORDS.filter(w=>w.theme==='Foundation English'||w.theme==='Spelling & vocabulary');
 assert.ok(newCards.length>=200);
 assert.ok(newCards.every(w=>accepted.has(w.id)));
});
test('a parent can opt into enrichment while official curriculum remains default',()=>{
 document.querySelector('[data-filter="all"]').click();
 assert.equal(document.querySelector('#wk-collection').value,'curriculum');
 const noCuration=WORDS.filter(w=>w.stage!==0&&!curriculumLinks(w).length);
 assert.ok(noCuration.length>0);
 const selector=document.querySelector('#wk-collection');selector.value='extra';
 selector.dispatchEvent(new window.Event('change',{bubbles:true}));
 assert.ok(document.querySelectorAll('[data-open]').length>0);
 assert.match(document.querySelector('.wk-word .wk-stage').textContent,/Extra practice/);
});
test('each linked DfE source points to the government source and the printed page',()=>{
 for(const w of WORDS){
  for(const s of curriculumLinks(w)){
    assert.ok(s.source.startsWith('https://assets.publishing.service.gov.uk/'));
    assert.ok(s.page>=40&&s.page<=61);
  }
 }
});

test('every statutory list entry is represented by at least one complete word card',()=>{
 for(const [list,variants] of [[DFE_34_ENTRIES,DFE_34_VARIANTS],[DFE_56_ENTRIES,DFE_56_VARIANTS]]){
   for(const entry of list){
     const possibilities=variants[entry]||[entry.toLowerCase()];
     assert.ok(possibilities.some(id=>WORDS.some(w=>w.id===id.toLowerCase()&&w.definition&&w.example)),
       'Missing official entry: '+entry);
   }
 }
});
test('provenance is visible in the actual word detail and abstract words cannot have misleading scored images',()=>{
 const collection=document.querySelector('#wk-collection');collection.value='curriculum';
 collection.dispatchEvent(new window.Event('change',{bubbles:true}));
 const search=document.querySelector('#wk-search');search.value='because';
 search.dispatchEvent(new window.Event('input',{bubbles:true}));
 const target=[...document.querySelectorAll('[data-open]')].find(b=>b.dataset.open==='because');
 assert.ok(target);
 target.click();
 document.querySelector('#wk-flip').click();
 document.querySelector('#wk-practise').click();
 assert.ok(document.querySelector('.wk-curriculum-note').textContent.includes('DfE'));
 assert.equal(document.querySelector('[data-task="picture"]'),null);
 document.querySelector('#wk-to-map').click();
});
