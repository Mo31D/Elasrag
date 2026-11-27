export type Threat={x:number;z:number;radius:number};
export function fleeDirection(x:number,z:number,threats:readonly Threat[]){
 let dx=0,dz=0,alarm=0;for(const t of threats){const a=x-t.x,b=z-t.z,d=Math.hypot(a,b);if(d>=t.radius)continue;const w=1-d/t.radius;dx+=(d>.001?a/d:1)*w;dz+=(d>.001?b/d:0)*w;alarm=Math.max(alarm,w);}
 return alarm>0?{yaw:Math.atan2(-dx,-dz),alarm}:null;
}
export function nextWalkDistance(d:number,dir:1|-1,speed:number,dt:number,length:number){
 let n=d+dir*speed*dt;if(n>=length)return {distance:length,dir:-1 as const};if(n<=0)return {distance:0,dir:1 as const};return {distance:n,dir};
}
