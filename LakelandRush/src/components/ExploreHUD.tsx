import { useEffect,useRef,useState, type PointerEvent } from 'react';
import { Map,Pause,Volume2,VolumeX,Eye,EyeOff,Footprints,ArrowUp,Camera,Mountain,Menu,X } from 'lucide-react';
import type { GameHUDProps } from './GameHUD';
import { radialInput } from '../game/exploreControls';
const button='pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-slate-950/75 text-white active:bg-white/25 touch-manipulation';
export function ExploreHUD(p:GameHUDProps){
  const {hud}=p;
  const [menu,setMenu]=useState(false);
  const [knob,setKnob]=useState({x:0,y:0});
  const [touch,setTouch]=useState(()=>window.matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0);
  const pointer=useRef<number|null>(null);
  const callbacks=useRef({steer:p.onTouchSteer,advance:p.onTouchAdvance});
  callbacks.current={steer:p.onTouchSteer,advance:p.onTouchAdvance};
  function reset(){pointer.current=null;setKnob({x:0,y:0});callbacks.current.steer(0);callbacks.current.advance(0);}
  useEffect(()=>{
    const media=window.matchMedia('(pointer: coarse)');
    const check=()=>setTouch(media.matches||navigator.maxTouchPoints>0);
    const clear=()=>reset();
    window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);media.addEventListener('change',check);
    return()=>{window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);media.removeEventListener('change',check);callbacks.current.steer(0);callbacks.current.advance(0);};
  },[]);
  function move(e:PointerEvent<HTMLDivElement>){
    if(pointer.current!==e.pointerId)return;
    const r=e.currentTarget.getBoundingClientRect(),radius=r.width*.33;
    const x=(e.clientX-r.left-r.width/2)/radius,y=(e.clientY-r.top-r.height/2)/radius;
    const v=radialInput(x,-y);
    setKnob({x:v.x*radius,y:-v.y*radius});callbacks.current.steer(v.x);callbacks.current.advance(v.y);
  }
  return <div className="fixed inset-0 z-10 pointer-events-none" style={{paddingTop:'env(safe-area-inset-top)'}}>
    <div className="absolute flex items-start justify-between gap-2" style={{top:'max(12px, env(safe-area-inset-top))',left:'max(12px, env(safe-area-inset-left))',right:'max(12px, env(safe-area-inset-right))'}}>
      <button type="button" onClick={p.onOpenMap} aria-label="Explore map" className="pointer-events-auto flex min-h-11 max-w-[65%] items-center gap-2 rounded-xl bg-slate-950/75 border border-white/20 px-3 py-2 text-left text-white">
        <Map size={20} className="shrink-0 text-teal-200"/><div className="min-w-0"><div className="text-xs font-semibold truncate">{hud.insideShop?'The Black Sheep Shop':hud.nearSettlement}</div>{!hud.insideShop&&!hud.cleanExploreMode&&hud.nearLandmark&&<div className="text-[10px] text-teal-200 truncate">{hud.nearLandmark}</div>}</div>
      </button>
      <div className="flex gap-2"><button type="button" aria-label="Explore options" aria-expanded={menu} className={button} onClick={()=>setMenu(v=>!v)}>{menu?<X size={18}/>:<Menu size={20}/>}</button><button type="button" aria-label="Pause" className={button} onClick={p.onPause}><Pause size={20}/></button></div>
    </div>
    {menu&&<div className="pointer-events-auto absolute right-3 top-16 flex flex-col gap-1 rounded-xl border border-white/20 bg-slate-950/95 p-2 text-sm text-white shadow-lg">
      <button type="button" className="flex items-center gap-2 rounded-lg p-3" onClick={()=>{p.onToggleExploreView();setMenu(false)}}><Eye size={18}/>{hud.cameraViewMode==='first_person'?'Third person':'First person'}</button>
      <button type="button" className="flex items-center gap-2 rounded-lg p-3" onClick={p.onToggleExploreLabels}>{hud.cleanExploreMode?<EyeOff size={18}/>:<Eye size={18}/>} Place names {hud.cleanExploreMode?'off':'on'}</button>
      <button type="button" className="flex items-center gap-2 rounded-lg p-3" onClick={p.onToggleMute}>{p.muted?<VolumeX size={18}/>:<Volume2 size={18}/>} {p.muted?'Unmute':'Mute'}</button>
      <button type="button" className="flex items-center gap-2 rounded-lg p-3" onClick={p.onOpenPhotoMode}><Camera size={18}/>Photo mode</button>
      <button type="button" className="flex items-center gap-2 rounded-lg p-3" onClick={p.onRestart}><Mountain size={18}/>Return to start</button>
    </div>}
    {hud.actionCallout&&<div className="absolute top-20 left-1/2 -translate-x-1/2 rounded-lg bg-slate-950/75 px-3 py-2 text-xs text-white">{hud.actionCallout}</div>}
    <div className="absolute flex items-end justify-between gap-2" style={{left:'max(14px, env(safe-area-inset-left))',right:'max(14px, env(safe-area-inset-right))',bottom:'max(16px, env(safe-area-inset-bottom))'}}>
      {touch?<div className="pointer-events-auto relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border-2 border-white/25 bg-slate-950/40 select-none touch-none" role="group" aria-label="Move in any direction"
        onPointerDown={e=>{if(pointer.current!==null)return;e.preventDefault();pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);move(e)}}
        onPointerMove={move} onPointerUp={e=>{if(pointer.current===e.pointerId)reset()}} onPointerCancel={e=>{if(pointer.current===e.pointerId)reset()}} onLostPointerCapture={e=>{if(pointer.current===e.pointerId)reset()}}>
        <div className="pointer-events-none h-12 w-12 rounded-full border-2 border-white/80 bg-white/50 shadow-md" style={{transform:'translate('+knob.x+'px,'+knob.y+'px)'}}/>
      </div>:<div className="rounded-lg bg-slate-950/65 px-3 py-2 text-xs text-white">WASD / arrows · drag to look · Space jump · E interact</div>}
      <div className="flex flex-col items-end gap-3">
        {(hud.canEnterShop||hud.insideShop)&&<button type="button" onClick={p.onShopDoor} className="pointer-events-auto rounded-xl bg-teal-200 px-4 py-3 text-xs font-bold text-slate-950">{hud.insideShop?'Leave shop':'Enter shop'}</button>}
        {touch&&!hud.insideShop&&<div className="flex items-end gap-3">
          <button type="button" onClick={p.onToggleExplorePace} aria-pressed={!hud.exploreWalkPace} className={button+' flex-col h-14 w-14 gap-0.5'}><Footprints size={20}/><span className="text-[10px]">{hud.exploreWalkPace?'Run':'Walk'}</span></button>
          <button type="button" aria-label="Jump" className={button+' rounded-full h-16 w-16'} onPointerDown={e=>{e.preventDefault();p.onTouchJump()}} onClick={e=>{if(e.detail===0)p.onTouchJump()}}><ArrowUp size={25}/></button>
        </div>}
      </div>
    </div>
  </div>;
}
