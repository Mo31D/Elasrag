import { WORDS,STAGES } from '../words-data.js';
const BASE='https://uyfaipjthpsofjqcucop.supabase.co';
const KEY='sb_publishable_TuBLFUT9rEIw7dVwXf0WeA_PZxtbQAt';
const SESSION='ala-word-studio-session';
let token=null,refreshToken=null,expires=0,busy=false;
const byId=id=>document.getElementById(id);
const notice=text=>byId('notice').textContent=text;
const readWord=()=>WORDS.find(w=>w.id===byId('word').value);
const valid=()=>token && Date.now()<expires;
function setBusy(value){
 busy=value;
 for(const id of ['check','generate','preview','approve'])byId(id).disabled=value;
}
function resetPlayer(){byId('preview-player').pause();byId('preview-player').removeAttribute('src');byId('preview-player').hidden=true;byId('approve').hidden=true;}
function populateStages(){STAGES.forEach((s,i)=>{const opt=new Option(s,String(i));byId('stage').add(opt)});populateWords();}
function populateWords(){
 const stage=byId('stage').value;
 const selected=byId('word').value;
 const words=WORDS.filter(w=>stage==='all'||w.stage===Number(stage)).sort((a,b)=>a.term.localeCompare(b.term,'en-GB'));
 byId('word').replaceChildren(...words.map(w=>new Option(w.term+' · '+STAGES[w.stage],w.id)));
 if(words.some(w=>w.id===selected))byId('word').value=selected;
 changed();
}
function changed(){resetPlayer();const w=readWord();byId('selected-example').textContent=w?w.example:'';byId('audio-status').textContent='Status not checked yet.';}
const saveSession=()=>{try{localStorage.setItem(SESSION,JSON.stringify({token,refreshToken,expires}))}catch{}}
const clearSession=()=>{try{localStorage.removeItem(SESSION)}catch{}}
async function renew(){
 if(!refreshToken)return false;
 const response=await fetch(BASE+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:KEY,'content-type':'application/json'},body:JSON.stringify({refresh_token:refreshToken}),signal:AbortSignal.timeout(12000)});
 const data=await response.json().catch(()=>({}));
 if(!response.ok||!data.access_token){clearSession();return false;}
 token=data.access_token;refreshToken=data.refresh_token||refreshToken;expires=Date.now()+Math.min(Number(data.expires_in||3600)*1000,3500000);saveSession();return true;
}
async function api(action){
 if(!valid()&&!(await renew())){logout();throw Error('Session expired. Please sign in again.');}
 const w=readWord();if(!w)throw Error('Choose a word.');
 const response=await fetch(BASE+'/functions/v1/word-voice',{
  method:'POST',headers:{'apikey':KEY,'authorization':'Bearer '+token,'content-type':'application/json'},
  body:JSON.stringify({action,wordId:w.id,variant:byId('variant').value}),signal:AbortSignal.timeout(65000)
 });
 const value=await response.json().catch(()=>({error:'invalid_server_response'}));
 if(!response.ok)throw Error(value.error||'Voice server unavailable');
 return value;
}
async function run(action){
 if(busy)return;setBusy(true);notice('');
 try{
  const data=await api(action);
  const state=data.status;
  byId('audio-status').textContent=state==='approved'?'Approved voice is available for the dictionary.':state==='pending'?'Audio generated. Listen and approve if the accent and words are correct.':state==='reserved'?'Audio is still being processed. Try Check status shortly.':state==='failed'?'This clip failed. It will not be regenerated or billed automatically.':state==='not_generated'?'No Google voice recording yet. Generate it if you want.':String(state);
  const playable=data.previewUrl||data.playbackUrl;
  if(playable){byId('preview-player').src=playable;byId('preview-player').hidden=false;}
  if(state==='pending'){byId('approve').hidden=false;byId('approve').disabled=true;
    byId('preview-player').addEventListener('ended',()=>{if(!busy)byId('approve').disabled=false},{once:true});}
  if(action==='approve'&&state==='approved'){byId('approve').hidden=true;notice('The approved recording is now available in Word Kingdom.');}
 }catch(error){notice('Audio Studio: '+String(error.message||error));}
 finally{setBusy(false);if(byId('approve').hidden===false)byId('approve').disabled=true;}
}
function logout(){token=null;refreshToken=null;expires=0;clearSession();byId('parent-password').value='';byId('workshop').hidden=true;byId('sign-in').hidden=false;resetPlayer();}
byId('login-form').addEventListener('submit',async event=>{
 event.preventDefault();notice('Signing in…');
 const email=byId('parent-email').value.trim(),password=byId('parent-password').value;
 if(!email||!password)return;
 try{
  const response=await fetch(BASE+'/auth/v1/token?grant_type=password',{
   method:'POST',headers:{apikey:KEY,'content-type':'application/json'},
   body:JSON.stringify({email,password}),signal:AbortSignal.timeout(12000)
  });
  const data=await response.json();
  if(!response.ok||!data.access_token)throw Error('Unable to sign in. Check your parent credentials.');
  token=data.access_token;refreshToken=data.refresh_token||null;expires=Date.now()+Math.min(Number(data.expires_in||3600)*1000,3500000);saveSession();
  const r=await api('status');
  byId('sign-in').hidden=true;byId('workshop').hidden=false;byId('parent-password').value='';
  notice('Parent session verified. Voice requests require your explicit action.');
 }catch(error){logout();notice(String(error.message||error));}
});
byId('logout').addEventListener('click',logout);
byId('stage').addEventListener('change',populateWords);
byId('word').addEventListener('change',changed);
byId('variant').addEventListener('change',changed);
for(const id of ['check','generate','preview','approve']){
 byId(id).addEventListener('click',()=>run(id==='check'?'status':id));
}
window.addEventListener('pagehide',resetPlayer);
async function restoreSession(){
 try{
  const saved=JSON.parse(localStorage.getItem(SESSION)||'null');
  if(!saved?.refreshToken)return;
  token=saved.token||null;refreshToken=saved.refreshToken;expires=Number(saved.expires)||0;
  if(!valid()&&!(await renew()))return logout();
  await api('status');byId('sign-in').hidden=true;byId('workshop').hidden=false;notice('Trusted-device parent session restored. Use Sign out on a shared device.');
 }catch{logout();}
}
populateStages();
restoreSession();
