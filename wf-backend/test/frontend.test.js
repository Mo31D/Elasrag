import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { JSDOM, VirtualConsole } from 'jsdom';
import worker from '../src/index.js';
import { fixture } from './fixtures.js';
const source = name => readFileSync(new URL('../../wf/' + name, import.meta.url), 'utf8');
const bundled = ['content.js','model.js','app.js'].map(name=>source(name).replace(/^import .*;$/gm,'').replace(/export (const|function) /g,'$1 ')).join('\n');
const html = source('index.html').replace('<script type="module" src="./app.js"></script>',()=>'<script>'+bundled+'</script>');

function device(env, hash = '', legacy = null, url = 'https://mo.elasrag.com/', initiallyOffline = false, serviceWorker = null) {
  let cookie = '';
  let unavailable = initiallyOffline;
  const errors = [];
  const navigations = [];
  const console = new VirtualConsole();
  console.on('jsdomError', error => { if (error.type === 'not-implemented' && error.message.includes('navigation')) navigations.push(error); else errors.push(error); });
  const dom = new JSDOM(html, {
    url: url + hash, runScripts: 'dangerously', virtualConsole: console,
    beforeParse(window) {
      Object.defineProperty(window, 'crypto', { value: webcrypto });
      window.TextEncoder = TextEncoder; window.TextDecoder = TextDecoder;
      window.AbortController = AbortController;
      window.structuredClone = structuredClone; window.scrollBy = () => {}; window.scrollTo = () => {}; window.confirm = () => true;
      Object.defineProperty(window.navigator, 'onLine', {value:!initiallyOffline,configurable:true});
      window.navigator.clipboard = { writeText: async () => {} };
      if(serviceWorker)Object.defineProperty(window.navigator,'serviceWorker',{value:serviceWorker});
      window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
      window.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new window.Event('close')); };
      if (legacy) Object.entries(legacy).forEach(([key, value]) => window.localStorage.setItem(key, value));
      window.fetch = async (url, options) => {
        assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store');
        if (unavailable) throw new Error('offline fixture');
        const request = new Request(new URL(url, window.location.origin), { ...options, headers: { ...options.headers, origin: window.location.origin, ...(cookie ? { cookie } : {}) } });
        const response = await worker.fetch(request, env);
        const nextCookie = response.headers.get('set-cookie');
        if (nextCookie) cookie = nextCookie.split(';')[0];
        return response;
      };
    },
  });
  return { dom, window: dom.window, document: dom.window.document, errors, navigations, offline: value => unavailable = value };
}
async function until(fn) {
  const start = Date.now();
  while (!fn()) { if (Date.now() - start > 3000) throw new Error('Timed out'); await new Promise(resolve => setTimeout(resolve, 10)); }
}
const click = (d, selector) => d.document.querySelector(selector).click();
const fill = (d, id, value) => d.document.getElementById(id).value = value;
const active = (d, id) => d.document.getElementById(id).classList.contains('active');
async function signIn(d) {
  await until(() => !d.document.getElementById('lockScreen').classList.contains('hidden'));
  fill(d, 'passInput', 'fixture-password-only'); click(d, '#unlockBtn');
  await until(() => d.document.getElementById('lockScreen').classList.contains('hidden'));
}

