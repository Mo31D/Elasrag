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

import { frontageAnchor, approachAnchor } from './signagePlan';
import { classifyBuilding,areaChunkKeys,indexPlaces,AREAS } from './placeIdentity';
test('frontage faces the mapped road and private cottage names are excluded',()=>{
  const building={id:42,name:'Example Shop',kind:'shop',cx:30,cz:30,h:6,pts:[[-4,-4],[4,-4],[4,4],[-4,4]] as [number,number][]};
  assert.equal(classifyBuilding(building),'shop');assert.equal(classifyBuilding({...building,name:'Example Cottage',kind:'cottage'}),null);
  const a=frontageAnchor(building,[{id:3,kind:'lane',pts:[[0,20],[70,20]]}]);
  assert.ok(a);assert.ok(a.z<26);assert.ok(a.width<=4.2);
  const records=indexPlaces(AREAS[0],[{...chunk,buildings:[building,building]}]);assert.equal(records.length,1);
});
test('directory selects only intersecting chunks and approach anchors exclude water',()=>{
  assert.deepEqual(areaChunkKeys(AREAS[0],['0_-1','7_8'],500),['0_-1']);
  assert.equal(approachAnchor(chunk,[50,200],[50,100],()=>true),null);
});

import {safeBoard,transitAnchor,boardWidth,halfWidth} from './signagePlan';
import {readFileSync} from 'node:fs';
test('road and bus boards clear carriageway by their entire width, not only pole',()=>{
 const water=()=>false;
 assert.equal(safeBoard(chunk,54.6,100,boardWidth('road'),water),false);
 const north=transitAnchor(chunk,{x:50,z:120,bearing:0,mode:'bus'},water)!;
 const south=transitAnchor(chunk,{x:50,z:120,bearing:180,mode:'bus'},water)!;
 assert.ok(north&&south);assert.ok(north.x<50&&south.x>50);
 assert.ok(Math.abs(north.x-50)>=halfWidth(chunk.roads[0])+boardWidth('bus')/2+.55);
 assert.ok(safeBoard(chunk,north.x,north.z,boardWidth('bus'),water));
 assert.equal(transitAnchor(chunk,{x:50,z:120,bearing:0,mode:'bus'},()=>true),null);
});
test('actual Climbing Wall source point is no longer used directly as a pole',()=>{
 const c:WorldChunkData=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-3.json',import.meta.url),'utf8'));
 const stop=TRANSIT.find(t=>t.id==='090079414625')!;
 const a=transitAnchor(c,stop,()=>false);
 assert.ok(a,'a safe southbound roadside candidate should exist');
 assert.ok(a.offsetM>1&&a.offsetM<=18);
 assert.ok(safeBoard(c,a.x,a.z,boardWidth('bus'),()=>false));
 assert.equal(c.roads.find(r=>r.id===a.roadId)?.name,'Lake Road');
 assert.ok(a.x>stop.x);
});
test('unsafe board positions at tile boundaries are suppressed',()=>{
 assert.equal(safeBoard(chunk,2,100,1,()=>false),false);
});
