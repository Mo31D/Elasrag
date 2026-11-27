import test from 'node:test';import assert from 'node:assert/strict';import {ANIMALS,canTakeOff,flightEnergy,feedAllowed,turnTowards} from './animalMotion';
test('species takeoff and feeding rules',()=>{assert.equal(canTakeOff('sheep',100,100),false);assert.equal(canTakeOff('dog',100,100),false);assert.equal(canTakeOff('swan',2,65),false);assert.equal(canTakeOff('swan',24,65),true);assert.equal(canTakeOff('mallard',2,42),true);assert.equal(canTakeOff('mallard',2,0),false);assert.equal(flightEnergy(1,2,true,42),0);assert.equal(flightEnergy(40,3,false,42),42);assert.equal(feedAllowed('sheep',true,false,0),false);assert.equal(feedAllowed('mallard',true,false,0),true);assert.equal(feedAllowed('swan',false,true,0),false);assert.ok(turnTowards(0,Math.PI,1,.1)<=.1);assert.ok(ANIMALS.swan.mass>ANIMALS.mallard.mass);});

import {flightDemand} from './animalMotion';
test('flight power follows deliberate input and is zero when controls are released',()=>{assert.equal(flightDemand(0,0),0);assert.equal(flightDemand(.25,0),.25);assert.ok(flightDemand(0,1)>0);assert.equal(flightDemand(3,0),1);});

import * as THREE from 'three';
import {AnimalPlayer,type BirdFlightPose} from '../engine/animalPlayer';
test('single button launches both playable bird species from land or water with no directional input',()=>{
 for(const kind of ['mallard','swan'] as const)for(const wet of [false,true]){
  const root=new THREE.Group();root.position.y=wet?-.08:0;
  const poses:(BirdFlightPose|undefined)[]=[];
  const bird=new AnimalPlayer({root,kind,pose:(_t,_s,_w,_a,_f,pose)=>poses.push(pose)},{wet:()=>wet,floor:()=>0,solid:()=>-Infinity,blocked:()=>false,ripple:()=>{}});
  const start=bird.y;bird.toggleFlight();
  assert.equal(bird.air,true);assert.ok(bird.y>start);assert.equal(poses.at(-1),'takeoff');
  for(let i=0;i<30;i++)bird.update(1/60,0,0,0,false,0);
  assert.ok(bird.y>start+.8);assert.ok(bird.speed>0);assert.equal(bird.air,true);
  for(let i=0;i<120;i++)bird.update(1/60,0,0,0,false,0);
  assert.equal(poses.at(-1),'glide');assert.ok(bird.air);
  bird.toggleFlight();bird.update(1/60,0,0,0,false,0);
  assert.equal(poses.at(-1),'landing');
 }
});
