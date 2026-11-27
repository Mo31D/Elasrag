// Species-inspired gameplay parameters, NOT measured physiological limits.
export type Species='mallard'|'swan'|'sheep'|'dog';
export const ANIMALS={
 mallard:{label:'Mallard',mass:1.1,walk:.9,run:2.5,swim:1.15,fly:17,takeoff:6,runway:2,climb:3.4,turn:2.0,energy:42,height:38,radius:.24,eye:.55},
 swan:{label:'Mute swan',mass:10.5,walk:.65,run:3.5,swim:1.35,fly:19,takeoff:8,runway:24,climb:2.2,turn:.8,energy:65,height:55,radius:.42,eye:1.15},
 sheep:{label:'Herdwick sheep',mass:55,walk:1.1,run:5.0,swim:.5,fly:0,takeoff:0,runway:0,climb:0,turn:2.8,energy:0,height:0,radius:.36,eye:1.0},
 dog:{label:'Dog',mass:20,walk:1.3,run:7.0,swim:.95,fly:0,takeoff:0,runway:0,climb:0,turn:3.2,energy:0,height:0,radius:.28,eye:.7},
} as const;
export function turnTowards(yaw:number,target:number,rate:number,dt:number){const d=Math.atan2(Math.sin(target-yaw),Math.cos(target-yaw));return yaw+Math.max(-rate*dt,Math.min(rate*dt,d));}
export function flightEnergy(energy:number,dt:number,airborne:boolean,max:number){return Math.max(0,Math.min(max,energy+dt*(airborne?-1:2.5)));}
export function canTakeOff(kind:Species,runway:number,energy:number){const p=ANIMALS[kind];return p.fly>0&&runway>=p.runway&&energy>=p.energy*.25;}
export function feedAllowed(kind:Species,wet:boolean,airborne:boolean,speed:number){return !airborne&&speed<.35&&(kind==='mallard'||kind==='swan'||!wet);}

// Input is the sole powered-flight demand; vertical controls also permit lift.
export function flightDemand(strength:number,vertical:number){return Math.max(0,Math.min(1,Math.max(strength,Math.abs(vertical)*.55)));}

export const ANIMAL_ORBIT_HOLD=1.5;
export function animalCameraFollow(yaw:number,pitch:number,heading:number,hold:number,dragging:boolean,dt:number){
 if(dragging)return {yaw,pitch,hold:ANIMAL_ORBIT_HOLD};
 const wait=Math.max(0,hold-dt),followDt=Math.max(0,dt-hold);
 const delta=Math.atan2(Math.sin(heading-yaw),Math.cos(heading-yaw));
 const blend=1-Math.exp(-followDt*5);
 return {yaw:yaw+delta*blend,pitch:pitch*(1-blend),hold:wait};
}
// Ground movement uses a stable view bearing for each stick gesture. In the air
// left/right are continuous yaw commands, not a moving camera-relative target.
export function animalSteering(kind:Species,yaw:number,steer:number,forward:number,bearing:number,air:boolean,wet:boolean,dt:number){
 const magnitude=Math.min(1,Math.hypot(steer,forward));
 if(magnitude<=.08)return {yaw,strength:0,drive:0};
 const p=ANIMALS[kind];
 if(air){
  const rate=Math.max(1.45,p.turn*1.45);
  return {yaw:yaw-steer*rate*dt,strength:magnitude,drive:forward<-.08?.42:Math.max(.55,Math.min(1,Math.max(forward,Math.abs(steer)*.7)))};
 }
 const target=bearing-Math.atan2(steer,forward);
 const error=Math.atan2(Math.sin(target-yaw),Math.cos(target-yaw));
 const next=turnTowards(yaw,target,Math.max(wet?2.7:4.5,p.turn*(wet?1.5:1.8)),dt);
 // Turn on the spot rather than lurching in the old direction.
 const alignment=Math.max(0,Math.cos(error));
 return {yaw:next,strength:magnitude,drive:magnitude*alignment};
}
