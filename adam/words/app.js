import {creditLearning} from '../shared/learning-progress.js';
import {WORDS,STAGES,ART_BIBLE} from './words-data.js';
import {artSvg} from './art.js';
import {curriculumLinks,curriculumYear,belongsToBand,sourceLabel,CURRICULUM_BANDS} from './curriculum-index.js';
import {approvedClip} from './approved-audio.js';
const ROOT='/adam/words/';
const STORE='ala-word-kingdom-v1';
const ALLOWED_PICTURE=new Set(['apple','book','cat','chair','door','house','school','heart','rain','sun','owl','key','magnify','clock','people','map','science','leaf','stars']);
const FACETS=['meaning','spelling','sentence','picture'];
// Only use picture recognition where the pictogram itself clearly identifies the target word.
// Other words still have illustration cues, but cannot win/lose a skill from an ambiguous icon.
const ASSESSABLE_PICTURES=Object.freeze({apple:'apple',book:'book',cat:'cat',chair:'chair',door:'door',school:'school',sun:'sun',rain:'rain',heart:'heart'});
const pictureSkills=w=>ASSESSABLE_PICTURES[w.id]===w.art;
const facetsFor=w=>pictureSkills(w)?FACETS:FACETS.filter(x=>x!=='picture');
const INTERVALS=[1,3,7,14,30];
const root=document.querySelector('#app');
const esc=(value)=>String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const day=(stamp)=>new Date(stamp).toISOString().slice(0,10);
const isoDate=()=>new Date().toISOString().slice(0,10);
const dateMs=(days)=>Date.now()+days*86400000;
const nameStage=(year)=>STAGES[year] || 'Year 6';
const safeParse=(raw)=>{try{return JSON.parse(raw)}catch{return null}};
const pick=(items,seed)=>[...items].sort((a,b)=>score(a,seed)-score(b,seed));
function score(value,seed){const text=String(seed)+'|'+String(typeof value==='string'?value:value.term || value.definition || value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0;}
const getLocal=()=>{try{return localStorage.getItem(STORE)}catch{return null}};
const setLocal=(v)=>{try{localStorage.setItem(STORE,JSON.stringify(v));return true}catch{return false}};
const detectProfiles=()=>{
 const data=safeParse((()=>{try{return localStorage.getItem('ala-adventure-v1')}catch{return null}})());
 const entries=Object.entries(data?.profiles || {}).filter(([id,p])=>/^[a-z0-9-]{3,60}$/.test(id) && p && typeof p.displayName==='string' && Number.isInteger(p.year) && p.year>=1 && p.year<=6);
 return {entries:entries.length?entries:[['explorer',{displayName:'Adam',year:6}]],active:data?.activeProfile || 'explorer'};
};
const existing=safeParse(getLocal());
const initialProfiles=detectProfiles();
const stored=existing && existing.version===1 && existing.learners && typeof existing.learners==='object' ? existing:{version:1,learners:{}};
let profileId=initialProfiles.entries.some(([id])=>id===initialProfiles.active)?initialProfiles.active:initialProfiles.entries[0][0];
const requestedCollection=new URLSearchParams(window.location.search).get('collection');
let view='library', filter='all', collection=['curriculum','school','extra','all'].includes(requestedCollection)?requestedCollection:'curriculum', theme='all', query='', page=0, selected=null,task='learn',question=null,feedback=null,assisted=false,letterHint=false,streak=0, busy=false,flipped=false,returnScrollY=0,returnFocus=null;
let sound=true,motion=!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let activeGoogleAudio=null;
let cachedVoices=[];
const refreshVoices=()=>{cachedVoices=window.speechSynthesis?.getVoices?.()||[]};
refreshVoices();
if(window.speechSynthesis)window.speechSynthesis.addEventListener?.('voiceschanged',refreshVoices);

function student(){return initialProfiles.entries.find(([id])=>id===profileId)?.[1]||{displayName:'Adam',year:6}}
function progress(){return stored.learners[profileId] ||= {words:{},stars:0}}
function record(word,facet){const wr=progress().words[word.id] ||= {};return wr[facet] ||= {strength:0,days:0,reviewCount:0,lastDay:null,due:0,awarded:false}}
function save(){if(!setLocal(stored))status('Progress cannot be saved in this browser. Your session may be private.')}
function rating(word,facet){let t=record(word,facet);if(!t.strength)return 'New';if(t.due && t.due<=Date.now())return 'Review due';return t.days>=4 && t.reviewCount>=3?'Secure':'Practising'}
function belongsToCollection(w){
 const refs=curriculumLinks(w);
 if(collection==='all')return true;
 if(collection==='school')return w.school===true;
 if(collection==='extra')return w.stage!==0&&!refs.length&&w.school!==true;
 return !!refs.length||w.stage===0||w.school===true;
}
function canStudy(w){return curriculumYear(w)<=student().year}
function scopedWords(){return WORDS.filter(w=>canStudy(w)&&belongsToCollection(w))}
function dueCount(){return scopedWords().reduce((n,w)=>n+facetsFor(w).filter(f=>record(w,f).due>0&&record(w,f).due<=Date.now()).length,0)}
function wordStat(w){return facetsFor(w).filter(f=>record(w,f).days>=1).length}
function cardState(w){
 const ratings=facetsFor(w).map(f=>rating(w,f));
 if(ratings.every(x=>x==='Secure'))return 'mastered';
 if(ratings.some(x=>x==='Review due'))return 'review';
 if(ratings.some(x=>x!=='New'))return 'learning';
 return 'new';
}
function stageCount(id){return scopedWords().filter(w=>belongsToBand(w,id)).length}
function dailyWords(){
 const eligible=scopedWords(),seed=profileId+'|'+isoDate();
 const due=pick(eligible.filter(w=>facetsFor(w).some(f=>rating(w,f)==='Review due')),seed+'due');
 const learning=pick(eligible.filter(w=>!due.includes(w)&&cardState(w)==='learning'),seed+'learning');
 const fresh=pick(eligible.filter(w=>!due.includes(w)&&!learning.includes(w)),seed+'fresh');
 return [...due,...learning,...fresh].slice(0,6);
}
function wordScope(){const daily=new Set(dailyWords().map(w=>w.id));return scopedWords().filter(w=>filter==='all'||filter==='daily'&&daily.has(w.id)||filter==='due'&&facetsFor(w).some(f=>rating(w,f)==='Review due')||belongsToBand(w,filter)&&!['all','daily','due'].includes(filter))}
function currentThemeCounts(){const counts=new Map(); for(const w of wordScope())counts.set(w.theme,(counts.get(w.theme)||0)+1);return counts}
function ensureValidTheme(){const counts=currentThemeCounts();if(theme!=='all'&&!counts.has(theme))theme='all'}
function storeAnswer(word,facet,correct,helped){
 const rec=record(word,facet),today=isoDate();
 if(correct && !helped){
  if(rec.lastDay!==today){if(rec.days>0 && rec.due<=Date.now())rec.reviewCount++;rec.days++;rec.lastDay=today;}
  rec.strength=Math.min(5,rec.strength+1);
  rec.due=dateMs(INTERVALS[Math.min(rec.reviewCount,4)]);
  if(!rec.awarded){rec.awarded=true;progress().stars+=2;}
 }else{
  rec.strength=Math.max(0,rec.strength-1);
  rec.due=dateMs(1);
 }
 save();
 return correct&&!helped;
}
function status(text){const el=document.querySelector('#status');if(el)el.textContent=text;}
function selectedWords(){
 ensureValidTheme();
 return wordScope().filter(w=>(theme==='all'||w.theme===theme)&&(!query||[w.term,w.definition,w.example,w.theme].join(' ').toLowerCase().includes(query.trim().toLowerCase())))
 .sort((a,b)=>curriculumYear(a)-curriculumYear(b)||a.term.localeCompare(b.term,'en-GB'));
}
function layout(body){
 root.innerHTML='<div class="kingdom"><header class="wk-top"><a href="/adam/" class="wk-back" aria-label="Return to Adventure Atlas">← <span>Adventure Atlas</span></a><div class="wk-brand"><span class="wk-crest">W</span><span><b>WORD KINGDOM</b><small>ADAM LEARNING ADVENTURES</small></span></div><div class="wk-stats"><span class="wk-star" aria-label="Word stars">✦ '+progress().stars+' <small>word stars</small></span><button class="wk-icon" id="wk-access" aria-label="Display options" title="Display options">⚙</button></div></header>'+body+'<footer class="wk-footer"><span>Learn • Listen • Spell • Build • Recall</span><a href="/adam/">Return to Adventure Atlas ↗</a><a href="/adam/words/studio/" aria-label="Parent-only audio review studio">Parent audio studio ↗</a><span>Word Kingdom v2</span></footer><div class="wk-toast" id="status" aria-live="polite"></div></div>';
 document.querySelector('#wk-access')?.addEventListener('click',()=>{motion=!motion;document.documentElement.classList.toggle('wk-still',!motion);status(motion?'Gentle motion on':'Motion reduced');});
}
function shell(){
 let options=initialProfiles.entries.map(([id,p])=>'<option value="'+esc(id)+'" '+(id===profileId?'selected':'')+'>'+esc(p.displayName)+' · '+nameStage(p.year)+'</option>').join('');
 return '<section class="wk-hero"><div><span class="wk-eyebrow">✦ THE LIVING WORD ATLAS</span><h1>Every word opens <em>a new world.</em></h1><p>Discover the meaning. Hear British English. Practise spelling. Build sentences. Words from your earlier years stay available as you grow.</p><div class="wk-hero-row"><label class="wk-profile">Explorer <select id="wk-profile">'+options+'</select></label><span class="wk-meta">'+scopedWords().length+' words in this collection · '+dueCount()+' reviews due</span></div></div><div class="wk-hero-visual">'+artSvg({art:'book',term:'Magical word book'},'wk-hero-art')+'<span class="wk-hero-spark">✧</span></div></section>'+
 '<div class="wk-chapters"><button data-filter="daily" class="'+(filter==='daily'?'active':'')+'">✦ Today’s trail <small>6 useful words</small></button><button data-filter="all" class="'+(filter==='all'?'active':'')+'">All eligible <small>'+scopedWords().length+' words</small></button>'+CURRICULUM_BANDS.filter(b=>b.minYear<=student().year).map(b=>'<button data-filter="'+b.id+'" class="'+(filter===b.id?'active':'')+'" title="'+esc(b.note)+'">'+esc(b.label)+'<small>'+stageCount(b.id)+' ready cards</small></button>').join('')+'<button data-filter="due" class="'+(filter==='due'?'active':'')+'">↻ Reviews due <small>'+dueCount()+'</small></button></div>';
}
function menu(){
 const list=selectedWords();
 const themeCounts=currentThemeCounts();
 const themes=[...themeCounts.keys()].sort();
 const totalPages=Math.max(1,Math.ceil(list.length/12));
 page=Math.min(page,totalPages-1);
 return shell()+'<section class="wk-main"><div class="wk-section-bar"><div><span class="wk-eyebrow">ENGLAND PRIMARY • REVIEWED COLLECTIONS</span><h2>'+(filter==='all'?'Your growing collection':filter==='due'?'Ready for another look':CURRICULUM_BANDS.find(b=>b.id===filter)?.label||'Word discoveries')+'</h2><p>Choose a card to bring it forward. Meanings and practice stay inside this world.</p></div><div class="wk-search"><label for="wk-collection">Collection</label><select id="wk-collection"><option value="curriculum" '+(collection==='curriculum'?'selected':'')+'>Curriculum + school words</option><option value="school" '+(collection==='school'?'selected':'')+'>School language</option><option value="extra" '+(collection==='extra'?'selected':'')+'>Optional enrichment</option><option value="all" '+(collection==='all'?'selected':'')+'>All learning words</option></select><label for="wk-search">Find a word</label><input id="wk-search" type="search" placeholder="Search words, meanings…" value="'+esc(query)+'" autocomplete="off"/><label for="wk-theme">Theme</label><select id="wk-theme"><option value="all">All themes</option>'+themes.map(t=>'<option value="'+esc(t)+'" '+(theme===t?'selected':'')+'>'+esc(t)+' ('+themeCounts.get(t)+')</option>').join('')+'</select></div></div><div class="wk-grid">'+list.slice(page*12,page*12+12).map(w=>'<button class="wk-word is-'+cardState(w)+'" data-open="'+esc(w.id)+'" aria-label="Open '+esc(w.term)+' card"><div class="wk-card-glow"></div><div class="wk-picture">'+artSvg(w)+'</div><div class="wk-word-meta"><span class="wk-stage">'+esc(sourceLabel(w))+'</span><span class="wk-card-state">'+(cardState(w)==='mastered'?'Mastered':cardState(w)==='review'?'Review due':cardState(w)==='learning'?'Learning':'Undiscovered')+'</span></div><b>'+esc(w.term)+'</b><div class="wk-mastery-track" aria-label="'+wordStat(w)+' of '+facetsFor(w).length+' skills practised"><i style="--progress:'+(wordStat(w)/facetsFor(w).length*100)+'%"></i></div><span class="wk-explore">Tap to reveal <span aria-hidden="true">↻</span></span></button>').join('')+'</div>'+(!list.length?'<div class="wk-empty">No words match this view. Choose another stage or search.</div>':'')+'<div class="wk-pagination"><button id="wk-prev" '+(!page?'disabled':'')+'>← Previous</button><span>Page '+(page+1)+' / '+totalPages+'</span><button id="wk-next" '+(page===totalPages-1?'disabled':'')+'>Next →</button></div></section><section class="wk-bottom"><div><h2>Growing, not guessing.</h2><p>Recognising a word, spelling it, and using it in a sentence are different skills. We keep track of each separately. A slow answer or a repeated sound never loses you points.</p></div><div class="wk-actions"><button id="wk-export">Export learning backup</button><button id="wk-artbrief">Download art briefs</button></div></section>';
}
function wordHeader(w){
 return '<div class="wk-lesson-top"><button class="wk-return" id="wk-to-map">← All words</button><span class="wk-eyebrow">'+esc(sourceLabel(w))+' • '+esc(w.theme)+'</span>'+(curriculumLinks(w).length?'<a class="wk-curriculum-source" href="https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study" target="_blank" rel="noopener noreferrer">DfE source ↗</a>':'<span class="wk-curriculum-source">Editorial learning practice</span>')+'<span class="wk-skillcount">'+wordStat(w)+'/'+facetsFor(w).length+' skills practised</span></div>';
}
function tab(name,caption){return '<button data-task="'+name+'" class="'+(task===name?'active':'')+'">'+caption+'</button>'}
function wordView(){
 const w=selected;
 const learning=task==='learn';
 const list=selectedWords(),index=list.findIndex(x=>x.id===w.id);
 let head='<div class="wk-focus-nav"><button class="wk-return" id="wk-to-map" aria-label="Close card">× <span>Collection</span></button><div><button id="wk-prev-word" '+(index<=0?'disabled':'')+' aria-label="Previous word">←</button><button id="wk-next-word" '+(index<0||index>=list.length-1?'disabled':'')+' aria-label="Next word">→</button></div></div>';
 const conceal=task==='spelling'||task==='picture';
 const img=artSvg(conceal?{art:w.art,term:'A picture hint'}:w,'wk-main-illustration');
 const provenance=curriculumLinks(w);
 const sourceDetails=provenance.length
 ? '<section class="wk-curriculum-note"><span class="wk-eyebrow">Why is this word here?</span><strong>'+esc(sourceLabel(w))+'</strong><p>'+esc(provenance.some(x=>x.kind==='statutory')?'Official spelling-list word for the two-year Key Stage 2 group.':'An example used by the DfE to demonstrate a spelling requirement; the word example itself is not statutory.')+'</p><p>'+provenance.slice(0,3).map(x=>esc(x.group)+(x.pattern?' · '+esc(x.pattern):'')).join(' | ')+'</p><a href="'+esc(provenance[0].source)+'" target="_blank" rel="noopener noreferrer">View original DfE spelling appendix ↗</a></section>'
 : w.school===true
 ? '<section class="wk-curriculum-note"><strong>Useful school language, not a statutory spelling-list word.</strong><p>This reviewed word helps with classroom instructions and subject understanding. Its stage is a gentle starting point, not a test limit.</p></section>'
 : '<section class="wk-curriculum-note"><strong>Contextual practice, not an official DfE word-list requirement.</strong><p>Use this word to build understanding and confidence without treating it as an assessed curriculum target.</p></section>';
 const card='<section class="wk-card-scene" aria-label="Interactive card for '+esc(w.term)+'"><div class="wk-living-card '+(flipped?'is-flipped':'')+'"><div class="wk-card-inner"><article class="wk-card-face wk-card-front" aria-hidden="'+(flipped?'true':'false')+'"><div class="wk-card-rune">✦</div><div class="wk-card-art">'+artSvg(w,'wk-main-illustration')+'</div><span class="wk-eyebrow">'+esc(sourceLabel(w))+'</span><h1 id="wk-card-title">'+esc(w.term)+'</h1><div class="wk-card-footer"><span>'+esc(w.theme)+'</span><span>'+wordStat(w)+'/'+facetsFor(w).length+' skills</span></div></article><article class="wk-card-face wk-card-back" aria-hidden="'+(!flipped?'true':'false')+'"><div class="wk-word-info"><span class="wk-eyebrow">'+esc(w.theme)+' • British English</span><h1>'+(conceal?'<span class="wk-hidden-word">Mystery word</span>':esc(w.term))+'</h1><p class="wk-definition">'+esc(w.definition)+'</p><p class="wk-example">“'+esc(w.example)+'”</p><div class="wk-pronounce"><button id="wk-hear" class="wk-primary">♫ Hear word</button><button id="wk-hear-slow">Slower</button><button id="wk-hear-sentence">Hear example</button></div><p class="wk-audio-note" id="wk-voice-note">Uses the best British voice available on this device. No microphone, recording or network call.</p><button id="wk-practise" class="wk-primary wk-practise">Practise this word →</button></div></article></div></div><button id="wk-flip" class="wk-flip" aria-pressed="'+flipped+'">'+(flipped?'↶ Show picture side':'↻ Turn card over')+'</button></section>';
 let activity='';
 if(learning)activity='';
 else if(task==='meaning')activity=questionMarkup(w,'meaning');
 else if(task==='picture')activity=questionMarkup(w,'picture');
 else if(task==='spelling')activity='<section class="wk-exercise"><span class="wk-eyebrow">SPELLING CASTLE</span><h2>Listen, think, then spell.</h2><p>Type the word you heard. Try on your own or ask for a clue; both are useful practice.</p><form id="wk-spell-form"><label for="wk-spell">Write the word</label><input id="wk-spell" type="text" maxlength="50" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="Your spelling here" required><div class="wk-inline-actions"><button type="submit" class="wk-primary">Check spelling</button><button type="button" id="wk-spell-hint">Show a sound clue</button></div></form>'+(letterHint?'<div class="wk-chunks">'+esc(w.chunks).split('-').map(ch=>'<span>'+esc(ch.replace(/[aeiou]/gi,'•'))+'</span>').join('')+'</div>':'')+'</section>';
 else activity=sentenceMarkup(w);
 const practice=task==='learn'?'':'<section class="wk-practice-dock"><div class="wk-task-tabs">'+tab('meaning','Meaning')+(pictureSkills(w)?tab('picture','Picture'):'')+tab('spelling','Spell it')+tab('sentence','Build a sentence')+'</div>'+activity+'<div id="wk-feedback" class="wk-feedback" aria-live="polite"></div><details class="wk-source"><summary>Curriculum and source details</summary>'+sourceDetails+'</details><div class="wk-gentle">No race. No speech scoring. You choose when to move on.</div></section>';
 return '<section class="wk-lesson" aria-labelledby="wk-card-title">'+head+card+practice+'</section>';
}
function createQuestion(w,kind){
 if(kind==='meaning'){
  const other=pick(WORDS.filter(v=>v.id!==w.id && v.stage<=student().year),w.id+'meaning').slice(0,3);
  return {kind,options:pick([w,...other],w.id+'meaning-order'),correct:w.id};
 }
 const eligible=WORDS.filter(v=>v.id!==w.id&&pictureSkills(v)&&v.art!==w.art&&canStudy(v));
 const others=pick(eligible,w.id+'picture').filter((v,i,a)=>a.findIndex(x=>x.art===v.art)===i).slice(0,3);
 return {kind,options:pick([w,...others],w.id+'picture-order'),correct:w.id};
}
function questionMarkup(w,kind){
 if(!question || question.kind!==kind)question=createQuestion(w,kind);
 const prompt=kind==='picture'?'Tap the picture that matches the word you hear.':'What does this word mean?';
 return '<section class="wk-exercise"><span class="wk-eyebrow">'+(kind==='picture'?'PICTURE DETECTIVE':'MEANING MISSION')+'</span><h2>'+prompt+'</h2><div class="'+(kind==='picture'?'wk-choice-pictures':'wk-choice-definitions')+'">'+question.options.map(v=>'<button class="wk-answer" data-answer="'+esc(v.id)+'" aria-label="'+esc(kind==='picture'?'Picture choice':'Meaning choice')+'">'+(kind==='picture'?artSvg({art:v.art,term:'Picture choice'}):'<span>'+esc(v.definition)+'</span>')+'</button>').join('')+'</div></section>';
}
function shuffledTokens(w){
 const tokens=w.example.match(/[A-Za-z]+(?:['’][A-Za-z]+)?|[.,!?]/g)||[];
 if(tokens.length>16)return tokens.slice(0,16);
 return tokens;
}
function sentenceMarkup(w){
 if(!question || question.kind!=='sentence'){
  const right=shuffledTokens(w);
  const shuffled=pick(right.map((value,id)=>({value,id})),w.id+'sentence');
  question={kind:'sentence',right,shuffled,chosen:[]};
 }
 const q=question;
 return '<section class="wk-exercise"><span class="wk-eyebrow">SENTENCE FACTORY</span><h2>Put the words in the right order.</h2><p>Tap the words one by one. Tap a chosen word to return it.</p><div class="wk-sentence-target" aria-live="polite">'+(q.chosen.length?q.chosen.map(id=>'<button type="button" data-unchose="'+id+'">'+esc(q.right[id])+' ×</button>').join(''):'<em>Your sentence appears here…</em>')+'</div><div class="wk-tiles">'+q.shuffled.filter(v=>!q.chosen.includes(v.id)).map(v=>'<button data-choose="'+v.id+'">'+esc(v.value)+'</button>').join('')+'</div><div class="wk-inline-actions"><button id="wk-sentence-check" class="wk-primary" '+(q.chosen.length!==q.right.length?'disabled':'')+'>Check sentence</button><button id="wk-sentence-help">Show a starting clue</button></div>'+(assisted?'<p class="wk-small">Start with: <strong>'+esc(q.right.slice(0,Math.min(2,q.right.length)).join(' '))+'</strong></p>':'')+'</section>';
}
function render(){
 layout(menu()+(view==='lesson'&&selected?'<div class="wk-focus-layer" role="dialog" aria-modal="true" aria-label="Word card and practice"><button class="wk-focus-backdrop" id="wk-close-backdrop" aria-label="Close word card"></button><div class="wk-focus-panel">'+wordView()+'</div></div>':''));
 bindMenu();
 document.body.classList.toggle('wk-modal-open',view==='lesson'&&!!selected);
 if(view==='lesson'&&selected){
  for(const el of document.querySelectorAll('.wk-top,.wk-hero,.wk-chapters,.wk-main,.wk-bottom,.wk-footer')){el.setAttribute('aria-hidden','true');el.setAttribute('inert','');}
  bindLesson();
 }
}
function bindMenu(){
 document.querySelector('#wk-profile')?.addEventListener('change',e=>{profileId=e.target.value;filter='all';theme='all';collection='curriculum';page=0;render();});
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;page=0;ensureValidTheme();render();}));
 document.querySelector('#wk-search')?.addEventListener('input',e=>{query=e.target.value;page=0;const caret=e.target.selectionStart;render();const el=document.querySelector('#wk-search');el.focus();el.setSelectionRange(caret,caret);});
 document.querySelector('#wk-collection')?.addEventListener('change',e=>{collection=e.target.value;filter='all';theme='all';page=0;render();});
 document.querySelector('#wk-theme')?.addEventListener('change',e=>{theme=e.target.value;page=0;render();});
 document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openWord(b.dataset.open)));
 document.querySelector('#wk-prev')?.addEventListener('click',()=>{page--;render();document.querySelector('.wk-main')?.scrollIntoView({behavior:'smooth'});});
 document.querySelector('#wk-next')?.addEventListener('click',()=>{page++;render();document.querySelector('.wk-main')?.scrollIntoView({behavior:'smooth'});});
 document.querySelector('#wk-export')?.addEventListener('click',downloadBackup);
 document.querySelector('#wk-artbrief')?.addEventListener('click',downloadArtBriefs);
}
function openWord(id){
 if(activeGoogleAudio){activeGoogleAudio.pause();activeGoogleAudio=null;}
 const w=WORDS.find(x=>x.id===id&&canStudy(x));
 if(!w)return;
 returnScrollY=window.scrollY||0;returnFocus=document.activeElement;selected=w;view='lesson';task='learn';flipped=false;question=null;assisted=false;letterHint=false;feedback=null;
 try{window.history.pushState({word:id},'',window.location.pathname+window.location.search+'#word='+encodeURIComponent(id));}catch{}
 render();document.querySelector('#wk-flip')?.focus();
}
function closeWord(fromHistory=false){if(activeGoogleAudio){activeGoogleAudio.pause();activeGoogleAudio=null;}if(window.speechSynthesis)window.speechSynthesis.cancel();view='library';selected=null;question=null;render();window.scrollTo(0,returnScrollY);if(returnFocus?.isConnected)returnFocus.focus();if(!fromHistory&&window.location.hash.startsWith('#word='))try{window.history.back()}catch{}}
function back(){closeWord(false)}
function setTask(next){if(activeGoogleAudio){activeGoogleAudio.pause();activeGoogleAudio=null;}task=next;flipped=true;question=null;feedback=null;assisted=false;letterHint=false;render();document.querySelector('.wk-practice-dock')?.scrollIntoView({block:'start'});}
function siblingWord(offset){const list=selectedWords(),index=list.findIndex(w=>w.id===selected.id),next=list[index+offset];if(!next)return;selected=next;task='learn';flipped=false;question=null;assisted=false;letterHint=false;try{window.history.replaceState({word:next.id},'',window.location.pathname+window.location.search+'#word='+encodeURIComponent(next.id));}catch{}render();document.querySelector('#wk-flip')?.focus();}
function bindLesson(){
 document.querySelector('#wk-to-map')?.addEventListener('click',back);
 document.querySelector('#wk-close-backdrop')?.addEventListener('click',back);
 document.querySelector('#wk-prev-word')?.addEventListener('click',()=>siblingWord(-1));
 document.querySelector('#wk-next-word')?.addEventListener('click',()=>siblingWord(1));
 document.querySelector('#wk-flip')?.addEventListener('click',()=>{flipped=!flipped;render();document.querySelector('#wk-flip')?.focus();});
 document.querySelector('#wk-practise')?.addEventListener('click',()=>setTask('meaning'));
 document.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>setTask(b.dataset.task)));
 document.querySelector('#wk-hear')?.addEventListener('click',()=>speak(selected.term,false,'word'));
 document.querySelector('#wk-hear-slow')?.addEventListener('click',()=>speak(selected.term,true,'word'));
 document.querySelector('#wk-hear-sentence')?.addEventListener('click',()=>speak(selected.example,false,'example'));
 document.querySelector('#wk-advance')?.addEventListener('click',()=>setTask('meaning'));
 document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>onAnswer(b.dataset.answer)));
 document.querySelector('#wk-spell-hint')?.addEventListener('click',()=>{letterHint=true;assisted=true;render();document.querySelector('#wk-spell')?.focus();});
 document.querySelector('#wk-spell-form')?.addEventListener('submit',e=>{e.preventDefault();const value=document.querySelector('#wk-spell').value.trim().toLowerCase();answerResult(value===selected.term.toLowerCase(),'spelling');});
 document.querySelectorAll('[data-choose]').forEach(b=>b.addEventListener('click',()=>{question.chosen.push(Number(b.dataset.choose));rerenderExercise();}));
 document.querySelectorAll('[data-unchose]').forEach(b=>b.addEventListener('click',()=>{question.chosen=question.chosen.filter(n=>n!==Number(b.dataset.unchose));rerenderExercise();}));
 document.querySelector('#wk-sentence-check')?.addEventListener('click',()=>{
   const q=question;
   answerResult(q.chosen.length===q.right.length&&q.chosen.every((id,i)=>id===i),'sentence');
 });
 document.querySelector('#wk-sentence-help')?.addEventListener('click',()=>{assisted=true;rerenderExercise();});
}
function rerenderExercise(){
 const e=document.querySelector('.wk-exercise');
 if(e)e.outerHTML=sentenceMarkup(selected);
 bindLessonExercises();
}
function bindLessonExercises(){
 document.querySelectorAll('[data-choose]').forEach(b=>b.addEventListener('click',()=>{question.chosen.push(Number(b.dataset.choose));rerenderExercise();}));
 document.querySelectorAll('[data-unchose]').forEach(b=>b.addEventListener('click',()=>{question.chosen=question.chosen.filter(n=>n!==Number(b.dataset.unchose));rerenderExercise();}));
 document.querySelector('#wk-sentence-check')?.addEventListener('click',()=>{
 const q=question;answerResult(q.chosen.length===q.right.length&&q.chosen.every((id,i)=>id===i),'sentence');
 });
 document.querySelector('#wk-sentence-help')?.addEventListener('click',()=>{assisted=true;rerenderExercise();});
}
function onAnswer(id){
 if(!question||busy)return;
 answerResult(id===question.correct,question.kind);
}
function answerResult(correct,facet){
 if(busy)return;busy=true;
 const newlyEarned=correct&&!assisted&&!record(selected,facet).awarded;
 storeAnswer(selected,facet,correct,assisted);
 // Word Stars remain a separate collectible. A word earns Adventure XP only
 // after all relevant independent skill challenges have succeeded.
 const ready = correct && !assisted && facetsFor(selected).every(skill=>record(selected,skill).awarded);
 const shared = ready ? creditLearning(localStorage,{
   profileId,awardId:'word:mastered:'+selected.id,amount:3,subject:'words'
 }) : {awarded:false};
 const msg=correct
  ? (newlyEarned?'Good thinking! +2 word stars. ': 'Good thinking. ')+(shared.awarded?'+3 Adventure XP for mastering this word! ':'')+(assisted?'The clue helped; try again later without it.':'You can revisit this word anytime.')
  : 'Not quite. Take another look and try again. A mistake is a useful clue.';
 const box=document.querySelector('#wk-feedback');
 if(box){box.className='wk-feedback '+(correct?'good':'retry');box.textContent=msg;}
 document.querySelectorAll('.wk-answer').forEach(b=>{b.disabled=true;b.classList.toggle('correct',b.dataset.answer===question?.correct);});
 const actions=document.createElement('div');actions.className='wk-inline-actions';
 if(correct){actions.innerHTML='<button class="wk-primary" id="wk-next-skill">Next challenge →</button><button id="wk-again">Practise again</button>';}
 else{actions.innerHTML='<button class="wk-primary" id="wk-again">Try again →</button><button id="wk-show-answer">Show the model</button>';}
 box?.append(actions);
 document.querySelector('#wk-again')?.addEventListener('click',()=>{busy=false;question=null;feedback=null;render();});
 document.querySelector('#wk-next-skill')?.addEventListener('click',()=>{busy=false;setTask(facet==='meaning'?(pictureSkills(selected)?'picture':'spelling'):facet==='picture'?'spelling':facet==='spelling'?'sentence':'learn');});
 document.querySelector('#wk-show-answer')?.addEventListener('click',()=>{busy=false;assisted=true;const message=facet==='sentence'?selected.example:'spelling'===facet?selected.term:facet==='meaning'?selected.definition:selected.term;const node=document.createElement('p');node.className='wk-model';node.textContent='Model: '+message;box?.append(node);});
 if(correct)tinyChime();
 busy=false;
}
function tinyChime(){
 if(!sound)return;
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ctx=new AC();const n=ctx.createOscillator();const g=ctx.createGain();n.type='sine';n.frequency.setValueAtTime(620,ctx.currentTime);n.frequency.exponentialRampToValueAtTime(820,ctx.currentTime+.16);g.gain.setValueAtTime(.035,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.23);n.connect(g);g.connect(ctx.destination);n.start();n.stop(ctx.currentTime+.24);setTimeout(()=>ctx.close(),450)}catch{}
}
function voiceScore(v){
 const name=(v.name||'').toLowerCase(),lang=(v.lang||'').toLowerCase();
 let n=lang==='en-gb'?100:lang.startsWith('en-gb')?90:lang.startsWith('en-')?20:0;
 if(/sonia|serena|daniel|kate|arthur|martha|oliver|google uk|natural|premium|enhanced/.test(name))n+=35;
 if(/online/.test(name))n+=10;
 if(/compact|espeak|festival/.test(name))n-=40;
 return n;
}
function bestBritishVoice(){return [...cachedVoices].filter(v=>v.lang?.toLowerCase().startsWith('en-')).sort((a,b)=>voiceScore(b)-voiceScore(a))[0]||null}
function speak(text,slow,kind='word'){
 const clip=selected && approvedClip(selected.id,kind);
 if(clip){
  if(activeGoogleAudio)activeGoogleAudio.pause();
  const audio=new Audio(clip);activeGoogleAudio=audio;audio.playbackRate=slow?.82:1;
  const node=document.querySelector('#wk-voice-note');if(node)node.textContent='Approved British-English audio'+(slow?' · slower playback':'')+'.';
  audio.onerror=()=>{activeGoogleAudio=null;status('Approved audio is unavailable, so the device voice will be used.');speakDevice(text,slow,kind)};
  audio.play().catch(()=>speakDevice(text,slow,kind));return;
 }
 speakDevice(text,slow,kind);
}
function speakDevice(text,slow,kind='word'){
 if(!('speechSynthesis' in window)){status('This browser cannot play speech automatically. Read the word instead.');return;}
 window.speechSynthesis.cancel();
 refreshVoices();const voice=bestBritishVoice();
 const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-GB';utterance.voice=voice;utterance.rate=slow?.78:(kind==='example'?.94:.9);utterance.pitch=1;
 const node=document.querySelector('#wk-voice-note');
 const isBritish=voice?.lang?.toLowerCase().startsWith('en-gb');
 if(node)node.textContent=isBritish?'British English device voice'+(slow?' · slower, with natural pitch':kind==='example'?' · example sentence':' · tap again whenever you like')+'.': 'Using the best English voice available here; this device has no British voice installed.';
 utterance.onerror=()=>status('Speech did not play. Try the button again, or use the written word.');
 window.speechSynthesis.speak(utterance);
}
function download(name,data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),4000);
}
function downloadBackup(){download('word-kingdom-local-progress.json',{version:1,createdAt:new Date().toISOString(),warning:'Private device-only learning snapshot, not yet cloud-synchronised.',learners:stored.learners});status('Private learning backup downloaded. Keep it out of public GitHub.');}
function downloadArtBriefs(){
 const visible=selectedWords().slice(page*12,page*12+12);
 download('word-kingdom-art-briefs.json',{version:1,status:'pending_adult_review',paidGenerationEnabled:false,artBible:ART_BIBLE,words:visible.map(w=>({id:w.id,term:w.term,definition:w.definition,locale:'en-GB',currentArt:'reusable_svg',prompt:'Editorial illustration of '+w.term+': '+w.example+'. Visually communicate the meaning: '+w.definition+'. '+ART_BIBLE.style+'. Clear single subject, child-friendly, no words, no text labels, no logos, 4:3.',reviewRequired:true}))});
 status('Art briefs exported. This does not call an image model or incur costs.');
}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&window.speechSynthesis)window.speechSynthesis.cancel()});
window.addEventListener('popstate',()=>{if(selected)closeWord(true)});
// A restored browser tab must not overwrite newer rewards or reanimate deleted progress.
window.addEventListener('pageshow',event=>{if(event.persisted)window.location.reload()});
window.addEventListener('storage',event=>{if(event.key==='ala-adventure-v1'||event.key===STORE)window.location.reload()});
document.addEventListener('keydown',event=>{
 if(!selected)return;
 if(event.key==='Escape'){event.preventDefault();back();return;}
 if(event.key==='Tab'){
  const focusable=[...document.querySelectorAll('.wk-focus-layer button:not([disabled]),.wk-focus-layer input:not([disabled]),.wk-focus-layer a[href],.wk-focus-layer summary')].filter(el=>el.offsetParent!==null);
  if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});
document.documentElement.classList.toggle('wk-still',!motion);
render();
