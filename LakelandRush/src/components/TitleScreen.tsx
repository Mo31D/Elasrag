import React from 'react';
import { Compass, Map as MapIcon, Play, Settings, Trophy } from 'lucide-react';
import type { RouteDefinition, SaveData, WeatherPreset } from '../types/game';

interface TitleScreenProps {
  routes: RouteDefinition[];
  selectedRouteId: string;
  onSelectRoute: (route: RouteDefinition) => void;
  onStartRun: () => void;
  onOpenMap: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  weather: WeatherPreset;
  onChangeWeather: (w: WeatherPreset) => void;
  saveData: SaveData;
  isReady: boolean;
}

const WEATHER_OPTIONS: Array<{ id: WeatherPreset; label: string }> = [
  { id: 'clear', label: 'Clear' },
  { id: 'cloudy', label: 'Overcast' },
  { id: 'mist', label: 'Fell Mist' },
  { id: 'rain', label: 'Lake Rain' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'night', label: 'Night' },
];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onStartRun,
  onOpenMap,
  onOpenSettings,
  onOpenTutorial,
  weather,
  onChangeWeather,
  saveData,
  isReady,
}) => {
  const selectedRoute = routes.find((r) => r.id === selectedRouteId) ?? routes[0];
  const rec = saveData.records[selectedRoute.id];

  return (
    <div data-testid="title-scroll" className="fixed inset-0 z-20 flex flex-col gap-5 overflow-y-auto overscroll-contain touch-pan-y p-4 sm:p-6 md:p-8 pointer-events-auto bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/20">
      {/* Top Header Row: Bespoke SVG Crest + Utility Buttons */}
      <div className="flex flex-wrap shrink-0 items-start justify-between gap-4 pointer-events-auto">
        <div className="flex items-center gap-3.5">
          <svg
            viewBox="0 0 56 56"
            className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 drop-shadow-lg"
            aria-hidden="true"
          >
            <rect width="56" height="56" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            <path d="M8 38 L21 16 L31 30 L38 20 L48 38 Z" fill="#334155" />
            <path d="M8 38 L21 16 L27 25 L19 38 Z" fill="#475569" />
            <path d="M18 14 L21 10 L24 14" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M10 43 Q20 39 28 43 T46 43" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
              LAKELAND RUSH
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
              Windermere &amp; Lake District National Park · 18 km Real-World Parkour
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMap}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-sm font-medium text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MapIcon className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Windermere Map</span>
            <span className="sm:hidden">Map</span>
          </button>
          <button
            type="button"
            onClick={onOpenTutorial}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-sm font-medium text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open Settings"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-sm font-medium text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Left-Anchored Selection Panel */}
      <div className="my-auto shrink-0 max-w-2xl w-full pointer-events-auto flex flex-col gap-4">
        {/* Route Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1">
          {routes.map((route) => {
            const active = route.id === selectedRoute.id;
            const rRec = saveData.records[route.id];
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => onSelectRoute(route)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  active
                    ? 'bg-slate-900/95 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/80 border-white/12 hover:border-white/30 hover:bg-slate-900/85'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-sm sm:text-base text-white truncate">
                    {route.title}
                  </span>
                  {rRec && rRec.medal !== 'None' && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 shrink-0">
                      <Trophy className="w-3.5 h-3.5" />
                      {rRec.medal}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{route.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    {route.mode === 'freeroam' ? '18 km Basin' : `${(route.lengthMeters / 1000).toFixed(2)} km`}
                  </span>
                  {rRec && rRec.bestScore > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num text-slate-300">Best {rRec.bestScore.toLocaleString()}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Route Brief + Weather Strip + Primary CTA */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-white/15 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                {selectedRoute.title}
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedRoute.subtitle}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>Start: {selectedRoute.startName}</span>
                <span aria-hidden="true">·</span>
                <span>Finish: {selectedRoute.finishName}</span>
                {rec && rec.topSpeedKmh > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num text-amber-300">Top {rec.topSpeedKmh} km/h</span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              data-start="true"
              disabled={!isReady}
              onClick={onStartRun}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-display font-extrabold text-base tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isReady ? (selectedRoute.mode==='freeroam'?'Explore freely':'Start race') : 'Loading Terrain...'}</span>
            </button>
          </div>

          {/* Weather & Time-of-Day Selector */}
          <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
            {WEATHER_OPTIONS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => onChangeWeather(w.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  weather === w.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Safe-Margin Control Hint */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 text-xs text-slate-300/90 pointer-events-none">
        <span>A / D Steer · Space / W Jump &amp; Vault · S Slide · Esc Pause · M Mute</span>
        <span>Map data © OpenStreetMap contributors · EU-DEM 25m</span>
      </div>
    </div>
  );
};
