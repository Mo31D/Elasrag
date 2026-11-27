import type {BuildingFeature} from '../types/game';
import {streetEdge} from './blackSheepStreet';
export const LIBRARY_ID=239881389;
export const LIBRARY_NEIGHBOURS=[423644522,423644523] as const;
export const KELSICK_CHUNK='0_-3';
export const KELSICK_ROADS=[1387763407,1387763406,614194823];
export type P=[number,number];
const road:P[]=[[-3.498,-1383.523],[.576,-1383.98],[11.75,-1385.605],[16.245,-1386.15],[26.829,-1387.553]];
export function kelsickZ(x:number){for(let i=1;i<road.length;i++){const a=road[i-1],b=road[i];if(x<=b[0]||i===road.length-1)return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return road[0][1];}
export function libraryEdge(b:BuildingFeature){return streetEdge(b,b.id===LIBRARY_ID?8:b.id===423644522?0:0);}
export const SHELTERS=[{x:18.3,z:kelsickZ(18.3)-6.1,length:4.0},{x:-3.4,z:kelsickZ(-3.4)-6.1,length:4.2}];
export function busStopPavements():P[][]{
 const out:P[][]=[];
 for(const s of SHELTERS){const a=s.x-s.length/2-.45,b=s.x+s.length/2+.45;out.push([[a,kelsickZ(a)-4.35],[b,kelsickZ(b)-4.35],[b,s.z-1.25],[a,s.z-1.25]]);}
 // Library frontage pavement follows building edge, leaving the mapped road intact.
 for(const [a,b,az,bz] of [[3.6,11.75,-1377,-1379.13],[11.75,20.6,-1379.13,-1381.4]]){
 const za=kelsickZ(a)+4.4,zb=kelsickZ(b)+4.4;
 if(az>za&&bz>zb)out.push([[a,za],[b,zb],[b,bz],[a,az]]);
 }
 return out;
}
export function busStopBay():P[][]{
 const out:P[][]=[];for(const s of SHELTERS){const a=s.x-5,b=s.x+5;for(let x=a;x<b;x+=1.8){const u=Math.min(b,x+.85);out.push([[x,kelsickZ(x)-1.9],[u,kelsickZ(u)-1.9],[u,kelsickZ(u)-1.80],[x,kelsickZ(x)-1.80]]);}
 for(const x of [a,b])out.push([[x,kelsickZ(x)-4.22],[x+.10,kelsickZ(x+.10)-4.22],[x+.10,kelsickZ(x+.10)-1.8],[x,kelsickZ(x)-1.8]]);}
 return out;
}
export function shelterClearance(x:number,z:number){return SHELTERS.some(s=>Math.abs(x-s.x)<s.length/2+1.6&&Math.abs(z-s.z)<3.1);}
