import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {busRoute,busPose,stepBus,busFits,type BusState} from '../game/busMotion';
import navigation from '../data/ambleside-navigation.json';
import realm from '../data/waterhead-public-realm.json';
type P={x:number;z:number};
type Clear=(x:number,z:number)=>boolean;
export function makeBus(){
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const mats:THREE.Material[]=[],geos:THREE.BufferGeometry[]=[],texs:THREE.Texture[]=[];
 const m=(color:number,roughness=.65)=>{const mat=new THREE.MeshStandardMaterial({color,roughness});mats.push(mat);return mat;};
 const lime=m(0x90ce18,.36),green=m(0x176044,.4),black=m(0x18272a),grey=m(0xb9c5c4,.35),rubber=m(0x202324),seat=m(0x316d50),glass=m(0x284e5d,.22),floor=m(0x555854),light=m(0xf3f2d9),red=m(0xb63b2f);glass.transparent=true;glass.opacity=.52;glass.depthWrite=false;
 const buckets=new Map<THREE.Material,THREE.BufferGeometry[]>();
 const add=(g:THREE.BufferGeometry,mat:THREE.Material)=>{const a=buckets.get(mat)??[];a.push(g);buckets.set(mat,a)};
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,rx=0)=>{const g=new THREE.BoxGeometry(w,h,d);g.rotateX(rx);g.translate(x,y,z);add(g,mat)};
 box(2.48,.74,10.2,0,.84,0,lime);box(2.3,.08,9.8,0,1.22,0,floor);box(2.48,.18,10.2,0,2.52,0,green);box(2.40,.19,10.02,0,2.72,0,floor);box(2.45,.10,10,0,1.23,0,green);
 box(2.39,.55,10,0,3.06,0,lime);box(2.45,.14,3.45,0,4.12,-3.25,lime);
 for(const side of [-1,1]){
  for(let i=0;i<7;i++){const z=-3.95+i*1.29;box(.055,1.11,1.19,side*1.22,1.91,z,glass);box(.09,1.27,.08,side*1.23,1.93,z+.63,black);}
  for(const z of [-4.83,-3.57,-2.28,-1.48])box(.07,.95,.09,side*1.2,3.61,z,black);
  box(.055,.90,3.24,side*1.19,3.59,-3.23,glass);
  for(let i=0;i<7;i++){const z=-1.35+i*.98;box(.05,.59,.05,side*1.18,3.60,z,grey);}
  box(.065,.065,6.3,side*1.18,3.88,1.76,grey);box(.07,.07,6.3,side*1.18,3.50,1.76,grey);
  box(.14,.24,.22,side*1.40,2.02,-4.83,lime);
  for(let i=0;i<8;i++){const z=-3.55+i*.96;box(.87,.09,.44,side*.67,2.99,z,seat);box(.87,.52,.09,side*.67,3.23,z+.20,seat);}
  // Original vector livery based on the supplied reference colours, not a photo decal.
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d')!;
  ctx.fillStyle='#8ed015';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#0d4b3e';ctx.beginPath();ctx.moveTo(0,160);ctx.quadraticCurveTo(460,390,800,30);ctx.lineTo(1024,0);ctx.lineTo(1024,110);ctx.quadraticCurveTo(600,320,0,235);ctx.fill();
  ctx.fillStyle='#40bde1';ctx.fillRect(150,0,620,100);ctx.fillStyle='#e0f3cc';ctx.beginPath();ctx.moveTo(150,90);ctx.lineTo(320,42);ctx.lineTo(400,65);ctx.lineTo(510,12);ctx.lineTo(630,64);ctx.lineTo(770,22);ctx.lineTo(770,100);ctx.lineTo(150,100);ctx.fill();
  ctx.font='bold 57px Arial';ctx.fillStyle='#fff9d8';ctx.textAlign='center';ctx.fillText('LAKEsider',535,198);ctx.font='22px Arial';ctx.fillText('Grasmere  •  Ambleside  •  Windermere  •  Bowness',512,238);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;texs.push(t);
  const mat=new THREE.MeshBasicMaterial({map:t});mats.push(mat);const g=new THREE.PlaneGeometry(9.8,.57);geos.push(g);const decal=new THREE.Mesh(g,mat);decal.rotation.y=side*Math.PI/2;decal.position.set(side*1.249,3.055,0);body.add(decal);
 }
 box(2.30,1.20,.07,0,1.88,-5.105,glass,-.10);box(2.29,.84,.07,0,3.61,-5.09,glass,-.12);box(2.35,.32,.08,0,2.59,-5.14,black);
 box(2.35,1.2,.08,0,1.86,5.06,green);box(2.30,.6,.08,0,3.32,5.06,green);
 for(const side of [-1,1]){box(.24,.20,.10,side*.98,.94,-5.14,light);box(.19,.22,.1,side*.98,.92,5.13,red);}
 box(.08,1.15,1.01,-1.25,1.89,-3.96,black);box(.09,.99,.42,-1.30,1.93,-4.18,glass);box(.09,.99,.42,-1.30,1.93,-3.72,glass);
 const sign=document.createElement('canvas');sign.width=512;sign.height=96;const sc=sign.getContext('2d')!;sc.fillStyle='#0d171c';sc.fillRect(0,0,512,96);sc.fillStyle='#ffdc76';sc.font='bold 40px monospace';sc.fillText('599  LAKESIDER',15,46);sc.font='24px monospace';sc.fillText('OPEN TOP BUS RIDE',15,78);
 const st=new THREE.CanvasTexture(sign);st.colorSpace=THREE.SRGBColorSpace;texs.push(st);const sm=new THREE.MeshBasicMaterial({map:st});mats.push(sm);const sg=new THREE.PlaneGeometry(2.12,.40);geos.push(sg);const screen=new THREE.Mesh(sg,sm);screen.rotation.y=Math.PI;screen.position.set(0,2.60,-5.19);body.add(screen);
 for(const [mat,gs] of buckets){const non=gs.map(g=>g.index?g.toNonIndexed():g);const merged=mergeGeometries(non);for(const g of new Set([...gs,...non]))g.dispose();if(merged){geos.push(merged);const mesh=new THREE.Mesh(merged,mat);mesh.castShadow=true;mesh.receiveShadow=true;body.add(mesh);}}
 const wheels:THREE.Group[]=[];for(const side of [-1,1])for(const z of [-3.25,3.08]){const w=new THREE.Group();w.position.set(side*1.13,.51,z);root.add(w);for(const [r,d,mat] of [[.51,.34,rubber],[.30,.36,grey]] as const){const g=new THREE.CylinderGeometry(r,r,d,20);g.rotateZ(Math.PI/2);geos.push(g);w.add(new THREE.Mesh(g,mat));}wheels.push(w);}
 const person=new THREE.Group();const torso=new THREE.Mesh(new THREE.BoxGeometry(.44,.50,.27),green);torso.position.y=.53;person.add(torso);const head=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8),m(0xb98c66));head.position.y=.93;person.add(head);const legs=new THREE.Mesh(new THREE.BoxGeometry(.38,.20,.46),black);legs.position.set(0,.15,-.16);person.add(legs);person.position.set(.65,.63,-4.0);body.add(person);for(const o of [torso,head,legs])geos.push(o.geometry);
 return {root,body,wheels,driver:person,dispose(){root.removeFromParent();geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());texs.forEach(t=>t.dispose());}};
}
type Bus={model:ReturnType<typeof makeBus>;route:ReturnType<typeof busRoute>;state:BusState;stops:number[];wait:number;lastStop:number;};
export class LakesiderService{
 private buses:Bus[]=[];private active:Bus|null=null;mode:'passenger'|'driver'|null=null;
 private formerDriver:THREE.Group|null=null;
 constructor(private scene:THREE.Scene,private ground:(x:number,z:number)=>number,private clear:Clear,private exitClear:Clear){
  for(const [id,start,stops] of [['west',54,[54,124,265]],['east',30,[30,330,1090]]] as const){
   const data=navigation.approaches.find(a=>a.id===id)!;const route=busRoute(data.points);const model=makeBus();const state:BusState={distance:start,lane:1.85,speed:0,dir:1};
   scene.add(model.root);this.buses.push({model,route,state,stops:[...stops],wait:8,lastStop:start});this.place(this.buses[this.buses.length-1],0);
  }
 }
 private place(b:Bus,dt:number){const p=busPose(b.route,b.state);b.model.root.position.set(p.x,Math.max(.45,this.ground(p.x,p.z)),p.z);b.model.root.rotation.y=p.yaw;for(const w of b.model.wheels)w.rotation.x-=b.state.speed*dt/.51;}
 nearby(x:number,z:number,y:number){return this.buses.find(b=>b.model.root.visible&&Math.abs(b.state.speed)<.5&&Math.hypot(x-b.model.root.position.x,z-b.model.root.position.z)<7&&Math.abs(y-b.model.root.position.y)<2)??null;}
 board(x:number,z:number,y:number){const b=this.nearby(x,z,y);if(!b)return false;this.active=b;this.mode='passenger';b.wait=Math.max(b.wait,5);return true;}
 private exitPoint(b:Bus):P|null{const p=b.model.root.position,yaw=b.model.root.rotation.y;
  const paths=realm.sidewalk.flatMap(s=>s.points);
  const nearby=paths.map(([x,z])=>({x,z})).filter(q=>Math.hypot(q.x-p.x,q.z-p.z)<12&&Math.hypot(q.x-p.x,q.z-p.z)>3&&this.exitClear(q.x,q.z)).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z));
  if(nearby.length)return nearby[0];for(const side of [-1,1])for(const d of [3.2,4.2,5.2]){const x=p.x+Math.cos(yaw)*d*side,z=p.z-Math.sin(yaw)*d*side;if(this.exitClear(x,z))return {x,z};}return null;
 }
 takeWheel(){const b=this.active;if(!b||this.mode!=='passenger'||Math.abs(b.state.speed)>.5)return false;const q=this.exitPoint(b);if(!q)return false;this.mode='driver';b.model.driver.visible=false;
  // The fictional driver steps out; no attack animation. Restore when the bus is released.
  const g=b.model.driver.clone();g.visible=true;g.children[0].position.y=1.04;g.children[1].position.y=1.46;g.children[2].scale.set(1,3.5,.45);g.children[2].position.y=.42;g.children[2].position.z=0;g.position.set(q.x,Math.max(.45,this.ground(q.x,q.z)),q.z);g.rotation.y=b.model.root.rotation.y;this.scene.add(g);this.formerDriver=g;return true;}
 leave(){const b=this.active;if(!b||Math.abs(b.state.speed)>.5)return null;const q=this.exitPoint(b);if(q)this.reset();return q;}
 reset(){if(this.active)this.active.model.driver.visible=true;this.formerDriver?.removeFromParent();this.formerDriver=null;this.active=null;this.mode=null;}
 hide(){for(const b of this.buses)b.model.root.visible=false;}
 get speed(){return this.active?.state.speed??0;}
 get seat(){const b=this.active;if(!b)return null;b.model.root.updateMatrixWorld(true);const p=b.model.root.localToWorld(this.mode==='driver'?new THREE.Vector3(.65,.64,-4):new THREE.Vector3(.65,2.99,-.65));return {x:p.x,y:p.y,z:p.z,yaw:b.model.root.rotation.y};}
 get canDrive(){return this.mode==='passenger'&&Math.abs(this.speed)<.5;}
 blocks(x:number,z:number,y:number){return this.buses.some(b=>{const p=b.model.root.position;if(!b.model.root.visible||y>p.y+4.3)return false;const a=b.model.root.rotation.y,dx=x-p.x,dz=z-p.z;return Math.abs(dx*Math.cos(a)-dz*Math.sin(a))<1.58&&Math.abs(dx*Math.sin(a)+dz*Math.cos(a))<5.45;});}
 update(dt:number,x:number,z:number,throttle=0,steer=0,boost=false){
  for(const b of this.buses){const p=b.model.root.position,near=Math.hypot(x-p.x,z-p.z)<230,active=b===this.active;b.model.root.visible=near||active;if(!near&&!active)continue;
   const clear=(px:number,pz:number)=>this.clear(px,pz)&&!this.buses.some(o=>o!==b&&Math.hypot(o.model.root.position.x-px,o.model.root.position.z-pz)<4);
   if(active&&this.mode==='driver'){b.state=stepBus(b.route,b.state,throttle,steer,dt,clear,boost);}
   else{const stop=b.stops.find(d=>Math.abs(d-b.state.distance)<3&&d!==b.lastStop);if(stop!==undefined){b.wait=6;b.lastStop=stop;}
    if(b.wait>0){b.wait-=dt;b.state.speed=0;}
    else if((b.state.dir===1&&b.state.distance>=b.route.totalLength-7.01)||(b.state.dir===-1&&b.state.distance<=7.01)){const reverse={...b.state,dir:(-b.state.dir) as 1|-1,speed:0};if(busFits(busPose(b.route,reverse),clear))b.state=reverse;b.wait=3;}
    else b.state=stepBus(b.route,b.state,.60,0,dt,clear);
   }
   this.place(b,dt);
  }
 }
 dispose(){this.reset();this.buses.forEach(b=>b.model.dispose());}
}
