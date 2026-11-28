import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {WorldChunkData,BuildingFeature} from '../types/game';
import type {Ground} from '../geo/surfaceGround';
import {wallCollider,type SolidCollider,type Point} from '../game/buildingCollision';
import {corridorPlan,corridorPoint,corridorYaw,APARTMENTS_ID} from '../geo/waterheadCorridor';
import {streetEdge} from '../geo/blackSheepStreet';
import {hayesPlan} from '../geo/hayesApproach';
import {groundSurface} from './waterfront';
export function buildWaterheadCorridor(chunk:WorldChunkData,ground:Ground,stone:THREE.MeshStandardMaterial){
 const group=new THREE.Group();group.name='A591 Waterhead Inn and garden corridor';
 const plan=corridorPlan(chunk),materials:THREE.Material[]=[],geos:THREE.BufferGeometry[]=[],textures:THREE.Texture[]=[],colliders:SolidCollider[]=[];
 const bins=new Map<THREE.Material,THREE.BufferGeometry[]>();
 const m=(color:number,roughness=.85)=>{const v=new THREE.MeshStandardMaterial({color,roughness});materials.push(v);return v;};
 const add=(g:THREE.BufferGeometry,mat:THREE.Material)=>{const a=bins.get(mat)??[];a.push(g);bins.set(mat,a);};
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,yaw=0,roll=0)=>{const g=new THREE.BoxGeometry(w,h,d);g.rotateZ(roll);g.rotateY(yaw);g.translate(x,y,z);add(g,mat);};
 const yAt=(x:number,z:number)=>Math.max(.45,ground(x,z));
 const stoneMat=stone.clone();stoneMat.color.set(0x92928a);materials.push(stoneMat);
 const coping=[m(0x62665e),m(0x80847a),m(0x96968a)],leaves=[m(0x324b2b),m(0x496335),m(0x5e783e),m(0x76954d),m(0x405831)],bark=m(0x64564a),green=m(0x295e4c,.65),metal=m(0x858b85,.6),black=m(0x242b2d),yellow=m(0xd2b557),white=m(0xe7e5d9);
 const glass=new THREE.MeshStandardMaterial({color:0xc2d3ca,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide,roughness:.25});materials.push(glass);
 const roof=m(0x356c57,.65);roof.side=THREE.DoubleSide;
 let seed=227;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const leaf=(x:number,y:number,z:number,a:number,b:number,c:number,mat:THREE.Material)=>{const g=new THREE.IcosahedronGeometry(1,1);g.scale(a,b,c);g.rotateY(rnd()*6.28);g.translate(x,y,z);add(g,mat);};
 const rod=(a:THREE.Vector3,b:THREE.Vector3,r:number,mat:THREE.Material,r2=r)=>{const d=b.clone().sub(a);if(d.length()<.001)return;const g=new THREE.CylinderGeometry(r2,r,d.length(),8);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);add(g,mat);};
 const v=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
 const solid=(a:Point,b:Point,width:number,height:number)=>{const dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);if(l<.01)return;const nx=-dz/l*width/2,nz=dx/l*width/2;const outline:Point[]=[[a[0]+nx,a[1]+nz],[b[0]+nx,b[1]+nz],[b[0]-nx,b[1]-nz],[a[0]-nx,a[1]-nz]];colliders.push({minX:Math.min(...outline.map(p=>p[0])),maxX:Math.max(...outline.map(p=>p[0])),minZ:Math.min(...outline.map(p=>p[1])),maxZ:Math.max(...outline.map(p=>p[1])),topY:Math.max(yAt(...a),yAt(...b))+height,isRoof:false,outline});};
 const fenceWood=[m(0x756c57),m(0x867c66),m(0x655e50)],moss=m(0x536344),asphalt=m(0x57595a),kerb=m(0x99978e);
 for(const {a,b,side,height,fence,retaining} of plan.walls){
  const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),yaw=Math.atan2(dx,dz),n=Math.max(1,Math.ceil(len/.65)),h=height??(side<0?.94:.72);
  for(let i=0;i<n;i++){const t=(i+.5)/n,x=a[0]+dx*t,z=a[1]+dz*t,y=yAt(x,z);box(.42,h+.1,len/n+.025,x,y+h/2-.04,z,stoneMat,yaw);
   for(let j=0;j<4;j++){const u=(i+(j+.5)/4)/n,xx=a[0]+dx*u,zz=a[1]+dz*u;box(.47,.12,len/n/4+.008,xx,yAt(xx,zz)+h,zz,coping[(i+j)%3],yaw,.12);}
  }
  if(fence){const count=Math.max(1,Math.ceil(len/.14));for(let i=0;i<count;i++){const t=(i+.5)/count,x=a[0]+dx*t,z=a[1]+dz*t;box(.09,.94,len/count+.006,x,yAt(x,z)+h+.50,z,fenceWood[i%3],yaw);}}
  if(height!==undefined&&side<0){for(let i=0;i<n;i++){const t=(i+.5)/n,x=a[0]+dx*t,z=a[1]+dz*t;box(.29,.025,len/n*.65,x,yAt(x,z)+h+.075,z,moss,yaw);}}
  for(let i=0;i<n;i++){const t=i/n,u=(i+1)/n,A:Point=[a[0]+dx*t,a[1]+dz*t],B:Point=[a[0]+dx*u,a[1]+dz*u];const y=yAt((A[0]+B[0])/2,(A[1]+B[1])/2)+h+.06+(fence?.91:0);colliders.push(wallCollider(A,B,.47,y,y));}
 }
 for(const p of plan.shoulders)add(groundSurface(p,ground,.115,true),asphalt);
 for(const p of plan.kerbs)add(groundSurface(p,ground,.218,true),kerb);
 for(const p of plan.edgePaint)add(groundSurface(p,ground,.142,true),yellow);
 for(const [x,z] of plan.lamps){const y=yAt(x,z);rod(v(x,y,z),v(x,y+7.0,z),.064,metal,.041);rod(v(x,y+7,z),v(x+.92,y+7.12,z),.042,metal);box(.48,.11,.19,x+.98,y+7.1,z,black);}
 for(const p of plan.plants){const {x,z,size,tree}=p,y=yAt(x,z);
  if(tree){const h=7.5+rnd()*3.7;rod(v(x,y,z),v(x+.15,y+h*.8,z),.27,bark,.09);
   for(let i=0;i<7;i++){const a=i*2.399,xx=x+Math.cos(a)*size*.55,zz=z+Math.sin(a)*size*.55,yy=y+h*(.57+rnd()*.21);rod(v(x,y+h*.38,z),v(xx,yy,zz),.09,bark,.03);leaf(xx,yy+.65,zz,size*.55,size*.56,size*.53,leaves[i%5]);}
   for(let i=0;i<13;i++){const a=i*2.399,r=size*Math.sqrt(rnd())*.72;leaf(x+Math.cos(a)*r,y+h*.70+rnd()*h*.24,z+Math.sin(a)*r,size*.38,size*.36,size*.40,leaves[i%5]);}
   solid([x,z-.22],[x,z+.22],.46,h*.42);
  }else if(p.hedge){for(let i=0;i<8;i++){const a=i*2.4,r=size*.42;leaf(x+Math.cos(a)*r,y+size*.90+.55+rnd()*.30,z+Math.sin(a)*r,size*.66,size*.70,size*.78,leaves[(i+1)%5]);}}else{for(let i=0;i<7;i++){const a=i*2.4,r=size*.34;leaf(x+Math.cos(a)*r,y+size*.55+rnd()*.33,z+Math.sin(a)*r,size*.70,size*.69,size*.72,leaves[i%5]);}}
 }
 const label=(x:number,y:number,z:number,w:number,h:number,yaw:number,lines:string[],bg='#222928',fg='#f3f2e9')=>{
  const c=document.createElement('canvas');c.width=768;c.height=Math.max(96,Math.round(768*h/w));const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';
  lines.forEach((s,i)=>{ctx.font='bold '+Math.round(c.height*(i===0?.32:.17))+'px Arial';ctx.fillText(s,c.width/2,c.height*(lines.length===1?.5:.33+i*.35),c.width*.94);});
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);const mat=new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide});materials.push(mat);const g=new THREE.PlaneGeometry(w,h);geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.position.set(x,y,z);mesh.rotation.y=yaw;group.add(mesh);
 };
 for(const s of plan.shelters){
  const {x,z,yaw}=s,y=yAt(x,z)+.19,L=s.side>0?2.25:3.1,D=.85,cos=Math.cos(yaw),sin=Math.sin(yaw);
  const p=(u:number,h:number,w:number)=>v(x+u*sin+w*cos,y+h,z+u*cos-w*sin);
  const b=(w:number,h:number,d:number,u:number,yy:number,depth:number,mat:THREE.Material)=>{const q=p(u,yy,depth);box(d,h,w,q.x,q.y,q.z,mat,yaw);};
  for(const u of [-L/2,0,L/2])b(.065,2.05,.065,u,1.025,0,green);
  for(const yy of [.13,1.05,2.02])b(L,.06,.07,0,yy,0,green);
  for(const u of [-L/4,L/4])b(L/2-.07,1.85,.018,u,1.08,0,glass);
  // Open-sided narrow canopy, matching the roadside shelters rather than the town interchange.
  for(let j=0;j<10;j++){const a=-D/2+j*D/10,c=-D/2+(j+1)*D/10,hh=(t:number)=>2.06+.21*Math.sqrt(Math.max(0,1-(2*t/D)**2));const A=p(-L/2-.12,hh(a),a),B=p(L/2+.12,hh(a),a),C=p(L/2+.12,hh(c),c),E=p(-L/2-.12,hh(c),c);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...A.toArray(),...B.toArray(),...C.toArray(),...A.toArray(),...C.toArray(),...E.toArray()],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1],2));g.computeVertexNormals();add(g,roof);}
  const stop=p(L/2+.65,1.4,0);rod(v(stop.x,y,stop.z),v(stop.x,y+2.6,stop.z),.04,metal);label(stop.x,y+2.38,stop.z,.29,.46,yaw+Math.PI/2,['BUS STOP'],'#ecf1e8','#2b634a');
  solid([x-.04,z-L/2],[x+.04,z+L/2],.10,2.06);
  if(s.side>0){
   for(let zz=z-5;zz<z+5;zz+=1.8){const a=corridorPoint(zz,1.75),b=corridorPoint(zz+.85,1.75),c=corridorPoint(zz+.85,1.86),d=corridorPoint(zz,1.86);add(groundSurface([a,b,c,d],ground,.143,true),yellow);}
   const cv=document.createElement('canvas');cv.width=512;cv.height=512;const ctx=cv.getContext('2d')!;ctx.clearRect(0,0,512,512);ctx.fillStyle='#cbb259';ctx.textAlign='center';ctx.font='bold 174px Arial';ctx.fillText('BUS',256,220);ctx.fillText('STOP',256,420);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);const mat=new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,side:THREE.DoubleSide});materials.push(mat);const g=new THREE.PlaneGeometry(2.15,4.3);g.rotateX(-Math.PI/2);geos.push(g);const mesh=new THREE.Mesh(g,mat);const [mx,mz]=corridorPoint(z,3.0);mesh.position.set(mx,ground(mx,mz)+.15,mz);mesh.rotation.y=corridorYaw(z);group.add(mesh);
  }
 }
 if(chunk.key==='0_-1'){
  // Actual roadside business names read in the references; sign positions are approximate.
  for(const [z,off,w,lines] of [[-356,7.5,2.8,['LAKEHOUSE','AT THE WATERHEAD INN']],[-376,8.0,2.15,['LAKEHOUSE','THE WATERHEAD INN']],[-348,-6.6,2.7,['THE WATERHEAD INN','AMBLESIDE']]] as [number,number,number,string[]][]){
   const [x,zz]=corridorPoint(z,off),y=yAt(x,zz),yaw=corridorYaw(z)+Math.PI/2;
   for(const u of [-.36,.36])rod(v(x+Math.cos(yaw)*w*u,y,zz-Math.sin(yaw)*w*u),v(x+Math.cos(yaw)*w*u,y+1.36,zz-Math.sin(yaw)*w*u),.045,metal);
   label(x,y+1.20,zz,w,.72,yaw,lines);
  }
  // Stone garden steps directly behind the small east-side shelter.
  if(plan.shelters.some(s=>s.side>0)){const z=-311.3;const [x,zz]=corridorPoint(z,6.55),y=yAt(x,zz);for(let i=0;i<5;i++){box(.43,.16+i*.13,1.55,x+i*.41,y+(.16+i*.13)/2,zz,coping[1]);}}
  // Clipped round shrubs reuse clearance-validated garden plant locations.
  for(const p of plan.plants.filter(p=>!p.tree&&p.z<-290&&p.z>-318)){leaf(p.x,yAt(p.x,p.z)+.58,p.z,.75,.75,.75,leaves[2]);}
 }
 // Parked vehicles sit outside the existing through lanes. Varied silhouettes,
 // curved body edges, wheel hubs, windows and lights instead of rectangular cars.
 const paint=[m(0x495965,.40),m(0xa5a9a8,.42),m(0x263c53,.38),m(0x33373b,.42),m(0xb8b9b5,.4),m(0x8e3234,.4)],tyre=m(0x212326),hub=m(0xa1a5a6,.42),carGlass=m(0x34454f,.24),tail=m(0x9f292b,.42),head=m(0xe2e6e1,.30),plate=m(0xd6bb57);
 for(const [i,p] of plan.parked.entries()){
  const x=p.x,z=p.z,y=yAt(x,z)+.12,yaw=p.yaw,cs=Math.cos(yaw),sn=Math.sin(yaw),body=paint[i%paint.length],suv=i%3===0;
  const local=(u:number,h:number,w:number)=>v(x+u*cs+w*sn,y+h,z-u*sn+w*cs);
  const part=(w:number,h:number,d:number,u:number,yy:number,zz:number,mat:THREE.Material)=>{const q=local(u,yy,zz);box(w,h,d,q.x,q.y,q.z,mat,yaw);};
  const shell=(profile:number[][],width:number,mat:THREE.Material)=>{
   const shape=new THREE.Shape();profile.forEach(([zz,yy],j)=>j?shape.lineTo(zz,yy):shape.moveTo(zz,yy));shape.closePath();
   const g=new THREE.ExtrudeGeometry(shape,{depth:width-.12,bevelEnabled:true,bevelSize:.06,bevelThickness:.06,bevelSegments:2,steps:1});
   g.translate(0,0,-(width-.12)/2);g.rotateY(-Math.PI/2);g.rotateY(yaw);g.translate(x,y,z);add(g,mat);
  };
  shell([[-2.16,.40],[-2.09,.74],[-1.78,.88],[1.75,.88],[2.10,.69],[2.16,.40],[1.73,.32],[-1.75,.32]],1.78,body);
  shell([[-1.49,.86],[-.82,suv?1.57:1.43],[.86,suv?1.57:1.43],[1.48,.86]],1.56,carGlass);
  part(1.51,.085,suv?1.81:1.61,0,suv?1.58:1.44,0,body);
  for(const u of [-.80,.80]){part(.055,suv?.63:.49,.055,u,suv?1.22:1.14,0,body);part(.14,.12,.22,u*1.13,1.06,-.85,body);for(const zz of [-1.37,1.37]){
   const q=local(u,.32,zz);const g=new THREE.CylinderGeometry(.325,.325,.22,16);g.rotateZ(Math.PI/2);g.rotateY(yaw);g.translate(q.x,q.y,q.z);add(g,tyre);
   const q2=local(u*1.13,.32,zz);const h=new THREE.CylinderGeometry(.19,.19,.035,12);h.rotateZ(Math.PI/2);h.rotateY(yaw);h.translate(q2.x,q2.y,q2.z);add(h,hub);
  }}
  for(const u of [-.65,.65]){part(.40,.13,.065,u,.69,-2.105,head);part(.33,.14,.06,u,.69,2.105,tail);}
  part(.43,.11,.035,0,.48,2.17,plate);part(.44,.11,.035,0,.48,-2.17,head);part(.66,.12,.06,0,.56,-2.12,black);
  const a=local(0,0,-2.2),b=local(0,0,2.2);solid([a.x,a.z],[b.x,b.z],1.88,1.65);
 }
 if(chunk.key==='0_-2'){
  const hayes=hayesPlan(chunk);
  for(const [x,zz] of hayes.signs){const y=yAt(x,zz);
   for(const u of [-.66,.66])rod(v(x+u,y,zz),v(x+u,y+2.55,zz),.045,green);
   box(1.64,1.02,.095,x,y+1.98,zz,green);label(x,y+1.98,zz+.055,1.48,.86,0,['Hayes'],'#8ba468','#f0efce');
   box(1.48,.31,.085,x,y+1.23,zz,green);label(x,y+1.23,zz+.05,1.33,.25,0,['GARDEN WORLD'],'#9eb17c','#f1efd9');
   box(1.48,.48,.085,x,y+.82,zz,green);label(x,y+.82,zz+.05,1.33,.40,0,['Sale','NOW ON'],'#a44343','#f7e7d7');
   label(x,y+1.98,zz-.055,1.48,.86,Math.PI,['Hayes'],'#8ba468','#f0efce');label(x,y+.82,zz-.055,1.33,.40,Math.PI,['Sale'],'#a44343','#f7e7d7');
  }
  const grate=m(0x343b3a,.9);
  for(const [x,z] of hayes.drains){box(.36,.025,.44,x,yAt(x,z)+.15,z,grate);for(let i=0;i<6;i++)box(.28,.028,.012,x,yAt(x,z)+.164,z-.16+i*.064,metal);}
  for(const car of hayes.cars){for(const dx of [-1.23,1.23])add(groundSurface([[car.x+dx-.035,car.z-2.6],[car.x+dx+.035,car.z-2.6],[car.x+dx+.035,car.z+2.6],[car.x+dx-.035,car.z+2.6]],ground,.145,false),white);}
 }
 for(const [mat,ls] of bins){const norm=ls.map(g=>g.index?g.toNonIndexed():g),g=mergeGeometries(norm);norm.forEach((v,i)=>{if(v!==ls[i])v.dispose()});ls.forEach(v=>v.dispose());if(g){geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.castShadow=!mat.transparent;mesh.receiveShadow=true;group.add(mesh);}}
 return {group,colliders,plan,dispose(){geos.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
export function buildCorridorApartments(b:BuildingFeature,ground:Ground,wallTop:number){
 if(b.id!==APARTMENTS_ID)return null;
 const group=new THREE.Group(),e=streetEdge(b,5),base=Math.max(.45,ground(b.cx,b.cz));group.position.set(e.x,base,e.z);group.rotation.y=e.yaw;
 const mats:THREE.Material[]=[],geos:THREE.BufferGeometry[]=[];
 const mat=(color:number)=>{const m=new THREE.MeshStandardMaterial({color,roughness:.85});mats.push(m);return m;};
 const cream=mat(0xe3e1d4),frame=mat(0x51483d),glass=mat(0x35454d),rail=mat(0x424747),slab=mat(0xbab1a1);
 const H=wallTop-base,L=e.length;
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material)=>{const g=new THREE.BoxGeometry(w,h,d);geos.push(g);const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);group.add(mesh);};
 for(let j=0;j<Math.floor(L/4.5);j++){const x=-L/2+2.25+j*4.5;
  for(let y=1.5;y+1.05<H;y+=2.55){box(1.9,1.8,.10,x,y,.08,frame);box(1.73,1.64,.04,x,y,.15,glass);box(.055,1.64,.05,x,y,.18,frame);
   if(y>3){box(2.4,.19,.82,x,y-1.02,.42,slab);box(2.4,.06,.06,x,y-.17,.84,rail);for(let i=0;i<9;i++)box(.035,.80,.035,x-1.15+i*.2875,y-.57,.84,rail);}
  }
 }
 return {group,dispose(){geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());}};
}
