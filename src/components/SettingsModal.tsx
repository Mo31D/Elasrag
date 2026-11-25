import React from 'react';
import { X } from 'lucide-react';
import type { GameSettings, GraphicsPreset, TouchControlMode, WeatherPreset } from '../types/game';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdate: (next: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdate,
  onClose,
}) => {
  const update = <K extends keyof GameSettings>(key: K, val: GameSettings[K]) => {
    onUpdate({ ...settings, [key]: val });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="w-full max-w-lg max-h-[88vh] rounded-2xl bg-slate-950 border border-white/15 flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 id="settings-title" className="font-display text-xl font-bold text-white">
            Settings &amp; Attribution
          </h2>
          <button
            type="button"
            aria-label="Close Settings"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-5 text-sm">
          {/* Graphics Quality */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Graphics Quality
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['auto', 'low', 'medium', 'high', 'ultra'] as GraphicsPreset[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update('graphics', g)}
                  className={`py-2 rounded-lg text-xs font-medium capitalize cursor-pointer ${
                    settings.graphics === g
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Weather & Atmosphere */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Atmosphere &amp; Time of Day
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  ['clear', 'Clear'],
                  ['cloudy', 'Overcast'],
                  ['mist', 'Fell Mist'],
                  ['rain', 'Lake Rain'],
                  ['sunset', 'Sunset'],
                  ['night', 'Night'],
                ] as Array<[WeatherPreset, string]>
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => update('weather', id)}
                  className={`py-2 rounded-lg text-xs font-medium cursor-pointer ${
                    settings.weather === id
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Audio Mix
              </span>
              <button
                type="button"
                onClick={() => update('muted', !settings.muted)}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-200 cursor-pointer"
              >
                {settings.muted ? 'Muted' : 'Sound Active'}
              </button>
            </div>
            {(
              [
                ['masterVolume', 'Master Volume'],
                ['musicVolume', 'Music'],
                ['sfxVolume', 'Sound Effects'],
                ['ambienceVolume', 'Wind & Lake Ambience'],
              ] as const
            ).map(([field, label]) => (
              <div key={field} className="flex items-center justify-between gap-4">
                <label htmlFor={`slider-${field}`} className="text-slate-300 text-xs w-36 shrink-0">
                  {label}
                </label>
                <input
                  id={`slider-${field}`}
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings[field]}
                  onChange={(e) => update(field, parseFloat(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="font-mono-num text-xs text-slate-400 w-9 text-right">
                  {Math.round(settings[field] * 100)}%
                </span>
              </div>
            ))}
          </div>

          {/* Controls & Assist */}
          <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="slider-sensitivity" className="text-slate-300 text-xs w-36 shrink-0">
                Steering Sensitivity
              </label>
              <input
                id="slider-sensitivity"
                type="range"
                min={0.6}
                max={1.6}
                step={0.1}
                value={settings.sensitivity}
                onChange={(e) => update('sensitivity', parseFloat(e.target.value))}
                className="flex-1 accent-amber-500"
              />
              <span className="font-mono-num text-xs text-slate-400 w-9 text-right">
                {settings.sensitivity.toFixed(1)}x
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300 text-xs">Mobile Touch Style</span>
              <div className="flex gap-1.5">
                {(['buttons', 'joystick'] as TouchControlMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => update('touchMode', mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer ${
                      settings.touchMode === mode
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300 text-xs">Auto-Pilot Assist</span>
              <button
                type="button"
                onClick={() => update('autoPilot', !settings.autoPilot)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  settings.autoPilot ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {settings.autoPilot ? 'Enabled' : 'Off'}
              </button>
            </div>
          </div>

          {/* Geographic Attribution */}
          <div className="pt-3 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
            Geographic data © OpenStreetMap contributors (ODbL). Terrain elevations derived from
            Copernicus EU-DEM 25m via OpenTopoData. Sparse rural areas outside surveyed village tiles
            use deterministic procedural dry-stone walls and woodland copses.
          </div>
        </div>
      </div>
    </div>
  );
};
