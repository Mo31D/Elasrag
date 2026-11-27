import type {RoadFeature} from '../types/game';
type P=[number,number];
// Provisional rendering widths, based on clearance to existing mapped footprints.
// They are not measured carriageway widths. Keep source coordinates and OSM IDs unchanged.
const compstonHalfWidth:Readonly<Record<number,number>>={32132710:2.9,561321008:1.8,561321009:3.0,4600162:2.9,4600163:2.9};
export function displayHalfWidth(r:RoadFeature):number{
 return r.widthM&&r.widthM>0?r.widthM/2:compstonHalfWidth[r.id]??(r.kind==='primary'?4.4:r.kind==='secondary'?3.4:r.kind==='lane'?2.6:r.kind==='railway'?1.5:r.sidewalk?.85:1.35);
}
export function roadSurface(r:RoadFeature):'marked'|'asphalt'|'paving'|'gravel'|'railway'{
 if(r.kind==='railway')return 'railway';
 if(r.kind==='primary'||r.kind==='secondary')return r.oneway&&displayHalfWidth(r)<3.1?'asphalt':'marked';
 if(r.kind==='lane')return /gravel|ground|dirt|unpaved|compacted/i.test(r.surface??'')?'gravel':'asphalt';
 return r.sidewalk||/pav|sett|cobble|concrete|asphalt/i.test(r.surface??'')?'paving':'gravel';
}
function distance(x:number,z:number,a:P,b:P){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);}
// Leave markings off the immediate approaches of intersecting carriageways.
export function junctionPoints(r:RoadFeature,roads:readonly RoadFeature[]):P[]{
 const out:P[]=[];
 for(const other of roads){
  if(other.id===r.id||!['primary','secondary','lane'].includes(other.kind)||!!other.bridge!==!!r.bridge||!other.pts.length)continue;
  for(const p of [other.pts[0],other.pts[other.pts.length-1]]){
   if(r.pts.slice(1).some((b,i)=>distance(p[0],p[1],r.pts[i],b)<1.1))out.push(p);
  }
  for(const p of [r.pts[0],r.pts[r.pts.length-1]])if(p&&other.pts.slice(1).some((b,i)=>distance(p[0],p[1],other.pts[i],b)<1.1))out.push(p);
 }
 return out;
}
export function unmarkedNearJunction(a:P,b:P,junctions:readonly P[],radius:number){return junctions.some(p=>distance(p[0],p[1],a,b)<radius);}
export function convexFootprint(pts:readonly P[]):boolean{
 if(pts.length<3)return false;
 let sign=0;
 for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],c=pts[(i+2)%pts.length],v=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);if(Math.abs(v)<1e-6)continue;if(sign&&Math.sign(v)!==sign)return false;sign=Math.sign(v);}
 return sign!==0;
}
export function boardFaces(directional:boolean):readonly {side:number;yaw:number;reverse:boolean}[]{
 return [{side:1,yaw:0,reverse:false},{side:-1,yaw:Math.PI,reverse:directional}];
}
