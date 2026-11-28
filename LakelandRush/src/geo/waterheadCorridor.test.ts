import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {WorldChunkData} from '../types/game';
import {corridorPoint,corridorPlan} from './waterheadCorridor';
const load=(key:string)=>JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/'+key+'.json',import.meta.url),'utf8')) as WorldChunkData;
test('reference corridor preserves the mapped road centreline',()=>{
 for(const [x,z] of [[129.678,-326.89],[137.891,-365.217],[147.03,-411.314],[170.297,-522.857],[134.283,-780.628]])assert.ok(Math.abs(corridorPoint(z,0)[0]-x)<1e-6);
});
test('Waterhead has two distinct shelters outside the vehicle carriageway',()=>{
 const plan=corridorPlan(load('0_-1'));assert.equal(plan.shelters.length,2);assert.equal(new Set(plan.shelters.map(s=>s.side)).size,2);
 for(const s of plan.shelters)assert.ok(Math.abs(s.x-corridorPoint(s.z,0)[0])>=5.48);
});
test('new woodland objects respect streamed tile boundaries and carriageway clearance',()=>{
 for(const key of ['0_-1','0_-2']){const c=load(key),p=corridorPlan(c);assert.ok(p.plants.length>0);for(const t of p.plants){assert.equal(Math.floor(t.x/500),c.cx);assert.equal(Math.floor(t.z/500),c.cz);assert.ok(Math.abs(t.x-corridorPoint(t.z,0)[0])>=6.65-1e-6);}}
});

import {woodedProfile,WOODED_END} from './waterheadCorridor';
import {segmentDistance} from './parking';
test('wooded approach is asymmetric, with low west walls, timber fence and high east retaining walls',()=>{
 const p=corridorPlan(load('0_-2'));
 assert.ok(p.walls.some(w=>w.side<0&&w.height===.48));
 assert.ok(p.walls.some(w=>w.fence&&w.side<0));
 assert.ok(p.walls.some(w=>w.retaining&&w.side>0&&w.height===1.85));
 assert.equal(woodedProfile(-690,1).height,1.85);
 assert.ok(p.kerbs.length>100&&p.edgePaint.length===p.kerbs.length);
 assert.ok(p.walls.every(w=>w.a[1]>=WOODED_END&&w.b[1]>=WOODED_END));
});
test('parked car footprints stay clear of the A591 through lanes',()=>{
 const c=load('0_-2'),p=corridorPlan(c);
 assert.ok(p.parked.length>=5);
 for(const car of p.parked)for(const u of [-.96,.96])for(const v of [-2.3,2.3]){
  const x=car.x+u*Math.cos(car.yaw)+v*Math.sin(car.yaw),z=car.z-u*Math.sin(car.yaw)+v*Math.cos(car.yaw);
  for(const r of c.roads.filter(r=>r.ref==='A591'))for(let i=1;i<r.pts.length;i++)assert.ok(segmentDistance(x,z,r.pts[i-1],r.pts[i])>=4.4);
 }
});
