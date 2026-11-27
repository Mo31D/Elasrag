import * as THREE from 'three';
import type {WorldChunkData} from '../types/game';
import type {Ground} from '../geo/surfaceGround';
import {grassExclusion,grassCandidates,GRASS_RADIUS,GRASS_MAX} from '../geo/grassPlan';
export function buildGrass(chunk:WorldChunkData,ground:Ground,water:(x:number,z:number)=>boolean){
 const group=new THREE.Group();group.name='Near-field meadow grass';
 const blocked=grassExclusion(chunk,water),pos:number[]=[],colors:number[]=[];
 // Seven narrow, curved, tapered blades in each tuft; vertex tint darkens roots.
 for(let i=0;i<7;i++){
  const a=i*2.39996,dx=Math.cos(a),dz=Math.sin(a),rx=-dz,rz=dx;
  const h=.105+(i%4)*.032,w=.018+(i%3)*.004,bend=.038+(i%3)*.018,bx=dx*.065,bz=dz*.065;
  const a0=[bx-rx*w,0,bz-rz*w],b0=[bx+rx*w,0,bz+rz*w],a1=[bx+dx*bend*.35-rx*w*.55,h*.6,bz+dz*bend*.35-rz*w*.55],b1=[bx+dx*bend*.35+rx*w*.55,h*.6,bz+dz*bend*.35+rz*w*.55],tip=[bx+dx*bend,h,bz+dz*bend];
  for(const p of [a0,b0,a1,b0,b1,a1,a1,b1,tip]){pos.push(...p);const v=.52+.48*p[1]/h;colors.push(v,v,v*.87);}
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
 const mat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,side:THREE.DoubleSide,roughness:1});
 const mesh=new THREE.InstancedMesh(geo,mat,GRASS_MAX);mesh.count=0;mesh.visible=false;mesh.receiveShadow=true;mesh.frustumCulled=false;group.add(mesh);
 const dummy=new THREE.Object3D(),color=new THREE.Color();let lastX=Infinity,lastZ=Infinity;
 return {group,update(x:number,z:number){
  const dx=Math.max(chunk.cx*500-x,0,x-(chunk.cx+1)*500),dz=Math.max(chunk.cz*500-z,0,z-(chunk.cz+1)*500);
  if(Math.hypot(dx,dz)>GRASS_RADIUS+3){mesh.visible=false;return;}
  if(mesh.visible&&Math.hypot(x-lastX,z-lastZ)<5)return;
  lastX=x;lastZ=z;let count=0;
  for(const p of grassCandidates(chunk,x,z,blocked)){
   const y=ground(p.x,p.z);if(!Number.isFinite(y)||y<.5)continue;
   const slope=Math.max(Math.abs(ground(p.x+.35,p.z)-y),Math.abs(ground(p.x,p.z+.35)-y));if(slope>.28)continue;
   dummy.position.set(p.x,y+.012,p.z);dummy.rotation.set(0,p.seed*6.283,0);
   const fade=Math.min(1,Math.max(.05,(GRASS_RADIUS-Math.hypot(p.x-x,p.z-z))/5));dummy.scale.set(.85+p.seed*.7,(.65+p.seed*.85)*fade,.85+p.seed*.7);dummy.updateMatrix();mesh.setMatrixAt(count,dummy.matrix);
   color.setHSL(.16+p.seed*.10,.24+p.seed*.21,.24+p.seed*.17);mesh.setColorAt(count,color);count++;
  }
  mesh.count=count;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.visible=true;
 },dispose(){geo.dispose();mat.dispose();mesh.dispose();}};
}
