import {readScience,writeScience,creditLearning,SCIENCE_AWARD} from '../shared/learning-progress.js';
const app=document.querySelector('#app');
const STORE='ala-science-lab-v1';
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getProfile=()=>{try{const s=JSON.parse(localStorage.getItem('ala-adventure-v1'));const id=s?.activeProfile||'explorer';return {id,data:s?.profiles?.[id]||{displayName:'Adam'}}}catch{return {id:'explorer',data:{displayName:'Adam'}}}};
const active=getProfile();
let state=readScience(localStorage,active.id);
const save=()=>{try{writeScience(localStorage,active.id,state)}catch{}};
const button=(action,label,cls='')=>`<button data-action="${action}" class="${cls}">${label}</button>`;
function frame(body){app.innerHTML=`<div class="lab"><header><a href="/adam/">← Adventure Atlas</a><div><b>DISCOVERY LABORATORY</b><small>ADAM LEARNING ADVENTURES</small></div><span>SCIENCE · MATERIALS</span></header>${body}<footer><span>Predict · Observe · Explain</span><a href="/adam/">Return to the Atlas</a></footer><div id="toast" role="status"></div></div>`;document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>act(b.dataset.action));}
function beaker(kind,tested=false){return `<div class="beaker ${tested?kind:''}" aria-label="Beaker of water ${tested?'after adding '+kind:''}"><i></i><span>${tested?(kind==='sugar'?'clear mixture':'sand at the bottom'):'water'}</span></div>`}
function render(){
 const name=safe(active.data.displayName||'Adam'),step=state.step;
 if(step===0)return frame(`<section class="scene intro"><div class="copy"><span class="eyebrow">SCIENCE CASE 001 · MATERIALS</span><h1>The dissolving mystery</h1><p>Welcome, ${name}. Two white powders look similar, but they behave differently in water. Your job is to predict, test and explain.</p><div class="safety">This is an on-screen investigation. If you repeat it at home, ask an adult and never taste unknown materials.</div>${button('start','Enter the laboratory →','primary')}</div><div class="shelf">${beaker('water')}<div class="jar">SUGAR</div><div class="jar sand">SAND</div></div></section>`);
 if(step===1)return frame(`<section class="scene task"><div class="panel"><span class="eyebrow">STEP 1 OF 4 · PREDICT</span><h1>What do you think will happen?</h1><p>A prediction is a sensible idea before a test. It does not have to be correct.</p><div class="choice">${button('predict-sugar','Sugar will dissolve')}${button('predict-sand','Sand will dissolve')}${button('predict-both','Both will dissolve')}</div><p class="gentle">Choosing an idea earns no score. Scientists change their minds when evidence changes.</p></div><div class="bench">${beaker('water')}<span>+</span><div class="jar">?</div></div></section>`);
 if(step===2)return frame(`<section class="scene task"><div class="panel"><span class="eyebrow">STEP 2 OF 4 · TEST</span><h1>Make it a fair comparison.</h1><p>Use the same amount of water and stir each material. Tap both tests.</p><div class="tests"><button data-action="test-sugar" class="test ${state.tests.sugar?'done':''}">${beaker('sugar',state.tests.sugar)}<b>${state.tests.sugar?'Sugar spread through the water':'Test sugar'}</b></button><button data-action="test-sand" class="test ${state.tests.sand?'done':''}">${beaker('sand',state.tests.sand)}<b>${state.tests.sand?'Sand settled at the bottom':'Test sand'}</b></button></div>${state.tests.sugar&&state.tests.sand?button('observed','Record observations →','primary'):''}</div></section>`);
 if(step===3)return frame(`<section class="scene task"><div class="panel"><span class="eyebrow">STEP 3 OF 4 · EXPLAIN</span><h1>Which conclusion matches the evidence?</h1><p><b>Observation:</b> the sugar mixture stayed clear. The sand could still be seen at the bottom.</p><div class="choice">${button('answer-correct','Sugar is soluble in water; sand is insoluble.')}${button('answer-wrong','Both materials disappeared completely.')}${button('answer-wrong','Sand dissolved faster than sugar.')}</div><div id="feedback" role="status"></div></div></section>`);
 return frame(`<section class="scene complete"><div class="award">⚗</div><span class="eyebrow">LAB MISSION COMPLETE</span><h1>Evidence Explorer</h1><p class="award-caption">★ First completion earns 10 Adventure XP. Replaying the lab helps you practise, but cannot earn duplicate XP.</p><p>You made a prediction, kept the comparison fair, observed carefully and chose a conclusion supported by evidence.</p><div class="vocab"><span><b>soluble</b> can dissolve in a liquid</span><span><b>insoluble</b> does not dissolve in that liquid</span><span><b>conclusion</b> an explanation based on evidence</span></div>${button('restart','Repeat the investigation','secondary')}<a class="primary link" href="/adam/words/?collection=school">Explore science words →</a><a href="/adam/">Return to the Adventure Atlas</a></section>`);
}
function act(id){
 if(id==='start'){state.step=1;save();return render()}
 if(id.startsWith('predict-')){state.prediction=id.slice(8);state.step=2;save();return render()}
 if(id.startsWith('test-')){state.tests[id.slice(5)]=true;save();return render()}
 if(id==='observed'){state.step=3;save();return render()}
 if(id==='answer-wrong'){state.attempts++;save();const f=document.querySelector('#feedback');if(f)f.textContent=state.attempts===1?'Look at what you could still see. Dissolving is different from sinking.':'Use both observations: sugar spread through the water, while sand remained visible.';return}
 if(id==='answer-correct'){state.step=4;state.completed=true;save();creditLearning(localStorage,{profileId:active.id,awardId:SCIENCE_AWARD,amount:10,subject:'science'});return render()}
 if(id==='restart'){state={step:0,prediction:null,tests:{},attempts:0,completed:false};save();return render()}
}
window.addEventListener('pageshow',event=>{if(event.persisted)window.location.reload()});
window.addEventListener('storage',event=>{if(event.key==='ala-adventure-v1'||event.key===STORE)window.location.reload()});
render();
