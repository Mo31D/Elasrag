import React from 'react';
import { X } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        className="w-full max-w-md rounded-2xl bg-slate-950 border border-white/15 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 id="guide-title" className="font-display text-xl font-bold text-white">
            How to Play Lakeland Rush
          </h2>
          <button
            type="button"
            aria-label="Close Guide"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
            <div className="font-semibold text-white">Free exploration</div>
            <p className="mt-1 text-xs text-slate-400">Touch anywhere in the lower-left movement zone to place the joystick, then drag to move. Drag elsewhere to look. Choose Walk (6 mph), Faster walk (10 mph) or Run (20 mph). Tap Jump twice before landing (Space twice on desktop) for up to twice the normal jump height; use the camera reset button to face forward. Tap the minimap to explore. On desktop use WASD, 1/2/3 for pace, C to recenter. No time limit or hearts.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
            <div className="font-semibold text-white">Race mode: Steer &amp; Weave</div>
            <p className="mt-0.5 text-xs text-slate-400">
              Use A / D or Left / Right arrows (or touch buttons / joystick) to carve along Lakeland
              roads and dodge left-hand-drive buses and Land Rovers.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
            <div className="font-semibold text-white">Jump, Vault &amp; Rail Grind</div>
            <p className="mt-0.5 text-xs text-slate-400">
              Press Space or W to vault over dry-stone walls, launch off timber ramps, and land on
              parapet rails or lakeside piers for high-speed Rail Grinds.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
            <div className="font-semibold text-white">Slide &amp; Build Flow Combos</div>
            <p className="mt-0.5 text-xs text-slate-400">
              Press S or Down Arrow to slide under hanging village signs. Chain Cairn Beacons, clean
              vaults, and near-misses to push your multiplier up to x10 and top 110 km/h.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
