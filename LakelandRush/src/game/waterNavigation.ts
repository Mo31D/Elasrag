export type WaterMode='land'|'swimming'|'rowing';
export type BoatMotion={x:number;z:number;yaw:number;speed:number};
export const SWIM_SPEED=1.65;
export const ROW_BOAT_SPAWNS=[[39,-283,.88],[49,-315,1.21],[60,-320,.78]] as const;
export function surfaceMode(previous:WaterMode,water:boolean,deck:boolean,y:number,flying:boolean):WaterMode{
 if(flying||!water||deck)return 'land';
 return previous==='swimming'||y<=.12?'swimming':'land';
}
export function boatFits(x:number,z:number,yaw:number,wet:(x:number,z:number)=>boolean):boolean{
 return [[0,0],[0,-2.35],[0,1.94],[-.85,-.35],[.85,-.35],[-.75,1.4],[.75,1.4],[-.64,-1.42],[.64,-1.42]].every(([u,v])=>wet(x+u*Math.cos(yaw)+v*Math.sin(yaw),z-u*Math.sin(yaw)+v*Math.cos(yaw)));
}
export function stepBoat(b:BoatMotion,steer:number,throttle:number,dt:number,wet:(x:number,z:number)=>boolean):BoatMotion{
 const yaw=b.yaw-steer*dt*1.05,angle=boatFits(b.x,b.z,yaw,wet)?yaw:b.yaw;
 const target=throttle>=0?throttle*3.2:throttle*1.15,speed=b.speed+(target-b.speed)*(1-Math.exp(-dt*2.1));
 const x=b.x-Math.sin(angle)*speed*dt,z=b.z-Math.cos(angle)*speed*dt;
 return boatFits(x,z,angle,wet)?{x,z,yaw:angle,speed}:{...b,yaw:angle,speed:0};
}
export function boatExit(b:BoatMotion,wet:(x:number,z:number)=>boolean):{x:number;z:number}|null{
 for(const side of [1,-1])for(const d of [1.45,1.8,2.2]){
  const x=b.x+side*Math.cos(b.yaw)*d,z=b.z-side*Math.sin(b.yaw)*d;if(wet(x,z))return {x,z};
 }
 return null;
}
