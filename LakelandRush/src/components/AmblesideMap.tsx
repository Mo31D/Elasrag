import { useState } from 'react';
import type { LakeData } from '../types/game';
import navigation from '../data/ambleside-navigation.json';

export type ExploreStop = (typeof navigation.stops)[number];

export function AmblesideMap({ lake, player, onTravel }: {
  lake: LakeData | null;
  player?: { x: number; z: number };
  onTravel: (stop: ExploreStop) => void;
}) {
  const [selected, select] = useState(navigation.stops[0]);
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
        <svg viewBox="-510 -1880 910 1740" className="mx-auto block max-h-[57dvh] w-full rounded-lg bg-slate-950"
          aria-label="Ambleside and Waterhead approaches">
          {lake?.outerRings.map((ring, index) => <polygon key={index} fill="#0c3545"
            points={ring.map(point => point.join(',')).join(' ')} />)}
          {navigation.approaches.filter(route => approach === 'all' || approach === route.id).map(route => (
            <polyline key={route.id} fill="none" stroke={route.id === 'east' ? '#fbbf24' : route.id === 'west' ? '#38bdf8' : '#86efac'}
              strokeWidth="9" points={route.points.map(point => point.join(',')).join(' ')} />
          ))}
          {navigation.stops.map(stop => <g key={stop.id}>
            <circle cx={stop.point[0]} cy={stop.point[1]} r={selected.id === stop.id ? 18 : 12}
              fill={selected.id === stop.id ? '#fbbf24' : '#f8fafc'} stroke="#0f172a" strokeWidth="4" />
            {showLabels && ['bridge-house', 'black-sheep', 'borrans', 'waterhead', 'rothay-park'].includes(stop.id) && (
              <text x={stop.point[0] + 20} y={stop.point[1] + 8} fill="#e2e8f0" fontSize="25">{stop.name}</text>
            )}
            <circle aria-label={stop.name} tabIndex={0} role="button" className="cursor-pointer" fill="transparent"
              r="27" cx={stop.point[0]} cy={stop.point[1]} onClick={() => select(stop)}
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') select(stop); }} />
          </g>)}
          {player && <circle cx={player.x} cy={player.z} r="11" fill="#f472b6" stroke="#fff" strokeWidth="3"
            aria-label="Current position" pointerEvents="none" />}
        </svg>
      </div>
      <div>
        <button type="button" onClick={() => onTravel(selected)}
          className="mb-2 w-full rounded-lg bg-amber-400 p-3 font-bold text-slate-950">
          Go to {selected.name}
        </button>
        <div className="grid grid-cols-2 gap-1.5">
          {navigation.stops.map(stop => <button key={stop.id} type="button" aria-pressed={selected.id === stop.id}
            onClick={() => select(stop)} className="rounded-lg border border-white/15 bg-slate-900 p-2 text-left text-sm text-slate-100 aria-pressed:border-amber-400">
            {stop.name}
          </button>)}
        </div>
      </div>
    </div>
  );
}
