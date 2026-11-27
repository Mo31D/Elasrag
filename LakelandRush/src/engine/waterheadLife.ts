import {fleeDirection,rememberedAlarm,type Threat} from '../game/crowdMotion';
import * as THREE from 'three';
import {batchAnimalDetail} from './animalDetail';
import type {BirdFlightPose,BirdAttitude} from './animalPlayer';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {cruisePose,CRUISE_SPEED,CRUISE_LENGTH,cruiseHullWet,shorePoint} from '../game/waterheadLife';
type Wet=(x:number,z:number)=>boolean;
type Clear=(x:number,z:number)=>boolean;
const material=(color:number,roughness=.7)=>new THREE.MeshStandardMaterial({color,roughness});
function makeCruiser(){
 const root=new THREE.Group();root.name='Waterhead heritage passenger steamer';
 const white=material(0xeeeae0,.46),black=material(0x20252b),red=material(0x763e31),wood=material(0x967053),glass=material(0x344d59,.28),metal=material(0xd3d5cc),orange=material(0xd66a32);
 const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();
 function add(g:THREE.BufferGeometry,m:THREE.Material){const list=batches.get(m)??[];list.push(g);batches.set(m,list);}
 function box(w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material){add(new THREE.BoxGeometry(w,h,d).translate(x,y,z),m);}
 function rod(a:THREE.Vector3,b:THREE.Vector3,r:number,m:THREE.Material){const v=b.clone().sub(a),g=new THREE.CylinderGeometry(r,r,v.length(),6);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);add(g,m);}
 const outline=[[-.18,-22.5],[.18,-22.5],[2.3,-19],[3.55,-13],[3.8,-5],[3.8,11],[3.3,17],[2.1,20.6],[0,21.3],[-2.1,20.6],[-3.3,17],[-3.8,11],[-3.8,-5],[-3.55,-13],[-2.3,-19]];
 function band(y0:number,y1:number,scale0:number,scale1:number,m:THREE.Material){
  const points:number[]=[];for(let i=0;i<outline.length;i++){const [x,z]=outline[i],[u,v]=outline[(i+1)%outline.length];
   const a=[x*scale0,y0,z],b=[u*scale0,y0,v],c=[x*scale1,y1,z],d=[u*scale1,y1,v];points.push(...a,...b,...c,...b,...d,...c);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.computeVertexNormals();m.side=THREE.DoubleSide;add(g,m);
 }
 function deck(y:number,scale:number,m:THREE.Material){const shape=new THREE.Shape(outline.map(([x,z])=>new THREE.Vector2(x*scale,-z)));const g=new THREE.ShapeGeometry(shape);g.rotateX(-Math.PI/2);g.translate(0,y,0);add(g,m);}
 band(-.85,.15,.65,.96,black);band(.15,2.1,.96,1,white);band(1.8,2.1,1,1,red);deck(2.1,1,wood);
 // Two passenger decks, longitudinal glazing, open promenade and bridge.
 box(5.7,2.35,32,0,3.275,0,white);box(6.9,.22,35,0,4.57,0,white);
 box(5.2,2.05,25,0,5.72,-.3,white);box(6.6,.24,29,0,6.87,-.3,wood);
 for(const side of [-1,1]){
  for(let i=0;i<16;i++){const z=-14.5+i*1.9;box(.075,1.15,1.37,side*2.89,3.42,z,glass);box(.09,.075,1.4,side*2.94,3.45,z,metal);}
  for(let i=0;i<12;i++)box(.075,1.0,1.38,side*2.64,5.83,-11.1+i*1.9,glass);
  for(let z=-15;z<=15;z+=2.3){box(.085,.9,.085,side*3.31,5.05,z,metal);box(.085,.85,.085,side*3.17,7.37,z,metal);}
  for(const y of [4.83,5.45])box(.075,.075,30.5,side*3.31,y,0,metal);
  for(const y of [7.09,7.75])box(.075,.075,29.8,side*3.17,y,0,metal);
  for(const z of [-10,0,10]){const g=new THREE.TorusGeometry(.36,.095,6,16);g.rotateY(Math.PI/2);g.translate(side*3.36,5.17,z);add(g,orange);}
  for(const z of [-18,-16,16,18])box(.09,.8,.09,side*2.35,2.5,z,metal);
  rod(new THREE.Vector3(side*.18,2.94,-21),new THREE.Vector3(side*2.35,2.94,-16),.045,metal);
  rod(new THREE.Vector3(side*2.35,2.94,16),new THREE.Vector3(side*.3,2.94,20),.045,metal);
 }
 box(4.1,1.65,4,0,7.8,-8,red);box(4.7,.18,4.6,0,8.72,-8,white);
 for(let x=-1.45;x<=1.5;x+=.97)box(.78,.78,.07,x,8.03,-10.03,glass);
 for(const side of [-1,1])for(const z of [-9,-7])box(.07,.8,1.25,side*2.07,8.02,z,glass);
 for(const z of [-1,4.4]){add(new THREE.CylinderGeometry(.55,.68,2.3,16).translate(0,8.13,z),white);add(new THREE.CylinderGeometry(.61,.61,.43,16).translate(0,9.48,z),black);}
 rod(new THREE.Vector3(0,2.1,-18),new THREE.Vector3(0,9.8,-18),.075,wood);rod(new THREE.Vector3(-1.25,7.9,-18),new THREE.Vector3(1.25,7.9,-18),.05,wood);
 for(const side of [-1,1])for(const z of [12,14,16])box(1.6,.17,.37,side*1.8,7.14,z,wood);
 // Merge all static detail into a handful of material batches for mobile.
 for(const [m,gs] of batches){const non=gs.map(g=>g.index?g.toNonIndexed():g);for(const g of non){for(const key of Object.keys(g.attributes))if(key!=='position'&&key!=='normal')g.deleteAttribute(key);}
  const merged=mergeGeometries(non);for(const g of new Set([...gs,...non]))g.dispose();if(merged){const mesh=new THREE.Mesh(merged,m);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);}}
 const wakeMat=new THREE.MeshBasicMaterial({color:0xd3eef0,transparent:true,opacity:.23,depthWrite:false,side:THREE.DoubleSide});
 // Tapered V-shaped wake behind stern, fading towards the tail.
 const vertices:number[]=[],colors:number[]=[];
 for(const side of [-1,1])for(let i=0;i<9;i++){const z=21+i*3.3,z2=z+3.3,x=side*(1.1+i*.92),x2=side*(1.1+(i+1)*.92),w=.45+i*.07;
 for(const [xx,zz,fade] of [[x-w,z,1-i/10],[x+w,z,1-i/10],[x2-w,z2,1-(i+1)/10],[x+w,z,1-i/10],[x2+w,z2,1-(i+1)/10],[x2-w,z2,1-(i+1)/10]]){vertices.push(xx,.045,zz);colors.push(fade,fade,fade);}}
 const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));wg.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));wakeMat.vertexColors=true;
 const wake=new THREE.Mesh(wg,wakeMat);return {root,wake,wakeMat};
}
type Bird={kind:'mallard'|'swan';root:THREE.Group;body:THREE.Group;neck:THREE.Group;feet:THREE.Group[];wings:THREE.Group[];flightWings:THREE.Group[];wingTips:THREE.Group[];x:number;z:number;homeX:number;homeZ:number;angle:number;phase:number;swimming:boolean;scale:number;speed:number;alarm:number;alarmYaw:number};
function birdModel(swan:boolean,variant:number){
 const root=new THREE.Group(),body=new THREE.Group(),neck=new THREE.Group();root.add(body);body.add(neck);
 const plumage=material(swan?0xf3f1e8:variant%2?0x82705c:0x9a9c98),wingMat=material(swan?0xe0e2dc:0x635846),headMat=material(swan?0xf4f1e8:variant%2?0x8c7456:0x246252),beak=material(swan?0xe9932a:0xc3a33b),dark=material(0x25252a),feetMat=material(swan?0x363433:0xb36a32);
 function oval(g:THREE.Group,m:THREE.Material,x:number,y:number,z:number,a:number,b:number,c:number){const o=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),m);o.scale.set(a,b,c);o.position.set(x,y,z);g.add(o);return o;}
 oval(body,plumage,0,.22,.05,.29,.24,.56);const chest=material(swan?0xf6f4eb:variant%2?0x957e62:0x593c35),featherEdge=material(swan?0xf0eee5:0x796c5d),speculum=material(0x324e93,.42);oval(body,chest,0,.23,-.30,.245,.218,.28);const tail=oval(body,plumage,0,.26,.47,.18,.12,.23);tail.rotation.x=-.38;
 const wings:THREE.Group[]=[];for(const side of [-1,1]){const w=new THREE.Group();w.position.set(side*.16,.25,.02);body.add(w);const m=oval(w,wingMat,side*.055,0,.07,.17,.13,.40);m.rotation.y=side*.16;for(let k=0;k<5;k++){const feather=oval(w,featherEdge,side*(.09+k*.012),.035,.11+k*.048,.092,.055,.16);feather.rotation.y=side*.17;}if(!swan){oval(w,featherEdge,side*.16,.015,.15,.045,.048,.13);oval(w,speculum,side*.17,.02,.15,.039,.039,.097);}wings.push(w);}
 const flightWings:THREE.Group[]=[],wingTips:THREE.Group[]=[];
 for(const side of [-1,1]){
  const w=new THREE.Group();w.position.set(side*.17,.26,0);body.add(w);
  const span=swan?1.05:.72;
  oval(w,plumage,side*span*.29,0,.018,span*.33,.064,.245);
  for(let k=0;k<5;k++){const f=oval(w,wingMat,side*span*(.10+k*.095),-.008,.12+k*.018,span*.12,.029,.16);f.rotation.y=-side*.24;}
  // Wrist joint bends the outer primaries during the recovery stroke.
  const tip=new THREE.Group();tip.position.set(side*span*.52,0,.035);w.add(tip);
  oval(tip,plumage,side*span*.17,0,0,span*.24,.042,.16);
  for(let k=0;k<8;k++){
   const f=oval(tip,wingMat,side*span*(.075+k*.044),-.009,.09+k*.018,span*(.14+k*.008),.022,.105+k*.007);
   f.rotation.y=-side*(.25+k*.055);
  }
  w.visible=false;flightWings.push(w);wingTips.push(tip);
 }
 const neckHeight=swan?.77:.23;neck.position.set(0,.29,-.30);
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(0,neckHeight*.28,-.15),new THREE.Vector3(0,neckHeight*.72,-.13),new THREE.Vector3(0,neckHeight,-.06)]);
 neck.add(new THREE.Mesh(new THREE.TubeGeometry(curve,12,swan?.075:.085,8,false),headMat));
 oval(neck,headMat,0,neckHeight,-.12,.11,.105,.15);oval(neck,beak,0,neckHeight-.03,-.26,.064,.046,.12);oval(neck,dark,0,neckHeight-.058,-.27,.061,.006,.094);for(const side of [-1,1])oval(neck,dark,side*.026,neckHeight+.003,-.254,.009,.005,.012);if(!swan&&variant%2===0)oval(neck,material(0xe8e5d9),0,neckHeight*.36,-.12,.088,.028,.088);
 if(swan)oval(neck,dark,0,neckHeight-.005,-.215,.085,.055,.04);
 for(const side of [-1,1]){oval(neck,dark,side*.09,neckHeight+.025,-.16,.018,.018,.018);oval(neck,material(0xece5d9),side*.102,neckHeight+.030,-.167,.006,.006,.005);}
 const feet:THREE.Group[]=[];for(const side of [-1,1]){const f=new THREE.Group();f.position.set(side*.12,.11,.04);body.add(f);oval(f,feetMat,0,-.11,0,.035,.13,.035);oval(f,feetMat,0,-.22,-.05,.083,.025,.12);for(let toe=-1;toe<=1;toe++){const t=oval(f,feetMat,toe*.043,-.223,-.145,.031,.017,.065);t.rotation.y=toe*.22;}feet.push(f);}
 batchAnimalDetail(root);return {root,body,neck,feet,wings,flightWings,wingTips};
}
export class WaterheadLife{
 private cruiser=makeCruiser();private birds:Bird[]=[];private travelled=0;private t=0;private rippleClock=0;private routeValid=false;
 constructor(private scene:THREE.Scene,private wet:Wet,private clearWater:Clear,private clearLand:Clear,private ground:(x:number,z:number)=>number,private ripple:(x:number,z:number,r:number)=>void){
  // Validate centreline and full hull margin against source shoreline before showing.
  this.routeValid=true;for(let i=0;i<720;i++)if(!cruiseHullWet(cruisePose(CRUISE_LENGTH*i/720),wet)){this.routeValid=false;break;}
  scene.add(this.cruiser.root,this.cruiser.wake);this.cruiser.root.visible=this.cruiser.wake.visible=this.routeValid;
  for(let i=0;i<20;i++){
   const swan=i<8,swimming=i%5!==4,z=-350+i*5.4,x=shorePoint(z,wet);if(x===null)continue;
   let px=x+(swimming?-(3+i%4):2+i%3),pz=z,found=false;
   for(let j=0;j<16;j++){const a=px+(j%2?1:-1)*Math.floor(j/2)*.55;if(swimming?clearWater(a,pz):clearLand(a,pz)){px=a;found=true;break;}}
   if(!found)continue;
   const m=birdModel(swan,i),scale=swan?.92: .53+(i%3)*.04;m.root.scale.setScalar(scale);scene.add(m.root);
   this.birds.push({...m,kind:swan?'swan':'mallard',x:px,z:pz,homeX:px,homeZ:pz,angle:i*2.399,phase:i*.83,swimming,scale,speed:swimming?.42:.28,alarm:0,alarmYaw:i*2.399});
  }
  this.update(0,0,-280);
 }
 contains(x:number,z:number):boolean{
  if(!this.routeValid)return false;const p=this.cruiser.root,dx=x-p.position.x,dz=z-p.position.z,a=p.rotation.y;
  return Math.abs(dx*Math.cos(a)-dz*Math.sin(a))<4.5&&Math.abs(dx*Math.sin(a)+dz*Math.cos(a))<23;
 }
 update(dt:number,playerX:number,playerZ:number,threats:readonly Threat[]=[]){
  this.t+=dt;this.travelled+=dt*CRUISE_SPEED;
  if(this.routeValid){const p=cruisePose(this.travelled+CRUISE_LENGTH*.48),g=this.cruiser.root;g.position.set(p.x,Math.sin(this.t*.85)*.055,p.z);g.rotation.set(Math.sin(this.t*.74)*.003,p.yaw,Math.sin(this.t*.93)*.007);
   this.cruiser.wake.position.set(p.x,0,p.z);this.cruiser.wake.rotation.y=p.yaw;this.cruiser.wakeMat.opacity=.22+Math.sin(this.t*1.4)*.035;
   const near=Math.hypot(playerX-p.x,playerZ-p.z)<750;g.visible=this.cruiser.wake.visible=near;}
  this.rippleClock+=dt;const emit=this.rippleClock>.48;if(emit)this.rippleClock=0;
  for(let i=0;i<this.birds.length;i++){
   const b=this.birds[i];if(b.root.userData.animalControlled)continue;const near=Math.hypot(playerX-b.x,playerZ-b.z)<170;b.root.visible=near;if(!near)continue;
   const observed=fleeDirection(b.x,b.z,threats);b.alarm=rememberedAlarm(b.alarm,observed?.alarm??0,dt);if(observed)b.alarmYaw=observed.yaw;const alarm=b.alarm>.08?{yaw:b.alarmYaw,alarm:b.alarm}:null;const d=Math.hypot(b.x-b.homeX,b.z-b.homeZ);const neighbours=this.birds.filter(o=>o!==b&&o.swimming===b.swimming&&Math.hypot(o.x-b.x,o.z-b.z)<1.1&&!o.root.userData.animalControlled);const separation=fleeDirection(b.x,b.z,neighbours.map(o=>({x:o.x,z:o.z,radius:1.1})));const target=alarm?alarm.yaw:separation?separation.yaw:d>7?Math.atan2(b.x-b.homeX,b.z-b.homeZ):b.angle+Math.sin(this.t*.28+b.phase)*dt*.38;
   let diff=Math.atan2(Math.sin(target-b.angle),Math.cos(target-b.angle));b.angle+=THREE.MathUtils.clamp(diff,-(alarm?4.2:1.4)*dt,(alarm?4.2:1.4)*dt);
   const resting=!alarm&&!separation&&Math.sin(this.t*.19+b.phase)<-.55,feeding=!alarm&&!separation&&!resting&&Math.sin(this.t*.41+b.phase)<-.45;const moving=!!alarm||!!separation||(!resting&&!feeding&&Math.sin(this.t*.62+b.phase)>-.45),step=moving?(alarm?b.speed+alarm.alarm*1.9:b.speed)*dt:0,x=b.x-Math.sin(b.angle)*step,z=b.z-Math.cos(b.angle)*step;
   if((b.swimming?this.clearWater(x,z):this.clearLand(x,z))){b.x=x;b.z=z;}else if(!b.swimming&&alarm&&this.clearWater(x,z)){b.swimming=true;b.x=x;b.z=z;b.homeX=x;b.homeZ=z;}else b.angle+=dt*2.8;
   b.root.position.set(b.x,b.swimming?-.10*b.scale+Math.sin(this.t*2+b.phase)*.015:Math.max(.45,this.ground(b.x,b.z)),b.z);b.root.rotation.y=b.angle;
   b.body.rotation.z=Math.sin(this.t*2+b.phase)*(b.swimming?.035:.055);b.neck.rotation.x=feeding?-.8+Math.sin(this.t*3+b.phase)*.13:resting?.30:Math.sin(this.t*1.1+b.phase)*.09;b.body.rotation.x=feeding&&b.swimming?.16:0;
   for(let j=0;j<2;j++){b.wings[j].visible=true;b.flightWings[j].visible=false;b.feet[j].visible=!b.swimming;b.feet[j].rotation.x=moving?Math.sin(this.t*8+b.phase+j*Math.PI)*.55:0;b.wings[j].rotation.z=Math.sin(this.t*(alarm?9:1.5)+b.phase)*(alarm?.20:.035);}
   if(emit&&moving&&b.swimming&&i%3===Math.floor(this.t)%3)this.ripple(b.x,b.z,b.scale*.55);
  }
 }
 selectableAnimals(){return this.birds.map(b=>({root:b.root,kind:b.kind,pose:(t:number,s:number,wet:boolean,air:boolean,feed:boolean,flight?:BirdFlightPose,attitude?:BirdAttitude)=>{
  const swan=b.kind==='swan',launch=flight==='takeoff',glide=flight==='glide',landing=flight==='landing';
  const hz=swan?3.2:5.4,cycle=t*Math.PI*2*hz;
  const beat=Math.cos(cycle),stroke=beat>=0?beat:beat*.68;
  const amplitude=launch?1.08:landing?.55:.77;
  const wingAngle=glide?.14:amplitude*stroke+.13;
  const dt=attitude?.dt??0,blend=dt>0?1-Math.exp(-dt*18):1;
  const smooth=(current:number,target:number)=>THREE.MathUtils.lerp(current,target,blend);
  const wingBlend=dt>0?1-Math.exp(-dt*55):1;
  const wingSmooth=(current:number,target:number)=>THREE.MathUtils.lerp(current,target,wingBlend);
  const bank=attitude?.bank??0,pitch=attitude?.pitch??0;
  b.body.rotation.z=smooth(b.body.rotation.z,air?bank+(glide?Math.sin(t*1.8)*.025:Math.sin(cycle)*.035):Math.sin(t*2)*.025);
  // Local forward is -Z; positive X rotation raises the chest/beak.
  b.body.rotation.x=smooth(b.body.rotation.x,feed&&wet?.24:air?pitch+(launch?Math.sin(cycle)*.035:0):0);
  b.neck.rotation.x=smooth(b.neck.rotation.x,feed?-.85:air?(swan?-1.15:-.70)+(landing?.25:0)-pitch*.35:0);
  for(let j=0;j<2;j++){
   const side=j===0?-1:1,w=b.flightWings[j],tip=b.wingTips[j];
   b.feet[j].visible=(!wet&&!air)||(launch&&t<.30)||landing;
   b.feet[j].rotation.x=smooth(b.feet[j].rotation.x,air?(launch?-.65*Math.min(1,t/.26):landing?.35:-.9):s>.05?Math.sin(t*9+j*Math.PI)*.55:0);
   b.wings[j].visible=!air;w.visible=air;
   w.rotation.set(wingSmooth(w.rotation.x,air?(glide?.04:Math.sin(cycle-.65)*.18):0),wingSmooth(w.rotation.y,air?side*(glide?.10:.08+Math.sin(cycle-.45)*.14):0),wingSmooth(w.rotation.z,air?side*wingAngle:0));
   tip.rotation.z=wingSmooth(tip.rotation.z,air?side*(glide?-.04:Math.sin(cycle-.9)*.31):0);
   tip.rotation.y=wingSmooth(tip.rotation.y,air?side*(glide?.04:Math.max(0,-beat)*.24):0);
   b.wings[j].rotation.z=0;
  }
 }}));}
 dispose(){
  const mats=new Set<THREE.Material>(),geos=new Set<THREE.BufferGeometry>();
  for(const root of [this.cruiser.root,this.cruiser.wake,...this.birds.map(b=>b.root)]){root.removeFromParent();root.traverse(o=>{if(o instanceof THREE.Mesh){geos.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])mats.add(m);}});}
  geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());
 }
}
