import {connect, learnerRecords, loadCourse, saveProgress, submitApplication, submitWork} from './backend.js';
import {exampleModules, hourPlan} from './curriculum.js';

const root = document.querySelector('#app');
const demoKey = 'iwa-nigeria-demo-v1';
const blank = () => ({modules:[],progress:{},submissions:{},sessions:[]});
const state = {
  client:null, user:null, authReady:false, backendError:false, recovery:false,
  records:null, enrolment:null, course:blank(), loading:false, error:'',
  demo:false, notice:'', mode:'signin'
};

const marks = {
  home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-6h6v6"/>',
  book:'<path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0 0 4h14"/><path d="M8 7h8"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/>',
  file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6m-6 4h6"/>',
  chart:'<path d="M4 19h16M7 16v-4m5 4V8m5 8V5"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  play:'<path d="m9 5 11 7-11 7z"/>',
  lift:'<path d="M3 19 10 12l4 4 7-9m-7 0h7v7"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18Z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>'
};
const icon = (name, size=20) => `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${marks[name]}</svg>`;
const e = (value='') => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const urlSafe = value => { try { const url = new URL(value); return url.protocol==='https:' ? e(url.href) : ''; } catch {return '';} };
const route = () => location.hash.slice(1).split('/').filter(Boolean);
const go = path => { if (location.hash === '#' + path) render(); else location.hash = path; };
const main = (content, classes='') => `<main id="content" tabindex="-1" class="${classes}">${content}</main>`;
const button = (text, href, variant='primary') => `<a class="button ${variant}" href="${href}">${text}${variant==='primary' ? icon('arrow',17) : ''}</a>`;
function message(text, problem=false) {
  return text ? `<p class="notice ${problem?'problem':''}" role="${problem?'alert':'status'}">${e(text)}</p>` : '';
}
function brand() {
  return `<a class="brand" href="#home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>IWA Academy<small>Nigeria</small></span></a>`;
}
function topbar(page) {
  const links = [['Home','home'],['Programme','programme'],['Apply','apply']];
  return `<header class="site-header"><div class="top-inner">${brand()}
    <nav aria-label="Main navigation">${links.map(([label,path])=>`<a href="#${path}" ${page===path?'aria-current="page"':''}>${label}</a>`).join('')}</nav>
    ${state.user ? button('My learning','#learn','secondary') : button('Sign in','#signin','secondary')}
  </div></header>`;
}
function footer() {
  return `<footer class="footer"><div><strong>IWA Academy Nigeria</strong><span>Professional learning in Nigeria</span></div><a href="#privacy">Privacy and access</a><span>${icon('globe',16)} English (Nigeria) · WAT</span></footer>`;
}
function landing() {
  return main(`<section class="hero"><div class="hero-copy">
    <p class="eyebrow"><span></span> IWA ACADEMY NIGERIA</p>
    <h1>Build skills.<br><em>Take the lead.</em></h1>
    <p class="hero-intro">A 12-week learning programme for women in Nigeria, with practical training in events, sports media and leadership.</p>
    <div class="actions">${button('Apply for the programme','#apply')}<button class="button secondary light" data-action="demo">Explore demo ${icon('arrow',17)}</button></div>
    </div><div class="hero-visual" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div><div class="visual-star">✳</div><span class="visual-caption">LEARN / PRACTISE / LEAD</span></div>
  </section>
  <section class="facts" aria-label="Programme facts">
    <div>${icon('calendar',24)}<strong>12 weeks</strong><small>Video learning and live classes</small></div>
    <div>${icon('book',24)}<strong>72 guided hours</strong><small>Learning, practice and feedback</small></div>
    <div>${icon('file',24)}<strong>One final project</strong><small>Build something you can show</small></div>
  </section>
  <section class="landing-section"><div class="section-heading"><h2>Find your pathway</h2><a class="text-link" href="#programme">View programme ${icon('arrow',17)}</a></div>
    <div class="path-grid">${exampleModules.slice(1).map((item,i)=>`<article class="path-card"><span class="icon-tile t${i}">${icon(['calendar','file','lift'][i],24)}</span><h3>${e(item.title)}</h3><p>${e(item.description)}</p></article>`).join('')}</div>
  </section>`,'public-wrap');
}
function programme() {
  return main(`<div class="page-intro"><p class="eyebrow">IWA ACADEMY NIGERIA</p><h1>The programme</h1><p>Start with professional and digital skills, try all three specialist areas, then complete a project in the pathway you choose.</p></div>
    <div class="two-col"><section class="panel"><h2>The 12-week plan</h2><div class="timeline">
      ${hourPlan.map(([weeks,name,hours])=>`<div><span>${weeks}</span><strong>${name}</strong><span>${hours}</span></div>`).join('')}
    </div></section><aside class="panel"><h2>How you will learn</h2><p>36 hours of video-based learning and 36 hours of live online learning. The programme has up to 100 places in five groups of up to 20.</p><p>If you need help with internet access or a device, raise it during admissions so the team can discuss the options with you.</p>${button('Apply for the programme','#apply')}</aside></div>`,'public-wrap standard-page');
}
function authPage() {
  const mode = state.recovery ? 'recovery' : state.mode;
  const ready = state.authReady && Boolean(state.client);
  const names = {signin:'Sign in',signup:'Create your account',reset:'Reset your password',recovery:'Choose a new password'};
  const password = mode!=='reset' ? `<label>Password<input name="password" type="password" required minlength="8" autocomplete="${mode==='signin'?'current-password':'new-password'}"></label>` : '';
  const email = mode!=='recovery' ? '<label>Email address<input name="email" type="email" required autocomplete="email"></label>' : '';
  return main(`<div class="form-layout"><div class="form-intro"><p class="eyebrow">YOUR LEARNING SPACE</p><h1>${names[mode]}</h1><p>Access your lessons, live classes, assignments and progress from one place.</p>${!ready ? '<button class="button secondary light" data-action="demo">Explore demo</button>' : ''}</div>
    <section class="panel form-panel">
      ${state.user && !state.recovery ? `<p>Signed in as <strong>${e(state.user.email)}</strong>.</p><div class="actions">${button('My learning','#learn')}<button class="button secondary" data-action="signout">Sign out</button></div>` :
      `<h2>${names[mode]}</h2>
      ${message(!state.authReady ? 'Checking the account connection…' : state.backendError ? 'The account connection could not be loaded.' : !ready ? 'Account access is being set up. You can explore the demo in the meantime.' : '',state.backendError)}
      ${message(state.notice)}
      <form data-form="${mode}"><fieldset ${ready?'':'disabled'}>${email}${password}<button class="button primary" type="submit">${mode==='reset'?'Send reset link':mode==='recovery'?'Save password':names[mode]}${icon('arrow',17)}</button></fieldset><p class="form-feedback" aria-live="polite"></p></form>
      ${state.recovery ? '' : `<div class="form-links">${mode!=='signin' ? '<button data-mode="signin">Back to sign in</button>' : '<button data-mode="signup">Create an account</button><button data-mode="reset">Forgot password?</button>'}</div>`}`}
    </section></div>`,'public-wrap standard-page');
}
function applicationPage() {
  const application = state.records?.application;
  const status = {received:'Received',under_review:'Under review',accepted:'Accepted',declined:'Declined'};
  const states = 'Abia,Adamawa,Akwa Ibom,Anambra,Bauchi,Bayelsa,Benue,Borno,Cross River,Delta,Ebonyi,Edo,Ekiti,Enugu,FCT, Gombe,Imo,Jigawa,Kaduna,Kano,Katsina,Kebbi,Kogi,Kwara,Lagos,Nasarawa,Niger,Ogun,Ondo,Osun,Oyo,Plateau,Rivers,Sokoto,Taraba,Yobe,Zamfara'.split(',').map(s=>s.trim());
  return main(`<div class="page-intro"><p class="eyebrow">ADMISSIONS</p><h1>Apply to IWA Academy</h1><p>Tell us a little about yourself and what you hope to learn.</p></div>
    <div class="two-col"><section class="panel form-panel">
    ${!state.authReady ? message('Checking application access…') : !state.client ? message('Applications are not open in this preview.') :
    !state.user ? `<h2>Start your application</h2><p>Sign in or create an account to submit your application and check its status.</p>${button('Sign in to continue','#signin')}` :
    state.loading ? message('Checking your application…') : state.error ? message(state.error,true) :
    application ? `<h2>Application status</h2><span class="tag">${status[application.status]||'Received'}</span><p>Submitted on ${dateFormat(application.created_at,false)}.</p>` :
    `<form data-form="application"><label>Full name<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label>
      <label>State or Federal Capital Territory<select name="state" required><option value="">Select</option>${states.map(s=>`<option>${s}</option>`).join('')}</select></label>
      <label>What do you hope to learn?<textarea name="motivation" minlength="10" maxlength="1200" rows="5" required></textarea></label>
      <label class="check-label"><input required type="checkbox" name="privacy"> <span>I have read the <a href="#privacy" target="_blank" rel="noopener">application privacy notice</a>.</span></label>
      <button class="button primary" type="submit">Submit application ${icon('arrow',17)}</button><p class="form-feedback" aria-live="polite"></p></form>`}
    </section><aside class="panel"><h2>Before you apply</h2><ul class="plain-list"><li>Check the 12-week programme and the time required for live sessions.</li><li>Use an email address you can access.</li><li>Share only the information requested in the application.</li></ul><a class="text-link" href="#programme">View programme ${icon('arrow',17)}</a></aside></div>`,'public-wrap standard-page');
}
function privacyPage() {
  return main(`<article class="panel privacy"><p class="eyebrow">IWA ACADEMY NIGERIA</p><h1>Privacy and access</h1><h2>Application information</h2><p>The application asks for your name, email address, state and a short learning goal. It is used to review your application and communicate its outcome. Share information relevant to your application.</p><h2>Learning records</h2><p>Your account may show your lessons, completion, assignments and feedback. Demo learning records stay in this browser. Discuss accessibility needs with the academy team through its approved support channel.</p></article>`,'public-wrap standard-page');
}

