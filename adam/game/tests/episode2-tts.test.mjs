import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../backend/supabase/functions/episode2-tts-preview/handler.js';

const handler = createHandler({
  env: () => '',
  request: async () => { throw Error('Unexpected upstream request'); },
});
const URL = 'https://example.test/functions/v1/episode2-tts-preview';
test('blocks unauthenticated TTS generation before upstream access', async () => {
  const r = await handler(new Request(URL, {
    method:'POST', headers:{ origin:'https://www.elasrag.com','content-type':'application/json' },
    body:JSON.stringify({action:'generate-preview'}),
  }));
  assert.equal(r.status,401);
  assert.equal((await r.json()).error,'authentication_required');
});
test('rejects untrusted web origins', async () => {
  const r = await handler(new Request(URL,{
    method:'POST', headers:{origin:'https://untrusted.example','content-type':'application/json'},
    body:JSON.stringify({action:'generate-preview'}),
  }));
  assert.equal(r.status,403);
  assert.equal(r.headers.get('access-control-allow-origin'),null);
});
test('allows approved preflight without generating sound', async () => {
  const r = await handler(new Request(URL,{
    method:'OPTIONS',headers:{origin:'https://www.elasrag.com'},
  }));
  assert.equal(r.status,204);
  assert.equal(r.headers.get('access-control-allow-origin'),'https://www.elasrag.com');
});
test('blocks unsupported HTTP methods', async () => {
  const r = await handler(new Request(URL,{method:'GET'}));
  assert.equal(r.status,405);
});
