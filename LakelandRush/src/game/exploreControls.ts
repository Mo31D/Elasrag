// Camera-relative movement for free exploration, independent of racing controls.
export function radialInput(x:number,y:number,deadZone=.12){
  if(!Number.isFinite(x)||!Number.isFinite(y))return {x:0,y:0};
  const length=Math.hypot(x,y);
  if(length<=deadZone)return {x:0,y:0};
  const strength=Math.min(1,(length-deadZone)/(1-deadZone));
  return {x:x/length*strength,y:y/length*strength};
}
export function cameraRelative(x:number,forward:number,yaw:number){
  const size=Math.max(1,Math.hypot(x,forward));x/=size;forward/=size;
  return {x:Math.cos(yaw)*x-Math.sin(yaw)*forward,z:-Math.sin(yaw)*x-Math.cos(yaw)*forward};
}
export function smoothAngle(current:number,target:number,dt:number){
  const delta=Math.atan2(Math.sin(target-current),Math.cos(target-current));
  return current+delta*(1-Math.exp(-16*dt));
}
export function slideMove(x:number,z:number,dx:number,dz:number,blocked:(x:number,z:number)=>boolean){
  if(!blocked(x+dx,z+dz))return {x:x+dx,z:z+dz};
  const nx=blocked(x+dx,z)?x:x+dx;
  return {x:nx,z:blocked(nx,z+dz)?z:z+dz};
}

export type ExplorePace='walk'|'run'|'sprint';
// Gameplay tuning, not a claim about real human speeds.
export const EXPLORE_MPH:Record<ExplorePace,number>={walk:6,run:10,sprint:20};
export const EXPLORE_PACE_LABEL:Record<ExplorePace,string>={walk:'Walk',run:'Faster walk',sprint:'Run'};
export const EXPLORE_SPEED:Record<ExplorePace,number>={walk:6*.44704,run:10*.44704,sprint:20*.44704};
// Keep legacy internal pace keys for saved settings and HUD compatibility.
export const EXPLORE_GRAVITY=28;
export const EXPLORE_JUMP_VELOCITY=5.8;
export const EXPLORE_JUMP_HEIGHT=EXPLORE_JUMP_VELOCITY**2/(2*EXPLORE_GRAVITY);
export function secondJumpVelocity(startY:number,currentY:number){
 const targetY=startY+2*EXPLORE_JUMP_HEIGHT;
 return Math.sqrt(2*EXPLORE_GRAVITY*Math.max(0,targetY-currentY));
}
export function advanceExploreJump(y:number,vy:number,dt:number){
 return {y:y+vy*dt-.5*EXPLORE_GRAVITY*dt*dt,vy:vy-EXPLORE_GRAVITY*dt};
}
export function paceSpeed(pace:ExplorePace,shift=false){return EXPLORE_SPEED[shift?'sprint':pace];}
export function floatingInput(origin:{x:number;y:number},point:{x:number;y:number},radius:number){
  return radialInput((point.x-origin.x)/Math.max(1,radius),(origin.y-point.y)/Math.max(1,radius));
}
// Substep at fast speed to prevent tunnelling through small collision features.
export function sweepMove(x:number,z:number,dx:number,dz:number,blocked:(x:number,z:number)=>boolean){
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.16));
 for(let i=0;i<steps;i++){const next=slideMove(x,z,dx/steps,dz/steps,blocked);x=next.x;z=next.z;}
 return {x,z};
}
