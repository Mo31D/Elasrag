import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {WorldChunkData} from '../types/game';
import {grassExclusion,grassCandidates,GRASS_MAX} from './grassPlan';
import realm from '../data/waterhead-public-realm.json';
import {pointInRing} from './projection';
import {groundSurface} from '../engine/waterfront';
test('grass is deterministic and bounded, excludes mapped water, buildings, paths and parking',()=>{
 const c:WorldChunkData={key:'0_0',cx:0,cz:0,roads:[{id:1,kind:'lane',pts:[[50,0],[50,100]]}],buildings:[{id:1,kind:'cottage',cx:60,cz:60,h:6,pts:[[-4,-4],[4,-4],[4,4],[-4,4]]}],walls:[],piers:[],woodlands:[]};
 const blocked=grassExclusion(c,(x)=>x<38);const points=grassCandidates(c,50,50,blocked);
 assert.ok(points.length>0&&points.length<=GRASS_MAX);assert.deepEqual(points,grassCandidates(c,50,50,blocked));
 assert.ok(points.every(p=>p.x>=38&&Math.abs(p.x-50)>2.6&&!blocked(p.x,p.z)));
 const waterhead:WorldChunkData=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-1.json',import.meta.url),'utf8'));
 const noGrass=grassExclusion(waterhead,()=>false);const lot=realm.parking[0].points as [number,number][];
 const nearby=grassCandidates(waterhead,90,-425,noGrass);
 assert.ok(nearby.every(p=>!pointInRing(p.x,p.z,lot)));
});
test('dense parking surface conforms to supplied ground and has world-scale UVs',()=>{
 const g=groundSurface([[0,0],[20,0],[20,20],[0,20]],(x,z)=>x*.05+z*.03,.065,true);
 const p=g.attributes.position;assert.ok(p.count>6);
 for(let i=0;i<p.count;i++)assert.ok(Math.abs(p.getY(i)-(p.getX(i)*.05+p.getZ(i)*.03+.065))<.00001);
 g.dispose();
});
