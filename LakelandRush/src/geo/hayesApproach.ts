import type {WorldChunkData} from '../types/game';
import {pointInRing} from './projection';
import {segmentDistance,type Point} from './parking';
import {displayHalfWidth} from './roadPresentation';
export const HAYES_ID=171150926,HAYES_HOUSE_ID=1395711509,HAYES_GARAGE_ID=931144292;
export const HAYES_CHUNK='0_-2';
export const HAYES_FRONTAGES=[HAYES_HOUSE_ID,HAYES_GARAGE_ID,1473220610,423824334,1473220611,1473220612];
export const HAYES_ROOF_BAYS=[{x:97,z:-820,width:11,length:38},{x:49,z:-862,width:10,length:45,across:true}];
export function hayesReserved(x:number,z:number){return x>24&&x<125&&z<-755&&z>-875;}
export function hayesPlan(chunk:WorldChunkData){
 const out={paving:[] as Point[][],parking:[] as Point[][],cars:[] as {x:number;z:number;yaw:number}[],walls:[] as {a:Point;b:Point;height:number;fence:boolean}[],signs:[] as Point[],drains:[] as Point[]};
 if(chunk.key!==HAYES_CHUNK)return out;
 const rings=chunk.buildings.map(b=>b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as Point));
 const roads=chunk.roads.filter(r=>r.kind!=='ferry').flatMap(r=>r.pts.slice(1).map((b,i)=>({a:r.pts[i],b,w:displayHalfWidth(r),path:r.kind==='footpath'})));
 const walls=chunk.walls.flatMap(w=>w.pts.slice(1).map((b,i)=>({a:w.pts[i],b})));
 const clear=(p:Point,m=.2,road=true)=>!rings.some(b=>pointInRing(...p,b)||b.some((q,i)=>segmentDistance(...p,q,b[(i+1)%b.length])<m))&&(!road||!roads.some(r=>!r.path&&segmentDistance(...p,r.a,r.b)<r.w+m));
 const rect=(x:number,z:number,w:number,l:number):Point[]=>[[x-w/2,z-l/2],[x+w/2,z-l/2],[x+w/2,z+l/2],[x-w/2,z+l/2]];
 // The open courtyard inside the mapped U-shaped garden centre, never over its buildings.
 for(let z=-841;z<=-791;z+=4)for(let x=32;x<=80;x+=4){const p=rect(x,z,4,4);if([...p,[x,z] as Point].every(q=>clear(q,.22,false)))out.parking.push(p);}
 for(const z of [-831,-807])for(let x=35;x<=76;x+=3.15){const p=rect(x,z,2.15,4.6);if(p.every(q=>clear(q,.45))&&out.parking.some(r=>pointInRing(x,z,r)))out.cars.push({x,z,yaw:z===-831?0:Math.PI});}
 // Existing roads remain authoritative. West-side access points at -754 and -863.
 const centre=(z:number)=>{const p=[[135.028,-753.711],[134.283,-780.628],[132.968,-807.656],[131.88,-818.076],[125.707,-862.949],[123.505,-879.524],[119.709,-905.807]];let i=p.findIndex((a,i)=>i>0&&z>=a[1]);if(i<1)i=p.length-1;const a=p[i-1],b=p[i],s=(b[0]-a[0])/(b[1]-a[1]);return [a[0]+s*(z-a[1]),Math.hypot(1,s)];};
 const at=(z:number,offset:number):Point=>{const [x,s]=centre(z);return [x+offset*s,z];};
 for(let z=-850;z>-901;z-=1.5){const a=z,b=z-1.5;const p=[at(a,-6.15),at(b,-6.15),at(b,-4.46),at(a,-4.46)];if([...p,at((a+b)/2,-5.3)].every(q=>clear(q,.005)))out.paving.push(p);}
 // The fork's fenced triangular garden sits between the main and Old Lake Road.
 for(let z=-810;z>-829;z-=1.3){const a=at(z,6.2),b=at(z-1.3,6.2),mid=at(z-.65,6.2);if([a,b,mid].every(q=>clear(q,.55)&&!walls.some(w=>segmentDistance(...q,w.a,w.b)<.7)))out.walls.push({a,b,height:.52,fence:true});}
 for(const z of [-764,-856]){let chosen=false;for(const dz of [0,2,-2,4,-4,6,-6]){for(const off of [-9.1,-10.2,-8.2,-11.1,-12]){const p=at(z+dz,off);if([p,[p[0]-.85,p[1]] as Point,[p[0]+.85,p[1]] as Point].every(q=>clear(q,.25)&&!walls.some(w=>segmentDistance(...q,w.a,w.b)<.25))){out.signs.push(p);chosen=true;break;}}if(chosen)break;}}
 for(const z of [-862,-883,-895]){const p=at(z,-4.2);if(out.paving.some(r=>Math.min(...r.map(q=>Math.abs(q[1]-z)))<2))out.drains.push(p);}
 return out;
}
