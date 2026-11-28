import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {WorldChunkData,BuildingFeature} from '../types/game';
import type {Ground} from '../geo/surfaceGround';
import type {SolidCollider,Point} from '../game/buildingCollision';
import {corridorPlan,corridorPoint,corridorYaw,APARTMENTS_ID} from '../geo/waterheadCorridor';
import {streetEdge} from '../geo/blackSheepStreet';
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
 for(const {a,b,side} of plan.walls){
  const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),yaw=Math.atan2(dx,dz),n=Math.max(1,Math.ceil(len/.65)),h=side<0?.94:.72;
  for(let i=0;i<n;i++){const t=(i+.5)/n,x=a[0]+dx*t,z=a[1]+dz*t,y=yAt(x,z);box(.42,h+.1,len/n+.025,x,y+h/2-.04,z,stoneMat,yaw);
   for(let j=0;j<4;j++){const u=(i+(j+.5)/4)/n,xx=a[0]+dx*u,zz=a[1]+dz*u;box(.47,.12,len/n/4+.008,xx,yAt(xx,zz)+h,zz,coping[(i+j)%3],yaw,.12);}
  }
  solid(a,b,.44,h+.08);
 }
 for(const p of plan.plants){const {x,z,size,tree}=p,y=yAt(x,z);
  if(tree){const h=7.5+rnd()*3.7;rod(v(x,y,z),v(x+.15,y+h*.8,z),.27,bark,.09);
   for(let i=0;i<7;i++){const a=i*2.399,xx=x+Math.cos(a)*size*.55,zz=z+Math.sin(a)*size*.55,yy=y+h*(.57+rnd()*.21);rod(v(x,y+h*.38,z),v(xx,yy,zz),.09,bark,.03);leaf(xx,yy+.65,zz,size*.55,size*.56,size*.53,leaves[i%5]);}
   for(let i=0;i<13;i++){const a=i*2.399,r=size*Math.sqrt(rnd())*.72;leaf(x+Math.cos(a)*r,y+h*.70+rnd()*h*.24,z+Math.sin(a)*r,size*.38,size*.36,size*.40,leaves[i%5]);}
   solid([x,z-.22],[x,z+.22],.46,h*.42);
  }else{for(let i=0;i<5;i++){const a=i*2.4,r=size*.32;leaf(x+Math.cos(a)*r,y+size*.48+rnd()*.22,z+Math.sin(a)*r,size*.70,size*.60,size*.72,leaves[i%5]);}}
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
