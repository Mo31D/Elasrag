import {test} from 'node:test';
import assert from 'node:assert/strict';
import {surfaceMode,boatFits,stepBoat,boatExit} from './waterNavigation';
test('water entry, landing, deck and flight transitions',()=>{
 assert.equal(surfaceMode('land',true,false,2,false),'land');
 assert.equal(surfaceMode('land',true,false,.1,false),'swimming');
 assert.equal(surfaceMode('swimming',false,false,-.6,false),'land');
 assert.equal(surfaceMode('land',true,true,0,false),'land');
 assert.equal(surfaceMode('swimming',true,false,0,true),'land');
});
test('rowing accelerates, coasts and stays within water',()=>{
 const wet=(x:number,z:number)=>Math.abs(x)<10&&Math.abs(z)<10&&z>-8;
 let b={x:0,z:0,yaw:0,speed:0};
 for(let i=0;i<300;i++){b=stepBoat(b,0,1,.04,wet);assert.ok(boatFits(b.x,b.z,b.yaw,wet));}
 assert.ok(b.z<-1&&b.z>-8);assert.equal(b.speed,0);
 assert.ok(boatExit(b,wet));assert.equal(boatExit(b,()=>false),null);
});
test('steering and coasting',()=>{
 const wet=()=>true,b=stepBoat({x:0,z:0,yaw:0,speed:0},1,1,.04,wet);
 assert.ok(b.yaw<0&&b.speed>0);assert.ok(stepBoat(b,0,0,.04,wet).speed<b.speed);
});

test('motor launch has larger collision envelope and different acceleration',()=>{
 const wet=(x:number,z:number)=>Math.abs(x)<1.05&&Math.abs(z)<3.1;
 assert.ok(boatFits(0,0,0,wet,'rowboat'));assert.ok(!boatFits(0,0,0,wet,'motorboat'));
 let row={x:0,z:0,yaw:0,speed:0},motor={...row};for(let i=0;i<100;i++){row=stepBoat(row,0,1,.04,()=>true);motor=stepBoat(motor,0,1,.04,()=>true,'motorboat');}
 assert.ok(motor.speed>row.speed);
});

import {boatFloatOffset,boatSeatHeight} from './waterNavigation';
import {driveThrottle,swimSpeed,propulsionSpeed} from './propulsion';
test('timber bilge remains wet and interior floor remains above the waterline at idle',()=>{const offset=boatFloatOffset('rowboat');assert.ok(offset-.27<0);assert.ok(offset+.025-.035>0);assert.ok(boatSeatHeight('rowboat')+offset>.45);});
test('two swimming speeds and shared pedal input',()=>{assert.ok(swimSpeed(true)>swimSpeed(false));assert.equal(driveThrottle(0,true),1);assert.equal(driveThrottle(-.5,true),-.5);assert.equal(driveThrottle(.3,false),.3);});
test('boost accelerates gradually and releases for each vehicle',()=>{for(const kind of ['rowboat','motorboat','bus'] as const){let normal=0,fast=0;for(let i=0;i<200;i++){normal=propulsionSpeed(kind,normal,1,false,.04);fast=propulsionSpeed(kind,fast,1,true,.04);}assert.ok(fast>normal);assert.ok(propulsionSpeed(kind,fast,0,false,.04)<fast);assert.ok(propulsionSpeed(kind,0,1,true,.04)<fast);}});
test('boosted boat still stops at shoreline',()=>{const wet=(x:number,z:number)=>Math.abs(x)<10&&z>-8&&z<10;let b={x:0,z:0,yaw:0,speed:0};for(let i=0;i<200;i++){b=stepBoat(b,0,1,.04,wet,'motorboat',true);assert.ok(boatFits(b.x,b.z,b.yaw,wet,'motorboat'));}assert.equal(b.speed,0);});
