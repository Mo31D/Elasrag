import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {ATTENDANT_STATION,ATTENDANT_LINES,attendantInRange} from '../game/boatAttendant';

// Original procedural, articulated mesh. Front is local +Z. All dimensions in metres.
export class BoatAttendant{
 readonly root=new THREE.Group();
 private upper=new THREE.Group();private head=new THREE.Group();private right=new THREE.Group();private left=new THREE.Group();private elbow=new THREE.Group();
 private materials=new Set<THREE.Material>();private geometries=new Set<THREE.BufferGeometry>();private time=0;private greeting=0;private line=0;
 constructor(scene:THREE.Scene,private ground:(x:number,z:number)=>number,private clear:(x:number,z:number)=>boolean){
  this.root.name='Waterhead self-drive boat hire attendant';this.root.position.set(ATTENDANT_STATION.x,0,ATTENDANT_STATION.z);this.root.rotation.y=ATTENDANT_STATION.yaw;
  const mat=(color:number,roughness=.78)=>{const m=new THREE.MeshStandardMaterial({color,roughness});this.materials.add(m);return m};
  const skin=mat(0xb77d55),skinWarm=mat(0xad6c48),skinLight=mat(0xc38b63),navy=mat(0x17263f),navyLight=mat(0x263952),red=mat(0xcf2f24),redEdge=mat(0xa9211e),black=mat(0x25282a),boot=mat(0x4a4239),sole=mat(0x292827),hair=mat(0x4b4541),grey=mat(0x8a8179),white=mat(0xe7ded2),iris=mat(0x34251b),mouth=mat(0x643a32),gold=mat(0xd6b65f),blue=mat(0x285c91);
  const mesh=(g:THREE.Group,geo:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o;};
  const oval=(g:THREE.Group,m:THREE.Material,x:number,y:number,z:number,a:number,b:number,c:number)=>mesh(g,new THREE.SphereGeometry(1,20,14).scale(a,b,c),m,x,y,z);
  const box=(g:THREE.Group,m:THREE.Material,x:number,y:number,z:number,a:number,b:number,c:number)=>mesh(g,new THREE.BoxGeometry(a,b,c),m,x,y,z);
  const rod=(g:THREE.Group,m:THREE.Material,a:THREE.Vector3,b:THREE.Vector3,r:number)=>{const d=b.clone().sub(a);const o=mesh(g,new THREE.CylinderGeometry(r,r,d.length(),10),m);o.position.copy(a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return o;};
  const curve=(g:THREE.Group,m:THREE.Material,points:number[][],r:number)=>mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],p[1],p[2]))),16,r,6,false),m);
  const v=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
  // Stocky silhouette, broad chest, rounded abdomen, short-sleeved shirt and cargo shorts.
  for(const s of [-1,1]){
   oval(this.root,navy,s*.125,.64,0,.137,.23,.145);box(this.root,navyLight,s*.245,.66,.01,.072,.18,.15);
   box(this.root,navy,s*.254,.735,.01,.08,.035,.16);
   oval(this.root,skin,s*.123,.365,.006,.091,.20,.092);
   oval(this.root,navy,s*.123,.17,.005,.092,.10,.092);
   oval(this.root,boot,s*.123,.085,.065,.107,.09,.17);
   box(this.root,sole,s*.123,.025,.064,.217,.05,.305);
   for(let k=0;k<3;k++)box(this.root,grey,s*.123,.126-k*.008,.095+k*.021,.085,.008,.012);
  }
  oval(this.root,navy,0,.81,0,.252,.185,.19);
  this.upper.position.y=1.0;this.root.add(this.upper);
  oval(this.upper,navy,0,.13,0,.31,.365,.205);
  oval(this.upper,navy,0,-.045,.035,.274,.205,.212);
  oval(this.upper,navy,0,.33,0,.29,.15,.19);
  oval(this.upper,skin,0,.45,0,.091,.105,.092);
  // Two shaped red flotation chambers with dark piping, black webbing and buckle.
  for(const s of [-1,1]){
   const edge=oval(this.upper,black,s*.155,.17,.16,.114,.285,.116);edge.rotation.z=-s*.19;
   const panel=oval(this.upper,red,s*.155,.175,.188,.097,.271,.102);panel.rotation.z=-s*.19;
   const seam=oval(this.upper,redEdge,s*.156,.176,.278,.069,.21,.009);seam.rotation.z=-s*.19;
   oval(this.upper,red,s*.14,.365,.04,.115,.13,.16);
  }
  box(this.upper,black,0,-.023,.224,.48,.055,.066);box(this.upper,grey,0,-.023,.267,.092,.06,.035);box(this.upper,black,0,-.023,.29,.027,.04,.012);
  box(this.upper,gold,-.151,.265,.288,.081,.029,.006);box(this.upper,blue,-.151,.208,.29,.053,.056,.008);
  // Radio clipped to the waist, without copying logos or photographs.
  box(this.upper,black,.262,-.16,.109,.077,.13,.047);box(this.upper,gold,.262,-.115,.137,.04,.016,.008);rod(this.upper,black,v(.262,-.105,.11),v(.263,.017,.11),.007);
  for(const [arm,s] of [[this.right,-1],[this.left,1]] as const){
   arm.position.set(s*.278,.30,0);this.upper.add(arm);
   oval(arm,navy,0,-.08,0,.112,.137,.12);oval(arm,skin,0,-.22,0,.083,.125,.085);
   const fore=s===-1?this.elbow:new THREE.Group();fore.position.y=-.30;arm.add(fore);
   oval(fore,skin,0,-.095,.013,.073,.135,.073);oval(fore,skinLight,0,-.218,.024,.065,.076,.042);oval(fore,skin,-s*.049,-.19,.038,.025,.044,.027);
   for(let i=0;i<4;i++)oval(fore,skinLight,(i-1.5)*.022,-.263,.025,.014,.032,.021);
   if(s===1)fore.rotation.x=-.13;
  }
  this.left.rotation.z=.13;this.right.rotation.z=-.12;
  // Face sculpture: asymmetric natural features, rounded cheeks, broad nose and smile.
  this.head.position.y=.59;this.upper.add(this.head);
  const headGeo=new THREE.SphereGeometry(1,36,28).scale(.145,.184,.129);
  const pos=headGeo.getAttribute('position'),cols:number[]=[];const tone=new THREE.Color(0xb77d55),beard=new THREE.Color(0x68605a);
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);let t=0;
   if(z>-.012&&y<-.046){t=THREE.MathUtils.smoothstep(-y,.046,.122)*THREE.MathUtils.smoothstep(z,-.012,.10)*.62;}
   if(Math.abs(x)>.103&&y<.032&&y>-.09&&z>.015)t=Math.max(t,.24);
   const color=tone.clone().lerp(beard,t);cols.push(color.r,color.g,color.b);}
  headGeo.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
  const face=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.84});this.materials.add(face);mesh(this.head,headGeo,face);
  for(const s of [-1,1]){
   oval(this.head,skin,s*.142,-.005,.002,.032,.055,.028);oval(this.head,skinWarm,s*.154,-.008,.018,.015,.034,.013);
   oval(this.head,skin,s*.077,-.035,.097,.067,.064,.048);
   oval(this.head,skinWarm,s*.059,.035,.113,.047,.025,.018);
   oval(this.head,white,s*.059,.038,.126,.034,.013,.013);
   oval(this.head,iris,s*.058,.037,.138,.014,.014,.006);oval(this.head,black,s*.058,.037,.143,.007,.008,.004);oval(this.head,white,s*.053,.042,.146,.003,.003,.002);
   curve(this.head,hair,[[s*.024,.056,.132],[s*.059,.064,.134],[s*.092,.056,.118]],.007);
   curve(this.head,hair,[[s*.023,.079,.119],[s*.063,.087,.115],[s*.101,.073,.095]],.008);
   curve(this.head,skinWarm,[[s*.081,.014,.129],[s*.108,-.005,.115]],.003);
   curve(this.head,skinWarm,[[s*.054,-.038,.139],[s*.085,-.060,.132],[s*.087,-.082,.112]],.004);
   oval(this.head,skin,s*.025,-.011,.135,.027,.021,.028);
   oval(this.head,mouth,s*.025,-.022,.154,.012,.006,.006);
  }
  oval(this.head,skinLight,0,.012,.135,.026,.041,.038);oval(this.head,skin,0,-.008,.157,.035,.022,.023);
  // Smile is a recessed curved mouth with a restrained visible upper tooth band.
  curve(this.head,mouth,[[-.069,-.051,.127],[-.039,-.071,.143],[0,-.076,.149],[.04,-.068,.142],[.071,-.047,.126]],.011);
  curve(this.head,white,[[-.045,-.058,.145],[0,-.066,.158],[.045,-.056,.144]],.006);
  curve(this.head,hair,[[-.045,-.04,.137],[-.022,-.033,.15],[0,-.04,.15],[.022,-.033,.15],[.045,-.04,.137]],.007);
  // Fine salt-and-pepper stubble in a deterministic pattern on the visible jaw.
  for(let k=0;k<90;k++){const a=k*2.39996323,y=-.05-(k%17)*.0065,x=.126*Math.sin(a)*Math.sqrt(Math.max(.12,1-(y/.184)**2));const z=.129*Math.sqrt(Math.max(.03,1-(x/.145)**2-(y/.184)**2));if(Math.abs(x)<.071&&y>-.085)continue;oval(this.head,k%4===0?grey:hair,x,y,z+.002,.0025,.0038,.0018);}
  // Navy baseball cap, curved peak and crown seam.
  oval(this.head,navy,0,.132,-.012,.157,.096,.146);oval(this.head,navy,0,.099,.106,.146,.018,.121);
  curve(this.head,navyLight,[[-.13,.107,.15],[0,.092,.219],[.13,.107,.15]],.004);
  curve(this.head,navyLight,[[0,.222,-.036],[0,.208,.061],[0,.158,.122]],.003);oval(this.head,navyLight,0,.228,-.015,.015,.007,.015);
  // Batch static geometry by material inside each articulated joint, keeping the face
  // vertex-colour buffer separate. This is not a billboard or a camera-facing sprite.
  const batch=(g:THREE.Group)=>{for(const child of [...g.children])if(child instanceof THREE.Group)batch(child);
   const groups=new Map<THREE.Material,THREE.Mesh[]>();for(const o of [...g.children])if(o instanceof THREE.Mesh){const m=o.material as THREE.Material;const list=groups.get(m)??[];list.push(o);groups.set(m,list);}
   for(const [m,parts] of groups){if(parts.length===1){this.geometries.add(parts[0].geometry);continue;}const transformed=parts.map(o=>{o.updateMatrix();return o.geometry.clone().applyMatrix4(o.matrix);});const combined=mergeGeometries(transformed,false);transformed.forEach(a=>a.dispose());if(combined){for(const o of parts){o.geometry.dispose();o.removeFromParent();}const o=new THREE.Mesh(combined,m);g.add(o);this.geometries.add(combined);}else for(const o of parts)this.geometries.add(o.geometry);}
  };batch(this.root);
  this.root.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});this.root.visible=false;scene.add(this.root);
 }
 update(dt:number,x:number,z:number,y:number){const s=ATTENDANT_STATION;this.root.visible=Math.hypot(x-s.x,z-s.z)<90&&this.clear(s.x,s.z);if(!this.root.visible)return;
  this.time+=dt;this.greeting=Math.max(0,this.greeting-dt);this.root.position.y=Math.max(.45,this.ground(s.x,s.z));
  const near=this.canTalk(x,z,y),yaw=near?Math.atan2(x-s.x,z-s.z):s.yaw;
  this.root.rotation.y+=Math.atan2(Math.sin(yaw-this.root.rotation.y),Math.cos(yaw-this.root.rotation.y))*Math.min(1,dt*4);
  const active=near&&(this.greeting>0||Math.sin(this.time*.65)>.72),mix=Math.min(1,dt*6);
  this.right.rotation.z=THREE.MathUtils.lerp(this.right.rotation.z,active?-.73:-.12,mix);
  this.right.rotation.x=THREE.MathUtils.lerp(this.right.rotation.x,active?-.32:0,mix);
  this.elbow.rotation.x=THREE.MathUtils.lerp(this.elbow.rotation.x,active?-1.0+Math.sin(this.time*3.6)*.12:-.14,mix);
  this.head.rotation.x=Math.sin(this.time*(active?3:1.1))*(active?.045:.012);
  this.head.rotation.y=near?0:Math.sin(this.time*.45)*.08;this.upper.position.y=1+Math.sin(this.time*1.8)*.005;
 }
 canTalk(x:number,z:number,y:number){return this.root.visible&&attendantInRange(x,z,y,this.root.position.y);}
 talk(){this.greeting=6;return ATTENDANT_LINES[this.line++%ATTENDANT_LINES.length];}
 distance(x:number,z:number){return this.root.visible?Math.hypot(x-ATTENDANT_STATION.x,z-ATTENDANT_STATION.z):Infinity;}
 hide(){this.root.visible=false;}
 dispose(){this.root.removeFromParent();this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());}
}
