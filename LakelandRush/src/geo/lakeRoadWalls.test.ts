import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {WorldChunkData} from '../types/game';
import {lakeRoadWallRuns,WALL_HEIGHT,WALL_WIDTH} from './lakeRoadWalls';
import {displayHalfWidth} from './roadPresentation';
import {segmentDistance} from './parking';
const load=(key:string)=>JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/'+key+'.json',import.meta.url),'utf8')) as WorldChunkData;
test('Waterhead parking boundary follows the eastern edge and leaves both ends open',()=>{
 const runs=lakeRoadWallRuns(load('0_-1'),()=>false).filter(r=>r.kind==='parking');
 assert.ok(runs.length>15);assert.equal(WALL_HEIGHT,1);assert.equal(WALL_WIDTH,.44);
 for(const s of runs)for(const [x,z] of [s.a,s.b]){assert.ok(x>127&&x<137);assert.ok(z<=-415.5&&z>=-474);}
});
test('roadside additions avoid mapped road access and stay within loaded tiles',()=>{
 for(const key of ['0_-1','0_-2','0_-3']){
  const c=load(key),runs=lakeRoadWallRuns(c,()=>false).filter(r=>r.kind==='roadside');
  assert.ok(runs.length>0);
  for(const s of runs)for(const [x,z] of [s.a,s.b]){
   assert.equal(Math.floor(x/500),c.cx);assert.equal(Math.floor(z/500),c.cz);
   for(const r of c.roads.filter(r=>r.kind!=='ferry'&&r.ref!=='A591'))for(let i=1;i<r.pts.length;i++)assert.ok(segmentDistance(x,z,r.pts[i-1],r.pts[i])>displayHalfWidth(r));
  }
 }
});
