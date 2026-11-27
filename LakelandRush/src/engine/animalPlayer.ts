import * as THREE from 'three';
import {ANIMALS,canTakeOff,flightEnergy,feedAllowed,turnTowards,flightDemand,type Species} from '../game/animalMotion';
import {cameraRelative,sweepMove} from '../game/exploreControls';
import {createHerdwickSheepModel} from './models';
export type AnimalActor={root:THREE.Group;kind:Species;pose:(phase:number,speed:number,wet:boolean,air:boolean,feed:boolean)=>void};
export function sheepActor():AnimalActor{
 const root=createHerdwickSheepModel(),head=root.children[1],legs=root.children.slice(2);const pivots=legs.map(l=>{const g=new THREE.Group();g.position.copy(l.position);g.position.y+=.2;l.position.set(0,-.2,0);root.add(g);g.add(l);return g;});
 const neck=new THREE.Group();neck.position.set(0,.71,-.31);root.add(neck);neck.add(head);head.position.set(0,.05,-.21);
 return {root,kind:'sheep',pose:(t,s,wet,air,feed)=>{neck.rotation.x=feed?-.95+.08*Math.sin(t*4):0;for(let i=0;i<4;i++)pivots[i].rotation.x=s>.05?Math.sin(t*8+(i===0||i===3?0:Math.PI))*(wet?.55:.45):0;}};
}
type World={wet:(x:number,z:number)=>boolean;floor:(x:number,z:number)=>number;solid:(x:number,z:number,r:number)=>number;blocked:(x:number,z:number,y:number,r:number)=>boolean;ripple:(x:number,z:number,r:number)=>void};
export class AnimalPlayer{
 readonly p; x:number;z:number;y:number;yaw:number;speed=0;energy:number;runway=0;air=false;launch=false;landing=false;feeding=false;wet=false;private t=0;private rippleTime=0;private idle=0;private autoLanding=false;private climbVelocity=0;private launchTime=0;private rest:THREE.Vector3;private restYaw:number;
 constructor(readonly actor:AnimalActor,private world:World){this.p=ANIMALS[actor.kind];const r=actor.root;this.rest=r.position.clone();this.restYaw=r.rotation.y;this.x=r.position.x;this.y=r.position.y;this.z=r.position.z;this.yaw=r.rotation.y;this.energy=this.p.energy;this.wet=world.wet(this.x,this.z);r.userData.animalControlled=true;}
 toggleFlight(){if(!this.p.fly)return;if(this.air){this.landing=true;this.autoLanding=false;return;}if(this.launch){this.launch=false;this.runway=0;return;}if(this.energy>=this.p.energy*.25){this.launch=true;this.feeding=false;this.launchTime=0;}}
 toggleFeed(){if(feedAllowed(this.actor.kind,this.wet,this.air,this.speed)){this.feeding=!this.feeding;this.launch=false;this.runway=0;}}
 update(dt:number,steer:number,throttle:number,cameraYaw:number,fast:boolean,vertical:number){
  this.t+=dt;const p=this.p,w=this.world;const input=cameraRelative(steer,throttle,cameraYaw),strength=Math.min(1,Math.hypot(input.x,input.z));
  if(strength>.08){this.feeding=false;this.yaw=turnTowards(this.yaw,Math.atan2(-input.x,-input.z),p.turn,dt);}
  const floor=(x:number,z:number)=>w.wet(x,z)?-.08:w.floor(x,z);
  this.wet=!this.air&&w.wet(this.x,this.z);
  // Input owns propulsion. Releasing the stick produces a short glide and
  // a controlled descent, not endless powered flight or an airborne hover.
  const demand=flightDemand(strength,vertical);
  this.idle=demand>.08?0:this.idle+dt;
  if(this.air&&this.idle>.65&&!this.landing){this.autoLanding=true;this.landing=true;}
  if(this.autoLanding&&demand>.08&&this.energy>0){this.autoLanding=false;this.landing=false;}
  if(this.air&&this.energy<=0){this.landing=true;this.autoLanding=false;}
  const floorHere=floor(this.x,this.z);
  if(this.launch&&!this.air){
   // A mallard can spring from water or land; a heavy swan needs a short
   // running approach. Both require deliberate forward input.
   if(demand>.08)this.launchTime+=dt;else{this.launchTime=0;this.runway=0;}
  }
  const target=this.air?(this.landing?p.fly*.32:p.fly*demand):this.launch?p.takeoff*demand:strength*(this.wet?p.swim:fast?p.run:p.walk);
  this.speed+=(target-this.speed)*(1-Math.exp(-dt*(this.air?2.2:4.5)));
  const ox=this.x,oz=this.z;
  const canMove=(x:number,z:number,y:number)=>!w.blocked(x,z,y,p.radius);
  if(this.launch&&!this.air&&this.actor.kind==='mallard'&&this.launchTime>=.22&&this.energy>=p.energy*.25){
   this.air=true;this.launch=false;this.runway=0;this.y=Math.max(this.y,floorHere)+.17;this.climbVelocity=1.1;this.idle=0;
  }
  // Ascend before horizontal sweep so changing water/ground elevation cannot
  // deadlock the launch. Solid walls and roofs still block the physical hull.
  if(this.air){
   const desired=this.landing?-p.climb*.85:vertical<-.05?vertical*p.climb:Math.max(vertical*p.climb,this.y-floorHere<1.35&&demand>.08?p.climb*.72:0);
   this.climbVelocity+=(desired-this.climbVelocity)*(1-Math.exp(-dt*5.5));
   this.y=Math.min(floorHere+p.height,Math.max(floorHere+.07,this.y+this.climbVelocity*dt));
  }else this.y=floorHere;
  const delta=this.speed*dt;
  const next=sweepMove(ox,oz,-Math.sin(this.yaw)*delta,-Math.cos(this.yaw)*delta,(x,z)=>{
   if(!canMove(x,z,this.y))return true;
   if(!this.air)return !w.wet(x,z)&&floor(x,z)>floorHere+.65;
   return Math.max(floor(x,z),w.solid(x,z,p.radius))>this.y-.04;
  });
  this.x=next.x;this.z=next.z;const moved=Math.hypot(this.x-ox,this.z-oz);
  if(dt>0&&moved<delta*.12)this.speed*=Math.exp(-dt*8);
  if(this.launch&&!this.air){
   this.runway=demand>.08?this.runway+moved:0;
   if(this.speed>=p.takeoff*.45&&canTakeOff(this.actor.kind,this.runway,this.energy)){
    this.air=true;this.launch=false;this.runway=0;this.y=Math.max(this.y,floor(this.x,this.z))+.17;this.climbVelocity=p.climb*.5;this.idle=0;
   }
  }
  this.energy=flightEnergy(this.energy,dt,this.air,p.energy);
  if(this.air){
   const surface=floor(this.x,this.z),solid=w.solid(this.x,this.z,p.radius);
   const roof=Number.isFinite(solid)?solid:-Infinity;
   if(this.landing&&this.y<=surface+.14&&roof<surface+.05){
    this.air=false;this.landing=false;this.autoLanding=false;this.climbVelocity=0;this.speed=0;this.y=surface;
   }else if(roof>=surface+.05&&this.landing&&this.y<roof+.25){
    this.y=roof+.25;
   }
  }else{
   const ground=floor(this.x,this.z);this.y=ground;
  }
  this.wet=!this.air&&w.wet(this.x,this.z);
  this.actor.root.visible=true;this.actor.root.position.set(this.x,this.y,this.z);this.actor.root.rotation.set(0,this.yaw,0);
  this.actor.pose(this.t,this.speed,this.wet,this.air,this.feeding);
  this.rippleTime+=dt;if(this.wet&&moved>.001&&this.rippleTime>.3){this.rippleTime=0;w.ripple(this.x,this.z,p.radius*1.8);}
 }
 release(){const a=this.actor;a.root.userData.animalControlled=false;a.root.position.copy(this.rest);a.root.rotation.set(0,this.restYaw,0);a.pose(0,0,this.world.wet(this.rest.x,this.rest.z),false,false);}
}
