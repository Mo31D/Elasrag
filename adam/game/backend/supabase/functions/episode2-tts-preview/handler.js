// Episode 2: one-clip, parent-only TTS pilot.
// This function is intentionally independent of the existing learning-api.
const PROJECT_ORIGINS = new Set(['https://www.elasrag.com', 'https://elasrag.com']);
const PROJECT_CLIP = 's01-preview';
const MODEL = 'gemini-2.5-flash-preview-tts';
const BUCKET = 'ala-educational-assets';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PREVIEW_TEXT = [
  'Narrator: Welcome back, Adam! Today, you are a detective.',
  'Pip: Hoot-hoot, Detective Adam! There is a mystery at the old library!',
].join('\n');

function error(message, status = 400) {
  return Object.assign(new Error(message), { status });
}
function wavFromPcm(base64, mime) {
  if (typeof base64 !== 'string' || base64.length > 5_600_000 || base64.length < 100) {
    throw error('invalid_audio_response', 502);
  }
  if (typeof mime !== 'string' || !mime.toLowerCase().startsWith('audio/')) {
    throw error('invalid_audio_format', 502);
  }
  const binary = atob(base64);
  if (binary.length < 2_000 || binary.length > 4_000_000) {
    throw error('invalid_audio_size', 502);
  }
  const pcm = Uint8Array.from(binary, c => c.charCodeAt(0));
  if (mime.toLowerCase().includes('wav') || (String.fromCharCode(...pcm.slice(0, 4)) === 'RIFF')) {
    return pcm;
  }
  // Gemini 2.5 Flash Preview TTS returns headerless 24 kHz, 16-bit mono PCM.
  if (!/audio\/(l16|pcm|x-pcm|raw)/i.test(mime) || pcm.length % 2) {
    throw error('unexpected_audio_encoding', 502);
  }
  const wav = new Uint8Array(44 + pcm.length);
  const view = new DataView(wav.buffer);
  const put = (offset, str) => [...str].forEach((ch, i) => { wav[offset + i] = ch.charCodeAt(0); });
  put(0, 'RIFF');
  view.setUint32(4, 36 + pcm.length, true);
  put(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 24000, true);
  view.setUint32(28, 48000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  put(36, 'data');
  view.setUint32(40, pcm.length, true);
  wav.set(pcm, 44);
  return wav;
}

export function createHandler({env, request = fetch}) {
  return async (req) => {
    const origin = req.headers.get('origin');
    const headers = {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'vary': 'Origin',
      ...(PROJECT_ORIGINS.has(origin) ? {
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'authorization, apikey, content-type',
      } : {}),
    };
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
    if (origin && !PROJECT_ORIGINS.has(origin)) return reply({error:'origin_not_allowed'},403);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (req.method !== 'POST') return reply({error:'method_not_allowed'},405);

    let owner = null;
    let rest = null;
    let storage = null;
    let clipStatus = 'unknown';
    try {
      const auth = req.headers.get('authorization');
      if (!auth?.startsWith('Bearer ')) throw error('authentication_required',401);
      const base = env('SUPABASE_URL');
      let service, publishable;
      try {
        service = JSON.parse(env('SUPABASE_SECRET_KEYS') || '{}').default || env('SUPABASE_SERVICE_ROLE_KEY');
        publishable = JSON.parse(env('SUPABASE_PUBLISHABLE_KEYS') || '{}').default || env('SUPABASE_ANON_KEY');
      } catch { throw error('backend_not_configured',503); }
      if (!base || !service || !publishable) throw error('backend_not_configured',503);

      const userResponse = await request(base + '/auth/v1/user', {
        headers: {apikey: publishable, authorization: auth},
        signal: AbortSignal.timeout(10000),
      });
      if (!userResponse.ok) throw error('invalid_session',401);
      const user = await userResponse.json();
      if (!UUID.test(user.id) || user.is_anonymous || !user.email_confirmed_at) {
        throw error('verified_parent_required',403);
      }
      owner = user.id;
      const common = {apikey: service, authorization: 'Bearer ' + service};
      rest = async (path, method = 'GET', body) => {
        const r = await request(base + '/rest/v1/' + path, {
          method, headers: {...common, 'content-type':'application/json', Prefer:'return=representation'},
          ...(body === undefined ? {} : {body:JSON.stringify(body)}),
          signal: AbortSignal.timeout(10000),
        });
        if (!r.ok) throw error('database_request_failed',500);
        return r.status === 204 ? null : r.json();
      };
      storage = async (path, method, body, type) => {
        const r = await request(base + '/storage/v1/' + path, {
          method, headers: {...common, 'content-type':type},
          body, signal: AbortSignal.timeout(20000),
        });
        if (!r.ok) throw error('private_storage_request_failed',502);
        return r;
      };
      const enrolled = await rest('ala_parents?select=user_id&user_id=eq.' + owner + '&active=eq.true');
      if (enrolled?.length !== 1) throw error('parent_not_enrolled',403);

      let body;
      try {
        const raw = await req.text();
        if (raw.length > 250) throw Error('too large');
        body = JSON.parse(raw);
      } catch { throw error('invalid_request',400); }
      if (!body || !['status', 'generate-preview', 'get-preview'].includes(body.action)) {
        throw error('unsupported_action',400);
      }

      const freeFlag = env('GEMINI_FREE_TIER_CONFIRMED') === 'true';
      const keyAvailable = !!env('GEMINI_API_KEY');
      if (body.action === 'status') {
        return reply({
          ready: keyAvailable && freeFlag, model: MODEL,
          sample: PROJECT_CLIP, privateStorage: true,
          productionAudioEnabled: false,
        });
      }
      const settings = await rest('ala_settings?select=free_tier_confirmed,paid_usage_allowed&parent_id=eq.' + owner);
      if (!keyAvailable || !freeFlag || settings?.length !== 1 ||
          settings[0].free_tier_confirmed !== true || settings[0].paid_usage_allowed !== false) {
        throw error('free_tier_not_confirmed',409);
      }
      const getJob = async () => (await rest(
        'ala_tts_jobs?select=status,storage_path&parent_id=eq.' + owner + '&clip_id=eq.' + PROJECT_CLIP
      ))?.[0];

      const signed = async (path) => {
        const s = await storage(
          'object/sign/' + BUCKET + '/' + path, 'POST',
          JSON.stringify({expiresIn:120}), 'application/json'
        );
        const value = await s.json();
        const signedURL = value.signedURL || value.signedUrl;
        if (typeof signedURL !== 'string' || !signedURL.startsWith('/object/sign/')) {
          throw error('invalid_signed_url',502);
        }
        return base + '/storage/v1' + signedURL;
      };

      if (body.action === 'get-preview') {
        const existing = await getJob();
        return existing?.status === 'ready' && existing.storage_path
          ? reply({status:'ready', model:MODEL, playbackUrl:await signed(existing.storage_path), expiresIn:120})
          : reply({status: existing?.status || 'not_generated'});
      }

      const existing = await getJob();
      if (existing) return existing.status === 'ready' && existing.storage_path
        ? reply({status:'ready', reused:true, playbackUrl:await signed(existing.storage_path), expiresIn:120})
        : reply({status:existing.status, reused:true}, existing.status === 'failed' ? 409 : 202);

      // The DB transaction locks the parent's row to prevent concurrent duplicate generation.
      const reserve = await request(base + '/rest/v1/rpc/ala_reserve_tts', {
        method:'POST',
        headers:{...common, 'content-type':'application/json'},
        body:JSON.stringify({p_parent:owner,p_clip:PROJECT_CLIP}),
        signal:AbortSignal.timeout(10000),
      });
      if (!reserve.ok) throw error('tts_quota_or_reservation_blocked',429);
      const r = await reserve.json();
      if (r.reused) return reply({status:r.status, reused:true},202);
      clipStatus = 'reserved';

      // No student PII is transmitted except the fictional name already written in the approved script.
      const response = await request(
        'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent', {
          method:'POST',
          headers:{'content-type':'application/json','x-goog-api-key':env('GEMINI_API_KEY')},
          body:JSON.stringify({
            contents:[{parts:[{text:'Read the dialogue in clear, natural British English. Narrator is a warm female storyteller. Pip is a playful, high-pitched clockwork owl. Read only the dialogue: \n' + PREVIEW_TEXT}]}],
            generationConfig:{
              responseModalities:['AUDIO'],
              speechConfig:{
                languageCode:'en-GB',
                multiSpeakerVoiceConfig:{speakerVoiceConfigs:[
                  {speaker:'Narrator',voiceConfig:{prebuiltVoiceConfig:{voiceName:'Kore'}}},
                  {speaker:'Pip',voiceConfig:{prebuiltVoiceConfig:{voiceName:'Puck'}}},
                ]},
              },
            },
          }),
          signal:AbortSignal.timeout(45000),
        }
      );
      if (!response.ok) throw error('tts_provider_request_failed',502);
      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
      if (!part) throw error('tts_audio_missing',502);
      const audio = wavFromPcm(part.inlineData.data, part.inlineData.mimeType || '');
      const path = 'family/' + owner + '/episode2/' + PROJECT_CLIP + '.wav';
      await storage('object/' + BUCKET + '/' + path, 'POST', audio, 'audio/wav');
      await rest(
        'ala_tts_jobs?parent_id=eq.' + owner + '&clip_id=eq.' + PROJECT_CLIP,
        'PATCH',{status:'ready',model:MODEL,storage_path:path,completed_at:new Date().toISOString()}
      );
      return reply({
        status:'ready', model:MODEL, clipId:PROJECT_CLIP,
        playbackUrl:await signed(path), expiresIn:120,
        audioBytes:audio.byteLength,
      },201);
    } catch (e) {
      // Error messages in responses never contain the API key or provider payload.
      if (owner && rest && clipStatus === 'reserved') {
        await rest(
          'ala_tts_jobs?parent_id=eq.' + owner + '&clip_id=eq.' + PROJECT_CLIP,
          'PATCH',{status:'failed',error_code:String(e.message).slice(0,70),completed_at:new Date().toISOString()}
        ).catch(() => {});
      }
      const safe = [
        'origin_not_allowed','method_not_allowed','authentication_required','invalid_session',
        'verified_parent_required','parent_not_enrolled','backend_not_configured',
        'invalid_request','unsupported_action','free_tier_not_confirmed',
        'tts_quota_or_reservation_blocked','tts_provider_request_failed',
        'tts_audio_missing','invalid_audio_response','invalid_audio_format',
        'invalid_audio_size','unexpected_audio_encoding',
        'private_storage_request_failed','invalid_signed_url','database_request_failed'
      ];
      const msg = safe.includes(e?.message) ? e.message : 'tts_unavailable';
      return reply({error:msg},Number.isInteger(e?.status) ? e.status : 500);
    }
  };
}
