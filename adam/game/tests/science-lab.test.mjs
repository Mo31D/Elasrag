import test from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {fresh} from '../src/progress.js';
import {readScience,SCIENCE_AWARD} from '../public/shared/learning-progress.js';

test('science lab supports prediction, fair comparison, gentle correction and completion',async()=>{
 const window=new Window({url:'https://www.elasrag.com/adam/science/'});
 window.document.body.innerHTML='<main id="app"></main>';
 globalThis.window=window;globalThis.document=window.document;globalThis.localStorage=window.localStorage;
 localStorage.setItem('ala-adventure-v1',JSON.stringify(fresh()));
 await import('../../science/app.js?science-test');
 const click=id=>{const b=document.querySelector(`[data-action="${id}"]`);assert.ok(b,`${id} exists`);b.click()};
 assert.match(document.body.textContent,/dissolving mystery/i);
 click('start');click('predict-sugar');click('test-sugar');click('test-sand');
 assert.ok(document.querySelectorAll('.test.done').length===2);
 click('observed');click('answer-wrong');
 assert.match(document.querySelector('#feedback').textContent,/Dissolving is different from sinking/i);
 click('answer-correct');
 assert.match(document.body.textContent,/Evidence Explorer/);
 assert.equal(readScience(localStorage,'explorer').step,4);
 const a=JSON.parse(localStorage.getItem('ala-adventure-v1')).profiles.explorer;
 assert.equal(a.xp,10);
 assert.ok(a.awards.includes(SCIENCE_AWARD));
 click('restart');click('start');click('predict-sand');click('test-sugar');click('test-sand');click('observed');click('answer-correct');
 const b=JSON.parse(localStorage.getItem('ala-adventure-v1')).profiles.explorer;
 assert.equal(b.xp,10,'Repeating the science experiment never awards a second XP bonus');
});
