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
