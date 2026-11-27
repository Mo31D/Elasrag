import * as THREE from 'three';
import {ANIMALS,flightEnergy,feedAllowed,animalSteering,flightDemand,type Species} from '../game/animalMotion';
import {sweepMove} from '../game/exploreControls';
import {createHerdwickSheepModel} from './models';
export type BirdFlightPose='takeoff'|'powered'|'glide'|'landing';
export type BirdAttitude={bank:number;pitch:number;dt:number};
export type AnimalActor={root:THREE.Group;kind:Species;pose:(phase:number,speed:number,wet:boolean,air:boolean,feed:boolean,flight?:BirdFlightPose,attitude?:BirdAttitude)=>void};
export function sheepActor():AnimalActor{
 const root=createHerdwickSheepModel(),head=root.children[1],legs=root.children.slice(2);const pivots=legs.map(l=>{const g=new THREE.Group();g.position.copy(l.position);g.position.y+=.2;l.position.set(0,-.2,0);root.add(g);g.add(l);return g;});
 const neck=new THREE.Group();neck.position.set(0,.71,-.31);root.add(neck);neck.add(head);head.position.set(0,.05,-.21);
 return {root,kind:'sheep',pose:(t,s,wet,air,feed)=>{neck.rotation.x=feed?-.95+.08*Math.sin(t*4):0;for(let i=0;i<4;i++)pivots[i].rotation.x=s>.05?Math.sin(t*8+(i===0||i===3?0:Math.PI))*(wet?.55:.45):0;}};
}
type World={wet:(x:number,z:number)=>boolean;floor:(x:number,z:number)=>number;solid:(x:number,z:number,r:number)=>number;blocked:(x:number,z:number,y:number,r:number)=>boolean;ripple:(x:number,z:number,r:number)=>void};
export class AnimalPlayer{
 readonly p; x:number;z:number;y:number;yaw:number;speed=0;actualSpeed=0;energy:number;runway=0;air=false;launch=false;landing=false;feeding=false;wet=false;private t=0;private rippleTime=0;private climbVelocity=0;private launchTime=0;private flightPhase=0;private bank=0;private pitch=0;private manualLanding=false;private rest:THREE.Vector3;private restYaw:number;
 constructor(readonly actor:AnimalActor,private world:World){this.p=ANIMALS[actor.kind];const r=actor.root;this.rest=r.position.clone();this.restYaw=r.rotation.y;this.x=r.position.x;this.y=r.position.y;this.z=r.position.z;this.yaw=r.rotation.y;this.energy=this.p.energy;this.wet=world.wet(this.x,this.z);r.userData.animalControlled=true;}
 toggleFlight(){
  if(!this.p.fly)return;
  if(this.air){
   if(this.landing&&this.energy>0){this.landing=false;this.manualLanding=false;this.launch=true;this.launchTime=.8;return;}
   this.landing=true;this.manualLanding=true;this.launch=false;return;
  }
  if(this.energy<this.p.energy*.25)return;
  // One press supplies the initial leg push and wing-powered ascent, even
  // at zero joystick input. Shortened swan launch is a gameplay concession.
  const surface=this.world.wet(this.x,this.z)?-.08:this.world.floor(this.x,this.z);
  this.air=true;this.launch=true;this.landing=false;this.feeding=false;
  const wasWet=this.wet;
  this.wet=false;this.runway=0;this.launchTime=0;this.flightPhase=0;this.manualLanding=false;this.bank=0;this.pitch=.20;
  if(wasWet)this.world.ripple(this.x,this.z,this.p.radius*2.5);
  this.y=Math.max(this.y,surface)+.12;
  this.climbVelocity=this.actor.kind==='swan'?1.9:2.7;
  this.speed=Math.max(this.speed,this.p.takeoff*.26);
  this.actor.root.position.y=this.y;
  this.actor.pose(0,this.speed,false,true,false,'takeoff',{bank:0,pitch:this.pitch,dt:0});
 }
 toggleFeed(){if(feedAllowed(this.actor.kind,this.wet,this.air,this.speed)){this.feeding=!this.feeding;this.launch=false;this.runway=0;}}
 update(dt:number,steer:number,throttle:number,cameraYaw:number,fast:boolean,vertical:number){
  this.t+=dt;const p=this.p,w=this.world;
  const motion=animalSteering(this.actor.kind,this.yaw,steer,throttle,cameraYaw,this.air,this.wet,dt),strength=motion.strength;
  const oldYaw=this.yaw;this.yaw=motion.yaw;if(strength>.08)this.feeding=false;
  const turnRate=dt>0?(this.yaw-oldYaw)/dt:0;
  this.bank+=(THREE.MathUtils.clamp(turnRate*.32,-.48,.48)-this.bank)*(1-Math.exp(-dt*5));
  const floor=(x:number,z:number)=>w.wet(x,z)?-.08:w.floor(x,z);
  this.wet=!this.air&&w.wet(this.x,this.z);
  // Launch has its own power; afterwards steering/vertical input powers
  // flight, while released controls allow an unpowered forward glide.
  const inputDemand=flightDemand(strength,vertical);
  if(this.air&&this.energy<=0){this.landing=true;this.launch=false;}
  if(this.air&&this.landing&&!this.manualLanding&&this.energy>0&&inputDemand>.08){this.landing=false;}
  if(this.launch){
   this.launchTime+=dt;
   if(this.launchTime>=(this.actor.kind==='swan'?1.85:1.4))this.launch=false;
  }
  const demand=this.launch?1:inputDemand;
  const gliding=this.air&&!this.launch&&!this.landing&&demand<=.08;
  const floorHere=floor(this.x,this.z);
  if(gliding&&this.y<=floorHere+.65)this.landing=true;
  const clearance=Math.max(0,this.y-floorHere);
  const target=this.air?(this.landing?p.fly*THREE.MathUtils.lerp(.13,.37,Math.min(1,clearance/2.2)):this.launch?p.fly*.64:gliding?p.fly*.42:p.fly*Math.max(.42, motion.drive,Math.abs(vertical)*.55)):motion.drive*(this.wet?p.swim:fast?p.run:p.walk);
  this.speed+=(target-this.speed)*(1-Math.exp(-dt*(this.air?1.8:motion.drive<.1?12:5.5)));
  const ox=this.x,oz=this.z;
  const canMove=(x:number,z:number,y:number)=>!w.blocked(x,z,y,p.radius);
  if(this.air){
   const ahead=floor(this.x-Math.sin(this.yaw)*Math.max(.5,this.speed*.35),this.z-Math.cos(this.yaw)*Math.max(.5,this.speed*.35));
   const needLift=this.y<Math.max(floorHere+1.35,ahead+.30);
   const desired=this.landing?-THREE.MathUtils.lerp(.38,p.climb*.70,Math.min(1,clearance/1.5)):this.launch?p.climb:gliding?-.48:vertical<-.05?vertical*p.climb:Math.max(vertical*p.climb,needLift?p.climb*.72:0);
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
  this.actualSpeed=dt>0?moved/dt:0;
  if(dt>0&&moved<delta*.12)this.speed*=Math.exp(-dt*8);
  // Gliding and flaring consume less stamina than repeated powered wingbeats.
  this.energy=flightEnergy(this.energy,dt*(this.air?(gliding?.35:this.landing?.6:1):1),this.air,p.energy);
  if(this.air){
   const surface=floor(this.x,this.z),solid=w.solid(this.x,this.z,p.radius);
   const roof=Number.isFinite(solid)?solid:-Infinity;
   if(this.landing&&this.y<=surface+.14&&roof<surface+.05){
    this.air=false;this.landing=false;this.launch=false;this.manualLanding=false;this.climbVelocity=0;this.speed=0;this.y=surface;
    if(w.wet(this.x,this.z))w.ripple(this.x,this.z,p.radius*2.5);
   }else if(roof>=surface+.05&&this.landing&&this.y<roof+.25){
    this.y=roof+.25;
   }
  }else{
   const ground=floor(this.x,this.z);this.y=ground;
  }
  this.wet=!this.air&&w.wet(this.x,this.z);
  this.actor.root.visible=true;this.actor.root.position.set(this.x,this.y,this.z);this.actor.root.rotation.set(0,this.yaw,0);
  if(this.air)this.flightPhase+=dt;
  const pose:BirdFlightPose|undefined=this.air?(this.landing?'landing':this.launch?'takeoff':gliding?'glide':'powered'):undefined;
  const desiredPitch=!this.air?0:this.landing?.16:THREE.MathUtils.clamp(this.climbVelocity/Math.max(1,this.speed),-.24,.36);
  this.pitch+=(desiredPitch-this.pitch)*(1-Math.exp(-dt*5));
  this.actor.pose(this.air?this.flightPhase:this.t,this.speed,this.wet,this.air,this.feeding,pose,{bank:this.air?this.bank:0,pitch:this.pitch,dt});
  this.rippleTime+=dt;if(this.wet&&moved>.001&&this.rippleTime>.3){this.rippleTime=0;w.ripple(this.x,this.z,p.radius*1.8);}
 }
 release(){const a=this.actor;a.root.userData.animalControlled=false;a.root.position.copy(this.rest);a.root.rotation.set(0,this.restYaw,0);a.pose(0,0,this.world.wet(this.rest.x,this.rest.z),false,false);}
}
