import {WORDS,STAGES,ART_BIBLE} from './words-data.js';
import {artSvg} from './art.js';
import {curriculumLinks,curriculumYear,belongsToBand,sourceLabel,CURRICULUM_BANDS} from './curriculum-index.js';
const ROOT='/adam/words/';
const STORE='ala-word-kingdom-v1';
const ALLOWED_PICTURE=new Set(['apple','book','cat','chair','door','house','school','heart','rain','sun','owl','key','magnify','clock','people','map','science','leaf','stars']);
const FACETS=['meaning','spelling','sentence','picture'];
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
let view='library', filter='all', collection='curriculum', theme='all', query='', page=0, selected=null,task='learn',question=null,feedback=null,assisted=false,letterHint=false,streak=0, busy=false;
let sound=true,motion=!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const WORD_AUDIO_URL='https://uyfaipjthpsofjqcucop.supabase.co/storage/v1/object/public/ala-word-audio/en-GB/';
let activeGoogleAudio=null;

function student(){return initialProfiles.entries.find(([id])=>id===profileId)?.[1]||{displayName:'Adam',year:6}}
function progress(){return stored.learners[profileId] ||= {words:{},stars:0}}
function record(word,facet){const wr=progress().words[word.id] ||= {};return wr[facet] ||= {strength:0,days:0,reviewCount:0,lastDay:null,due:0,awarded:false}}
function save(){if(!setLocal(stored))status('Progress cannot be saved in this browser. Your session may be private.')}
function rating(word,facet){let t=record(word,facet);if(!t.strength)return 'New';if(t.due && t.due<=Date.now())return 'Review due';return t.days>=4 && t.reviewCount>=3?'Secure':'Practising'}
function belongsToCollection(w){
 const refs=curriculumLinks(w);
 if(collection==='all')return true;
 if(collection==='extra')return w.stage!==0&&!refs.length;
 return !!refs.length||w.stage===0;
}
function canStudy(w){return curriculumYear(w)<=student().year}
function scopedWords(){return WORDS.filter(w=>canStudy(w)&&belongsToCollection(w))}
function dueCount(){return scopedWords().reduce((n,w)=>n+FACETS.filter(f=>record(w,f).due>0&&record(w,f).due<=Date.now()).length,0)}
function wordStat(w){const facts=FACETS.filter(f=>record(w,f).days>=1);return facts.length}
function stageCount(id){return scopedWords().filter(w=>belongsToBand(w,id)).length}
function wordScope(){return scopedWords().filter(w=>filter==='all'||filter==='due'&&FACETS.some(f=>rating(w,f)==='Review due')||belongsToBand(w,filter)&&filter!=='all'&&filter!=='due')}
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
 '<div class="wk-chapters"><button data-filter="all" class="'+(filter==='all'?'active':'')+'">All eligible <small>'+scopedWords().length+' words</small></button>'+CURRICULUM_BANDS.filter(b=>b.minYear<=student().year).map(b=>'<button data-filter="'+b.id+'" class="'+(filter===b.id?'active':'')+'" title="'+esc(b.note)+'">'+esc(b.label)+'<small>'+stageCount(b.id)+' ready cards</small></button>').join('')+'<button data-filter="due" class="'+(filter==='due'?'active':'')+'">↻ Reviews due <small>'+dueCount()+'</small></button></div>';
}
function menu(){
 const list=selectedWords();
 const themeCounts=currentThemeCounts();
 const themes=[...themeCounts.keys()].sort();
 const totalPages=Math.max(1,Math.ceil(list.length/12));
 page=Math.min(page,totalPages-1);
 return shell()+'<section class="wk-main"><div class="wk-section-bar"><div><span class="wk-eyebrow">DfE NATIONAL CURRICULUM • APPENDIX 1</span><h2>'+(filter==='all'?'Your growing dictionary':filter==='due'?'Ready for another look':CURRICULUM_BANDS.find(b=>b.id===filter)?.label||'Word discoveries')+'</h2><p>DfE lists are shared across Years 3–4 and Years 5–6. Year 1–2 examples are non-statutory. EYFS words are foundational practice, not an official word list.</p></div><div class="wk-search"><label for="wk-collection">Collection</label><select id="wk-collection"><option value="curriculum" '+(collection==='curriculum'?'selected':'')+'>DfE curriculum + EYFS</option><option value="extra" '+(collection==='extra'?'selected':'')+'>Optional enrichment</option><option value="all" '+(collection==='all'?'selected':'')+'>All learning words</option></select><label for="wk-search">Find a word</label><input id="wk-search" type="search" placeholder="Search words, meanings…" value="'+esc(query)+'" autocomplete="off"/><label for="wk-theme">Theme</label><select id="wk-theme"><option value="all">All themes</option>'+themes.map(t=>'<option value="'+esc(t)+'" '+(theme===t?'selected':'')+'>'+esc(t)+' ('+themeCounts.get(t)+')</option>').join('')+'</select></div></div><div class="wk-grid">'+list.slice(page*12,page*12+12).map(w=>'<button class="wk-word" data-open="'+esc(w.id)+'" aria-label="Learn '+esc(w.term)+'"><div class="wk-picture">'+artSvg(w)+'</div><div class="wk-word-meta"><span class="wk-stage">'+esc(curriculumLinks(w).length?sourceLabel(w):(w.stage===0?'EYFS practice · editorial':'Enrichment · editorial'))+'</span><span class="wk-master">'+wordStat(w)+'/4 skills</span></div><b>'+esc(w.term)+'</b><span>'+esc(w.definition)+'</span><span class="wk-explore">Explore word →</span></button>').join('')+'</div>'+(!list.length?'<div class="wk-empty">No words match this view. Choose another stage or search.</div>':'')+'<div class="wk-pagination"><button id="wk-prev" '+(!page?'disabled':'')+'>← Previous</button><span>Page '+(page+1)+' / '+totalPages+'</span><button id="wk-next" '+(page===totalPages-1?'disabled':'')+'>Next →</button></div></section><section class="wk-bottom"><div><h2>Growing, not guessing.</h2><p>Recognising a word, spelling it, and using it in a sentence are different skills. We keep track of each separately. A slow answer or a repeated sound never loses you points.</p></div><div class="wk-actions"><button id="wk-export">Export learning backup</button><button id="wk-artbrief">Download art briefs</button></div></section>';
}
function wordHeader(w){
 return '<div class="wk-lesson-top"><button class="wk-return" id="wk-to-map">← All words</button><span class="wk-eyebrow">'+esc(sourceLabel(w))+' • '+esc(w.theme)+'</span>'+(curriculumLinks(w).length?'<a class="wk-curriculum-source" href="https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study" target="_blank" rel="noopener noreferrer">DfE source ↗</a>':'<span class="wk-curriculum-source">Editorial learning practice</span>')+'<span class="wk-skillcount">'+wordStat(w)+'/4 skills practised</span></div>';
}
function tab(name,caption){return '<button data-task="'+name+'" class="'+(task===name?'active':'')+'">'+caption+'</button>'}
function wordView(){
 const w=selected;
 const learning=task==='learn';
 let head=wordHeader(w)+'<div class="wk-task-tabs">'+tab('learn','✧ Discover')+tab('meaning','Meaning')+tab('picture','Picture')+tab('spelling','Spell it')+tab('sentence','Build a sentence')+'</div>';
 const conceal=task==='spelling'||task==='picture';
 const img=artSvg(conceal?{art:w.art,term:'A picture hint'}:w,'wk-main-illustration');
 const info='<section class="wk-word-intro"><div class="wk-art-panel">'+img+'</div><div class="wk-word-info"><span class="wk-eyebrow">'+esc(w.theme)+' • British English</span><h1>'+(conceal?'<span class="wk-hidden-word">Mystery word</span>':esc(w.term))+'</h1>'+(learning?'<p class="wk-definition">'+esc(w.definition)+'</p><p class="wk-example">'+esc(w.example)+'</p>':'<p class="wk-definition">'+(task==='spelling'?'Listen carefully and write the word. No timer.':task==='picture'?'Which picture matches the word you hear?':task==='sentence'?'Build the sentence in the correct order.':'Choose what the word means.')+'</p>')+'<div class="wk-pronounce"><button id="wk-hear" class="wk-primary">♫ Hear Google voice × 2</button><button id="wk-hear-slow">Hear slowly</button><button id="wk-hear-sentence">Hear example sentence</button><button id="wk-device-voice" class="wk-device-option">Use device voice instead</button></div><p class="wk-audio-note" id="wk-voice-note">Google audio plays only when a recorded word has been generated and approved. Otherwise, choose the clearly labelled device-voice alternative. No microphone or recording.</p></div></section>';
 let activity='';
 if(learning)activity='<section class="wk-exercise"><span class="wk-eyebrow">WORD DISCOVERY</span><h2>Connect sound, picture and meaning.</h2><div class="wk-chunks">'+esc(w.chunks).split('-').map(v=>'<span>'+v+'</span>').join('')+'</div><p>Tap Hear to listen again. You can say it, think it or simply listen — all are welcome.</p><button id="wk-advance" class="wk-primary">Try a quick challenge →</button></section>';
 else if(task==='meaning')activity=questionMarkup(w,'meaning');
 else if(task==='picture')activity=questionMarkup(w,'picture');
 else if(task==='spelling')activity='<section class="wk-exercise"><span class="wk-eyebrow">SPELLING CASTLE</span><h2>Listen, think, then spell.</h2><p>Type the word you heard. Try on your own or ask for a clue; both are useful practice.</p><form id="wk-spell-form"><label for="wk-spell">Write the word</label><input id="wk-spell" type="text" maxlength="50" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="Your spelling here" required><div class="wk-inline-actions"><button type="submit" class="wk-primary">Check spelling</button><button type="button" id="wk-spell-hint">Show a sound clue</button></div></form>'+(letterHint?'<div class="wk-chunks">'+esc(w.chunks).split('-').map(ch=>'<span>'+esc(ch.replace(/[aeiou]/gi,'•'))+'</span>').join('')+'</div>':'')+'</section>';
 else activity=sentenceMarkup(w);
 return '<section class="wk-lesson">'+head+info+activity+'<div id="wk-feedback" class="wk-feedback" aria-live="polite"></div><div class="wk-gentle">No race. No speech scoring. You choose when to move on.</div></section>';
}
function createQuestion(w,kind){
 if(kind==='meaning'){
  const other=pick(WORDS.filter(v=>v.id!==w.id && v.stage<=student().year),w.id+'meaning').slice(0,3);
  return {kind,options:pick([w,...other],w.id+'meaning-order'),correct:w.id};
 }
 const eligible=WORDS.filter(v=>v.art!==w.art&&ALLOWED_PICTURE.has(v.art)&&v.stage<=student().year);
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
 if(view==='lesson'&&selected){layout(wordView());bindLesson();}
 else{layout(menu());bindMenu();}
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
 selected=w;view='lesson';task='learn';question=null;assisted=false;letterHint=false;feedback=null;
 render();window.scrollTo({top:0,behavior:'smooth'});
}
function back(){if(activeGoogleAudio){activeGoogleAudio.pause();activeGoogleAudio=null;}view='library';selected=null;question=null;render();}
function setTask(next){if(activeGoogleAudio){activeGoogleAudio.pause();activeGoogleAudio=null;}task=next;question=null;feedback=null;assisted=false;letterHint=false;render();}
function bindLesson(){
 document.querySelector('#wk-to-map')?.addEventListener('click',back);
 document.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>setTask(b.dataset.task)));
 document.querySelector('#wk-hear')?.addEventListener('click',()=>playStudioVoice(selected,'word',false));
 document.querySelector('#wk-hear-slow')?.addEventListener('click',()=>playStudioVoice(selected,'word',true));
 document.querySelector('#wk-hear-sentence')?.addEventListener('click',()=>playStudioVoice(selected,'sentence',false));
 document.querySelector('#wk-device-voice')?.addEventListener('click',()=>speak(selected.term,false));
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
 const msg=correct
  ? (newlyEarned?'Good thinking! +2 word stars. ': 'Good thinking. ')+(assisted?'The clue helped; try again later without it.':'You can revisit this word anytime.')
  : 'Not quite. Take another look and try again. A mistake is a useful clue.';
 const box=document.querySelector('#wk-feedback');
 if(box){box.className='wk-feedback '+(correct?'good':'retry');box.textContent=msg;}
 document.querySelectorAll('.wk-answer').forEach(b=>{b.disabled=true;b.classList.toggle('correct',b.dataset.answer===question?.correct);});
 const actions=document.createElement('div');actions.className='wk-inline-actions';
 if(correct){actions.innerHTML='<button class="wk-primary" id="wk-next-skill">Next challenge →</button><button id="wk-again">Practise again</button>';}
 else{actions.innerHTML='<button class="wk-primary" id="wk-again">Try again →</button><button id="wk-show-answer">Show the model</button>';}
 box?.append(actions);
 document.querySelector('#wk-again')?.addEventListener('click',()=>{busy=false;question=null;feedback=null;render();});
 document.querySelector('#wk-next-skill')?.addEventListener('click',()=>{busy=false;setTask(facet==='meaning'?'picture':facet==='picture'?'spelling':facet==='spelling'?'sentence':'learn');});
 document.querySelector('#wk-show-answer')?.addEventListener('click',()=>{busy=false;assisted=true;const message=facet==='sentence'?selected.example:'spelling'===facet?selected.term:facet==='meaning'?selected.definition:selected.term;const node=document.createElement('p');node.className='wk-model';node.textContent='Model: '+message;box?.append(node);});
 if(correct)tinyChime();
 busy=false;
}
function tinyChime(){
 if(!sound)return;
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ctx=new AC();const n=ctx.createOscillator();const g=ctx.createGain();n.type='sine';n.frequency.setValueAtTime(620,ctx.currentTime);n.frequency.exponentialRampToValueAtTime(820,ctx.currentTime+.16);g.gain.setValueAtTime(.035,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.23);n.connect(g);g.connect(ctx.destination);n.start();n.stop(ctx.currentTime+.24);setTimeout(()=>ctx.close(),450)}catch{}
}
function playStudioVoice(word,variant='word',slow=false){
 if(activeGoogleAudio){activeGoogleAudio.pause();activeGoogleAudio=null;}
 if(window.speechSynthesis)window.speechSynthesis.cancel();
 const url=WORD_AUDIO_URL+encodeURIComponent(word.id)+'/'+variant+'.wav';
 const audio=new Audio(url);
 activeGoogleAudio=audio;audio.preload='auto';audio.playbackRate=slow?.8:1;audio.preservesPitch=true;
 let played=0;const repeats=slow?1:2;
 const note=document.querySelector('#wk-voice-note');
 if(note)note.textContent='Checking for the approved Google British-English recording…';
 audio.addEventListener('canplay',()=>{if(note)note.textContent='Google Gemini studio recording · British English · '+(slow?'slower playback':'two repetitions');},{once:true});
 audio.addEventListener('ended',()=>{played++;if(played<repeats){audio.currentTime=0;audio.play().catch(()=>{if(note)note.textContent='Tap Hear to play again.'});}else{activeGoogleAudio=null;}});
 audio.addEventListener('error',()=>{if(note)note.textContent='Google recording is not published for this word yet. Choose “Use device voice instead” if you want to listen now.';activeGoogleAudio=null;});
 audio.play().catch(()=>{if(note)note.textContent='Google recording unavailable right now. Try the device voice option or check back later.';});
}
function speak(text,slow){
 if(!('speechSynthesis' in window)){status('This browser cannot play speech automatically. Read the word instead.');return;}
 window.speechSynthesis.cancel();
 const voices=window.speechSynthesis.getVoices();
 const uk=voices.find(v=>v.lang?.toLowerCase()==='en-gb')||voices.find(v=>v.lang?.toLowerCase().startsWith('en-gb'));
 const fallback=voices.find(v=>v.lang?.toLowerCase().startsWith('en-'));
 const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-GB';utterance.voice=uk||fallback||null;utterance.rate=slow?.72:.88;utterance.pitch=1;
 const node=document.querySelector('#wk-voice-note');
 if(node)node.textContent=uk?'Using a British English voice installed on this device.':'Using an available device voice; British pronunciation cannot be guaranteed here. Cloud audio will require approved voice assets.';
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
document.documentElement.classList.toggle('wk-still',!motion);
render();
