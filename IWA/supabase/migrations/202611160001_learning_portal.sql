begin;

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  version text not null,
  unique (title, version)
);
create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes,
  name text not null,
  starts_on date,
  unique (id, programme_id)
);
create table public.learning_groups (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts,
  name text not null,
  unique (cohort_id, name),
  unique (id, cohort_id)
);
create table public.enrolments (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null,
  cohort_id uuid not null,
  group_id uuid not null,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  foreign key (cohort_id, programme_id) references public.cohorts(id, programme_id),
  foreign key (group_id, cohort_id) references public.learning_groups(id, cohort_id),
  unique (user_id, cohort_id),
  unique (id, programme_id)
);
create index enrolments_group_idx on public.enrolments(group_id);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes,
  title text not null,
  category text not null,
  description text not null,
  position integer not null check (position >= 0),
  unique (programme_id, position),
  unique (id, programme_id)
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null,
  module_id uuid not null,
  title text not null,
  overview text not null,
  body text not null,
  kind text not null check (kind in ('video','reading','assignment')),
  position integer not null check (position >= 0),
  minutes integer not null check (minutes between 1 and 1440),
  video_url text check (video_url like 'https://%'),
  foreign key (module_id, programme_id) references public.modules(id, programme_id),
  unique (module_id, position),
  unique (id, programme_id)
);
create index lessons_programme_idx on public.lessons(programme_id);

create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.learning_groups,
  title text not null,
  starts_at timestamptz not null,
  join_url text not null check (join_url like 'https://%'),
  unique (group_id, starts_at)
);

create table public.applications (
  user_id uuid primary key references auth.users on delete cascade,
  full_name text not null check (length(trim(full_name)) between 2 and 120),
  state text not null check (length(trim(state)) between 2 and 80),
  motivation text not null check (length(trim(motivation)) between 10 and 1200),
  privacy_acknowledged boolean not null check (privacy_acknowledged),
  status text not null default 'received' check (status in ('received','under_review','accepted','declined')),
  created_at timestamptz not null default now()
);

create table public.lesson_progress (
  enrolment_id uuid not null,
  programme_id uuid not null,
  lesson_id uuid not null,
  position_seconds integer not null check (position_seconds between 0 and 86400),
  max_watched_seconds integer not null check (max_watched_seconds between position_seconds and 86400),
  completed_at timestamptz,
  last_seen_at timestamptz not null default now(),
  primary key (enrolment_id, lesson_id),
  foreign key (enrolment_id, programme_id) references public.enrolments(id, programme_id) on delete cascade,
  foreign key (lesson_id, programme_id) references public.lessons(id, programme_id)
);
comment on column public.lesson_progress.completed_at is 'Learner-marked completion. Not attendance, grade, video verification or certification.';

create table public.submissions (
  enrolment_id uuid not null,
  programme_id uuid not null,
  lesson_id uuid not null,
  response text not null check (length(trim(response)) between 10 and 4000),
  submitted_at timestamptz not null default now(),
  feedback text,
  score integer check (score between 0 and 100),
  primary key (enrolment_id, lesson_id),
  foreign key (enrolment_id, programme_id) references public.enrolments(id, programme_id) on delete cascade,
  foreign key (lesson_id, programme_id) references public.lessons(id, programme_id)
);

alter table public.programmes enable row level security;
alter table public.cohorts enable row level security;
alter table public.learning_groups enable row level security;
alter table public.enrolments enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.live_sessions enable row level security;
alter table public.applications enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.submissions enable row level security;

revoke all on public.programmes, public.cohorts, public.learning_groups, public.enrolments,
  public.modules, public.lessons, public.live_sessions, public.applications, public.lesson_progress,
  public.submissions from public, anon, authenticated;
grant select on public.programmes, public.cohorts, public.learning_groups, public.enrolments,
  public.modules, public.lessons, public.live_sessions, public.applications, public.lesson_progress,
  public.submissions to authenticated;
grant insert (user_id, full_name, state, motivation, privacy_acknowledged) on public.applications to authenticated;
grant insert (enrolment_id, programme_id, lesson_id, position_seconds, max_watched_seconds, completed_at),
  update (position_seconds, max_watched_seconds, completed_at, last_seen_at) on public.lesson_progress to authenticated;
grant insert (enrolment_id, programme_id, lesson_id, response) on public.submissions to authenticated;

