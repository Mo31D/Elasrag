import * as THREE from 'three';
import type { WorldChunkData,TerrainGridData,LakeData } from '../types/game';
import { sampleTerrainHeight,isPointInLake } from '../geo/projection';
import { parkingSlots,type Point } from '../geo/parking';
import type {Ground} from '../geo/surfaceGround';
import {groundSurface} from './waterfront';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import realm from '../data/waterhead-public-realm.json';
import surfaces from '../data/ambleside-surfaces.json';
export function buildSiteDetails(chunk:WorldChunkData,terrain:TerrainGridData|null,lake:LakeData|null,surfaceGround:Ground=(x,z)=>sampleTerrainHeight(terrain,x,z)){
 const group=new THREE.Group();group.name='Site details';const geometries:THREE.BufferGeometry[]=[];const materials:THREE.Material[]=[];const textures:THREE.Texture[]=[];
 const mat=(color:number,metalness=0)=>{const m=new THREE.MeshStandardMaterial({color,roughness:.65,metalness});materials.push(m);return m;};
 const glass=mat(0x31424c,.5),rubber=mat(0x23252a),silver=mat(0xcbd5d8,.5),red=mat(0xb82226),white=mat(0xf5f5ed),green=mat(0x167d38);
 function box(parent:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material){const geo=new THREE.BoxGeometry(w,h,d);geometries.push(geo);const mesh=new THREE.Mesh(geo,m);mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh;}
 function text(parent:THREE.Group,value:string,w:number,h:number,x:number,y:number,z:number,bg:string,fg:string){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 64px Arial';ctx.fillText(value,256,64,480);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);const m=new THREE.MeshBasicMaterial({map:t});materials.push(m);const g=new THREE.PlaneGeometry(w,h);geometries.push(g);const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 const ground=(x:number,z:number)=>Math.max(.45,surfaceGround(x,z));
 const sites=[...(chunk.key==='0_-1'?realm.parking:[]),...(surfaces[chunk.key as keyof typeof surfaces]??[]).filter(s=>/car park|low fold|miller bridge|rydal road/i.test(s.name))];
 const paint=[mat(0x465765,.35),mat(0xe7e9e5,.35),mat(0x9b2930,.35),mat(0x243d5d,.35),mat(0x686e72,.35)];
 const lines:THREE.BufferGeometry[]=[];
 const carColliders:{minX:number;maxX:number;minZ:number;maxZ:number;topY:number;isRoof:boolean;outline:Point[]}[]=[];
 for(const site of sites)for(const [i,p] of parkingSlots(site.points as Point[],chunk,(x,z)=>isPointInLake(lake,x,z)).entries()){
   const transform=(x:number,z:number):Point=>[p.x+x*Math.cos(p.yaw)+z*Math.sin(p.yaw),p.z-x*Math.sin(p.yaw)+z*Math.cos(p.yaw)];
   // Estimated bay markings follow the same validated parking slots as vehicles.
   for(const x of [-1.19,1.19])lines.push(groundSurface([transform(x-.045,-2.25),transform(x+.045,-2.25),transform(x+.045,2.25),transform(x-.045,2.25)],ground,.095,true));
   if(i%3===1)continue;
   const car=new THREE.Group();car.position.set(p.x,ground(p.x,p.z)+.08,p.z);car.rotation.y=p.yaw;
   const m=paint[(site.id+i)%paint.length];box(car,1.8,.62,4.25,0,.65,0,m);box(car,1.68,.56,2.25,0,1.15,.05,glass);box(car,1.72,.11,2.05,0,1.46,.08,m);
   box(car,1.62,.13,.09,0,.68,-2.15,white);box(car,1.62,.13,.09,0,.68,2.15,red);
   for(const x of [-.88,.88])for(const z of [-1.35,1.35]){const g=new THREE.CylinderGeometry(.32,.32,.22,12);g.rotateZ(Math.PI/2);geometries.push(g);const wheel=new THREE.Mesh(g,rubber);wheel.position.set(x,.32,z);car.add(wheel);}
   const outline=([[-.95,-2.2],[.95,-2.2],[.95,2.2],[-.95,2.2]] as Point[]).map(([x,z])=>[p.x+x*Math.cos(p.yaw)+z*Math.sin(p.yaw),p.z-x*Math.sin(p.yaw)+z*Math.cos(p.yaw)] as Point);
   carColliders.push({minX:Math.min(...outline.map(p=>p[0])),maxX:Math.max(...outline.map(p=>p[0])),minZ:Math.min(...outline.map(p=>p[1])),maxZ:Math.max(...outline.map(p=>p[1])),topY:car.position.y+1.55,isRoof:false,outline});
   group.add(car);
 }
 if(lines.length){const g=mergeGeometries(lines);lines.forEach(g=>g.dispose());if(g){geometries.push(g);const markings=new THREE.Mesh(g,white);markings.receiveShadow=true;group.add(markings);}}
 if(chunk.key==='0_-3'){
   // BP/SPAR identity confirmed by operator portfolio; dimensions and artwork are illustrative.
   const canopy=chunk.buildings.find(b=>b.id===658735202);
   if(canopy){
     const g=new THREE.Group();g.position.set(canopy.cx,ground(canopy.cx,canopy.cz),canopy.cz);
     const maxX=Math.max(...canopy.pts.map(p=>p[0])),minZ=Math.min(...canopy.pts.map(p=>p[1])),maxZ=Math.max(...canopy.pts.map(p=>p[1]));
     const fascia=new THREE.Group();fascia.position.set(maxX+.04,4.05,(minZ+maxZ)/2);fascia.rotation.y=Math.PI/2;
     box(fascia,Math.min(12,maxZ-minZ),.52,.12,0,0,0,green);text(fascia,'BP',2.1,.49,0,0,.08,'#167d38','#ffffff');g.add(fascia);
     group.add(g);
   }
 }
 return {group,colliders:carColliders,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
