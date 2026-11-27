import test from 'node:test';
import assert from 'node:assert/strict';
import { radialInput,cameraRelative,smoothAngle,slideMove } from './exploreControls';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8);
test('thumbstick is two axis, capped and dead-zoned',()=>{assert.deepEqual(radialInput(.01,.01),{x:0,y:0});const v=radialInput(1,1);near(Math.hypot(v.x,v.y),1);near(v.x,v.y);});
test('camera-relative motion in all directions and diagonal normalization',()=>{let v=cameraRelative(0,1,0);near(v.x,0);near(v.z,-1);v=cameraRelative(1,0,0);near(v.x,1);near(v.z,0);v=cameraRelative(0,1,Math.PI/2);near(v.x,-1);near(v.z,0);v=cameraRelative(1,1,0);near(Math.hypot(v.x,v.z),1);});
test('angle wraps smoothly and walls allow sideways sliding',()=>{const a=smoothAngle(Math.PI-.02,-Math.PI+.02,.1);assert.ok(a>Math.PI-.02&&a<Math.PI+.02);assert.deepEqual(slideMove(0,0,1,1,(x)=>x>.5),{x:0,z:1});});

import { floatingInput,paceSpeed,sweepMove } from './exploreControls';
test('floating stick starts neutral at any touch origin and moves both axes',()=>{assert.deepEqual(floatingInput({x:100,y:400},{x:100,y:400},43),{x:0,y:0});const v=floatingInput({x:100,y:400},{x:143,y:357},43);assert.ok(v.x>0&&v.y>0);assert.ok(Math.abs(Math.hypot(v.x,v.y)-1)<1e-8);});
test('three distinct movement paces and keyboard sprint',()=>{assert.ok(paceSpeed('walk')<paceSpeed('run'));assert.ok(paceSpeed('run')<paceSpeed('sprint'));assert.equal(paceSpeed('walk',true),paceSpeed('sprint'));});
test('fast movement cannot tunnel through a narrow obstacle',()=>{const r=sweepMove(0,0,1,0,x=>x>.4&&x<.7);assert.ok(r.x<=.4);});

import {EXPLORE_MPH,EXPLORE_SPEED,EXPLORE_JUMP_VELOCITY,EXPLORE_JUMP_HEIGHT,EXPLORE_GRAVITY,secondJumpVelocity,advanceExploreJump} from './exploreControls';
test('exact requested miles-per-hour settings converted to metres per second',()=>{
 assert.deepEqual(EXPLORE_MPH,{walk:10,run:25,sprint:50});
 near(EXPLORE_SPEED.walk,4.4704);near(EXPLORE_SPEED.run,11.176);near(EXPLORE_SPEED.sprint,22.352);
});
test('second jump reaches twice the original apex from early, apex or descending positions',()=>{
 for(const t of [0,.05,EXPLORE_JUMP_VELOCITY/EXPLORE_GRAVITY,.35]){
   const start=13,first=advanceExploreJump(start,EXPLORE_JUMP_VELOCITY,t);
   const vy=secondJumpVelocity(start,first.y),apex=advanceExploreJump(first.y,vy,vy/EXPLORE_GRAVITY);
   near(apex.y,start+2*EXPLORE_JUMP_HEIGHT);near(apex.vy,0);
 }
});
