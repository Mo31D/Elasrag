import { useEffect, useMemo, useState } from 'react';
import { pointInRing } from '../geo/projection';
import { RegionManager } from '../geo/regionLoader';
import { bngToLatLon, bngToWorld, loadWorldCore, segmentDistance, worldToBng, type Point, type WorldCore } from '../geo/worldCore';
import type { BuildingFeature, RoadFeature } from '../types/game';
import navigation from '../data/ambleside-navigation.json';
import { InspectorScene } from './InspectorScene';

const bounds = { x: -690, z: -2210, w: 1540, h: 2290 };
const layers = ['roads','buildings','water','land','rail'] as const;
type Layer = typeof layers[number];
type View = 'source' | 'top' | 'angled';

export default function WorldInspector() {
  const [core, setCore] = useState<WorldCore>();
  const [region, setRegion] = useState<RegionManager>();
  const [buildings, setBuildings] = useState<BuildingFeature[]>([]);
  const [roads, setRoads] = useState<RoadFeature[]>([]);
  const [error, setError] = useState('');
  const [view, setView] = useState<View>('source');
  const [layer, setLayer] = useState<Record<Layer,boolean>>({roads:true,buildings:true,water:true,land:false,rail:false});
  const [overlay, setOverlay] = useState(false);
  const [route, setRoute] = useState('all');
  const [position, setPosition] = useState<Point>();
  const [measureFrom, setMeasureFrom] = useState<Point>();
  const [id, setId] = useState<string>();
  const [note, setNote] = useState('');
  useEffect(() => {
    let active = true;
    const gameRegion = new RegionManager();
    const keys = Array.from({length:4}, (_,i)=>i-2).flatMap(x =>
      Array.from({length:6},(_,i)=>[x,i-5] as const));
    Promise.all([loadWorldCore(), gameRegion.initialize().then(() =>
      Promise.all(keys.map(([x,z]) => gameRegion.ensureChunk(x,z))))])
      .then(([data,chunks]) => {
        if (!active) return;
        setCore(data); setRegion(gameRegion); setRoads(chunks.flatMap(chunk => chunk.roads));
        setBuildings(chunks.flatMap(chunk => chunk.buildings));
      }).catch(e => { if (active) setError(String(e)); });
    return () => { active = false; };
  }, []);
  const features = useMemo(() => core ? layers.flatMap(kind => core.layers[kind].map(id => {
    const way = core.ways[id];
    return { id, kind, way, points: way.nodeIds.map(node => bngToWorld(core, core.nodes[node])) };
  })) : [], [core]);
  const activeFeatures = features.filter(f => layer[f.kind]);
  const selected = features.find(f => f.id === id);
  const points = position && core ? worldToBng(core,position) : null;
  const gps = points && core ? bngToLatLon(core,points) : null;
  function inspect(point: Point) {
    setPosition(point);
    const candidates = activeFeatures.flatMap(f => {
      if (f.kind === 'buildings' && pointInRing(...point,f.points)) return [{id:f.id,d:-1}];
      const d = f.points.slice(1).reduce((best,next,i) => Math.min(best,segmentDistance(point,f.points[i],next)), 14);
      return d < 14 ? [{id:f.id,d}] : [];
    });
    candidates.sort((a,b)=>a.d-b.d);
    setId(candidates[0]?.id);
  }
  function exportFlag() {
    if (!position || !points || !note.trim()) return;
    const json = JSON.stringify({schemaVersion:1, status:'proposed', featureId:id ?? null,
      positionBng:points, issue:note.trim(), recordedAt:new Date().toISOString()},null,2);
    const url = URL.createObjectURL(new Blob([json],{type:'application/json'}));
    const link = document.createElement('a');
    link.href = url; link.download = 'lakeland-geographic-flag.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <main className="min-h-dvh overflow-auto bg-[#101c1b] px-4 py-5 text-[#f3f0e5] md:px-8" style={{height:'100dvh'}}>
    <header className="mx-auto mb-4 flex max-w-[1320px] flex-wrap items-center justify-between gap-2">
      <div><p className="text-sm text-[#b0d8c5]">Lakeland World V2 · Ambleside &amp; Waterhead</p>
      <h1 className="text-3xl font-semibold">Geographic inspection</h1></div>
      <a href={import.meta.env.BASE_URL} className="rounded-lg bg-[#e7c987] px-4 py-2 font-bold text-[#192420]">Open playable world</a>
    </header>
    {error && <p role="alert">{error}</p>}
    {!core && !error && <p role="status">Loading the source package and gameplay tiles…</p>}
    {core && <div className="mx-auto grid max-w-[1320px] gap-4 lg:grid-cols-[1fr_330px]">
      <section className="min-w-0 rounded-xl bg-[#182825] p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {([['source','Source map'],['top','Generated top-down'],['angled','Generated 3D']] as const).map(([key,label]) =>
            <button key={key} aria-pressed={view===key} className="rounded border border-[#6b8e7e] px-3 py-2 aria-pressed:bg-[#476552]" onClick={()=>setView(key)}>{label}</button>)}
        </div>
        {view === 'source' ? <svg aria-label="Geographic source map" className="h-[66dvh] min-h-[340px] w-full rounded bg-[#223530]"
          viewBox={`${bounds.x} ${bounds.z} ${bounds.w} ${bounds.h}`}
          onClick={event=>{
            const matrix = event.currentTarget.getScreenCTM();
            if (!matrix) return;
            const p = new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
            if (p.x >= bounds.x && p.x <= bounds.x+bounds.w && p.y >= bounds.z && p.y <= bounds.z+bounds.h) inspect([p.x,p.y]);
          }}>
          {activeFeatures.map(f => {
            const coords = f.points.map(p=>p.join(',')).join(' ');
            const color = f.id === id ? '#fff1a6' : f.kind==='roads' ? '#bba57d' : f.kind==='water' ? '#648b99' : '#75a08c';
            return f.way.geometry === 'Polygon'
              ? <polygon key={f.id} points={coords} fill={color} fillOpacity=".58" stroke={color} strokeWidth="1.5" />
              : <polyline key={f.id} points={coords} fill="none" stroke={color} strokeWidth={f.id===id?6:3} />;
          })}
          {overlay && roads.map((r,i)=><polyline key={`${r.id}-${i}`} points={r.pts.map(p=>p.join(',')).join(' ')}
            fill="none" stroke="#e19472" strokeWidth="1.7" opacity=".85" />)}
          {navigation.approaches.filter(path=>route===path.id).map(path=><polyline key={path.id}
            points={path.points.map(p=>p.join(',')).join(' ')} fill="none" stroke="#f1a9d2" strokeWidth="8" />)}
          {navigation.stops.map(stop=><g key={stop.id} role="button" tabIndex={0} aria-label={stop.name}
            onClick={event=>{event.stopPropagation(); inspect(stop.point as Point);}}
            onKeyDown={event=>{if(event.key==='Enter') inspect(stop.point as Point);}}>
            <circle cx={stop.point[0]} cy={stop.point[1]} r="9" fill="#e7c987"><title>{stop.name}</title></circle>
          </g>)}
          {position && <circle cx={position[0]} cy={position[1]} r="10" fill="#fff" pointerEvents="none" />}
          {position && measureFrom && <line x1={position[0]} y1={position[1]} x2={measureFrom[0]} y2={measureFrom[1]} stroke="#fff" strokeWidth="3" />}
        </svg> : region && <InspectorScene region={region} roads={roads} buildings={buildings} mode={view} position={position} onInspect={inspect} />}
        <p className="mt-2 text-sm text-[#c1d9ce]"><a href={core.source.url}>{core.source.attribution}</a> · {core.source.licence}</p>
      </section>
      <aside className="space-y-4 rounded-xl bg-[#182825] p-4">
        <fieldset className="flex flex-wrap gap-3"><legend className="mb-2 font-semibold">Source layers</legend>
          {layers.map(kind=><label className="capitalize" key={kind}>
            <input className="mr-1" type="checkbox" checked={layer[kind]} onChange={()=>setLayer({...layer,[kind]:!layer[kind]})} />{kind}</label>)}
          <label><input className="mr-1" type="checkbox" checked={overlay} onChange={event=>setOverlay(event.target.checked)} />Gameplay centrelines</label>
        </fieldset>
        <label className="block">Route overlay
          <select aria-label="Route overlay" value={route} onChange={event=>setRoute(event.target.value)} className="mt-1 w-full rounded border border-[#708e81] bg-[#1c3029] p-2">
            <option value="all">No route selected</option>
            {navigation.approaches.map(path=><option key={path.id} value={path.id}>{path.name}</option>)}
          </select>
        </label>
        <div className="border-t border-[#476454] pt-3">
          <h2 className="font-semibold">{selected?.way.tags.name ?? selected?.id ?? 'Point inspection'}</h2>
          {selected && <p className="text-sm">{selected.id} · {selected.kind} · OSM geometry</p>}
          {position && points && gps ? <dl className="mt-2 space-y-1 text-sm">
            <div><dt className="inline font-semibold">WGS84 </dt><dd className="inline">{gps.map(v=>v.toFixed(6)).join(', ')}</dd></div>
            <div><dt className="inline font-semibold">British National Grid </dt><dd className="inline">{points.map(v=>v.toFixed(2)).join(', ')} m</dd></div>
            <div><dt className="inline font-semibold">Gameplay X / Z </dt><dd className="inline">{position.map(v=>v.toFixed(2)).join(', ')} m</dd></div>
            <div><dt className="inline font-semibold">Gameplay terrain </dt><dd className="inline">{((region?.getTerrainHeight(...position) ?? 0)+39).toFixed(2)} m ODN</dd></div>
            <div><dt className="inline font-semibold">Browser projection sampled residual </dt><dd className="inline">{core.sampledTransformResidualM.toFixed(2)} m</dd></div>
          </dl> : <p className="text-sm">Select a road, building or position.</p>}
          <button disabled={!position} onClick={()=>setMeasureFrom(measureFrom ? undefined : position)}
            className="mt-2 rounded border border-[#6b8e7e] p-2 disabled:opacity-50">{measureFrom?'Clear ruler':'Set ruler start'}</button>
          {measureFrom && points && <output className="ml-2">{Math.hypot(...worldToBng(core,measureFrom).map((v,i)=>v-points[i])).toFixed(1)} m</output>}
        </div>
        <label className="block border-t border-[#476454] pt-3">Report a geographic issue
          <textarea value={note} onChange={event=>setNote(event.target.value)} className="mt-1 w-full rounded border border-[#6b8e7e] bg-[#1c3029] p-2" rows={3} />
        </label>
        <button disabled={!position || !note.trim()} onClick={exportFlag} className="rounded border border-[#6b8e7e] p-2 disabled:opacity-50">Download correction proposal</button>
        <div className="border-t border-[#476454] pt-3"><h2 className="font-semibold">Pilot businesses</h2>
          {core.entities.filter(e=>e.kind==='business').map(e=><p key={e.id}><a href={e.website}>{e.name}</a></p>)}
        </div>
      </aside>
    </div>}
  </main>;
}
