import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { JSDOM, VirtualConsole } from 'jsdom';
import worker from '../src/index.js';
import { fixture } from './fixtures.js';
const source = name => readFileSync(new URL('../../wf/' + name, import.meta.url), 'utf8');
import { WF_BUILD } from '../../wf/build.js';
const bundled = ['build.js','content.js','model.js','app.js'].map(name=>source(name).replace(/^import .*;$/gm,'').replace(/export (const|function) /g,'$1 ')).join('\n');
const shell = source('index.html');
const appScriptTag = '<script type="module" src="./app.js"></script>';
assert.ok(shell.includes(appScriptTag), 'frontend test harness must find the actual application script');
const html = shell.replace(appScriptTag,()=>'<script>'+bundled+'</script>');

function device(env, hash = '', legacy = null, url = 'https://mo.elasrag.com/', initiallyOffline = false, serviceWorker = null, language = 'ar', options = {}) {
  let cookie = options.cookie || '';
  const requests = [];
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
      if (language) window.localStorage.setItem('wf-language-v1', language);
      if (legacy) Object.entries(legacy).forEach(([key, value]) => window.localStorage.setItem(key, value));
      if(options.guest)window.sessionStorage.setItem('wf-guest-preview','1');
      window.fetch = async (url, options) => {
        requests.push({url:String(url),method:options.method || 'GET'});
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
  return { dom, window: dom.window, document: dom.window.document, errors, navigations, requests, offline: value => unavailable = value };
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

test('first visit opens in English and one compact control shows the other language',t=>{
  const {env}=fixture();const fresh=device(env,'',null,'https://mo.elasrag.com/',false,null,null);t.after(()=>fresh.window.close());
  assert.equal(fresh.document.documentElement.lang,'en');assert.equal(fresh.document.documentElement.dir,'ltr');
  assert.equal(fresh.document.title,'WF Staff Companion');
  assert.equal(fresh.document.getElementById('languageToggle').textContent,'ع');
  assert.equal(fresh.document.querySelectorAll('dialog .language-toggle').length,0);
  click(fresh,'#languageToggle');
  assert.equal(fresh.document.documentElement.lang,'ar');assert.equal(fresh.document.getElementById('languageToggle').textContent,'EN');
  assert.equal(fresh.window.localStorage.getItem('wf-language-v1'),'ar');
  const saved=device(env,'',null,'https://mo.elasrag.com/?lang=ar',false,null,'en');t.after(()=>saved.window.close());
  assert.equal(saved.document.documentElement.lang,'en');
  assert.deepEqual(fresh.errors,[]);assert.deepEqual(saved.errors,[]);
});

test('guest entry preserves KV, hides personal sections and disables all mutations through navigation and translation',async t=>{
  const {env,kv}=fixture();const owner=device(env,'#tasks');t.after(()=>owner.window.close());await signIn(owner);
  fill(owner,'taskInput','owner-confidential-task');owner.document.getElementById('taskForm').dispatchEvent(new owner.window.Event('submit',{cancelable:true}));
  await until(()=>owner.document.getElementById('taskProgress').textContent==='0 / 1');
  const before=JSON.stringify([...kv]);
  const d=device(env,'#details',null,'https://mo.elasrag.com/',false,null,'en');t.after(()=>d.window.close());
  await until(()=>!d.document.getElementById('lockScreen').classList.contains('hidden'));
  fill(d,'usernameInput','previous-account');fill(d,'recoveryInput','previous-recovery');
  click(d,'#guestBtn');await until(()=>active(d,'details'));
  assert.equal(d.document.getElementById('usernameInput').value,'');assert.equal(d.document.getElementById('recoveryInput').value,'');
  const requests=d.requests.length;
  assert.equal(d.window.sessionStorage.getItem('wf-guest-preview'),'1');
  assert.equal(d.document.getElementById('guestNotice').hidden,false);
  assert.equal(d.document.querySelectorAll('[data-private-copy][data-copy]').length,0);
  for(const el of d.document.querySelectorAll('[data-private],[data-job]'))assert.equal(el.textContent,'');
  assert.equal(d.document.getElementById('profileFields').children.length,0);
  assert.ok(d.document.getElementById('details-panel-shift').classList.contains('guest-private-panel'));
  click(d,'[data-edit-profile]');assert.equal(d.document.getElementById('profileDialog').open,false);
  for(const page of ['tasks','training','fire','actions','benefits','uniform','access','home','vault']) {
    d.window.location.hash='#'+page;await until(()=>active(d,page));
    assert.ok(d.document.getElementById('lockScreen').classList.contains('hidden'));
    click(d,'#languageToggle');click(d,'#languageToggle');
  }
  assert.equal(d.document.getElementById('taskForm').hidden,true);
  assert.equal(d.document.getElementById('taskProgress').textContent,'1 / 2');
  assert.equal(d.document.body.textContent.includes('owner-confidential-task'),false);
  for(const el of d.document.querySelectorAll('#personalTasks input,#courseList input,[data-check]'))assert.equal(el.disabled,true);
  const check=d.document.querySelector('#courseList input');check.checked=true;check.dispatchEvent(new d.window.Event('change'));assert.equal(check.checked,false);
  const task=d.document.querySelector('#personalTasks input');task.checked=true;task.dispatchEvent(new d.window.Event('change'));assert.equal(task.checked,false);
  fill(d,'taskInput','not-saved');d.document.getElementById('taskForm').dispatchEvent(new d.window.Event('submit',{cancelable:true}));
  click(d,'#addSecretBtn');assert.equal(d.document.getElementById('secretDialog').open,false);
  click(d,'#addCourseBtn');assert.equal(d.document.getElementById('courseDialog').open,false);
  assert.equal(d.requests.length,requests);assert.equal(JSON.stringify([...kv]),before);
  click(d,'#guestSignIn');await signIn(d);assert.ok(active(d,'vault'));
  assert.equal(d.document.getElementById('guestNotice').hidden,true);assert.equal(d.document.getElementById('taskForm').hidden,false);
  assert.equal(d.document.querySelector('#courseList input').disabled,false);
  assert.equal(d.window.sessionStorage.getItem('wf-guest-preview'),null);
  assert.deepEqual(d.errors,[]);
});

test('guest share link and remembered preview never request private data even with a valid owner cookie',async t=>{
  const {env,kv}=fixture();
  const login=await worker.fetch(new Request('https://mo.elasrag.com/api/login',{method:'POST',headers:{origin:'https://mo.elasrag.com','content-type':'application/json'},body:JSON.stringify({password:'fixture-password-only'})}),env);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  const before=JSON.stringify([...kv]);
  for(const options of [{cookie},{cookie,guest:true}]) {
    const url=options.guest?'https://mo.elasrag.com/':'https://mo.elasrag.com/?guest=1';
    const d=device(env,'#vault',null,url,false,null,'en',options);t.after(()=>d.window.close());
    await until(()=>active(d,'vault'));
    assert.equal(d.requests.length,0);assert.equal(d.document.querySelectorAll('.vault-item').length,0);
    assert.equal(d.document.getElementById('guestNotice').hidden,false);
    assert.equal(d.document.getElementById('shiftDetail').textContent,'Personal schedules stay private');
    click(d,'#logoutBtn');assert.equal(d.document.getElementById('guestNotice').hidden,true);
    assert.equal(d.requests.length,0);assert.equal(d.window.location.search,'');
    assert.deepEqual(d.errors,[]);
  }
  const unauthorized=await worker.fetch(new Request('https://mo.elasrag.com/api/private',{headers:{origin:'https://mo.elasrag.com'}}),env);
  assert.equal(unauthorized.status,401);assert.equal(JSON.stringify([...kv]),before);
});

test('a registered user confirms self deletion, wrong credentials preserve data and successful deletion clears the UI',async t=>{
  const {env,kv}=fixture();const d=device(env,'#details',null,'https://mo.elasrag.com/',false,null,'en');t.after(()=>d.window.close());
  await until(()=>!d.document.getElementById('lockScreen').classList.contains('hidden'));
  click(d,'#registerBtn');fill(d,'usernameInput','john');fill(d,'passInput','12');click(d,'#unlockBtn');await until(()=>active(d,'details'));click(d,'#closeRecovery');
  assert.equal(d.document.getElementById('accountSettings').hidden,false);
  click(d,'#deleteAccountBtn');assert.equal(d.document.getElementById('deleteAccountDialog').open,true);assert.equal(d.document.getElementById('deleteAccountExpectedName').textContent,'john');
  click(d,'#languageToggle');assert.match(d.document.querySelector('#deleteAccountDialog h3').textContent,/حذف/);click(d,'#languageToggle');
  const submit=()=>d.document.getElementById('deleteAccountForm').dispatchEvent(new d.window.Event('submit',{cancelable:true}));
  fill(d,'deleteAccountName','someone-else');fill(d,'deleteAccountPassword','12');submit();assert.match(d.document.getElementById('deleteAccountError').textContent,/sign-in username shown/);
  const before=JSON.stringify([...kv]);fill(d,'deleteAccountName',' John ');fill(d,'deleteAccountPassword','wrong');submit();
  await until(()=>d.document.getElementById('deleteAccountError').textContent.includes('sign-in'));
  assert.equal(JSON.stringify([...kv]),before);assert.equal(d.document.getElementById('deleteAccountDialog').open,true);
  fill(d,'deleteAccountPassword','12');submit();await until(()=>active(d,'home') && d.document.getElementById('privateMessage').textContent.includes('deleted'));
  assert.equal(d.document.getElementById('deleteAccountDialog').open,false);assert.equal(d.document.getElementById('deleteAccountPassword').value,'');
  assert.equal(d.document.getElementById('accountSettings').hidden,true);assert.equal(d.window.localStorage.getItem('wf-account-hint'),null);
  assert.equal(kv.size,0);assert.deepEqual(d.errors,[]);
  const owner=device(env,'#details');t.after(()=>owner.window.close());await signIn(owner);assert.equal(owner.document.getElementById('accountSettings').hidden,true);
});

test('public access, protected direct routes, translated auth, vault CRUD, another device, XSS and offline failure', async t => {
  const { env, records } = fixture();
  const a = device(env); const b = device(env, '#vault');
  t.after(() => { a.window.close(); b.window.close(); });
  assert.equal(a.document.documentElement.dir, 'rtl');
  assert.equal(a.document.getElementById('setupMode'), null);
  for (const page of ['fire', 'training', 'benefits', 'uniform', 'access', 'home']) {
    click(a, page==='benefits'?'#home [data-page="benefits"]':page==='access'?'#home [data-page="access/reset"]':`[data-page="${page}"]`);
    assert.ok(active(a, page));
    assert.ok(a.document.getElementById('lockScreen').classList.contains('hidden'));
  }
  click(a, '[data-page="details"]');
  await until(() => !a.document.getElementById('lockScreen').classList.contains('hidden'));
  fill(a, 'passInput', 'wrong'); click(a, '#unlockBtn');
  await until(() => a.document.getElementById('unlockError').textContent.length > 0);
  assert.match(a.document.getElementById('unlockError').textContent, /الدخول/);
  click(a, '#lockLanguageToggle');
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
  click(a,'#registerBtn');fill(a,'usernameInput','ui-colleague');fill(a,'passInput','12');click(a,'#unlockBtn');
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
  click(b,'#otherAccountBtn');fill(b,'usernameInput','ui-colleague');fill(b,'passInput','12');click(b,'#unlockBtn');
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
  click(a,'#languageToggle');assert.equal(scroll,1169);assert.equal(a.document.documentElement.dir,'ltr');
  click(a,'#languageToggle');assert.equal(scroll,1200);assert.equal(a.document.documentElement.dir,'rtl');
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
  click(d,'#languageToggle');assert.equal(d.document.getElementById('benefits-tab-discounts').getAttribute('aria-selected'),'true');
  click(d,'#benefits-tab-leisure');assert.equal(d.window.location.hash,'#benefits/leisure');
  click(d,'#languageToggle');assert.equal(d.document.getElementById('benefits-panel-leisure').hidden,false);assert.equal(d.document.getElementById('benefits-panel-meals').hidden,true);
  assert.deepEqual(d.errors,[]);
});

test('the alert bell follows saved training dates and keeps its place through translation',async t=>{
  const {env}=fixture();const d=device(env,'#details');t.after(()=>d.window.close());await signIn(d);
  click(d,'[data-page="training"]');click(d,'#addCourseBtn');fill(d,'courseEN','Safety reminder');
  const uk=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(part=>[part.type,part.value]));
  const due=new Date(Date.UTC(+uk.year,+uk.month-1,+uk.day+2)).toISOString().slice(0,10);
  fill(d,'courseDue',due);click(d,'#saveCourse');await until(()=>!d.document.getElementById('courseDialog').open);
  assert.equal(d.document.getElementById('alertsCount').hidden,false);
  click(d,'#alertsBtn');assert.ok(d.document.getElementById('alertsDialog').open);
  assert.match(d.document.getElementById('alertsList').textContent,/Safety reminder/);
  assert.equal(d.document.querySelectorAll('dialog .language-toggle').length,0);
  click(d,'#closeAlerts');click(d,'#languageToggle');click(d,'#alertsBtn');assert.ok(d.document.getElementById('alertsDialog').open);
  assert.match(d.document.getElementById('alertsList').textContent,/Safety reminder/);
  click(d,'#alertsList .alert-item:last-child');assert.ok(active(d,'training'));
  assert.equal(d.document.getElementById('alertsDialog').open,false);
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
 click(a,'[data-shift-day="1"]');assert.ok(a.document.querySelector('[data-shift-day="1"]').checked);
 click(a,'#saveProfile');await until(()=>!a.document.getElementById('profileDialog').open);
 click(a,'#languageToggle');click(a,'[data-edit-profile]');
 assert.equal(a.document.querySelector('[data-weekday="1"]').textContent,'Monday');
 assert.ok(a.document.querySelector('[data-shift-day="1"]').checked);
 click(a,'#cancelProfile');
 assert.equal(JSON.parse(kv.get('private-data')).profile.shiftDays,'1,5,6');
 assert.ok(!a.document.getElementById('shiftHeadline').textContent.includes('at a glance'));
 assert.match(a.document.querySelector('[data-job="shiftDays"]').textContent,/Monday/);
 assert.ok(a.document.getElementById('shiftDetail').textContent.length>0);
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
  click(d,'[data-page="home"]');click(d,'#home [data-page="benefits"]');
  assert.ok(active(d,'benefits'));assert.equal(d.document.querySelector('#benefits [data-tab="meals"]').getAttribute('aria-selected'),'true');
  assert.equal(d.document.getElementById('benefits-tab-travel').textContent,'مزايا أخرى');
  assert.match(d.document.querySelector('#benefits [data-back]').textContent,/الرئيسية/);
  click(d,'#benefits-tab-discounts');
  click(d,'#benefits [data-back]');assert.ok(active(d,'home'));
  assert.equal(d.document.querySelectorAll('#home [data-page="benefits"]').length,1);
  assert.equal(d.document.querySelectorAll('#home [data-page^="benefits/"]').length,0);
  assert.equal(d.document.querySelectorAll('#home .company-tools [data-page="access/reset"]').length,1);
  click(d,'#home [data-page="benefits"]');
  assert.equal(d.document.querySelector('#benefits [data-tab="discounts"]').getAttribute('aria-selected'),'true');
  assert.match(d.document.querySelector('#benefits [data-back]').textContent,/الرئيسية/);
  assert.equal(d.window.history.state.wfFrom,'home');
  click(d,'#benefits-tab-leisure');
  assert.equal(d.window.history.state.wfFrom,'home');
  click(d,'#benefits [data-back]');assert.ok(active(d,'home'));
  assert.equal(d.document.getElementById('reference'),null);
  assert.equal(d.document.querySelectorAll('.nav-btn').length,3);
  assert.equal(d.document.getElementById('homeSearch'),null);
  assert.equal(d.document.querySelector('.emergency-strip').hidden,false);
  assert.equal(d.document.querySelectorAll('#home [data-page="fire"]').length,0);
  assert.ok(d.document.querySelector('#home .shift-hero').compareDocumentPosition(d.document.querySelector('#home .home-focus')) & d.window.Node.DOCUMENT_POSITION_FOLLOWING);
  assert.equal(d.document.querySelectorAll('#home .home-focus .focus-card').length,2);
  click(d,'#home .company-tools [data-page="access/reset"]');assert.ok(active(d,'access'));
  assert.equal(d.document.querySelector('#access [data-tab="reset"]').getAttribute('aria-selected'),'true');
  click(d,'#access [data-back]');assert.ok(active(d,'home'));
  click(d,'#home [data-page="uniform"]');assert.ok(active(d,'uniform'));
  assert.equal(d.document.querySelectorAll('#uniform [data-tab]').length,0);
  assert.equal(d.document.querySelectorAll('#uniform .uniform-guide').length,1);
  assert.deepEqual(d.errors,[]);
});

test('primary navigation returns home and keeps task drafts and page reading positions',async t=>{
  const {env}=fixture();const d=device(env,'#tasks');t.after(()=>d.window.close());
  await signIn(d);
  let scroll=0;
  Object.defineProperty(d.window,'scrollY',{get:()=>scroll});
  d.window.scrollTo=options=>{scroll=options.top;};
  fill(d,'taskInput','Keep this draft');
  scroll=180;
  click(d,'nav [data-page="training"]');
  assert.ok(active(d,'training'));
  assert.match(d.document.querySelector('#training [data-back]').textContent,/الرئيسية/);
  assert.equal(d.window.history.state.wfFrom,'home');
  click(d,'nav [data-page="tasks"]');
  assert.ok(active(d,'tasks'));assert.equal(scroll,180);
  assert.equal(d.document.getElementById('taskInput').value,'Keep this draft');
  assert.match(d.document.querySelector('#tasks [data-back]').textContent,/الرئيسية/);
  click(d,'nav [data-page="home"]');click(d,'#home [data-page="benefits"]');
  scroll=260;click(d,'#benefits-tab-discounts');assert.equal(scroll,0);
  scroll=90;click(d,'#benefits-tab-meals');assert.equal(scroll,260);
  click(d,'#benefits-tab-discounts');assert.equal(scroll,90);
  assert.deepEqual(d.errors,[]);
});

test('induction stays inside work details and missing work PIN can be added without changing other data',async t=>{
  const {env,kv}=fixture();const d=device(env,'#details/arrival');t.after(()=>d.window.close());
  await signIn(d);
  assert.equal(d.document.querySelectorAll('#details [data-tab]').length,2);
  assert.equal(d.document.querySelector('#details-panel-shift #inductionHistory').open,true);
  assert.equal(d.document.getElementById('details-tab-shift').getAttribute('aria-selected'),'true');
  click(d,'#details-tab-accounts');
  const pin=d.document.querySelector('[data-private="workPin"]');
  assert.equal(pin.closest('.row').hidden,true);
  assert.equal(d.document.getElementById('addWorkPin').hidden,false);
  click(d,'#addWorkPin');
  const input=d.document.getElementById('profile-workPin');
  assert.equal(input.closest('details').open,true);
  assert.equal(d.document.activeElement,input);
  fill(d,'profile-workPin','fixture-only-pin');click(d,'#saveProfile');
  await until(()=>!d.document.getElementById('profileDialog').open);
  assert.equal(pin.textContent,'fixture-only-pin');assert.equal(pin.closest('.row').hidden,false);
  assert.equal(d.document.getElementById('addWorkPin').hidden,true);
  assert.equal(JSON.parse(kv.get('private-data')).profile.workPin,'fixture-only-pin');
  assert.deepEqual(d.errors,[]);
});

test('Quick Action is public and routes to the existing procedures with contextual return',async t=>{
  const {env}=fixture();const d=device(env,'',null,'https://mo.elasrag.com/',false,null,null);t.after(()=>d.window.close());
  const strip=d.document.querySelector('.action-strip');
  assert.deepEqual([...strip.querySelectorAll('[data-page]')].map(button=>button.dataset.page),['fire','actions']);
  click(d,'.action-hub-strip');assert.ok(active(d,'actions'));
  assert.deepEqual([...d.document.querySelectorAll('#actions .action-hub-card')].map(button=>button.dataset.page),['fire','incident','safety/burns','safety/substances','access/reset']);
  click(d,'#actions [data-page="fire"]');assert.ok(active(d,'fire'));
  assert.match(d.document.querySelector('#fire [data-back]').textContent,/Quick Action/);
  click(d,'#fire [data-back]');await until(()=>active(d,'actions'));
  click(d,'#actions [data-page="safety/burns"]');assert.ok(active(d,'safety'));
  assert.equal(d.document.querySelector('#safety-panel-burns').hidden,false);
  assert.match(d.document.querySelector('#safety-panel-burns').textContent,/20 minutes/);
  assert.match(d.document.querySelector('#safety [data-back]').textContent,/Quick Action/);
  for(const name of ['hazards','lifting','substances']){
    click(d,'#safety-tab-'+name);
    assert.equal(d.document.querySelector('#safety-panel-'+name).hidden,false);
    assert.equal(d.document.querySelector('#safety-tab-'+name).getAttribute('aria-selected'),'true');
  }
  click(d,'#languageToggle');assert.equal(d.document.querySelector('#safety h1').textContent,'سلامة الشغل');
  assert.ok([...d.document.querySelectorAll('#safety [data-i18n]')].every(el=>el.textContent.trim()));
  click(d,'#languageToggle');
  click(d,'#safety [data-back]');await until(()=>active(d,'actions'));
  click(d,'#actions [data-page="access/reset"]');assert.ok(active(d,'access'));
  assert.match(d.document.querySelector('#access [data-back]').textContent,/Quick Action/);
  click(d,'#access [data-back]');await until(()=>active(d,'actions'));
  click(d,'#actions [data-page="safety/substances"]');assert.ok(active(d,'safety'));
  assert.equal(d.document.querySelector('#safety-panel-substances').hidden,false);
  assert.ok(d.document.querySelector('#safety-panel-substances > .coshh-urgent'));
  click(d,'#safety [data-back]');await until(()=>active(d,'actions'));
  click(d,'#languageToggle');assert.equal(d.document.querySelector('#actions h1').textContent,'تصرف سريع');
  assert.equal(d.document.querySelector('#actions [data-page="fire"] strong').textContent,'الحريق والإخلاء');
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

test('fresh visits sign in without installing or waiting for an offline worker', async t => {
  const {env}=fixture();let registrations=0;
  const sw={controller:null,register:async()=>{registrations++;throw new Error('must not install');},getRegistration:async()=>undefined};
  const d=device(env,'#details',null,'https://mo.elasrag.com/',false,sw);t.after(()=>d.window.close());
  await signIn(d);assert.equal(registrations,0);assert.ok(active(d,'details'));assert.deepEqual(d.errors,[]);
});

test('an old controlling worker is replaced with the network-only retirement before private requests',async t=>{
  const {env}=fixture();let replaced=false;
  const sw={controller:{scriptURL:'https://mo.elasrag.com/sw.js?v=19'},register:async(url,options)=>{
    assert.equal(url,'./sw.js?v='+WF_BUILD);assert.equal(options.updateViaCache,'none');
    sw.controller={scriptURL:'https://mo.elasrag.com/sw.js?v='+WF_BUILD};replaced=true;
  }};
  const d=device(env,'#details',null,'https://mo.elasrag.com/',false,sw);t.after(()=>d.window.close());
  await signIn(d);assert.equal(replaced,true);assert.ok(active(d,'details'));assert.deepEqual(d.errors,[]);
});

test('essential safety shortcuts, PPE checklist and emergency copy work in both languages', async t => {
  for(const [language,expectedPPE,expectedPoison,expectedLink] of [
    ['en',/Before using protective equipment/,/If someone swallows a cleaning chemical/,/Open PPE safety checks/],
    ['ar',/قبل استخدام معدات الوقاية/,/لو حد ابتلع مادة تنظيف/,/افتح خطوات فحص معدات الوقاية/],
  ]) {
    const {env} = fixture();
    const d = device(env,'#actions',null,'https://mo.elasrag.com/',false,null,language);
    t.after(()=>d.window.close());
    assert.ok(active(d,'actions'));
    assert.equal(d.document.querySelectorAll('#actions [data-page="safety/substances"]').length,1);
    click(d,'#actions [data-page="safety/substances"]');
    assert.ok(active(d,'safety'));
    assert.equal(d.document.querySelector('#safety-panel-substances').hidden,false);
    const urgent=d.document.querySelector('#safety-panel-substances > .coshh-urgent');
    assert.ok(urgent);
    assert.equal(d.document.querySelector('#safety-panel-substances').firstElementChild,urgent);
    assert.match(urgent.textContent,expectedPoison);
    assert.match(urgent.textContent,/999/);
    assert.equal(urgent.querySelector('a')?.getAttribute('rel'),'noopener');
    click(d,'#safety-tab-hazards');
    const ppe=d.document.querySelector('#safety-panel-hazards > .ppe-action-guide');
    assert.ok(ppe);
    assert.match(ppe.textContent,expectedPPE);
    assert.equal(ppe.querySelectorAll('.ppe-mini-list li').length,3);
    assert.equal(d.document.querySelectorAll('.ppe-action-guide').length,1);
    assert.equal(d.document.querySelectorAll('.safety-sign-tile').length,4);
    assert.deepEqual(
      [...d.document.querySelectorAll('#safety .safety-sign-tile strong')].map(x=>x.textContent.trim()).every(Boolean),true
    );
    click(d,'#safety [data-back]');
    await until(()=>active(d,'actions'));
    click(d,'nav [data-page="home"]');
    assert.ok(active(d,'home'));
    click(d,'#home [data-page="uniform"]');
    assert.ok(active(d,'uniform'));
    assert.equal(d.document.querySelectorAll('#uniform .ppe-action-guide').length,0);
    const link=d.document.querySelector('#uniform .ppe-open-link');
    assert.ok(link);assert.match(link.textContent,expectedLink);
    click(d,'#uniform .ppe-open-link');
    assert.ok(active(d,'safety'));
    assert.equal(d.document.querySelector('#safety-panel-hazards').hidden,false);
    click(d,'#languageToggle');
    assert.equal(d.document.querySelector('#safety-panel-hazards').hidden,false);
    assert.equal(d.document.querySelector('#safety-tab-hazards').getAttribute('aria-selected'),'true');
    assert.deepEqual(d.errors,[]);
  }
});

test('the build ID comes from one module and public assets have no duplicated URL version strings',()=>{
  const shell=source('index.html');
  const appCode=source('app.js');
  const workerSource=readFileSync(new URL('../src/index.js',import.meta.url),'utf8');
  assert.match(shell, /<meta name="wf-build" content="">/);
  assert.match(shell, /src="\.\/app\.js"/);
  assert.match(shell, /href="\.\/styles\.css"/);
  assert.doesNotMatch(shell,/\?v=\d+/);
  assert.doesNotMatch(appCode,/\?v=\d+/);
  assert.match(appCode, /import \{ WF_BUILD \} from "\.\/build\.js"/);
  assert.match(workerSource, /import \{ WF_BUILD \} from "\.\.\/\.\.\/wf\/build\.js"/);
  assert.match(WF_BUILD,/^\d+$/);
});
