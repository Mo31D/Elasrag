import test from 'node:test';
import assert from 'node:assert/strict';
import { radialInput,cameraRelative,smoothAngle,slideMove } from './exploreControls';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8);
test('thumbstick is two axis, capped and dead-zoned',()=>{assert.deepEqual(radialInput(.01,.01),{x:0,y:0});const v=radialInput(1,1);near(Math.hypot(v.x,v.y),1);near(v.x,v.y);});
test('camera-relative motion in all directions and diagonal normalization',()=>{let v=cameraRelative(0,1,0);near(v.x,0);near(v.z,-1);v=cameraRelative(1,0,0);near(v.x,1);near(v.z,0);v=cameraRelative(0,1,Math.PI/2);near(v.x,-1);near(v.z,0);v=cameraRelative(1,1,0);near(Math.hypot(v.x,v.z),1);});
test('angle wraps smoothly and walls allow sideways sliding',()=>{const a=smoothAngle(Math.PI-.02,-Math.PI+.02,.1);assert.ok(a>Math.PI-.02&&a<Math.PI+.02);assert.deepEqual(slideMove(0,0,1,1,(x)=>x>.5),{x:0,z:1});});
