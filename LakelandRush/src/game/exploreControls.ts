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
