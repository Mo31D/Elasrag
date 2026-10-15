// Single same-origin local learning ledger shared by Atlas, Word Kingdom and Science.
// Remote Supabase records are deliberately not touched by this browser-only module.
export const ADVENTURE_KEY = 'ala-adventure-v1';
export const WORDS_KEY = 'ala-word-kingdom-v1';
export const SCIENCE_KEY = 'ala-science-lab-v1';
export const LOCAL_RESET_KEYS = Object.freeze([
  ADVENTURE_KEY, WORDS_KEY, SCIENCE_KEY, 'ala-approved-missions-v1', 'ala-lesson'
]);
export const SCIENCE_AWARD = 'science:dissolving-001';
const validProfile = id => typeof id === 'string' && /^[a-z0-9-]{3,60}$/.test(id);
const parse = text => { try {return JSON.parse(text)} catch {return null} };
const freshLab = () => ({step:0,prediction:null,tests:{},attempts:0,completed:false});
export function readScience(storage, profileId) {
  if (!validProfile(profileId)) return freshLab();
  const saved = parse(storage.getItem(SCIENCE_KEY));
  const entry = saved?.version === 2 ? saved.learners?.[profileId] : 
    profileId === 'explorer' && saved?.version !== 2 ? saved : null;
  if (!entry || !Number.isInteger(entry.step)) return freshLab();
  return {...freshLab(),...entry,tests:entry.tests && typeof entry.tests === 'object' ? entry.tests : {}};
}
export function writeScience(storage, profileId, progress) {
  if (!validProfile(profileId)) return false;
  const previous = parse(storage.getItem(SCIENCE_KEY));
  const learners = previous?.version===2 && previous.learners && typeof previous.learners==='object'
    ? {...previous.learners} : {};
  // Preserve legacy single-student state during upgrade.
  if (previous && previous.version!==2 && !learners.explorer && Number.isInteger(previous.step))
    learners.explorer = {...freshLab(),...previous};
  learners[profileId] = {...freshLab(),...progress};
  storage.setItem(SCIENCE_KEY,JSON.stringify({version:2,learners}));
  return true;
}
export function creditLearning(storage, {profileId, awardId, amount, subject}) {
  if (!validProfile(profileId)||!/^((science|word):[a-z0-9:-]+)$/.test(awardId)||
      !['science','words'].includes(subject) || !Number.isInteger(amount)||amount<1||amount>20)
    return {awarded:false,reason:'invalid'};
  let latest; try {latest=parse(storage.getItem(ADVENTURE_KEY))} catch {return {awarded:false,reason:'storage'};}
  if(!latest || latest.version!==1 || !latest.profiles?.[profileId])
    return {awarded:false,reason:'profile-unavailable'};
  const p=latest.profiles[profileId];
  if(!Array.isArray(p.awards)||!Number.isFinite(p.xp)||p.awards.includes(awardId))
    return {awarded:false,reason:'duplicate-or-invalid',xp:p.xp};
  const now=Date.now();
  p.awards.push(awardId);
  p.xp+=amount;
  p.events ??=[];
  p.events.push({id:now+'-'+p.events.length,type:'xp_awarded',at:now,xp:amount,mission:awardId,subject});
  if(p.events.length>500)p.events.splice(0,p.events.length-500);
  try {storage.setItem(ADVENTURE_KEY,JSON.stringify(latest))} 
  catch {return {awarded:false,reason:'storage'};}
  return {awarded:true,amount,xp:p.xp};
}
export function learningSummary(storage, profileId) {
  const s=parse(storage.getItem(ADVENTURE_KEY));
  const p=s?.profiles?.[profileId];
  const awards=Array.isArray(p?.awards)?p.awards:[];
  const word=parse(storage.getItem(WORDS_KEY))?.learners?.[profileId];
  const math=Array.isArray(p?.run?.maths)?p.run.maths:(profileId===s?.activeProfile?s?.maths:[]);
  return {
    xp:Number.isFinite(p?.xp)?p.xp:0,
    mathsSolved:math.length,
    scienceCompleted:readScience(storage,profileId).step>=4,
    wordStars:Number.isFinite(word?.stars)?word.stars:0,
    masteredWords:awards.filter(id=>id.startsWith('word:mastered:')).length,
    scienceXP:awards.includes(SCIENCE_AWARD) ? 10 : 0
  };
}
export function resetLocalLearning(storage, freshAdventure) {
  // Reset all registered *local* learning data, for every explorer on this device.
  // Does NOT claim to delete private backups, Supabase learning records, or auth.
  for(const key of LOCAL_RESET_KEYS) storage.removeItem(key);
  storage.setItem(ADVENTURE_KEY,JSON.stringify(freshAdventure));
  return LOCAL_RESET_KEYS;
}
