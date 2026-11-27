import * as THREE from 'three';
import {ROW_BOAT_SPAWNS,type BoatMotion} from '../game/waterNavigation';
import type {RunnerRig} from './models';
export interface RowBoat extends BoatMotion{root:THREE.Group;hull:THREE.Group;oars:THREE.Group[];phase:number}
const plan=[[0,-2.35],[.64,-1.42],[.85,-.3],[.76,1.70],[.55,1.94],[-.55,1.94],[-.76,1.70],[-.85,-.3],[-.64,-1.42]];
export function createRowBoats(scene:THREE.Scene,wet:(x:number,z:number)=>boolean):RowBoat[]{
 const cream=new THREE.MeshStandardMaterial({color:0xd0d4ca,side:THREE.DoubleSide,roughness:.49});
 const trim=new THREE.MeshStandardMaterial({color:0x244854,roughness:.66});
 const wood=new THREE.MeshStandardMaterial({color:0x815e42,roughness:.78});
 function box(g:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh);
 }
 function bar(g:THREE.Group,a:THREE.Vector3,b:THREE.Vector3,r:number,m:THREE.Material){
  const v=b.clone().sub(a),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),8),m);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());g.add(mesh);
 }
 const boats:RowBoat[]=[];
 for(const [x,z,yaw] of ROW_BOAT_SPAWNS){
  if(!wet(x,z))continue;
  const root=new THREE.Group(),hull=new THREE.Group();root.name='Waterhead rowboat';root.add(hull);
  const points:number[]=[];
  for(let i=0;i<plan.length;i++){
   const [x0,z0]=plan[i],[x1,z1]=plan[(i+1)%plan.length];
   const a=new THREE.Vector3(x0,.46,z0),b=new THREE.Vector3(x1,.46,z1),c=new THREE.Vector3(x0*.55,-.23,z0*.83),d=new THREE.Vector3(x1*.55,-.23,z1*.83);
   for(const p of [a,c,b,b,c,d,c,new THREE.Vector3(0,-.23,0),d])points.push(p.x,p.y,p.z);
   bar(hull,a,b,.042,trim);bar(hull,new THREE.Vector3(x0*.75,.17,z0*.92),new THREE.Vector3(x1*.75,.17,z1*.92),.043,wood);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geo.computeVertexNormals();hull.add(new THREE.Mesh(geo,cream));
  for(const s of [-.77,.38,1.31])box(hull,1.22,.065,.25,0,.34,s,wood);
  const oars:THREE.Group[]=[];
  for(const side of [-1,1]){
   const pivot=new THREE.Group();pivot.position.set(side*.79,.51,.08);hull.add(pivot);oars.push(pivot);
   bar(pivot,new THREE.Vector3(-side*.55,0,0),new THREE.Vector3(side*1.42,0,0),.027,wood);
   box(pivot,.39,.035,.17,side*1.55,0,0,trim);box(hull,.085,.12,.09,side*.79,.48,.08,trim);
  }
  root.position.set(x,0,z);root.rotation.y=yaw;scene.add(root);boats.push({root,hull,oars,x,z,yaw,speed:0,phase:0});
 }
 return boats;
}
export function animateBoat(b:RowBoat,t:number,dt:number,occupied:boolean){
 const moving=occupied&&Math.abs(b.speed)>.08;if(moving)b.phase+=dt*(1.7+Math.abs(b.speed)*.55);
 b.root.position.set(b.x,Math.sin(t*1.4+b.x)*.045,b.z);b.root.rotation.y=b.yaw;b.hull.rotation.set(Math.sin(t*1.1+b.z)*.025,0,Math.sin(t*1.6+b.x)*.035);
 for(let i=0;i<b.oars.length;i++){const side=i===0?-1:1;b.oars[i].rotation.set(0,side*(moving?Math.sin(b.phase)*.56:.22),side*(moving?-.22-Math.cos(b.phase)*.20:.06));}
}
export function seatAvatar(rig:RunnerRig,b:RowBoat){
 b.hull.updateWorldMatrix(true,true);rig.root.position.copy(b.hull.localToWorld(new THREE.Vector3(0,.34,.38)));rig.root.rotation.set(0,b.yaw+Math.PI,0);
 // Point each articulated arm toward its own moving oar handle in body-local space.
 rig.root.updateMatrixWorld(true);
 for(let i=0;i<2;i++){
  const side=i===0?-1:1,arm=i===0?rig.rightArm:rig.leftArm;
  const handle=b.oars[i].localToWorld(new THREE.Vector3(-side*.53,0,0));
  const target=rig.bodyPivot.worldToLocal(handle).sub(arm.position).normalize();
  arm.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),target);
 }
}
export function disposeBoats(boats:RowBoat[]){
 const mats=new Set<THREE.Material>();for(const b of boats){b.root.removeFromParent();b.root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])mats.add(m)}});}mats.forEach(m=>m.dispose());
}