test('public access, protected direct routes, translated auth, vault CRUD, another device, XSS and offline failure', async t => {
  const { env, records } = fixture();
  const a = device(env); const b = device(env, '#vault');
  t.after(() => { a.window.close(); b.window.close(); });
  assert.equal(a.document.documentElement.dir, 'rtl');
  assert.equal(a.document.getElementById('setupMode'), null);
  for (const page of ['fire', 'training', 'benefits', 'uniform', 'access', 'home']) {
    click(a, page==='benefits'?'#home [data-page="benefits/meals"]':`[data-page="${page}"]`);
    assert.ok(active(a, page));
    assert.ok(a.document.getElementById('lockScreen').classList.contains('hidden'));
  }
  click(a, '[data-page="details"]');
  await until(() => !a.document.getElementById('lockScreen').classList.contains('hidden'));
  fill(a, 'passInput', 'wrong'); click(a, '#unlockBtn');
  await until(() => a.document.getElementById('unlockError').textContent.length > 0);
  assert.match(a.document.getElementById('unlockError').textContent, /الدخول/);
  click(a, '[data-lang="en"]');
  assert.equal(a.document.documentElement.dir, 'ltr');
  assert.equal(a.document.getElementById('unlockError').textContent, 'Check your sign-in details.');
  await signIn(a);
  assert.ok(active(a, 'details'));
  click(a, '[data-page="vault"]'); await until(() => active(a, 'vault'));
  click(a, '#addSecretBtn'); fill(a, 'secretLabel', '<img src=x onerror=alert(1)>'); fill(a, 'secretValue', 'fixture-entry'); click(a, '#saveSecret');
  await until(() => a.document.querySelectorAll('.vault-item').length === 1);
  assert.equal(a.document.querySelectorAll('#vaultList img').length, 0);
  await signIn(b); assert.ok(active(b, 'vault'));
  assert.equal(b.document.querySelector('.secret').textContent, 'fixture-entry');
  click(a, '.mini-actions button:nth-child(3)'); fill(a, 'secretValue', 'edited');
  await new Promise(resolve => setTimeout(resolve, 1005)); click(a, '#saveSecret');
  await until(() => a.document.querySelector('.secret').textContent === 'edited');
  click(a, '#editProfileBtn'); fill(a, 'profile-colleagueNumber', 'fixture-account');fill(a,'profile-workPin','fixture-pin');
  await new Promise(resolve => setTimeout(resolve, 1005)); click(a, '#saveProfile');
  await until(() => !a.document.getElementById('profileDialog').open);
  click(a, '[data-page="details"]'); await until(() => active(a, 'details'));
  assert.equal(a.document.querySelector('[data-private="colleagueNumber"]').textContent, 'fixture-account');
  click(a,'#details-tab-accounts');
  assert.equal(a.document.querySelector('[data-private="workPin"]').textContent,'fixture-pin');
  click(a, '[data-page="vault"]'); await until(() => active(a, 'vault'));
  await new Promise(resolve => setTimeout(resolve, 1005)); click(a, '.mini-actions button:last-child');
  await until(() => a.document.querySelectorAll('.vault-item').length === 0);
  click(a, '#logoutBtn');
  await until(() => active(a, 'home') && a.document.getElementById('vaultList').textContent === '');
  click(a, '[data-page="details"]');
  await until(() => !a.document.getElementById('lockScreen').classList.contains('hidden'));
  assert.equal(a.document.querySelector('[data-private="colleagueNumber"]').textContent, '');
  a.offline(true); fill(a, 'passInput', 'fixture-password-only'); click(a, '#unlockBtn');
  await until(() => /Unable/.test(a.document.getElementById('unlockError').textContent));
  click(a, '#lockScreen [data-page="fire"]'); assert.ok(active(a, 'fire'));
  assert.ok(a.document.getElementById("lockScreen").classList.contains("hidden"));
  assert.ok(records.size > 0);
  assert.deepEqual(a.errors, []); assert.deepEqual(b.errors, []);
});

