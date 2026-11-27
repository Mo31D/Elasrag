import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {BuildingFeature} from '../types/game';
import type {Ground} from '../geo/surfaceGround';
import {LIBRARY_ID,libraryEdge,SHELTERS,kelsickZ} from '../geo/libraryBusStop';
type P=[number,number];
function kit(group:THREE.Group){
 const materials:THREE.Material[]=[],geos:THREE.BufferGeometry[]=[],textures:THREE.Texture[]=[];
 const m=(color:number,roughness=.82,metalness=0)=>{const v=new THREE.MeshStandardMaterial({color,roughness,metalness});materials.push(v);return v;};
 const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();
 const add=(g:THREE.BufferGeometry,mat:THREE.Material)=>{const list=batches.get(mat)??[];list.push(g);batches.set(mat,list);};
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,rz=0,ry=0)=>{if(Math.min(w,h,d)<=0)return;const g=new THREE.BoxGeometry(w,h,d);g.rotateZ(rz);g.rotateY(ry);g.translate(x,y,z);add(g,mat);};
 const rod=(a:THREE.Vector3,b:THREE.Vector3,r:number,mat:THREE.Material)=>{const d=b.clone().sub(a);if(d.length()<.001)return;const g=new THREE.CylinderGeometry(r,r,d.length(),8);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);add(g,mat);};
 const label=(w:number,h:number,x:number,y:number,z:number,draw:(ctx:CanvasRenderingContext2D,W:number,H:number)=>void,ry=0)=>{const cv=document.createElement('canvas');cv.width=768;cv.height=Math.max(96,Math.round(768*h/w));const ctx=cv.getContext('2d')!;draw(ctx,cv.width,cv.height);const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);const mat=new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide});materials.push(mat);const g=new THREE.PlaneGeometry(w,h);geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.position.set(x,y,z);mesh.rotation.y=ry;group.add(mesh);};
 const flush=()=>{for(const [mat,list] of batches){const g=mergeGeometries(list);list.forEach(v=>v.dispose());if(!g)continue;geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.castShadow=!mat.transparent;mesh.receiveShadow=true;group.add(mesh);}batches.clear();};
 return {m,materials,geos,textures,box,rod,label,add,flush,dispose(){geos.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
export function buildLibraryFacade(b:BuildingFeature,ground:Ground,wallTop:number,roof:THREE.MeshStandardMaterial){
 const group=new THREE.Group(),e=libraryEdge(b),base=Math.max(.45,ground(e.x+e.nx*.25,e.z+e.nz*.25))+.17;
 group.name=b.id===LIBRARY_ID?'Ambleside Library — Kelsick Road':'Library adjacent stone frontage';group.position.set(e.x,base,e.z);group.rotation.y=e.yaw;
 const k=kit(group),{m,box,label}=k;
 const dark=m(0x3e4545),frame=m(0x929a98),white=m(0xd2d2c8),stone=m(0x777d78),glass=m(0x3a4d53,.25,.22),back=m(0x303a39),wood=m(0x9b8265),teal=m(0x2d706f),chimney=m(0x706f65),pot=m(0x9c5740),grey=m(0xa7aaa3);
 const roofMat=roof.clone();roofMat.side=THREE.DoubleSide;k.materials.push(roofMat);
 const L=e.length-.18,H=wallTop-base;
 const sash=(x:number,y:number,w:number,h:number)=>{box(w+.22,h+.20,.11,x,y,.055,stone);box(w+.09,h+.09,.09,x,y,.12,dark);box(w,h,.05,x,y,.17,white);box(w-.11,h-.11,.045,x,y,.215,glass);box(w,.055,.07,x,y+.06,.25,white);box(w+.25,.11,.21,x,y-h/2-.10,.12,stone);};
 if(b.id===LIBRARY_ID){
  box(L,.16,.17,0,2.91,.09,stone);box(L,.19,.18,0,.17,.10,stone);box(L,.11,.20,0,2.76,.12,frame);
  const count=Math.max(4,Math.round(L/1.8)),w=L/count;
  for(let i=0;i<count;i++){
   const x=-L/2+w*(i+.5);
   box(w-.035,2.48,.07,x,1.46,.065,back);box(w-.12,1.72,.05,x,1.72,.12,glass);
   box(w-.10,.62,.07,x,.47,.16,grey);box(.065,2.5,.11,x-w/2+.04,1.46,.16,frame);box(w,.075,.11,x,.78,.16,frame);box(w,.075,.10,x,2.58,.16,frame);
   if(i!==0){
    label(w*.82,.55,x,.82,.205,(ctx,W,H)=>{ctx.fillStyle='#e9e5d7';ctx.fillRect(0,0,W,H);const colors=['#bc5e52','#5a8d9b','#e2ba54','#7e9874'];for(let j=0;j<3;j++){ctx.fillStyle=colors[(j+i)%4];ctx.fillRect(W*(.06+j*.31),H*.10,W*.25,H*.70);ctx.fillStyle='#fff9e6';ctx.fillRect(W*(.09+j*.31),H*.18,W*.19,H*.04);ctx.fillRect(W*(.09+j*.31),H*.27,W*.16,H*.035);}});
    for(let j=0;j<4;j++)box(.075,.22,.07,x-w*.27+j*w*.17,1.10,.17,j%2?wood:teal);
   }
  }
  const entrance=-L/2+w*.5;box(w*.8,2.34,.09,entrance,1.30,.21,dark);box(w*.67,1.78,.035,entrance,1.51,.27,glass);box(.055,.23,.06,entrance+w*.23,1.04,.31,white);
  label(Math.min(4.4,L*.35),.33,0,1.67,.23,(ctx,W,H)=>{ctx.fillStyle='#3b494a';ctx.fillRect(0,0,W,H);ctx.fillStyle='#f4f0e8';ctx.font='500 '+Math.round(H*.60)+'px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Ambleside Library',W/2,H/2,W*.95);});
  for(let i=0;i<6;i++)if(H>4.2)sash((i-2.5)*L/6,Math.min(H-.87,4.17),.63,1.52);
  box(L+.12,.20,.35,0,H-.08,.06,dark);
  // Slate roof pitched back from the frontage, preserving the existing footprint.
  const depth=2.1,rise=1.18;
  const slope=new THREE.BoxGeometry(L+.10,.12,Math.hypot(depth,rise));slope.rotateX(Math.atan2(rise,depth));slope.translate(0,H+rise/2,-depth/2);k.add(slope,roofMat);
  for(const x of [-L*.31,L*.29]){box(.82,1.18,.73,x,H+1.38,-1.55,chimney);box(.92,.14,.82,x,H+1.99,-1.55,stone);for(let i=0;i<3;i++){const g=new THREE.CylinderGeometry(.09,.12,.34,10).translate(x-.24+i*.24,H+2.22,-1.55);k.add(g,pot);}}
 }else{
  box(L,.20,.22,0,2.8,.10,stone);box(L,.22,.18,0,.23,.10,stone);
  const w=Math.min(2.5,L*.48);box(w,1.7,.11,-L*.19,1.48,.09,white);box(w-.14,1.55,.07,-L*.19,1.48,.16,glass);
  box(.96,2.20,.11,L*.27,1.18,.10,dark);box(.76,1.52,.06,L*.27,1.47,.17,glass);
  if(b.id===423644522)label(Math.min(2,L*.4),.36,L*.27,2.55,.20,(ctx,W,H)=>{ctx.fillStyle='#e2d9c8';ctx.fillRect(0,0,W,H);ctx.fillStyle='#564737';ctx.font='bold '+Math.round(H*.59)+'px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BEER',W/2,H/2);});
  for(const x of [-L*.24,L*.24])if(H>4.4)sash(x,4.20,.84,1.65);
 }
 k.flush();return {group,dispose:()=>k.dispose()};
}
export function buildLibraryBusShelters(ground:Ground){
 const group=new THREE.Group();group.name='Ambleside bus interchange — two green glazed shelters';
 const disposers:(()=>void)[]=[];
 for(const [i,s] of SHELTERS.entries()){
  const root=new THREE.Group();root.position.set(s.x,Math.max(.45,ground(s.x,s.z))+.21,s.z);root.rotation.y=Math.atan2(kelsickZ(s.x+1)-kelsickZ(s.x-1),-2)+Math.PI;group.add(root);
  const k=kit(root),{m,box,rod,label}=k;
  const green=m(0x315b49,.62,.25),dark=m(0x2b3532),seat=m(0x56645b),metal=m(0x9a9f96,.65,.3),cream=m(0xe3e2d6),yellow=m(0xd0af35);
  const glass=new THREE.MeshStandardMaterial({color:0xb5c9c2,transparent:true,opacity:.20,roughness:.18,side:THREE.DoubleSide,depthWrite:false});k.materials.push(glass);
  const L=s.length,D=1.45;
  for(const x of [-L/2,-L/6,L/6,L/2]){box(.07,2.21,.07,x,1.105,-D/2,green);box(.07,2.21,.07,x,1.105,D/2,green);}
  for(const y of [.16,1.14,2.18]){box(L,.06,.07,0,y,-D/2,green);for(const x of [-L/2,L/2])box(.07,.06,D,x,y,0,green);}
  for(let j=0;j<3;j++){const x=(j-1)*L/3;box(L/3-.08,1.96,.016,x,1.18,-D/2,glass);}
  for(const x of [-L/2,L/2])box(.016,1.97,D-.08,x,1.18,0,glass);
  // Front opening stays unobstructed; barrel roof with visible green ribs.
  const roofH=(z:number)=>2.19+.30*Math.sqrt(Math.max(0,1-(z/(D/2+.09))**2));
  for(let j=0;j<12;j++){const a=-D/2-.08+j*(D+.16)/12,b=-D/2-.08+(j+1)*(D+.16)/12;
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-L/2-.1,roofH(a),a,L/2+.1,roofH(a),a,L/2+.1,roofH(b),b,-L/2-.1,roofH(a),a,L/2+.1,roofH(b),b,-L/2-.1,roofH(b),b],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1],2));g.computeVertexNormals();k.add(g,glass);
   for(const x of [-L/2,-L/6,L/6,L/2])rod(new THREE.Vector3(x,roofH(a),a),new THREE.Vector3(x,roofH(b),b),.036,green);
  }
  box(L+.18,.08,.10,0,2.19,D/2+.07,green);box(L+.18,.08,.10,0,2.19,-D/2-.07,green);
  box(L*.69,.085,.37,0,.49,-.44,seat);for(const x of [-L*.27,L*.27])box(.075,.47,.29,x,.25,-.44,dark);
  box(.40,.75,.06,L/2-.24,1.48,-.63,cream);label(.35,.66,L/2-.24,1.48,-.59,(ctx,W,H)=>{ctx.fillStyle='#efeee4';ctx.fillRect(0,0,W,H);ctx.fillStyle='#315b49';ctx.fillRect(0,0,W,H*.17);ctx.font='bold '+Math.round(H*.09)+'px Arial';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('BUS TIMES',W/2,H*.12);ctx.fillStyle='#72796e';for(let j=0;j<13;j++)ctx.fillRect(W*.10,H*(.23+j*.052),W*.80,H*.012);});
  box(.06,2.75,.06,L/2+.36,1.375,.54,metal);box(.32,.43,.075,L/2+.36,2.46,.54,cream);
  label(.30,.38,L/2+.36,2.46,.59,(ctx,W,H)=>{ctx.fillStyle='#e9ebe1';ctx.fillRect(0,0,W,H);ctx.fillStyle='#38634b';ctx.fillRect(0,0,W,H*.22);ctx.fillStyle='#263a33';ctx.textAlign='center';ctx.font='bold '+Math.round(H*.16)+'px Arial';ctx.fillText('BUS STOP',W/2,H*.43,W*.92);ctx.fillText('Stand '+(i+1),W/2,H*.72);});
  // Parking information board beside shelter, no fabricated current tariffs.
  if(i===0){for(const x of [L/2+.7,L/2+1.15])box(.055,1.78,.055,x,.89,-.42,dark);box(.57,.84,.08,L/2+.925,1.34,-.42,yellow);label(.51,.76,L/2+.925,1.34,-.37,(ctx,W,H)=>{ctx.fillStyle='#d6b647';ctx.fillRect(0,0,W,H);ctx.fillStyle='#292a24';ctx.textAlign='center';ctx.font='bold '+Math.round(H*.17)+'px Arial';ctx.fillText('PAY',W/2,H*.30);ctx.fillText('HERE',W/2,H*.52);ctx.fillText('↓',W/2,H*.82);});}
  k.flush();disposers.push(()=>k.dispose());
 }
 return {group,dispose(){disposers.forEach(f=>f());}};
}
