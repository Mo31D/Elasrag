import { createClient } from '@supabase/supabase-js';

export async function connect() {
  const response = await fetch('./backend-config.json', {cache:'no-store'});
  if (!response.ok) throw new Error('Connection settings could not be loaded.');
  const {url, publishableKey} = await response.json();
  if (!url && !publishableKey) return null;
  if (!url?.startsWith('https://') || !publishableKey) throw new Error('Connection settings are incomplete.');
  return createClient(url, publishableKey);
}

async function read(query) {
  const {data, error} = await query;
  if (error) throw error;
  return data;
}

export async function learnerRecords(client, userId) {
  const [enrolments, application] = await Promise.all([
    read(client.from('enrolments').select('id,programme_id,cohort_id,group_id,cohorts(name),learning_groups(name)').eq('user_id', userId).order('created_at',{ascending:false})),
    read(client.from('applications').select('status,created_at').eq('user_id', userId).maybeSingle())
  ]);
  return {enrolments, application};
}

export async function loadCourse(client, enrolment) {
  const [modules, lessons, progress, submissions, sessions] = await Promise.all([
    read(client.from('modules').select('*').eq('programme_id',enrolment.programme_id).order('position')),
    read(client.from('lessons').select('*').eq('programme_id',enrolment.programme_id).order('position')),
    read(client.from('lesson_progress').select('lesson_id,completed_at,position_seconds,max_watched_seconds,last_seen_at').eq('enrolment_id',enrolment.id)),
    read(client.from('submissions').select('lesson_id,response,submitted_at,feedback,score').eq('enrolment_id',enrolment.id)),
    read(client.from('live_sessions').select('id,title,starts_at,join_url').eq('group_id',enrolment.group_id).gte('starts_at',new Date().toISOString()).order('starts_at').limit(8))
  ]);
  return {
    modules: modules.map(m=>({...m,lessons:lessons.filter(l=>l.module_id===m.id)})),
    progress:Object.fromEntries(progress.map(item=>[item.lesson_id,item])),
    submissions:Object.fromEntries(submissions.map(item=>[item.lesson_id,item])),
    sessions
  };
}

export function saveProgress(client, enrolmentId, lessonId, {position=0, highest=position, complete=false} = {}) {
  return read(client.rpc('record_progress',{
    p_enrolment_id:enrolmentId, p_lesson_id:lessonId,
    p_position_seconds:position, p_max_watched_seconds:highest, p_complete:complete
  }));
}

export function submitApplication(client, userId, values) {
  return read(client.from('applications').insert({
    user_id:userId, full_name:values.get('name').trim(), state:values.get('state').trim(),
    motivation:values.get('motivation').trim(), privacy_acknowledged:true
  }));
}

export function submitWork(client, enrolmentId, lessonId, response) {
  return read(client.rpc('submit_assignment',{
    p_enrolment_id:enrolmentId,p_lesson_id:lessonId,p_response:response
  }));
}
