import type {WorldChunkData} from '../types/game';
import {displayHalfWidth} from './roadPresentation';
import {pointInRing} from './projection';
import {segmentDistance,type Point} from './parking';
export const CORRIDOR_CHUNKS=['0_-1','0_-2'];
export const INN_ID=423874287,LAKEHOUSE_ID=423874291,APARTMENTS_ID=698103904;
// Existing Lake Road centerline from the two streamed tiles, not photo intervals.
const road:Point[]=[[130.979,-276.184],[130.623,-278.655],[130.092,-282.573],[129.127,-302.722],[129.004,-305.338],[128.965,-312.251],[129.678,-326.89],[135.157,-353.272],[137.891,-365.217],[141.79,-385.633],[147.03,-411.314],[153.1,-438.922],[165.18,-472.885],[169.41,-492.255],[170.297,-522.857],[166.476,-539.677],[146.253,-593.667],[139.18,-619.627],[133.642,-648.881],[132.618,-679.35],[134.95,-738.126],[135.028,-753.711],[134.283,-780.628],[132.968,-807.656],[131.88,-818.076],[125.707,-862.949]];
export function corridorPoint(z:number,offset:number):Point{
 let i=road.findIndex((p,i)=>i>0&&z>=p[1]);if(i<1)i=road.length-1;
 const a=road[i-1],b=road[i],s=(b[0]-a[0])/(b[1]-a[1]);
 return [a[0]+(z-a[1])*s+offset*Math.hypot(1,s),z];
}
export function corridorYaw(z:number){const a=corridorPoint(z+1,0),b=corridorPoint(z-1,0);return Math.atan2(b[0]-a[0],b[1]-a[1]);}
export const WOODED_END=-850;
export function woodedProfile(z:number,side:number){const retaining=side>0&&z<-635&&z>-777;return {height:side<0?.48:retaining?1.85:.72,offset:side<0?-6.65:retaining?4.95:6.0,fence:side<0&&z<-515&&z>-573,retaining};}
export function corridorDetailedWall(x:number,z:number){const dx=x-corridorPoint(z,0)[0];return Math.abs(dx)<12&&((z<-278.1&&z>-408)||(z<=-408&&z>WOODED_END&&(dx>0||z<-490)));}
export function corridorPlan(chunk:WorldChunkData){
 const empty={walls:[] as {a:Point;b:Point;side:number;height?:number;fence?:boolean;retaining?:boolean}[],paving:[] as Point[][],kerbs:[] as Point[][],edgePaint:[] as Point[][],shoulders:[] as Point[][],parked:[] as {x:number;z:number;yaw:number}[],lamps:[] as Point[],plants:[] as {x:number;z:number;size:number;tree:boolean;hedge?:boolean}[],shelters:[] as {x:number;z:number;side:number;yaw:number}[]};
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
 // West: footway and low wall. East: dense verge, parking stretch and retaining masonry.
 const parkingBand=(z:number)=>z<-510&&z>-578;
 const main=road.slice(1).map((b,i)=>({a:road[i],b}));
 const roadClear=(p:Point,margin:number)=>main.every(s=>segmentDistance(...p,s.a,s.b)>=4.4+margin);
 const cuts=[-408,-490,-500,-510,-515,-573,-578,-635,-777,WOODED_END,...road.map(p=>p[1]).filter(z=>z<-408&&z>WOODED_END)];
 for(let z=-408;z>WOODED_END;z-=2)cuts.push(z);
 const zs=[...new Set(cuts)].sort((a,b)=>b-a);
 const strip=(a:number,b:number,lo:number,hi:number):Point[]=>[corridorPoint(a,lo),corridorPoint(b,lo),corridorPoint(b,hi),corridorPoint(a,hi)];
 for(let i=1;i<zs.length;i++){
  const a=zs[i-1],b=zs[i],z=(a+b)/2;if(!inTile(...corridorPoint(z,0)))continue;
  for(const side of [-1,1]){
   if(side<0&&z>-490)continue;
   const p=woodedProfile(z,side),off=side>0&&parkingBand(z)?7.25:p.offset;
   const A=corridorPoint(a,off),B=corridorPoint(b,off),M=corridorPoint(z,off);
   const endpoints=[corridorPoint(a-.001,off),corridorPoint(b+.001,off),M];
   if((side<0||p.retaining)&&endpoints.every(q=>clear(q,.48)&&roadClear(q,.24)&&!existing.some(s=>segmentDistance(...q,s.a,s.b)<1.05)))empty.walls.push({a:A,b:B,side,height:p.height,fence:p.fence,retaining:p.retaining});
   if(side<0){
    if([M,corridorPoint(z,-5.35),corridorPoint(a-.001,-5.35),corridorPoint(b+.001,-5.35)].every(q=>clear(q,.08,false))){
     empty.paving.push(strip(a,b,-6.42,-4.40));empty.kerbs.push(strip(a,b,-4.56,-4.40));empty.edgePaint.push(strip(a,b,-4.24,-4.15));
    }
   }else if(parkingBand(z)&&[corridorPoint(z,5.5),corridorPoint(z,6.6),corridorPoint(a-.001,5.5),corridorPoint(b+.001,5.5)].every(q=>clear(q,.28,false))){
    empty.shoulders.push(strip(a,b,4.35,6.85));
   }
  }
 }
 for(let z=-515;z>-576;z-=5.9){
  const p=corridorPoint(z,5.55),yaw=corridorYaw(z),s=Math.sin(yaw),c=Math.cos(yaw);
  const corners=([-1,1].flatMap(u=>[-1,1].map(v=>[p[0]+u*.96*c+v*2.3*s,z-u*.96*s+v*2.3*c] as Point)));
  if(corners.every(q=>clear(q,.22)&&roadClear(q,.04)))empty.parked.push({x:p[0],z,yaw});
 }
 for(let z=-505;z>WOODED_END;z-=43){const p=corridorPoint(z,-6.08);if(clear(p,.22)&&roadClear(p,.2))empty.lamps.push(p);}
 // Continuous roadside foliage, with clearance for buildings, paths and driveways.
 for(let z=-291;z>WOODED_END;z-=4.4)for(const side of [-1,1]){
  if(side<0&&z>-490)continue; // hotel and Waterhead parking stay open
  const tree=Math.round(-z/4.4)%4===0;
  const wooded=z<-408,retaining=wooded&&woodedProfile(z,side).retaining;
  const off=side*(tree?11.8:wooded&&side>0&&!parkingBand(z)&&!retaining?6.65:8.0),p=corridorPoint(z,off),size=tree?(wooded?4.6:3.8):1.1+(Math.sin(z*2.3)+1)*.42;
  if(clear(p,tree?1.9:1.05)&&roadClear(p,tree?1.1:size+.25)&&!empty.shelters.some(s=>Math.hypot(p[0]-s.x,p[1]-s.z)<3)&&!empty.parked.some(s=>Math.hypot(p[0]-s.x,p[1]-s.z)<3.5))empty.plants.push({x:p[0],z:p[1],size,tree,hedge:retaining&&!tree});
 }
 // Staggered secondary growth avoids regularly spaced park-like trees.
 for(let z=-422;z>WOODED_END;z-=5.1)for(const side of [-1,1]){
  if(side<0&&z>-490)continue;const p=corridorPoint(z,side*(side>0&&parkingBand(z)?11.5:10.0));
  if(clear(p,1.5)&&roadClear(p,1.5))empty.plants.push({x:p[0],z:p[1],size:1.8+Math.sin(z)*.35,tree:false});
 }
 return empty;
}
