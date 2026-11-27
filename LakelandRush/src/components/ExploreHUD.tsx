import {useEffect,useRef,useState,type PointerEvent} from 'react';
import {Map,Menu,ArrowUp,ArrowDown,RotateCcw,Compass,Bird,ChevronsUp} from 'lucide-react';
import type {GameHUDProps} from './GameHUD';
import {floatingInput,floatingStickOrigin,EXPLORE_PACE_LABEL,type ExplorePace} from '../game/exploreControls';
import navigation from '../data/ambleside-navigation.json';
import {mapDistance} from '../geo/mapTravel';
const control='pointer-events-auto flex items-center justify-center rounded-full border border-white/35 bg-slate-950/55 text-white active:bg-white/30 touch-none';
const paceOrder:ExplorePace[]=['walk','run','sprint'];
const paths=navigation.approaches.map(a=>a.points);
export function ExploreHUD(p:GameHUDProps){
 const {hud}=p;
 const [touch,setTouch]=useState(()=>window.matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0);
 const [stick,setStick]=useState<{dx:number;dy:number}|null>(null);
 const [origin,setOrigin]=useState<{x:number;y:number}|null>(null);
 const zoneRef=useRef<HTMLDivElement>(null);
 const pedalRef=useRef<HTMLButtonElement>(null);
 const pedalPointer=useRef<number|null>(null);
 const active=useRef<{id:number;x:number;y:number}|null>(null);
 const latest=useRef(p);latest.current=p;
 const mapRef=useRef<HTMLCanvasElement>(null);
 const radius=32;
 function clearMove(){const a=active.current;active.current=null;setStick(null);setOrigin(null);latest.current.onTouchSteer(0);latest.current.onTouchAdvance(0);if(a&&zoneRef.current?.hasPointerCapture(a.id))zoneRef.current.releasePointerCapture(a.id);}
 function clearPedal(){const id=pedalPointer.current;pedalPointer.current=null;latest.current.onAccelerator(false);if(id!==null&&pedalRef.current?.hasPointerCapture(id))pedalRef.current.releasePointerCapture(id);}
 function clear(){clearMove();clearPedal();latest.current.onFlightVertical(0);}
 useEffect(()=>{
   const media=window.matchMedia('(pointer: coarse)');
   const update=()=>{clear();setTouch(media.matches||navigator.maxTouchPoints>0)};
   window.addEventListener('blur',clear);window.addEventListener('resize',update);document.addEventListener('visibilitychange',clear);
   media.addEventListener('change',update);
   return()=>{window.removeEventListener('blur',clear);window.removeEventListener('resize',update);document.removeEventListener('visibilitychange',clear);media.removeEventListener('change',update);latest.current.onTouchSteer(0);latest.current.onTouchAdvance(0);latest.current.onAccelerator(false);};
 },[]);
 useEffect(()=>{
   const c=mapRef.current,ctx=c?.getContext('2d');if(!c||!ctx)return;
   const w=c.width,h=c.height,scale=.45;
   ctx.clearRect(0,0,w,h);ctx.fillStyle='#12252e';ctx.fillRect(0,0,w,h);
   const draw=(pts:number[][],closed=false)=>{ctx.beginPath();pts.forEach(([x,z],i)=>{const px=w/2+(x-hud.playerX)*scale,py=h/2+(z-hud.playerZ)*scale;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);});if(closed)ctx.closePath();};
   ctx.fillStyle='#21596f';for(const ring of p.lakeData?.outerRings??[]){draw(ring,true);ctx.fill();}
   ctx.fillStyle='#12252e';for(const ring of p.lakeData?.innerRings??[]){draw(ring,true);ctx.fill();}
   ctx.strokeStyle='#d0b88b';ctx.lineWidth=2.5;for(const path of paths){draw(path);ctx.stroke();}
   if(p.waypoint){const dx=(p.waypoint.x-hud.playerX)*scale,dz=(p.waypoint.z-hud.playerZ)*scale,k=Math.min(1,(w/2-12)/Math.max(1,Math.hypot(dx,dz)));ctx.strokeStyle='#22d3ee';ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(w/2,h/2);ctx.lineTo(w/2+dx*k,h/2+dz*k);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#22d3ee';ctx.beginPath();ctx.arc(w/2+dx*k,h/2+dz*k,4,0,Math.PI*2);ctx.fill();}
   ctx.save();ctx.translate(w/2,h/2);ctx.rotate(-hud.playerHeading);ctx.fillStyle='#f5e7aa';ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.restore();
   ctx.fillStyle='#fff';ctx.font='10px Arial';ctx.fillText('N',w/2-3,11);
 },[hud.playerX,hud.playerZ,hud.playerHeading,p.lakeData,p.waypoint]);
 function move(e:PointerEvent<HTMLDivElement>){
  const a=active.current;if(!a||a.id!==e.pointerId)return;
  const v=floatingInput(a,{x:e.clientX,y:e.clientY},radius);
  setStick({dx:v.x*radius,dy:-v.y*radius});p.onTouchSteer(v.x);p.onTouchAdvance(v.y);
 }
 const pace=hud.explorePace??'run';
 const driving=hud.waterMode==='rowing'||hud.busMode==='driver';
 useEffect(()=>{if(!driving)clearPedal();},[driving]);
 return <div data-testid="explore-hud-v5" className="fixed inset-0 z-10 pointer-events-none select-none">
  <div className="absolute flex items-start justify-between gap-2" style={{top:'max(10px, env(safe-area-inset-top))',left:'max(12px, env(safe-area-inset-left))',right:'max(12px, env(safe-area-inset-right))'}}>
   <button type="button" onClick={p.onOpenMap} aria-label="Open world map" className="pointer-events-auto flex items-start gap-2 text-left text-white">
    <span className="relative block h-[84px] w-[84px] sm:h-[104px] sm:w-[104px] shrink-0 overflow-hidden rounded-full border-2 border-white/40 bg-slate-950/70"><canvas ref={mapRef} width={116} height={116} className="h-full w-full"/><Map size={15} className="absolute bottom-2 right-3 text-white"/></span>
    <span className="mt-1 max-w-[34vw] rounded-lg bg-slate-950/65 px-2 py-1.5"><span className="block truncate text-xs font-semibold">{hud.insideShop?'The Black Sheep Shop':hud.nearSettlement}</span>{!hud.insideShop&&!hud.cleanExploreMode&&hud.nearLandmark&&<span className="block truncate text-[10px] text-teal-100">{hud.nearLandmark}</span>}</span>
   </button>
   <div className="flex items-center gap-2 pointer-events-auto">{!hud.busMode&&!hud.insideShop&&hud.waterMode!=='rowing'&&<button type="button" aria-label="Toggle free flight" aria-pressed={!!hud.flying} onClick={()=>{p.onFlightVertical(0);p.onToggleFlight()}} className={control+' h-10 w-10 '+(hud.flying?'!bg-teal-500 !text-slate-950':'')}><Bird size={21}/></button>}
   <button type="button" aria-label="Pause and settings menu" onClick={p.onPause} className={control+' h-12 w-12 rounded-xl'}><Menu size={23}/></button></div>
  </div>
  {p.waypoint&&!hud.insideShop&&<button type="button" aria-label="Clear waypoint" onClick={p.onClearWaypoint} className="absolute top-[112px] left-3 pointer-events-auto max-w-[65vw] rounded-lg bg-slate-950/75 px-2.5 py-1.5 text-left text-xs text-cyan-200"><span className="block truncate">◆ {p.waypoint.name} · {mapDistance({x:hud.playerX,z:hud.playerZ},p.waypoint)}</span><span className="text-[9px] opacity-70">Direct distance · tap to clear</span></button>}
  {hud.actionCallout&&<div className="absolute left-1/2 top-28 max-w-[70%] -translate-x-1/2 rounded-lg bg-slate-950/75 px-3 py-2 text-xs text-white">{hud.actionCallout}</div>}
  {touch&&<div ref={zoneRef} role="group" aria-label="Floating movement joystick" data-testid="floating-joystick-zone" className="pointer-events-auto absolute left-0 top-1/2 bottom-0 w-1/2 touch-none"
   onPointerDown={e=>{if(active.current||e.button!==0)return;const rect=e.currentTarget.getBoundingClientRect();const hit=floatingStickOrigin(rect,{x:e.clientX,y:e.clientY},55);if(!hit)return;e.preventDefault();e.stopPropagation();active.current={id:e.pointerId,...hit.input};setOrigin(hit.visual);setStick({dx:0,dy:0});e.currentTarget.setPointerCapture(e.pointerId);}}
   onPointerMove={move} onPointerUp={e=>{if(active.current?.id===e.pointerId)clearMove()}} onPointerCancel={e=>{if(active.current?.id===e.pointerId)clearMove()}} onLostPointerCapture={e=>{if(active.current?.id===e.pointerId)clearMove()}}>
    <div data-testid="floating-joystick" className="pointer-events-none absolute flex h-[110px] w-[110px] items-center justify-center rounded-full border-2 border-white/30 bg-slate-950/25"
      style={origin?{left:origin.x-55,top:origin.y-55}:{left:'max(22px, env(safe-area-inset-left))',bottom:'calc(clamp(48px, 10dvh, 100px) + env(safe-area-inset-bottom, 0px))'}}>
      <div className="pointer-events-none h-12 w-12 rounded-full border border-white/70 bg-white/40 shadow-md" style={{transform:'translate('+(stick?.dx??0)+'px,'+(stick?.dy??0)+'px)'}}/>
    </div>
  </div>}
  {!touch&&<div className="absolute bottom-4 left-4 rounded-lg bg-slate-950/60 p-2 text-xs text-white">WASD · drag to look · Shift boost · 1 / 2 / 3 pace · Space jump/up · Q down · F fly · E interact</div>}
  <div className="absolute flex flex-col items-end gap-2" style={{right:'max(14px, env(safe-area-inset-right))',bottom:'calc(max(16px, env(safe-area-inset-bottom)) + 4px)'}}>
   {(hud.canEnterShop||hud.insideShop)&&<button type="button" className="pointer-events-auto rounded-xl bg-teal-200 px-4 py-3 text-sm font-semibold text-slate-950" onClick={p.onShopDoor}>{hud.insideShop?'Leave shop':'Enter shop'}</button>}
   {(hud.canBoardBus||hud.busMode)&&<button type="button" className="pointer-events-auto rounded-xl bg-lime-200 px-4 py-3 text-sm font-semibold text-slate-950" onClick={()=>{clear();p.onBusInteract()}}>{hud.busMode?'Leave bus':'Board 599 bus'}</button>}
   {hud.canDriveBus&&<button type="button" className="pointer-events-auto rounded-xl bg-white/90 px-4 py-3 text-sm font-semibold text-slate-950" onClick={()=>{clear();p.onBusDrive()}}>Take the wheel</button>}
   {hud.busMode&&<span className="rounded-lg bg-slate-950/75 px-3 py-2 text-xs text-lime-100">{hud.busMode==='driver'?'Driving · '+Math.round(hud.speedKmh)+' km/h':'599 · Passenger'}</span>}
   {(hud.canBoardBoat||hud.waterMode==='rowing')&&<button type="button" className="pointer-events-auto rounded-xl bg-teal-200 px-4 py-3 text-sm font-semibold text-slate-950" onClick={()=>{clear();p.onWaterInteract()}}>{hud.waterMode==='rowing'?'Leave boat':hud.boatKind==='motorboat'?'Board motorboat':'Board rowboat'}</button>}
   {(hud.waterMode==='swimming'||hud.waterMode==='rowing')&&<span className="rounded-lg bg-slate-950/70 px-3 py-2 text-xs text-teal-100">{hud.waterMode==='swimming'?'Swimming':hud.boatKind==='motorboat'?'Motorboat · throttle / steer':'Rowing · forward / steer'}</span>}
   {!hud.busMode&&!hud.insideShop&&hud.waterMode!=='swimming'&&hud.waterMode!=='rowing'&&<div className="pointer-events-auto flex rounded-xl border border-white/20 bg-slate-950/65 p-1 text-xs text-white" role="group" aria-label="Movement speed">{paceOrder.map(mode=><button key={mode} type="button" aria-pressed={pace===mode} className={'min-h-9 rounded-lg px-2.5 touch-none '+(pace===mode?'bg-white/90 font-bold text-slate-900':'text-white/85')} onClick={()=>p.onSetExplorePace(mode)}><span className="block whitespace-nowrap">{EXPLORE_PACE_LABEL[mode]}</span></button>)}</div>}
   {hud.waterMode==='swimming'&&<div role="group" aria-label="Swimming speed" className="pointer-events-auto flex rounded-xl border border-white/20 bg-slate-950/65 p-1 text-xs text-white">{[false,true].map(fast=><button type="button" key={String(fast)} aria-pressed={!!hud.fastSwim===fast} className={'min-h-10 rounded-lg px-3 touch-none '+(!!hud.fastSwim===fast?'bg-white/90 font-bold text-slate-900':'text-white/85')} onClick={()=>p.onSetSwimFast(fast)}>{fast?'Fast swim':'Swim'}</button>)}</div>}
   {driving&&<span className="rounded-lg bg-slate-950/70 px-3 py-1.5 text-xs text-white">{Math.round(hud.speedKmh)} km/h{!touch?' · Shift boost':''}</span>}
   <div className="flex items-end gap-3">
    {touch&&driving&&<button ref={pedalRef} type="button" data-testid="accelerator-pedal" aria-label="Hold accelerator" aria-pressed={!!hud.accelerating} className={control+' h-[76px] w-[64px] flex-col gap-0.5 rounded-2xl border-2 '+(hud.accelerating?'!bg-teal-400 !text-slate-950':'')} onPointerDown={e=>{if(e.button!==0||pedalPointer.current!==null)return;e.preventDefault();e.stopPropagation();pedalPointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);p.onAccelerator(true)}} onPointerUp={e=>{if(pedalPointer.current===e.pointerId)clearPedal()}} onPointerCancel={e=>{if(pedalPointer.current===e.pointerId)clearPedal()}} onLostPointerCapture={e=>{if(pedalPointer.current===e.pointerId)clearPedal()}}><ChevronsUp size={28}/><span className="text-[10px] font-semibold">ACCEL</span></button>}
    <button type="button" aria-label="Recenter camera behind player" onClick={p.onRecenterExploreCamera} className={control+' h-11 w-11'}><RotateCcw size={19}/></button>
    <button type="button" aria-label="Switch camera view" onClick={p.onToggleExploreView} className={control+' h-11 w-11'}><Compass size={21}/></button>
    {touch&&hud.flying&&[-1,1].map(dir=><button key={dir} type="button" aria-label={dir>0?'Fly up':'Fly down'} className={control+' h-12 w-12'} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);p.onFlightVertical(dir)}} onPointerUp={()=>p.onFlightVertical(0)} onPointerCancel={()=>p.onFlightVertical(0)} onLostPointerCapture={()=>p.onFlightVertical(0)}>{dir>0?<ArrowUp size={23}/>:<ArrowDown size={23}/>}</button>)}
    {touch&&!hud.busMode&&!hud.insideShop&&!hud.flying&&hud.waterMode!=='swimming'&&hud.waterMode!=='rowing'&&<button type="button" aria-label="Jump (tap twice for double jump)" className={control+' h-16 w-16'} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();p.onTouchJump()}} onClick={e=>{if(e.detail===0)p.onTouchJump()}}><ArrowUp size={26}/></button>}
   </div>
  </div>
  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-white/50">V28</div>
 </div>;
}
