import {propulsionSpeed} from './propulsion';
import {compileRoutePolyline,sampleCompiledRoute,type CompiledRoute} from '../geo/projection';
export type BusState={distance:number;lane:number;speed:number;dir:1|-1};
export const BUS_HALF_LENGTH=5.1,BUS_HALF_WIDTH=1.26;
export function busRoute(points:number[][]){return compileRoutePolyline(points.map(p=>[p[0],p[1]]));}
export function busPose(route:CompiledRoute,s:BusState){
 const p=sampleCompiledRoute(route,s.distance),a=sampleCompiledRoute(route,s.distance-3),b=sampleCompiledRoute(route,s.distance+3);
 const d=Math.hypot(b.x-a.x,b.z-a.z)||1,tx=(b.x-a.x)/d*s.dir,tz=(b.z-a.z)/d*s.dir;
 return {x:p.x+tz*s.lane,z:p.z-tx*s.lane,yaw:Math.atan2(-tx,-tz)};
}
export function busFits(p:ReturnType<typeof busPose>,clear:(x:number,z:number)=>boolean){
 for(const u of [-BUS_HALF_WIDTH,0,BUS_HALF_WIDTH])for(const v of [-BUS_HALF_LENGTH,-2.5,0,2.5,BUS_HALF_LENGTH]){
  if(!clear(p.x+u*Math.cos(p.yaw)+v*Math.sin(p.yaw),p.z-u*Math.sin(p.yaw)+v*Math.cos(p.yaw)))return false;
 }return true;
}
export function stepBus(route:CompiledRoute,s:BusState,throttle:number,steer:number,dt:number,clear:(x:number,z:number)=>boolean,boost=false){
 const speed=propulsionSpeed('bus',s.speed,throttle,boost,dt);
 const distance=Math.max(7,Math.min(route.totalLength-7,s.distance+speed*dt*s.dir));
 const lane=Math.max(1.55,Math.min(2.45,s.lane-steer*dt*.8));
 const n={...s,distance,lane,speed:distance===s.distance?0:speed};
 // Swept samples in route space, including turns and all hull corners.
 const steps=Math.max(1,Math.ceil(Math.abs(distance-s.distance)/.2),Math.ceil(Math.abs(lane-s.lane)/.1));
 for(let i=1;i<=steps;i++){const k=i/steps;if(!busFits(busPose(route,{...n,distance:s.distance+(distance-s.distance)*k,lane:s.lane+(lane-s.lane)*k}),clear))return {...s,speed:0};}
 return n;
}
