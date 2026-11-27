import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SHELTERS,isShelterFootprint,sheltersForChunk,busStopPavements,kelsickZ,interchangeParking,shelterClearance} from './libraryBusStop';
import type {WorldChunkData} from '../types/game';
const read=(key:string)=>JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/'+key+'.json',import.meta.url),'utf8')) as WorldChunkData;
test('both original map shelter footprints are replaced exactly once in their own tile',()=>{
 for(const s of SHELTERS){const chunk=read(s.chunk),mapped=chunk.buildings.find(b=>b.id===s.id)!;assert.ok(isShelterFootprint(mapped.id));assert.equal(mapped.cx,s.x);assert.equal(mapped.cz,s.z);assert.equal(sheltersForChunk(s.chunk).length,1);assert.ok(kelsickZ(s.x)-s.z>5);}
 assert.equal(isShelterFootprint(239881389),false);
 assert.equal(sheltersForChunk('0_-2').length,0);
});
test('forecourt touches across tile boundary and parking avoids shelter zone',()=>{
 const west=busStopPavements('-1_-3')[0],east=busStopPavements('0_-3')[0];
 assert.deepEqual(west.filter(p=>p[0]===0),east.filter(p=>p[0]===0));
 const sites=JSON.parse(readFileSync(new URL('../data/ambleside-surfaces.json',import.meta.url),'utf8'));
 const ring=sites['0_-3'].find((p:{id:number})=>p.id===121481163).points;
 const slots=interchangeParking(ring,read('0_-3'));assert.ok(slots.length>0);
 assert.ok(slots.every(p=>!shelterClearance(p.x,p.z)));
});
