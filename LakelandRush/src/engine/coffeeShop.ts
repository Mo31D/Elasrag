import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {BuildingFeature} from '../types/game';
import type {Ground} from '../geo/surfaceGround';
import {coffeeShopPlan,type P} from '../geo/coffeeShopPlan';

// A self-contained, photo-referenced exterior. No reference photo pixels are used.
export function buildCoffeeShop(b:BuildingFeature,ground:Ground,wallTop:number,stone:THREE.MeshStandardMaterial,roof:THREE.MeshStandardMaterial){
 const p=coffeeShopPlan(b);if(!p)return null;
 const group=new THREE.Group();group.name='Waterhead Coffee Shop — reference exterior';group.position.set(p.x,wallTop- Math.max(3.4,b.h-1.6),p.z);group.rotation.y=p.yaw;
 const base=group.position.y,H=Math.max(3.4,b.h-1.6),ridgeH=1.85;
 const owned:THREE.Material[]=[],textures:THREE.Texture[]=[],geometries:THREE.BufferGeometry[]=[];
 const m=(color:number,roughness=.75,metalness=0)=>{const v=new THREE.MeshStandardMaterial({color,roughness,metalness});owned.push(v);return v;};
 const slate=stone.clone();slate.color.set(0xa2a09a);slate.side=THREE.DoubleSide;owned.push(slate);
 const roofSlate=roof.clone();roofSlate.side=THREE.DoubleSide;owned.push(roofSlate);
 const cream=m(0xd8d2be),green=m(0x777e65,.6,.18),dark=m(0x293333),glass=m(0x344e55,.24,.18),blue=m(0x164779,.63),red=m(0x813036),wood=m(0x655140),iron=m(0x9a9a80,.65,.15),white=m(0xe6e2d5),pink=m(0x95545c),leaf=m(0x4e6737),flower=m(0xc7495d);
 const canopy=new THREE.MeshStandardMaterial({color:0xa9c0b6,transparent:true,opacity:.29,depthWrite:false,roughness:.24,side:THREE.DoubleSide});owned.push(canopy);
 const buckets=new Map<THREE.Material,THREE.BufferGeometry[]>();
 function add(g:THREE.BufferGeometry,mat:THREE.Material){const list=buckets.get(mat)??[];list.push(g);buckets.set(mat,list);}
 function box(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,ry=0,rx=0){const g=new THREE.BoxGeometry(w,h,d);g.rotateX(rx);g.rotateY(ry);g.translate(x,y,z);add(g,mat);}
 function rod(a:THREE.Vector3,b:THREE.Vector3,r:number,mat:THREE.Material){const d=b.clone().sub(a);if(d.length()<.001)return;const g=new THREE.CylinderGeometry(r,r,d.length(),6);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);add(g,mat);}
 const v=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
 function ball(x:number,y:number,z:number,r:number,mat:THREE.Material){add(new THREE.SphereGeometry(r,7,5).translate(x,y,z),mat);}
 function triSurface(points:number[][],uv:number[][],mat:THREE.Material){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv.flat(),2));g.computeVertexNormals();add(g,mat);}
 function quad(a:number[],b:number[],c:number[],d:number[],mat:THREE.Material,w=1,h=1){triSurface([a,b,c,a,c,d],[[0,0],[w,0],[w,h],[0,0],[w,h],[0,h]],mat);}
 const minZ=Math.min(...p.outline.map(q=>q[1])),maxZ=Math.max(...p.outline.map(q=>q[1])),ridge=(minZ+maxZ)/2;
 const height=(z:number)=>H+ridgeH*Math.max(0,1-Math.abs(z-ridge)/Math.max(.1,(maxZ-minZ)/2));
 function clip(poly:P[],positive:boolean):P[]{const out:P[]=[];const inside=(q:P)=>positive?q[1]>=ridge:q[1]<=ridge;
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ia=inside(a),ib=inside(b);if(ia)out.push(a);if(ia!==ib){const t=(ridge-a[1])/(b[1]-a[1]);out.push([a[0]+(b[0]-a[0])*t,ridge]);}}return out;}
 // Exact mapped polygon walls with metric UVs and a genuine two-slope gable.
 const area=p.outline.reduce((sum,a,i)=>{const b=p.outline[(i+1)%p.outline.length];return sum+a[0]*b[1]-b[0]*a[1]},0);
 for(let i=0;i<p.outline.length;i++){let a=p.outline[i],b=p.outline[(i+1)%p.outline.length];if(area<0)[a,b]=[b,a];const chain:P[]=[a];if((a[1]-ridge)*(b[1]-ridge)<0)chain.push([a[0]+(b[0]-a[0])*(ridge-a[1])/(b[1]-a[1]),ridge]);chain.push(b);
  for(let j=1;j<chain.length;j++){const [x,z]=chain[j-1],[u,w]=chain[j],len=Math.hypot(u-x,w-z);quad([x,-2.2,z],[u,-2.2,w],[u,height(w),w],[x,height(z),z],slate,len/2,(H+2.2)/2);}
 }
 for(const positive of [false,true]){const poly=clip(p.outline,positive);const indices=THREE.ShapeUtils.triangulateShape(poly.map(q=>new THREE.Vector2(q[0],q[1])),[]);
  const vertices:number[][]=[],uv:number[][]=[];for(const face of indices)for(const k of face){const [x,z]=poly[k];vertices.push([x,height(z)+.045,z]);uv.push([x/2,z/2]);}triSurface(vertices,uv,roofSlate);}
 // Roof edging and gutters along the mapped perimeter.
 for(let i=0;i<p.outline.length;i++){const a=p.outline[i],b=p.outline[(i+1)%p.outline.length];const chain:P[]=[a];if((a[1]-ridge)*(b[1]-ridge)<0)chain.push([a[0]+(b[0]-a[0])*(ridge-a[1])/(b[1]-a[1]),ridge]);chain.push(b);for(let j=1;j<chain.length;j++){const [x,z]=chain[j-1],[u,w]=chain[j];rod(v(x,height(z)+.04,z),v(u,height(w)+.04,w),.055,dark);}}
 function window(x:number,y:number,w:number,h:number,z=.07,frame=cream){
  box(w+.16,h+.18,.12,x,y,z,frame);box(w-.055,h-.055,.10,x,y,z+.065,glass);
  box(.045,h,.08,x,y,z+.13,frame);box(w,.045,.08,x,y+.10,z+.13,frame);
  box(w+.27,.13,.22,x,y-h/2-.09,z+.04,white);box(w+.27,.16,.18,x,y+h/2+.11,z+.02,slate);
 }
 // Photo references: two-storey stone, cream sash windows, pale sills and shop doors.
 for(const x of [-2.65,2.48]){window(x,1.35,1.14,1.50);window(x,H-1.40,1.01,1.44);}
 window(-.95,H-1.40,.86,1.36);
 box(1.13,2.21,.12,.12,1.105,.08,green);box(.82,1.39,.08,.12,1.46,.16,glass);box(.045,1.35,.08,.12,1.46,.22,cream);ball(.53,.98,.24,.045,iron);
 box(1.48,.10,.36,.12,.05,.22,slate);
 function sign(label:string,w:number,h:number,x:number,y:number,z:number,round=false,bg='#17477a',cup=false){
  const canvas=document.createElement('canvas');canvas.width=round?256:512;canvas.height=round?256:128;const ctx=canvas.getContext('2d')!;
  if(round){ctx.beginPath();ctx.arc(128,128,123,0,Math.PI*2);ctx.fillStyle=bg;ctx.fill();ctx.strokeStyle='#e3e1d3';ctx.lineWidth=3;ctx.stroke();}else{ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);}
  ctx.textAlign='center';ctx.fillStyle='#fff8e9';ctx.textBaseline='middle';
  if(cup){ctx.fillRect(88,63,69,28);ctx.beginPath();ctx.arc(122,91,35,0,Math.PI);ctx.fill();ctx.strokeStyle='#fff8e9';ctx.lineWidth=5;ctx.beginPath();ctx.arc(158,76,13,-Math.PI/2,Math.PI/2);ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(108+i*13,56);ctx.quadraticCurveTo(98+i*13,44,112+i*13,30);ctx.stroke();}
   ctx.font='italic 31px Georgia';ctx.fillText('Waterhead',128,149,218);ctx.font='bold 15px Arial';ctx.fillText('COFFEE SHOP',128,181);
  }else{ctx.font='bold '+(round?'27':'46')+'px Arial';ctx.fillText(label,canvas.width/2,canvas.height/2,canvas.width-30);}
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);
  const mat=new THREE.MeshBasicMaterial({map:tex,transparent:round,depthWrite:!round,side:THREE.DoubleSide});owned.push(mat);
  const geo=new THREE.PlaneGeometry(w,h);geometries.push(geo);const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);group.add(mesh);
 }
 sign('Waterhead',1.44,1.44,.77,H-1.40,.24,true,'#18477c',true);
 for(const x of [-2.6,2.45]){box(2.18,.32,.37,x,2.68,.21,blue);sign('coffee shop',2.04,.25,x,2.68,.408);}
 // A second gable identity: orient front details to the mapped southern end.
 const a=b.pts[4],q=b.pts[0],A=p.outline[4],B=p.outline[0],mid:P=[(A[0]+B[0])/2,(A[1]+B[1])/2],len=Math.hypot(q[0]-a[0],q[1]-a[1]);
 const end=new THREE.Group();end.position.set(mid[0],0,mid[1]);const dx=B[0]-A[0],dz=B[1]-A[1];end.rotation.y=Math.atan2(dz,-dx);
 // Outward normal is chosen against footprint centroid rather than guessed.
 const center=p.outline.reduce((s,q)=>[s[0]+q[0]/p.outline.length,s[1]+q[1]/p.outline.length],[0,0]);
 if(Math.sin(end.rotation.y)*(center[0]-mid[0])+Math.cos(end.rotation.y)*(center[1]-mid[1])>0)end.rotation.y+=Math.PI;
 const before=new Map([...buckets].map(([mat,gs])=>[mat,gs.length]));const childBefore=group.children.length;
 for(const x of [-len*.24,len*.24]){window(x,1.30,1.05,1.4);window(x,H-1.36,.94,1.42);}
 sign('Waterhead',1.45,1.45,0,H-1.36,.24,true,'#18477c',true);
 end.updateMatrix();for(const [mat,gs] of buckets)for(let i=before.get(mat)??0;i<gs.length;i++)gs[i].applyMatrix4(end.matrix);
 for(const mesh of group.children.slice(childBefore)){mesh.applyMatrix4(end.matrix);}
 // Terrace: tapered to keep the mapped promenade clear, with sloping glazed canopy.
 const yAt=(u:number,z:number)=>{const [x,w]=p.world(u,z);return Math.max(.45,ground(x,w))-base+.12;};
 const deckY=Math.max(yAt(p.left,.05),yAt(p.right,.05),yAt(p.left,p.depthAt(p.left)),yAt(p.right,p.depthAt(p.right)));
 const outer=(u:number)=>p.depthAt(u);
 const L=p.left,R=p.right;
 quad([L,deckY,.03],[R,deckY,.03],[R,deckY,outer(R)],[L,deckY,outer(L)],roofSlate,(R-L)/2,1);
 quad([L,deckY-.40,outer(L)],[R,deckY-.40,outer(R)],[R,deckY,outer(R)],[L,deckY,outer(L)],slate,(R-L)/2,.2);
 // Long pale metal posts, transparent panels, evenly spaced roof rafters, gutters and fence finials.
 const top=3.04,drop=.43;
 quad([L,top,.09],[R,top,.09],[R,top-drop,outer(R)],[L,top-drop,outer(L)],canopy,1,1);
 for(let i=0;i<=12;i++){const u=L+(R-L)*i/12;rod(v(u,top,.09),v(u,top-drop,outer(u)),.027,green);}
 for(const u of [L,(L+R)/2,R]){rod(v(u,deckY,outer(u)-.04),v(u,top-drop,outer(u)-.04),.06,green);}
 rod(v(L,top-drop,outer(L)),v(R,top-drop,outer(R)),.075,green);
 rod(v(L,top,.09),v(R,top,.09),.055,green);
 const rail=(a:P,b:P)=>{const l=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(l/.19));
  for(let i=0;i<=n;i++){const t=i/n,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;rod(v(x,deckY+.05,z),v(x,deckY+.91,z),i%5===0?.026:.012,iron);if(i%5===0)ball(x,deckY+.97,z,.037,iron);}
  for(const h of [.11,.89])rod(v(a[0],deckY+h,a[1]),v(b[0],deckY+h,b[1]),.022,iron);};
 rail([L,outer(L)-.04],[R,outer(R)-.04]);rail([L,.10],[L,outer(L)-.04]);rail([R,.92],[R,outer(R)-.04]);
 function table(x:number,z:number){const h=deckY+.72;add(new THREE.CylinderGeometry(.36,.36,.055,18).translate(x,h,z),dark);rod(v(x,deckY+.05,z),v(x,h,z),.035,iron);for(const side of [-1,1])rod(v(x-.23,deckY+.035,z+side*.14),v(x+.23,deckY+.035,z-side*.14),.025,iron);
  for(const off of [-.11,.11]){add(new THREE.CylinderGeometry(.045,.035,.10,9).translate(x+off,h+.08,z),white);add(new THREE.CylinderGeometry(.072,.072,.012,10).translate(x+off,h+.035,z),white);}}
 function chair(x:number,z:number,yaw:number){const c=Math.cos(yaw),s=Math.sin(yaw),at=(u:number,w:number)=>[x+u*c+w*s,z-u*s+w*c];
  box(.33,.055,.32,x,deckY+.43,z,pink,yaw);
  for(const u of [-.13,.13])for(const w of [-.13,.13]){const [px,pz]=at(u,w);rod(v(px,deckY+.01,pz),v(px,deckY+.44,pz),.016,iron);}
  const [bx,bz]=at(0,.15);box(.34,.30,.045,bx,deckY+.66,bz,cream,yaw);}
 for(const x of [-.52,1.34,2.65]){const z=outer(x)*.53;table(x,z);chair(x-.51,z,-Math.PI/2);chair(x+.51,z,Math.PI/2);}
 for(const x of [-1.62,1.97]){const z=outer(x)-.07;box(.47,.18,.21,x,deckY+.94,z,red);for(let i=0;i<6;i++){ball(x-.18+i*.07,deckY+1.08,z,.085,leaf);ball(x-.18+i*.07,deckY+1.15,z,.047,flower);}}
 sign('Blueberry Scones',1.05,.20,R-.65,deckY+.79,outer(R-.65)+.025,false,'#813036');
 for(const [mat,gs] of buckets){const non=gs.map(g=>g.index?g.toNonIndexed():g);const merged=mergeGeometries(non);for(const g of new Set([...gs,...non]))g.dispose();if(merged){geometries.push(merged);const mesh=new THREE.Mesh(merged,mat);mesh.castShadow=mat!==canopy;mesh.receiveShadow=true;group.add(mesh);}}
 return {group,dispose(){geometries.forEach(g=>g.dispose());owned.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
