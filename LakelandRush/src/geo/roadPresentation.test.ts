import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {displayHalfWidth,roadSurface,junctionPoints,unmarkedNearJunction,convexFootprint,boardFaces} from './roadPresentation';
import type {WorldChunkData,RoadFeature} from '../types/game';
test('Compston narrow segment uses clearance-based one-way width without changing source geometry',()=>{
 const c:WorldChunkData=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/-1_-4.json',import.meta.url),'utf8'));
 const r=c.roads.find(r=>r.id===561321008)!;
 assert.equal(r.name,'Compston Road');assert.equal(displayHalfWidth(r),1.8);assert.equal(roadSurface(r),'asphalt');
 assert.equal(displayHalfWidth({...r,widthM:5}),2.5);
});
test('side streets, pavements and gravel use distinct unmarked materials',()=>{
 const r:RoadFeature={id:1,kind:'lane',pts:[[0,0],[0,20]]};
 assert.equal(roadSurface(r),'asphalt');assert.equal(roadSurface({...r,kind:'footpath',sidewalk:true}),'paving');
 assert.equal(roadSurface({...r,kind:'footpath',surface:'gravel'}),'gravel');
});
test('junction marking suppression detects joining roads',()=>{
 const r:RoadFeature={id:1,kind:'primary',pts:[[0,0],[0,20]]},side:RoadFeature={id:2,kind:'lane',pts:[[0,10],[10,10]]};
 const j=junctionPoints(r,[r,side]);assert.ok(unmarkedNearJunction([0,9],[0,11],j,4));assert.equal(unmarkedNearJunction([0,0],[0,2],j,4),false);
});
test('roof hips only on convex footprints; signs have independent readable faces',()=>{
 assert.ok(convexFootprint([[0,0],[4,0],[4,5],[0,5]]));
 assert.equal(convexFootprint([[0,0],[4,0],[4,5],[2,2],[0,5]]),false);
 assert.deepEqual(boardFaces(false).map(f=>f.yaw),[0,Math.PI]);assert.equal(boardFaces(true)[1].reverse,true);
});
