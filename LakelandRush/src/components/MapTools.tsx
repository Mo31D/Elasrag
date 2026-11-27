import {useState,useRef,useEffect,type ReactNode,type PointerEvent} from 'react';
import {Plus,Minus,LocateFixed,MapPin as Pin,Navigation} from 'lucide-react';
import {mapDistance,type MapTarget} from '../geo/mapTravel';
export type MapBox=[number,number,number,number];
export type MapActionsProps={onTravel:(target:MapTarget)=>void;onWaypoint:(target:MapTarget|null)=>void;waypoint:MapTarget|null;player?:{x:number;z:number};busy:boolean};
const button='flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-slate-900 text-white';
export function MapViewport({box,label,children,metersPerUnit=1}:{box:MapBox;label:string;children:ReactNode;metersPerUnit?:number}){
 const [view,setView]=useState<MapBox>(box),drag=useRef<{id:number;x:number;y:number;view:MapBox;scale:number}|null>(null);
 const ref=useRef<SVGSVGElement>(null);
 useEffect(()=>{setView(box);drag.current=null;},[box.join(',')]);
 function zoom(f:number){setView(v=>{const w=Math.max(box[2]/16,Math.min(box[2],v[2]*f)),h=w*box[3]/box[2];return [v[0]+(v[2]-w)/2,v[1]+(v[3]-h)/2,w,h];});}
 function down(e:PointerEvent<SVGSVGElement>){if(e.button!==0||(e.target instanceof Element&&e.target.closest('[data-map-pin]'))||drag.current)return;const r=e.currentTarget.getBoundingClientRect();drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,view,scale:Math.min(r.width/view[2],r.height/view[3])};e.currentTarget.setPointerCapture(e.pointerId);}
 function move(e:PointerEvent<SVGSVGElement>){const d=drag.current;if(!d||d.id!==e.pointerId||!d.scale)return;setView([Math.max(box[0]-d.view[2]*.4,Math.min(box[0]+box[2]-d.view[2]*.6,d.view[0]-(e.clientX-d.x)/d.scale)),Math.max(box[1]-d.view[3]*.4,Math.min(box[1]+box[3]-d.view[3]*.6,d.view[1]-(e.clientY-d.y)/d.scale)),d.view[2],d.view[3]]);}
 const end=(e:PointerEvent<SVGSVGElement>)=>{if(drag.current?.id===e.pointerId)drag.current=null;};
 const scaleM=view[2]*metersPerUnit*.2;
 return <div className="relative min-w-0 rounded-xl bg-slate-950 border border-white/10 overflow-hidden">
 <svg ref={ref} aria-label={label} viewBox={view.join(' ')} className="block w-full h-[40dvh] min-h-[225px] max-h-[490px] touch-none select-none" onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>{children}</svg>
 <div className="absolute top-2 right-2 flex flex-col gap-1"><button type="button" aria-label="Zoom map in" className={button} onClick={()=>zoom(.65)}><Plus size={17}/></button><button type="button" aria-label="Zoom map out" className={button} onClick={()=>zoom(1/.65)}><Minus size={17}/></button><button type="button" aria-label="Reset map view" className={button} onClick={()=>setView(box)}><LocateFixed size={16}/></button></div>
 <div className="pointer-events-none absolute left-2 top-2 rounded bg-slate-950/80 p-1 text-center text-[10px] text-slate-100">N<br/>↑</div>
 <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] text-slate-300 bg-slate-950/80 px-2 py-1 rounded">Map width ≈ {scaleM*5>=1000?(scaleM*5/1000).toFixed(1)+' km':Math.round(scaleM*5)+' m'}</div>
 </div>;
}
export function MapMarker({x,y,name,color='#f8fafc',selected=false,onSelect,r=8}:{x:number;y:number;name:string;color?:string;selected?:boolean;onSelect:()=>void;r?:number}){
 return <g data-map-pin="true" role="button" tabIndex={0} aria-label={name} aria-pressed={selected} className="cursor-pointer" onClick={onSelect} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect();}}}><title>{name}</title><circle cx={x} cy={y} r={r} fill={selected?'#fbbf24':color} stroke="#020617" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/><circle cx={x} cy={y} r={r} fill="transparent" stroke="transparent" strokeWidth="24" vectorEffect="non-scaling-stroke"/></g>;
}
export function DestinationActions({target,onTravel,onWaypoint,waypoint,player,busy}:MapActionsProps&{target:MapTarget|null}){
 if(!target)return <p className="text-xs text-slate-400 p-2">Tap a map marker or select a place below. Drag the map to pan; use + and − to zoom.</p>;
 const marked=waypoint?.id===target.id;
 return <div className="rounded-xl border border-white/15 bg-slate-900 p-3 space-y-2"><div className="flex items-center gap-2"><Pin size={17} className="text-amber-300 shrink-0"/><strong className="text-sm text-white">{target.name}</strong>{player&&<span className="ml-auto text-xs text-slate-300 shrink-0">{mapDistance(player,target)} direct</span>}</div><div className="grid grid-cols-2 gap-2"><button type="button" disabled={busy} onClick={()=>onTravel(target)} className="rounded-lg bg-amber-400 disabled:opacity-50 px-2 py-2.5 text-sm font-bold text-slate-950">{busy?'Checking arrival…':'Fast travel'}</button><button type="button" onClick={()=>onWaypoint(marked?null:target)} className="flex items-center justify-center gap-1 rounded-lg border border-cyan-400/40 px-2 py-2.5 text-xs text-cyan-200"><Navigation size={15}/>{marked?'Clear waypoint':'Set waypoint'}</button></div><p className="text-[11px] text-slate-400">Fast travel uses a nearby mapped arrival, not an exact entrance. Waypoint is a direct bearing, not turn-by-turn routing.</p></div>;
}
