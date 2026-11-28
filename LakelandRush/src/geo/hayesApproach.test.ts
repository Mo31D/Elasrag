import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {WorldChunkData} from '../types/game';
import {hayesPlan,HAYES_ID,HAYES_ROOF_BAYS} from './hayesApproach';
import {pointInRing} from './projection';
import {segmentDistance} from './parking';
import {displayHalfWidth} from './roadPresentation';
const c=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-2.json',import.meta.url),'utf8')) as WorldChunkData;
test('Hayes uses existing building footprint and clear courtyard',()=>{
 const p=hayesPlan(c),b=c.buildings.find(b=>b.id===HAYES_ID)!;
 const ring=b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as [number,number]);
 assert.ok(p.parking.length>100);assert.ok(p.cars.length>10);assert.equal(p.signs.length,2);assert.ok(p.paving.length>20);
 for(const v of p.cars)assert.ok(!pointInRing(v.x,v.z,ring));
 for(const bay of HAYES_ROOF_BAYS)for(let u=-bay.width/2;u<=bay.width/2+.001;u+=bay.width/10)for(let z=-bay.length/2;z<=bay.length/2+.001;z+=bay.length/20){
  const [x,zz]='across' in bay&&bay.across?[bay.x+z,bay.z+u]:[bay.x+u,bay.z+z];assert.ok(pointInRing(x,zz,ring));
 }
});
test('junction fence never blocks Old Lake Road',()=>{
 const p=hayesPlan(c);assert.ok(p.walls.length>0);
 const roads=c.roads.filter(r=>r.name==='Old Lake Road'||r.ref==='A591');
 for(const w of p.walls)for(const [x,z] of [w.a,w.b])for(const r of roads)for(let i=1;i<r.pts.length;i++)assert.ok(segmentDistance(x,z,r.pts[i-1],r.pts[i])>displayHalfWidth(r));
});
