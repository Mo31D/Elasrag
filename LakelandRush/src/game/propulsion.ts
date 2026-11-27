// Shared held accelerator for all player-controlled vehicles. Reverse input has
// priority so braking/reversing remains possible while the pedal is held.
export function driveThrottle(input:number,pedal:boolean){return pedal&&input>=0?1:Math.max(-1,Math.min(1,input));}
export const SWIM_SPEED=1.65,FAST_SWIM_SPEED=2.65;
export function swimSpeed(fast:boolean){return fast?FAST_SWIM_SPEED:SWIM_SPEED;}
export type PoweredVehicle='rowboat'|'motorboat'|'bus';
const speeds:Record<PoweredVehicle,{normal:number;fast:number;reverse:number;response:number}>={
 rowboat:{normal:3.2,fast:4.1,reverse:1.15,response:2.1},
 motorboat:{normal:4.4,fast:6.2,reverse:1.5,response:1.4},
 bus:{normal:10,fast:13,reverse:3,response:2.4}
};
export function propulsionSpeed(kind:PoweredVehicle,current:number,throttle:number,boost:boolean,dt:number){
 const p=speeds[kind],t=Math.max(-1,Math.min(1,throttle)),target=t*(t<0?p.reverse:boost?p.fast:p.normal);
 return current+(target-current)*(1-Math.exp(-Math.max(0,dt)*p.response));
}
