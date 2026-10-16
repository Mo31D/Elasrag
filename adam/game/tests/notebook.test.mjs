import test from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {fresh,createProfile} from '../src/progress.js';
import {discoverWord,notebookWords,syncCloudSnapshot,cloudXP,collectCloudWord,NOTEBOOK_KEY,CLOUD_SNAPSHOT_KEY} from '../public/shared/notebook.js';
import {learningSummary,resetLocalLearning} from '../public/shared/learning-progress.js';
function setup(){const storage=new Window().localStorage;const state=fresh();createProfile(state,'joseph','Joseph',4);storage.setItem('ala-adventure-v1',JSON.stringify(state));return storage}
const word={word:'curious',definition:'Wanting to find out more.',example:'I felt curious about the clue.'};
const student={id:'cloud-adam',nickname:'Adam',school_year:6};
const lesson={id:'lesson',status:'approved',skill_id:'curious',content:{...word,title:'The curious clue'}};
test('discoveries deduplicate terms across subjects and keep profiles separate',()=>{const s=setup();discoverWord(s,'explorer',word,'Story');discoverWord(s,'explorer',{...word,practised:true},'Word Kingdom');assert.equal(notebookWords(s,'explorer').length,1);assert.deepEqual(notebookWords(s,'explorer')[0].sources,['Story','Word Kingdom']);assert.equal(notebookWords(s,'explorer')[0].practised,true);assert.equal(notebookWords(s,'joseph').length,0);assert.equal(learningSummary(s,'explorer').xp,0)});
test('cloud totals replace their snapshot without duplicate local awards or profile mixing',()=>{const s=setup();const d={students:[student],xp:[{student_id:student.id,amount:7}],lessons:[lesson],progress:[{student_id:student.id,skill_id:'curious'}]};syncCloudSnapshot(s,d);syncCloudSnapshot(s,d);assert.equal(cloudXP(s,'explorer'),7);assert.equal(learningSummary(s,'explorer').xp,7);assert.equal(learningSummary(s,'joseph').xp,0);assert.equal(JSON.parse(s.getItem('ala-adventure-v1')).profiles.explorer.xp,0);assert.equal(notebookWords(s,'explorer')[0].term,'curious');syncCloudSnapshot(s,{...d,xp:[]});assert.equal(cloudXP(s,'explorer'),0)});
test('unapproved or mismatched cloud content never enters another notebook',()=>{const s=setup();assert.equal(collectCloudWord(s,student,{...lesson,status:'pending_review'}),false);assert.equal(collectCloudWord(s,{...student,nickname:'Joseph'},lesson),false);assert.equal(notebookWords(s,'explorer').length,0);collectCloudWord(s,student,lesson);assert.equal(notebookWords(s,'explorer')[0].practised,false)});
test('ambiguous cloud identity contributes no XP',()=>{const s=setup();syncCloudSnapshot(s,{students:[student,{...student,id:'duplicate'}],xp:[{student_id:student.id,amount:7}]});assert.equal(cloudXP(s,'explorer'),0)});
test('ecosystem reset includes discoveries and cloud snapshots',()=>{const s=setup();discoverWord(s,'explorer',word);syncCloudSnapshot(s,{students:[student],xp:[]});resetLocalLearning(s,fresh());assert.equal(s.getItem(NOTEBOOK_KEY),null);assert.equal(s.getItem(CLOUD_SNAPSHOT_KEY),null)});
