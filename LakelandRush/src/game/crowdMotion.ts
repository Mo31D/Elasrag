export type Threat={x:number;z:number;radius:number};
export function fleeDirection(x:number,z:number,threats:readonly Threat[]){
 let dx=0,dz=0,alarm=0;for(const t of threats){const a=x-t.x,b=z-t.z,d=Math.hypot(a,b);if(d>=t.radius)continue;const w=1-d/t.radius;dx+=(d>.001?a/d:1)*w;dz+=(d>.001?b/d:0)*w;alarm=Math.max(alarm,w);}
 return alarm>0?{yaw:Math.atan2(-dx,-dz),alarm}:null;
}
export function nextWalkDistance(d:number,dir:1|-1,speed:number,dt:number,length:number){
 let n=d+dir*speed*dt;if(n>=length)return {distance:length,dir:-1 as const};if(n<=0)return {distance:0,dir:1 as const};return {distance:n,dir};
}

// Shared local perception: oriented vehicle footprints sampled along the actual
// route, rather than distance to an oversized sphere around the vehicle.
export type VehicleForecast={x:number;z:number;yaw:number;halfWidth:number;halfLength:number;eta:number};
export function hullClearance(x:number,z:number,b:VehicleForecast){
 const dx=x-b.x,dz=z-b.z,u=Math.abs(dx*Math.cos(b.yaw)-dz*Math.sin(b.yaw))-b.halfWidth,v=Math.abs(dx*Math.sin(b.yaw)+dz*Math.cos(b.yaw))-b.halfLength;
 return Math.hypot(Math.max(0,u),Math.max(0,v))+Math.min(0,Math.max(u,v));
}
export function forecastRisk(x:number,z:number,forecast:readonly VehicleForecast[]){
 let risk=0;for(const b of forecast){const d=hullClearance(x,z,b);risk=Math.max(risk,Math.max(0,1-d/(b.eta===0?1.25:2.0))*(1-b.eta*.12));}return risk;
}
export function chooseRefuge(x:number,z:number,candidates:readonly {x:number;z:number;offset:number}[],forecast:readonly VehicleForecast[],clear:(x:number,z:number)=>boolean){
 const current=forecastRisk(x,z,forecast);let best:null|{x:number;z:number;offset:number}=null,score=current;
 for(const p of candidates){if(!clear(p.x,p.z))continue;const d=Math.hypot(p.x-x,p.z-z);if(d<.03)continue;
  const cost=forecastRisk(p.x,p.z,forecast)+d*.035;
  if(cost<score-.025){score=cost;best=p;}
 }return best;
}
export function rememberedAlarm(previous:number,observed:number,dt:number){return Math.max(observed,previous-dt*.23,0);}
export function safeTrafficThrottle(requested:number,clearance:number,speed:number){
 if(!Number.isFinite(clearance))return requested;
 const stopping=Math.abs(speed)*.65+speed*speed/(2*3.2)+1.2;
 if(clearance<=1.0)return 0;
 return requested*Math.max(0,Math.min(1,(clearance-1)/(Math.max(2,stopping))));
}
