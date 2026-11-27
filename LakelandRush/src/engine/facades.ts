import * as THREE from 'three';
import type {FacadePlan,Surface,Piece} from '../geo/facadePlan';
const colors:Record<Surface,number>={timber:0x283b35,glass:0x233b49,trim:0xc7c4b5,stone:0x8d8a80,awning:0x687d65};
// One unit cube and at most five instanced draw calls per chunk; no per-window meshes.
export function buildFacadeBatch(plans:Iterable<FacadePlan>){
 const group=new THREE.Group();group.name='Procedural facades (estimated)';
 const buckets=new Map<Surface,Piece[]>();
 for(const p of plans)for(const piece of p.pieces){const list=buckets.get(piece.surface)??[];list.push(piece);buckets.set(piece.surface,list);}
 const geo=new THREE.BoxGeometry(1,1,1),materials:THREE.Material[]=[];
 const dummy=new THREE.Object3D();
 for(const [surface,pieces] of buckets){
   const mat=new THREE.MeshStandardMaterial({color:colors[surface],roughness:surface==='glass'?.28:.82,metalness:surface==='glass'?.22:0});
   materials.push(mat);const mesh=new THREE.InstancedMesh(geo,mat,pieces.length);
   for(let i=0;i<pieces.length;i++){const p=pieces[i];dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,p.yaw,0);dummy.scale.set(p.w,p.h,p.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);}
   mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.receiveShadow=true;group.add(mesh);
 }
 return {group,dispose(){geo.dispose();materials.forEach(m=>m.dispose());}};
}
