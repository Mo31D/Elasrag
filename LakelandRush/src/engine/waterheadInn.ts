import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {BuildingFeature} from '../types/game';
import {buildingGrades,type Ground} from '../geo/surfaceGround';
import {streetEdge} from '../geo/blackSheepStreet';
import {wallCollider,type SolidCollider,type Point} from '../game/buildingCollision';
export const WATERHEAD_INN_ID=423874287;
// A single mapped footprint includes the historic two-storey inn and its lower extensions.
export function buildWaterheadInn(b:BuildingFeature,ground:Ground,stoneSource:THREE.MeshStandardMaterial,slate:THREE.MeshStandardMaterial){
 const group=new THREE.Group();group.name='The Waterhead Inn - Lake Road photo frontage';
 const materials:THREE.Material[]=[],geos:THREE.BufferGeometry[]=[],textures:THREE.Texture[]=[],colliders:SolidCollider[]=[];
 const m=(color:number,roughness=.85)=>{const a=new THREE.MeshStandardMaterial({color,roughness});materials.push(a);return a;};
 const stone=stoneSource.clone();stone.color.set(0x696863);materials.push(stone);
 const cream=m(0xdeddd2),trim=m(0xe6e5dc),sill=m(0x88867b),glass=m(0x34454b,.25),iron=m(0x343a3b,.6),whiteRail=m(0xe4e4d9,.65),door=m(0x535d55),black=m(0x242a2b),leaf=m(0x53633b),pot=m(0x6e5847);
 const base=buildingGrades(b,ground).high,low=3.65,eaves=6.55;
 const ring=b.pts.map(([x,z])=>[x+b.cx,z+b.cz] as Point);
 const add=(g:THREE.BufferGeometry,mat:THREE.Material,parent=group)=>{geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,parent=group)=>{if(Math.min(w,h,d)<=0)return;const a=add(new THREE.BoxGeometry(w,h,d),mat,parent);a.position.set(x,y,z);return a;};
 const rod=(a:THREE.Vector3,c:THREE.Vector3,r:number,mat:THREE.Material,parent=group)=>{const d=c.clone().sub(a);if(d.length()<.001)return;const g=new THREE.CylinderGeometry(r,r,d.length(),6);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate((a.x+c.x)/2,(a.y+c.y)/2,(a.z+c.z)/2);add(g,mat,parent);};
 const v=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
 const extrude=(points:Point[],bottom:number,top:number,mat:THREE.Material)=>{const s=new THREE.Shape();points.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:top-bottom,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,bottom,0);add(g,mat);};
 const main=[...ring.slice(8,17),[108.7,-351.1] as Point,ring[7]];
 // Full footprint foundation and one-storey wings, then a connected upper floor.
 extrude(ring,Math.min(base-2.2,buildingGrades(b,ground).low-.35),base+low,stone);
 extrude(main,base+low-.02,base+eaves,stone);
 const roof=(root:THREE.Group,w:number,d:number,h:number,y:number,z:number,hip=false)=>{
  const pos:number[]=[],uv:number[]=[];const a=[-w/2,y,z],b=[w/2,y,z],c=[w/2,y,z-d],d0=[-w/2,y,z-d],p=[0,y+h,z-(hip?d*.22:0)],q=[0,y+h,z-d+(hip?d*.22:0)];
  const tri=(a:number[],b:number[],c:number[])=>{pos.push(...a,...b,...c);uv.push(0,0,1,0,1,1);};
  tri(a,p,q);tri(a,q,d0);tri(b,c,q);tri(b,q,p);
  if(hip){tri(a,b,p);tri(c,d0,q);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();add(g,slate,root);
 };
 const rootFor=(i:number)=>{const e=streetEdge(b,i),root=new THREE.Group();root.position.set(e.x,base,e.z);root.rotation.y=e.yaw;group.add(root);return {root,e};};
 const sign=(root:THREE.Group,x:number,y:number,z:number,w:number,h:number)=>{
  const c=document.createElement('canvas');c.width=1024;c.height=230;const ctx=c.getContext('2d')!;ctx.fillStyle='#222426';ctx.fillRect(0,0,1024,230);ctx.fillStyle='#e4e2da';ctx.fillRect(0,0,135,230);ctx.fillRect(889,0,135,230);
  ctx.fillStyle='#f5f3e9';ctx.textAlign='center';ctx.font='bold 65px Arial';ctx.fillText('THE WATERHEAD INN',512,105,720);ctx.font='bold 24px Arial';ctx.fillText('A M B L E S I D E',512,153);
  ctx.fillStyle='#677d89';for(const u of [67,956]){ctx.beginPath();ctx.arc(u,105,32,0,Math.PI*2);ctx.fill();ctx.fillStyle='#b1c1c5';ctx.fillRect(u-19,98,38,6);ctx.fillStyle='#677d89';}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);const mat=new THREE.MeshBasicMaterial({map:t});materials.push(mat);box(w,h,.07,x,y,z-.035,black,root);const a=add(new THREE.PlaneGeometry(w,h),mat,root);a.position.set(x,y,z+.008);
 };
 const sash=(root:THREE.Group,x:number,y:number,w:number,h:number,arch=false)=>{
  if(!arch){box(w+.20,h+.20,.12,x,y,.035,sill,root);box(w,h,.10,x,y,.12,trim,root);box(w-.13,h-.13,.04,x,y,.19,glass,root);box(.055,h-.13,.045,x,y,.218,trim,root);box(w-.12,.055,.045,x,y,.218,trim,root);}
  else{const shape=(W:number,H:number)=>{const s=new THREE.Shape(),r=W/2;s.moveTo(-r,-H/2);s.lineTo(r,-H/2);s.lineTo(r,H/2-r);s.absarc(0,H/2-r,r,0,Math.PI,false);s.closePath();return s;};for(const [W,H,z,mat] of [[w+.23,h+.20,.065,sill],[w,h,.135,trim],[w-.14,h-.13,.198,glass]] as [number,number,number,THREE.Material][]){const a=add(new THREE.ShapeGeometry(shape(W,H)),mat,root);a.position.set(x,y,z);}box(w-.13,.055,.045,x,y+.10,.22,trim,root);}
  box(w+.28,.10,.25,x,y-h/2-.045,.10,sill,root);
 };
 const gable=(root:THREE.Group,w:number,rise:number,d:number)=>{const s=new THREE.Shape();s.moveTo(-w/2,eaves);s.lineTo(w/2,eaves);s.lineTo(0,eaves+rise);s.closePath();const a=add(new THREE.ShapeGeometry(s),stone,root);a.position.z=.025;roof(root,w+.28,d,rise,eaves,.12);for(const side of [-1,1])rod(v(side*(w/2+.14),eaves,.19),v(0,eaves+rise+.06,.19),.10,trim,root);};
 // Street-facing edges run from the southern gabled wing to the north extensions.
 for(const i of [11,12,13,14,15,16,17,18,19,20,0,1,27]){
  const {root,e}=rootFor(i),L=e.length;
  if(i>=11&&i<=16){
   if([12,13,15].includes(i))gable(root,Math.min(L-.2,i===13?5.5:6.0),i===12?2.15:1.72,3.7);
   const xs=i===12?[-1.45,1.45]:i===13?[-2.1,.4,2.5]:i===15?[-1.5,1.5]:L>5?[-L*.23,L*.23]:[0];
   for(const x of xs){sash(root,x,5.05,i===12?1.15:1.05,1.75,i===12);if(i!==14)sash(root,x,1.77,i===12?1.28:1.08,2.05,i===12);}
   if(i===13)sign(root,.1,3.22,.27,4.7,.88);
   if(i===14){ // Glazed hipped-roof vestibule, three broad entrance steps and white rails.
    const w=4.05,d=1.55;box(w,.42,d+.24,0,.21,d/2, sill,root);box(w,.25,.20,0,2.75,d,trim,root);
    for(const x of [-w/2,-.79,0,.79,w/2])box(.11,2.55,.11,x,1.49,d,trim,root);
    for(const x of [-1.43,-.40,.40,1.43])box(x*x>1?1.02:.71,2.15,.045,x,1.55,d+.012,glass,root);
    for(const s of [-1,1]){box(.09,2.35,d,s*w/2,1.45,d/2,glass,root);box(.13,2.6,.13,s*w/2,1.48,0,trim,root);}
    roof(root,w+.34,d+.34,.94,2.80,d+.22,true);
    for(let j=0;j<3;j++){const depth=.44+j*.34,h=.42-j*.14;box(w+.42+j*.32,h,depth,0,h/2,d+depth/2-.02,sill,root);const p=(u:number,z:number):Point=>[e.x+u*Math.cos(e.yaw)+z*Math.sin(e.yaw),e.z-u*Math.sin(e.yaw)+z*Math.cos(e.yaw)];const A=p(-w/2-.21-j*.16,d+depth/2-.02),B=p(w/2+.21+j*.16,d+depth/2-.02);colliders.push(wallCollider(A,B,depth,base+h,base+h));}
    for(const s of [-1,1]){for(let j=0;j<5;j++){const z=d+.08+j*.24;rod(v(s*2.14,.47-j*.075,z),v(s*2.14,1.25-j*.075,z),.024,whiteRail,root);}rod(v(s*2.14,1.27,d),v(s*2.14,.96,d+1.1),.036,whiteRail,root);}
   }
   if(i===12){ // External black fire staircase, along the facade rather than in the carriageway.
    const w=1.0,x=-L/2+.65;for(let j=0;j<13;j++){const u=x+j*.24,y=.24+j*.235;box(.29,.11,w,u,y,.62,iron,root);for(const z of [.12,1.12])rod(v(u,y,z),v(u,y+.90,z),.022,iron,root);}
    for(const z of [.12,1.12])rod(v(x,.99,z),v(x+3.05,3.80,z),.043,iron,root);box(1.05,.16,1.1,x+3.4,3.15,.62,iron,root);
   }
   if(i!==14&&i!==12)for(const x of [-L*.37,L*.37]){box(.22,.20,.23,x,1.40,.26,pot,root);const a=add(new THREE.SphereGeometry(.23,7,5),leaf,root);a.position.set(x,1.58,.28);}
  }else{
   box(L-.06,low-.14,.06,0,low/2,.047,cream,root);
   for(let x=-L/2+1.1;x<L/2-.6;x+=2.4)sash(root,x,1.65,1.0,1.48);
   if(i===20){sign(root,0,2.89,.18,5.7,.72);roof(root,L-.2,6.0,1.65,low,.06,true);}
   if(i===0)roof(root,L-.1,6.0,1.7,low,.08,true);
  }
 }
 // Main ridge with connected roof planes; all visible gables have masonry beneath them.
 // Continuous pitched main roof, clipped to the mapped upper-storey polygon.
 const ridge=115.1,roofY=(x:number)=>base+eaves+2.05*Math.max(0,1-Math.abs(x-ridge)/6.5);
 const clip=(side:number)=>{const out:Point[]=[];for(let i=0;i<main.length;i++){const a=main[i],b=main[(i+1)%main.length],inside=(p:Point)=>side*(p[0]-ridge)>=-1e-8;if(inside(a))out.push(a);if(inside(a)!==inside(b)){const t=(ridge-a[0])/(b[0]-a[0]);out.push([ridge,a[1]+t*(b[1]-a[1])]);}}return out;};
 const roofPositions:number[]=[],roofUV:number[]=[];
 for(const side of [-1,1]){const p=clip(side);for(const face of THREE.ShapeUtils.triangulateShape(p.map(([x,z])=>new THREE.Vector2(x,z)),[])){let [a,b,c]=face.map(i=>p[i]);if((b[1]-a[1])*(c[0]-a[0])-(b[0]-a[0])*(c[1]-a[1])<0)[b,c]=[c,b];for(const [x,z] of [a,b,c]){roofPositions.push(x,roofY(x),z);roofUV.push(x/2,z/2);}}}
 const roofGeo=new THREE.BufferGeometry();roofGeo.setAttribute('position',new THREE.Float32BufferAttribute(roofPositions,3));roofGeo.setAttribute('uv',new THREE.Float32BufferAttribute(roofUV,2));roofGeo.computeVertexNormals();add(roofGeo,slate);
 const fill:number[]=[],fillUV:number[]=[];for(let i=0;i<main.length;i++){const a=main[i],b=main[(i+1)%main.length],points:Point[]=[a];if((a[0]-ridge)*(b[0]-ridge)<0){const t=(ridge-a[0])/(b[0]-a[0]);points.push([ridge,a[1]+t*(b[1]-a[1])]);}points.push(b);for(let j=1;j<points.length;j++){const [x,z]=points[j-1],[xx,zz]=points[j];const A=[x,base+eaves,z],B=[xx,base+eaves,zz],C=[xx,roofY(xx),zz],D=[x,roofY(x),z];fill.push(...A,...B,...C,...A,...C,...D);fillUV.push(0,0,1,0,1,1,0,0,1,1,0,1);}}
 const fillGeo=new THREE.BufferGeometry();fillGeo.setAttribute('position',new THREE.Float32BufferAttribute(fill,3));fillGeo.setAttribute('uv',new THREE.Float32BufferAttribute(fillUV,2));fillGeo.computeVertexNormals();const roofStone=stone.clone();roofStone.side=THREE.DoubleSide;materials.push(roofStone);add(fillGeo,roofStone);
 for(const [x,z,h] of [[114,-326,2.7],[114,-339,2.2],[115,-348,2.3],[128,-374,2.5],[134,-399,2.1]]){const y=base+(z>-354?eaves+1.15:low+.9);box(.95,h,1.04,x,y+h/2-.35,z,stone);box(1.14,.16,1.20,x,y+h-.30,z,sill);for(const dx of [-.27,.27])box(.24,.40,.25,x+dx,y+h-.10,z,pot);}
 // Group the many rigid parts by material to keep mobile draw calls low.
 group.updateMatrixWorld(true);const bins=new Map<THREE.Material,THREE.BufferGeometry[]>();
 group.traverse(o=>{if(o instanceof THREE.Mesh){const orig=o.geometry as THREE.BufferGeometry,g=orig.index?orig.toNonIndexed():orig.clone();g.applyMatrix4(o.matrixWorld);if(!g.attributes.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));const list=bins.get(o.material as THREE.Material)??[];list.push(g);bins.set(o.material as THREE.Material,list);}});
 group.clear();geos.forEach(g=>g.dispose());geos.length=0;
 for(const [mat,list] of bins){const g=mergeGeometries(list);list.forEach(g=>g.dispose());if(g){geos.push(g);const a=new THREE.Mesh(g,mat);a.castShadow=true;a.receiveShadow=true;group.add(a);}}
 return {group,colliders,dispose(){geos.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
