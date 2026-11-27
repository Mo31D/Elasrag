import type {WorldChunkData,RoadFeature} from '../types/game';
import {pointInRing} from './projection';
import {displayHalfWidth} from './roadPresentation';

type P=[number,number];
export interface RoadSignAnchor {
 id:string;name:string;ref?:string;x:number;z:number;yaw:number;
 placement:'estimated';roadId:number;
}
export type SignAnchor={x:number;z:number;yaw:number;roadId:number;offsetM:number};
export function halfWidth(r:RoadFeature):number{
 return displayHalfWidth(r);
}
function project(x:number,z:number,a:P,b:P){
 const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
 if(len<.01)return null;
 const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(len*len)));
 return {x:a[0]+dx*t,z:a[1]+dz*t,dx:dx/len,dz:dz/len,len,t};
}
function distanceToSegment(x:number,z:number,a:P,b:P):number{
 const p=project(x,z,a,b);return p?Math.hypot(x-p.x,z-p.z):Math.hypot(x-a[0],z-a[1]);
}
const driving=(r:RoadFeature)=>['primary','secondary','lane'].includes(r.kind);
export const boardWidth=(style:'road'|'street'|'bus'|'rail'|'direction'|'welcome')=>style==='bus'?.82:style==='street'?1.2:style==='direction'?2.6:style==='welcome'?2.4:style==='rail'?1.5:1.55;
type Water=(x:number,z:number)=>boolean;
// Conservative circular clearance encloses the entire sign, not just the post.
// Leave a chunk boundary margin so a neighboring chunk cannot silently hide a conflicting road.
export function safeBoard(chunk:WorldChunkData,x:number,z:number,width:number,isWater:Water,size=500):boolean{
 const radius=width/2+.55,edge=7+radius;
 if(x<chunk.cx*size+edge||x>(chunk.cx+1)*size-edge||z<chunk.cz*size+edge||z>(chunk.cz+1)*size-edge)return false;
 if([[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius]].some(([dx,dz])=>isWater(x+dx,z+dz)))return false;
 if(chunk.roads.some(r=>r.kind!=='ferry'&&r.pts.slice(1).some((p,i)=>distanceToSegment(x,z,r.pts[i],p)<halfWidth(r)+radius)))return false;
 if(chunk.buildings.some(b=>{const ring=b.pts.map(([px,pz])=>[px+b.cx,pz+b.cz] as P);return pointInRing(x,z,ring)||ring.some((p,i)=>distanceToSegment(x,z,p,ring[(i+1)%ring.length])<radius+.3)}))return false;
 if(chunk.walls.some(w=>w.pts.slice(1).some((p,i)=>distanceToSegment(x,z,w.pts[i],p)<radius+.25)))return false;
 return true;
}
export function planRoadSigns(chunk:WorldChunkData,isWater:Water,size=500):RoadSignAnchor[]{
 const result:RoadSignAnchor[]=[],seen=new Set<string>();
 const roads=chunk.roads.filter(r=>driving(r)&&!r.bridge&&(r.name?.trim()||r.ref?.trim())).sort((a,b)=>Number(!!b.ref)-Number(!!a.ref)||a.id-b.id);
 for(const r of roads){
  const name=r.name?.trim()||r.ref!.trim(),ref=r.ref?.trim(),key=name.toLowerCase()+'|'+(ref||'');
  if(seen.has(key))continue;
  const width=boardWidth(ref?'road':'street');
  const segs=r.pts.slice(1).map((b,i)=>({a:r.pts[i],b,len:Math.hypot(b[0]-r.pts[i][0],b[1]-r.pts[i][1])})).filter(s=>s.len>=10).sort((a,b)=>b.len-a.len);
  let found=false;
  for(const {a,b,len} of segs){
   for(const t of [.5,.3,.7])for(const dir of (r.oneway?[r.direction===-1?-1:1]:[1,-1])){
    if(found)continue;
    const dx=(b[0]-a[0])/len*dir,dz=(b[1]-a[1])/len*dir;
    // UK left-hand traffic: left normal (dz,-dx). Route identity faces approaching traffic.
    const off=halfWidth(r)+width/2+1.1,x=a[0]+(b[0]-a[0])*t+dz*off,z=a[1]+(b[1]-a[1])*t-dx*off;
    if(!safeBoard(chunk,x,z,width,isWater,size)||result.some(s=>Math.hypot(s.x-x,s.z-z)<18))continue;
    result.push({id:'road-'+r.id,name,ref,x,z,yaw:ref?Math.atan2(-dx,-dz):Math.atan2(-dz,dx),placement:'estimated',roadId:r.id});
    seen.add(key);found=true;
   }
   if(found)break;
  }
  if(result.length>=12)break;
 }
 return result;
}
// Published stop coordinates are map identities, not necessarily physical pole locations.
// Use road bearing and a bounded same-side search; never snap to the opposite side or an unrelated road.
export function transitAnchor(chunk:WorldChunkData,stop:{x:number;z:number;bearing:number;mode:'bus'|'rail'},isWater:Water):SignAnchor|null{
 const width=boardWidth(stop.mode);
 if(stop.mode==='rail'){
   for(const d of [0,2,4,6,9,12])for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
     const x=stop.x+Math.sin(angle)*d,z=stop.z+Math.cos(angle)*d;
     if(safeBoard(chunk,x,z,width,isWater))return {x,z,yaw:angle,roadId:0,offsetM:d};
   }
   return null;
 }
 const theta=stop.bearing*Math.PI/180,bx=Math.sin(theta),bz=-Math.cos(theta);
 const candidates=chunk.roads.filter(r=>driving(r)&&!r.bridge).flatMap(r=>r.pts.slice(1).flatMap((b,i)=>{
   const p=project(stop.x,stop.z,r.pts[i],b);if(!p)return [];
   const d=Math.hypot(stop.x-p.x,stop.z-p.z),alignment=p.dx*bx+p.dz*bz;
   if(d>24||Math.abs(alignment)<.55)return [];
   const dir=alignment>=0?1:-1;
   if(r.oneway&&dir!==(r.direction===-1?-1:1))return [];
   return [{r,p,d,score:d+(1-Math.abs(alignment))*8+(r.kind==='lane'?2:0),dx:p.dx*dir,dz:p.dz*dir}];
 })).sort((a,b)=>a.score-b.score);
 const best=candidates[0];if(!best)return null;
 // Restrict all candidates to the selected road. Retain travel direction (not arbitrary OSM way order).
 for(const {r,p,dx,dz} of candidates.filter(c=>c.r.id===best.r.id))for(const shift of [0,2,-2,4,-4,6,-6,9,-9,12,-12])for(const extra of [.85,1.5,2.3,3.2,4.5]){
   const cx=p.x+dx*shift,cz=p.z+dz*shift,off=halfWidth(r)+width/2+extra;
   const x=cx+dz*off,z=cz-dx*off,offsetM=Math.hypot(x-stop.x,z-stop.z);
   if(offsetM>18||!safeBoard(chunk,x,z,width,isWater))continue;
   return {x,z,yaw:Math.atan2(-dz,dx),roadId:r.id,offsetM};
 }
 return null;
}
// Frontage is estimated from a real footprint edge that faces a mapped road.
export function frontageAnchor(b:WorldChunkData['buildings'][number],roads:RoadFeature[]){
  if(b.pts.length<3)return null;
  const ring=b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as [number,number]);
  let best:{x:number;z:number;yaw:number;width:number;distance:number}|null=null;
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);
    if(length<2)continue;
    const x=(a[0]+c[0])/2,z=(a[1]+c[1])/2;
    let nx=-dz/length,nz=dx/length;
    if(pointInRing(x+nx*.25,z+nz*.25,ring)){nx=-nx;nz=-nz;}
    let distance=Infinity;
    for(const r of roads)if(['primary','secondary','lane','footpath'].includes(r.kind))for(let j=1;j<r.pts.length;j++){
      const p=r.pts[j-1],q=r.pts[j],vx=q[0]-p[0],vz=q[1]-p[1],t=Math.max(0,Math.min(1,((x-p[0])*vx+(z-p[1])*vz)/(vx*vx+vz*vz||1)));
      const rx=p[0]+vx*t-x,rz=p[1]+vz*t-z;
      if(rx*nx+rz*nz>0)distance=Math.min(distance,Math.hypot(rx,rz));
    }
    if(distance<=40&&(!best||distance<best.distance))best={x:x+nx*.13,z:z+nz*.13,yaw:Math.atan2(nx,nz),width:Math.min(4.2,length*.78),distance};
  }
  return best;
}
// Northbound fork board: only place on the left of the actual incoming segment.
// Caller supplies the previous and junction points in travel order.
export function approachAnchor(chunk:WorldChunkData,point:P,toward:P,isWater:Water){
 const vx=toward[0]-point[0],vz=toward[1]-point[1],len=Math.hypot(vx,vz);
 if(len<1)return null;
 const dx=vx/len,dz=vz/len,width=boardWidth('direction');
 for(const back of [12,20,28,36])for(const offset of [7,9,12]){
  const x=toward[0]-dx*back+dz*offset,z=toward[1]-dz*back-dx*offset;
  if(!safeBoard(chunk,x,z,width,isWater))continue;
  if(!chunk.roads.some(r=>r.kind==='primary'&&r.pts.slice(1).some((p,i)=>distanceToSegment(x,z,r.pts[i],p)<15)))continue;
  return {x,z,yaw:Math.atan2(-dx,-dz)};
 }
 return null;
}
