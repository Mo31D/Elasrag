import {useEffect,useRef,useState,type PointerEvent} from 'react';
import {Map,Menu,ArrowUp,RotateCcw,Compass} from 'lucide-react';
import type {GameHUDProps} from './GameHUD';
import {floatingInput,EXPLORE_PACE_LABEL,type ExplorePace} from '../game/exploreControls';
import navigation from '../data/ambleside-navigation.json';
const control='pointer-events-auto flex items-center justify-center rounded-full border border-white/35 bg-slate-950/55 text-white active:bg-white/30 touch-none';
const paceOrder:ExplorePace[]=['walk','run','sprint'];
const paths=navigation.approaches.map(a=>a.points);
export function ExploreHUD(p:GameHUDProps){
 const {hud}=p;
 const [touch,setTouch]=useState(()=>window.matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0);
 const [stick,setStick]=useState<{x:number;y:number;dx:number;dy:number}|null>(null);
 const active=useRef<{id:number;x:number;y:number;localX:number;localY:number}|null>(null);
 const latest=useRef(p);latest.current=p;
 const mapRef=useRef<HTMLCanvasElement>(null);
 const radius=43;
 function clear(){active.current=null;setStick(null);latest.current.onTouchSteer(0);latest.current.onTouchAdvance(0);}
 useEffect(()=>{
   const media=window.matchMedia('(pointer: coarse)');
   const update=()=>{clear();setTouch(media.matches||navigator.maxTouchPoints>0)};
   window.addEventListener('blur',clear);window.addEventListener('resize',update);document.addEventListener('visibilitychange',clear);
   media.addEventListener('change',update);
   return()=>{window.removeEventListener('blur',clear);window.removeEventListener('resize',update);document.removeEventListener('visibilitychange',clear);media.removeEventListener('change',update);latest.current.onTouchSteer(0);latest.current.onTouchAdvance(0);};
 },[]);
 useEffect(()=>{
   const c=mapRef.current,ctx=c?.getContext('2d');if(!c||!ctx)return;
   const w=c.width,h=c.height,scale=.45;
   ctx.clearRect(0,0,w,h);ctx.fillStyle='#12252e';ctx.fillRect(0,0,w,h);
   const draw=(pts:number[][],closed=false)=>{ctx.beginPath();pts.forEach(([x,z],i)=>{const px=w/2+(x-hud.playerX)*scale,py=h/2+(z-hud.playerZ)*scale;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);});if(closed)ctx.closePath();};
   ctx.fillStyle='#21596f';for(const ring of p.lakeData?.outerRings??[]){draw(ring,true);ctx.fill();}
   ctx.fillStyle='#12252e';for(const ring of p.lakeData?.innerRings??[]){draw(ring,true);ctx.fill();}
   ctx.strokeStyle='#d0b88b';ctx.lineWidth=2.5;for(const path of paths){draw(path);ctx.stroke();}
   ctx.save();ctx.translate(w/2,h/2);ctx.rotate(-hud.playerHeading);ctx.fillStyle='#f5e7aa';ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.restore();
   ctx.fillStyle='#fff';ctx.font='10px Arial';ctx.fillText('N',w/2-3,11);
 },[hud.playerX,hud.playerZ,hud.playerHeading,p.lakeData]);
 function move(e:PointerEvent<HTMLDivElement>){
  const a=active.current;if(!a||a.id!==e.pointerId)return;
  const v=floatingInput(a,{x:e.clientX,y:e.clientY},radius);
  setStick({x:a.localX,y:a.localY,dx:v.x*radius,dy:-v.y*radius});p.onTouchSteer(v.x);p.onTouchAdvance(v.y);
 }
 const pace=hud.explorePace??'run';
 return <div data-testid="explore-hud-v5" className="fixed inset-0 z-10 pointer-events-none select-none">
  <div className="absolute flex items-start justify-between gap-2" style={{top:'max(10px, env(safe-area-inset-top))',left:'max(12px, env(safe-area-inset-left))',right:'max(12px, env(safe-area-inset-right))'}}>
   <button type="button" onClick={p.onOpenMap} aria-label="Open world map" className="pointer-events-auto flex items-start gap-2 text-left text-white">
    <span className="relative block h-[84px] w-[84px] sm:h-[104px] sm:w-[104px] shrink-0 overflow-hidden rounded-full border-2 border-white/40 bg-slate-950/70"><canvas ref={mapRef} width={116} height={116} className="h-full w-full"/><Map size={15} className="absolute bottom-2 right-3 text-white"/></span>
    <span className="mt-1 max-w-[34vw] rounded-lg bg-slate-950/65 px-2 py-1.5"><span className="block truncate text-xs font-semibold">{hud.insideShop?'The Black Sheep Shop':hud.nearSettlement}</span>{!hud.insideShop&&!hud.cleanExploreMode&&hud.nearLandmark&&<span className="block truncate text-[10px] text-teal-100">{hud.nearLandmark}</span>}</span>
   </button>
   <button type="button" aria-label="Pause and settings menu" onClick={p.onPause} className={control+' h-12 w-12 rounded-xl'}><Menu size={23}/></button>
  </div>
  {hud.actionCallout&&<div className="absolute left-1/2 top-28 max-w-[70%] -translate-x-1/2 rounded-lg bg-slate-950/75 px-3 py-2 text-xs text-white">{hud.actionCallout}</div>}
  {touch&&<div role="group" aria-label="Floating movement joystick" data-testid="floating-joystick-zone" className="pointer-events-auto absolute left-0 bottom-0 w-[46%] h-[43%] touch-none" 
   onPointerDown={e=>{if(active.current||e.button!==0)return;e.preventDefault();const r=e.currentTarget.getBoundingClientRect();active.current={id:e.pointerId,x:e.clientX,y:e.clientY,localX:e.clientX-r.left,localY:e.clientY-r.top};e.currentTarget.setPointerCapture(e.pointerId);setStick({x:e.clientX-r.left,y:e.clientY-r.top,dx:0,dy:0});p.onTouchSteer(0);p.onTouchAdvance(0);}}
   onPointerMove={move} onPointerUp={e=>{if(active.current?.id===e.pointerId)clear()}} onPointerCancel={e=>{if(active.current?.id===e.pointerId)clear()}} onLostPointerCapture={e=>{if(active.current?.id===e.pointerId)clear()}}>
   <div className="pointer-events-none absolute flex h-[110px] w-[110px] items-center justify-center rounded-full border-2 border-white/30 bg-slate-950/25" style={stick?{left:stick.x,top:stick.y,transform:'translate(-50%,-50%)'}:{left:'max(22px, env(safe-area-inset-left))',bottom:'calc(max(18px, env(safe-area-inset-bottom)) + 6px)'}}>
    <div className="h-12 w-12 rounded-full border border-white/70 bg-white/40 shadow-md" style={{transform:'translate('+(stick?.dx??0)+'px,'+(stick?.dy??0)+'px)'}}/>
   </div>
  </div>}
  {!touch&&<div className="absolute bottom-4 left-4 rounded-lg bg-slate-950/60 p-2 text-xs text-white">WASD · drag to look · 1 / 2 / 3 pace · Space jump · E interact</div>}
  <div className="absolute flex flex-col items-end gap-2" style={{right:'max(14px, env(safe-area-inset-right))',bottom:'calc(max(16px, env(safe-area-inset-bottom)) + 4px)'}}>
   {(hud.canEnterShop||hud.insideShop)&&<button type="button" className="pointer-events-auto rounded-xl bg-teal-200 px-4 py-3 text-sm font-semibold text-slate-950" onClick={p.onShopDoor}>{hud.insideShop?'Leave shop':'Enter shop'}</button>}
   {!hud.insideShop&&<div className="pointer-events-auto flex rounded-xl border border-white/20 bg-slate-950/65 p-1 text-xs text-white" role="group" aria-label="Movement speed">{paceOrder.map(mode=><button key={mode} type="button" aria-pressed={pace===mode} className={'min-h-9 rounded-lg px-2.5 touch-none '+(pace===mode?'bg-white/90 font-bold text-slate-900':'text-white/85')} onClick={()=>p.onSetExplorePace(mode)}><span className="block whitespace-nowrap">{EXPLORE_PACE_LABEL[mode]}</span></button>)}</div>}
   <div className="flex items-end gap-3">
    <button type="button" aria-label="Recenter camera behind player" onClick={p.onRecenterExploreCamera} className={control+' h-11 w-11'}><RotateCcw size={19}/></button>
    <button type="button" aria-label="Switch camera view" onClick={p.onToggleExploreView} className={control+' h-11 w-11'}><Compass size={21}/></button>
    {touch&&!hud.insideShop&&<button type="button" aria-label="Jump (tap twice for double jump)" className={control+' h-16 w-16'} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();p.onTouchJump()}} onClick={e=>{if(e.detail===0)p.onTouchJump()}}><ArrowUp size={26}/></button>}
   </div>
  </div>
  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-white/50">V13</div>
 </div>;
}
