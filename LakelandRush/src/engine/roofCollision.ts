import * as THREE from 'three';
import {triangleGround} from '../geo/surfaceGround';
// Build the height surface from actual rendered geometry, in world coordinates.
// Ignore vertical/degenerate faces. Highest nonvertical triangle is the solid roof envelope.
export function roofFromGeometry(g:THREE.BufferGeometry){
 return triangleGround(g.getAttribute('position'),g.index,4);
}
export function roofFromModel(model:THREE.Object3D){
 model.updateMatrixWorld(true);
 const coords:number[]=[];const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
 model.traverse(o=>{
  if(!(o instanceof THREE.Mesh)||!o.geometry?.getAttribute('position'))return;
  const p=o.geometry.getAttribute('position'),idx=o.geometry.index,n=idx?.count??p.count;
  const load=(v:THREE.Vector3,i:number)=>v.set(p.getX(i),p.getY(i),p.getZ(i)).applyMatrix4(o.matrixWorld);
  for(let i=0;i+2<n;i+=3){
   load(a,idx?idx.getX(i):i);load(b,idx?idx.getX(i+1):i+1);load(c,idx?idx.getX(i+2):i+2);
   if(Math.abs((b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x))<1e-8)continue;
   coords.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
  }
 });
 return coords.length?triangleGround(new THREE.Float32BufferAttribute(coords,3),null,4):undefined;
}