const sectionLinks = [['Overview','home','learn'],['My courses','book','courses'],['Live classes','calendar','classes'],['Assignments','file','assignments'],['My progress','chart','progress']];
const dateFormat = (date, time=true) => {
  const value = new Date(date);
  if (!Number.isFinite(value.valueOf())) return 'Date to be announced';
  const options={timeZone:'Africa/Lagos',day:'numeric',month:'short',year:'numeric'};
  if (time) Object.assign(options,{hour:'2-digit',minute:'2-digit',hour12:true});
  return new Intl.DateTimeFormat('en-NG',options).format(value) + (time?' WAT':'');
};
function currentCourse() {
  if (!state.demo) return state.course;
  let saved={};
  try {saved=JSON.parse(localStorage.getItem(demoKey)||'{}');} catch {}
  return {modules:exampleModules,progress:saved.progress||{},submissions:saved.submissions||{},sessions:[]};
}
function writeDemo(course) {
  localStorage.setItem(demoKey,JSON.stringify({progress:course.progress,submissions:course.submissions}));
}
function courseStats(course) {
  const lessons=course.modules.flatMap(m=>m.lessons);
  const completed=lessons.filter(l=>course.progress[l.id]?.completed_at).length;
  const recent=lessons.filter(l=>course.progress[l.id]?.last_seen_at).sort((a,b)=>
    course.progress[b.id].last_seen_at.localeCompare(course.progress[a.id].last_seen_at));
  return {lessons,completed,percent:lessons.length?Math.round(completed/lessons.length*100):0,
    next:recent.find(l=>!course.progress[l.id]?.completed_at)||lessons.find(l=>!course.progress[l.id]?.completed_at)};
}
function progressBar(percent,label='Lesson completion') {
  return `<progress max="100" value="${percent}" aria-label="${label}">${percent}%</progress>`;
}
function courseCards(course) {
  if (!course.modules.length) return message('Your learning materials will appear here once they are available.');
  return `<div class="course-grid">${course.modules.map((m,i)=>{
    const done=m.lessons.filter(l=>course.progress[l.id]?.completed_at).length;
    return `<article class="panel module"><div class="section-heading"><span class="icon-tile t${i%3}">${icon(['book','calendar','file','lift'][i%4])}</span><span class="tag">${e(m.category)}</span></div><h3>${e(m.title)}</h3><p>${e(m.description)}</p>
      ${progressBar(m.lessons.length?done/m.lessons.length*100:0,'Module completion')}<p class="meta">${done} of ${m.lessons.length} lessons complete</p>
      <ul class="lesson-list">${m.lessons.map(l=>`<li><a href="#lesson/${e(l.id)}">${icon(course.progress[l.id]?.completed_at?'check':l.kind==='video'?'play':'book',17)} <span>${e(l.title)}</span> ${icon('arrow',16)}</a></li>`).join('')}</ul></article>`;
  }).join('')}</div>`;
}
function dashboard(course) {
  const {completed,lessons,percent,next}=courseStats(course);
  const nextClass=course.sessions[0];
  return `<div class="dash-hero"><div><p class="eyebrow">${state.demo ? 'SAMPLE COHORT' : e(state.enrolment?.cohorts?.name||'YOUR COHORT')}</p><h1>Your learning space</h1><p>Pick up your next lesson and keep track of your assignments and live classes.</p>${next?button('Continue learning','#lesson/'+e(next.id),'primary'):button('View my courses','#courses','secondary')}</div><div class="dash-art" aria-hidden="true">✳</div></div>
    <div class="stats"><article class="panel"><span>${icon('chart',18)} Course progress</span><strong>${percent}%</strong>${progressBar(percent)}</article><article class="panel"><span>${icon('check',18)} Lessons completed</span><strong>${completed}<small> / ${lessons.length}</small></strong></article><article class="panel"><span>${icon('calendar',18)} Next live class</span><strong class="next-class">${nextClass?e(nextClass.title):'To be announced'}</strong><small>${nextClass?dateFormat(nextClass.starts_at):'Times are shown in WAT'}</small></article></div>
    <div class="section-heading"><h2>My courses</h2><a class="text-link" href="#courses">View courses ${icon('arrow',17)}</a></div>${courseCards(course)}`;
}
function classes(course) {
  return `<div class="dash-intro"><h1>Live classes</h1><p>Upcoming classes for your group. All times are in West Africa Time.</p></div><div class="panel">
    ${course.sessions.length ? `<ul class="detail-list">${course.sessions.map(s=>`<li><div><strong>${e(s.title)}</strong><p>${dateFormat(s.starts_at)}</p></div>${urlSafe(s.join_url)?`<a class="button primary" href="${urlSafe(s.join_url)}" target="_blank" rel="noopener">Join class ${icon('arrow',17)}</a>`:''}</li>`).join('')}</ul>`
    : message(state.demo?'This demo has no live class links.':'Your group has no upcoming classes yet.')}</div>`;
}
function assignments(course) {
  const items=courseStats(course).lessons.filter(l=>l.kind==='assignment');
  return `<div class="dash-intro"><h1>Assignments</h1><p>Open a task to see the instructions, submit your work or review feedback.</p></div><div class="panel">${items.length?`<ul class="detail-list">${items.map(l=>{
    const submission = course.submissions[l.id];
    return `<li><div><strong>${e(l.title)}</strong><p>${e(l.overview)}</p></div><span class="tag">${submission?'Submitted':'To do'}</span><a class="text-link" href="#lesson/${e(l.id)}">Open ${icon('arrow',17)}</a></li>`;
  }).join('')}</ul>`:message('No assignments have been published yet.')}</div>`;
}
function progressPage(course) {
  const stats=courseStats(course);
  return `<div class="dash-intro"><h1>My progress</h1><p>Review the lessons you have marked as complete and return to any task.</p></div>
  <div class="panel progress-panel"><div class="section-heading"><h2>Lesson completion</h2><strong>${stats.percent}%</strong></div>${progressBar(stats.percent)}<p>${stats.completed} of ${stats.lessons.length} lessons complete</p></div>${courseCards(course)}`;
}
function lessonPage(course,id) {
  const {lessons}=courseStats(course);
  const lesson=lessons.find(l=>l.id===id);
  if (!lesson) return `<div class="panel"><h1>Lesson unavailable</h1>${button('Back to courses','#courses','secondary')}</div>`;
  const record=course.progress[id];
  const submitted=course.submissions[id];
  const video=urlSafe(lesson.video_url);
  const next=lessons[lessons.indexOf(lesson)+1];
  const task = lesson.kind==='assignment' ? `<section class="panel task"><h2>Your assignment</h2>
    ${submitted?`<span class="tag">Submitted</span><p class="preserve">${e(submitted.response)}</p>${submitted.feedback?`<h3>Feedback</h3><p class="preserve">${e(submitted.feedback)}</p>`:''}${typeof submitted.score==='number'?`<p>Score: ${e(submitted.score)}%</p>`:''}` :
    `<form data-form="assignment" data-id="${e(id)}"><label>Your response<textarea name="response" rows="6" minlength="10" maxlength="4000" required></textarea></label><button type="submit" class="button primary">Submit work ${icon('arrow',17)}</button><p class="form-feedback" aria-live="polite"></p></form>`}</section>` : '';
  return `<a class="text-link back" href="#courses">← Back to courses</a><div class="dash-intro"><span class="tag">${e(lesson.kind)} · ${e(lesson.minutes)} min</span><h1>${e(lesson.title)}</h1><p>${e(lesson.overview)}</p></div>
    <section class="panel lesson-article">${video?`<video controls playsinline preload="metadata" data-lesson="${e(id)}" src="${video}" aria-label="${e(lesson.title)}"></video>`:lesson.kind==='video'?message(state.demo?'This sample lesson includes a reading activity. The course video will be added before launch.':'The video is not available yet.'):''}
    <h2>${lesson.kind==='assignment'?'Brief':video?'Reading notes':'Lesson notes'}</h2><p class="preserve">${e(lesson.body)}</p>
    <div class="actions"><button class="button primary" data-action="complete" data-id="${e(id)}" ${record?.completed_at|| (lesson.kind==='assignment'&&!submitted)?'disabled':''}>${icon('check',17)} ${record?.completed_at?'Completed':'Mark as complete'}</button>${next?button('Next lesson','#lesson/'+e(next.id),'secondary'):''}</div><p id="lesson-status" class="form-feedback" aria-live="polite"></p></section>${task}`;
}
function portal(page,id) {
  if (!state.demo && !state.user) return main(`<div class="panel empty"><h1>Access your learning</h1><p>Sign in to open your course and records.</p><div class="actions">${button('Sign in','#signin')}<button class="button secondary" data-action="demo">Explore demo</button></div></div>`,'public-wrap standard-page');
  const course=currentCourse();
  let content;
  if (!state.demo && state.loading) content=message('Loading your learning records…');
  else if (!state.demo && state.error) content=message(state.error,true);
  else if (!state.demo && !state.enrolment) content=`<div class="panel empty"><h1>Your learning will appear here</h1><p>When the academy assigns you to a group, you will see your programme and live class schedule here.</p>${button('My application','#apply','secondary')}</div>`;
  else if (page==='courses') content=`<div class="dash-intro"><h1>My courses</h1><p>Choose a module and open a lesson.</p></div>${courseCards(course)}`;
  else if (page==='classes') content=classes(course);
  else if (page==='assignments') content=assignments(course);
  else if (page==='progress') content=progressPage(course);
  else if (page==='lesson') content=lessonPage(course,id);
  else content=dashboard(course);
  return `<div class="portal-shell"><aside class="sidebar"><div>${brand()}<nav aria-label="Learning navigation">${sectionLinks.map(([label,name,path])=>`<a href="#${path}" ${(page===path||page==='lesson'&&path==='courses')?'aria-current="page"':''}>${icon(name,19)}<span>${label}</span></a>`).join('')}</nav></div><a class="site-return" href="#home">← Academy home</a></aside>
  ${main(`<div class="portal-top"><span>${state.demo?'Demo learning portal':'Learning portal'}</span>${state.demo?'<button class="button secondary small" data-action="exit-demo">Exit demo</button>':'<button class="button secondary small" data-action="signout">Sign out</button>'}</div>
  ${state.demo?`<div class="demo-notice"><strong>Demo</strong> Sample learning content. Progress is saved in this browser.</div>`:''}
  ${!state.demo && state.records?.enrolments.length>1?`<label class="cohort-selector">Cohort<select id="cohort-switch">${state.records.enrolments.map(item=>`<option value="${e(item.id)}" ${item.id===state.enrolment?.id?'selected':''}>${e(item.cohorts?.name||'Cohort')}</option>`).join('')}</select></label>`:''}
  ${content}`,'portal-main')}</div>`;
}

