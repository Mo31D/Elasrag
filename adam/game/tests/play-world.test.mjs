import test from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {worldMarkup,mountValueForge} from '../src/play-world.js';
import {wordScene,PLAY_ART} from '../public/shared/play-art.js';
import {readFile} from 'node:fs/promises';

test('world destinations and explorer tools reflect real completed learning, with escaped content',()=>{
 const win=new Window();const host=win.document.createElement('main');
 const props={name:'<Adam>',done:false,missionStep:0,mathsDone:0,mathsTotal:14,scienceComplete:false,wordStars:0,reviews:0,cloudMissions:[],custom:null};
 host.innerHTML=worldMarkup(props);
 assert.equal(host.querySelectorAll('.world-site').length,4);
 assert.equal(host.querySelectorAll('.kit-slots .earned').length,0);
 assert.equal(host.querySelector('h1').textContent,'Where next, <Adam>?');
 assert.equal(host.querySelectorAll('adam').length,0);
 host.innerHTML=worldMarkup({...props,done:true,mathsDone:1,scienceComplete:true,wordStars:2,cloudMissions:[{id:'case-2',title:'A new case'}]});
 assert.equal(host.querySelectorAll('.kit-slots .earned').length,4);
 assert.ok(host.querySelector('[data-action="cloud-mission:case-2"]'));
 assert.match(host.querySelector('.mystery-card').textContent,/Case solved/);
 assert.equal(host.querySelector('[data-action="daily"]').textContent,'Continue today’s adventure →');
});

test('visual base-ten choices select values without submitting or recording progress',()=>{
 const win=new Window();const host=win.document.createElement('div');let selected=[];
 const storageBefore=win.localStorage.length;
 mountValueForge(host,{digit:4},value=>selected.push(value));
 assert.deepEqual([...host.querySelectorAll('[data-value]')].map(b=>Number(b.dataset.value)),[4,40,400,4000]);
 for(const b of host.querySelectorAll('button'))assert.equal(b.type,'button');
 assert.equal(host.querySelectorAll('.block-1 i').length,10);
 assert.equal(host.querySelectorAll('.block-2 i').length,100);
 host.querySelector('[data-value="40"]').click();host.querySelector('[data-value="400"]').click();
 assert.deepEqual(selected,[40,400]);
 assert.equal(host.querySelectorAll('[aria-pressed="true"]').length,1);
 assert.equal(host.querySelector('[aria-pressed="true"]').dataset.value,'400');
 assert.match(host.querySelector('output').textContent,/400 selected/);
 assert.equal(win.localStorage.length,storageBefore);
});

test('only reviewed vocabulary contexts receive story artwork and arbitrary CSS is rejected',()=>{
 assert.match(wordScene({term:'RELIEVED'}),/finds his lost dog safe/);
 assert.match(wordScene({term:'notice'}),/word-scene-notice/);
 assert.doesNotMatch(wordScene({term:'notice'}),/style=/);
 assert.equal(wordScene({term:'constructor'}),'');
 assert.equal(wordScene({term:'fraction'}),'');
 assert.doesNotMatch(wordScene({term:'notice'},'x" onclick="alert(1)'),/onclick=/);
 assert.match(PLAY_ART.world,/^\/adam\/assets\/play\/.+\.webp$/);
});

test('word context styling is self-hosted and works without weakening the strict CSP',async()=>{
 const html=await readFile(new URL('../../words/index.html',import.meta.url),'utf8');
 const css=await readFile(new URL('../public/shared/play-art.css',import.meta.url),'utf8');
 assert.match(html,/style-src 'self';/);
 assert.doesNotMatch(html,/unsafe-inline/);
 assert.match(html,/shared\/play-art\.css/);
 for(const term of ['notice','puzzled','investigate','relieved','curious','confident']){
  assert.match(wordScene({term}),new RegExp('word-scene-'+term));
  assert.ok(css.includes('.word-scene-'+term+'{'));
  assert.doesNotMatch(wordScene({term}),/style=/);
 }
});
