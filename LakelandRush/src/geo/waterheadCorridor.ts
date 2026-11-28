import type {WorldChunkData} from '../types/game';
import {displayHalfWidth} from './roadPresentation';
import {pointInRing} from './projection';
import {segmentDistance,type Point} from './parking';
export const CORRIDOR_CHUNKS=['0_-1','0_-2'];
export const INN_ID=423874287,LAKEHOUSE_ID=423874291,APARTMENTS_ID=698103904;
// Existing Lake Road centerline from the two streamed tiles, not photo intervals.
const road:Point[]=[[130.979,-276.184],[130.623,-278.655],[130.092,-282.573],[129.127,-302.722],[129.004,-305.338],[128.965,-312.251],[129.678,-326.89],[135.157,-353.272],[137.891,-365.217],[141.79,-385.633],[147.03,-411.314],[153.1,-438.922],[165.18,-472.885],[169.41,-492.255],[170.297,-522.857],[166.476,-539.677],[146.253,-593.667],[139.18,-619.627],[133.642,-648.881],[132.618,-679.35],[134.95,-738.126],[135.028,-753.711],[134.283,-780.628]];
export function corridorPoint(z:number,offset:number):Point{
 let i=road.findIndex((p,i)=>i>0&&z>=p[1]);if(i<1)i=road.length-1;
 const a=road[i-1],b=road[i],s=(b[0]-a[0])/(b[1]-a[1]);
 return [a[0]+(z-a[1])*s+offset*Math.hypot(1,s),z];
}
export function corridorYaw(z:number){const a=corridorPoint(z+1,0),b=corridorPoint(z-1,0);return Math.atan2(b[0]-a[0],b[1]-a[1]);}
export function corridorDetailedWall(x:number,z:number){return z<-278.1&&z>-408&&Math.abs(x-corridorPoint(z,0)[0])<12;}
export function corridorPlan(chunk:WorldChunkData){
 const empty={walls:[] as {a:Point;b:Point;side:number}[],paving:[] as Point[][],plants:[] as {x:number;z:number;size:number;tree:boolean}[],shelters:[] as {x:number;z:number;side:number;yaw:number}[]};
 if(!CORRIDOR_CHUNKS.includes(chunk.key))return empty;
 const buildings=chunk.buildings.map(b=>b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as Point));
 const segments=chunk.roads.filter(r=>r.kind!=='ferry'&&r.ref!=='A591').flatMap(r=>r.pts.slice(1).map((b,i)=>({a:r.pts[i],b,w:displayHalfWidth(r),path:r.kind==='footpath'})));
 const inTile=(x:number,z:number)=>Math.floor(x/500)===chunk.cx&&Math.floor(z/500)===chunk.cz;
 const clear=(p:Point,r:number,paths=true)=>inTile(...p)&&!buildings.some(b=>pointInRing(...p,b)||b.some((a,i)=>segmentDistance(...p,a,b[(i+1)%b.length])<r))&&!segments.some(s=>(paths||!s.path)&&segmentDistance(...p,s.a,s.b)<s.w+r);
 const existing=chunk.walls.flatMap(w=>w.pts.slice(1).map((b,i)=>({a:w.pts[i],b})));
 // Exact local order: on left pavement and dark stone boundary; on right raised garden.
 for(const side of [-1,1])for(let z=-280;z>-407;z-=1.5){
  const z2=z-1.5,off=side*(side<0?6.35:6.65),a=corridorPoint(z,off),b=corridorPoint(z2,off),mid=corridorPoint((z+z2)/2,off);
  // Leave real hotel parking and both mapped driveways open.
  const parking=side<0&&z>-360&&z<-314;
  const driveway=side>0&&((z>-289&&z<-278)||(z>-374&&z<-360));
  const gardenSteps=side>0&&z>-313&&z<-309;
  if(!parking&&!driveway&&!gardenSteps&&[a,b,mid].every(p=>clear(p,.5)&&!existing.some(s=>segmentDistance(...p,s.a,s.b)<.65)))empty.walls.push({a,b,side});
  if(side<0||z>-333){
   const p=[corridorPoint(z,side*4.42),corridorPoint(z2,side*4.42),corridorPoint(z2,side*6.03),corridorPoint(z,side*6.03)];
   if(!driveway&&!parking&&p.every(q=>clear(q,.10,false)))empty.paving.push(p);
  }
 }
 // Two photographed shelters: small east-side unit before the inn, glazed west-side unit after it.
 if(chunk.key==='0_-1')for(const [side,guess] of [[1,-308],[-1,-400]]){
  for(const shift of [0,2,-2,4,-4,6,-6,8,-8]){
   const z=guess+shift,p=corridorPoint(z,side*5.48);
   if(![z-1.55,z,z+1.55].every(q=>clear(corridorPoint(q,side*5.48),.42,false)))continue;
   empty.shelters.push({x:p[0],z,side,yaw:corridorYaw(z)+(side<0?Math.PI:0)});break;
  }
 }
 // Continuous roadside foliage, with clearance for buildings, paths and driveways.
 for(let z=-291;z>-780;z-=4.4)for(const side of [-1,1]){
  if(side<0&&z>-490)continue; // hotel and Waterhead parking stay open
  const tree=Math.round(-z/4.4)%4===0;
  const off=side*(tree?11.8:8.0),p=corridorPoint(z,off),size=tree?3.8:1.1+(Math.sin(z*2.3)+1)*.42;
  if(clear(p,tree?1.9:1.05)&&!empty.shelters.some(s=>Math.hypot(p[0]-s.x,p[1]-s.z)<3))empty.plants.push({x:p[0],z:p[1],size,tree});
 }
 return empty;
}
