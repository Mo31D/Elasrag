import type {LakeData,WorldChunkData,RegionManifest} from '../types/game';
import {isPointInLake,pointInRing} from './projection';
import {segmentDistance,type Point} from './parking';
import navigation from '../data/ambleside-navigation.json';
export type MapTarget={id:string;name:string;x:number;z:number;kind?:string;curatedId?:string;regional?:boolean};
export type Arrival={point:Point;heading:Point;offset:number;method:'curated'|'mapped-path'};
export function fromStop(stop:(typeof navigation.stops)[number]):MapTarget{return {id:stop.id,name:stop.name,x:stop.point[0],z:stop.point[1],kind:stop.kind,curatedId:stop.id};}
export function travelKeys(target:MapTarget,manifest:RegionManifest){
 const s=manifest.chunkSize,r=target.regional?350:120;
 return manifest.availableChunks.filter(k=>{const [x,z]=k.split('_').map(Number);return x*s<=target.x+r&&(x+1)*s>=target.x-r&&z*s<=target.z+r&&(z+1)*s>=target.z-r;});
}
export function findArrival(target:MapTarget,chunks:WorldChunkData[],lake:LakeData|null):Arrival|null{
 if(!lake||!chunks.length||!Number.isFinite(target.x)||!Number.isFinite(target.z))return null;
 const r=target.regional?350:120;
 const buildings=chunks.flatMap(c=>c.buildings).filter(b=>Math.hypot(b.cx-target.x,b.cz-target.z)<r+150).map(b=>b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as Point));
 const walls=chunks.flatMap(c=>c.walls).flatMap(w=>w.pts.slice(1).map((p,i)=>[w.pts[i],p] as [Point,Point]));
 const clear=(x:number,z:number)=>![[0,0],[.8,0],[-.8,0],[0,.8],[0,-.8]].some(([dx,dz])=>isPointInLake(lake,x+dx,z+dz))&&!buildings.some(p=>pointInRing(x,z,p)||p.some((b,i)=>segmentDistance(x,z,b,p[(i+1)%p.length])<.9))&&!walls.some(([a,b])=>segmentDistance(x,z,a,b)<.9);
 const curated=navigation.stops.find(s=>s.id===target.curatedId);
 if(curated&&clear(curated.spawn[0],curated.spawn[1])){
  const [x,z]=curated.spawn,heading=curated.heading??curated.point;
  return {point:[x,z],heading:Math.hypot(heading[0]-x,heading[1]-z)<.1?[x,z-8]:[heading[0],heading[1]],offset:Math.hypot(x-target.x,z-target.z),method:'curated'};
 }
 let best:Arrival|null=null,score=Infinity;
 for(const road of chunks.flatMap(c=>c.roads)){
  if(!['primary','secondary','lane','footpath'].includes(road.kind)||road.bridge||/^(private|no)$/i.test(road.access??''))continue;
  for(let i=1;i<road.pts.length;i++){
   const a=road.pts[i-1],b=road.pts[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);if(len<.2)continue;
   const t=Math.max(0,Math.min(1,((target.x-a[0])*dx+(target.z-a[1])*dz)/(len*len)));
   for(const shift of [0,3,-3,8,-8,15,-15]){
    const q=Math.max(0,Math.min(1,t+shift/len)),x=a[0]+q*dx,z=a[1]+q*dz,d=Math.hypot(x-target.x,z-target.z),rank=d+(road.kind==='footpath'?0:road.kind==='lane'?8:16);
    if(d>r||rank>=score||!clear(x,z))continue;
    score=rank;best={point:[x,z],heading:d>.5?[target.x,target.z]:[x+dx/len*8,z+dz/len*8],offset:d,method:'mapped-path'};
   }
  }
 }
 return best;
}
export function mapDistance(a:{x:number;z:number},b:{x:number;z:number}){const d=Math.hypot(a.x-b.x,a.z-b.z);return d>=1000?(d/1000).toFixed(1)+' km':Math.round(d)+' m';}
