import React from 'react';
import { Award, Home, RotateCcw } from 'lucide-react';
import type { RunResult } from '../types/game';

interface ResultsModalProps {
  result: RunResult;
  onPlayAgain: () => void;
  onReturnToTitle: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  onPlayAgain,
  onReturnToTitle,
}) => {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-heading"
        className="w-full max-w-md rounded-2xl bg-slate-950 border border-white/15 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-400">
              {result.routeTitle} · {result.reason}
            </div>
            <h2
              id="results-heading"
              className="mt-1 font-display text-3xl font-extrabold text-white"
            >
              {result.victory ? 'Stage Cleared' : 'Momentum Lost'}
            </h2>
          </div>
          {result.medal !== 'None' && (
            <div className="flex items-center gap-1.5 text-amber-400 font-display font-bold text-base shrink-0">
              <Award className="w-5 h-5" />
              <span>{result.medal}</span>
            </div>
          )}
        </div>

        {/* Summary Stat Tiles */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10">
            <div className="text-xs text-slate-400">Final Score</div>
            <div className="mt-0.5 font-mono-num text-2xl font-bold text-white">
              {result.score.toLocaleString()}
            </div>
            <div className="mt-0.5 text-xs text-amber-400">
              {result.isNewBest ? 'New Personal Best' : `Best: ${result.bestScore.toLocaleString()}`}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10">
            <div className="text-xs text-slate-400">Top Speed</div>
            <div className="mt-0.5 font-mono-num text-2xl font-bold text-teal-300">
              {result.topSpeedKmh} <span className="text-sm font-normal text-slate-400">km/h</span>
            </div>
            <div className="mt-0.5 text-xs text-slate-400">
              Max Combo x{result.maxCombo}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10">
            <div className="text-xs text-slate-400">Distance &amp; Time</div>
            <div className="mt-0.5 font-mono-num text-lg font-bold text-white">
              {result.distanceMeters.toLocaleString()} m
            </div>
            <div className="text-xs font-mono-num text-slate-400">{result.elapsedSec}s elapsed</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10">
            <div className="text-xs text-slate-400">Cairns Collected</div>
            <div className="mt-0.5 font-mono-num text-lg font-bold text-amber-300">
              {result.tokensCollected} / {result.totalTokens}
            </div>
            <div className="text-xs text-slate-400">OS Trig Beacons</div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-extrabold text-base cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Run Again</span>
          </button>

          <button
            type="button"
            onClick={onReturnToTitle}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-100 font-medium text-sm cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Routes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
