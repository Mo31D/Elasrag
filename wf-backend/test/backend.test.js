import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

import { fixture } from './fixtures.js';
const origin = 'https://www.elasrag.com';
function request(path, method = 'GET', body, cookie, headers = {}) {
  return new Request('https://mo.elasrag.com' + path, { method, headers: {
    origin, ...(body != null ? { 'content-type': 'application/json' } : {}), ...(cookie ? { cookie } : {}), ...headers,
  }, ...(body != null ? { body: JSON.stringify(body) } : {}) });
}
async function login(env) {
  const response = await worker.fetch(request('/login', 'POST', { password: env.WF_PASSWORD }), env);
  assert.equal(response.status, 200);
  return response.headers.get('set-cookie').split(';')[0];
}

test('login, host-only secure cookie, cross-device data, conflict and immediate logout revocation', async () => {
  const { env, kv, records } = fixture();
  assert.equal((await worker.fetch(request('/health'), env)).status, 200);
  assert.equal((await worker.fetch(request('/private'), env)).status, 401);
  assert.equal((await worker.fetch(request('/login', 'POST', { password: 'wrong' }), env)).status, 401);
  const response = await worker.fetch(request('/login', 'POST', { password: env.WF_PASSWORD }), env);
  const header = response.headers.get('set-cookie');
  assert.match(header, /HttpOnly; Secure; SameSite=Lax; Path=\/; Max-Age=43200/);
  assert.doesNotMatch(header, /Domain=/i);
  const cookie = header.split(';')[0];
  const cookie2 = await login(env);
  const initial = await worker.fetch(request('/private', 'GET', null, cookie), env);
  const revision = initial.headers.get('etag');
  const seeded = (await initial.json()).data;
  assert.equal(seeded.companion.courses.length,21);
  assert.deepEqual(seeded.items,[]);
  const data = { ...seeded, version: 1, profile: { colleagueNumber: 'test-colleague' }, items: [{ label: '<img onerror=alert(1)>', value: 'test-value', note: '' }] };
  assert.equal((await worker.fetch(request('/private', 'PUT', data, cookie, { 'if-match': revision }), env)).status,429);
  records.set("private-write-time",Date.now()-1001);
  const saved = await worker.fetch(request('/private', 'PUT', data, cookie, { 'if-match': revision }), env);
  assert.equal(saved.status, 200);
  assert.deepEqual(JSON.parse(kv.get('private-data')), data);
  const reopened = await worker.fetch(request('/private', 'GET', null, cookie2), env);
  assert.deepEqual((await reopened.json()).data, data);
  assert.equal(reopened.headers.get('cache-control'), 'no-store');
  assert.equal(reopened.headers.get('access-control-allow-origin'), origin);
  assert.equal(reopened.headers.get('access-control-allow-credentials'), 'true');
  assert.equal((await worker.fetch(request('/private', 'PUT', data, cookie2, { 'if-match': revision }), env)).status, 409);
  assert.equal((await worker.fetch(request('/logout', 'POST', null, cookie), env)).status, 200);
  assert.equal((await worker.fetch(request('/private', 'GET', null, cookie), env)).status, 401);
  assert.equal((await (await worker.fetch(request('/session', 'GET', null, cookie), env)).json()).authenticated, false);
  assert.equal((await worker.fetch(request('/private', 'GET', null, cookie2), env)).status, 200);
});

test('CSRF, exact CORS, body limits, JSON type, schema and login throttling', async () => {
  const { env } = fixture();
  const cookie = await login(env);
  assert.equal((await worker.fetch(request('/login', 'POST', { password: env.WF_PASSWORD }, null, { origin: 'https://evil.example' }), env)).status, 403);
  assert.equal((await worker.fetch(new Request('https://mo.elasrag.com/logout', { method: 'POST' }), env)).status, 403);
  assert.equal((await worker.fetch(request('/private', 'OPTIONS', null, null, { origin: 'https://evil.example' }), env)).status, 403);
  const preflight = await worker.fetch(request('/private', 'OPTIONS'), env);
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get('access-control-allow-headers'), /if-match/);
  assert.equal((await worker.fetch(request('/login', 'POST', { password: 'x'.repeat(5000) }), env)).status, 413);
  assert.equal((await worker.fetch(request('/login', 'POST', { password: 'x' }, null, { 'content-type': 'text/plain' }), env)).status, 415);
  assert.equal((await worker.fetch(request('/private', 'PUT', { version: 1, profile: { unknown: 'x' }, items: [] }, cookie), env)).status, 400);
  assert.equal((await worker.fetch(request('/private', 'PUT', null, cookie), env)).status, 415);
  for (let i = 0; i < 10; i++) assert.equal((await worker.fetch(request('/login', 'POST', { password: 'wrong' }), env)).status, 401);
  assert.equal((await worker.fetch(request('/login', 'POST', { password: 'wrong' }), env)).status, 429);
});

