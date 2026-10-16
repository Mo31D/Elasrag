// Device-only vocabulary discoveries and read-only cloud XP snapshots.
// Cloud totals replace snapshots; they are never minted again as local awards.
export const SCIENCE_VOCABULARY=Object.freeze([{term:'soluble',definition:'Able to dissolve in a liquid.',example:'Sugar is soluble in water.'},{term:'insoluble',definition:'Unable to dissolve in a particular liquid.',example:'Sand is insoluble in water.'},{term:'conclusion',definition:'An explanation supported by the evidence you collected.',example:'Our conclusion used both observations.'}]);
export const NOTEBOOK_KEY='ala-notebook-v1';
export const CLOUD_SNAPSHOT_KEY='ala-cloud-snapshot-v1';
const read=(s,k)=>{try{return JSON.parse(s.getItem(k))||{}}catch{return {}}};
const clean=(v,max=400)=>typeof v==='string'?v.trim().slice(0,max):'';
export function discoverWord(storage,profileId,word,source='Adventure'){
 if(!/^[a-z0-9-]{3,60}$/.test(profileId)||!word)return false;
 const term=clean(word.term||word.word||word.label,60),definition=clean(word.definition),example=clean(word.example,500);
 if(!/^[a-zA-Z][a-zA-Z '-]{0,59}$/.test(term)||!definition)return false;
 const data=read(storage,NOTEBOOK_KEY);data.version=1;data.learners??={};data.learners[profileId]??={};
 const key=term.toLowerCase(),previous=data.learners[profileId][key];
 data.learners[profileId][key]={term,definition,example,sources:[...new Set([...(previous?.sources||[]),clean(source,100)])],discoveredAt:previous?.discoveredAt||Date.now(),practised:!!(previous?.practised||word.practised)};
 try{storage.setItem(NOTEBOOK_KEY,JSON.stringify(data));return true}catch{return false}
}
export function notebookWords(storage,profileId){
 return Object.values(read(storage,NOTEBOOK_KEY).learners?.[profileId]||{}).filter(w=>w&&typeof w.term==='string'&&typeof w.definition==='string').sort((a,b)=>a.term.localeCompare(b.term,'en-GB'));
}
export function matchingProfile(storage,student){
 const state=read(storage,'ala-adventure-v1');
 const normal=v=>clean(v,60).toLowerCase();
 const candidates=Object.entries(state.profiles||{}).filter(([,p])=>normal(p.displayName)===normal(student.nickname)&&p.year===student.school_year);
 return candidates.length===1?candidates[0][0]:null;
}
export function syncCloudSnapshot(storage,dashboard){
 const snapshots={};
 for(const student of dashboard.students||[]){
  const profileId=matchingProfile(storage,student);if(!profileId)continue;
  const xp=(dashboard.xp||[]).filter(x=>x.student_id===student.id&&Number.isFinite(x.amount)).reduce((sum,x)=>sum+x.amount,0);
  // Ambiguous cloud profiles must not silently merge into one local explorer.
  if(snapshots[profileId]){snapshots[profileId]={ambiguous:true,xp:0};continue;}
  snapshots[profileId]={studentId:student.id,xp:Math.max(0,xp),syncedAt:Date.now()};
 }
 try{storage.setItem(CLOUD_SNAPSHOT_KEY,JSON.stringify({version:1,learners:snapshots}))}catch{}
 for(const student of dashboard.students||[]){
  const profileId=matchingProfile(storage,student);if(!profileId||snapshots[profileId]?.ambiguous)continue;
  const progress=(dashboard.progress||[]).filter(p=>p.student_id===student.id);
  for(const lesson of dashboard.lessons||[]){
   if(lesson.status==='approved'&&typeof lesson.skill_id==='string'&&lesson.content?.word&&progress.some(p=>p.skill_id===lesson.skill_id))
    discoverWord(storage,profileId,{...lesson.content,practised:true},lesson.content.title||'English expedition');
  }
 }
}
export function cloudXP(storage,profileId){const item=read(storage,CLOUD_SNAPSHOT_KEY).learners?.[profileId];return Number.isFinite(item?.xp)?Math.max(0,item.xp):0;}
export function collectCloudWord(storage,student,lesson,practised=false){
 const profileId=matchingProfile(storage,student);if(!profileId||lesson.status!=='approved')return false;
 return discoverWord(storage,profileId,{...lesson.content,practised},lesson.content?.title||'English expedition');
}
