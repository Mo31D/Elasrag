export const REQUIRED_COURSES = [
  {
    "id": "required-1",
    "titleEN": "Welcome Antlers – Colleague Induction",
    "titleAR": "تعريف الزملاء الجدد",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-2",
    "titleEN": "Food Safety Training",
    "titleAR": "سلامة الغذاء",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-3",
    "titleEN": "Health & Safety Training",
    "titleAR": "الصحة والسلامة",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-4",
    "titleEN": "Allergy Awareness Recap",
    "titleAR": "مراجعة الوعي بالحساسية",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-5",
    "titleEN": "Customer Experience – The Westmorland Way",
    "titleAR": "تجربة العميل – طريقة Westmorland",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-6",
    "titleEN": "CBE Procedures – Filling Station Colleagues",
    "titleAR": "إجراءات CBE – موظفي محطة الوقود",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-7",
    "titleEN": "Prevention of Sexual Harassment",
    "titleAR": "منع التحرش الجنسي",
    "due": "",
    "status": "not-started",
    "required": true
  }
];
export function initialCompanion() { return {tasks:[],courses:REQUIRED_COURSES.map(course=>({...course}))}; }

export const WEEKDAYS = [
  ['Sunday','الأحد'], ['Monday','الاثنين'], ['Tuesday','الثلاثاء'],
  ['Wednesday','الأربعاء'], ['Thursday','الخميس'], ['Friday','الجمعة'], ['Saturday','السبت']
];
export function shiftDays(value = '') {
  if (/^[0-6](,[0-6])*$/.test(value)) return [...new Set(value.split(',').map(Number))];
  const normalized=value.normalize('NFKD').replace(/[\u064b-\u065f]/g,'').replace(/[أإآ]/g,'ا').toLowerCase();
  return WEEKDAYS.flatMap((names,day)=>names.some(name=>normalized.includes(name.normalize('NFKD').replace(/[أإآ]/g,'ا').toLowerCase()))?[day]:[]);
}
const londonParts = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function londonWall(date) {
  const parts=Object.fromEntries(londonParts.formatToParts(date).map(part=>[part.type,part.value]));
  return Date.UTC(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute);
}
function londonInstant(wall) {
  const candidates=[wall-3600000,wall].filter(candidate=>londonWall(new Date(candidate))===wall);
  return new Date(candidates.length?Math.min(...candidates):wall);
}
export function shiftState(profile, now = new Date()) {
  const days=shiftDays(profile.shiftDays);
  const validTime=value=>/^([01]\d|2[0-3]):[0-5]\d$/.test(value || '');
  if(!days.length || !validTime(profile.shiftStart) || !validTime(profile.shiftEnd) || profile.shiftStart===profile.shiftEnd)return {status:'unset'};
  const minutes=value=>Number(value.slice(0,2))*60+Number(value.slice(3));
  const start=minutes(profile.shiftStart), end=minutes(profile.shiftEnd);
  const wall=londonWall(now); const today=Math.floor(wall/86400000)*86400000;
  const first=/^\d{4}-\d{2}-\d{2}$/.test(profile.startDate || '')?Date.parse(profile.startDate+'T00:00:00Z'):-Infinity;
  const base=Math.max(today-86400000,first);
  const shifts=[];
  for(let i=0;i<9;i++) {
    const date=base+i*86400000;
    if(!days.includes(new Date(date).getUTCDay()))continue;
    const from=londonInstant(date+start*60000),to=londonInstant(date+end*60000+(end<start?86400000:0));
    if(to>now)shifts.push({start:from,end:to});
  }
  const current=shifts.find(shift=>shift.start<=now && now<shift.end);
  const next=shifts.find(shift=>shift.start>now);
  return {status:current?'active':next && Math.floor(londonWall(next.start)/86400000)*86400000===today?'today':'off',current,next};
}
