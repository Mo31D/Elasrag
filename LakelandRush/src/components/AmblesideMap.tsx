import { useState } from 'react';
import type { LakeData } from '../types/game';
import navigation from '../data/ambleside-navigation.json';
import { TRANSIT } from '../data/transit';
import {fromStop,type MapTarget} from '../geo/mapTravel';
import {MapViewport,MapMarker,DestinationActions,type MapActionsProps} from './MapTools';

export type ExploreStop = (typeof navigation.stops)[number];

export function AmblesideMap({ lake,onStartShopRoute,...actions }: MapActionsProps&{lake:LakeData|null;onStartShopRoute:()=>void}) {
  const {player,waypoint}=actions;
  const [selected, select] = useState<MapTarget>(fromStop(navigation.stops[0]));
  const [showLabels, setShowLabels] = useState(true);
  const [approach, setApproach] = useState('all');
  return (
    <div className="grid min-h-0 flex-1 gap-3 overflow-auto p-3 md:grid-cols-2">
      <div className="min-w-0 rounded-xl bg-slate-900 p-2">
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          <label className="flex items-center gap-2 text-slate-100">
            <input type="checkbox" checked={showLabels} onChange={event => setShowLabels(event.currentTarget.checked)} />
            Labels
          </label>
          <select value={approach} onChange={event => setApproach(event.currentTarget.value)}
            aria-label="Highlight approach" className="rounded bg-slate-950 p-2 text-white">
            <option value="all">All approaches</option>
            {navigation.approaches.map(route => <option key={route.id} value={route.id}>{route.name}</option>)}
          </select>
        </div>
        <MapViewport box={[-600,-2000,1250,2100]} label="Ambleside and Waterhead approaches">
          {lake?.outerRings.map((ring, index) => <polygon key={index} fill="#0c3545"
            points={ring.map(point => point.join(',')).join(' ')} />)}
          {navigation.approaches.filter(route => approach === 'all' || approach === route.id).map(route => (
            <polyline key={route.id} fill="none" stroke={route.id === 'east' ? '#fbbf24' : route.id === 'west' ? '#38bdf8' : route.id === 'shop-link' ? '#f472b6' : '#86efac'}
              strokeWidth="9" points={route.points.map(point => point.join(',')).join(' ')} />
          ))}
          {navigation.stops.map(stop => <g key={stop.id}>
            <MapMarker x={stop.point[0]} y={stop.point[1]} name={stop.name} r={selected.id===stop.id?18:12} selected={selected.id===stop.id} onSelect={()=>select(fromStop(stop))}/>
            {showLabels && ['bridge-house', 'black-sheep', 'borrans', 'waterhead', 'rothay-park'].includes(stop.id) && (
              <text pointerEvents="none" x={stop.point[0] + 20} y={stop.point[1] + 8} fill="#e2e8f0" fontSize="25">{stop.name}</text>
            )}

          </g>)}
          {TRANSIT.filter(t => t.mode === 'bus' && t.x>=-510 && t.x<=400 && t.z>=-1880 && t.z<=-140).map(t => <g key={t.id}>
            <MapMarker x={t.x} y={t.z} name={t.name} color="#60a5fa" r={9} selected={selected.id===t.id} onSelect={()=>select({id:t.id,name:t.name,x:t.x,z:t.z,kind:t.mode})}/>
          </g>)}
          {player && <circle cx={player.x} cy={player.z} r="11" fill="#f472b6" stroke="#fff" strokeWidth="3"
            aria-label="Current position" pointerEvents="none" />}
          {waypoint&&<circle cx={waypoint.x} cy={waypoint.z} r="19" stroke="#22d3ee" strokeWidth="4" fill="none" pointerEvents="none"/>}
        </MapViewport>
      </div>
      <div>
        {approach === 'shop-link' && (
          <button type="button" className="mb-2 w-full rounded-lg bg-pink-300 p-3 font-bold text-slate-950"
            onClick={onStartShopRoute}>Start Lakeside Picnic to Black Sheep Shop</button>
        )}
        <DestinationActions {...actions} target={selected}/>
        <details className="mb-2 rounded-lg border border-blue-400/30 p-2 text-xs text-slate-200"><summary className="cursor-pointer">Bus stops (blue markers)</summary><ul className="mt-2 space-y-1">{TRANSIT.filter(t=>t.mode==='bus'&&t.x>=-510&&t.x<=400&&t.z>=-1880&&t.z<=-140).map(t=><li key={t.id}><button type="button" onClick={()=>select({id:t.id,name:t.name,x:t.x,z:t.z,kind:t.mode})}>{t.name}</button></li>)}</ul></details>
        <div className="grid grid-cols-2 gap-1.5">
          {navigation.stops.map(stop => <button key={stop.id} type="button" aria-pressed={selected.id === stop.id}
            onClick={() => select(fromStop(stop))} className="rounded-lg border border-white/15 bg-slate-900 p-2 text-left text-sm text-slate-100 aria-pressed:border-amber-400">
            {stop.name}
          </button>)}
        </div>
      </div>
    </div>
  );
}
