import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CRUISE_LENGTH,cruisePose,cruiseHullWet,shorePoint} from './waterheadLife';
import {readFileSync} from 'node:fs';
import {isPointInLake,pointInRing} from '../geo/projection';
import type {LakeData} from '../types/game';
const lake=JSON.parse(readFileSync(new URL('../../public/regions/windermere/lake.json',import.meta.url),'utf8')) as LakeData;
const chunk=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-1.json',import.meta.url),'utf8')) as {piers:Array<{pts:Array<[number,number]>}>};
const wet=(x:number,z:number)=>isPointInLake(lake,x,z);
test('Waterhead cruise hull remains in mapped lake and clear of all mapped piers',()=>{
 for(let i=0;i<720;i++)assert.ok(cruiseHullWet(cruisePose(CRUISE_LENGTH*i/720),(x,z)=>wet(x,z)&&!chunk.piers.some(p=>pointInRing(x,z,p.pts))),String(i));
});
test('closed cruise loop and nearly constant arc-length speed',()=>{
 assert.deepEqual(cruisePose(0),cruisePose(CRUISE_LENGTH));
 for(let d=0;d<CRUISE_LENGTH;d+=4){const a=cruisePose(d),b=cruisePose(d+4);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>3.9);}
});
test('shoreline anchors sit on mapped shoreline',()=>{
 for(let z=-350;z<=-245;z+=5){const x=shorePoint(z,wet);assert.notEqual(x,null);assert.ok(wet(x!,z));assert.ok(!wet(x!+.5,z));}
});