test('expiry, signing-secret rotation, alarm cleanup and legacy data preservation', async () => {
  const f = fixture();
  f.env.WF_PRIVATE_DATA = JSON.stringify({ version: 1, profile: {}, items: [{ label: 'Legacy', value: 'fixture', note: '' }] });
  const cookie = await login(f.env);
  const response = await worker.fetch(request('/private', 'GET', null, cookie), f.env);
  assert.equal((await response.json()).data.items[0].label, 'Legacy');
  const key = [...f.records.keys()].find(key => key.startsWith('session:'));
  f.records.set(key, { until: Date.now() - 1 });
  assert.equal((await worker.fetch(request('/private', 'GET', null, cookie), f.env)).status, 401);
  await f.guard.alarm();
  assert.equal(f.records.has(key), false);
  const nextCookie = await login(f.env);
  f.env.SESSION_SECRET = 'rotated-fixture-secret';
  assert.equal((await worker.fetch(request('/private', 'GET', null, nextCookie), f.env)).status, 401);
  const another = fixture();
  another.kv.set('private-data', JSON.stringify({ importantUnknownFormat: 'preserve' }));
  const otherCookie = await login(another.env);
  assert.equal((await worker.fetch(request('/private', 'GET', null, otherCookie), another.env)).status, 503);
  assert.equal(JSON.parse(another.kv.get('private-data')).importantUnknownFormat, 'preserve');
});

test('older unversioned secret data migrates without blocking owner access or deleting original values',async()=>{
  const {env}=fixture();const original={colleagueNumber:'fixture-colleague',profile:{kioskId:'fixture-kiosk'},savedNote:'fixture legacy note'};
  env.WF_PRIVATE_DATA=JSON.stringify(original);const cookie=await login(env);
  const response=await worker.fetch(request('/private','GET',null,cookie),env);assert.equal(response.status,200);
  const data=(await response.json()).data;assert.equal(data.profile.colleagueNumber,original.colleagueNumber);assert.equal(data.profile.kioskId,original.profile.kioskId);
  assert.ok(data.items.some(item=>item.value===original.savedNote));assert.equal(env.WF_PRIVATE_DATA,JSON.stringify(original));
});

