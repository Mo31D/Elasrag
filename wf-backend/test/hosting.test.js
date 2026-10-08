import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import { fixture } from './fixtures.js';

const origin = 'https://mo.elasrag.com';
const req = (path, method = 'GET', body, cookie, source = origin) => new Request(origin + path, {
  method, headers: { origin: source, ...(body ? {'content-type':'application/json'} : {}), ...(cookie ? {cookie} : {}) },
  ...(body ? {body:JSON.stringify(body)} : {}),
});

test('canonical origin serves native app assets publicly, independent of authentication', async () => {
  const { env } = fixture();
  delete env.WF_PASSWORD; delete env.SESSION_SECRET;
  const home = await worker.fetch(req('/'), env);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.equal(home.headers.get('cache-control'), 'no-store');
  assert.equal(home.headers.get('x-frame-options'), 'DENY');
  const html = await home.text();
  assert.match(html, /data-staff-profile="personal"/);
  assert.match(html, /src=".\/app.js\?v=45"/);
  assert.match(await (await worker.fetch(req("/app.js"),env)).text(), /const API_BASE = .*"\/api"/);
  const sw = await worker.fetch(req('/sw.js?v=29'), env);
  assert.equal(sw.status, 200);
  assert.match(sw.headers.get('content-type'), /javascript/);
  assert.match(await sw.text(), /registration\.unregister/);
  assert.equal((await worker.fetch(req('/index.html', 'HEAD'), env)).body, null);
  assert.equal((await worker.fetch(req('/unknown'), env)).status, 404);
  const redirected = await worker.fetch(req('/wf/'), env);
  assert.equal(redirected.status, 308);
  assert.equal(redirected.headers.get('location'), origin + '/');
});

test('same-origin API and legacy migration share the existing session and private store', async () => {
  const { env, records } = fixture();
  const health = await worker.fetch(req('/api/health'), env);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).version, 6);
  const login = await worker.fetch(req('/api/login','POST',{password:env.WF_PASSWORD}), env);
  assert.equal(login.status, 200);
  const setCookie = login.headers.get('set-cookie');
  assert.doesNotMatch(setCookie, /Domain=/i);
  const cookie = setCookie.split(';')[0];
  const session = await worker.fetch(req('/api/session','GET',null,cookie), env);
  assert.equal((await session.json()).authenticated, true);
  const legacy = await worker.fetch(req('/private','GET',null,cookie,'https://www.elasrag.com'),env);
  assert.equal(legacy.status, 200);
  assert.equal(legacy.headers.get('access-control-allow-origin'),'https://www.elasrag.com');
  const data = {version:1,profile:{},items:[{label:'Migration fixture',value:'fixture-only',note:''}]};
  const write = new Request(origin + '/api/private', {method:'PUT',headers:{origin:'https://www.elasrag.com','content-type':'application/json',cookie,'if-match':legacy.headers.get('etag')},body:JSON.stringify(data)});
  records.set("private-write-time",Date.now()-1001);
  assert.equal((await worker.fetch(write,env)).status,200);
  const canonical = await worker.fetch(req('/api/private','GET',null,cookie),env);
  const stored=(await canonical.json()).data;
  assert.deepEqual(stored.items,data.items);
  assert.equal(stored.companion.courses.length,21);
  assert.equal(canonical.headers.get('cache-control'),'no-store');
  const missing = await worker.fetch(req('/api/missing'),env);
  assert.equal(missing.status,404);
  assert.match(missing.headers.get('content-type'),/application\/json/);
  assert.equal((await worker.fetch(req('/api/private','GET',null,null),env)).status,401);
  assert.equal((await worker.fetch(req('/api/login','POST',{password:env.WF_PASSWORD},null,'https://other.example'),env)).status,403);
  assert.equal((await worker.fetch(req('/api/logout','POST',null,cookie),env)).status,200);
  assert.equal((await worker.fetch(req('/api/private','GET',null,cookie),env)).status,401);
});

test('HTTP routes redirect to HTTPS and public assets identify the current build',async()=>{
  const {env}=fixture();
  for(const path of ['/','#fire','/api/login']){
    const response=await worker.fetch(new Request('http://mo.elasrag.com'+path),env);
    assert.equal(response.status,308);assert.ok(response.headers.get('location').startsWith('https://mo.elasrag.com'));
  }
  const response=await worker.fetch(req('/'),env);
  assert.equal(response.headers.get('x-wf-build'),'45');
  assert.equal(response.headers.get('strict-transport-security'),'max-age=31536000');
});

test('all shell assets bypass browser and CDN caches and never forward stale conditional requests',async()=>{
  const {env}=fixture();const original=env.ASSETS.fetch;
  env.ASSETS.fetch=async request=>{
    assert.equal(request.headers.has('if-none-match'),false);
    assert.equal(request.headers.has('if-modified-since'),false);
    return original(request);
  };
  for(const path of ['/','/index.html','/app.js?v=45','/content.js?v=45','/model.js?v=45','/styles.css?v=45','/sw.js?v=19']){
    const response=await worker.fetch(new Request(origin+path,{headers:{'if-none-match':'old-build','if-modified-since':'Wed, 07 Oct 2026 00:00:00 GMT'}}),env);
    assert.equal(response.status,200,path);
    for(const header of ['cache-control','cdn-cache-control','cloudflare-cdn-cache-control'])assert.equal(response.headers.get(header),'no-store');
  }
});


test('training reference downloads publicly as Markdown without accessing private data',async()=>{
  const {env}=fixture();delete env.WF_PASSWORD;delete env.SESSION_SECRET;
  const response=await worker.fetch(req('/WF-Training-Reference.md'),env);
  assert.equal(response.status,200);
  assert.equal(response.headers.get('content-type'),'text/markdown; charset=utf-8');
  assert.equal(response.headers.get('content-disposition'),'attachment; filename="WF-Training-Reference.md"');
  assert.equal(response.headers.get('cache-control'),'no-store');
  assert.match(await response.text(),/COSHH/);
  assert.equal((await worker.fetch(req('/WF-Training-Reference.md','HEAD'),env)).body,null);
});
