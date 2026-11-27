import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {BuildingFeature} from '../types/game';
import type {Ground} from '../geo/surfaceGround';
import {streetEdge,BLACK_SHEEP_BUILDING,LAKE_ROAD_CORNER_BUILDING} from '../geo/blackSheepStreet';

export function buildBlackSheepStreetFacade(b:BuildingFeature,ground:Ground,wallTop:number,stone:THREE.MeshStandardMaterial,roof:THREE.MeshStandardMaterial){
 if(b.id!==BLACK_SHEEP_BUILDING&&b.id!==LAKE_ROAD_CORNER_BUILDING)return null;
 const group=new THREE.Group();group.name=b.id===BLACK_SHEEP_BUILDING?'Black Sheep and Lake Road historic frontage':'Lake Road corner frontage';
 const materials:THREE.Material[]=[],textures:THREE.Texture[]=[],geos:THREE.BufferGeometry[]=[];
 const m=(color:number,roughness=.8,metalness=0)=>{const a=new THREE.MeshStandardMaterial({color,roughness,metalness});materials.push(a);return a;};
 const black=m(0x131618,.66),blackTrim=m(0x222525,.52),sill=m(0x555651),cream=m(0xe0d9c8),pale=m(0xb7b6a9),navy=m(0x172c49),curtain=m(0xb66e6b),sandstone=m(0xa47660),sandDark=m(0x795044),timber=m(0x987454),warm=m(0x9a794c),door=m(0x382d25),iron=m(0x333637,.48,.2),white=m(0xe3dfd2);
 const glass=m(0x34414a,.24,.20),back=m(0x2a251f),lit=new THREE.MeshStandardMaterial({color:0xffd8a0,emissive:0xd99538,emissiveIntensity:.65,roughness:.7});materials.push(lit);
 const displayGlass=new THREE.MeshStandardMaterial({color:0xb7d2d5,transparent:true,opacity:.13,roughness:.14,metalness:.10,depthWrite:false});materials.push(displayGlass);
 const slate=roof.clone();slate.color.set(0x646361);slate.side=THREE.DoubleSide;materials.push(slate);
 const darkStone=stone.clone();darkStone.color.set(0x90877a);materials.push(darkStone);
 const gifts=[m(0xbcb39e),m(0xd8d0bc),m(0x655a43),m(0x57746d),m(0x9b5752),m(0xbca373),m(0x6b7b96),m(0xede1be)];
 function frontage(i:number){
  const e=streetEdge(b,i),base=Math.max(.45,ground(e.x+e.nx*.25,e.z+e.nz*.25))+.17;
  const root=new THREE.Group();root.position.set(e.x,base,e.z);root.rotation.y=e.yaw;group.add(root);
  const buckets=new Map<THREE.Material,THREE.BufferGeometry[]>();
  const add=(g:THREE.BufferGeometry,mat:THREE.Material)=>{const a=buckets.get(mat)??[];a.push(g);buckets.set(mat,a);};
  const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,ry=0,rx=0)=>{if(w<=0||h<=0||d<=0)return;const g=new THREE.BoxGeometry(w,h,d);g.rotateX(rx);g.rotateY(ry);g.translate(x,y,z);add(g,mat);};
  const sphere=(r:number,x:number,y:number,z:number,mat:THREE.Material,sx=1,sy=1,sz=1)=>{const g=new THREE.SphereGeometry(r,8,6);g.scale(sx,sy,sz);g.translate(x,y,z);add(g,mat);};
  const rod=(x:number,y:number,z:number,h:number,r:number,mat:THREE.Material)=>add(new THREE.CylinderGeometry(r,r,h,8).translate(x,y,z),mat);
  const sign=(label:string,w:number,h:number,x:number,y:number,z:number,bg:string,fg:string,serif=false)=>{const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=fg;ctx.font=(serif?'normal 106px Georgia':'bold 85px Arial');ctx.fillText(label,512,128,960);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);const mat=new THREE.MeshBasicMaterial({map:t});materials.push(mat);const g=new THREE.PlaneGeometry(w,h);geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.position.set(x,y,z);root.add(mesh);};
  const sash=(x:number,y:number,w:number,h:number,z=.07,frame=cream)=>{box(w+.26,h+.26,.14,x,y,z,pale);box(w+.10,h+.10,.13,x,y,z+.08,black);box(w,h,.065,x,y,z+.15,frame);box(w-.12,h-.12,.045,x,y,z+.19,glass);box(w,.055,.06,x,y-.05,z+.23,frame);box(.045,h*.47,.055,x,y+h*.24,z+.23,frame);for(const k of [-1,1])box(.042,h*.47,.055,x+k*w*.26,y+h*.24,z+.23,frame);box(w,.045,.06,x,y+h*.24,z+.23,frame);box(w+.3,.11,.25,x,y-h/2-.12,z+.09,sill);};
  const cornice=(x:number,y:number,w:number,mat:THREE.Material)=>{box(w,.12,.26,x,y,.15,mat);box(w+.10,.075,.34,x,y+.10,.17,mat);};
  const pilaster=(x:number,y:number,h:number,w:number,mat:THREE.Material)=>{box(w,h,.16,x,y,.12,mat);box(w+.075,.15,.24,x,y-h/2+.08,.15,mat);box(w+.08,.13,.25,x,y+h/2-.07,.15,mat);};
  function bayDisplay(x:number,w:number){
   const h=2.12,z=.45,y=1.38;
   box(w+.04,h+.05,.055,x,y,.045,back);box(w,.30,.44,x,.19,.24,blackTrim);box(w+.11,.095,.53,x,.065,.27,sill);box(w+.04,.055,.48,x,.355,.25,black);
   const left=x-w/2,right=x+w/2;
   for(const u of [left,right])box(.075,h,.13,u,y,z,black);
   for(const yy of [y-h/2,y+h/2])box(w,.075,.16,x,yy,z,black);
   // A shallow glass bay with angled returns and a true recessed doorway.
   for(const s of [-1,1]){box(.43,h,.022,x+s*(w/2+.055),y,.28,displayGlass,s*Math.PI/3);box(.06,h,.055,x+s*(w/2+.14),y,.12,black);}
   box(w-.12,h-.10,.018,x,y,z+.035,displayGlass);box(.048,h,.07,x,y,z+.025,black);
   box(w,.07,.12,x,2.47,.41,blackTrim);
   for(let row=0;row<4;row++){const sy=.48+row*.47;box(w-.16,.035,.31,x,sy,.235,warm);
    for(let j=0;j<7;j++){const u=x+(j-3)*(w-.22)/7,mat=gifts[(row*3+j)%gifts.length];const height=.10+.055*((row+j)%4);
     if((row+j)%4===0){sphere(.062,u,sy+.075,.21,mat,1,1.2,.75);sphere(.038,u,sy+.15,.21,mat);for(const s of [-1,1])sphere(.023,u+s*.035,sy+.182,.21,mat,1,1.2,.8);}
     else box(.085+.027*(j%3),height,.09,u,sy+height/2+.018,.21,mat);
    }
   }
   box(w-.15,.035,.12,x,2.30,.19,lit);
   // Larger recognisable soft toys at the top of each bay, with layered stock below.
   const toy=x+(x>0?-.18:.18),fur=x>0?gifts[0]:gifts[5];
   sphere(.17,toy,1.92,.30,fur,.85,1.05,.55);sphere(.12,toy,2.13,.31,fur,1,.95,.65);
   for(const s of [-1,1]){sphere(.058,toy+s*.105,2.24,.31,fur,.68,1.6,.60);sphere(.065,toy+s*.13,1.88,.33,fur);sphere(.019,toy+s*.046,2.15,.408,black);}
   sphere(.025,toy,2.10,.415,black);box(.22,.15,.065,toy,1.93,.408,gifts[x>0?6:4]);
  }
  const flush=()=>{for(const [mat,list] of buckets){const g=mergeGeometries(list,false);list.forEach(v=>v.dispose());if(!g)continue;geos.push(g);const mesh=new THREE.Mesh(g,mat);mesh.castShadow=!mat.transparent;mesh.receiveShadow=true;root.add(mesh);}};
  return {e,base,root,box,sphere,rod,sign,sash,cornice,pilaster,bayDisplay,flush};
 }
 if(b.id===BLACK_SHEEP_BUILDING){
  const f=frontage(7),{box,sign,sash,pilaster,cornice,bayDisplay,rod,sphere}=f,L=f.e.length;
  const split=-.56,shopLeft=split,shopRight=L/2-.08,shopW=shopRight-shopLeft,shopX=(shopLeft+shopRight)/2;
  const officeLeft=-L/2+.08,officeW=split-officeLeft,officeX=(officeLeft+split)/2;
  // Black timber frontage, warm metallic serif lettering, twin projecting display bays.
  box(shopW,2.91,.08,shopX,1.46,.06,black);
  box(shopW,.49,.30,shopX,2.72,.18,black);cornice(shopX,2.99,shopW,blackTrim);
  sign('THE BLACK SHEEP',shopW*.67,.29,shopX,2.73,.344,'#121516','#c4ae86',true);
  box(shopW,.045,.34,shopX,2.47,.18,blackTrim);box(shopW,.055,.35,shopX,2.96,.18,blackTrim);
  const doorW=1.08,available=(shopW-doorW-.80)/2,doorX=shopX-.19;
  bayDisplay(doorX-doorW/2-available/2-.11,available);
  bayDisplay(doorX+doorW/2+available/2+.11,available);
  box(doorW,2.32,.05,doorX,1.16,.105,black);box(doorW-.14,1.38,.055,doorX,1.43,.15,back);
  for(let row=0;row<5;row++){const y=.54+row*.28;box(.73,.025,.035,doorX,y,.185,warm);for(let j=0;j<4;j++)box(.13,.17,.025,doorX-.26+j*.17,y+.10,.195,gifts[(row+j)%gifts.length]);}
  box(doorW-.15,1.40,.015,doorX,1.43,.235,displayGlass);box(doorW-.16,.29,.03,doorX,2.15,.205,lit);
  box(doorW+.08,.055,.47,doorX,.035,.25,sill);
  box(doorW-.15,.49,.075,doorX,.32,.17,blackTrim);box(doorW,.07,.12,doorX,2.34,.20,black);
  for(const s of [-1,1])pilaster(doorX+s*(doorW/2+.035),1.19,2.38,.075,black);
  box(.052,.22,.055,doorX+.40,1.08,.207,warm);sign('2',.23,.20,doorX,2.13,.185,'#292521','#f2e2c4',true);
  pilaster(shopLeft+.07,1.40,2.8,.14,black);pilaster(shopRight-.06,1.40,2.8,.16,black);
  const menuX=shopRight-.25;box(.39,2.24,.065,menuX,1.31,.45,black);
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=1024;const ctx=canvas.getContext('2d')!;
  ctx.fillStyle='#151a19';ctx.fillRect(0,0,256,1024);ctx.textAlign='center';ctx.fillStyle='#d9c49a';ctx.font='bold 43px Georgia';ctx.fillText('LAKES',128,90);ctx.font='17px Arial';ctx.fillText('ICE CREAM',128,123);
  const flavours=['#f1e2c1','#bca17a','#e7b2b1','#bd976c','#e9e0b2','#b8c29b','#eee8da','#9b7965','#e2c7bc','#c4c7d0','#ddd4b1','#e7d3b9'];
  for(let i=0;i<12;i++){const x=i%2?184:72,y=180+Math.floor(i/2)*128;ctx.fillStyle=flavours[i];ctx.beginPath();ctx.arc(x,y,31,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d6c8a9';ctx.fillRect(x-26,y+43,52,3);}
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);const menuMat=new THREE.MeshBasicMaterial({map:tex});materials.push(menuMat);const mg=new THREE.PlaneGeometry(.35,2.14);geos.push(mg);const menu=new THREE.Mesh(mg,menuMat);menu.position.set(menuX,1.31,.488);f.root.add(menu);
  // Davenport & Scott: cream joinery, navy fascia, glazed central door and red blinds.
  box(officeW,2.86,.09,officeX,1.43,.07,cream);box(officeW-.18,.32,.15,officeX,2.76,.15,navy);
  sign('Davenport & Scott SOLICITORS',officeW-.30,.25,officeX,2.76,.236,'#182c49','#e9e9e0');
  const entry=officeX-.55,windowX=officeX+.82;
  box(.91,2.27,.1,entry,1.16,.16,cream);box(.69,1.34,.07,entry,1.46,.225,curtain);
  for(const y of [.90,1.73,2.16])box(.78,.07,.09,entry,y,.25,cream);box(.045,1.2,.07,entry,1.49,.26,cream);box(.14,.06,.06,entry+.25,.85,.25,iron);
  box(1.35,1.97,.08,windowX,1.35,.17,curtain);box(1.26,1.92,.02,windowX,1.35,.23,displayGlass);
  for(let i=0;i<11;i++)box(.016,1.76,.018,windowX-.57+i*.114,1.44,.235,sandDark);
  for(const s of [-1,1])box(.07,2.08,.10,windowX+s*.68,1.35,.24,cream);
  box(1.48,.18,.22,windowX,.30,.17,sill);box(1.48,.08,.12,windowX,2.39,.20,cream);
  box(.57,1.89,.09,officeLeft+.39,1.37,.19,curtain);box(.055,2.02,.11,officeLeft+.70,1.37,.24,cream);
  for(const u of [officeLeft+.09,split-.10])pilaster(u,1.40,2.8,.16,cream);
  cornice(officeX,2.98,officeW,cream);
  // Continuous Lakeland masonry above the shopfronts: tall sash windows, lintels, rain pipes.
  const upper=wallTop-f.base;
  for(const u of [officeX-.80,officeX+.80,shopX-1.12,shopX+1.12]){
   if(upper>4.9)sash(u,4.23,.91,1.73);
   if(upper>7.0)sash(u,6.72,.86,1.52);
  }
  for(const u of [split,shopRight-.06])rod(u,Math.max(3.2,upper/2),.18,Math.max(2.5,upper-.12),.045,iron);
  box(L,.13,.18,0,3.20,.08,sill);
  sign('LAKE ROAD',.76,.20,officeLeft+.48,3.47,.15,'#e0daca','#2e2e2b',true);
  f.flush();
  // Sandstone entrance and decorative projecting oriel immediately north of the shop.
  const n=frontage(9);
  // Edge 9 begins at the chamfer and extends north; local x increases north.
  const frontU= -n.e.length/2+3.1;
  n.box(5.4,2.95,.12,frontU,1.48,.07,sandstone);
  n.box(1.24,2.35,.09,frontU,1.20,.19,door);for(let i=0;i<4;i++){n.box(.045,1.93,.08,frontU-.44+i*.29,1.13,.25,sandDark);}
  for(const s of [-1,1]){n.pilaster(frontU+s*.82,1.24,2.44,.28,sandstone);n.box(.76,1.65,.12,frontU+s*1.82,1.44,.19,sandDark);n.box(.52,1.43,.06,frontU+s*1.82,1.44,.26,glass);n.box(.05,1.43,.08,frontU+s*1.82,1.44,.30,sandstone);}
  for(let i=0;i<=10;i++){const a=i*Math.PI/10;const gX=frontU+Math.cos(a)*.77,gY=1.86+Math.sin(a)*.77;n.sphere(.148,gX,gY,.22,sandstone,.95,.8,.55);}
  n.cornice(frontU,3.04,3.1,sandDark);n.box(2.51,.47,.48,frontU,3.37,.33,black);
  for(const k of [-1,0,1]){const x=frontU+k*.70;for(const [dx,dy] of [[0,.08],[0,-.08],[-.08,0],[.08,0]])n.sphere(.085,x+dx,3.38+dy,.59,white,1,1,.25);}
  n.box(2.52,1.95,.36,frontU,4.57,.24,black);n.sash(frontU,4.57,1.95,1.70,.42,cream);
  for(const s of [-1,1])n.box(.37,1.76,.12,frontU+s*1.24,4.58,.32,glass,s*Math.PI/4);
  n.cornice(frontU,5.62,2.75,black);
  for(const s of [-1,1]){const panel=new THREE.Mesh(new THREE.BoxGeometry(2.19,.13,.90),slate);geos.push(panel.geometry);panel.position.set(frontU+s*.69,6.51,.37);panel.rotation.z=-s*.86;n.root.add(panel);}
  // Steep decorative triangular gable outlined in black timber.
  const shape=new THREE.Shape();shape.moveTo(-1.38,0);shape.lineTo(1.38,0);shape.lineTo(0,1.65);shape.closePath();
  const g=new THREE.ShapeGeometry(shape);geos.push(g);const face=new THREE.Mesh(g,cream);face.position.set(frontU,5.7,.41);n.root.add(face);
  for(const s of [-1,1]){const bar=new THREE.Mesh(new THREE.BoxGeometry(.12,2.20,.15),black);geos.push(bar.geometry);bar.position.set(frontU+s*.69,6.51,.49);bar.rotation.z=-s*.69;n.root.add(bar);}
  for(const [dx,dy] of [[0,.30],[-.27,-.14],[.27,-.14]]){n.sphere(.34,frontU+dx,6.18+dy,.48,black,1.1,1,.12);n.sphere(.28,frontU+dx,6.18+dy,.53,cream,1.1,1,.12);}
  for(let x=frontU+4;x<n.e.length/2-1;x+=2.8){n.sash(x,1.55,.85,1.64);if(wallTop-n.base>4.9)n.sash(x,4.2,.93,1.65);if(wallTop-n.base>7)n.sash(x,6.65,.88,1.5);}
  n.flush();
 }else{
  // Corner block opposite the photographed shop: grey shopfront with timber fascia.
  for(const i of [12,11]){
   const f=frontage(i),L=f.e.length,w=Math.max(1,L-.22);
   f.box(w,2.77,.08,0,1.40,.06,sill);f.box(w,.50,.22,0,2.72,.15,timber);f.cornice(0,3.03,w,black);
   const count=Math.max(1,Math.floor(w/2.35));
   for(let k=0;k<count;k++){const x=(k-(count-1)/2)*w/count,ww=Math.min(1.65,w/count-.22);f.box(ww,1.79,.08,x,1.50,.14,black);f.box(ww-.14,1.63,.05,x,1.50,.20,glass);f.box(ww-.18,.50,.025,x,.86,.24,gifts[k%gifts.length]);f.pilaster(x-ww/2-.10,1.42,2.55,.11,sill);for(const y of [4.2,6.7])if(y+.9<wallTop-f.base)f.sash(x,y,Math.min(1.05,ww),1.65);}
   f.flush();
  }
 }
 return {group,dispose(){geos.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
