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
