import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import { fixture } from './fixtures.js';

const origin = 'https://mo.elasrag.com';
const request = (path, method='GET', body, cookie, extra={}) => new Request(origin+'/api'+path,{method,headers:{origin,...(body?{'content-type':'application/json'}:{}),...(cookie?{cookie}:{}),...extra},...(body?{body:JSON.stringify(body)}:{})});
const cookieOf = response => response.headers.get('set-cookie').split(';')[0];
async function register(env, username) {
  const response=await worker.fetch(request('/register','POST',{username,password:'fixture-new-password'}),env);
  assert.equal(response.status,200);
  return {cookie:cookieOf(response),...(await response.json())};
}

test('independent accounts inherit common courses without owner profile, dates, completed history or vault',async()=>{
  const f=fixture();
  const ownerLogin=await worker.fetch(request('/login','POST',{password:f.env.WF_PASSWORD}),f.env);
  const ownerCookie=cookieOf(ownerLogin);
  const owner=(await (await worker.fetch(request('/private','GET',null,ownerCookie),f.env)).json()).data;
  assert.equal(owner.profile.hours,'17');assert.equal(owner.companion.courses.length,21);
  const a=await register(f.env,'colleague-a');const b=await register(f.env,'colleague-b');
  const read=await worker.fetch(request('/private','GET',null,a.cookie),f.env);
  const data=(await read.json()).data;
  assert.deepEqual(data.profile,{});assert.deepEqual(data.items,[]);
  assert.equal(data.companion.courses.length,7);
  assert.ok(data.companion.courses.every(course=>course.due==='' && course.status==='not-started'));
  data.profile.displayName='A';data.items.push({label:'Private A',value:'fixture-only',note:''});
  data.companion.tasks.push({id:'task-a',label:'Close safely',done:true});
  for(const key of f.records.keys())if(key.startsWith("private-write-time:"))f.records.set(key,Date.now()-1001);
  const put=await worker.fetch(request('/private','PUT',data,a.cookie,{'if-match':read.headers.get('etag')}),f.env);
  assert.equal(put.status,200);
  const other=(await (await worker.fetch(request('/private','GET',null,b.cookie),f.env)).json()).data;
  assert.deepEqual(other.profile,{});assert.deepEqual(other.items,[]);assert.deepEqual(other.companion.tasks,[]);
  const again=await worker.fetch(request('/login','POST',{username:'colleague-a',password:'fixture-new-password'}),f.env);
  assert.deepEqual((await (await worker.fetch(request('/private','GET',null,cookieOf(again)),f.env)).json()).data,data);
  assert.deepEqual((await (await worker.fetch(request('/private','GET',null,ownerCookie),f.env)).json()).data,owner);
  assert.equal(f.kv.size,3);
  assert.equal((await worker.fetch(request('/private','PUT',{...data,userId:'owner'},a.cookie,{'if-match':put.headers.get('etag')}),f.env)).status,400);
  const user=f.records.get('user:colleague-a');
  assert.ok(user.hash && user.salt && user.recoveryHash);
  assert.equal(user.password,undefined);assert.equal(user.recoveryCode,undefined);
});

test('recovery rotates the code, revokes previous sessions and keeps saved data',async()=>{
  const {env}=fixture();const a=await register(env,'recovery-user');
  const previous=await worker.fetch(request('/login','POST',{username:'recovery-user',password:'fixture-new-password'}),env);
  const oldCookie=cookieOf(previous);
  assert.equal((await worker.fetch(request('/recover','POST',{username:'recovery-user',password:'fixture-newer-password',recoveryCode:'wrong'}),env)).status,401);
  const response=await worker.fetch(request('/recover','POST',{username:'recovery-user',password:'fixture-newer-password',recoveryCode:a.recoveryCode}),env);
  assert.equal(response.status,200);const replacement=await response.json();assert.notEqual(replacement.recoveryCode,a.recoveryCode);
  assert.equal((await worker.fetch(request('/private','GET',null,a.cookie),env)).status,401);
  assert.equal((await worker.fetch(request('/private','GET',null,oldCookie),env)).status,401);
  assert.equal((await worker.fetch(request('/private','GET',null,cookieOf(response)),env)).status,200);
  assert.equal((await worker.fetch(request('/login','POST',{username:'recovery-user',password:'fixture-new-password'}),env)).status,401);
  assert.equal((await worker.fetch(request('/login','POST',{username:'recovery-user',password:'fixture-newer-password'}),env)).status,200);
  assert.equal((await worker.fetch(request('/recover','POST',{username:'recovery-user',password:'fixture-other-password',recoveryCode:a.recoveryCode}),env)).status,401);
});

test('registration throttling, reserved owner, short password and invalid companion schema',async()=>{
  const {env}=fixture();
  assert.equal((await worker.fetch(request('/register','POST',{username:'owner',password:'fixture-new-password'}),env)).status,400);
  assert.equal((await worker.fetch(request('/register','POST',{username:'short-password',password:'a'}),env)).status,400);
  const a=await register(env,'valid-user');
  assert.equal((await worker.fetch(request('/register','POST',{username:'valid-user',password:'fixture-new-password'}),env)).status,409);
  await register(env,'last-user');
  assert.equal((await worker.fetch(request('/register','POST',{username:'blocked-user',password:'fixture-new-password'}),env)).status,429);
  const read=await worker.fetch(request('/private','GET',null,a.cookie),env);const data=(await read.json()).data;
  const write=payload=>worker.fetch(request('/private','PUT',payload,a.cookie,{'if-match':read.headers.get('etag')}),env);
  data.companion.courses[0].due='2026-02-30';assert.equal((await write(data)).status,400);
  data.companion.courses[0].due='';data.companion.tasks.push({id:'required-1',label:'Duplicate',done:false});assert.equal((await write(data)).status,400);
  data.companion.tasks=[];data.companion.courses[0].status='invented';assert.equal((await write(data)).status,400);
});

test('logging into another account cannot reset the victim account brute-force limit',async()=>{
  const {env}=fixture();await register(env,'attacker-fixture');await register(env,'victim-fixture');
  for(let i=0;i<10;i++)assert.equal((await worker.fetch(request('/login','POST',{username:'victim-fixture',password:'wrong'}),env)).status,401);
  assert.equal((await worker.fetch(request('/login','POST',{username:'attacker-fixture',password:'fixture-new-password'}),env)).status,200);
  assert.equal((await worker.fetch(request('/login','POST',{username:'victim-fixture',password:'wrong'}),env)).status,429);
});

test('two-character letters or digits work for registration and recovery while incorrect passwords fail',async()=>{
  for(const password of ['ab','12']) {
    const {env}=fixture();const username='short-valid';
    const registered=await worker.fetch(request('/register','POST',{username,password}),env);
    assert.equal(registered.status,200);const {recoveryCode}=await registered.json();
    assert.equal((await worker.fetch(request('/login','POST',{username,password}),env)).status,200);
    assert.equal((await worker.fetch(request('/login','POST',{username,password:'xx'}),env)).status,401);
    const replacement=password==='ab'?'34':'cd';
    const recovered=await worker.fetch(request('/recover','POST',{username,password:replacement,recoveryCode}),env);
    assert.equal(recovered.status,200);
    assert.equal((await worker.fetch(request('/login','POST',{username,password:replacement}),env)).status,200);
    assert.equal((await worker.fetch(request('/login','POST',{username,password}),env)).status,401);
  }
});
