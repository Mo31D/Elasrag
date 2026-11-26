import test from 'node:test';
import assert from 'node:assert/strict';
import type { WorldChunkData } from '../types/game';
import { planRoadSigns } from './signagePlan';
import { TRANSIT } from '../data/transit';
const chunk:WorldChunkData={key:'0_0',cx:0,cz:0,buildings:[],roads:[
  {id:1,kind:'primary',name:'Lake Road',ref:'A591',pts:[[50,50],[50,200]]},
  {id:2,kind:'primary',name:'Lake Road',ref:'A591',pts:[[50,200],[50,350]]},
  {id:3,kind:'lane',pts:[[150,50],[150,200]]}
],walls:[],piers:[],woodlands:[]};
test('named roads generate one off-road estimated sign per chunk identity',()=>{
  const signs=planRoadSigns(chunk,()=>false);
  assert.equal(signs.length,1);assert.equal(signs[0].name,'Lake Road');assert.equal(signs[0].ref,'A591');
  assert.equal(signs[0].placement,'estimated');assert.ok(Math.abs(signs[0].x-50)>5);
});
test('water excludes candidate signs',()=>assert.equal(planRoadSigns(chunk,()=>true).length,0));
test('transport records are uniquely identified and use mapped coordinates',()=>{
  assert.equal(new Set(TRANSIT.map(t=>t.id)).size,TRANSIT.length);
  assert.ok(TRANSIT.every(t=>Number.isFinite(t.x)&&Number.isFinite(t.z)&&t.source.startsWith('https://')));
  const rail=TRANSIT.find(t=>t.id==='WDM')!;assert.equal(rail.mode,'rail');assert.ok(rail.x>3500&&rail.z>4000);
});
