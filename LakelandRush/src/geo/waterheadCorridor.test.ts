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
 for(const key of ['0_-1','0_-2']){const c=load(key),p=corridorPlan(c);assert.ok(p.plants.length>0);for(const t of p.plants){assert.equal(Math.floor(t.x/500),c.cx);assert.equal(Math.floor(t.z/500),c.cz);assert.ok(Math.abs(t.x-corridorPoint(t.z,0)[0])>=8-1e-6);}}
});
