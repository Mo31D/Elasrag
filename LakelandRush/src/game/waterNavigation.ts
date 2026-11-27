import {propulsionSpeed} from './propulsion';
export {SWIM_SPEED} from './propulsion';
export type WaterMode='land'|'swimming'|'rowing';
export type BoatMotion={x:number;z:number;yaw:number;speed:number};
export type BoatKind='rowboat'|'motorboat';
// Water plane is y=0. Keep the timber bilge below it and the interior above it.
export const boatFloatOffset=(kind:BoatKind)=>kind==='rowboat'?.17:0;
export const boatSeatHeight=(kind:BoatKind)=>kind==='rowboat'?.34:.40;
export const ROW_BOAT_SPAWNS=[[63,-335,Math.PI/2],[72.5,-285,Math.PI/2],[70.5,-250,Math.PI/2]] as const;
export const MOTOR_BOAT_SPAWNS=[[69,-315,Math.PI/2],[72,-300,Math.PI/2],[72.5,-260,Math.PI/2]] as const;
export const boatFootprint=(kind:BoatKind)=>kind==='motorboat'?[[0,0],[0,-2.9],[0,2.65],[-1.03,-1.7],[1.03,-1.7],[-1.15,0],[1.15,0],[-1.05,2.4],[1.05,2.4]]:[[0,0],[0,-2.35],[0,1.94],[-.85,-.35],[.85,-.35],[-.75,1.4],[.75,1.4],[-.64,-1.42],[.64,-1.42]];
export function boatContains(b:BoatMotion,kind:BoatKind,x:number,z:number):boolean{
 const dx=x-b.x,dz=z-b.z,u=dx*Math.cos(b.yaw)-dz*Math.sin(b.yaw),v=dx*Math.sin(b.yaw)+dz*Math.cos(b.yaw);
 return Math.abs(u)<(kind==='motorboat'?1.30:1.0)&&v>(kind==='motorboat'?-3.05:-2.5)&&v<(kind==='motorboat'?2.8:2.1);
}
export function surfaceMode(previous:WaterMode,water:boolean,deck:boolean,y:number,flying:boolean):WaterMode{
 if(flying||!water||deck)return 'land';
 return previous==='swimming'||y<=.12?'swimming':'land';
}
export function boatFits(x:number,z:number,yaw:number,wet:(x:number,z:number)=>boolean,kind:BoatKind='rowboat'):boolean{
 return boatFootprint(kind).every(([u,v])=>wet(x+u*Math.cos(yaw)+v*Math.sin(yaw),z-u*Math.sin(yaw)+v*Math.cos(yaw)));
}
export function stepBoat(b:BoatMotion,steer:number,throttle:number,dt:number,wet:(x:number,z:number)=>boolean,kind:BoatKind='rowboat',boost=false):BoatMotion{
 const yaw=b.yaw-steer*dt*(kind==='motorboat'?.72:1.05),angle=boatFits(b.x,b.z,yaw,wet,kind)?yaw:b.yaw;
 const speed=propulsionSpeed(kind,b.speed,throttle,boost,dt);
 const x=b.x-Math.sin(angle)*speed*dt,z=b.z-Math.cos(angle)*speed*dt;
 const steps=Math.max(1,Math.ceil(Math.hypot(x-b.x,z-b.z)/.15));
 for(let i=1;i<=steps;i++){const t=i/steps;if(!boatFits(b.x+(x-b.x)*t,b.z+(z-b.z)*t,angle,wet,kind))return {...b,yaw:angle,speed:0};}
 return {x,z,yaw:angle,speed};
}
export function boatExit(b:BoatMotion,wet:(x:number,z:number)=>boolean,kind:BoatKind='rowboat'):{x:number;z:number}|null{
 for(const side of [1,-1])for(const d of kind==='motorboat'?[1.65,2.0,2.5]:[1.45,1.8,2.2]){
  const x=b.x+side*Math.cos(b.yaw)*d,z=b.z-side*Math.sin(b.yaw)*d;if(wet(x,z))return {x,z};
 }
 return null;
}
