import type { WorldChunkData } from '../types/game';
import { pointInRing } from './projection';
export type Point=[number,number];
export function segmentDistance(x:number,z:number,a:Point,b:Point){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);}
export function parkingSlots(ring:Point[],chunk:WorldChunkData,water:(x:number,z:number)=>boolean){
 const result:{x:number;z:number;yaw:number}[]=[];
 if(ring.length<3)return result;
 const edges=ring.map((a,i)=>({a,b:ring[(i+1)%ring.length]})).sort((u,v)=>Math.hypot(v.b[0]-v.a[0],v.b[1]-v.a[1])-Math.hypot(u.b[0]-u.a[0],u.b[1]-u.a[1]));
 const {a,b}=edges[0],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<5)return result;
 const dx=(b[0]-a[0])/len,dz=(b[1]-a[1])/len;
 for(const side of [-1,1])for(let t=3;t<len-2;t+=3.2){
 const x=a[0]+dx*t-dz*side*3.5,z=a[1]+dz*t+dx*side*3.5;
 const corners=[[-1.05,-2.3],[-1.05,2.3],[1.05,-2.3],[1.05,2.3]].map(([u,v])=>[x+dx*u-dz*v,z+dz*u+dx*v] as Point);
 if(!corners.every(([x,z])=>pointInRing(x,z,ring)&&!water(x,z)))continue;
 if(chunk.roads.some(r=>r.kind!=='ferry'&&r.pts.slice(1).some((p,i)=>segmentDistance(x,z,r.pts[i],p)<(r.widthM?r.widthM/2:r.kind==='primary'?4.4:r.kind==='secondary'?3.4:r.kind==='lane'?2.6:1.35)+2.5)))continue;
 if(chunk.buildings.some(b=>corners.some(([x,z])=>pointInRing(x,z,b.pts.map(([px,pz])=>[px+b.cx,pz+b.cz])))))continue;
 if(result.some(p=>Math.hypot(p.x-x,p.z-z)<3))continue;
 result.push({x,z,yaw:Math.atan2(-dz,dx)});if(result.length>=14)return result;
 }
 return result;
}
