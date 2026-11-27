import * as THREE from 'three';
import {BoatAttendant} from './boatAttendant';
import {ATTENDANT_STATION} from '../game/boatAttendant';
import {compileRoutePolyline,sampleCompiledRoute,type CompiledRoute} from '../geo/projection';
import realm from '../data/waterhead-public-realm.json';
import town from '../data/town-walks.json';
import {nextWalkDistance,chooseRefuge,forecastRisk,type VehicleForecast,type Threat} from '../game/crowdMotion';
type Clear=(x:number,z:number)=>boolean;
type Person={root:THREE.Group;head:THREE.Group;arms:THREE.Group[];legs:THREE.Group[];route:CompiledRoute;distance:number;dir:1|-1;speed:number;phase:number;pause:number;kind:number;dog?:Dog;x:number;z:number;yaw:number;offset:number;yieldTime:number};
type Dog={root:THREE.Group;legs:THREE.Group[];tail:THREE.Group;lead:THREE.Line<THREE.BufferGeometry,THREE.LineBasicMaterial>;x:number;z:number;yaw:number;phase:number};
const colours=[0x31455d,0xb55945,0x62765b,0xd2ae73,0x795b88,0x397d87,0x5f6061,0xb9b5a7];
const skin=[0xd2a07b,0x9b674c,0xe1b695,0x744a35,0xbc8862];
export class PedestrianWorld{
 readonly attendant:BoatAttendant;
 private people:Person[]=[];private geos=new Set<THREE.BufferGeometry>();private mats=new Set<THREE.Material>();private materialCache=new Map<number,THREE.MeshStandardMaterial>();private time=0;
 private boxGeo=new THREE.BoxGeometry(1,1,1);private sphereGeo=new THREE.SphereGeometry(1,10,7);
 constructor(private scene:THREE.Scene,private ground:(x:number,z:number)=>number,private clear:Clear,private dogClear:Clear=clear){
  this.attendant=new BoatAttendant(scene,ground,clear);
  this.geos.add(this.boxGeo);this.geos.add(this.sphereGeo);
  const shore=realm.sidewalk.filter(p=>p.id===121559793||p.id===339185882||p.id===1567958533||p.id===1567958538);
  const specs=[...shore.map((p,i)=>({p,n:i===0?8:i===1?3:2})),...town.map(p=>({p,n:2}))];
  let i=0;
  for(const {p,n} of specs){const route=compileRoutePolyline(p.points.map(q=>[q[0],q[1]]));if(route.totalLength<5)continue;
   for(let k=0;k<n;k++,i++){const distance=(k+.65)/(n+.3)*route.totalLength,s=sampleCompiledRoute(route,distance);
    const root=new THREE.Group(),head=new THREE.Group(),arms:THREE.Group[]=[],legs:THREE.Group[]=[];
    const coat=colours[i%colours.length],pants=[0x303b43,0x434d59,0x766853][i%3],face=skin[i%skin.length],hair=[0x49392d,0x282525,0x9b835f,0x76716e][i%4];
    const height=[1.0,.94,1.07,.90,1.02][i%5];root.scale.setScalar(height);
    this.mesh(root,false,coat,0,1.04,0,.44,.58,.29);this.mesh(root,true,coat,0,1.29,0,.24,.13,.16);
    head.position.y=1.45;root.add(head);this.mesh(head,true,face,0,.06,0,.137,.17,.13);this.mesh(head,true,hair,0,.155,.025,.14,.10,.13);for(const side of [-1,1]){this.mesh(head,true,face,side*.132,.06,.003,.022,.037,.023);this.mesh(head,true,0x39302d,side*.046,.083,-.116,.014,.009,.008);}this.mesh(head,true,face,0,.051,-.134,.022,.028,.025);this.mesh(head,true,0x925f50,0,.008,-.118,.036,.007,.008);
    if(i%4===0)this.mesh(head,true,hair,0,.035,.115,.115,.19,.08);
    if(i%5===0){this.mesh(head,true,coat,0,.185,0,.15,.085,.15);this.mesh(head,false,coat,0,.175,-.135,.22,.03,.15);}
    for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.245,1.27,0);root.add(arm);this.mesh(arm,false,coat,0,-.205,0,.145,.40,.17);this.mesh(arm,true,face,0,-.455,0,.065,.08,.065);arms.push(arm);
     const leg=new THREE.Group();leg.position.set(side*.115,.76,0);root.add(leg);this.mesh(leg,false,pants,0,-.33,0,.17,.66,.20);this.mesh(leg,false,0x302c27,0,-.685,-.065,.19,.13,.30);legs.push(leg);}
    if(i%3===0){this.mesh(root,false,0x48534d,0,1.08,.22,.34,.44,.20);this.mesh(root,false,0xa8a28d,0,1.26,.32,.27,.06,.04);}
    if(i%6===2)this.mesh(root,false,0x967252,.34,.68,.01,.23,.29,.19);
    this.scene.add(root);root.position.set(s.x,Math.max(.45,this.ground(s.x,s.z)),s.z);root.visible=false;
    const person:Person={root,head,arms,legs,route,distance,dir:i%2?1:-1,speed:.78+(i%5)*.12,phase:i*.91,pause:i%4===0?3:0,kind:i%4,x:s.x,z:s.z,yaw:Math.atan2(-s.tx,-s.tz),offset:0,yieldTime:0};
    if((i%5===1||i===6)&&this.dogClear(s.x,s.z))person.dog=this.makeDog(i,s.x,s.z);
    this.people.push(person);
   }
  }
 }
 private material(c:number){let m=this.materialCache.get(c);if(!m){m=new THREE.MeshStandardMaterial({color:c,roughness:.82});this.materialCache.set(c,m);this.mats.add(m);}return m;}
 private mesh(g:THREE.Group,sphere:boolean,c:number,x:number,y:number,z:number,a:number,b:number,d:number){const o=new THREE.Mesh(sphere?this.sphereGeo:this.boxGeo,this.material(c));o.position.set(x,y,z);o.scale.set(a,b,d);g.add(o);return o;}
 private makeDog(i:number,x:number,z:number):Dog{
  const root=new THREE.Group(),legs:THREE.Group[]=[],tail=new THREE.Group(),coat=[0xc1a67f,0x40352a,0xe2ded1,0x9a7048][i%4];this.scene.add(root);
  const size=.75+(i%3)*.15;root.scale.setScalar(size);this.mesh(root,true,coat,0,.44,.04,.20,.24,.42);this.mesh(root,true,coat,0,.53,-.32,.15,.20,.18);this.mesh(root,true,coat,0,.45,-.47,.14,.11,.19);this.mesh(root,true,0x242323,0,.46,-.60,.07,.055,.05);for(const side of [-1,1]){this.mesh(root,true,0x211d19,side*.096,.585,-.455,.022,.021,.014);this.mesh(root,true,0xe9d7b9,side*.093,.59,-.467,.006,.006,.004);}this.mesh(root,true,0x302821,0,.40,-.52,.09,.018,.115);
  for(const side of [-1,1]){const ear=this.mesh(root,true,coat,side*.145,.53,-.30,.075,.15,.085);ear.rotation.z=side*.32;for(const zz of [-.24,.26]){const g=new THREE.Group();g.position.set(side*.14,.36,zz);root.add(g);this.mesh(g,false,coat,0,-.16,0,.105,.32,.11);legs.push(g);}}
  tail.position.set(0,.46,.38);root.add(tail);const t=this.mesh(tail,true,coat,0,.07,.20,.065,.07,.26);t.rotation.x=-.5;
  this.mesh(root,false,0xb5483c,0,.48,-.26,.31,.08,.15);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,0,0,0,0,0,0],3));const mat=new THREE.LineBasicMaterial({color:0x55483b});const lead=new THREE.Line(geometry,mat);lead.frustumCulled=false;this.geos.add(geometry);this.mats.add(mat);this.scene.add(lead);root.visible=lead.visible=false;
  return {root,legs,tail,lead,x,z,yaw:0,phase:i};
 }
 update(dt:number,playerX:number,playerZ:number,playerY:number,busBlocked:(x:number,z:number)=>boolean,forecast:readonly VehicleForecast[]=[]){
  this.time+=dt;this.attendant.update(dt,playerX,playerZ,playerY);
  for(const p of this.people){
   const near=Math.hypot(p.x-playerX,p.z-playerZ)<120;p.root.visible=near;if(p.dog&&!p.dog.root.userData.animalControlled)p.dog.root.visible=p.dog.lead.visible=near&&this.dogClear(p.dog.x,p.dog.z);else if(p.dog)p.dog.lead.visible=false;if(!near)continue;
   const playerDist=Math.hypot(p.x-playerX,p.z-playerZ),close=playerDist<1.65&&Math.abs(playerY-p.root.position.y)<2;
   p.pause=Math.max(0,p.pause-dt);
   const n=nextWalkDistance(p.distance,p.dir,p.speed,dt,p.route.totalLength),q=sampleCompiledRoute(p.route,n.distance),base=sampleCompiledRoute(p.route,p.distance);
   const risk=forecastRisk(p.x,p.z,forecast);p.yieldTime=risk>.14?1.1:Math.max(0,p.yieldTime-dt);
   const refuge=p.yieldTime>0?chooseRefuge(p.x,p.z,[-2.8,-2,-1.2,-.6,.6,1.2,2,2.8].map(offset=>({x:base.x+base.rx*offset,z:base.z+base.rz*offset,offset})),forecast,(x,z)=>this.clear(x,z)&&!busBlocked(x,z)&&!this.people.some(a=>a!==p&&a.root.visible&&Math.hypot(a.x-x,a.z-z)<.65)):null;
   let escaping=false,escapeYaw=p.yaw;
   if(refuge){const dx=refuge.x-p.x,dz=refuge.z-p.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*(risk>.6?3.1:1.8));if(d>.01){const x=p.x+dx/d*step,z=p.z+dz/d*step;if(this.clear(x,z)&&(!busBlocked(x,z)||forecastRisk(x,z,forecast)<risk)){p.x=x;p.z=z;p.offset=(p.x-base.x)*base.rx+(p.z-base.z)*base.rz;p.phase+=dt*14;escaping=true;escapeYaw=Math.atan2(-dx,-dz);}}}
   if(!p.yieldTime){p.offset*=Math.exp(-dt*2);}
   q.x+=q.rx*p.offset;q.z+=q.rz*p.offset;
   const crowded=this.people.some(a=>a!==p&&a.root.visible&&Math.hypot(q.x-a.x,q.z-a.z)<.62&&Math.hypot(q.x-a.x,q.z-a.z)<Math.hypot(p.x-a.x,p.z-a.z));
   let moving=!p.yieldTime&&!close&&!crowded&&this.attendant.distance(q.x,q.z)>.65&&(!p.dog||p.dog.root.userData.animalControlled||!p.dog.root.visible||Math.hypot(p.x-p.dog.x,p.z-p.dog.z)<2.2)&&p.pause===0&&this.clear(q.x,q.z)&&!busBlocked(q.x,q.z)&&forecastRisk(q.x,q.z,forecast)<.25;
   if(moving){p.distance=n.distance;p.dir=n.dir;p.x=q.x;p.z=q.z;p.phase+=dt*p.speed*7;if(n.distance===0||n.distance===p.route.totalLength)p.pause=1.2+p.kind*.5;}
   else if(!p.yieldTime&&!close&&!crowded&&p.pause===0){p.dir=p.dir===1?-1:1;p.pause=.8;}
   const desired=escaping?escapeYaw:p.yieldTime>0?p.yaw:close?Math.atan2(p.x-playerX,p.z-playerZ):Math.atan2(-q.tx*p.dir,-q.tz*p.dir);
   p.yaw+=Math.atan2(Math.sin(desired-p.yaw),Math.cos(desired-p.yaw))*Math.min(1,dt*6);
   p.root.position.set(p.x,Math.max(.45,this.ground(p.x,p.z))+(moving||escaping?Math.abs(Math.sin(p.phase))*(escaping?.045:.022):0),p.z);p.root.rotation.y=p.yaw;
   const wave=!p.yieldTime&&close&&p.kind===1?Math.sin(this.time*5)*.18-.95:0;
   for(let j=0;j<2;j++){const swing=moving||escaping?Math.sin(p.phase+j*Math.PI)*(escaping?.83:.47):0;p.legs[j].rotation.x=THREE.MathUtils.lerp(p.legs[j].rotation.x,swing,dt*10);p.arms[j].rotation.x=THREE.MathUtils.lerp(p.arms[j].rotation.x,j===1&&wave!==0?wave:-swing*.62,dt*10);}
   p.head.rotation.y=p.yieldTime>0?Math.sin(this.time*2)*.35:p.kind===2&&!moving?Math.sin(this.time*.5+p.phase)*.55:0;
   if(p.dog&&!p.dog.root.userData.animalControlled){const d=p.dog,tx=p.x+Math.cos(p.yaw)*1.0+Math.sin(p.yaw)*.30,tz=p.z-Math.sin(p.yaw)*1.0+Math.cos(p.yaw)*.30,dx=tx-d.x,dz=tz-d.z,l=Math.hypot(dx,dz);
    if(l>.12){const step=Math.min(l,dt*(p.yieldTime>0?3.5:1.55)),x=d.x+dx/l*step,z=d.z+dz/l*step;if(this.clear(x,z)&&this.dogClear(x,z)&&(!busBlocked(x,z)||forecastRisk(x,z,forecast)<forecastRisk(d.x,d.z,forecast))){d.x=x;d.z=z;d.yaw=Math.atan2(-dx,-dz);d.phase+=dt*10;}}
    d.root.position.set(d.x,Math.max(.45,this.ground(d.x,d.z)),d.z);d.root.rotation.y=d.yaw;d.root.visible=d.lead.visible=this.dogClear(d.x,d.z)&&Math.hypot(p.x-d.x,p.z-d.z)<3.5;
    for(let j=0;j<4;j++)d.legs[j].rotation.x=l>.15?Math.sin(d.phase+(j%2)*Math.PI+(j>1?Math.PI:0))*(p.yieldTime>0?.72:.45):0;d.tail.rotation.y=Math.sin(this.time*7+d.phase)*.42;
    const pos=d.lead.geometry.getAttribute('position'),hx=p.x+Math.cos(p.yaw)*.32,hz=p.z-Math.sin(p.yaw)*.32,hy=p.root.position.y+.86,dy=d.root.position.y+.50*d.root.scale.y;
    pos.setXYZ(0,hx,hy,hz);pos.setXYZ(1,(hx+d.x)/2,(hy+dy)/2-.17,(hz+d.z)/2);pos.setXYZ(2,d.x,dy,d.z);pos.needsUpdate=true;
   }
  }
 }
 vulnerablePositions(){const out:{x:number;z:number}[]=[];if(this.attendant.stationVisible)out.push({x:ATTENDANT_STATION.x,z:ATTENDANT_STATION.z});for(const p of this.people){if(!p.root.visible)continue;out.push({x:p.x,z:p.z});if(p.dog&&p.dog.root.visible&&!p.dog.root.userData.animalControlled)out.push({x:p.dog.x,z:p.dog.z});}return out;}
 distanceToNearest(x:number,z:number){let d=this.attendant.distance(x,z);for(const p of this.people){if(!p.root.visible)continue;d=Math.min(d,Math.hypot(x-p.x,z-p.z));if(p.dog&&p.dog.root.visible&&!p.dog.root.userData.animalControlled)d=Math.min(d,Math.hypot(x-p.dog.x,z-p.dog.z));}return d;}
 near(x:number,z:number,r=.65){return this.distanceToNearest(x,z)<r;}
 hide(){this.attendant.hide();for(const p of this.people){p.root.visible=false;if(p.dog)p.dog.root.visible=p.dog.lead.visible=false;}}
 threats():Threat[]{const out:Threat[]=[];if(this.attendant.stationVisible)out.push({x:ATTENDANT_STATION.x,z:ATTENDANT_STATION.z,radius:3.4});for(const p of this.people){if(!p.root.visible)continue;out.push({x:p.x,z:p.z,radius:3.4});if(p.dog&&p.dog.root.visible&&!p.dog.root.userData.animalControlled)out.push({x:p.dog.x,z:p.dog.z,radius:6});}return out;}
 selectableAnimals(){return this.people.flatMap(p=>p.dog?[{root:p.dog.root,kind:'dog' as const,pose:(t:number,s:number,wet:boolean,air:boolean,feed:boolean)=>{const d=p.dog!;for(let j=0;j<4;j++)d.legs[j].rotation.x=s>.05?Math.sin(t*(wet?10:8)+(j%2)*Math.PI+(j>1?Math.PI:0))*.6:0;d.tail.rotation.y=Math.sin(t*7)*.4;d.root.rotation.x=feed?-.13:0;}}]:[]);}
 dispose(){this.attendant.dispose();for(const p of this.people){p.root.removeFromParent();p.dog?.root.removeFromParent();p.dog?.lead.removeFromParent();}this.geos.forEach(g=>g.dispose());this.mats.forEach(m=>m.dispose());}
}
