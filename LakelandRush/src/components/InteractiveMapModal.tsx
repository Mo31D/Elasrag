import { LAKELAND_ROUTES } from '../data/routes';
import React from 'react';
import { TRANSIT } from '../data/transit';
import { PlacesMap } from './PlacesMap';
import { AmblesideMap, type ExploreStop } from './AmblesideMap';
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
  onTravel: (stop: ExploreStop) => void;
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
  onTravel,
}) => {
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
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-slate-950 border border-white/15 flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 id="map-modal-title" className="font-display text-xl font-bold text-white">
              Windermere Geographic Map
            </h2>
            <p className="text-xs text-slate-400">
              18 km Lake District National Park basin · Click any route to preview or launch
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

        <div className="flex gap-2 border-b border-white/10 p-2">
          <button type="button" aria-pressed={tab==='local'} onClick={() => setTab('local')}
            className="rounded-lg px-3 py-1 text-white aria-pressed:bg-slate-800">Ambleside & Waterhead</button>
          <button type="button" aria-pressed={tab==='regional'} onClick={() => setTab('regional')}
            className="rounded-lg px-3 py-1 text-white aria-pressed:bg-slate-800">Windermere basin</button>
          <button type="button" aria-pressed={tab==='places'} onClick={()=>setTab('places')} className="rounded-lg px-3 py-1 text-white aria-pressed:bg-slate-800">Places &amp; roads</button>
        </div>
        {tab==='places' ? <PlacesMap manifest={manifest} lake={lakeData} player={player} onTravel={onTravel}/> : tab==='local' ? <AmblesideMap lake={lakeData} player={player} onTravel={onTravel}
          onStartShopRoute={() => {
            const route = LAKELAND_ROUTES.find(candidate => candidate.id === 'picnic_black_sheep');
            if (route) onSelectAndStart(route);
          }} /> : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          {/* Geographic SVG Lake & Settlement Map */}
          <div className="bg-slate-900/70 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10">
            <svg
              viewBox={`0 0 ${vw} ${vh}`}
              className="w-full max-w-[360px] h-auto max-h-[60vh] rounded-xl bg-slate-950 border border-white/10"
            >
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
                return <g key={t.id}><title>{t.name}</title><rect x={x-4} y={y-4} width="8" height="8" rx="2" fill="#60a5fa" stroke="#0f172a" /><text x={x-6} y={y+13} textAnchor="end" fontSize="9" fill="#93c5fd">Windermere Railway Station</text></g>;
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
                    <circle cx={sx} cy={sy} r={s.kind === 'town' ? 4 : 2.8} fill="#f8fafc" stroke="#0f172a" strokeWidth={1} />
                    <text
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
            </svg>
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
