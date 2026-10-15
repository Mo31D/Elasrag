-- Already applied to Supabase Adam. Scoped, parent-authenticated TTS pilot only.
-- Does not alter existing learning-api, lesson records, or XP.
create table if not exists public.ala_tts_jobs (
  parent_id uuid not null references public.ala_parents(user_id) on delete cascade,
  clip_id text not null check (clip_id ~ '^s[0-9]{2}-preview$'),
  status text not null default 'reserved' check (status in ('reserved','ready','failed')),
  storage_path text,
  model text not null default 'gemini-3.8-flash-lite-tts',
  error_code text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (parent_id,clip_id)
);
create index if not exists ala_tts_jobs_parent_day_idx on public.ala_tts_jobs(parent_id,created_at);
alter table public.ala_tts_jobs enable row level security;
revoke all on public.ala_tts_jobs from anon,authenticated;
grant select on public.ala_tts_jobs to authenticated;
grant all on public.ala_tts_jobs to service_role;
drop policy if exists ala_tts_jobs_parent_read on public.ala_tts_jobs;
create policy ala_tts_jobs_parent_read on public.ala_tts_jobs
  for select to authenticated
  using (parent_id=(select auth.uid())
    and exists(select 1 from public.ala_parents p
      where p.user_id=(select auth.uid()) and p.active));
create or replace function public.ala_reserve_tts(p_parent uuid,p_clip text) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare prior public.ala_tts_jobs; cfg public.ala_settings;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_parent::text,42));
  if p_clip <> 's01-preview' then raise exception 'Clip not available'; end if;
  if not exists(select 1 from public.ala_parents where user_id=p_parent and active)
    then raise exception 'Parent not enrolled'; end if;
  select * into prior from public.ala_tts_jobs where parent_id=p_parent and clip_id=p_clip;
  if found then
    return jsonb_build_object('reused',true,'status',prior.status,'path',prior.storage_path);
  end if;
  select * into cfg from public.ala_settings where parent_id=p_parent;
  if not found or not cfg.free_tier_confirmed or cfg.paid_usage_allowed
    then raise exception 'Free tier not confirmed'; end if;
  if (select count(*) from public.ala_tts_jobs
      where parent_id=p_parent and created_at>=date_trunc('day',now())) >= 2
    then raise exception 'Daily TTS pilot limit reached'; end if;
  if exists(select 1 from public.ala_tts_jobs
      where parent_id=p_parent and created_at>now()-interval '1 minute')
    then raise exception 'Please wait before another TTS request'; end if;
  insert into public.ala_tts_jobs(parent_id,clip_id) values(p_parent,p_clip);
  return jsonb_build_object('reused',false,'status','reserved');
end $$;
revoke all on function public.ala_reserve_tts(uuid,text) from public,anon,authenticated;
grant execute on function public.ala_reserve_tts(uuid,text) to service_role;
