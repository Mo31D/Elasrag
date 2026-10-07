import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('service worker never intercepts private API, unrelated paths or mutations and only cleans WF caches', async () => {
  const listeners = {};
  const deleted = [];
  let cached = 0;
  const cache = { async put() { cached++; }, async match() { return new Response('offline public shell'); }, async addAll() {} };
  const context = {
    URL, Response,
    self: { registration: { scope: 'https://mo.elasrag.com/' }, clients: { claim() {} }, skipWaiting() {}, addEventListener(type, listener) { listeners[type] = listener; } },
    caches: { async open() { return cache; }, async keys() { return ['wf-quick-reference-v19','wf-quick-reference-v20','wf-quick-reference-v21','other-app']; }, async delete(key) { deleted.push(key); } },
    fetch: async () => ({ ok:true, type:'basic', headers:new Headers({'content-type':'text/html'}), clone: () => new Response('shell') }),
  };
  vm.runInNewContext(readFileSync(new URL('../../wf/sw.js', import.meta.url),'utf8'),context);
  let activation;
  listeners.activate({ waitUntil(value) { activation = value; } }); await activation;
  assert.deepEqual(deleted,['wf-quick-reference-v19','wf-quick-reference-v20']);
  for (const [url, method] of [
    ['https://mo.elasrag.com/private','GET'],['https://mo.elasrag.com/session','GET'],['https://mo.elasrag.com/api/session','GET'],
    ['https://mo.elasrag.com/login','POST'],['https://mo.elasrag.com/unrelated','GET'],
    ['https://mo.elasrag.com/api/private','GET'],['https://mo.elasrag.com/','PUT'],
  ]) {
    let intercepted = false;
    listeners.fetch({ request:new Request(url,{method}), respondWith() { intercepted = true; } });
    assert.equal(intercepted,false,url);
  }
  let result;
  listeners.fetch({ request:new Request('https://mo.elasrag.com/'), respondWith(value) { result = value; } });
  await result; assert.equal(cached,1);
  context.fetch = async () => {throw new Error('offline');};
  listeners.fetch({ request:new Request('https://mo.elasrag.com/index.html'), respondWith(value) { result = value; } });
  assert.equal(await (await result).text(),'offline public shell');
});