test('concurrent focused changes preserve independent profile, tasks, courses and vault edits',async()=>{
  const {env,kv}=fixture();
  const a=await login(env),b=await login(env);
  const patch=(cookie,changes)=>worker.fetch(request('/api/private/changes','POST',{changes},cookie),env);
  const read=async cookie=>(await (await worker.fetch(request('/api/private','GET',null,cookie),env)).json()).data;
  const before=await read(a);
  const profile=patch(a,[{section:'profile',key:'site',before:before.profile.site,after:'Fixture site'}]);
  const task=patch(b,[{section:'tasks',type:'add',after:{id:'task-one',label:'Check forecourt',done:false}}]);
  const course=patch(a,[{section:'courses',type:'update',id:before.companion.courses[0].id,fields:{status:{before:before.companion.courses[0].status,after:'completed'}}}]);
  const vault=patch(b,[{section:'items',type:'add',after:{label:'Key',value:'fixture-only',note:''}}]);
  const results=await Promise.all([profile,task,course,vault]);
  assert.deepEqual(results.map(result=>result.status),[200,200,200,200]);
  const data=await read(b);
  assert.equal(data.profile.site,'Fixture site');
  assert.deepEqual(data.companion.tasks,[{id:'task-one',label:'Check forecourt',done:false}]);
  assert.equal(data.companion.courses[0].status,'completed');
  assert.deepEqual(data.items,[{label:'Key',value:'fixture-only',note:''}]);
  assert.deepEqual(JSON.parse(kv.get('private-data')),data);
  const c=await patch(a,[{section:'profile',key:'manager',before:before.profile.manager,after:'Manager A'}]);
  const d=await patch(b,[{section:'profile',key:'hours',before:before.profile.hours,after:'19'}]);
  assert.equal(c.status,200);assert.equal(d.status,200);
  const concurrent=await Promise.all([
    patch(a,[{section:'tasks',type:'update',id:'task-one',fields:{label:{before:'Check forecourt',after:'Close forecourt'}}}]),
    patch(b,[{section:'tasks',type:'update',id:'task-one',fields:{done:{before:false,after:true}}}]),
  ]);
  assert.deepEqual(concurrent.map(result=>result.status),[200,200]);
  const after=await read(a);
  assert.equal(after.companion.tasks[0].label,'Close forecourt');assert.equal(after.companion.tasks[0].done,true);
  assert.equal(after.profile.manager,'Manager A');assert.equal(after.profile.hours,'19');
  const conflict=await patch(b,[{section:'tasks',type:'update',id:'task-one',fields:{label:{before:'Check forecourt',after:'Old stale text'}}}]);
  assert.equal(conflict.status,409);assert.equal((await conflict.json()).code,'edit_conflict');
  assert.deepEqual(await read(a),after);
  assert.equal((await patch(a,[{section:'tasks',type:'remove',id:'task-one',before:{id:'task-one',label:'Check forecourt',done:false}}])).status,409);
  assert.equal((await patch(a,[{section:'courses',type:'update',id:before.companion.courses[0].id,fields:{status:{before:'in-progress',after:'not-started'}}}])).status,409);
  assert.equal((await patch(a,[{section:'items',type:'update',index:0,before:{label:'Key',value:'stale',note:''},after:{label:'Key',value:'other',note:''}}])).status,409);
  assert.deepEqual(await read(b),after);
  assert.equal((await worker.fetch(request('/api/private/changes','POST',{changes:[{section:'profile',key:'site',before:'Fixture site',after:'bad'}]}),env)).status,401);
});

test('existing KV data gains only missing legacy fields with a durable backup',async()=>{
  const {env,kv}=fixture();
  const original={version:1,profile:{site:'Current site',kioskId:'Current kiosk'},items:[{label:'Current',value:'present',note:''}],companion:{tasks:[{id:'saved-task',label:'Existing task',done:true}],courses:[]}};
  kv.set('private-data',JSON.stringify(original));
  env.WF_PRIVATE_DATA=JSON.stringify({version:1,profile:{site:'Stale site',kioskId:'Stale kiosk',colleagueNumber:'legacy-number',workPin:'legacy-pin',thriveUsername:'legacy-thrive'},items:[{label:'Legacy',value:'preserved',note:''}]});
  const cookie=await login(env);
  const result=await worker.fetch(request('/private','GET',null,cookie),env);
  assert.equal(result.status,200);
  const data=(await result.json()).data;
  assert.equal(data.profile.site,'Current site');assert.equal(data.profile.kioskId,'Current kiosk');
  assert.equal(data.profile.colleagueNumber,'legacy-number');assert.equal(data.profile.workPin,'legacy-pin');
  assert.equal(data.profile.thriveUsername,'legacy-thrive');
  assert.deepEqual(data.companion,original.companion);
  assert.deepEqual(data.items,[...original.items,{label:'Legacy',value:'preserved',note:''}]);
  const backup=[...kv.entries()].find(([key])=>key.startsWith('private-backup:'));
  assert.ok(backup);assert.deepEqual(JSON.parse(backup[1]),original);
  assert.deepEqual(JSON.parse(kv.get('private-data')),data);
  const reopened=await worker.fetch(request('/private','GET',null,cookie),env);
  assert.deepEqual((await reopened.json()).data,data);
  assert.equal([...kv.keys()].filter(key=>key.startsWith('private-backup:')).length,1);
});
