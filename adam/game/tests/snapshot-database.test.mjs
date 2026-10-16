import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("snapshot RLS isolates families; stale concurrent writes rejected; anonymous writes blocked", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema public,auth to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;create table ala_parents(user_id uuid primary key,active boolean);create table ala_students(id uuid,parent_id uuid,unique(id,parent_id));grant select on ala_parents,ala_students to authenticated;insert into ala_parents values('00000000-0000-4000-8000-000000000001',true),('00000000-0000-4000-8000-000000000002',true);insert into ala_students values('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000001');`,
    );
    await db.exec(
      await readFile(
        new URL("../backend/sql/device-snapshots.sql", import.meta.url),
        "utf8",
      ),
    );
    await db.exec(
      `select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',false);set role authenticated;`,
    );
    const save = (revision) =>
      db.query(
        `select ala_save_device_snapshot('00000000-0000-4000-8000-000000000011',$1,'{"version":1}'::jsonb) as result`,
        [revision],
      );
    assert.equal((await save(0)).rows[0].result.revision, 1);
    assert.equal((await save(0)).rows[0].result.conflict, true);
    assert.equal((await save(1)).rows[0].result.revision, 2);
    assert.equal((await save(1)).rows[0].result.conflict, true);
    await db.exec(
      `reset role;select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000002',false);set role authenticated;`,
    );
    assert.equal(
      (await db.query("select * from ala_device_snapshots")).rows.length,
      0,
    );
    await assert.rejects(save(2), /not authorised/);
    await db.exec("reset role;set role anon");
    await assert.rejects(save(0), /permission denied/);
    await assert.rejects(
      db.query("select * from ala_device_snapshots"),
      /permission denied/,
    );
  } finally {
    await db.close();
  }
});
