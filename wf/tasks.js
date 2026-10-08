// Date-only scheduling in Europe/London. Reminders are in-app only.
export const TASK_REPEAT = ['none', 'daily', 'weekly', 'monthly'];
export const TASK_REMINDER = ['none', 'on-day', 'day-before'];
const DAY = 86400000;
const uk = new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/London', year:'numeric', month:'2-digit', day:'2-digit'});
export function taskToday(now = new Date()) {
  const parts = Object.fromEntries(uk.formatToParts(now).map(({type,value})=>[type,value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function taskValidDate(date) {
  return typeof date==='string' && /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0,10)===date;
}
const ms = str => Date.parse(str+'T00:00:00Z');
const dateOf = time => new Date(time).toISOString().slice(0,10);
function monthOccurrence(anchor, interval) {
  const [y,m,d]=anchor.split('-').map(Number);
  const first = new Date(Date.UTC(y,m-1+interval,1));
  const last = new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
  return new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth(),Math.min(d,last))).toISOString().slice(0,10);
}
export function taskOccurrence(task, today = taskToday()) {
  const due=task.due || '';
  if(!taskValidDate(due))return {due:'',completed:!!task.done,next:''};
  const repeat=task.repeat || 'none';
  if(repeat==='none')return {due,completed:!!task.done,next:''};
  if(!TASK_REPEAT.includes(repeat))return {due:'',completed:false,next:''};
  const elapsed=ms(today)-ms(due);
  let count=0;
  if(elapsed>0) {
    if(repeat==='daily')count=Math.floor(elapsed/DAY);
    else if(repeat==='weekly')count=Math.floor(elapsed/(7*DAY));
    else if(repeat==='monthly') {
      const [ay,am]=due.split('-').map(Number), [ty,tm]=today.split('-').map(Number);
      count=Math.max(0,(ty-ay)*12+tm-am);
      if(monthOccurrence(due,count)>today)count--;
    }
  }
  const on = n=> repeat==='monthly' ? monthOccurrence(due,n) : dateOf(ms(due)+n*(repeat==='daily'?1:7)*DAY);
  const current=on(count);
  const completed=task.lastCompleted === current;
  return { due:current, completed, next: completed ? on(count+1) : '', repeat };
}
export function taskDisplayDate(task,today=taskToday()) {
  const current=taskOccurrence(task,today);
  return current.next || current.due;
}
export function taskReminderAlert(task,today=taskToday()) {
  if (!task.due || !task.reminder || task.reminder==='none')return null;
  const state=taskOccurrence(task,today);
  if(state.completed)return null;
  const days=Math.round((ms(state.due)-ms(today))/DAY);
  if(days>(task.reminder==='day-before'?1:0))return null;
  return {kind:'task',task,days,due:state.due};
}
