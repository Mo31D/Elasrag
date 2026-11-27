import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {triangleGround,buildingGrades} from './surfaceGround';
import {mappedIdentity,planFacade} from './facadePlan';
import type {BuildingFeature,WorldChunkData} from '../types/game';
test('rendered triangle height uses interpolation',()=>{
 const v=[[0,0,0],[10,10,0],[0,20,10]],sample=triangleGround({count:3,getX:i=>v[i][0],getY:i=>v[i][1],getZ:i=>v[i][2]},null);
 assert.equal(sample(2,3),8);assert.equal(sample(9,9),undefined);
});
test('building foundation spans sloping footprint',()=>{
 const b:BuildingFeature={id:1,kind:'cottage',cx:0,cz:0,h:6.4,pts:[[-4,-4],[4,-4],[4,4],[-4,4]]};
 assert.deepEqual(buildingGrades(b,x=>10+x),{high:14,low:6});
 const p=planFacade(b,[{id:3,kind:'lane',pts:[[-10,-7],[10,-7]]}],10,8,[],[],x=>10+x);
 assert.ok(p);assert.ok(p.pieces.some(x=>x.surface==='timber'));
});
test('Tesco POI matches unique host polygon and shopfront',()=>{
 const c:WorldChunkData=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-4.json',import.meta.url),'utf8'));
 const b=c.buildings.find(b=>b.id===423643003)!;
 assert.equal(mappedIdentity(b)?.name,'Tesco Express');
 assert.ok(c.buildings.filter(x=>x.id!==b.id).every(x=>mappedIdentity(x)?.name!=='Tesco Express'));
 const p=planFacade(b,c.roads,10,5,c.buildings);
 assert.equal(p?.family,'retail_shopfront');assert.equal(p?.sign?.name,'Tesco Express');assert.ok(p!.front.length<=8);
});
