import type {WorldChunkData} from '../types/game';
import {pointInRing} from './projection';
import {displayHalfWidth} from './roadPresentation';
import {segmentDistance,type Point} from './parking';
import realm from '../data/waterhead-public-realm.json';
import surfaces from '../data/ambleside-surfaces.json';
export const GRASS_RADIUS=25,GRASS_SPACING=.65,GRASS_MAX=4800;
export function grassHash(x:number,z:number,salt=0){let n=Math.imul(x,374761393)^Math.imul(z,668265263)^Math.imul(salt+1,1274126177);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296;}
export function grassExclusion(chunk:WorldChunkData,water:(x:number,z:number)=>boolean){
 const polygons:Point[][]=[...chunk.buildings.map(b=>b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as Point)),...(surfaces[chunk.key as keyof typeof surfaces]??[]).map(s=>s.points as Point[])];
 if(chunk.key==='0_-1')polygons.push(...realm.parking.map(s=>s.points as Point[]),...realm.shore.map(s=>s.points as Point[]),[[66.1,-373.2],[75.6,-367.7],[79.8,-371.1],[68.3,-377.8]],[[85.3,-361],[91.1,-364.0],[101,-342.6],[97.0,-338.9]]);
 const poly=polygons.map(r=>({r,minX:Math.min(...r.map(p=>p[0]))-.35,maxX:Math.max(...r.map(p=>p[0]))+.35,minZ:Math.min(...r.map(p=>p[1]))-.35,maxZ:Math.max(...r.map(p=>p[1]))+.35}));
 const paths=chunk.roads.filter(r=>r.kind!=='ferry').map(r=>({pts:r.pts,width:displayHalfWidth(r)+.55}));
 if(chunk.key==='0_-1')paths.push(...realm.sidewalk.map(s=>({pts:s.points as Point[],width:1.25})));
 const segments=paths.flatMap(r=>r.pts.slice(1).map((b,i)=>({a:r.pts[i],b,w:r.width})));
 // Spatial bins keep checks inexpensive on town chunks.
 const bins=new Map<string,typeof segments>();
 for(const s of segments)for(let x=Math.floor((Math.min(s.a[0],s.b[0])-s.w)/16);x<=Math.floor((Math.max(s.a[0],s.b[0])+s.w)/16);x++)for(let z=Math.floor((Math.min(s.a[1],s.b[1])-s.w)/16);z<=Math.floor((Math.max(s.a[1],s.b[1])+s.w)/16);z++){const k=x+':'+z,list=bins.get(k)??[];list.push(s);bins.set(k,list);}
 return (x:number,z:number)=>{
  if(water(x,z))return true;
  if(poly.some(p=>x>=p.minX&&x<=p.maxX&&z>=p.minZ&&z<=p.maxZ&&(pointInRing(x,z,p.r)||p.r.some((b,i)=>segmentDistance(x,z,b,p.r[(i+1)%p.r.length])<.35))))return true;
  return (bins.get(Math.floor(x/16)+':'+Math.floor(z/16))??[]).some(s=>segmentDistance(x,z,s.a,s.b)<s.w);
 };
}
export function grassCandidates(chunk:WorldChunkData,x:number,z:number,blocked:(x:number,z:number)=>boolean){
 const out:{x:number;z:number;seed:number}[]=[];
 const minX=Math.max(chunk.cx*500+.45,x-GRASS_RADIUS),maxX=Math.min((chunk.cx+1)*500-.45,x+GRASS_RADIUS),minZ=Math.max(chunk.cz*500+.45,z-GRASS_RADIUS),maxZ=Math.min((chunk.cz+1)*500-.45,z+GRASS_RADIUS);
 for(let i=Math.ceil(minX/GRASS_SPACING);i<=Math.floor(maxX/GRASS_SPACING);i++)for(let j=Math.ceil(minZ/GRASS_SPACING);j<=Math.floor(maxZ/GRASS_SPACING);j++){
  const px=(i+(grassHash(i,j,1)-.5)*.65)*GRASS_SPACING,pz=(j+(grassHash(i,j,2)-.5)*.65)*GRASS_SPACING;
  if(px<minX||px>maxX||pz<minZ||pz>maxZ||Math.hypot(px-x,pz-z)>GRASS_RADIUS||blocked(px,pz))continue;
  const seed=grassHash(i,j,3);if(seed<.18)continue;
  out.push({x:px,z:pz,seed});if(out.length>=GRASS_MAX)return out;
 }
 return out;
}