function render() {
  const [page='home',id]=route();
  const inPortal=sectionLinks.some(([, ,path])=>path===page)||page==='lesson';
  if (inPortal && (state.demo||state.user)) root.innerHTML=portal(page,id);
  else {
    const view= inPortal?portal(page,id):page==='programme'?programme():page==='apply'?applicationPage():page==='signin'?authPage():page==='privacy'?privacyPage():landing();
    root.innerHTML=topbar(page)+view+footer();
  }
  if (page==='lesson') bindVideo();
}
let loadSequence=0;
async function refreshUser() {
  const sequence=++loadSequence;
  if (!state.user || !state.client) {state.records=null;state.enrolment=null;state.course=blank();state.loading=false;state.error='';render();return;}
  state.loading=true;state.error='';render();
  try {
    const records=await learnerRecords(state.client,state.user.id);
    const enrolment=records.enrolments.find(item=>item.id===state.enrolment?.id)||records.enrolments[0];
    const course=enrolment?await loadCourse(state.client,enrolment):blank();
    if (sequence!==loadSequence) return;
    Object.assign(state,{records,enrolment,course});
  } catch {
    if (sequence===loadSequence) state.error='We could not load your records. Refresh the page to try again.';
  } finally {
    if (sequence===loadSequence) {state.loading=false;render();}
  }
}
async function chooseCohort(id) {
  const enrolment=state.records?.enrolments.find(item=>item.id===id);
  if (!enrolment) return;
  const sequence=++loadSequence;
  state.enrolment=enrolment;state.loading=true;state.error='';render();
  try {const course=await loadCourse(state.client,enrolment);if(sequence===loadSequence)state.course=course;}
  catch {if(sequence===loadSequence)state.error='The selected course could not be loaded.';}
  finally {if(sequence===loadSequence){state.loading=false;render();}}
}
function setDemo(enabled) {
  state.demo=enabled;
  try {sessionStorage.setItem('iwa-demo-mode',String(enabled));} catch {}
}
function saveLesson(id, data) {
  if (state.demo) {
    const course=currentCourse();
    const previous=course.progress[id]||{};
    const current={
      position_seconds:data.position??previous.position_seconds??0,
      max_watched_seconds:Math.max(previous.max_watched_seconds||0,data.highest||0,data.position||0),
      completed_at:previous.completed_at||(data.complete?new Date().toISOString():null),
      last_seen_at:new Date().toISOString()
    };
    course.progress[id]=current;writeDemo(course);
    return Promise.resolve(current);
  }
  const previous=state.course.progress[id];
  const position=data.position??previous?.position_seconds??0;
  const highest=Math.max(position,data.highest||0,previous?.max_watched_seconds||0);
  const enrolmentId=state.enrolment.id;
  return saveProgress(state.client,enrolmentId,id,{position,highest,complete:data.complete}).then(saved=>{
    if (state.enrolment?.id===enrolmentId) state.course.progress[id]=saved;
    return saved;
  });
}
function bindVideo() {
  const player=root.querySelector('video[data-lesson]');
  if (!player) return;
  const id=player.dataset.lesson;
  const original=currentCourse().progress[id]?.position_seconds||0;
  let lastSaved=original;
  let pending=false;
  player.addEventListener('loadedmetadata',()=>{
    if(original && original<player.duration) player.currentTime=original;
  },{once:true});
  function savePosition(force) {
    if (!player.isConnected || pending || (!state.demo && !state.enrolment)) return;
    const position=Math.min(86400,Math.floor(player.currentTime));
    if (position===lastSaved || (!force && Math.abs(position-lastSaved)<15)) return;
    pending=true;
    saveLesson(id,{position,highest:position}).then(()=>{lastSaved=position;}).catch(()=>{
      const status=root.querySelector('#lesson-status');
      if(status)status.textContent='Video position could not be saved. Try again when your connection is stable.';
    }).finally(()=>{pending=false;});
  }
  player.addEventListener('timeupdate',()=>savePosition(false));
  player.addEventListener('pause',()=>savePosition(true));
  player.addEventListener('ended',()=>savePosition(true));
}

