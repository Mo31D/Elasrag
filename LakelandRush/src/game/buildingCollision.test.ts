import test from 'node:test';
import assert from 'node:assert/strict';
import {solidHeight,blocksMove,cameraFraction,WALK_RADIUS,FLIGHT_RADIUS,ROOF_SKIN,type SolidCollider} from './buildingCollision';
import {sweepMove,flightHeight} from './exploreControls';
import {triangleGround} from '../geo/surfaceGround';
const outline:[number,number][]=[[-3,-4],[3,-4],[3,4],[-3,4]];
const c:SolidCollider={minX:-3,maxX:3,minZ:-4,maxZ:4,topY:5,isRoof:true,outline,roofAt:(x,z)=>Math.abs(x)<=3.001&&Math.abs(z)<=4.001?5+3*(1-Math.abs(x)/3):undefined};
test('pitched roof exceeds old eave collider and blocks wing flight',()=>{
 assert.equal(solidHeight(c,0,0,0),8);
 assert.ok(blocksMove(solidHeight(c,0,0,FLIGHT_RADIUS),6,-Infinity,false));
 assert.ok(!blocksMove(solidHeight(c,0,0,FLIGHT_RADIUS),9,-Infinity,false));
 assert.ok(Number.isFinite(solidHeight(c,3.8,0,FLIGHT_RADIUS)));
 assert.equal(solidHeight(c,4.1,0,FLIGHT_RADIUS),-Infinity);
});
test('high speed sweeps stop outside walls without crossing corners',()=>{
 for(const y of [0,4.8,5.1]){
  const p=sweepMove(-9,0,18,0,(x,z)=>blocksMove(solidHeight(c,x,z,WALK_RADIUS),y,-Infinity,false));
  assert.ok(p.x<=-3-WALK_RADIUS+.001,String(p.x));
 }
 const p=sweepMove(-9,0,18,0,(x,z)=>blocksMove(solidHeight(c,x,z,FLIGHT_RADIUS),10,-Infinity,false));assert.ok(p.x>8.99);
 assert.equal(solidHeight(c,3.34,4.34,.38),-Infinity);
});
test('roof supports descent and allows small grounded uphill movement only',()=>{
 const top=solidHeight(c,0,0,WALK_RADIUS);
 let y=14;for(let i=0;i<100;i++)y=flightHeight(y,-1,.04,top+ROOF_SKIN);
 assert.ok(y>=top+ROOF_SKIN+1.25);
 assert.ok(!blocksMove(6.1,6.045,6,true));
 assert.ok(blocksMove(6.1,6.045,6,false));
 assert.ok(blocksMove(6,1,-Infinity,true));
});
test('camera cannot pass through pitched roof or narrow wall',()=>{
 const f=cameraFraction({x:-6,y:6,z:0},{x:6,y:6,z:0},(x,z)=>solidHeight(c,x,z,.18));assert.ok(f>0&&f<.5);
});
test('triangle surface follows actual slope, not a flat height',()=>{
 const v=[[0,5,0],[2,7,0],[0,5,2]],pos={count:3,getX:(i:number)=>v[i][0],getY:(i:number)=>v[i][1],getZ:(i:number)=>v[i][2]};
 const sample=triangleGround(pos,null,4);assert.equal(sample(.5,.5),5.5);assert.equal(sample(3,3),undefined);
});
