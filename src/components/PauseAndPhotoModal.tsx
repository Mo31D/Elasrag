import React, { useRef } from 'react';
import { Camera, Eye, EyeOff, Home, Play, RotateCcw, Settings } from 'lucide-react';
import type { PhotoPreset } from '../types/game';

interface PauseAndPhotoModalProps {
  isPhotoMode: boolean;
  photoPreset: PhotoPreset;
  onTogglePhotoMode: (enabled: boolean) => void;
  onSelectPhotoPreset: (preset: PhotoPreset) => void;
  onOrbitPhoto: (dx: number, dy: number, dz?: number) => void;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onReturnToTitle: () => void;
}

export const PauseAndPhotoModal: React.FC<PauseAndPhotoModalProps> = ({
  isPhotoMode,
  photoPreset,
  onTogglePhotoMode,
  onSelectPhotoPreset,
  onOrbitPhoto,
  onResume,
  onRestart,
  onOpenSettings,
  onReturnToTitle,
}) => {
  const [hidePhotoUi, setHidePhotoUi] = React.useState(false);
  const draggingRef = useRef<{ x: number; y: number } | null>(null);

  if (isPhotoMode) {
    return (
      <div
        className="fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          draggingRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          const dx = (e.clientX - draggingRef.current.x) * 0.008;
          const dy = (e.clientY - draggingRef.current.y) * 0.006;
          draggingRef.current = { x: e.clientX, y: e.clientY };
          onOrbitPhoto(-dx, dy);
        }}
        onPointerUp={() => {
          draggingRef.current = null;
        }}
        onWheel={(e) => {
          onOrbitPhoto(0, 0, e.deltaY * 0.0012);
        }}
      >
        <div className="flex items-center justify-between">
          {!hidePhotoUi ? (
            <div className="bg-slate-950/90 border border-white/15 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-200">
              Photo Mode · Drag to orbit · Scroll to zoom
            </div>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHidePhotoUi((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950/90 border border-white/15 text-xs font-medium text-white cursor-pointer"
            >
              {hidePhotoUi ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{hidePhotoUi ? 'Show UI' : 'Hide UI'}</span>
            </button>
            <button
              type="button"
              onClick={() => onTogglePhotoMode(false)}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              Exit Photo Mode
            </button>
          </div>
        </div>

        {!hidePhotoUi && (
          <div className="self-center flex items-center gap-2 bg-slate-950/90 border border-white/15 rounded-xl p-1.5">
            {(['runner', 'vista', 'lakeside'] as PhotoPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onSelectPhotoPreset(preset)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  photoPreset === preset
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {preset === 'vista' ? 'Fell Vista' : preset === 'lakeside' ? 'Lakeside' : 'Runner'}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/70">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
        className="w-full max-w-sm rounded-2xl bg-slate-950 border border-white/15 p-6 shadow-2xl"
      >
        <h2 id="pause-title" className="font-display text-2xl font-extrabold text-white">
          Run Paused
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Catch your breath on the Lakeland fells or frame a photo.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-base cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Run</span>
          </button>

          <button
            type="button"
            onClick={() => onTogglePhotoMode(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-100 font-medium text-sm cursor-pointer"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Photo Mode</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-100 font-medium text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-teal-400" />
            <span>Restart Route</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-100 font-medium text-sm cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={onReturnToTitle}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 font-medium text-sm cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