test('encrypted legacy import is verified centrally, repeat import deduplicates and old storage remains', async t => {
  const { env, kv } = fixture();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const base = await webcrypto.subtle.importKey('raw', new TextEncoder().encode('old-fixture-password'), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey({ name:'PBKDF2', salt, iterations:250000, hash:'SHA-256' }, base, { name:'AES-GCM', length:256 }, false, ['encrypt']);
  const b64 = data => Buffer.from(data).toString('base64');
  const encrypt = async text => {
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    return { iv:b64(iv), data:b64(await webcrypto.subtle.encrypt({ name:'AES-GCM', iv }, key, new TextEncoder().encode(text))) };
  };
  const legacy = {
    'wf-vault-meta-v1': JSON.stringify({ salt:b64(salt), verifier:await encrypt('wf-ok-v1') }),
    'wf-vault-data-v1': JSON.stringify(await encrypt(JSON.stringify([{label:'Old entry', value:'old-value', note:''}]))),
  };
  const d = device(env, '#vault', legacy, 'https://www.elasrag.com/wf/?migrate=1'); t.after(() => d.window.close());
  await signIn(d);
  click(d, '#importLegacyBtn'); fill(d, 'oldPass', 'wrong'); click(d, '#migrateVault');
  await until(() => d.document.getElementById('migrationError').textContent.length > 0);
  fill(d, 'oldPass', 'old-fixture-password'); click(d, '#migrateVault');
  await until(() => d.document.querySelectorAll('.vault-item').length === 1);
  assert.equal(JSON.parse(kv.get('private-data')).items.length, 1);
  assert.equal(d.window.localStorage.getItem('wf-vault-data-v1'), legacy['wf-vault-data-v1']);
  assert.equal(d.window.localStorage.getItem('wf-vault-meta-v1'), legacy['wf-vault-meta-v1']);
  click(d, '#importLegacyBtn'); fill(d, 'oldPass', 'old-fixture-password');
  await new Promise(resolve => setTimeout(resolve, 1005)); click(d, '#migrateVault');
  await until(() => !d.document.getElementById('migrationDialog').open);
  assert.equal(JSON.parse(kv.get('private-data')).items.length, 1);
  assert.equal(d.navigations.length, 2);
  assert.deepEqual(d.errors, []);
});


test('the previous address redirects normally and only stays open for an existing local vault import', async t => {
  const { env } = fixture();
  const d = device(env, '#training', null, 'https://www.elasrag.com/wf/');
  t.after(() => d.window.close());
  assert.equal(d.navigations.length, 1);
  assert.deepEqual(d.errors, []);
  const empty = device(env, '#vault', null, 'https://www.elasrag.com/wf/?migrate=1');
  t.after(() => empty.window.close());
  assert.equal(empty.navigations.length, 1);
});


test('cached public reference remains available at the previous address while offline', async t => {
  const { env } = fixture();
  const d = device(env, '#fire', null, 'https://www.elasrag.com/wf/', true);
  t.after(() => d.window.close());
  assert.equal(d.navigations.length, 0);
  assert.ok(active(d, 'fire'));
  click(d, '[data-page="training"]');
  assert.ok(active(d, 'training'));
  click(d, '[data-page="details"]');
  await until(() => !d.document.getElementById('lockScreen').classList.contains('hidden'));
  assert.equal(d.document.querySelector('[data-private="colleagueNumber"]').textContent,'');
  assert.deepEqual(d.errors, []);
});

test('new account UI, editable profile, task and course changes synchronize without inheriting owner history',async t=>{
  const {env}=fixture();const a=device(env,'#tasks');t.after(()=>a.window.close());
  await until(()=>!a.document.getElementById('lockScreen').classList.contains('hidden'));
  click(a,'#registerBtn');fill(a,'usernameInput','ui-colleague');fill(a,'passInput','fixture-ui-password');click(a,'#unlockBtn');
  await until(()=>active(a,'tasks') && a.document.getElementById('recoveryDialog').open);
  assert.ok(a.document.getElementById('newRecoveryCode').value);click(a,'#closeRecovery');
  assert.equal(a.document.getElementById('completedCount').textContent,'0');
  fill(a,'taskInput','First task');a.document.getElementById('taskForm').dispatchEvent(new a.window.Event('submit',{bubbles:true,cancelable:true}));
  await until(()=>a.document.querySelectorAll('.personal-task').length===1);
  click(a,'.personal-task input');await until(()=>a.document.getElementById('taskProgress').textContent==='1 / 1');
  click(a,'.personal-task .task-actions button');fill(a,'taskInput','Edited task');a.document.getElementById('taskForm').dispatchEvent(new a.window.Event('submit',{bubbles:true,cancelable:true}));
  await until(()=>a.document.querySelector('.personal-task .task-text').textContent==='Edited task');
  click(a,'#resetTasks');await until(()=>a.document.getElementById('taskProgress').textContent==='0 / 1');
  click(a,'[data-page="training"]');click(a,'#addCourseBtn');fill(a,'courseEN','Personal course');fill(a,'courseAR','كورسي');fill(a,'courseDue','2026-10-08');click(a,'#saveCourse');
  await until(()=>!a.document.getElementById('courseDialog').open);
  assert.equal(a.document.querySelectorAll('#courseList .course-row').length,8);
  click(a,'#courseList .course-row:last-child input');await until(()=>a.document.getElementById('completedCount').textContent==='1');
  click(a,'[data-page="details"]');await until(()=>active(a,'details'));click(a,'[data-edit-profile]');fill(a,'profile-displayName','UI colleague');fill(a,'profile-hours','20');fill(a,'profile-hourlyRate','12');click(a,'#saveProfile');
  await until(()=>!a.document.getElementById('profileDialog').open);
  assert.match(a.document.querySelector('[data-job="weeklyGross"]').textContent,/240|٢٤٠/);
  const b=device(env,'#tasks');t.after(()=>b.window.close());await until(()=>!b.document.getElementById('lockScreen').classList.contains('hidden'));
  click(b,'#otherAccountBtn');fill(b,'usernameInput','ui-colleague');fill(b,'passInput','fixture-ui-password');click(b,'#unlockBtn');
  await until(()=>active(b,'tasks'));
  assert.equal(b.document.querySelector('.personal-task .task-text').textContent,'Edited task');assert.equal(b.document.getElementById('completedCount').textContent,'1');
  click(a,'[data-page="training"]');click(a,'#completedCourses .course-edit');click(a,'#deleteCourse');await until(()=>a.document.getElementById('completedCount').textContent==='0');
  click(a,'[data-page="tasks"]');await until(()=>active(a,'tasks'));click(a,'.personal-task .task-actions button:last-child');await until(()=>a.document.querySelectorAll('.personal-task').length===0);
  assert.deepEqual(a.errors,[]);assert.deepEqual(b.errors,[]);
});

test('language switch keeps page, open sections, checklist state and the same reading anchor',async t=>{
  const {env}=fixture();const a=device(env,'#fire');t.after(()=>a.window.close());
  const warden=a.document.querySelector('[data-checklist="fire-warden"]');warden.open=true;
  click(a,'[data-check="fire-warden-1"]');
  let scroll=1200;Object.defineProperty(a.window,'scrollY',{get:()=>scroll});
  a.window.scrollBy=({top})=>{scroll+=top;};a.window.scrollTo=({top})=>{scroll=top;};
  a.document.querySelector('header').getBoundingClientRect=()=>({top:0,bottom:100,height:100});
  const anchor=warden.querySelector('.task-text');
  anchor.getBoundingClientRect=()=>{const height=a.document.documentElement.lang==='ar'?200:100;const top=1250-scroll;return {top,bottom:top+height,height};};
  click(a,'[data-lang="en"]');assert.equal(scroll,1169);assert.equal(a.document.documentElement.dir,'ltr');
  click(a,'[data-lang="ar"]');assert.equal(scroll,1200);assert.equal(a.document.documentElement.dir,'rtl');
  assert.ok(active(a,'fire'));assert.ok(warden.open);assert.ok(warden.querySelector('input').checked);
  assert.deepEqual(a.errors,[]);
});

test('Safari can sign in when offline registration is unavailable and no unsafe controller exists',async t=>{
  const {env}=fixture();const d=device(env,'#details',null,'https://mo.elasrag.com/',false,{controller:null,register:async()=>{throw new Error('private mode');}});t.after(()=>d.window.close());
  await signIn(d);assert.ok(active(d,'details'));assert.deepEqual(d.errors,[]);
});

test('section tabs retain their selection when translated and direct tab links work',async t=>{
  const {env}=fixture();const d=device(env,'#benefits/discounts');t.after(()=>d.window.close());
  assert.ok(active(d,'benefits'));assert.equal(d.document.getElementById('benefits-panel-meals').hidden,true);assert.equal(d.document.getElementById('benefits-panel-discounts').hidden,false);
  click(d,'[data-lang="en"]');assert.equal(d.document.getElementById('benefits-tab-discounts').getAttribute('aria-selected'),'true');
  click(d,'#benefits-tab-leisure');assert.equal(d.window.location.hash,'#benefits/leisure');
  click(d,'[data-lang="ar"]');assert.equal(d.document.getElementById('benefits-panel-leisure').hidden,false);assert.equal(d.document.getElementById('benefits-panel-meals').hidden,true);
  assert.deepEqual(d.errors,[]);
});

test('an accepted password followed by unavailable data offers a retry without another login',async t=>{
  const f=fixture();f.kv.set('private-data',JSON.stringify({unknownFormat:'preserve'}));const d=device(f.env,'#details');t.after(()=>d.window.close());
  let logins=0;const fetch=d.window.fetch;d.window.fetch=(url,options)=>{if(url.endsWith('/login'))logins++;return fetch(url,options);};
  await until(()=>!d.document.getElementById('lockScreen').classList.contains('hidden'));fill(d,'passInput','fixture-password-only');click(d,'#unlockBtn');
  await until(()=>d.document.getElementById('passwordField').hidden);
  assert.match(d.document.getElementById('unlockError').textContent,/بياناتك/);assert.equal(logins,1);
  f.kv.set('private-data',JSON.stringify({version:1,profile:{},items:[]}));click(d,'#unlockBtn');await until(()=>active(d,'details'));
  assert.equal(logins,1);assert.deepEqual(d.errors,[]);
});

test('weekday ticks save centrally, survive translation and replace the generic hero with the live shift',async t=>{
 const {env,kv}=fixture();const a=device(env,'#details');t.after(()=>a.window.close());await signIn(a);
 click(a,'[data-edit-profile]');
 assert.equal(a.document.querySelectorAll('[data-shift-day]').length,7);
 assert.deepEqual([...a.document.querySelectorAll('[data-shift-day]:checked')].map(x=>x.value),['5','6']);
 click(a,'[data-shift-day="1"]');click(a,'.lang-btn[data-lang="en"]');
 assert.equal(a.document.querySelector('[data-weekday="1"]').textContent,'Monday');assert.ok(a.document.querySelector('[data-shift-day="1"]').checked);
 click(a,'#saveProfile');await until(()=>!a.document.getElementById('profileDialog').open);
 assert.equal(JSON.parse(kv.get('private-data')).profile.shiftDays,'1,5,6');
 assert.ok(!a.document.getElementById('shiftHeadline').textContent.includes('at a glance'));
 assert.match(a.document.querySelector('[data-job="shiftDays"]').textContent,/Monday/);
 assert.ok(a.document.getElementById('shiftMeta').textContent.includes('22:45'));
 assert.deepEqual(a.errors,[]);
});

test('a task added from a stale device merges with newer tasks and profile changes',async t=>{
  const {env,kv}=fixture();
  const a=device(env,'#tasks');const b=device(env,'#tasks');
  t.after(()=>{a.window.close();b.window.close();});
  await signIn(a);await signIn(b);
  fill(b,'taskInput','From the other device');
  b.document.getElementById('taskForm').dispatchEvent(new b.window.Event('submit',{bubbles:true,cancelable:true}));
  await until(()=>b.document.querySelectorAll('.personal-task').length===1);
  fill(a,'taskInput','My new task');
  a.document.getElementById('taskForm').dispatchEvent(new a.window.Event('submit',{bubbles:true,cancelable:true}));
  await until(()=>a.document.querySelectorAll('.personal-task').length===2);
  assert.deepEqual(JSON.parse(kv.get('private-data')).companion.tasks.map(task=>task.label),['From the other device','My new task']);
  assert.equal(a.document.getElementById('taskInput').value,'');
  assert.equal(a.document.getElementById('privateMessage').textContent,'');
  click(b,'[data-page="details"]');await until(()=>active(b,'details'));
  click(b,'#details [data-edit-profile]');fill(b,'profile-site','Second device site');click(b,'#saveProfile');
  await until(()=>!b.document.getElementById('profileDialog').open);
  assert.equal(JSON.parse(kv.get('private-data')).companion.tasks.length,2);
  fill(a,'taskInput','Third task');
  a.document.getElementById('taskForm').dispatchEvent(new a.window.Event('submit',{bubbles:true,cancelable:true}));
  await until(()=>a.document.querySelectorAll('.personal-task').length===3);
  assert.equal(JSON.parse(kv.get('private-data')).profile.site,'Second device site');
  assert.deepEqual(a.errors,[]);
});

test('two signed-in tabs save across sections without false conflicts and protect a real field conflict',async t=>{
  const {env,kv}=fixture();const a=device(env,'#details'),b=device(env,'#details');
  t.after(()=>{a.window.close();b.window.close();});await signIn(a);await signIn(b);
  click(a,'[data-edit-profile]');click(b,'[data-edit-profile]');
  fill(a,'profile-site','New site');fill(b,'profile-manager','New manager');
  click(a,'#saveProfile');await until(()=>!a.document.getElementById('profileDialog').open);
  click(b,'#saveProfile');await until(()=>!b.document.getElementById('profileDialog').open);
  click(a,'[data-page="tasks"]');fill(a,'taskInput','Fresh task');
  a.document.getElementById('taskForm').dispatchEvent(new a.window.Event('submit',{bubbles:true,cancelable:true}));
  await until(()=>a.document.querySelectorAll('.personal-task').length===1);
  click(b,'[data-page="training"]');click(b,'#addCourseBtn');fill(b,'courseEN','Fresh course');click(b,'#saveCourse');
  await until(()=>!b.document.getElementById('courseDialog').open);
  click(a,'[data-page="vault"]');await until(()=>active(a,'vault'));click(a,'#addSecretBtn');
  fill(a,'secretLabel','Secure note');fill(a,'secretValue','One');click(a,'#saveSecret');
  await until(()=>!a.document.getElementById('secretDialog').open);
  const saved=JSON.parse(kv.get('private-data'));
  assert.equal(saved.profile.site,'New site');assert.equal(saved.profile.manager,'New manager');
  assert.equal(saved.companion.tasks[0].label,'Fresh task');
  assert.ok(saved.companion.courses.some(course=>course.titleEN==='Fresh course'));
  assert.equal(saved.items[0].value,'One');
  click(a,'#editProfileBtn');fill(a,'profile-site','Latest site');click(a,'#saveProfile');
  await until(()=>!a.document.getElementById('profileDialog').open);
  click(b,'[data-page="vault"]');await until(()=>active(b,'vault'));
  click(b,'#editProfileBtn');fill(b,'profile-site','Stale site');click(b,'#saveProfile');
  await until(()=>b.document.getElementById('profileError').textContent.length>0);
  assert.match(b.document.getElementById('profileError').textContent,/اتعدّلت/);
  assert.equal(b.document.getElementById('profileDialog').open,true);
  assert.equal(JSON.parse(kv.get('private-data')).profile.site,'Latest site');
  click(b,'#cancelProfile');click(b,'#editProfileBtn');
  assert.equal(b.document.getElementById('profile-site').value,'Latest site');
  assert.deepEqual(a.errors,[]);assert.deepEqual(b.errors,[]);
});

test('returning from another page keeps draft inputs and back links return to their actual source',async t=>{
  const {env}=fixture();const d=device(env,'#tasks');t.after(()=>d.window.close());
  await signIn(d);
  fill(d,'taskInput','Finish tonight');
  click(d,'[data-page="fire"]');assert.ok(active(d,'fire'));
  assert.match(d.document.querySelector('#fire [data-back]').textContent,/مهامي/);
  click(d,'#fire [data-back]');await until(()=>active(d,'tasks'));
  assert.equal(d.document.getElementById('taskInput').value,'Finish tonight');
  d.window.dispatchEvent(new d.window.Event('pagehide'));
  assert.equal(d.document.getElementById('privacyShield').classList.contains('hidden'),false);
  const shown=new d.window.Event('pageshow');Object.defineProperty(shown,'persisted',{value:true});d.window.dispatchEvent(shown);
  await until(()=>d.document.getElementById('privacyShield').classList.contains('hidden'));
  assert.ok(active(d,'tasks'));assert.equal(d.document.getElementById('taskInput').value,'Finish tonight');
  click(d,'[data-page="home"]');click(d,'#home [data-page="benefits/meals"]');
  assert.ok(active(d,'benefits'));assert.equal(d.document.querySelector('#benefits [data-tab="meals"]').getAttribute('aria-selected'),'true');
  assert.match(d.document.querySelector('#benefits [data-back]').textContent,/الرئيسية/);
  click(d,'#benefits [data-back]');assert.ok(active(d,'home'));
  click(d,'[data-page="reference"]');click(d,'#reference [data-page="benefits/discounts"]');
  assert.equal(d.document.querySelector('#benefits [data-tab="discounts"]').getAttribute('aria-selected'),'true');
  assert.match(d.document.querySelector('#benefits [data-back]').textContent,/المرجع/);
  click(d,'#benefits [data-back]');assert.ok(active(d,'reference'));
  assert.deepEqual(d.errors,[]);
});

test('a session renewal restores unsaved task and profile edits for the same account',async t=>{
  const {env,kv}=fixture();const d=device(env,'#tasks');t.after(()=>d.window.close());
  await signIn(d);
  Object.defineProperty(d.document,'hidden',{value:false,configurable:true});
  const originalFetch=d.window.fetch;
  let expire=false;
  d.window.fetch=(url,options)=>expire && String(url).endsWith('/session')?(expire=false,Promise.resolve(new Response(JSON.stringify({authenticated:false}),{headers:{'content-type':'application/json'}}))):originalFetch(url,options);
  fill(d,'taskInput','Unfinished handover');expire=true;d.window.dispatchEvent(new d.window.Event('focus'));
  await until(()=>!d.document.getElementById('lockScreen').classList.contains('hidden'));
  assert.equal(d.document.getElementById('taskInput').value,'');
  fill(d,'passInput','fixture-password-only');click(d,'#unlockBtn');
  await until(()=>active(d,'tasks') && d.document.getElementById('lockScreen').classList.contains('hidden'));
  assert.equal(d.document.getElementById('taskInput').value,'Unfinished handover');
  click(d,'[data-page="details"]');await until(()=>active(d,'details'));
  click(d,'#details [data-edit-profile]');fill(d,'profile-manager','Draft manager');
  const other=device(env,'#details');t.after(()=>other.window.close());await signIn(other);
  click(other,'#details [data-edit-profile]');fill(other,'profile-site','Other tab site');click(other,'#saveProfile');
  await until(()=>!other.document.getElementById('profileDialog').open);
  expire=true;d.window.dispatchEvent(new d.window.Event('focus'));
  await until(()=>!d.document.getElementById('lockScreen').classList.contains('hidden'));
  fill(d,'passInput','fixture-password-only');click(d,'#unlockBtn');
  await until(()=>active(d,'details') && d.document.getElementById('profileDialog').open);
  assert.equal(d.document.getElementById('profile-manager').value,'Draft manager');
  assert.equal(d.document.getElementById('profile-site').value,'Other tab site');
  click(d,'#saveProfile');await until(()=>!d.document.getElementById('profileDialog').open);
  assert.equal(JSON.parse(kv.get('private-data')).profile.site,'Other tab site');
  assert.equal(JSON.parse(kv.get('private-data')).profile.manager,'Draft manager');
  assert.deepEqual(d.errors,[]);assert.deepEqual(other.errors,[]);
});
