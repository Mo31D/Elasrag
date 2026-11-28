import * as THREE from 'three';
import type {BuildingFeature} from '../types/game';
import {pointInRing} from '../geo/projection';
import {streetEdge} from '../geo/blackSheepStreet';
import {buildingGrades,type Ground} from '../geo/surfaceGround';
import {HAYES_ID,HAYES_HOUSE_ID,HAYES_GARAGE_ID,HAYES_FRONTAGES,HAYES_ROOF_BAYS} from '../geo/hayesApproach';
export function buildHayesFacade(b:BuildingFeature,ground:Ground,wallTop:number){
 if(b.id!==HAYES_ID&&!HAYES_FRONTAGES.includes(b.id))return null;
 const group=new THREE.Group();group.name=b.id===HAYES_ID?'Hayes Garden World greenhouse roofs and entrance glazing':'Old Lake Road reference frontage';
 const materials:THREE.Material[]=[],geos:THREE.BufferGeometry[]=[],textures:THREE.Texture[]=[];
 const m=(color:number,roughness=.82)=>{const a=new THREE.MeshStandardMaterial({color,roughness});materials.push(a);return a;};
 const cream=m(0xdeddd1),dark=m(0x444b46),grey=m(0x777c78),frame=m(0x75877d),green=m(0x2d5d45),glass=m(0x50666c,.35),glassRoof=m(0x8eaaa5,.43),wood=m(0x8c7155),slate=m(0x5e625f);
 glassRoof.side=THREE.DoubleSide;
 const add=(g:THREE.BufferGeometry,mat:THREE.Material,parent=group)=>{geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,parent=group)=>{if(Math.min(w,h,d)<=0)return;const g=new THREE.BoxGeometry(w,h,d);const mesh=add(g,mat,parent);mesh.position.set(x,y,z);return mesh;};
 const line=(a:THREE.Vector3,c:THREE.Vector3,r:number,mat:THREE.Material)=>{const delta=c.clone().sub(a),g=new THREE.CylinderGeometry(r,r,delta.length(),6);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));g.translate((a.x+c.x)/2,(a.y+c.y)/2,(a.z+c.z)/2);add(g,mat);};
 const v=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
 const sign=(root:THREE.Group,w:number,h:number,x:number,y:number,z:number,label:string)=>{const c=document.createElement('canvas');c.width=768;c.height=Math.max(80,Math.round(768*h/w));const ctx=c.getContext('2d')!;ctx.fillStyle='#2c684d';ctx.fillRect(0,0,c.width,c.height);ctx.font='bold '+Math.round(c.height*.56)+'px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f1efda';ctx.fillText(label,c.width/2,c.height/2,c.width*.94);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);const mat=new THREE.MeshBasicMaterial({map:t});materials.push(mat);const p=add(new THREE.PlaneGeometry(w,h),mat,root);p.position.set(x,y,z);};
 const base=buildingGrades(b,ground).high;
 const ring=b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as [number,number]);
 if(b.id===HAYES_ID){
  // Each curved roof is strictly clipped to a rectangle contained in the mapped body.
  for(const bay of HAYES_ROOF_BAYS){
   const w=bay.width,L=bay.length,across='across' in bay&&bay.across;
   const p=(u:number,z:number)=>across?[bay.x+z,bay.z+u] as [number,number]:[bay.x+u,bay.z+z] as [number,number];
   let valid=true;for(let u=-w/2;u<=w/2+.001;u+=w/10)for(let z=-L/2;z<=L/2+.001;z+=L/20)if(!pointInRing(...p(u,z),ring))valid=false;
   if(!valid)continue;
   const y=wallTop+.22,rise=w*.30,N=16;
   const at=(u:number,z:number)=>{const [x,zz]=p(u,z);return v(x,y+rise*Math.sqrt(Math.max(0,1-(u*2/w)**2)),zz);};
   const positions:number[]=[],uv:number[]=[];
   for(let i=0;i<N;i++){const a=-w/2+w*i/N,c=-w/2+w*(i+1)/N,A=at(a,-L/2),B=at(c,-L/2),C=at(c,L/2),D=at(a,L/2);positions.push(...A.toArray(),...B.toArray(),...C.toArray(),...A.toArray(),...C.toArray(),...D.toArray());uv.push(0,0,1,0,1,1,0,0,1,1,0,1);
    line(A,D,.04,frame);
    for(let z=-L/2;z<=L/2+.01;z+=2.5)line(at(a,z),at(c,z),.055,frame);
   }
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();add(g,glassRoof);
   for(const z of [-L/2,L/2]){const shape=new THREE.Shape();shape.moveTo(-w/2,0);for(let i=0;i<=N;i++){const u=-w/2+w*i/N;shape.lineTo(u,rise*Math.sqrt(Math.max(0,1-(u*2/w)**2)));}shape.lineTo(w/2,0);shape.closePath();const geo=new THREE.ShapeGeometry(shape);if(across)geo.rotateY(Math.PI/2);const [x,zz]=p(0,z);geo.translate(x,y,zz);add(geo,glassRoof);}
  }
  // Glazed shop elevation on the mapped eastern wing, with white/grey cladding.
  const e=b.pts.map((_,i)=>streetEdge(b,i)).filter(e=>e.nx>.6&&e.length>12).sort((a,c)=>c.length-a.length)[0];
  if(e){const root=new THREE.Group();root.position.set(e.x,base,e.z);root.rotation.y=e.yaw;group.add(root);const L=e.length-.35,H=wallTop-base;
   box(L,.28,.13,0,Math.max(2.8,H-.25),.08,grey,root);
   for(let x=-L/2+1.2;x<L/2-.5;x+=2.4){box(2.2,2.20,.08,x,1.43,.08,frame,root);box(2.04,2.04,.055,x,1.43,.15,glass,root);box(.065,2.06,.08,x,1.43,.20,cream,root);}
   sign(root,Math.min(7,L*.7),.52,0,Math.max(2.9,H-.7),.22,'Hayes Garden World');
  }
 }else{
  // Garage fronts face the mapped Old Lake Road, other houses face Lake Road.
  const edges=b.pts.map((_,i)=>streetEdge(b,i)),e=edges.filter(e=>e.nx<-.35).sort((a,c)=>c.length-a.length)[0]??edges[0];
  const root=new THREE.Group();root.position.set(e.x,base,e.z);root.rotation.y=e.yaw;group.add(root);const L=e.length-.25,H=wallTop-base;
  const sash=(x:number,y:number,w:number,h:number)=>{if(y+h/2+.12>H)return;box(w+.21,h+.18,.10,x,y,.06,grey,root);box(w,h,.07,x,y,.13,cream,root);box(w-.13,h-.13,.04,x,y,.19,glass,root);box(.045,h-.10,.05,x,y,.22,cream,root);box(w-.08,.05,.05,x,y,.22,cream,root);box(w+.23,.09,.16,x,y-h/2-.07,.13,grey,root);};
  if(b.id===HAYES_GARAGE_ID){const w=Math.min(L*.55,3.15),h=Math.min(2.40,H-.30),x=L*.12;box(w+.22,h+.18,.12,x,h/2,.08,dark,root);box(w,h,.07,x,h/2,.17,grey,root);for(let yy=.11;yy<h;yy+=.11)box(w,.018,.018,x,yy,.216,dark,root);box(.75,2.02,.11,-L*.33,1.01,.10,wood,root);if(H>4.4){box(L,Math.max(.1,H-3.0),.08,0,(H+3)/2,.05,cream,root);for(const xx of [-L*.26,L*.24])sash(xx,Math.min(H-.85,4.15),.92,1.45);}}
  else{for(let y=1.48;y+1.0<H;y+=2.48)for(let x=-L/2+.85;x<L/2-.55;x+=2.15)sash(x,y,.91,1.64);box(.85,2.06,.08,Math.min(L/2-.52,.6),1.03,.10,wood,root);}
 }
 return {group,dispose(){geos.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
