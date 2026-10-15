// Parent-controlled Gemini 3.8 Studio-quality Word Kingdom audio cache.
// Explicit generation only; approved WAV clips may be streamed publicly as static educational content.
const MODEL = 'gemini-3.8-flash-tts';
const PUBLIC_BUCKET = 'ala-word-audio';
const PRIVATE_BUCKET = 'ala-educational-assets';
const SAFE_ORIGINS = new Set(['https://www.elasrag.com','https://elasrag.com']);
const ID = /^[a-z][a-z-]{1,55}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f-]{27,40}$/i;
const VARIANTS = new Set(['word','sentence']);
const maxBytes = 3_900_000;
const err = (code,status=400)=>Object.assign(new Error(code),{status});
function responseFactory(origin){
 const h={'content-type':'application/json','cache-control':'no-store','vary':'origin'};
 if(SAFE_ORIGINS.has(origin)){h['access-control-allow-origin']=origin;h['access-control-allow-methods']='POST,OPTIONS';h['access-control-allow-headers']='authorization,apikey,content-type';}
 return (value,status=200)=>new Response(JSON.stringify(value),{status,headers:h});
}
function decode(base64) {
 if(typeof base64!=='string'||base64.length<100||base64.length>maxBytes*1.5)throw err('invalid_provider_audio',502);
 const binary=atob(base64);
 if(binary.length<1000||binary.length>maxBytes)throw err('invalid_provider_audio',502);
 const bytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
 if(String.fromCharCode(...bytes.slice(0,4))!=='RIFF'||String.fromCharCode(...bytes.slice(8,12))!=='WAVE')throw err('provider_not_wav',502);
 return bytes;
}
export function createHandler({env,fetcher=fetch}){
 return async req=>{
  const origin=req.headers.get('origin');
  const reply=responseFactory(origin);
  if(origin&&!SAFE_ORIGINS.has(origin))return reply({error:'origin_not_allowed'},403);
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'access-control-allow-origin':origin,'access-control-allow-headers':'authorization,apikey,content-type','access-control-allow-methods':'POST,OPTIONS'}});
  if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
  let owner=null,wordId=null,variant=null,reserved=false,rest=null;
  try {
   if(Number(req.headers.get('content-length')||0)>350)throw err('request_too_large');
   const auth=req.headers.get('authorization');
   if(!auth?.startsWith('Bearer '))throw err('parent_session_required',401);
   let body;
   try{const raw=await req.text();if(raw.length>350)throw Error();body=JSON.parse(raw)}catch{throw err('invalid_json');}
   const action=body?.action;
   wordId=String(body?.wordId||'');variant=String(body?.variant||'word');
   if(!['status','generate','approve','preview'].includes(action)||!ID.test(wordId)||!VARIANTS.has(variant))throw err('invalid_request');
   const base=env('SUPABASE_URL'),googleKey=env('GEMINI_API_KEY');
   const serverKey=JSON.parse(env('SUPABASE_SECRET_KEYS')||'{}').default||env('SUPABASE_SERVICE_ROLE_KEY');
   const browserKey=JSON.parse(env('SUPABASE_PUBLISHABLE_KEYS')||'{}').default||env('SUPABASE_ANON_KEY');
   if(!base||!serverKey||!browserKey)throw err('backend_not_configured',503);
   const authResp=await fetcher(base+'/auth/v1/user',{headers:{apikey:browserKey,Authorization:auth},signal:AbortSignal.timeout(10000)});
   if(!authResp.ok)throw err('invalid_parent_session',401);
   const user=await authResp.json();
   owner=user.id;
   if(!UUID.test(owner)||user.is_anonymous||!user.email_confirmed_at)throw err('verified_parent_required',403);
   const sharedHeaders={apikey:serverKey};
   rest=async(path,method='GET',payload)=>{
    const result=await fetcher(base+'/rest/v1/'+path,{method,headers:{...sharedHeaders,'content-type':'application/json',Prefer:'return=representation'},...(payload===undefined?{}:{body:JSON.stringify(payload)}),signal:AbortSignal.timeout(12000)});
    if(!result.ok)throw err('database_operation_failed',500);
    return result.status===204?null:result.json();
   };
   const rows=await rest('ala_parents?select=user_id&user_id=eq.'+owner+'&active=eq.true');
   if(rows?.length!==1)throw err('parent_not_enrolled',403);
   const lex=await rest('ala_word_lexicon?select=term,example&id=eq.'+wordId);
   if(lex?.length!==1)throw err('word_not_in_approved_lexicon',404);
   const oldJob=async()=>(await rest('ala_word_voice_jobs?select=status,storage_path&word_id=eq.'+wordId+'&variant=eq.'+variant))?.[0]||null;
   const job=await oldJob();
   const publicUrl=base+'/storage/v1/object/public/'+PUBLIC_BUCKET+'/en-GB/'+wordId+'/'+variant+'.wav';
   if(action==='status')return reply({status:job?.status||'not_generated',wordId,variant,
      ...(job?.status==='approved'?{playbackUrl:publicUrl}:{})});
   const privatePreview=async(path)=>{
    const r=await fetcher(base+'/storage/v1/object/sign/'+PRIVATE_BUCKET+'/'+path,{
     method:'POST',headers:{...sharedHeaders,'content-type':'application/json'},
     body:JSON.stringify({expiresIn:120}),signal:AbortSignal.timeout(10000)});
    if(!r.ok)throw err('audio_preview_unavailable',502);
    const j=await r.json(),signed=j.signedURL||j.signedUrl;
    if(!signed?.startsWith('/object/sign/'))throw err('audio_preview_unavailable',502);
    return base+'/storage/v1'+signed;
   };
   if(action==='preview'){
     if(!job||!['pending','approved'].includes(job.status))return reply({status:job?.status||'not_generated'});
     return reply({status:job.status,playbackUrl:job.status==='approved'?publicUrl:await privatePreview(job.storage_path)});
   }
   if(action==='approve'){
     if(job?.status==='approved')return reply({status:'approved',playbackUrl:publicUrl,reused:true});
     if(job?.status!=='pending'||!job.storage_path)throw err('audio_not_pending_review',409);
     const privateGet=await fetcher(base+'/storage/v1/object/authenticated/'+PRIVATE_BUCKET+'/'+job.storage_path,
       {headers:sharedHeaders,signal:AbortSignal.timeout(15000)});
     if(!privateGet.ok)throw err('private_audio_missing',502);
     const b=new Uint8Array(await privateGet.arrayBuffer());
     if(b.length<1000||b.length>maxBytes)throw err('invalid_provider_audio',502);
     const upload=await fetcher(base+'/storage/v1/object/'+PUBLIC_BUCKET+'/en-GB/'+wordId+'/'+variant+'.wav',{
      method:'POST',headers:{...sharedHeaders,'content-type':'audio/wav','x-upsert':'false'},body:b,signal:AbortSignal.timeout(20000)});
     if(!upload.ok&&upload.status!==409)throw err('public_audio_upload_failed',502);
     await rest('ala_word_voice_jobs?word_id=eq.'+wordId+'&variant=eq.'+variant,'PATCH',
        {status:'approved',approved_at:new Date().toISOString()});
     return reply({status:'approved',playbackUrl:publicUrl});
   }
   // Only explicit generation requests; no scheduled or child-triggered Google calls.
   if(job)return reply({status:job.status,reused:true},job.status==='failed'?409:200);
   if(!googleKey||env('GEMINI_FREE_TIER_CONFIRMED')!=='true')throw err('free_tier_not_confirmed',409);
   const cfg=await rest('ala_settings?select=free_tier_confirmed,paid_usage_allowed&parent_id=eq.'+owner);
   if(cfg?.length!==1||cfg[0].free_tier_confirmed!==true||cfg[0].paid_usage_allowed!==false)throw err('free_tier_not_confirmed',409);
   const reservation=await fetcher(base+'/rest/v1/rpc/ala_reserve_word_voice',{
    method:'POST',headers:{...sharedHeaders,'content-type':'application/json'},
    body:JSON.stringify({p_parent:owner,p_word:wordId,p_variant:variant}),signal:AbortSignal.timeout(10000)});
   if(!reservation.ok)throw err('generation_quota_or_duplicate',429);
   const r=await reservation.json();
   if(r.reused)return reply({status:r.status,reused:true});
   reserved=true;
   const sentence=variant==='word'?lex[0].term:lex[0].example;
   const input=[{type:'user_input',content:[{type:'text',text:sentence,annotations:[
    {type:'speech_metadata',style:'Natural British English (en-GB) female educational narration, warm, confident, crystal clear, calm and unhurried. Pronounce every word naturally; no added words, no music. '+(variant==='word'?'Speak the single word clearly once.':'Read the example sentence with a natural warm pace.')}
   ]}]}];
   const generated=await fetcher('https://generativelanguage.googleapis.com/v1beta/interactions',{
    method:'POST',headers:{'x-goog-api-key':googleKey,'content-type':'application/json'},
    body:JSON.stringify({model:MODEL,input,response_format:{type:'audio',mime_type:'audio/wav'},
      generation_config:{speech_config:[{voice:'Kore'}]}}),
    signal:AbortSignal.timeout(45000)});
   if(!generated.ok)throw err('gemini_tts_unavailable',502);
   const data=await generated.json();
   const parts=(data.steps||[]).filter(x=>x.type==='model_output').flatMap(x=>x.content||[]);
   const audio=parts.filter(x=>x.type==='audio'&&typeof x.data==='string').at(-1);
   if(!audio)throw err('missing_audio_response',502);
   const wav=decode(audio.data);
   const privatePath='word-voice/en-GB/'+wordId+'/'+variant+'.wav';
   const up=await fetcher(base+'/storage/v1/object/'+PRIVATE_BUCKET+'/'+privatePath,{
    method:'POST',headers:{...sharedHeaders,'content-type':'audio/wav','x-upsert':'false'},
    body:wav,signal:AbortSignal.timeout(25000)});
   if(!up.ok)throw err('audio_storage_failed',502);
   await rest('ala_word_voice_jobs?word_id=eq.'+wordId+'&variant=eq.'+variant,'PATCH',{
    status:'pending',storage_path:privatePath,completed_at:new Date().toISOString()
   });
   reserved=false;
   return reply({status:'pending',bytes:wav.length,previewUrl:await privatePreview(privatePath),needsReview:true},201);
  }catch(e){
   if(reserved&&rest&&wordId&&variant){
    await rest('ala_word_voice_jobs?word_id=eq.'+wordId+'&variant=eq.'+variant,'PATCH',{
      status:'failed',failure_code:String(e.message).slice(0,60),completed_at:new Date().toISOString()
    }).catch(()=>{});
   }
   const whitelist=['invalid_request','invalid_json','request_too_large','parent_session_required','invalid_parent_session','verified_parent_required','parent_not_enrolled','word_not_in_approved_lexicon','free_tier_not_confirmed','generation_quota_or_duplicate','gemini_tts_unavailable','missing_audio_response','audio_storage_failed','invalid_provider_audio','provider_not_wav','audio_not_pending_review','private_audio_missing','public_audio_upload_failed','audio_preview_unavailable','backend_not_configured','database_operation_failed'];
   return reply({error:whitelist.includes(e?.message)?e.message:'word_audio_unavailable'},Number.isInteger(e?.status)?e.status:500);
  }
 };
}
