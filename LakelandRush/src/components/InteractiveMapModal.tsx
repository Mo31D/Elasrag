import { LAKELAND_ROUTES } from '../data/routes';
import React from 'react';
import { TRANSIT } from '../data/transit';
import { PlacesMap } from './PlacesMap';
import { AmblesideMap } from './AmblesideMap';
import {MapViewport,MapMarker,DestinationActions,type MapActionsProps} from './MapTools';
import type {MapTarget} from '../geo/mapTravel';
import { Play, X } from 'lucide-react';
import type { LakeData, RegionManifest, RouteDefinition } from '../types/game';

interface InteractiveMapModalProps {
  manifest: RegionManifest | null;
  lakeData: LakeData | null;
  routes: RouteDefinition[];
  selectedRouteId: string;
  onSelectAndStart: (route: RouteDefinition) => void;
  onSelectRoute: (route: RouteDefinition) => void;
  onClose: () => void;
  player?: { x: number; z: number };
  onTravel: (target:MapTarget)=>void;
  onWaypoint:MapActionsProps['onWaypoint'];
  waypoint:MapTarget|null;
  busy:boolean;
  travelError:string;
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  manifest,
  lakeData,
  routes,
  selectedRouteId,
  onSelectAndStart,
  onSelectRoute,
  onClose,
  player,
  onTravel,onWaypoint,waypoint,busy,travelError,
}) => {
  const [regionTarget,setRegionTarget]=React.useState<MapTarget|null>(null);
  const actions={onTravel,onWaypoint,waypoint,player,busy};
  const [tab, setTab] = React.useState<'local'|'regional'|'places'>('local');
  // Windermere bounding box in world meters: X [-3200..4600], Z [-2200..17000]
  const minX = -3200;
  const maxX = 4800;
  const minZ = -2200;
  const maxZ = 17200;

  const vw = 440;
  const vh = 680;
  const pad = 24;
  const scale = Math.min((vw - pad * 2) / (maxX - minX), (vh - pad * 2) / (maxZ - minZ));
  const offsetX = (vw - (maxX - minX) * scale) / 2;
  const offsetY = (vh - (maxZ - minZ) * scale) / 2;

  const toSvg = (x: number, z: number): [number, number] => [
    offsetX + (x - minX) * scale,
    offsetY + (z - minZ) * scale,
  ];

  const ringToPath = (ring: Array<[number, number]>) =>
    ring
      .map(([x, z], idx) => {
        const [sx, sy] = toSvg(x, z);
        return `${idx === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
      })
      .join(' ') + ' Z';

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) ?? routes[0];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-modal-title"
        className="w-full max-w-4xl max-h-[94dvh] rounded-2xl bg-slate-950 border border-white/15 flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 id="map-modal-title" className="font-display text-xl font-bold text-white">
              Windermere Geographic Map
            </h2>
            <p className="text-xs text-slate-400">
              Explore the lake basin · Select a destination or set a waypoint
            </p>
          </div>
          <button
            type="button"
            aria-label="Close Map"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 shrink-0 gap-1 border-b border-white/10 p-2 text-xs sm:text-sm">
          <button type="button" aria-pressed={tab==='local'} onClick={() => setTab('local')}
            className="rounded-lg px-3 py-1 text-white aria-pressed:bg-slate-800">Ambleside & Waterhead</button>
          <button type="button" aria-pressed={tab==='regional'} onClick={() => setTab('regional')}
            className="rounded-lg px-3 py-1 text-white aria-pressed:bg-slate-800">Windermere basin</button>
          <button type="button" aria-pressed={tab==='places'} onClick={()=>setTab('places')} className="rounded-lg px-3 py-1 text-white aria-pressed:bg-slate-800">Places &amp; roads</button>
        </div>
        {travelError&&<p role="alert" className="shrink-0 p-2 text-xs bg-red-950 text-red-200">{travelError}</p>}
        {tab==='places' ? <PlacesMap manifest={manifest} lake={lakeData} {...actions}/> : tab==='local' ? <AmblesideMap lake={lakeData} {...actions}
          onStartShopRoute={() => {
            const route = LAKELAND_ROUTES.find(candidate => candidate.id === 'picnic_black_sheep');
            if (route) onSelectAndStart(route);
          }} /> : (
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          {/* Geographic SVG Lake & Settlement Map */}
          <div className="bg-slate-900/70 min-w-0 p-3 border-b md:border-b-0 md:border-r border-white/10">
            <MapViewport box={[0,0,vw,vh]} metersPerUnit={1/scale} label="Windermere basin destinations">
              {/* Windermere Lake Shoreline */}
              {lakeData?.outerRings.map((ring, idx) => (
                <path key={`lake-${idx}`} d={ringToPath(ring)} fill="#0e7490" fillOpacity={0.75} stroke="#38bdf8" strokeWidth={1.2} />
              ))}
              {/* Belle Isle & Islands */}
              {lakeData?.innerRings.map((ring, idx) => (
                <path key={`isl-${idx}`} d={ringToPath(ring)} fill="#334155" stroke="#94a3b8" strokeWidth={0.8} />
              ))}

              {/* Routes */}
              {routes
                .filter((r) => r.mode === 'sprint')
                .map((r) => {
                  const active = r.id === selectedRoute.id;
                  const pts = r.waypoints
                    .map(([wx, wz]) => {
                      const [sx, sy] = toSvg(wx, wz);
                      return `${sx.toFixed(1)},${sy.toFixed(1)}`;
                    })
                    .join(' ');
                  return (
                    <polyline
                      key={r.id}
                      points={pts}
                      fill="none"
                      stroke={active ? '#fbbf24' : '#cbd5e1'}
                      strokeWidth={active ? 4 : 2}
                      strokeOpacity={active ? 1 : 0.45}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="cursor-pointer"
                      onClick={() => onSelectRoute(r)}
                    />
                  );
                })}

              {TRANSIT.filter(t=>t.mode==='rail').map(t=>{
                const [x,y]=toSvg(t.x,t.z);
                return <g key={t.id}><title>{t.name}</title><MapMarker x={x} y={y} r={4} color="#60a5fa" name={t.name} selected={regionTarget?.id===t.id} onSelect={()=>setRegionTarget({id:t.id,name:t.name,x:t.x,z:t.z,kind:t.mode,regional:true})}/><text pointerEvents="none" x={x-6} y={y+13} textAnchor="end" fontSize="9" fill="#93c5fd">Windermere Railway Station</text></g>;
              })}
              {/* Real Settlements */}
              {manifest?.settlements.map((s) => {
                const [sx, sy] = toSvg(s.x, s.z);
                const placeLeft =
                  s.id === 'belle_isle' ||
                  s.id === 'far_sawrey' ||
                  s.id === 'near_sawrey' ||
                  s.id === 'wray_castle' ||
                  s.id === 'hawkshead' ||
                  s.id === 'claife_heights' ||
                  s.id === 'newby_bridge';
                const dy = s.id === 'belle_isle' ? -4 : s.id === 'waterhead' ? 9 : 3;
                return (
                  <g key={s.id}>
                    <MapMarker x={sx} y={sy} r={s.kind==='town'?4:3} name={s.name} selected={regionTarget?.id===s.id} onSelect={()=>setRegionTarget({id:s.id,name:s.name,x:s.x,z:s.z,kind:s.kind,regional:true,curatedId:s.id==='waterhead'?'waterhead':undefined})}/>
                    <text pointerEvents="none"
                      x={sx + (placeLeft ? -6 : 6)}
                      y={sy + dy}
                      textAnchor={placeLeft ? 'end' : 'start'}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}
              {player&&<circle cx={toSvg(player.x,player.z)[0]} cy={toSvg(player.x,player.z)[1]} r="4" fill="#f472b6" stroke="white" pointerEvents="none"/>}
              {waypoint&&<circle cx={toSvg(waypoint.x,waypoint.z)[0]} cy={toSvg(waypoint.x,waypoint.z)[1]} r="6" fill="none" stroke="#22d3ee" strokeWidth="2" pointerEvents="none"/>}
            </MapViewport>
            <div className="mt-2"><DestinationActions {...actions} target={regionTarget}/></div>
            <div className="mt-2 grid grid-cols-2 gap-1">{manifest?.settlements.map(s=><button key={s.id} type="button" className="rounded border border-white/10 p-2 text-xs text-white text-left" onClick={()=>setRegionTarget({id:s.id,name:s.name,x:s.x,z:s.z,kind:s.kind,regional:true,curatedId:s.id==='waterhead'?'waterhead':undefined})}>{s.name}</button>)}</div>
          </div>

          {/* Route List & Selected Details */}
          <div className="p-5 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              {routes.map((r) => {
                const active = r.id === selectedRoute.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectRoute(r)}
                    className={`text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 border-amber-400'
                        : 'bg-slate-900/40 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="font-display font-bold text-sm text-white">{r.title}</div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {r.startName} → {r.finishName} · {r.difficulty}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                16 Lake District settlements · Real OSM &amp; EU-DEM 25m topography
              </div>
              <button
                type="button"
                onClick={() => onSelectAndStart(selectedRoute)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Route</span>
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
