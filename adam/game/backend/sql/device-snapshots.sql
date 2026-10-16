-- Opaque family learning backups, not server-verified mastery or XP awards.
begin;
create table public.ala_device_snapshots(
 student_id uuid primary key, parent_id uuid not null,
 revision bigint not null default 1 check(revision>0),
 payload jsonb not null check(jsonb_typeof(payload)='object' and payload->>'version'='1' and octet_length(payload::text)<=1000000),
 updated_at timestamptz not null default now(),
 foreign key(student_id,parent_id) references public.ala_students(id,parent_id) on delete cascade
);
create index ala_device_snapshots_owner on public.ala_device_snapshots(parent_id);
alter table public.ala_device_snapshots enable row level security;
revoke all on public.ala_device_snapshots from public,anon,authenticated;
grant select,insert,update on public.ala_device_snapshots to authenticated;
grant all on public.ala_device_snapshots to service_role;
create policy ala_device_snapshots_owner on public.ala_device_snapshots to authenticated
using(parent_id=(select auth.uid()) and exists(select 1 from public.ala_parents p where p.user_id=(select auth.uid()) and p.active))
with check(parent_id=(select auth.uid()) and exists(select 1 from public.ala_parents p where p.user_id=(select auth.uid()) and p.active));
create function public.ala_save_device_snapshot(p_student uuid,p_expected_revision bigint,p_payload jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare result public.ala_device_snapshots;
begin
 if auth.uid() is null or not exists(select 1 from public.ala_students s where s.id=p_student and s.parent_id=auth.uid()) then raise exception 'Student not authorised';end if;
 if p_expected_revision<0 or p_expected_revision is null then raise exception 'Invalid revision';end if;
 -- Transaction-level lock serialises two first saves as well as updates.
 perform pg_advisory_xact_lock(hashtextextended(p_student::text,42));
 if p_expected_revision=0 then
  insert into public.ala_device_snapshots(student_id,parent_id,payload) values(p_student,auth.uid(),p_payload)
  on conflict do nothing returning * into result;
 else
  update public.ala_device_snapshots set payload=p_payload,revision=revision+1,updated_at=now()
  where student_id=p_student and parent_id=auth.uid() and revision=p_expected_revision returning * into result;
 end if;
 if result.student_id is null then return jsonb_build_object('conflict',true);end if;
 return jsonb_build_object('conflict',false,'revision',result.revision,'updated_at',result.updated_at);
end $$;
revoke all on function public.ala_save_device_snapshot(uuid,bigint,jsonb) from public,anon;
grant execute on function public.ala_save_device_snapshot(uuid,bigint,jsonb) to authenticated;
commit;
