import test from 'node:test';import assert from 'node:assert/strict';import {fleeDirection,nextWalkDistance} from './crowdMotion';
test('birds turn away from humans and respond to dogs at larger radius',()=>{assert.equal(fleeDirection(0,0,[{x:4,z:0,radius:3}]),null);const f=fleeDirection(0,0,[{x:4,z:0,radius:6}])!;assert.ok(f.alarm>0);assert.ok(Math.sin(f.yaw)>.99);});
test('walkers remain within their mapped path and turn at ends',()=>{let s=nextWalkDistance(9.9,1,1,.5,10);assert.equal(s.distance,10);assert.equal(s.dir,-1);s=nextWalkDistance(.1,-1,1,.5,10);assert.equal(s.distance,0);assert.equal(s.dir,1);});

import {hullClearance,forecastRisk,chooseRefuge,rememberedAlarm,safeTrafficThrottle} from './crowdMotion';
const bus={x:0,z:0,yaw:0,halfWidth:1.26,halfLength:5.1,eta:0};
test('predictive awareness uses the full vehicle hull, including the rear and future path',()=>{
 assert.ok(hullClearance(0,4,bus)<0);assert.ok(hullClearance(3,0,bus)>1);
 const future=[bus,{...bus,z:-12,eta:2}];assert.ok(forecastRisk(0,-12,future)>.5);
 const safe=chooseRefuge(0,-12,[{x:3.4,z:-12,offset:3.4},{x:0,z:-11,offset:0}],future,()=>true);
 assert.equal(safe?.x,3.4);assert.equal(chooseRefuge(0,-12,[{x:3.4,z:-12,offset:3.4}],future,()=>false),null);
});
test('traffic yields before contact and alarms decay rather than flicker',()=>{
 assert.equal(safeTrafficThrottle(1,0,6),0);assert.ok(safeTrafficThrottle(1,5,6)<1);assert.equal(safeTrafficThrottle(1,100,6),1);
 assert.ok(rememberedAlarm(1,0,.1)>.9);assert.equal(rememberedAlarm(0,.8,.1),.8);
});
