import type { WorldChunkData, RoadFeature } from '../types/game';
import { pointInRing } from './projection';

export interface RoadSignAnchor {
  id: string; name: string; ref?: string; x: number; z: number; yaw: number;
  placement: 'estimated'; roadId: number;
}
export function halfWidth(r: RoadFeature): number {
  return r.widthM && r.widthM > 0 ? r.widthM/2 :
    r.kind === 'primary' ? 4.4 : r.kind === 'secondary' ? 3.4 :
    r.kind === 'lane' ? 2.6 : r.sidewalk ? .85 : 1.35;
}
function distanceToSegment(x:number,z:number,a:number[],b:number[]):number {
  const dx=b[0]-a[0], dz=b[1]-a[1];
  const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));
  return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);
}
// No invented destination arrows. Anchors are illustrative road identity plates,
// NOT surveyed UK traffic sign positions. Use only source names and road refs.
export function planRoadSigns(chunk: WorldChunkData, isWater:(x:number,z:number)=>boolean, size=500):RoadSignAnchor[] {
  const result: RoadSignAnchor[]=[];
  const seen=new Set<string>();
  const roads=chunk.roads.filter(r=>['primary','secondary','lane'].includes(r.kind) && (r.name?.trim() || r.ref?.trim()) && !r.bridge)
    .sort((a,b)=>Number(Boolean(b.ref))-Number(Boolean(a.ref))||a.id-b.id);
  for(const r of roads) {
    const name=r.name?.trim()||r.ref!.trim(), ref=r.ref?.trim();
    const key=name.toLowerCase()+'|'+(ref||'');
    if(seen.has(key))continue;
    const segments=r.pts.slice(1).map((b,i)=>({a:r.pts[i],b,length:Math.hypot(b[0]-r.pts[i][0],b[1]-r.pts[i][1])})).filter(s=>s.length>=8).sort((a,b)=>b.length-a.length);
    let found=false;
    for(const {a,b,length} of segments) {
      const dx=(b[0]-a[0])/length,dz=(b[1]-a[1])/length;
      for(const t of [.5,.25,.75]) {
        for(const side of [-1,1]) {
          const off=halfWidth(r)+1.8;
          const x=a[0]+dx*length*t-dz*off*side,z=a[1]+dz*length*t+dx*off*side;
          if(Math.floor(x/size)!==chunk.cx||Math.floor(z/size)!==chunk.cz||isWater(x,z))continue;
          if(result.some(s=>Math.hypot(s.x-x,s.z-z)<18))continue;
          if(chunk.buildings.some(b=>{
            const ring=b.pts.map(([px,pz])=>[px+b.cx,pz+b.cz] as [number,number]);
            return pointInRing(x,z,ring)||ring.some((p,i)=>distanceToSegment(x,z,p,ring[(i+1)%ring.length])<1.4);
          }))continue;
          if(chunk.roads.some(other=>other.kind!=='ferry'&&other.pts.slice(1).some((p,i)=>distanceToSegment(x,z,other.pts[i],p)<halfWidth(other)+.7)))continue;
          if(chunk.walls.some(w=>w.pts.slice(1).some((p,i)=>distanceToSegment(x,z,w.pts[i],p)<.8)))continue;
          result.push({id:'road-'+r.id,name,ref,x,z,yaw:ref?Math.atan2(dx,dz):Math.atan2(-dz,dx),placement:'estimated',roadId:r.id});
          seen.add(key);found=true;break;
        }
        if(found)break;
      }
      if(found)break;
    }
    if(result.length>=12)break;
  }
  return result;
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
// A separate off-road board near a specified approach; does not assert a real sign exists.
export function approachAnchor(chunk:WorldChunkData,point:[number,number],toward:[number,number],isWater:(x:number,z:number)=>boolean){
  const dx=toward[0]-point[0],dz=toward[1]-point[1],len=Math.hypot(dx,dz);
  if(len<1)return null;
  for(const back of [12,20,28,36])for(const side of [-1,1])for(const offset of [7,9,12]){
    const x=point[0]-dx/len*back-dz/len*offset*side,z=point[1]-dz/len*back+dx/len*offset*side;
    if(Math.floor(x/500)!==chunk.cx||Math.floor(z/500)!==chunk.cz||isWater(x,z))continue;
    if(chunk.buildings.some(b=>{const ring=b.pts.map(([px,pz])=>[px+b.cx,pz+b.cz] as [number,number]);return pointInRing(x,z,ring)||ring.some((p,i)=>distanceToSegment(x,z,p,ring[(i+1)%ring.length])<1.6)}))continue;
    if(chunk.roads.some(r=>r.kind!=='ferry'&&r.pts.slice(1).some((p,i)=>distanceToSegment(x,z,r.pts[i],p)<halfWidth(r)+1.6)))continue;
    if(chunk.walls.some(w=>w.pts.slice(1).some((p,i)=>distanceToSegment(x,z,w.pts[i],p)<1.6)))continue;
    if(!chunk.roads.some(r=>r.kind==='primary'&&r.pts.slice(1).some((p,i)=>distanceToSegment(x,z,r.pts[i],p)<15)))continue;
    return {x,z,yaw:Math.atan2(-dx,-dz)};
  }
  return null;
}