root.addEventListener('click',async event=>{
  const control=event.target.closest('[data-action],[data-mode]');
  if (!control) return;
  if (control.dataset.mode) {state.mode=control.dataset.mode;state.notice='';render();return;}
  const action=control.dataset.action;
  if(action==='demo') {setDemo(true);go('learn');}
  if(action==='exit-demo') {setDemo(false);go('home');}
  if(action==='signout') {
    control.disabled=true;
    const {error}=await state.client.auth.signOut();
    if(error){control.disabled=false;window.alert('Could not sign out. Please try again.');return;}
    state.user=null;state.recovery=false;state.mode='signin';state.notice='';go('home');refreshUser();
  }
  if(action==='complete') {
    control.disabled=true;
    const id=control.dataset.id;
    const player=root.querySelector('video');
    const position=player?Math.min(86400,Math.floor(player.currentTime)):undefined;
    try {await saveLesson(id,{position,highest:position,complete:true});render();}
    catch {control.disabled=false; const feedback=root.querySelector('#lesson-status');if(feedback)feedback.textContent='Progress could not be saved. Please try again.';}
  }
});
root.addEventListener('change',event=>{if(event.target.id==='cohort-switch')chooseCohort(event.target.value);});
root.addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.target;
  const kind=form.dataset.form;
  if(!kind) return;
  const values=new FormData(form);
  const control=form.querySelector('button[type="submit"]');
  const feedback=form.querySelector('.form-feedback');
  control.disabled=true;feedback.textContent='Working…';
  try {
    if(kind==='assignment'){
      const response=values.get('response').trim();
      if(response.length<10)throw new Error('Enter at least 10 characters.');
      if(state.demo){
        const course=currentCourse();
        course.submissions[form.dataset.id] ||= {response, submitted_at:new Date().toISOString()};
        writeDemo(course);
      } else {
        const result=await submitWork(state.client,state.enrolment.id,form.dataset.id,response);
        state.course.submissions[form.dataset.id]=result;
      }
      render();return;
    }
    if(!state.client)throw new Error('Account access is unavailable.');
    if(kind==='application'){
      await submitApplication(state.client,state.user.id,values);
      await refreshUser();return;
    }
    const email=values.get('email')?.trim();
    const password=values.get('password');
    const redirectTo=location.origin+location.pathname;
    if(kind==='signin'){
      const {error}=await state.client.auth.signInWithPassword({email,password});
      if(error)throw new Error('We could not sign you in. Check your email and password.');
      setDemo(false);go('learn');return;
    }
    if(kind==='signup'){
      const {data,error}=await state.client.auth.signUp({email,password,options:{emailRedirectTo:redirectTo}});
      if(error)throw new Error('We could not create your account. Try again or sign in if you have an account.');
      if(data.session){go('apply');return;}
      state.mode='signin';state.notice='Check your email for a confirmation link, then sign in.';
    }
    if(kind==='reset'){
      const {error}=await state.client.auth.resetPasswordForEmail(email,{redirectTo});
      if(error)throw new Error('We could not request a reset link. Try again in a few minutes.');
      state.notice='If an account exists for this email, a reset link will be sent.';
    }
    if(kind==='recovery'){
      const {error}=await state.client.auth.updateUser({password});
      if(error)throw new Error('We could not save the new password. Request a fresh reset link.');
      state.recovery=false;state.mode='signin';state.notice='Password updated.';go('learn');
    }
    render();
  } catch (error) {
    const expected=['Enter at least','Account access','We could not'];
    feedback.textContent=kind==='application'&&error.code==='23505'?'An application already exists for this account. Refresh to view its status.':
      expected.some(prefix=>error.message?.startsWith(prefix))?error.message:'We could not save your submission. Please check the details and try again.';
    control.disabled=false;
  }
});

window.addEventListener('hashchange',()=>{
  if(location.hash==='#content'){document.querySelector('#content')?.focus();return;}
  render();document.querySelector('#content')?.focus({preventScroll:true});window.scrollTo(0,0);
});
document.querySelector('.skip').addEventListener('click',event=>{
  event.preventDefault(); document.querySelector('#content')?.focus();
});
try {state.demo=sessionStorage.getItem('iwa-demo-mode')==='true';} catch {}
const recoveryAtLoad=new URLSearchParams(location.hash.slice(1)).get('type')==='recovery';
render();
async function initialise() {
  try {
    state.client=await connect();
    if(state.client){
      state.client.auth.onAuthStateChange((event,session)=>{
        if(event==='PASSWORD_RECOVERY'||(event==='INITIAL_SESSION'&&session&&recoveryAtLoad)){state.recovery=true;go('signin');}
        const user=session?.user||null;
        const changed=user?.id!==state.user?.id;
        state.user=user;
        state.authReady=true;
        if(changed||event==='INITIAL_SESSION')setTimeout(refreshUser,0);
      });
    } else {state.authReady=true;render();}
  } catch {state.backendError=true;state.authReady=true;render();}
}
initialise();
