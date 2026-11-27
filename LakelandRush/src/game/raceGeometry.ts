import {sampleCompiledRoute,type CompiledRoute} from '../geo/projection';
import type {RaceRoadSegment} from '../types/game';
export function sectionAt(route:CompiledRoute,sections:RaceRoadSegment[]|undefined,d:number){let i=0;while(i<route.cumDist.length-2&&route.cumDist[i+1]<d)i++;return sections?.[i];}
export function raceWidth(route:CompiledRoute,sections:RaceRoadSegment[]|undefined,d:number,fallback:number){return Math.max(.4,Math.min(fallback,(sectionAt(route,sections,d)?.halfWidth??fallback)-.35));}
export function raceTrafficPose(route:CompiledRoute,sections:RaceRoadSegment[]|undefined,d:number,dir:1|-1,halfW:number,halfL:number){
 if(d<halfL+1||d>route.totalLength-halfL-1)return null;
 const s=sampleCompiledRoute(route,d),sec=sectionAt(route,sections,d);if(!sec?.drivable||!sec.roadId||(sec.direction&&sec.direction!==dir))return null;
 const lane=sec.direction?0:-dir*(sec.halfWidth*.48);
 if(sec.direction?sec.halfWidth<halfW+.22:Math.abs(lane)+halfW+.16>sec.halfWidth)return null;
 const x=s.x+s.rx*lane,z=s.z+s.rz*lane,yaw=Math.atan2(-s.tx,-s.tz)+(dir===-1?Math.PI:0);
 // All corners and side midpoints must fit the mapped carriageway, not just the vehicle centre.
 for(const u of [-halfW,0,halfW])for(const v of [-halfL,0,halfL]){
  const px=x+Math.cos(yaw)*u+Math.sin(yaw)*v,pz=z-Math.sin(yaw)*u+Math.cos(yaw)*v;
  let fits=false;for(let i=0;i<route.points.length-1;i++){if(route.cumDist[i]>d+halfL+8||route.cumDist[i+1]<d-halfL-8)continue;const a=route.points[i],b=route.points[i+1],q=sections?.[i];if(!q?.drivable||!q.roadId||(q.direction&&q.direction!==dir))continue;
   const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((px-a[0])*dx+(pz-a[1])*dz)/(dx*dx+dz*dz||1)));if(Math.hypot(px-a[0]-dx*t,pz-a[1]-dz*t)<=q.halfWidth-.1){fits=true;break;}}
  if(!fits)return null;
 }
 return {x,z,yaw,lane};
}
