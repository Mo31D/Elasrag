import test from 'node:test';
import assert from 'node:assert/strict';
import {Diffusion,Osmosis,ActiveTransport} from '../simulations.js';
test('Diffusion particles are conserved',()=>{const m=new Diffusion({left:80,right:10});for(let i=0;i<1500;i++)m.step(.02);assert.equal(m.left+m.right,90);assert.equal(m.particles.length,90)});
test('Diffusion particles remain moving under approximate balance',()=>{const m=new Diffusion({left:25,right:25,barrier:'none'});const x=m.particles[0].x;for(let i=0;i<20;i++)m.step(.02);assert.notEqual(m.particles[0].x,x)});
test('Osmosis solute stays unchanged and water conserved',()=>{const m=new Osmosis({leftSolute:5,rightSolute:25});for(let i=0;i<1300;i++)m.step(.02);assert.equal(m.waterL+m.waterR,160);assert.equal(m.config.leftSolute,5);assert.equal(m.config.rightSolute,25)});
test('Active transport requires respiration energy and conserves ions',()=>{const m=new ActiveTransport({outside:15,inside:50,energy:0});for(let i=0;i<500;i++)m.step(.02);assert.equal(m.total,0);m.set('energy',80);for(let i=0;i<500;i++)m.step(.02);assert(m.total>0);assert.equal(m.inside+m.outside,65)});
test('Active transport has no uptake with zero substrate',()=>{const m=new ActiveTransport({outside:0,inside:20,energy:100});for(let i=0;i<500;i++)m.step(.02);assert.equal(m.total,0)});

