import { useEffect,useMemo,useState } from 'react';
import type { LakeData,RegionManifest,WorldChunkData } from '../types/game';
import navigation from '../data/ambleside-navigation.json';
import inventory from '../data/ambleside-business-inventory.json';
import { TRANSIT } from '../data/transit';
import { AREAS,areaChunkKeys,inside,indexPlaces,CATEGORY_NAMES,type PlaceCategory,type PlaceEntry } from '../geo/placeIdentity';
import type { ExploreStop } from './AmblesideMap';
const palette:Record<PlaceCategory,string>={shop:'#a78bfa',hotel:'#f9a8d4',food:'#fbbf24',fuel:'#fb923c',supermarket:'#86efac',attraction:'#67e8f9',service:'#cbd5e1',rail:'#60a5fa',bus:'#60a5fa'};
const localCategory:Record<string,PlaceCategory>={shop:'shop',food:'supermarket',fuel:'fuel',parking:'service',park:'attraction',attraction:'attraction',landmark:'attraction'};
export function PlacesMap({manifest,lake,player,onTravel}:{manifest:RegionManifest|null;lake:LakeData|null;player?:{x:number;z:number};onTravel:(stop:ExploreStop)=>void}){
  const [areaId,setArea]=useState('ambleside');
  const [category,setCategory]=useState('all');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState('');
  const [loaded,setLoaded]=useState<{key:string;chunks:WorldChunkData[];missing:number}|null>(null);
  const area=AREAS.find(a=>a.id===areaId)??AREAS[0];
  const key=(manifest?.id??'')+':'+area.id;
  useEffect(()=>{
    if(!manifest)return;
    let current=true;
    const keys=areaChunkKeys(area,manifest.availableChunks,manifest.chunkSize);
    async function load(){
      const chunks:WorldChunkData[]=[];let missing=0;
      for(let i=0;i<keys.length;i+=5){
        const batch=await Promise.all(keys.slice(i,i+5).map(async k=>{
          try{const res=await fetch(import.meta.env.BASE_URL+'regions/'+manifest!.id+'/chunks/'+k+'.json');if(!res.ok)return null;return await res.json() as WorldChunkData;}catch{return null;}
        }));
        for(const chunk of batch){if(chunk)chunks.push(chunk);else missing++;}
        if(!current)return;
      }
      if(current)setLoaded({key,chunks,missing});
    }
    void load();
    return()=>{current=false;};
  },[manifest,area,key]);
  const chunks=useMemo(()=>loaded?.key===key?loaded.chunks:[],[loaded,key]);
  const places=useMemo(()=>{
    const entries=indexPlaces(area,chunks);
    if(area.id==='ambleside')for(const stop of navigation.stops){
      if(stop.kind==='junction')continue;
      const i=entries.findIndex(p=>p.name.toLowerCase()===stop.name.toLowerCase()&&Math.hypot(p.x-stop.point[0],p.z-stop.point[1])<60);
      if(i>=0)entries.splice(i,1);
      entries.push({id:'local-'+stop.id,name:stop.name,category:localCategory[stop.kind]||'service',x:stop.point[0],z:stop.point[1],source:'Existing mapped landmark / OSM '+stop.osmIds.join(', '),travelId:stop.id});
    }
    for(const t of TRANSIT)if(inside(area,t.x,t.z)){
      if(t.mode==='rail'&&entries.some(p=>p.category==='rail'&&Math.hypot(p.x-t.x,p.z-t.z)<100))continue;
      entries.push({id:'transit-'+t.id,name:t.name,category:t.mode,x:t.x,z:t.z,source:t.source});
    }
    if(area.id==='ambleside')for(const record of inventory.records){
      const p=record.position;
      if(!p||!inside(area,p.x,p.z))continue;
      const existing=entries.findIndex(e=>e.name.toLowerCase()===p.name.toLowerCase()&&Math.hypot(e.x-p.x,e.z-p.z)<45);
      const previous=existing>=0?entries.splice(existing,1)[0]:undefined;
      entries.push({id:record.id,name:record.name,category:record.mapCategory as PlaceCategory,x:p.x,z:p.z,source:p.source,travelId:previous?.travelId,buildingId:previous?.buildingId});
    }
    return entries.sort((a,b)=>a.name.localeCompare(b.name));
  },[chunks,area]);
  const q=query.trim().toLowerCase();
  const visible=places.filter(p=>(category==='all'||category===p.category)&&(!q||p.name.toLowerCase().includes(q)));
  const pending=area.id==='ambleside'?inventory.records.filter(r=>(!r.position||!inside(area,r.position.x,r.position.z))&&(category==='all'||category===r.mapCategory)&&(!q||[r.name,r.address,r.postcode].some(v=>v.toLowerCase().includes(q)))):[];
  const active:PlaceEntry|undefined=visible.find(p=>p.id===selected);
  const travel=active?.travelId?navigation.stops.find(s=>s.id===active.travelId):undefined;
  const roads=useMemo(()=>chunks.flatMap(c=>c.roads).filter(r=>['primary','secondary','lane','railway'].includes(r.kind)),[chunks]);
  const box=[area.minX,area.minZ,area.maxX-area.minX,area.maxZ-area.minZ].join(' ');
  const path=(pts:number[][])=>pts.map(p=>p.join(',')).join(' ');
  return <div className="min-h-0 flex-1 overflow-y-auto p-3">
    <div className="mb-3 flex flex-wrap gap-2">
      <select aria-label="Town" value={area.id} onChange={e=>{setArea(e.currentTarget.value);setSelected('')}} className="rounded bg-slate-800 p-2 text-sm text-white">{AREAS.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select>
      <select aria-label="Place category" value={category} onChange={e=>{setCategory(e.currentTarget.value);setSelected('')}} className="rounded bg-slate-800 p-2 text-sm text-white"><option value="all">All categories</option>{Object.entries(CATEGORY_NAMES).map(([k,n])=><option key={k} value={k}>{n}</option>)}</select>
      <input aria-label="Search real places" placeholder="Search places…" value={query} onChange={e=>{setQuery(e.currentTarget.value);setSelected('')}} className="min-w-32 flex-1 rounded bg-slate-800 p-2 text-sm text-white"/>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      <svg aria-label="Road and places map" viewBox={box} className="mx-auto block w-full max-h-[50dvh] rounded-lg bg-slate-950">
        {lake?.outerRings.map((ring,i)=><polygon key={i} fill="#123c50" points={path(ring)}/>)}
        {roads.map((r,i)=><polyline key={i} points={path(r.pts)} fill="none" stroke={r.kind==='railway'?'#cbd5e1':r.kind==='primary'?'#d9ab61':r.kind==='secondary'?'#8299ac':'#334155'} strokeWidth={r.kind==='primary'?9:r.kind==='railway'?5:4} strokeDasharray={r.kind==='railway'?'12 8':undefined}><title>{[r.name,r.ref].filter(Boolean).join(' · ')||r.kind}</title></polyline>)}
        {visible.map(p=><circle key={p.id} cx={p.x} cy={p.z} r={active?.id===p.id?13:6} fill={palette[p.category]} stroke="#0f172a" strokeWidth="2" onClick={()=>setSelected(p.id)} className="cursor-pointer"><title>{p.name}</title></circle>)}
        {player&&<circle cx={player.x} cy={player.z} r="11" fill="#f472b6" stroke="#fff" strokeWidth="3" pointerEvents="none"/>}
        {active&&<g pointerEvents="none"><circle cx={active.x} cy={active.z} r="16" fill="none" stroke="#fff" strokeWidth="3"/><text x={active.x} y={active.z-25} textAnchor="middle" fontSize="22" fill="#fff" paintOrder="stroke" stroke="#0f172a" strokeWidth="5">{active.name}</text></g>}
      </svg>
      <div>
        <p className="mb-2 text-xs text-slate-300">{loaded?.key!==key?'Loading mapped streets…':visible.length+' mapped places'} · Gold: main roads · Dashed: railway {loaded?.key===key&&loaded.missing>0?' · Some map tiles unavailable':''}</p>
        {active&&<div className="mb-2 rounded-lg border border-white/20 bg-slate-800 p-3"><strong className="text-white">{active.name}</strong><p className="text-xs text-slate-300">{CATEGORY_NAMES[active.category]} · {active.source.startsWith('http')?'Published transport record':'Mapped identity; appearance not surveyed'}</p>{travel&&<button type="button" className="mt-2 rounded bg-amber-400 p-2 text-slate-950" onClick={()=>onTravel(travel)}>Go to {travel.name}</button>}</div>}
        {area.id==='ambleside'&&<p className="mb-2 text-xs text-slate-300">Business inventory: {inventory.counts.total} records · {inventory.counts.mapped} matched to existing geographic features · {inventory.counts.unlocated} awaiting location verification. Not a live trading register.</p>}
        <div className="max-h-[38dvh] overflow-y-auto space-y-1">{visible.map(p=><button key={p.id} type="button" aria-pressed={active?.id===p.id} onClick={()=>setSelected(p.id)} className="flex w-full items-center gap-2 rounded border border-white/10 p-2 text-left text-sm text-slate-100 aria-pressed:border-amber-400"><span className="h-2 w-2 shrink-0 rounded-full" style={{background:palette[p.category]}}/>{p.name}<span className="ml-auto text-xs text-slate-400">{CATEGORY_NAMES[p.category]}</span></button>)}{!visible.length&&loaded?.key===key&&<p className="p-3 text-sm text-slate-300">No matching mapped places.</p>}{pending.length>0&&<div className="pt-3"><h3 className="mb-2 text-xs font-bold text-amber-300">Awaiting verified location ({pending.length})</h3>{pending.map(r=><div key={r.id} className="mb-1 rounded border border-white/10 p-2 text-sm text-slate-200"><div>{r.name}</div><div className="text-xs text-slate-400">{[r.address,r.postcode].filter(Boolean).join(', ')||'Address pending'} · Not placed on map</div></div>)}</div>}</div>
      </div>
    </div><p className="mt-2 text-xs text-slate-400">Map data © OpenStreetMap contributors. Existing geographic snapshot, not a live business or transport directory. No unsurveyed fast travel.</p>
  </div>;
}
