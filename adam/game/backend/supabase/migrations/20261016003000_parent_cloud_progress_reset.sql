-- Explicit parent-only cloud progress reset.
-- Only learning evidence / XP is reset; students, approved educational content,
-- media and generated assets are preserved to avoid wasteful regeneration.
create or replace function public.ala_reset_cloud_learning(p_parent uuid,p_confirm text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare 
 v_students integer;
 v_attempts integer;
 v_skills integer;
 v_xp integer;
begin
 if p_confirm is distinct from 'RESET CLOUD LEARNING' then
   raise exception 'explicit_parent_confirmation_required';
 end if;
 if not exists(select 1 from public.ala_parents where user_id=p_parent and active) then
   raise exception 'parent_not_enrolled';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(p_parent::text,9072026));
 select count(*) into v_students from public.ala_students where parent_id=p_parent;
 select count(*) into v_attempts from public.ala_attempts where parent_id=p_parent;
 select count(*) into v_skills from public.ala_student_skills where parent_id=p_parent;
 select count(*) into v_xp from public.ala_xp_ledger where parent_id=p_parent;
 delete from public.ala_events where parent_id=p_parent;
 delete from public.ala_reward_ledger where parent_id=p_parent;
 delete from public.ala_xp_ledger where parent_id=p_parent;
 delete from public.ala_attempts where parent_id=p_parent;
 delete from public.ala_student_skills where parent_id=p_parent;
 return jsonb_build_object('reset',true,'students_preserved',v_students,
   'attempts_cleared',v_attempts,'skills_cleared',v_skills,
   'xp_awards_cleared',v_xp,'approved_lessons_preserved',true);
end $$;
revoke all on function public.ala_reset_cloud_learning(uuid,text) from public,anon,authenticated;
grant execute on function public.ala_reset_cloud_learning(uuid,text) to service_role;