create policy own_enrolments on public.enrolments for select to authenticated
  using (user_id = (select auth.uid()));
create policy enrolled_programmes on public.programmes for select to authenticated
  using (exists (select 1 from public.enrolments e where e.programme_id = programmes.id));
create policy enrolled_cohorts on public.cohorts for select to authenticated
  using (exists (select 1 from public.enrolments e where e.cohort_id = cohorts.id));
create policy enrolled_groups on public.learning_groups for select to authenticated
  using (exists (select 1 from public.enrolments e where e.group_id = learning_groups.id));
create policy enrolled_modules on public.modules for select to authenticated
  using (exists (select 1 from public.enrolments e where e.programme_id = modules.programme_id));
create policy enrolled_lessons on public.lessons for select to authenticated
  using (exists (select 1 from public.enrolments e where e.programme_id = lessons.programme_id));
create policy group_sessions on public.live_sessions for select to authenticated
  using (exists (select 1 from public.enrolments e where e.group_id = live_sessions.group_id));

create policy own_application on public.applications for select to authenticated
  using (user_id = (select auth.uid()));
create policy own_application_insert on public.applications for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'received');

create policy own_progress on public.lesson_progress for select to authenticated
  using (exists (select 1 from public.enrolments e where e.id = lesson_progress.enrolment_id));
create policy own_progress_insert on public.lesson_progress for insert to authenticated
  with check (exists (select 1 from public.enrolments e where e.id = lesson_progress.enrolment_id));
create policy own_progress_update on public.lesson_progress for update to authenticated
  using (exists (select 1 from public.enrolments e where e.id = lesson_progress.enrolment_id))
  with check (exists (select 1 from public.enrolments e where e.id = lesson_progress.enrolment_id));

create policy own_work on public.submissions for select to authenticated
  using (exists (select 1 from public.enrolments e where e.id = submissions.enrolment_id));
create policy own_assignment_insert on public.submissions for insert to authenticated
  with check (
    exists (select 1 from public.enrolments e where e.id = submissions.enrolment_id)
    and exists (select 1 from public.lessons l where l.id = submissions.lesson_id and l.kind = 'assignment')
  );

create function public.record_progress(
  p_enrolment_id uuid, p_lesson_id uuid, p_position_seconds integer,
  p_max_watched_seconds integer, p_complete boolean
)
returns public.lesson_progress
language plpgsql
security invoker
set search_path = ''
as $$
declare
  course_id uuid;
  saved public.lesson_progress;
begin
  select e.programme_id into course_id from public.enrolments e
  where e.id = p_enrolment_id and e.user_id = (select auth.uid());
  if not found then raise exception 'Enrolment is not available.' using errcode = '42501'; end if;

  insert into public.lesson_progress as previous
    (enrolment_id, programme_id, lesson_id, position_seconds, max_watched_seconds, completed_at)
  values (p_enrolment_id, course_id, p_lesson_id, p_position_seconds,
    p_max_watched_seconds, case when p_complete then now() end)
  on conflict (enrolment_id, lesson_id) do update
    set position_seconds = excluded.position_seconds,
      max_watched_seconds = greatest(previous.max_watched_seconds, excluded.max_watched_seconds),
      completed_at = coalesce(previous.completed_at, excluded.completed_at),
      last_seen_at = now()
  returning * into saved;
  return saved;
end;
$$;

create function public.submit_assignment(
  p_enrolment_id uuid, p_lesson_id uuid, p_response text
)
returns public.submissions
language plpgsql
security invoker
set search_path = ''
as $$
declare
  course_id uuid;
  saved public.submissions;
begin
  select e.programme_id into course_id from public.enrolments e
  where e.id = p_enrolment_id and e.user_id = (select auth.uid());
  if not found then raise exception 'Enrolment is not available.' using errcode = '42501'; end if;

  insert into public.submissions (enrolment_id, programme_id, lesson_id, response)
    values (p_enrolment_id, course_id, p_lesson_id, p_response)
    on conflict (enrolment_id, lesson_id) do nothing;
  select * into saved from public.submissions
    where enrolment_id = p_enrolment_id and lesson_id = p_lesson_id;
  return saved;
end;
$$;

revoke all on function public.record_progress(uuid,uuid,integer,integer,boolean),
  public.submit_assignment(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.record_progress(uuid,uuid,integer,integer,boolean),
  public.submit_assignment(uuid,uuid,text) to authenticated;
commit;
