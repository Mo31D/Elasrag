import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
const migration = await readFile(
  new URL(
    '../backend/supabase/migrations/20261015110315_adam_secure_learning_foundation.sql',
    import.meta.url,
  ),
  'utf8',
);
const parentA = '00000000-0000-4000-8000-000000000001',
  parentB = '00000000-0000-4000-8000-000000000002',
  studentA = '00000000-0000-4000-8000-000000000011',
  studentB = '00000000-0000-4000-8000-000000000012';
async function database() {
  const db = new PGlite();
  await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema public,auth to anon,authenticated,service_role;grant execute on function auth.uid() to anon,authenticated,service_role;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid primary key,name text,bucket_id text);alter table storage.objects enable row level security;grant usage on schema storage to authenticated;grant select on storage.objects to authenticated;create function storage.foldername(text) returns text[] language sql immutable as $$select (string_to_array($1,'/'))[1:array_length(string_to_array($1,'/'),1)-1]$$;`,
  );
  await db.exec(migration);
  await db.query('insert into auth.users values($1),($2)', [parentA, parentB]);
  await db.query('insert into ala_parents(user_id) values($1),($2)', [
    parentA,
    parentB,
  ]);
  await db.query(
    'insert into ala_settings(parent_id,generation_enabled,free_tier_confirmed) values($1,true,true),($2,true,true)',
    [parentA, parentB],
  );
  await db.query(
    "insert into ala_students(id,parent_id,nickname,school_year) values($1,$2,'Test A',6),($3,$4,'Test B',4)",
    [studentA, parentA, studentB, parentB],
  );
  return db;
}
async function asUser(db, id, role = 'authenticated') {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  await db.exec('set role ' + role);
}
test('migration applies; RLS isolates families and anonymous access, blocks direct XP writes and RPCs', async () => {
  const db = await database();
  try {
    await asUser(db, parentA);
    const rows = await db.query('select id from ala_students');
    assert.deepEqual(rows.rows, [{ id: studentA }]);
    await assert.rejects(
      db.exec(
        "insert into ala_xp_ledger(parent_id,student_id,lesson_id,reason,amount) values('" +
          parentA +
          "','" +
          studentA +
          "',gen_random_uuid(),'mission',5)",
      ),
      /permission denied/,
    );
    await assert.rejects(
      db.query('select ala_reserve_generation($1,$2,$3)', [
        parentA,
        'eng-feeling-curious',
        'test-key-0001',
      ]),
      /permission denied/,
    );
    await asUser(db, parentB);
    assert.deepEqual((await db.query('select id from ala_students')).rows, [
      { id: studentB },
    ]);
    await asUser(db, parentA, 'anon');
    await assert.rejects(
      db.exec('select * from ala_students'),
      /permission denied/,
    );
    await db.exec('reset role');
    const policies = await db.query(
      "select tablename from pg_tables where schemaname='public' and tablename like 'ala_%' and not rowsecurity",
    );
    assert.equal(policies.rows.length, 0);
  } finally {
    await db.close();
  }
});
test('generation reservations deduplicate atomically and enforce cooldown and daily caps', async () => {
  const db = await database();
  try {
    const a = await db.query(
      'select ala_reserve_generation($1,$2,$3) as result',
      [parentA, 'eng-feeling-curious', 'reservation-01'],
    );
    assert.equal(a.rows[0].result.reused, false);
    const same = await db.query(
      'select ala_reserve_generation($1,$2,$3) as result',
      [parentA, 'eng-feeling-curious', 'reservation-01'],
    );
    assert.equal(same.rows[0].result.reused, true);
    await assert.rejects(
      db.query('select ala_reserve_generation($1,$2,$3)', [
        parentA,
        'eng-feeling-curious',
        'reservation-02',
      ]),
      /wait before/,
    );
    await db.query(
      "update ala_generation_jobs set created_at=now()-interval '2 minutes' where parent_id=$1",
      [parentA],
    );
    await db.query('select ala_reserve_generation($1,$2,$3)', [
      parentA,
      'eng-feeling-curious',
      'reservation-02',
    ]);
    await assert.rejects(
      db.query('select ala_reserve_generation($1,$2,$3)', [
        parentA,
        'eng-feeling-curious',
        'reservation-03',
      ]),
      /Daily generation limit/,
    );
  } finally {
    await db.close();
  }
});
test('review and progress procedures require approval and award XP once across retries', async () => {
  const db = await database();
  try {
    const j = (
      await db.query('select ala_reserve_generation($1,$2,$3) as v', [
        parentA,
        'eng-feeling-curious',
        'test-lesson-01',
      ])
    ).rows[0].v.job.id;
    const lesson = (
      await db.query(
        'select ala_finish_generation($1,$2,$3,$4,$5,true,12,24) as id',
        [
          parentA,
          j,
          JSON.stringify({ fixture: true }),
          'testhash',
          JSON.stringify({ schema: true }),
        ],
      )
    ).rows[0].id;
    assert.equal(
      (await db.query('select status from ala_lessons where id=$1', [lesson]))
        .rows[0].status,
      'pending_review',
    );
    await assert.rejects(
      db.query('select ala_review_lesson($1,$2,$3,$4)', [
        parentA,
        lesson,
        'approved',
        '{}',
      ]),
      /educational review/,
    );
    await assert.rejects(
      db.query('select ala_review_lesson($1,$2,$3,$4)', [
        parentB,
        lesson,
        'approved',
        JSON.stringify({
          answer: true,
          language: true,
          curriculum: true,
          safety: true,
        }),
      ]),
      /cannot be reviewed/,
    );
    await db.query('select ala_review_lesson($1,$2,$3,$4)', [
      parentA,
      lesson,
      'approved',
      JSON.stringify({
        answer: true,
        language: true,
        curriculum: true,
        safety: true,
      }),
    ]);
    const submit = async (id, kind) =>
      db.query(
        'select ala_record_attempt($1,$2,$3,$4,$5,$6,true,false,1000) as v',
        [parentA, studentA, lesson, id, kind, JSON.stringify(0)],
      );
    const first = (
      await submit('00000000-0000-4000-8000-000000000021', 'vocabulary')
    ).rows[0].v;
    assert.equal(first.xp, 3);
    assert.equal(
      (await submit('00000000-0000-4000-8000-000000000021', 'vocabulary'))
        .rows[0].v.xp,
      0,
    );
    assert.equal(
      (await submit('00000000-0000-4000-8000-000000000022', 'sentence')).rows[0]
        .v.xp,
      7,
    );
    assert.equal(
      (await submit('00000000-0000-4000-8000-000000000023', 'sentence')).rows[0]
        .v.xp,
      0,
    );
    assert.equal(
      (await db.query('select sum(amount)::int as n from ala_xp_ledger'))
        .rows[0].n,
      10,
    );
    assert.equal(
      (await db.query('select count(*)::int as n from ala_content_reviews'))
        .rows[0].n,
      1,
    );
    assert.equal(
      (await db.query('select independent_days from ala_student_skills'))
        .rows[0].independent_days,
      1,
    );
  } finally {
    await db.close();
  }
});
