import * as THREE from 'three';
import type {WorldChunkData} from '../types/game';
import type {Ground} from '../geo/surfaceGround';
import {grassExclusion,grassCandidates,plantFamily,GRASS_RADIUS,GRASS_MAX,type PlantFamily} from '../geo/grassPlan';
function geometry(kind:PlantFamily){
 const p:number[]=[],c:number[]=[];
 const tri=(a:number[],b:number[],d:number[],color:number[])=>{for(const q of [a,b,d]){p.push(...q);c.push(...color);}};
 const count=kind==='short'?3:kind==='rough'?5:kind==='bracken'?4:3;
 for(let i=0;i<count;i++){
  const a=i*2.39996,dx=Math.cos(a),dz=Math.sin(a),rx=-dz,rz=dx;
  const h=kind==='short'?.095+i*.025:kind==='rough'?.21+i*.037:kind==='bracken'?.25+i*.035:.13+i*.045;
  const w=kind==='bracken'?.036:.012+(i%2)*.008,bend=kind==='bracken'?.15:.045+i*.012,bx=dx*.04,bz=dz*.04;
  const base=[bx,0,bz],tip=[bx+dx*bend,h,bz+dz*bend],mid=[bx+dx*bend*.4,h*.65,bz+dz*bend*.4];
  tri([base[0]-rx*w,0,base[2]-rz*w],[base[0]+rx*w,0,base[2]+rz*w],mid,[.64,.68,.52]);
  tri([mid[0]-rx*w*.5,mid[1],mid[2]-rz*w*.5],[mid[0]+rx*w*.5,mid[1],mid[2]+rz*w*.5],tip,[.9,.91,.76]);
  if(kind==='bracken')for(let j=1;j<=3;j++){const f=j/4,x=bx+dx*bend*f,y=h*f,z=bz+dz*bend*f;
    for(const side of [-1,1])tri([x,y,z],[x+rx*.085*side+dx*.035,y+.045,z+rz*.085*side+dz*.035],[x+dx*.065,y+.07,z+dz*.065],[.8,.66,.38]);}
  if(kind==='flower'){
   // Tiny cream/white daisy-like heads and muted yellow florets; no summer carpet.
   const col=i%2?[.96,.81,.39]:[.94,.93,.82],r=.023;
   for(let j=0;j<5;j++){const a=j*2*Math.PI/5,b=(j+1)*2*Math.PI/5;
    tri(tip,[tip[0]+Math.cos(a)*r,h+.009,tip[2]+Math.sin(a)*r],[tip[0]+Math.cos(b)*r,h+.009,tip[2]+Math.sin(b)*r],col);}
  }
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(c,3));geo.computeVertexNormals();return geo;
}
export function buildGrass(chunk:WorldChunkData,ground:Ground,water:(x:number,z:number)=>boolean){
 const group=new THREE.Group();group.name='Sparse Lakeland meadow and verge';
 let blocked:ReturnType<typeof grassExclusion>|undefined;
 const batches=new Map<PlantFamily,THREE.InstancedMesh>();
 const dummy=new THREE.Object3D(),color=new THREE.Color();
 let lastX=Infinity,lastZ=Infinity,shown=false;
 function hide(){group.visible=false;shown=false;}
 function batch(kind:PlantFamily){
  let mesh=batches.get(kind);if(mesh)return mesh;
  // Allocate GPU resources only in nearby chunks that actually contain plants.
  const mat=new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:1});
  mesh=new THREE.InstancedMesh(geometry(kind),mat,GRASS_MAX);mesh.count=0;mesh.receiveShadow=false;mesh.castShadow=false;mesh.frustumCulled=false;group.add(mesh);batches.set(kind,mesh);return mesh;
 }
 return {group,update(x:number,z:number,y?:number){
  const dx=Math.max(chunk.cx*500-x,0,x-(chunk.cx+1)*500),dz=Math.max(chunk.cz*500-z,0,z-(chunk.cz+1)*500);
  if(Math.hypot(dx,dz)>GRASS_RADIUS+2){hide();return;}
  if(y!==undefined&&y-ground(x,z)>13){hide();return;}
  if(shown&&Math.hypot(x-lastX,z-lastZ)<8)return;
  lastX=x;lastZ=z;blocked??=grassExclusion(chunk,water);
  for(const mesh of batches.values())mesh.count=0;
  for(const p of grassCandidates(chunk,x,z,blocked)){
   const height=ground(p.x,p.z);if(!Number.isFinite(height)||height<.5)continue;
   const slope=Math.max(Math.abs(ground(p.x+.35,p.z)-height),Math.abs(ground(p.x,p.z+.35)-height));if(slope>.28)continue;
   const kind=plantFamily(p.x,p.z,p.seed),mesh=batch(kind),i=mesh.count;if(i>=GRASS_MAX)continue;
   dummy.position.set(p.x,height+.012,p.z);dummy.rotation.set(0,p.seed*6.283,0);
   const fade=Math.min(1,Math.max(.10,(GRASS_RADIUS-Math.hypot(p.x-x,p.z-z))/4));
   dummy.scale.set(.75+p.seed*.55,(.65+p.seed*.65)*fade,.75+p.seed*.55);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
   if(kind==='flower')color.setRGB(.96,.96,.96);
   else if(kind==='bracken')color.setHSL(.10+p.seed*.025,.37,.35);
   else color.setHSL(.16+p.seed*.10,.24+p.seed*.19,.28+p.seed*.19);
   mesh.setColorAt(i,color);mesh.count++;
  }
  for(const mesh of batches.values()){mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.visible=mesh.count>0;}
  group.visible=true;shown=true;
 },dispose(){for(const mesh of batches.values()){mesh.geometry.dispose();(mesh.material as THREE.Material).dispose();mesh.dispose();}batches.clear();}};
}
