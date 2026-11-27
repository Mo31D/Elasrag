import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createRunnerModel,animateRunnerRig} from '../engine/models';
test('wingsuit deploys horizontally with spread arms, follows rig and retracts on exit',()=>{
 const rig=createRunnerModel(new THREE.Texture());
 const p={stridePhase:0,speedMps:12,isAirborne:true,isSliding:false,isGrinding:false,steerTilt:.2,squashY:1,time:1,dt:.25};
 assert.equal(rig.flightSuit.visible,false);
 animateRunnerRig(rig,{...p,flying:true});animateRunnerRig(rig,{...p,flying:true});
 assert.equal(rig.flightSuit.visible,true);assert.equal(rig.contactShadow.visible,false);
 assert.ok(rig.bodyPivot.rotation.x<-1.2);assert.ok(rig.leftArm.rotation.z<-1&&rig.rightArm.rotation.z>1);
 const a=rig.flightSuit.geometry.attributes.position;assert.equal(a.count,24);
 assert.ok(Array.from(a.array).every(Number.isFinite));assert.ok(a.getX(1)<-.5);
 animateRunnerRig(rig,{...p,flying:false,isAirborne:false});
 assert.equal(rig.flightSuit.visible,false);assert.equal(rig.contactShadow.visible,true);assert.equal(rig.leftLeg.rotation.z,0);
});
