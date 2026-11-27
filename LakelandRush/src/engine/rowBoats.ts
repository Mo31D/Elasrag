import * as THREE from 'three';
import {ROW_BOAT_SPAWNS,MOTOR_BOAT_SPAWNS,boatFits,type BoatMotion,type BoatKind} from '../game/waterNavigation';
import type {RunnerRig} from './models';
export interface RowBoat extends BoatMotion{kind:BoatKind;root:THREE.Group;hull:THREE.Group;oars:THREE.Group[];phase:number;wheel:THREE.Group|null}
const plan=[[0,-2.35],[.46,-2.0],[.72,-1.42],[.85,-.3],[.76,1.70],[.55,1.94],[-.55,1.94],[-.76,1.70],[-.85,-.3],[-.72,-1.42],[-.46,-2.0]];
const motorPlan=[[0,-2.9],[.57,-2.5],[.95,-1.65],[1.12,-.5],[1.12,1.65],[.97,2.65],[-.97,2.65],[-1.12,1.65],[-1.12,-.5],[-.95,-1.65],[-.57,-2.5]];
function mat(c:number,r=.6){return new THREE.MeshStandardMaterial({color:c,roughness:r});}
function box(g:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;}
function bar(g:THREE.Group,a:THREE.Vector3,b:THREE.Vector3,r:number,m:THREE.Material){const v=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());g.add(o);return o;}
function ringAt(g:THREE.Group,outline:number[][],y:number,k:number,m:THREE.Material,r=.024){for(let i=0;i<outline.length;i++){const [x,z]=outline[i],[u,v]=outline[(i+1)%outline.length];bar(g,new THREE.Vector3(x*k,y,z),new THREE.Vector3(u*k,y,v),r,m);}}
function band(g:THREE.Group,outline:number[][],y0:number,y1:number,k0:number,k1:number,m:THREE.Material){const pts:number[]=[];for(let i=0;i<outline.length;i++){const [x,z]=outline[i],[u,v]=outline[(i+1)%outline.length];pts.push(x*k0,y0,z,u*k0,y0,v,x*k1,y1,z,u*k0,y0,v,u*k1,y1,v,x*k1,y1,z);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));geo.computeVertexNormals();m.side=THREE.DoubleSide;g.add(new THREE.Mesh(geo,m));}
function floor(g:THREE.Group,outline:number[][],y:number,k:number,m:THREE.Material){const shape=new THREE.Shape(outline.map(([x,z])=>new THREE.Vector2(x*k,-z)));const geo=new THREE.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);geo.translate(0,y,0);g.add(new THREE.Mesh(geo,m));}
export function createRowBoats(scene:THREE.Scene,wet:(x:number,z:number)=>boolean):RowBoat[]{
 const dark=mat(0x3e2518,.7),wood=mat(0xa26834,.64),varnish=mat(0x694021,.43),seam=mat(0x342820),black=mat(0x292d2f),white=mat(0xe9e8df,.38),red=mat(0xb52d32,.43),metal=mat(0xb8c2c3,.4);
 const glass=new THREE.MeshStandardMaterial({color:0x9bc4d2,transparent:true,opacity:.23,depthWrite:false,side:THREE.DoubleSide,roughness:.16});
 const boats:RowBoat[]=[];
 const spawns=[...ROW_BOAT_SPAWNS.map(v=>({v,kind:'rowboat' as const})),...MOTOR_BOAT_SPAWNS.map(v=>({v,kind:'motorboat' as const}))];
 for(const {v:[x,z,yaw],kind} of spawns){
  if(!boatFits(x,z,yaw,wet,kind))continue;
  const root=new THREE.Group(),hull=new THREE.Group();root.name='Waterhead '+kind;root.add(hull);
  const oars:THREE.Group[]=[];let wheel:THREE.Group|null=null;
  if(kind==='rowboat'){
   // Lapstrake timber hull: alternating overlapping planks, ribs, gunwales and floor boards.
   band(hull,plan,-.27,-.08,.39,.61,dark);
   const widths=[.61,.73,.84,.93,1],heights=[-.08,.035,.16,.30,.46];
   for(let i=0;i<4;i++){band(hull,plan,heights[i],heights[i+1],widths[i],widths[i+1],i%2?varnish:wood);ringAt(hull,plan,heights[i+1]-.008,widths[i+1],seam,.014);}
   ringAt(hull,plan,.46,1.0,wood,.049);floor(hull,plan,-.08,.61,dark);
   for(let i=0;i<7;i++)box(hull,.125,.045,3.15,(i-3)*.13,-.045,-.06,wood);
   for(const s of [-.95,.38,1.31]){box(hull,1.24,.07,.29,0,.34,s,wood);for(const side of [-1,1])box(hull,.055,.25,.05,side*.49,.18,s,dark);}
   for(const side of [-1,1]){
    for(let i=0;i<5;i++){const zz=-1.25+i*.59;bar(hull,new THREE.Vector3(side*.55,-.03,zz),new THREE.Vector3(side*.77,.42,zz),.025,varnish);}
    const pivot=new THREE.Group();pivot.position.set(side*.79,.51,.08);hull.add(pivot);oars.push(pivot);
    bar(pivot,new THREE.Vector3(-side*.55,0,0),new THREE.Vector3(side*1.45,0,0),.028,wood);
    const blade=box(pivot,.49,.035,.21,side*1.62,0,0,varnish);blade.rotation.y=side*.08;box(hull,.085,.12,.09,side*.79,.48,.08,metal);
   }
   // Bow eye and short neatly coiled painter.
   const eye=new THREE.Mesh(new THREE.TorusGeometry(.08,.014,6,14),metal);eye.position.set(0,.45,-2.17);hull.add(eye);
   const coil=new THREE.Mesh(new THREE.TorusGeometry(.15,.024,6,20),dark);coil.rotation.x=-Math.PI/2;coil.position.set(0,.39,-1.65);hull.add(coil);
  }else{
   // Reference-inspired Windermere launch: flared white hull, red rubbing strake,
   // open rear cockpit, angled windscreen, pale window frames and red canopy.
   band(hull,motorPlan,-.43,-.06,.46,.79,black);band(hull,motorPlan,-.06,.57,.79,1,white);band(hull,motorPlan,.49,.57,.99,1,red);ringAt(hull,motorPlan,.58,1,metal,.045);
   floor(hull,motorPlan,.10,.81,dark);floor(hull,[...motorPlan.slice(0,4),motorPlan[8],motorPlan[9],motorPlan[10]],.59,.98,white);
   for(const side of [-1,1]){box(hull,.16,.38,3.6,side*.96,.39,.43,white);box(hull,.19,.08,2.0,side*.94,.63,.1,red);}
   box(hull,1.85,.40,.46,0,.36,2.35,white);box(hull,1.65,.12,.48,0,.58,2.18,red);box(hull,1.65,.38,.12,0,.76,2.48,red);
   box(hull,.72,.12,.48,.35,.40,.20,red);box(hull,.72,.40,.11,.35,.60,.44,white);
   box(hull,.68,.12,.48,-.38,.40,.20,red);
   box(hull,1.68,.18,.30,0,.84,-.82,white);
   // Cabin frames; front glass slopes back from the bow, sides remain visibly open/glazed.
   for(const side of [-1,1]){
    const x=side*.92;
    bar(hull,new THREE.Vector3(x,.60,-1.46),new THREE.Vector3(x*.85,1.78,-.82),.048,white);
    bar(hull,new THREE.Vector3(x,.59,1.10),new THREE.Vector3(x*.85,1.78,.90),.048,white);
    bar(hull,new THREE.Vector3(x,.60,-.13),new THREE.Vector3(x*.85,1.78,-.02),.034,white);
    bar(hull,new THREE.Vector3(x*.85,1.78,-.82),new THREE.Vector3(x*.85,1.78,.90),.045,white);
    const pane=box(hull,.018,1.0,1.27,x*.95,1.14,.36,glass);pane.rotation.z=side*.08;
   }
   const front=box(hull,1.57,1.32,.018,0,1.19,-1.14,glass);front.rotation.x=.49;
   bar(hull,new THREE.Vector3(0,.60,-1.46),new THREE.Vector3(0,1.78,-.82),.033,white);
   box(hull,1.76,.13,2.14,0,1.81,.05,white);box(hull,1.83,.095,2.17,0,1.91,.05,red);
   box(hull,1.59,.06,.40,0,1.97,.94,red);box(hull,.37,.50,.38,0,.15,2.73,black);box(hull,.31,.10,.34,0,.44,2.73,red);
   wheel=new THREE.Group();wheel.position.set(.35,.92,-.61);hull.add(wheel);const w=new THREE.Mesh(new THREE.TorusGeometry(.19,.026,8,20),black);w.rotation.x=-.28;wheel.add(w);
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3;bar(wheel,new THREE.Vector3(0,0,0),new THREE.Vector3(Math.cos(a)*.18,Math.sin(a)*.18,0),.013,metal);}
   for(const side of [-1,1]){bar(hull,new THREE.Vector3(side*.46,.63,-2.2),new THREE.Vector3(side*.85,.63,-1.63),.026,metal);}
  }
  root.position.set(x,0,z);root.rotation.y=yaw;scene.add(root);boats.push({kind,root,hull,oars,wheel,x,z,yaw,speed:0,phase:0});
 }
 return boats;
}
export function animateBoat(b:RowBoat,t:number,dt:number,occupied:boolean,steer=0){
 const moving=occupied&&Math.abs(b.speed)>.08;if(moving)b.phase+=dt*(1.7+Math.abs(b.speed)*.55);
 b.root.position.set(b.x,Math.sin(t*1.4+b.x)*.045,b.z);b.root.rotation.y=b.yaw;b.hull.rotation.set(Math.sin(t*1.1+b.z)*.025,0,Math.sin(t*1.6+b.x)*.035-steer*Math.min(.055,Math.abs(b.speed)*.012));
 if(b.wheel)b.wheel.rotation.z=steer*.65;
 for(let i=0;i<b.oars.length;i++){const side=i===0?-1:1;b.oars[i].rotation.set(0,side*(moving?Math.sin(b.phase)*.56:.22),side*(moving?-.22-Math.cos(b.phase)*.20:.06));}
}
export function seatAvatar(rig:RunnerRig,b:RowBoat){
 const motor=b.kind==='motorboat';b.hull.updateWorldMatrix(true,true);
 rig.root.position.copy(b.hull.localToWorld(motor?new THREE.Vector3(.35,.40,.20):new THREE.Vector3(0,.34,.38)));rig.root.rotation.set(0,b.yaw+(motor?0:Math.PI),0);
 rig.root.updateMatrixWorld(true);
 for(let i=0;i<2;i++){
  const side=i===0?-1:1,arm=i===0?rig.rightArm:rig.leftArm;
  const handle=motor?b.wheel!.localToWorld(new THREE.Vector3(-side*.17,0,0)):b.oars[i].localToWorld(new THREE.Vector3(-side*.53,0,0));
  const target=rig.bodyPivot.worldToLocal(handle).sub(arm.position).normalize();arm.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),target);
 }
}
export function disposeBoats(boats:RowBoat[]){
 const mats=new Set<THREE.Material>();for(const b of boats){b.root.removeFromParent();b.root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])mats.add(m)}});}mats.forEach(m=>m.dispose());
}
