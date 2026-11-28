import type {WorldChunkData} from '../types/game';
import {displayHalfWidth} from './roadPresentation';
import {segmentDistance,type Point} from './parking';
import {pointInRing} from './projection';
import {petJunctionReserved} from './petJunction';
export const WALL_HEIGHT=1.0,WALL_WIDTH=.44;
export type WallRun={a:Point;b:Point;kind:'parking'|'roadside'};
// User-confirmed boundary along the A591-facing edge of Waterhead car park.
// Ends are set back from mapped access points, including the path at z=-411.66.
// The parking polygon is the asphalt edge, NOT the property boundary.
// Corrected sequence (west to east): asphalt, internal grass, wall, pavement, A591.
const parkingRoad:Point[]=[[165.18,-472.885],[153.1,-438.922],[147.03,-411.314],[141.79,-385.633]];
export const WATERHEAD_PAVEMENT_WIDTH=1.8;
export const WATERHEAD_ROAD_HALF_WIDTH=4.4;
function parkingRoadSection(z:number){
 const i=parkingRoad.findIndex((p,i)=>i>0&&z<=p[1]),j=i<1?parkingRoad.length-1:i;
 const a=parkingRoad[j-1],b=parkingRoad[j],slope=(b[0]-a[0])/(b[1]-a[1]);
 return {x:a[0]+slope*(z-a[1]),scale:Math.hypot(1,slope)};
}
export function waterheadRoadEdge(z:number,offset:number):Point{
 const s=parkingRoadSection(z);return [s.x-offset*s.scale,z];
}
const wallSections=[-474,-472.885,-438.922,-415.5];
const pavementSections=[-481,-472.885,-438.922,-411.314,-407.5];
export const WATERHEAD_CAR_PARK_WALL:Point[]=wallSections.map(z=>waterheadRoadEdge(z,WATERHEAD_ROAD_HALF_WIDTH+WATERHEAD_PAVEMENT_WIDTH+WALL_WIDTH/2+.12));
export function waterheadCarParkPavement():Point[][]{
 const outer=pavementSections.map(z=>waterheadRoadEdge(z,WATERHEAD_ROAD_HALF_WIDTH+WATERHEAD_PAVEMENT_WIDTH));
 const inner=pavementSections.map(z=>waterheadRoadEdge(z,WATERHEAD_ROAD_HALF_WIDTH-.025));
 return [[...outer,...inner.reverse()]];
}
export function waterheadCarParkKerb():Point[][]{
 return pavementSections.slice(1).map((z,i)=>{const a=pavementSections[i];return [waterheadRoadEdge(a,WATERHEAD_ROAD_HALF_WIDTH-.025),waterheadRoadEdge(z,WATERHEAD_ROAD_HALF_WIDTH-.025),waterheadRoadEdge(z,WATERHEAD_ROAD_HALF_WIDTH+.13),waterheadRoadEdge(a,WATERHEAD_ROAD_HALF_WIDTH+.13)];});
}
// The long A591 way is stored in tile 0_-2 but crosses into both neighbouring tiles.
const crossTileLakeRoad:Point[]=[[87.458,-1087.669],[96.792,-1027.924],[99.13,-1015.134],[108.153,-965.719],[108.872,-962.246],[109.779,-958.149],[110.187,-956.301],[113.704,-939.025],[115.991,-928.149],[119.709,-905.807],[123.505,-879.524],[125.707,-862.949],[131.88,-818.076],[132.968,-807.656],[134.283,-780.628],[135.028,-753.711],[134.95,-738.126],[132.618,-679.35],[133.642,-648.881],[139.18,-619.627],[146.253,-593.667],[166.476,-539.677],[170.297,-522.857],[169.41,-492.255],[165.18,-472.885],[153.1,-438.922],[147.03,-411.314],[141.79,-385.633],[137.891,-365.217],[135.157,-353.272],[129.678,-326.89]];
const pairs=(p:Point[])=>p.slice(1).map((b,i)=>({a:p[i],b}));
const samples=(a:Point,b:Point,spacing:number)=>{const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/spacing));return Array.from({length:n+1},(_,i)=>[a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n] as Point);};
export function lakeRoadWallRuns(chunk:WorldChunkData,water:(x:number,z:number)=>boolean):WallRun[]{
 if(!['0_-1','0_-2','0_-3'].includes(chunk.key))return [];
 const out:WallRun[]=[];
 const mappedWalls=chunk.walls.flatMap(w=>pairs(w.pts));
 const entrances=chunk.roads.filter(r=>r.ref!=='A591'&&r.kind!=='ferry').flatMap(r=>pairs(r.pts).map(s=>({...s,clear:displayHalfWidth(r)+(r.kind==='footpath'?1.1:2.7)})));
 const buildings=chunk.buildings.map(b=>b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as Point));
 const roads=chunk.roads.filter(r=>r.ref==='A591'&&r.name==='Lake Road'&&r.id!==537774261&&r.id!==538808326).flatMap(r=>pairs(r.pts).map(s=>({...s,width:displayHalfWidth(r)})));
 roads.push(...pairs(crossTileLakeRoad).map(s=>({...s,width:4.4})));
 const tile=(x:number,z:number)=>Math.floor(x/500)===chunk.cx&&Math.floor(z/500)===chunk.cz;
 const buildingClear=(x:number,z:number,margin:number)=>!buildings.some(p=>pointInRing(x,z,p)||p.some((b,i)=>segmentDistance(x,z,p[(i+p.length-1)%p.length],b)<margin));
 const existingClear=(x:number,z:number)=>!mappedWalls.some(s=>segmentDistance(x,z,s.a,s.b)<1.1);
 if(chunk.key==='0_-1'){
  for(const {a,b} of pairs(WATERHEAD_CAR_PARK_WALL)){
   const pts=samples(a,b,1.8);
   for(const s of pairs(pts))if([s.a,s.b].every(([x,z])=>!water(x,z)&&buildingClear(x,z,.5)&&entrances.every(e=>segmentDistance(x,z,e.a,e.b)>e.clear)))out.push({...s,kind:'parking'});
  }
 }
 // Provisional roadside infill only in the Waterhead–Ambleside corridor.
 // Preserve all known roads/paths and a conservative access envelope near homes.
 const safe=(x:number,z:number)=>tile(x,z)&&!(chunk.key==='0_-1'&&petJunctionReserved(x,z))&&z<-8&&z>-1180&&!water(x,z)&&buildingClear(x,z,9)&&existingClear(x,z)&&entrances.every(e=>segmentDistance(x,z,e.a,e.b)>e.clear)&&roads.every(r=>segmentDistance(x,z,r.a,r.b)>r.width+.65);
 for(const r of roads){
  const dx=r.b[0]-r.a[0],dz=r.b[1]-r.a[1],len=Math.hypot(dx,dz);if(len<.1)continue;
  for(const side of [-1,1]){
   const off=r.width+2.6,nx=-dz/len*side,nz=dx/len*side;
   const pts=samples([r.a[0]+nx*off,r.a[1]+nz*off],[r.b[0]+nx*off,r.b[1]+nz*off],2);
   for(const s of pairs(pts)){
    const mx=(s.a[0]+s.b[0])/2,mz=(s.a[1]+s.b[1])/2;
    // The car park already has its own boundary; leave its access strip open.
    if(mz>-482&&mz<-405&&nx<0)continue;
    if([s.a,[mx,mz] as Point,s.b].every(([x,z])=>safe(x,z)))out.push({...s,kind:'roadside'});
   }
  }
 }
 return out;
}
