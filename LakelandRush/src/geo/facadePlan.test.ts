import test from 'node:test';
import assert from 'node:assert/strict';
import type {BuildingFeature,RoadFeature} from '../types/game';
import {chooseFrontage,planFacade,mappedIdentity,familyFor} from './facadePlan';
import {buildFacadeBatch} from '../engine/facades';
import inventory from '../data/ambleside-business-inventory.json';
const b:BuildingFeature={id:42,kind:'shop',cx:30,cz:-100,h:8,pts:[[-4,-3],[4,-3],[4,3],[-4,3]]};
const roads:RoadFeature[]=[{id:1,kind:'lane',pts:[[0,-110],[90,-110]]}];
test('frontage faces mapped road for either polygon winding',()=>{
 for(const building of [b,{...b,pts:[...b.pts].reverse()}]){
  const e=chooseFrontage(building,roads)!;assert.equal(e.z,-103);assert.ok(e.nz<-.99);assert.equal(e.length,8);
 }
});
test('anchor fallback and narrow or invalid footprint',()=>{
 assert.equal(chooseFrontage(b,[],{x:40,z:-100})?.x,34);
 assert.equal(planFacade({...b,pts:[]},[],0,6),null);
});
test('family metadata and geometry are deterministic, bounded and above foundation',()=>{
 const p=planFacade(b,roads,2,6)!;assert.equal(p.family,'waterside_shop');assert.ok(p.pieces.some(x=>x.surface==='glass'));assert.ok(p.pieces.length<=180);
 assert.deepEqual(p,planFacade(b,roads,2,6));assert.ok(p.pieces.every(x=>Object.values(x).filter(v=>typeof v==='number').every(Number.isFinite)));
 assert.equal(familyFor({...b,kind:'hotel'}),'hotel_guesthouse');
 assert.equal(familyFor({...b,kind:'cottage'}),'lakeland_house');
 const batch=buildFacadeBatch([p]);assert.ok(batch.group.children.length<=5);batch.dispose();
});
test('business identity requires mapped ID and location; unresolved cannot become a storefront',()=>{
 const resolved={name:'Example',status:'mapped-snapshot-match',mapCategory:'shop',position:{kind:'building',name:'Example',buildingId:42,x:30,z:-100}};
 assert.equal(mappedIdentity(b,[resolved])?.name,'Example');
 assert.equal(mappedIdentity({...b,id:43},[resolved]),undefined);
 assert.equal(mappedIdentity({...b,cx:40},[resolved]),undefined);
 assert.equal(mappedIdentity(b,[resolved,{...resolved,name:'Other'}]),undefined);
 const unresolved={name:'Example',status:'unlocated',mapCategory:'shop',position:null};
 assert.equal(planFacade({...b,name:'Example'},roads,0,6,[],[unresolved])?.sign,undefined);
 assert.equal(planFacade(b,roads,0,6,[],[resolved])?.sign?.name,'Example');
});
test('actual inventory never assigns unlocated records by proximity',()=>{
 for(const r of inventory.records.filter(r=>!r.position))assert.equal(mappedIdentity({...b,name:r.name},[r]),undefined);
});
