import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../backend/supabase/functions/word-voice/handler.js';
const url='https://uyfaipjthpsofjqcucop.supabase.co/functions/v1/word-voice';
const handler=createHandler({env:()=>'',fetcher:async()=>{throw Error('Unexpected external request')}});
test('Word audio generation cannot be triggered anonymously',async()=>{
 const r=await handler(new Request(url,{method:'POST',headers:{origin:'https://www.elasrag.com','content-type':'application/json'},body:JSON.stringify({action:'generate',wordId:'apple',variant:'word'})}));
 assert.equal(r.status,401);
 assert.equal((await r.json()).error,'parent_session_required');
});
test('Unknown origins cannot call voice server',async()=>{
 const r=await handler(new Request(url,{method:'POST',headers:{origin:'https://not-approved.example'},body:'{}'}));
 assert.equal(r.status,403);
 assert.equal(r.headers.get('access-control-allow-origin'),null);
});
test('No GET method may trigger generation',async()=>{
 const r=await handler(new Request(url,{method:'GET'}));
 assert.equal(r.status,405);
});
test('Allowed preflight is independent of provider access',async()=>{
 const r=await handler(new Request(url,{method:'OPTIONS',headers:{origin:'https://www.elasrag.com'}}));
 assert.equal(r.status,204);
 assert.equal(r.headers.get('access-control-allow-origin'),'https://www.elasrag.com');
});
