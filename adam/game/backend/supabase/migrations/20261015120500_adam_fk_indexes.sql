-- Cover composite and owner foreign keys reported by the Supabase database linter.
create index if not exists ala_attempts_lesson_owner_idx
  on public.ala_attempts(lesson_id, parent_id);
create index if not exists ala_attempts_student_owner_idx
  on public.ala_attempts(student_id, parent_id);
create index if not exists ala_reviews_parent_idx
  on public.ala_content_reviews(parent_id);
create index if not exists ala_events_student_owner_idx
  on public.ala_events(student_id, parent_id);
create index if not exists ala_lessons_job_owner_idx
  on public.ala_lessons(job_id, parent_id);
create index if not exists ala_media_lesson_owner_idx
  on public.ala_media(lesson_id, parent_id);
create index if not exists ala_reward_student_owner_idx
  on public.ala_reward_ledger(student_id, parent_id);
create index if not exists ala_student_skills_student_owner_idx
  on public.ala_student_skills(student_id, parent_id);
create index if not exists ala_xp_lesson_owner_idx
  on public.ala_xp_ledger(lesson_id, parent_id);
create index if not exists ala_xp_student_owner_idx
  on public.ala_xp_ledger(student_id, parent_id);
