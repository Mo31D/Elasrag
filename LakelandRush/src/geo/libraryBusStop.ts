import type {BuildingFeature,WorldChunkData} from '../types/game';
import {pointInRing} from './projection';
import {segmentDistance} from './parking';
import {streetEdge} from './blackSheepStreet';
export const LIBRARY_ID=239881389;
export const LIBRARY_NEIGHBOURS=[423644522,423644523] as const;
export const KELSICK_CHUNK='0_-3';
export const KELSICK_ROADS=[194773220,1387763407,1387763406,614194823];
export const KELSICK_CHUNKS=['0_-3','-1_-3'];
export const SHELTER_BUILDING_IDS=[1117499828,1117499829];
export function isShelterFootprint(id:number){return SHELTER_BUILDING_IDS.includes(id);}
export type P=[number,number];
const road:P[]=[[-15.319,-1382.544],[-6.581,-1383.123],[-3.498,-1383.523],[.576,-1383.98],[11.75,-1385.605],[16.245,-1386.15],[26.829,-1387.553]];
export function kelsickZ(x:number){for(let i=1;i<road.length;i++){const a=road[i-1],b=road[i];if(x<=b[0]||i===road.length-1)return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return road[0][1];}
export function libraryEdge(b:BuildingFeature){return streetEdge(b,b.id===LIBRARY_ID?8:b.id===423644522?0:0);}
// Use the mapped shelter footprints, not the approximate passenger stop coordinates.
export const SHELTERS=[{id:1117499829,stand:1,chunk:'0_-3',x:7.3,z:-1391.5,length:4.0},{id:1117499828,stand:2,chunk:'-1_-3',x:-5.4,z:-1389.6,length:4.4}];
export function sheltersForChunk(key:string){return SHELTERS.filter(s=>s.chunk===key);}
export function busStopPavements(key=KELSICK_CHUNK):P[][]{
 const out:P[][]=[];
 // Continuous forecourt, clipped at tile ownership; the car park lies behind.
 const start=key==='-1_-3'?-11.2:0,end=key==='-1_-3'?0:12.2;
 const front:P[]=[],back:P[]=[];
 const steps=Math.ceil(end-start);
 for(let i=0;i<=steps;i++){const x=i===0?start:i===steps?end:start+(end-start)*i/steps;front.push([x,kelsickZ(x)-4.35]);back.push([x,kelsickZ(x)-8.05]);}
 out.push([...front,...back.reverse()]);
 if(key===KELSICK_CHUNK)for(const [a,b,az,bz] of [[3.6,11.75,-1377,-1379.13],[11.75,20.6,-1379.13,-1381.4]]){
 const za=kelsickZ(a)+4.4,zb=kelsickZ(b)+4.4;
 if(az>za&&bz>zb)out.push([[a,za],[b,zb],[b,bz],[a,az]]);
 }
 return out;
}
export function busStopBay(key=KELSICK_CHUNK):P[][]{
 const out:P[][]=[];for(const s of sheltersForChunk(key)){const a=s.x-5,b=s.x+5;for(let x=a;x<b;x+=1.8){const u=Math.min(b,x+.85);out.push([[x,kelsickZ(x)-1.9],[u,kelsickZ(u)-1.9],[u,kelsickZ(u)-1.80],[x,kelsickZ(x)-1.80]]);}
 for(const x of [a,b])out.push([[x,kelsickZ(x)-4.22],[x+.10,kelsickZ(x+.10)-4.22],[x+.10,kelsickZ(x+.10)-1.8],[x,kelsickZ(x)-1.8]]);}
 return out;
}
export function shelterClearance(x:number,z:number){return SHELTERS.some(s=>Math.abs(x-s.x)<s.length/2+1.6&&Math.abs(z-s.z)<3.1);}

export function interchangeParking(ring:P[],chunk:WorldChunkData){
 const out:{x:number;z:number;yaw:number}[]=[];
 // Parallel rows behind the shelters, inside the existing King Street car park.
 for(const z of [-1398.6,-1409.2,-1419.8])for(let x=-9;x<=17;x+=2.65){
  const corners:P[]=[[x-1.18,z-2.35],[x+1.18,z-2.35],[x+1.18,z+2.35],[x-1.18,z+2.35]];
  if(!corners.every(p=>pointInRing(...p,ring)&&!shelterClearance(...p)&&p[1]<kelsickZ(p[0])-8.6))continue;
  // Include the adjoining tile's western access lane, which crosses the site.
  const access:P[]=[[.576,-1383.98],[-3.297,-1406.032]];
  if(corners.some(p=>segmentDistance(...p,access[0],access[1])<2.8))continue;
  if(chunk.roads.some(r=>r.pts.slice(1).some((b,i)=>corners.some(p=>segmentDistance(...p,r.pts[i],b)<(r.kind==='primary'?4.4:2.6)+.3))))continue;
  if(chunk.buildings.some(b=>!isShelterFootprint(b.id)&&corners.some(p=>pointInRing(...p,b.pts.map(([u,v])=>[u+b.cx,v+b.cz] as P)))))continue;
  out.push({x,z,yaw:0});
 }
 return out;
}
export function busStopKerbs(key:string):P[][]{
 const a=key==='-1_-3'?-11.2:0,b=key==='-1_-3'?0:12.2,out:P[][]=[];
 for(let x=a;x<b;x+=.75){const q=Math.min(x+.75,b);out.push([[x,kelsickZ(x)-4.38],[q,kelsickZ(q)-4.38],[q,kelsickZ(q)-4.54],[x,kelsickZ(x)-4.54]]);}
 return out;
}
