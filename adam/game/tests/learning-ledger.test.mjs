import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { fresh } from '../src/progress.js';
import {
  creditLearning, readScience, writeScience, resetLocalLearning,
  learningSummary, SCIENCE_AWARD, ADVENTURE_KEY, WORDS_KEY, SCIENCE_KEY
} from '../public/shared/learning-progress.js';
import { readFile } from 'node:fs/promises';

const makeStorage=()=>new Window({url:'https://www.elasrag.com/adam/'}).localStorage;
test('maths and legacy adventure awards coexist with exactly-once Science/Word XP',()=>{
 const storage=makeStorage();const state=fresh();
 state.profiles.explorer.xp=20;state.profiles.explorer.awards=['maths:original'];
 storage.setItem(ADVENTURE_KEY,JSON.stringify(state));
 let result=creditLearning(storage,{profileId:'explorer',awardId:SCIENCE_AWARD,amount:10,subject:'science'});
 assert.equal(result.awarded,true);assert.equal(result.xp,30);
 result=creditLearning(storage,{profileId:'explorer',awardId:SCIENCE_AWARD,amount:10,subject:'science'});
 assert.equal(result.awarded,false);
 result=creditLearning(storage,{profileId:'explorer',awardId:'word:mastered:apple',amount:3,subject:'words'});
 assert.equal(result.xp,33);
 result=creditLearning(storage,{profileId:'explorer',awardId:'word:mastered:apple',amount:3,subject:'words'});
 assert.equal(result.awarded,false);
 assert.equal(JSON.parse(storage.getItem(ADVENTURE_KEY)).profiles.explorer.xp,33);
 assert.equal(learningSummary(storage,'explorer').scienceXP,10);
 assert.equal(learningSummary(storage,'explorer').masteredWords,1);
});
test('a learner cannot gain someone else’s rewards and lab state is profile-specific',()=>{
 const storage=makeStorage();const state=fresh();
 state.profiles.joseph={...structuredClone(state.profiles.explorer),displayName:'Joseph',year:4};
 storage.setItem(ADVENTURE_KEY,JSON.stringify(state));
 writeScience(storage,'explorer',{step:4,completed:true,tests:{sugar:true,sand:true}});
 writeScience(storage,'joseph',{step:2,tests:{sugar:true}});
 assert.equal(readScience(storage,'explorer').step,4);
 assert.equal(readScience(storage,'joseph').step,2);
 creditLearning(storage,{profileId:'joseph',awardId:SCIENCE_AWARD,amount:10,subject:'science'});
 assert.equal(learningSummary(storage,'explorer').xp,0);
 assert.equal(learningSummary(storage,'joseph').xp,10);
});
test('legacy science progress upgrades without erasing the active student',()=>{
 const storage=makeStorage();
 storage.setItem(SCIENCE_KEY,JSON.stringify({step:3,prediction:'sugar',tests:{sugar:true},attempts:1}));
 assert.equal(readScience(storage,'explorer').step,3);
 writeScience(storage,'explorer',{step:4,completed:true});
 assert.equal(readScience(storage,'explorer').step,4);
 assert.equal(JSON.parse(storage.getItem(SCIENCE_KEY)).version,2);
});
test('reset clears the entire registered local learning ecosystem, for every profile',()=>{
 const storage=makeStorage();
 const state=fresh();
 state.profiles.explorer.xp=40;
 state.profiles.joseph={...structuredClone(state.profiles.explorer),xp:20};
 storage.setItem(ADVENTURE_KEY,JSON.stringify(state));
 storage.setItem(WORDS_KEY,JSON.stringify({version:1,learners:{explorer:{stars:8},joseph:{stars:4}}}));
 writeScience(storage,'explorer',{step:4});
 writeScience(storage,'joseph',{step:3});
 storage.setItem('ala-approved-missions-v1','[{"id":"dummy"}]');
 storage.setItem('ala-lesson','{}');
 storage.setItem('external-user-data','must remain');
 const freshState=fresh();
 resetLocalLearning(storage,freshState);
 assert.deepEqual(JSON.parse(storage.getItem(ADVENTURE_KEY)),freshState);
 for(const key of [WORDS_KEY,SCIENCE_KEY,'ala-approved-missions-v1','ala-lesson'])
   assert.equal(storage.getItem(key),null);
 assert.equal(storage.getItem('external-user-data'),'must remain');
});
test('atlas cards use natural document flow instead of brittle absolute deck height',async()=>{
 const css=await readFile(new URL('../src/style.css',import.meta.url),'utf8');
 const rules=css.slice(css.indexOf('/* ATLAS V2:'));
 assert.match(rules,/\.game\.map \.atlas\s*{[\s\S]*?overflow:\s*visible/);
 assert.match(rules,/\.game\.map \.adventure-deck\s*{[\s\S]*?position:\s*relative/);
 assert.match(rules,/\.game\.map \.map-bottom\s*{[\s\S]*?position:\s*relative/);
 assert.match(rules,/grid-template-columns:\s*minmax\(0,1fr\)/);
 assert.match(rules,/prefers-reduced-motion/);
});
