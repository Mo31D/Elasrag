-- Prepared for the dedicated Adam project only. No child records or secrets are seeded.
begin;
create table public.ala_parents (
 user_id uuid primary key references auth.users(id) on delete cascade,
 active boolean not null default true, created_at timestamptz not null default now()
);
create table public.ala_students (
 id uuid primary key default gen_random_uuid(), parent_id uuid not null references public.ala_parents(user_id),
 nickname text not null check(char_length(nickname) between 1 and 30), school_year int not null check(school_year between 1 and 6),
 curriculum text not null default 'england-primary' check(curriculum='england-primary'),
 interface_language text not null default 'en-GB' check(interface_language='en-GB'),
 instruction_language text not null default 'en-GB' check(instruction_language='en-GB'),
 narration_language text not null default 'en-GB' check(narration_language='en-GB'),
 created_at timestamptz not null default now(), unique(id,parent_id)
);
create index ala_students_parent_idx on public.ala_students(parent_id);
create table public.ala_curricula(id text primary key,title text not null,reference_url text not null);
create table public.ala_skills (
 id text primary key,curriculum_id text not null references public.ala_curricula(id),subject text not null,
 objective text not null,year_min int not null check(year_min between 1 and 6),year_max int not null check(year_max between year_min and 6),
 vocabulary jsonb not null default '{}'::jsonb, enabled boolean not null default false,source_type text not null
);
create index ala_skills_curriculum_idx on public.ala_skills(curriculum_id);
create table public.ala_prerequisites(skill_id text references public.ala_skills(id),requires_id text references public.ala_skills(id),primary key(skill_id,requires_id),check(skill_id<>requires_id));
create index ala_prerequisites_requires_idx on public.ala_prerequisites(requires_id);
create table public.ala_settings (
 parent_id uuid primary key references public.ala_parents(user_id),generation_enabled boolean not null default false,
 free_tier_confirmed boolean not null default false,daily_limit int not null default 2 check(daily_limit between 1 and 5),
 paid_usage_allowed boolean not null default false check(paid_usage_allowed=false),
 auto_prepare boolean not null default false check(auto_prepare=false),audio_enabled boolean not null default false check(audio_enabled=false),
 rewards_enabled boolean not null default false check(rewards_enabled=false),
 check(not generation_enabled or free_tier_confirmed)
);
create table public.ala_generation_jobs (
 id uuid primary key default gen_random_uuid(),parent_id uuid not null references public.ala_parents(user_id),
 skill_id text not null references public.ala_skills(id),request_key text not null check(char_length(request_key) between 8 and 160),
 status text not null default 'reserved' check(status in ('reserved','running','pending_review','quarantined','failed','approved','rejected')),
 model text not null default 'gemini-2.5-flash-lite',input_tokens int not null default 0 check(input_tokens>=0),output_tokens int not null default 0 check(output_tokens>=0),
 failure_code text,created_at timestamptz not null default now(),finished_at timestamptz,unique(parent_id,request_key),unique(id,parent_id)
);
create index ala_jobs_parent_created_idx on public.ala_generation_jobs(parent_id,created_at);
create index ala_jobs_skill_idx on public.ala_generation_jobs(skill_id);
create table public.ala_lessons (
 id uuid primary key default gen_random_uuid(),parent_id uuid not null references public.ala_parents(user_id),skill_id text not null references public.ala_skills(id),
 job_id uuid not null unique,content jsonb not null,content_hash text not null,version int not null default 1 check(version=1),
 status text not null default 'pending_review' check(status in ('pending_review','quarantined','approved','rejected')),
 validation jsonb not null default '{}'::jsonb,created_at timestamptz not null default now(),approved_at timestamptz,
 unique(id,parent_id),foreign key(job_id,parent_id) references public.ala_generation_jobs(id,parent_id)
);
create index ala_lessons_parent_status_idx on public.ala_lessons(parent_id,status);
create index ala_lessons_skill_idx on public.ala_lessons(skill_id);
create table public.ala_content_reviews (
 id uuid primary key default gen_random_uuid(),parent_id uuid not null references public.ala_parents(user_id),lesson_id uuid not null,
 decision text not null check(decision in ('approved','rejected')),checks jsonb not null,created_at timestamptz not null default now(),
 foreign key(lesson_id,parent_id) references public.ala_lessons(id,parent_id)
);
create index ala_reviews_lesson_idx on public.ala_content_reviews(lesson_id,parent_id);
create table public.ala_student_skills (
 student_id uuid not null,parent_id uuid not null,skill_id text not null references public.ala_skills(id),
 state text not null default 'Learning' check(state in ('Not started','Learning','Practising','Review due','Secure')),
 independent_days int not null default 0,review_count int not null default 0,assisted_attempts int not null default 0,
 last_independent_day date,last_attempt_at timestamptz,next_review_at timestamptz,
 primary key(student_id,skill_id),foreign key(student_id,parent_id) references public.ala_students(id,parent_id)
);
create index ala_student_skills_owner_idx on public.ala_student_skills(parent_id,next_review_at);
create index ala_student_skills_skill_idx on public.ala_student_skills(skill_id);
create table public.ala_attempts (
 id uuid primary key,parent_id uuid not null,student_id uuid not null,lesson_id uuid not null,skill_id text not null references public.ala_skills(id),
 kind text not null check(kind in ('vocabulary','sentence')),answer jsonb not null,correct boolean not null,assisted boolean not null,
 active_ms int not null default 0 check(active_ms between 0 and 30000),created_at timestamptz not null default now(),
 foreign key(student_id,parent_id) references public.ala_students(id,parent_id),foreign key(lesson_id,parent_id) references public.ala_lessons(id,parent_id)
);
create index ala_attempts_parent_idx on public.ala_attempts(parent_id,created_at);
create index ala_attempts_student_lesson_idx on public.ala_attempts(student_id,lesson_id);
create index ala_attempts_skill_idx on public.ala_attempts(skill_id);
create table public.ala_events (
 id uuid primary key default gen_random_uuid(),parent_id uuid not null,student_id uuid not null,
 client_event_id uuid not null,type text not null check(type in ('mission_started','skill_attempted','mission_completed','xp_awarded','mastery_changed')),
 payload jsonb not null default '{}'::jsonb check(pg_column_size(payload)<2048),created_at timestamptz not null default now(),
 foreign key(student_id,parent_id) references public.ala_students(id,parent_id),unique(parent_id,client_event_id,type)
);
create index ala_events_owner_idx on public.ala_events(parent_id,created_at);
create index ala_events_student_idx on public.ala_events(student_id);
create table public.ala_xp_ledger (
 id uuid primary key default gen_random_uuid(),parent_id uuid not null,student_id uuid not null,lesson_id uuid not null,
 reason text not null check(reason in ('mission','independent-vocabulary','independent-sentence')),amount int not null check(amount between 0 and 10),created_at timestamptz not null default now(),
 foreign key(student_id,parent_id) references public.ala_students(id,parent_id),foreign key(lesson_id,parent_id) references public.ala_lessons(id,parent_id),unique(student_id,lesson_id,reason)
);
create index ala_xp_owner_idx on public.ala_xp_ledger(parent_id);
create index ala_xp_lesson_idx on public.ala_xp_ledger(lesson_id);
create table public.ala_reward_ledger (
 id uuid primary key default gen_random_uuid(),parent_id uuid not null,student_id uuid not null,amount int not null default 0 check(amount=0),
 reason text not null default 'disabled',created_at timestamptz not null default now(),foreign key(student_id,parent_id) references public.ala_students(id,parent_id)
);
create index ala_reward_owner_idx on public.ala_reward_ledger(parent_id);
create index ala_reward_student_idx on public.ala_reward_ledger(student_id);
create table public.ala_media (
 id uuid primary key default gen_random_uuid(),parent_id uuid not null,lesson_id uuid not null,object_path text not null unique,
 content_hash text not null,locale text not null default 'en-GB',voice text not null,approved boolean not null default false,
 created_at timestamptz not null default now(),foreign key(lesson_id,parent_id) references public.ala_lessons(id,parent_id)
);
create index ala_media_owner_idx on public.ala_media(parent_id);
create index ala_media_lesson_idx on public.ala_media(lesson_id);
-- Explicit grants: the browser can only read rows belonging to an enrolled active parent.
-- All writes go through the authenticated Edge Function and service-only SQL procedures.
alter table public.ala_parents enable row level security;
revoke all on public.ala_parents from anon,authenticated;
grant select on public.ala_parents to authenticated;
grant all on public.ala_parents to service_role;
create policy ala_parent_self on public.ala_parents for select to authenticated using(user_id=(select auth.uid()) and active);
do $$ declare t text;begin
 foreach t in array array['ala_students','ala_settings','ala_generation_jobs','ala_lessons','ala_content_reviews','ala_student_skills','ala_attempts','ala_events','ala_xp_ledger','ala_reward_ledger','ala_media'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from anon,authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
  execute format('grant all on public.%I to service_role',t);
  execute format('create policy %I on public.%I for select to authenticated using (parent_id=(select auth.uid()) and exists(select 1 from public.ala_parents p where p.user_id=(select auth.uid()) and p.active))',t||'_owner',t);
 end loop;
 foreach t in array array['ala_curricula','ala_skills','ala_prerequisites'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from anon,authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
  execute format('grant all on public.%I to service_role',t);
  execute format('create policy %I on public.%I for select to authenticated using (exists(select 1 from public.ala_parents p where p.user_id=(select auth.uid()) and p.active))',t||'_parent',t);
 end loop;
end $$;
insert into public.ala_curricula values('england-primary','England primary English — supplementary practice','https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study');
insert into public.ala_skills(id,curriculum_id,subject,objective,year_min,year_max,vocabulary,enabled,source_type) values
('eng-feeling-curious','england-primary','English','Understand curious in context and explain a feeling using because.',1,6,'{"curious": "Wanting to find out more."}',true,'Supplementary vocabulary and composition practice; not a statutory year-specific standard'),
('eng-feeling-puzzled','england-primary','English','Understand puzzled in context and explain a feeling using because.',1,6,'{"puzzled": "Unsure because something is difficult to understand."}',true,'Supplementary vocabulary and composition practice; not a statutory year-specific standard'),
('eng-feeling-relieved','england-primary','English','Understand relieved in context and explain a feeling using because.',1,6,'{"relieved": "Happy and relaxed because a worry has gone away."}',true,'Supplementary vocabulary and composition practice; not a statutory year-specific standard'),
('eng-feeling-confident','england-primary','English','Understand confident in context and explain a feeling using because.',1,6,'{"confident": "Feeling sure that you can try or do something."}',true,'Supplementary vocabulary and composition practice; not a statutory year-specific standard');
-- Atomic reservations include failures and timeouts in the daily request cap.
create function public.ala_reserve_generation(p_parent uuid,p_skill text,p_key text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare cfg public.ala_settings;existing public.ala_generation_jobs;job public.ala_generation_jobs;n int;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_parent::text,0));
 if not exists(select 1 from public.ala_parents where user_id=p_parent and active) then raise exception 'Parent not authorised';end if;
 select * into existing from public.ala_generation_jobs where parent_id=p_parent and request_key=p_key;
 if found then return jsonb_build_object('reused',true,'job',to_jsonb(existing));end if;
 select * into cfg from public.ala_settings where parent_id=p_parent;
 if not found or not cfg.generation_enabled or not cfg.free_tier_confirmed or cfg.paid_usage_allowed then raise exception 'Free-tier generation not enabled';end if;
 if not exists(select 1 from public.ala_skills where id=p_skill and enabled) then raise exception 'Skill unavailable';end if;
 select count(*) into n from public.ala_generation_jobs where parent_id=p_parent and created_at>=date_trunc('day',now());
 if n>=cfg.daily_limit then raise exception 'Daily generation limit reached';end if;
 if exists(select 1 from public.ala_generation_jobs where parent_id=p_parent and created_at>now()-interval '1 minute') then raise exception 'Please wait before another request';end if;
 insert into public.ala_generation_jobs(parent_id,skill_id,request_key) values(p_parent,p_skill,p_key) returning * into job;
 return jsonb_build_object('reused',false,'job',to_jsonb(job));
end $$;
revoke all on function public.ala_reserve_generation(uuid,text,text) from public,anon,authenticated;
grant execute on function public.ala_reserve_generation(uuid,text,text) to service_role;
-- Server-verified answers only. Idempotent attempt IDs and a unique XP ledger prevent farming.
create function public.ala_record_attempt(p_parent uuid,p_student uuid,p_lesson uuid,p_id uuid,p_kind text,p_answer jsonb,p_correct boolean,p_assisted boolean,p_active_ms int) returns jsonb language plpgsql security invoker set search_path='' as $$
declare lesson public.ala_lessons;previous public.ala_attempts;sk public.ala_student_skills;awarded int:=0;done boolean;days int[]:=array[1,3,7,14,30];
begin
 perform pg_advisory_xact_lock(hashtextextended(p_student::text,1));
 if not exists(select 1 from public.ala_parents where user_id=p_parent and active) or not exists(select 1 from public.ala_students where id=p_student and parent_id=p_parent) then raise exception 'Student not authorised';end if;
 select * into previous from public.ala_attempts where id=p_id;
 if found then
  if previous.parent_id<>p_parent or previous.student_id<>p_student or previous.lesson_id<>p_lesson or previous.kind<>p_kind or previous.answer is distinct from p_answer or previous.assisted<>p_assisted then raise exception 'Attempt ID conflict';end if;
  return jsonb_build_object('reused',true,'correct',previous.correct,'xp',0);
 end if;
 select * into lesson from public.ala_lessons where id=p_lesson and parent_id=p_parent and status='approved';
 if not found then raise exception 'Approved lesson not found';end if;
 insert into public.ala_attempts(id,parent_id,student_id,lesson_id,skill_id,kind,answer,correct,assisted,active_ms) values(p_id,p_parent,p_student,p_lesson,lesson.skill_id,p_kind,p_answer,p_correct,p_assisted,least(30000,greatest(0,p_active_ms)));
 insert into public.ala_student_skills(student_id,parent_id,skill_id) values(p_student,p_parent,lesson.skill_id) on conflict do nothing;
 select * into sk from public.ala_student_skills where student_id=p_student and skill_id=lesson.skill_id for update;
 if p_correct and not p_assisted then
  sk.next_review_at:=coalesce(sk.next_review_at,now()+interval '1 day');
  if (sk.last_independent_day is null or sk.last_independent_day<current_date) and (select count(distinct kind)=2 from public.ala_attempts where student_id=p_student and lesson_id=p_lesson and correct and not assisted and created_at>=date_trunc('day',now())) then
   if sk.independent_days>0 and now()>=sk.next_review_at then sk.review_count:=sk.review_count+1;end if;
   sk.independent_days:=sk.independent_days+1;sk.last_independent_day:=current_date;
   sk.next_review_at:=now()+make_interval(days=>days[least(sk.review_count+1,5)]);
  end if;
  insert into public.ala_xp_ledger(parent_id,student_id,lesson_id,reason,amount) values(p_parent,p_student,p_lesson,'independent-'||p_kind,case when p_kind='vocabulary' then 3 else 2 end) on conflict do nothing;
  if found then awarded:=case when p_kind='vocabulary' then 3 else 2 end;end if;
 else sk.assisted_attempts:=sk.assisted_attempts+1;sk.next_review_at:=now()+interval '1 day';end if;
 sk.state:=case when sk.review_count>=3 and sk.independent_days>=4 then 'Secure' when sk.independent_days>0 then 'Practising' else 'Learning' end;
 update public.ala_student_skills set state=sk.state,independent_days=sk.independent_days,review_count=sk.review_count,assisted_attempts=sk.assisted_attempts,last_independent_day=sk.last_independent_day,next_review_at=sk.next_review_at,last_attempt_at=now() where student_id=p_student and skill_id=lesson.skill_id;
 select count(distinct kind)=2 into done from public.ala_attempts where student_id=p_student and lesson_id=p_lesson and correct;
 if done then
  insert into public.ala_xp_ledger(parent_id,student_id,lesson_id,reason,amount) values(p_parent,p_student,p_lesson,'mission',5) on conflict do nothing;
  if found then
   awarded:=awarded+5;
   insert into public.ala_events(parent_id,student_id,client_event_id,type,payload) values(p_parent,p_student,p_id,'mission_completed',jsonb_build_object('lesson',p_lesson));
  end if;
 end if;
 insert into public.ala_events(parent_id,student_id,client_event_id,type,payload) values(p_parent,p_student,p_id,'skill_attempted',jsonb_build_object('skill',lesson.skill_id,'kind',p_kind,'correct',p_correct,'assisted',p_assisted,'active_ms',least(30000,greatest(0,p_active_ms))));
 if awarded>0 then insert into public.ala_events(parent_id,student_id,client_event_id,type,payload) values(p_parent,p_student,p_id,'xp_awarded',jsonb_build_object('xp',awarded));end if;
 return jsonb_build_object('correct',p_correct,'complete',done,'xp',awarded,'state',sk.state,'next_review_at',sk.next_review_at);
end $$;
revoke all on function public.ala_record_attempt(uuid,uuid,uuid,uuid,text,jsonb,boolean,boolean,int) from public,anon,authenticated;
grant execute on function public.ala_record_attempt(uuid,uuid,uuid,uuid,text,jsonb,boolean,boolean,int) to service_role;
create function public.ala_finish_generation(p_parent uuid,p_job uuid,p_content jsonb,p_hash text,p_validation jsonb,p_ok boolean,p_input int,p_output int) returns uuid language plpgsql security invoker set search_path='' as $$
declare job public.ala_generation_jobs;lesson_id uuid;
begin
 select * into job from public.ala_generation_jobs where id=p_job and parent_id=p_parent for update;
 if not found then raise exception 'Job not found';end if;
 select id into lesson_id from public.ala_lessons where job_id=p_job;
 if found then return lesson_id;end if;
 if job.status not in ('reserved','running') then raise exception 'Job cannot be completed';end if;
 insert into public.ala_lessons(parent_id,skill_id,job_id,content,content_hash,status,validation) values(p_parent,job.skill_id,p_job,p_content,p_hash,case when p_ok then 'pending_review' else 'quarantined' end,p_validation) returning id into lesson_id;
 update public.ala_generation_jobs set status=case when p_ok then 'pending_review' else 'quarantined' end,input_tokens=greatest(0,p_input),output_tokens=greatest(0,p_output),finished_at=now() where id=p_job;
 return lesson_id;
end $$;
revoke all on function public.ala_finish_generation(uuid,uuid,jsonb,text,jsonb,boolean,int,int) from public,anon,authenticated;
grant execute on function public.ala_finish_generation(uuid,uuid,jsonb,text,jsonb,boolean,int,int) to service_role;
create function public.ala_review_lesson(p_parent uuid,p_lesson uuid,p_decision text,p_checks jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare lesson public.ala_lessons;
begin
 if not exists(select 1 from public.ala_parents where user_id=p_parent and active) then raise exception 'Parent not authorised';end if;
 select * into lesson from public.ala_lessons where id=p_lesson and parent_id=p_parent for update;
 if not found or lesson.status not in ('pending_review','quarantined') then raise exception 'Lesson cannot be reviewed';end if;
 if p_decision not in ('approved','rejected') then raise exception 'Invalid decision';end if;
 if p_decision='approved' and (lesson.status<>'pending_review' or not coalesce(p_checks @> '{"answer":true,"language":true,"curriculum":true,"safety":true}'::jsonb,false)) then raise exception 'Complete educational review required';end if;
 insert into public.ala_content_reviews(parent_id,lesson_id,decision,checks) values(p_parent,p_lesson,p_decision,p_checks);
 update public.ala_lessons set status=p_decision,approved_at=case when p_decision='approved' then now() else null end where id=p_lesson;
 update public.ala_generation_jobs set status=p_decision where id=lesson.job_id;
 return jsonb_build_object('status',p_decision);
end $$;
revoke all on function public.ala_review_lesson(uuid,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.ala_review_lesson(uuid,uuid,text,jsonb) to service_role;
-- Private educational assets. Only backend writes; active parent may read own folder.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('ala-educational-assets','ala-educational-assets',false,10485760,array['audio/mpeg','audio/wav','image/png','image/webp']) on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy ala_media_parent_read on storage.objects for select to authenticated using(bucket_id='ala-educational-assets' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.ala_parents p where p.user_id=(select auth.uid()) and p.active));
commit;
