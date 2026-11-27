import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {coffeeShopPlan,WATERHEAD_COFFEE_ID} from './coffeeShopPlan';
import type {BuildingFeature} from '../types/game';
import realm from '../data/waterhead-public-realm.json';
const chunk=JSON.parse(readFileSync(new URL('../../public/regions/windermere/chunks/0_-1.json',import.meta.url),'utf8'));
const b=chunk.buildings.find((x:BuildingFeature)=>x.id===WATERHEAD_COFFEE_ID) as BuildingFeature;
test('coffee shop keeps its mapped outline and faces the lake',()=>{
 const p=coffeeShopPlan(b)!;assert.ok(p);assert.ok(Math.sin(p.yaw)<-.9);
 for(let i=0;i<b.pts.length;i++){const [x,z]=p.world(...p.outline[i]);assert.ok(Math.hypot(x-b.cx-b.pts[i][0],z-b.cz-b.pts[i][1])<1e-8);}
 assert.equal(coffeeShopPlan({...b,id:1}),null);
});
test('terrace retains clearance from mapped promenade centreline',()=>{
 const p=coffeeShopPlan(b)!,way=realm.sidewalk.find(x=>x.id===121559793)!.points;
 for(let i=0;i<=40;i++){const u=p.left+(p.right-p.left)*i/40,[x,z]=p.world(u,p.depthAt(u));
 let min=Infinity;for(let k=1;k<way.length;k++){const [ax,az]=way[k-1],[bx,bz]=way[k],dx=bx-ax,dz=bz-az;const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));min=Math.min(min,Math.hypot(x-ax-dx*t,z-az-dz*t));}assert.ok(min>.91,String(min));}
});
