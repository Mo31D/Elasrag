import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import Ajv from 'ajv';
import { createHandler } from '../backend/supabase/functions/learning-api/handler.js';
import {
  checkLesson,
  scoreAnswer,
  buildPrompt,
} from '../backend/supabase/functions/learning-api/lesson.js';
const schema = JSON.parse(
    await readFile(
      new URL(
        '../backend/supabase/functions/learning-api/lesson-schema.json',
        import.meta.url,
      ),
      'utf8',
    ),
  ),
  validate = new Ajv({ allErrors: true }).compile(schema);
const owner = '00000000-0000-4000-8000-000000000001',
  student = '00000000-0000-4000-8000-000000000011',
  job = '00000000-0000-4000-8000-000000000021',
  lessonId = '00000000-0000-4000-8000-000000000031';
const fixture = {
  version: 1,
  template: 'feeling-detective-v1',
  title: 'The Curious Clue',
  word: 'curious',
  definition: 'Wanting to find out more.',
  example: 'I felt curious when I noticed the sealed envelope.',
  story: [
    'A sealed envelope lay beside the school noticeboard.',
    'The detective felt curious and asked who had left it there.',
  ],
  question: 'Which word means: Wanting to find out more.',
  choices: ['puzzled', 'curious', 'relieved'],
  answer: 1,
  hint: 'Think about wanting to discover something.',
  sentenceParts: [
    'I felt',
    'curious',
    'because',
    'I wanted to learn what was inside.',
  ],
};
function harness({
  enrolled = true,
  key = true,
  free = true,
  candidate = fixture,
  providerFailure = false,
  pending = false,
} = {}) {
  const calls = [];
  const envs = {
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SECRET_KEYS: JSON.stringify({ default: 'server-secret' }),
    SUPABASE_PUBLISHABLE_KEYS: JSON.stringify({ default: 'public-key' }),
    ...(key ? { GEMINI_API_KEY: 'never-expose-this' } : {}),
    GEMINI_FREE_TIER_CONFIRMED: String(free),
  };
  let saved;
  const mock = async (url, options = {}) => {
    calls.push({ url, options });
    const ok = (x) => new Response(JSON.stringify(x));
    if (url.endsWith('/auth/v1/user'))
      return ok({
        id: owner,
        email_confirmed_at: '2026-10-15',
        is_anonymous: false,
      });
    if (url.includes('generativelanguage.googleapis.com')) {
      if (providerFailure) throw Error('key=never-expose-this');
      return ok({
        candidates: [
          {
            finishReason: 'STOP',
            content: { parts: [{ text: JSON.stringify(candidate) }] },
          },
        ],
        usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 200 },
      });
    }
    const path = url.split('/rest/v1/')[1],
      body = options.body && JSON.parse(options.body);
    if (path.startsWith('ala_parents'))
      return ok(enrolled ? [{ user_id: owner }] : []);
    if (path.startsWith('ala_students'))
      return ok([
        {
          id: student,
          parent_id: owner,
          school_year: 6,
          curriculum: 'england-primary',
          nickname: 'PRIVATE_CHILD',
        },
      ]);
    if (
      path.startsWith('ala_student_skills') ||
      path.startsWith('ala_prerequisites')
    )
      return ok([]);
    if (path.startsWith('ala_skills'))
      return ok([
        {
          id: 'eng-feeling-curious',
          vocabulary: { curious: 'Wanting to find out more.' },
        },
      ]);
    if (path.startsWith('ala_lessons')) return ok(pending&&path.includes('status=eq.pending_review')?[{id:lessonId,status:'pending_review',content:fixture}]:[]);
    if (path === 'rpc/ala_reset_cloud_learning')
      return ok({reset:true,students_preserved:1,attempts_cleared:2,skills_cleared:3,xp_awards_cleared:1});
    if (path === 'rpc/ala_reserve_generation')
      return ok({ reused: false, job: { id: job } });
    if (path === 'rpc/ala_finish_generation') {
      saved = body;
      return ok(lessonId);
    }
    if (path.startsWith('ala_generation_jobs')) return ok([]);
    throw Error('Unexpected path ' + path);
  };
  return {
    handler: createHandler({
      env: (k) => envs[k],
      fetch: mock,
      validate,
      schema,
    }),
    calls,
    get saved() {
      return saved;
    },
  };
}
const request = (body) =>
  new Request('https://example.supabase.co/functions/v1/learning-api', {
    method: 'POST',
    headers: {
      Origin: 'https://www.elasrag.com',
      Authorization: 'Bearer test-user-jwt',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
test('API rejects unauthenticated or unenrolled users before generation', async () => {
  const h = harness();
  const unauth = await h.handler(
    new Request('https://example.test', { method: 'POST', body: '{}' }),
  );
  assert.equal(unauth.status, 401);
  assert.equal(h.calls.length, 0);
  const blocked = harness({ enrolled: false });
  assert.equal(
    (await blocked.handler(request({ action: 'generate', studentId: student })))
      .status,
    403,
  );
  assert.ok(!blocked.calls.some((c) => c.url.includes('googleapis')));
});
test('missing key and unconfirmed billing fail closed without provider calls', async () => {
  for (const config of [{ key: false }, { free: false }]) {
    const h = harness(config);
    const res = await h.handler(
      request({ action: 'generate', studentId: student }),
    );
    assert.ok([409, 503].includes(res.status));
    assert.ok(!h.calls.some((c) => c.url.includes('googleapis')));
  }
});
test('Gemini adapter saves validated candidate as pending review, never approval', async () => {
  const h = harness();
  const res = await h.handler(
    request({ action: 'generate', studentId: student }),
  );
  assert.equal(res.status, 201);
  const result = await res.json();
  assert.equal(result.status, 'pending_review');
  assert.equal(h.saved.p_ok, true);
  assert.equal(h.saved.p_content.word, 'curious');
  assert.ok(
    !JSON.stringify(
      h.calls.find((c) => c.url.includes('googleapis')).options.body,
    ).includes('PRIVATE_CHILD'),
  );
  assert.ok(!JSON.stringify(result).includes('never-expose-this'));
});
test('answer mismatches are quarantined and provider failures do not leak secrets', async () => {
  const bad = harness({ candidate: { ...fixture, answer: 0 } });
  const res = await bad.handler(
    request({ action: 'generate', studentId: student }),
  );
  assert.equal((await res.json()).status, 'quarantined');
  assert.equal(bad.saved.p_ok, false);
  const failed = harness({ providerFailure: true });
  const response = await failed.handler(
    request({ action: 'generate', studentId: student }),
  );
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('never-expose-this'));
});
test('lesson schema and semantic checks reject unsafe content and malformed sentences', () => {
  assert.ok(validate(fixture));
  assert.ok(checkLesson(fixture, 'curious').ok);
  assert.equal(validate({ ...fixture, hidden: 'injected' }), false);
  assert.equal(
    checkLesson({ ...fixture, story: ['<script>alert(1)</script>'] }, 'curious')
      .ok,
    false,
  );
  assert.equal(
    checkLesson(
      {
        ...fixture,
        sentenceParts: ['I felt', 'relieved', 'because', 'A worry ended.'],
      },
      'curious',
    ).ok,
    false,
  );
  assert.equal(scoreAnswer(fixture, 'vocabulary', 1), true);
  assert.equal(scoreAnswer(fixture, 'sentence', [0, 1, 2, 3]), true);
  assert.equal(scoreAnswer(fixture, 'sentence', [0, 2, 1, 3]), false);
  assert.throws(() => buildPrompt('unsupported'));
});

test('Cloud learning reset is prohibited without parent authentication and an exact typed confirmation',async()=>{
 const h=harness();
 const blocked=await h.handler(request({action:'reset-learning'}));
 assert.equal(blocked.status,409);
 assert.equal((await blocked.json()).error,'explicit_parent_confirmation_required');
 assert.ok(!h.calls.some(c=>c.url.includes('rpc/ala_reset_cloud_learning')));
 const r=await h.handler(request({action:'reset-learning',confirm:'RESET CLOUD LEARNING'}));
 assert.equal(r.status,200);
 const result=await r.json();
 assert.equal(result.reset,true);
 assert.equal(result.students_preserved,1);
 assert.ok(h.calls.some(c=>c.url.endsWith('rpc/ala_reset_cloud_learning')));
 const unverified=harness({enrolled:false});
 const result2=await unverified.handler(request({action:'reset-learning',confirm:'RESET CLOUD LEARNING'}));
 assert.equal(result2.status,403);
 assert.ok(!unverified.calls.some(c=>c.url.includes('rpc/ala_reset_cloud_learning')));
});

test('a pending lesson from an earlier day is reused without another Gemini request',async()=>{const h=harness({pending:true});const result=await h.handler(request({action:'generate',studentId:student}));assert.equal(result.status,200);assert.equal((await result.json()).needsReview,true);assert.equal(h.calls.some(c=>c.url.includes('googleapis')||c.url.includes('ala_reserve_generation')),false);});
