import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Ground} from '../geo/surfaceGround';
import {wallCollider,type SolidCollider,type Point} from '../game/buildingCollision';
import {petGardenRuns,gardenWallX,GATE_Z,GATE_WIDTH,PET_SIGNAL_POINTS,PET_LAMP_POINTS,PET_TREE_POINTS} from '../geo/petJunction';
export function buildPetJunction(ground:Ground,stone:THREE.MeshStandardMaterial){
 const group=new THREE.Group();group.name='Pet Shop A591 reference junction';
 const mats:THREE.Material[]=[],geos:THREE.BufferGeometry[]=[],colliders:SolidCollider[]=[],textures:THREE.Texture[]=[];
 const buckets=new Map<THREE.Material,THREE.BufferGeometry[]>();
 const m=(color:number,roughness=.85,metalness=0)=>{const a=new THREE.MeshStandardMaterial({color,roughness,metalness});mats.push(a);return a;};
 const base=(x:number,z:number)=>Math.max(.45,ground(x,z));
 const add=(g:THREE.BufferGeometry,mat:THREE.Material)=>{const b=buckets.get(mat)??[];b.push(g);buckets.set(mat,b);};
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,yaw=0,roll=0)=>{const g=new THREE.BoxGeometry(w,h,d);g.rotateZ(roll);g.rotateY(yaw);g.translate(x,y,z);add(g,mat);};
 const rod=(a:THREE.Vector3,b:THREE.Vector3,r:number,mat:THREE.Material,r2=r)=>{const d=b.clone().sub(a);if(d.length()<.001)return;const g=new THREE.CylinderGeometry(r2,r,d.length(),8);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);add(g,mat);};
 const v=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
 const foliage=[m(0x2d4826),m(0x3f5b31),m(0x4a6736),m(0x597644),m(0x354f30)];
 const trunk=m(0x594c3e),pole=m(0x6c7772,.65,.25),signal=m(0x222b2b),wood=m(0x51443b),iron=m(0x353937,.6,.4);
 const stoneMat=stone.clone();stoneMat.color.set(0xaaa9a0);mats.push(stoneMat);
 const caps=[m(0x777d77),m(0x8b9187),m(0x666f69)];
 let seed=813;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const ball=(x:number,y:number,z:number,sx:number,sy:number,sz:number,mat:THREE.Material)=>{const g=new THREE.IcosahedronGeometry(1,1);g.scale(sx,sy,sz);g.rotateY(rand()*6.28);g.translate(x,y,z);add(g,mat);};
 function solid(a:Point,b:Point,width:number,height:number){
  const dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);if(l<.01)return;const nx=-dz/l*width/2,nz=dx/l*width/2;
  const outline:Point[]=[[a[0]+nx,a[1]+nz],[b[0]+nx,b[1]+nz],[b[0]-nx,b[1]-nz],[a[0]-nx,a[1]-nz]];
  colliders.push({minX:Math.min(...outline.map(p=>p[0])),maxX:Math.max(...outline.map(p=>p[0])),minZ:Math.min(...outline.map(p=>p[1])),maxZ:Math.max(...outline.map(p=>p[1])),topY:Math.max(base(...a),base(...b))+height,isRoof:false,outline});
 }
 // Wall follows the existing mapped garden boundary; coping stones are individual inclined slabs.
 for(const {a,b} of petGardenRuns()){
  const dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz),yaw=Math.atan2(dx,dz),n=Math.max(1,Math.ceil(l/.7));
  for(let i=0;i<n;i++){
   const t=(i+.5)/n,x=a[0]+dx*t,z=a[1]+dz*t,y=base(x,z);
   box(.44,.97,l/n+.02,x,y+.45,z,stoneMat,yaw);
   const ncap=Math.max(1,Math.ceil(l/n/.15));
   for(let j=0;j<ncap;j++){const u=(i+(j+.5)/ncap)/n,xx=a[0]+dx*u,zz=a[1]+dz*u;box(.49,.18,l/n/ncap+.008,xx,base(xx,zz)+.94,zz,caps[Math.floor(rand()*caps.length)],yaw,.12+(rand()-.5)*.18);}
   // Dense, trimmed green hedge behind wall rather than on the pavement.
   const hx=x+.65,hy=base(hx,z);
   box(.86,1.25,l/n+.04,hx,hy+1.44,z,foliage[1],yaw);
   for(let j=0;j<3;j++)ball(hx+(rand()-.5)*.42,hy+1.98+(rand()-.5)*.14,z+(rand()-.5)*l/n,.48,.25,.43,foliage[Math.floor(rand()*foliage.length)]);
  }
  for(let i=0;i<n;i++){const t=i/n,u=(i+1)/n,A:Point=[a[0]+dx*t,a[1]+dz*t],B:Point=[a[0]+dx*u,a[1]+dz*u];const y=base((A[0]+B[0])/2,(A[1]+B[1])/2)+1.03;colliders.push(wallCollider(A,B,.49,y,y));}
 }
 const gx=gardenWallX(GATE_Z),gy=base(gx,GATE_Z);
 for(const dz of [-GATE_WIDTH/2,GATE_WIDTH/2]){box(.48,1.47,.40,gx,gy+.735,GATE_Z+dz,stoneMat);box(.57,.13,.51,gx,gy+1.5,GATE_Z+dz,caps[1]);}
 for(let i=0;i<8;i++)box(.07,.97,.18,gx,gy+.49,GATE_Z-GATE_WIDTH*.43+i*GATE_WIDTH*.86/7,wood);
 for(const y of [.12,1.03,1.38])box(.10,.095,GATE_WIDTH-.20,gx,gy+y,GATE_Z,wood);
 for(const s of [-1,1])rod(v(gx-.05,gy+1.04,GATE_Z+s*.64),v(gx-.05,gy+1.38,GATE_Z),.045,wood);
 box(.07,.11,.11,gx-.08,gy+.92,GATE_Z,iron);
 solid([gx,GATE_Z-GATE_WIDTH/2],[gx,GATE_Z+GATE_WIDTH/2],.16,1.42);
 // Three-dimensional signal heads with circular lenses, hoods and detection camera.
 const red=m(0x4e1917),amber=m(0x4e3514),green=m(0x123e2b);
 const litRed=new THREE.MeshStandardMaterial({color:0xff2a1b,emissive:0xff1609,emissiveIntensity:1.5}),litGreen=new THREE.MeshStandardMaterial({color:0x36ffbd,emissive:0x15ff96,emissiveIntensity:2.0});mats.push(litRed,litGreen);
 for(const s of PET_SIGNAL_POINTS){
  const y=base(s.x,s.z),sin=Math.sin(s.yaw),cos=Math.cos(s.yaw);
  const local=(u:number,h:number,w:number)=>v(s.x+u*cos+w*sin,y+h,s.z-u*sin+w*cos);
  rod(local(0,0,0),local(0,3.10,0),.065,pole);
  const head=local(0,2.63,.04);box(.30,.91,.24,head.x,head.y,head.z,signal,s.yaw);
  for(let i=0;i<3;i++){
   const h=2.92-i*.28,p=local(0,h,.174);
   const mat=i===0?(s.main?red:litRed):i===1?amber:s.main?litGreen:green;
   const lens=new THREE.CylinderGeometry(.095,.095,.025,18);lens.rotateX(Math.PI/2);lens.rotateY(s.yaw);lens.translate(p.x,p.y,p.z);add(lens,mat);
   const hood=local(0,h+.095,.25);box(.23,.065,.21,hood.x,hood.y,hood.z,signal,s.yaw);
   for(const u of [-.115,.115]){const q=local(u,h+.02,.23);box(.035,.19,.18,q.x,q.y,q.z,signal,s.yaw);}
  }
  if(s.sensor){rod(local(0,3.10,0),local(0,4.15,0),.032,pole);const q=local(0,4.18,.10);box(.29,.17,.22,q.x,q.y,q.z,signal,s.yaw);}
  solid([s.x,s.z-.06],[s.x,s.z+.06],.14,3.1);
 }
 const lamp=m(0x9a9e97,.65,.15);
 for(const [i,[x,z]] of PET_LAMP_POINTS.entries()){const y=base(x,z),h=i===0?7.5:6.8,side=i===1?1:-1;
  rod(v(x,y,z),v(x,y+h,z),.075,pole,.045);rod(v(x,y+h,z),v(x+side*1.05,y+h+.02,z),.043,pole);box(.55,.12,.24,x+side*1.10,y+h,z,lamp);
 }
 // Broadleaf trees: multiple branches and interlocking irregular leaf masses.
 for(const t of PET_TREE_POINTS){const {x,z,height:h,spread:r}=t,y=base(x,z);
  rod(v(x,y,z),v(x+.12,y+h*.75,z-.09),.39,trunk,.15);
  for(let j=0;j<8;j++){const a=j*2.399,rr=r*(.35+rand()*.40),xx=x+Math.cos(a)*rr,zz=z+Math.sin(a)*rr,yy=y+h*(.57+rand()*.19);
   rod(v(x,y+h*.37,z),v(xx,yy,zz),.13,trunk,.04);
   ball(xx,yy+.85,zz,r*.44,r*.33,r*.43,foliage[j%foliage.length]);
  }
  for(let j=0;j<35;j++){const a=j*2.399,rr=r*Math.sqrt(rand())*.83;ball(x+Math.cos(a)*rr,y+h*.65+rand()*h*.27,z+Math.sin(a)*rr,r*(.20+rand()*.17),r*(.19+rand()*.13),r*(.22+rand()*.13),foliage[j%foliage.length]);}
  solid([x,z-.34],[x,z+.34],.7,h*.42);
 }
 // Small green directional panel: no invented destination text.
 const sx=138.45,sz=-257.3,sy=base(sx,sz),sign=m(0x326f50),rim=m(0xd9ddc7);
 for(const x of [sx-.29,sx+.29])rod(v(x,sy,sz),v(x,sy+1.05,sz),.035,pole);
 box(.73,.46,.045,sx,sy+.92,sz,rim,.24);box(.68,.40,.05,sx,sy+.92,sz+.014,sign,.24);
 for(const [mat,list] of buckets){const normalized=list.map(g=>g.index?g.toNonIndexed():g);const g=mergeGeometries(normalized);normalized.forEach((v,i)=>{if(v!==list[i])v.dispose()});list.forEach(v=>v.dispose());if(g){geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}}
 return {group,colliders,dispose(){geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
