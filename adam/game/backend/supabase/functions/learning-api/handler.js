import {
  buildPrompt,
  checkLesson,
  scoreAnswer,
  sha256,
  lexicon,
  chooseSkill,
} from './lesson.js';
const UUID =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
class ApiError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.status = status;
  }
}
const requiredId = (x) => {
  if (!UUID.test(x || '')) throw new ApiError('invalid_id');
  return x;
};
function providerSchema(v) {
  if (Array.isArray(v)) return v.map(providerSchema);
  if (!v || typeof v !== 'object') return v;
  const out = {};
  for (const [k, value] of Object.entries(v)) {
    if (['$schema', 'uniqueItems', 'minLength', 'maxLength'].includes(k))
      continue;
    if (k === 'const') {
      out.enum = [value];
      out.type = typeof value === 'number' ? 'integer' : 'string';
    } else out[k] = providerSchema(value);
  }
  return out;
}
export function createHandler({ env, fetch, validate, schema }) {
  return async (req) => {
    const origin = req.headers.get('origin'),
      allowed = env('ALLOWED_ORIGIN') || 'https://www.elasrag.com';
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Vary: 'Origin',
      ...(origin === allowed
        ? {
            'Access-Control-Allow-Origin': allowed,
            'Access-Control-Allow-Headers':
              'authorization, apikey, content-type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          }
        : {}),
    };
    const reply = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers });
    if (origin && origin !== allowed)
      return reply({ error: 'origin_not_allowed' }, 403);
    if (req.method === 'OPTIONS')
      return new Response(null, { status: 204, headers });
    if (req.method !== 'POST')
      return reply({ error: 'method_not_allowed' }, 405);
    try {
      const auth = req.headers.get('authorization');
      if (!auth?.startsWith('Bearer '))
        throw new ApiError('authentication_required', 401);
      const url = env('SUPABASE_URL');
      let secret, pub;
      try {
        secret =
          JSON.parse(env('SUPABASE_SECRET_KEYS') || '{}').default ||
          env('SUPABASE_SERVICE_ROLE_KEY');
        pub =
          JSON.parse(env('SUPABASE_PUBLISHABLE_KEYS') || '{}').default ||
          env('SUPABASE_ANON_KEY');
      } catch {
        throw new ApiError('backend_not_configured', 503);
      }
      if (!url || !secret || !pub)
        throw new ApiError('backend_not_configured', 503);
      const userResponse = await fetch(url + '/auth/v1/user', {
        headers: { apikey: pub, Authorization: auth },
        signal: AbortSignal.timeout(10000),
      });
      if (!userResponse.ok) throw new ApiError('invalid_session', 401);
      const user = await userResponse.json();
      if (!UUID.test(user.id) || !user.email_confirmed_at || user.is_anonymous)
        throw new ApiError('parent_authentication_required', 403);
      const rest = async (path, method = 'GET', body) => {
        const res = await fetch(url + '/rest/v1/' + path, {
          method,
          headers: {
            apikey: secret,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) {
          const failure = await res.json().catch(() => ({}));
          const msg = String(failure.message || '');
          if (/Attempt ID conflict/.test(msg))
            throw new ApiError('attempt_id_conflict', 409);
          if (/limit reached|wait before/.test(msg))
            throw new ApiError('generation_limit_reached', 429);
          if (/not enabled/.test(msg))
            throw new ApiError('free_tier_confirmation_required', 409);
          throw new ApiError('database_request_failed', 500);
        }
        return res.status === 204 ? null : res.json();
      };
      const parents = await rest(
        'ala_parents?select=user_id&user_id=eq.' + user.id + '&active=eq.true',
      );
      if (parents.length !== 1) throw new ApiError('parent_not_enrolled', 403);
      const raw = await req.text();
      if (raw.length > 12000) throw new ApiError('request_too_large', 413);
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        throw new ApiError('invalid_json');
      }
      const owner = user.id,
        filter = 'parent_id=eq.' + owner;
      const student = async (id) => {
        requiredId(id);
        const rows = await rest('ala_students?' + filter + '&id=eq.' + id);
        if (rows.length !== 1) throw new ApiError('student_not_found', 404);
        return rows[0];
      };
      const lesson = async (id, approved = false) => {
        requiredId(id);
        const rows = await rest(
          'ala_lessons?' +
            filter +
            '&id=eq.' +
            id +
            (approved ? '&status=eq.approved' : ''),
        );
        if (rows.length !== 1) throw new ApiError('lesson_not_found', 404);
        return rows[0];
      };
      if (body.action === 'status')
        return reply({
          authenticated: true,
          enrolled: true,
          geminiConfigured: !!env('GEMINI_API_KEY'),
          model: 'gemini-flash-lite-latest',
          audioEnabled: false,
        });
      if (body.action === 'dashboard') {
        const [
          students,
          settings,
          lessons,
          jobs,
          progress,
          xp,
          events,
          skills,
        ] = await Promise.all([
          rest('ala_students?' + filter + '&order=created_at.asc'),
          rest('ala_settings?' + filter),
          rest('ala_lessons?' + filter + '&order=created_at.desc&limit=30'),
          rest(
            'ala_generation_jobs?' + filter + '&order=created_at.desc&limit=30',
          ),
          rest('ala_student_skills?' + filter),
          rest('ala_xp_ledger?' + filter),
          rest('ala_events?' + filter + '&order=created_at.desc&limit=50'),
          rest('ala_skills?enabled=eq.true'),
        ]);
        return reply({
          students,
          settings: settings[0] || null,
          lessons,
          jobs,
          progress,
          xp,
          events,
          skills,
        });
      }
      if (body.action === 'add-student') {
        const nickname = String(body.nickname || '').trim();
        if (
          nickname.length < 1 ||
          nickname.length > 30 ||
          /[<>]/.test(nickname) ||
          ![4, 6].includes(body.year)
        )
          throw new ApiError('invalid_student');
        const existing = await rest('ala_students?' + filter + '&select=id');
        if (existing.length >= 6)
          throw new ApiError('family_profile_limit', 409);
        const rows = await rest('ala_students', 'POST', {
          parent_id: owner,
          nickname,
          school_year: body.year,
        });
        return reply({ student: rows[0] }, 201);
      }
      if (body.action === 'settings') {
        if (
          !Number.isInteger(body.dailyLimit) ||
          body.dailyLimit < 1 ||
          body.dailyLimit > 5 ||
          typeof body.enabled !== 'boolean' ||
          typeof body.freeTierConfirmed !== 'boolean'
        )
          throw new ApiError('invalid_settings');
        if (body.enabled && !body.freeTierConfirmed)
          throw new ApiError('free_tier_confirmation_required', 409);
        const existing = await rest('ala_settings?' + filter);
        const value = {
          parent_id: owner,
          daily_limit: body.dailyLimit,
          generation_enabled: body.enabled,
          free_tier_confirmed: body.freeTierConfirmed,
          paid_usage_allowed: false,
          auto_prepare: false,
          audio_enabled: false,
          rewards_enabled: false,
        };
        const rows = await rest(
          'ala_settings' + (existing.length ? '?' + filter : ''),
          existing.length ? 'PATCH' : 'POST',
          value,
        );
        return reply({ settings: rows[0] });
      }
      if (body.action === 'generate') {
        const st = await student(body.studentId);
        const apiKey = env('GEMINI_API_KEY');
        if (!apiKey) throw new ApiError('gemini_secret_missing', 503);
        if (
          String(env('GEMINI_FREE_TIER_CONFIRMED') || '')
            .trim()
            .toLowerCase() !== 'true'
        )
          throw new ApiError('server_free_tier_confirmation_required', 409);
        // Curriculum and prerequisite selection are server-owned, never a prompt supplied by a child.
        const available = await rest(
          'ala_skills?enabled=eq.true&curriculum_id=eq.' +
            st.curriculum +
            '&year_min=lte.' +
            st.school_year +
            '&year_max=gte.' +
            st.school_year,
        );
        const progress = await rest(
          'ala_student_skills?' + filter + '&student_id=eq.' + st.id,
        );
        const prerequisites = await rest(
          'ala_prerequisites?select=skill_id,requires_id',
        );
        const skill = chooseSkill(available, progress, prerequisites);
        if (!skill) throw new ApiError('no_suitable_skill', 409);
        const approved = await rest(
          'ala_lessons?' +
            filter +
            '&skill_id=eq.' +
            encodeURIComponent(skill.id) +
            '&status=eq.approved&order=created_at.desc&limit=1',
        );
        if (approved.length)
          return reply({ reused: true, lesson: approved[0] });
        const word = Object.keys(skill.vocabulary || {})[0];
        if (!Object.hasOwn(lexicon, word))
          throw new ApiError('unsupported_curriculum_word', 409);
        const requestKey = await sha256(
          `${owner}|${skill.id}|${word}|en-GB|feeling-detective-v1|${new Date().toISOString().slice(0, 10)}`,
        );
        const reserved = await rest('rpc/ala_reserve_generation', 'POST', {
          p_parent: owner,
          p_skill: skill.id,
          p_key: requestKey,
        });
        if (reserved.reused) return reply({ reused: true, job: reserved.job });
        const job = reserved.job;
        try {
          await rest(
            'ala_generation_jobs?' + filter + '&id=eq.' + job.id,
            'PATCH',
            { status: 'running' },
          );
          const provider = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent',
            {
              method: 'POST',
              headers: {
                'x-goog-api-key': apiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  { role: 'user', parts: [{ text: buildPrompt(word) }] },
                ],
                generationConfig: {
                  maxOutputTokens: 1800,
                  temperature: 0.35,
                  responseMimeType: 'application/json',
                  responseJsonSchema: providerSchema(schema),
                },
              }),
              signal: AbortSignal.timeout(45000),
            },
          );
          if (!provider.ok)
            throw new ApiError(
              provider.status === 429
                ? 'provider_quota_exceeded'
                : 'provider_request_failed',
              provider.status === 429 ? 429 : 502,
            );
          const output = await provider.json();
          if (output.candidates?.[0]?.finishReason !== 'STOP')
            throw new ApiError('provider_incomplete_output', 502);
          const contentText = output.candidates[0].content?.parts
            ?.filter((p) => typeof p.text === 'string')
            .map((p) => p.text)
            .join('');
          if (!contentText || contentText.length > 20000)
            throw new ApiError('provider_invalid_output', 502);
          let candidate;
          try {
            candidate = JSON.parse(contentText);
          } catch {
            throw new ApiError('provider_invalid_json', 502);
          }
          const structure = validate(candidate),
            quality = structure
              ? checkLesson(candidate, word)
              : { ok: false, reasons: ['JSON Schema validation failed'] };
          const validation = {
            schema: !!structure,
            ...quality,
            requiresHumanReview: true,
          };
          const lessonId = await rest('rpc/ala_finish_generation', 'POST', {
            p_parent: owner,
            p_job: job.id,
            p_content: candidate,
            p_hash: await sha256(contentText),
            p_validation: validation,
            p_ok: structure && quality.ok,
            p_input: Math.max(
              0,
              Math.floor(output.usageMetadata?.promptTokenCount || 0),
            ),
            p_output: Math.max(
              0,
              Math.floor(output.usageMetadata?.candidatesTokenCount || 0),
            ),
          });
          return reply(
            {
              lessonId,
              status:
                structure && quality.ok ? 'pending_review' : 'quarantined',
              validation,
            },
            201,
          );
        } catch (error) {
          const code =
            error instanceof ApiError
              ? error.message
              : 'provider_timeout_or_network_error';
          await rest(
            'ala_generation_jobs?' +
              filter +
              '&id=eq.' +
              job.id +
              '&status=in.(reserved,running)',
            'PATCH',
            {
              status: 'failed',
              failure_code: code,
              finished_at: new Date().toISOString(),
            },
          ).catch(() => {});
          throw new ApiError(
            code,
            error instanceof ApiError ? error.status : 502,
          );
        }
      }
      if (body.action === 'review') {
        const row = await lesson(body.lessonId);
        if (!['approved', 'rejected'].includes(body.decision))
          throw new ApiError('invalid_decision');
        if (
          body.decision === 'approved' &&
          (!validate(row.content) ||
            !checkLesson(row.content, row.content.word).ok ||
            !['answer', 'language', 'curriculum', 'safety'].every(
              (k) => body.checks?.[k] === true,
            ))
        )
          throw new ApiError('educational_review_required', 409);
        const result = await rest('rpc/ala_review_lesson', 'POST', {
          p_parent: owner,
          p_lesson: row.id,
          p_decision: body.decision,
          p_checks: body.checks || {},
        });
        return reply(result);
      }
      if (body.action === 'attempt') {
        await student(body.studentId);
        const row = await lesson(body.lessonId, true);
        requiredId(body.attemptId);
        if (
          !['vocabulary', 'sentence'].includes(body.kind) ||
          typeof body.assisted !== 'boolean' ||
          !Number.isInteger(body.activeMs) ||
          body.activeMs < 0 ||
          body.activeMs > 30000
        )
          throw new ApiError('invalid_attempt');
        if (
          !validate(row.content) ||
          !checkLesson(row.content, row.content.word).ok
        )
          throw new ApiError('lesson_validation_failed', 409);
        if (
          body.kind === 'vocabulary' &&
          (!Number.isInteger(body.answer) || body.answer < 0 || body.answer > 2)
        )
          throw new ApiError('invalid_answer');
        if (
          body.kind === 'sentence' &&
          (!Array.isArray(body.answer) ||
            body.answer.length !== 4 ||
            new Set(body.answer).size !== 4 ||
            !body.answer.every((n) => Number.isInteger(n) && n >= 0 && n < 4))
        )
          throw new ApiError('invalid_answer');
        const result = await rest('rpc/ala_record_attempt', 'POST', {
          p_parent: owner,
          p_student: body.studentId,
          p_lesson: row.id,
          p_id: body.attemptId,
          p_kind: body.kind,
          p_answer: body.answer,
          p_correct: scoreAnswer(row.content, body.kind, body.answer),
          p_assisted: body.assisted,
          p_active_ms: body.activeMs,
        });
        return reply(result);
      }
      throw new ApiError('unknown_action');
    } catch (error) {
      return reply(
        { error: error instanceof ApiError ? error.message : 'request_failed' },
        error instanceof ApiError ? error.status : 500,
      );
    }
  };
}
