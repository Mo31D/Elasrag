import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {WorldChunkData} from '../types/game';
import {petGardenRuns,GATE_Z,GATE_WIDTH,PET_SIGNAL_POINTS,PET_LAMP_POINTS,PET_TREE_POINTS} from './petJunction';
import {segmentDistance} from './parking';
import {displayHalfWidth} from './roadPresentation';
const chunk=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-1.json',import.meta.url),'utf8')) as WorldChunkData;
test('photo authored poles and mature tree trunks stay clear of mapped carriageways',()=>{
 for(const [x,z] of [...PET_SIGNAL_POINTS.map(p=>[p.x,p.z]),...PET_LAMP_POINTS,...PET_TREE_POINTS.map(p=>[p.x,p.z])]){
  for(const road of chunk.roads.filter(r=>r.kind==='primary'||r.kind==='secondary'||r.kind==='lane'))for(let i=1;i<road.pts.length;i++)assert.ok(segmentDistance(x,z,road.pts[i-1],road.pts[i])>displayHalfWidth(road),String(road.id));
 }
});
test('garden wall reserves the wooden gate opening',()=>{
 const runs=petGardenRuns();assert.ok(runs.length>4);
 for(const {a,b} of runs)assert.ok(Math.abs((a[1]+b[1])/2-GATE_Z)>=GATE_WIDTH/2);
});
