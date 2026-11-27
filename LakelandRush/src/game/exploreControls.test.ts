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

import {flightHeight} from './exploreControls';
test('V14 doubles original single jump height and doubles it again with second press',()=>{
 near(EXPLORE_JUMP_HEIGHT,2*5.8**2/(2*EXPLORE_GRAVITY));
 const v=secondJumpVelocity(10,10+EXPLORE_JUMP_HEIGHT);near(10+EXPLORE_JUMP_HEIGHT+v*v/(2*EXPLORE_GRAVITY),10+2*EXPLORE_JUMP_HEIGHT);
});
test('flight holds altitude, climbs, descends and remains above surfaces',()=>{near(flightHeight(20,0,.5,10),20);near(flightHeight(20,1,.5,10),26);near(flightHeight(20,-1,.5,10),14);near(flightHeight(12,-1,1,10),11.25);near(flightHeight(190,1,1,10),190);});

import {fixedStickHit} from './exploreControls';
test('fixed joystick stays centred and rejects touches outside the visible disc',()=>{
 const rect={left:22,top:480,width:110,height:110};
 assert.deepEqual(fixedStickHit(rect,{x:77,y:535}),{x:77,y:535});
 assert.deepEqual(fixedStickHit(rect,{x:100,y:530}),{x:77,y:535});
 assert.equal(fixedStickHit(rect,{x:77,y:400}),null);
 assert.equal(fixedStickHit(rect,{x:23,y:481}),null);
 const origin=fixedStickHit(rect,{x:77,y:535})!;
 assert.deepEqual(floatingInput(origin,{x:77,y:535},32),{x:0,y:0});
 const v=floatingInput(origin,{x:110,y:535},32);near(v.x,1);near(v.y,0);
});

import {floatingStickOrigin} from './exploreControls';
test('lower-left floating zone accepts arbitrary touches on tablet and phone, starts neutral and keeps disc visible',()=>{
 for(const [w,h] of [[1024,768],[768,1024],[390,650]]){
  const rect={left:0,top:h/2,width:w/2,height:h/2};
  for(const point of [{x:2,y:h/2+2},{x:w/4,y:h*.76},{x:w/2-2,y:h-2}]){
   const origin=floatingStickOrigin(rect,point)!;assert.ok(origin);assert.deepEqual(floatingInput(origin.input,point,32),{x:0,y:0});
   assert.ok(origin.visual.x>=55&&origin.visual.x<=rect.width-55);assert.ok(origin.visual.y>=55&&origin.visual.y<=rect.height-55);
   const v=floatingInput(origin.input,{x:point.x,y:point.y-35},32);near(v.y,1);near(v.x,0);
  }
  assert.equal(floatingStickOrigin(rect,{x:w/2+1,y:h*.75}),null);assert.equal(floatingStickOrigin(rect,{x:w/4,y:h/2-1}),null);
 }
});
