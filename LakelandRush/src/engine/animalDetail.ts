import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
// Merge rigid decorations within each articulated joint, never across joints.
export function batchAnimalDetail(group:THREE.Group){
 for(const child of [...group.children])if(child instanceof THREE.Group)batchAnimalDetail(child);
 const batches=new Map<THREE.Material,THREE.Mesh[]>();
 for(const o of group.children)if(o instanceof THREE.Mesh&&!Array.isArray(o.material)){const list=batches.get(o.material)??[];list.push(o);batches.set(o.material,list);}
 for(const [m,meshes] of batches){if(meshes.length<2)continue;
  const geos=meshes.map(o=>{o.updateMatrix();const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrix);return g;});
  const merged=mergeGeometries(geos);geos.forEach(g=>g.dispose());if(!merged)continue;
  const out=new THREE.Mesh(merged,m);out.castShadow=meshes.some(o=>o.castShadow);out.receiveShadow=true;
  for(const o of meshes){o.removeFromParent();o.geometry.dispose();}group.add(out);
 }
}
