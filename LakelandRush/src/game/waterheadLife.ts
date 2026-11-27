// Approximate scenic game route, not a real cruise schedule. Coordinates in existing world metres.
export const CRUISE_CENTER=[-55,-190] as const;
export const CRUISE_RADII=[36,110] as const;
export const CRUISE_SPEED=3.8;
export type CruisePose={x:number;z:number;yaw:number};
const N=720;
function at(a:number):CruisePose{
 const [rx,rz]=CRUISE_RADII;
 return {x:CRUISE_CENTER[0]+rx*Math.cos(a),z:CRUISE_CENTER[1]+rz*Math.sin(a),yaw:Math.atan2(rx*Math.sin(a),-rz*Math.cos(a))};
}
const samples=Array.from({length:N+1},(_,i)=>at(i*Math.PI*2/N));
const distance=[0];for(let i=1;i<=N;i++)distance.push(distance[i-1]+Math.hypot(samples[i].x-samples[i-1].x,samples[i].z-samples[i-1].z));
export const CRUISE_LENGTH=distance[N];
export function cruisePose(metres:number):CruisePose{
 const d=((metres%CRUISE_LENGTH)+CRUISE_LENGTH)%CRUISE_LENGTH;
 let lo=0,hi=N;while(hi-lo>1){const mid=(lo+hi)>>1;if(distance[mid]<=d)lo=mid;else hi=mid;}
 return at((lo+(d-distance[lo])/(distance[hi]-distance[lo]))*Math.PI*2/N);
}
export function cruiseHullWet(p:CruisePose,wet:(x:number,z:number)=>boolean):boolean{
 for(const u of [-5,0,5])for(const v of [-24,-12,0,12,24]){
  if(!wet(p.x+u*Math.cos(p.yaw)+v*Math.sin(p.yaw),p.z-u*Math.sin(p.yaw)+v*Math.cos(p.yaw)))return false;
 }return true;
}
export function shorePoint(z:number,wet:(x:number,z:number)=>boolean):number|null{
 for(let x=105;x>=-30;x-=.5)if(wet(x,z))return x;
 return null;
}
