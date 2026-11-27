import React, { useEffect, useRef, useState } from 'react';
import { ExploreHUD } from './ExploreHUD';
import type { ExplorePace } from '../game/exploreControls';
import { Camera, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type {
  HudSnapshot,
  LakeData,
  RouteDefinition,
  TouchControlMode,
} from '../types/game';

export interface GameHUDProps {
  hud: HudSnapshot;
  route: RouteDefinition;
  lakeData: LakeData | null;
  muted: boolean;
  touchMode: TouchControlMode;
  onToggleMute: () => void;
  onPause: () => void;
  onOpenPhotoMode: () => void;
  onRestart: () => void;
  onTouchSteer: (val: number) => void;
  onTouchJump: () => void;
  onToggleFlight:()=>void;
  onFlightVertical:(value:number)=>void;
  onTouchSlide: () => void;
  onOpenMap: () => void;
  onTouchAdvance: (value: number) => void;
  onToggleExplorePace: () => void;
  onSetExplorePace:(pace:ExplorePace)=>void;
  onRecenterExploreCamera:()=>void;
  onToggleExploreView: () => void;
  onToggleExploreLabels: () => void;
  onShopDoor: () => void;
  onExploreHere: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = (props) => props.route.mode === 'freeroam' ? <ExploreHUD {...props}/> : <SprintHUD {...props}/>;

const SprintHUD: React.FC<GameHUDProps> = ({
  hud,
  route,
  lakeData,
  muted,
  touchMode,
  onToggleMute,
  onPause,
  onOpenPhotoMode,
  onRestart,
  onTouchSteer,
  onTouchJump,
  onTouchSlide,
  onOpenMap,
  onTouchAdvance,
  onToggleExplorePace,
  onToggleExploreView,
  onToggleExploreLabels,
  onShopDoor,
  onExploreHere,
}) => {
  const minimapRef = useRef<HTMLCanvasElement | null>(null);
  const [isTouchViewport, setIsTouchViewport] = useState(false);
  const joystickCenterRef = useRef<{ x: number; y: number } | null>(null);
  const [knobOffset, setKnobOffset] = useState(0);

  useEffect(() => {
    const checkTouch = () => {
      const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
      setIsTouchViewport(coarse || window.innerWidth < 960 || 'ontouchstart' in window);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Draw live geographic 2D minimap centered on player with real Windermere shoreline
  useEffect(() => {
    const canvas = minimapRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(0, 0, w, h);

    const scale = 0.11; // pixels per meter (~1,000m across minimap)
    const cx = w / 2;
    const cy = h / 2;
    const toScreen = (wx: number, wz: number): [number, number] => [
      cx + (wx - hud.playerX) * scale,
      cy + (wz - hud.playerZ) * scale,
    ];

    // Draw real Windermere Lake polygon
    if (lakeData) {
      ctx.fillStyle = 'rgba(14, 116, 144, 0.72)';
      for (const ring of lakeData.outerRings) {
        if (ring.length < 3) continue;
        ctx.beginPath();
        ring.forEach(([rx, rz], idx) => {
          const [sx, sy] = toScreen(rx, rz);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(51, 65, 85, 0.9)';
      for (const isl of lakeData.innerRings) {
        if (isl.length < 3) continue;
        ctx.beginPath();
        isl.forEach(([rx, rz], idx) => {
          const [sx, sy] = toScreen(rx, rz);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw active route spline
    if (route.waypoints.length >= 2) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      route.waypoints.forEach(([wx, wz], idx) => {
        const [sx, sy] = toScreen(wx, wz);
        if (idx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
    }

    // Player heading chevron at center
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-hud.playerHeading);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [hud.playerX, hud.playerZ, hud.playerHeading, lakeData, route.waypoints]);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 sm:p-5">
      {/* Top Perimeter Clusters */}
      <div className="flex items-start justify-between gap-3">
        {/* Top-Left Cluster: Score, Combo, Hearts & Progress */}
        <div className="flex flex-col gap-2 max-w-[260px] sm:max-w-xs">
          <div className="bg-slate-950/85 border border-white/15 rounded-xl px-3.5 py-2.5 shadow-lg">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Score
                </div>
                <div
                  data-testid="hud-score"
                  className="font-mono-num text-2xl sm:text-3xl font-bold text-white leading-tight hud-stroke"
                >
                  {hud.score.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-amber-300/90 font-semibold">
                  Combo
                </div>
                <div className="font-mono-num text-xl sm:text-2xl font-bold text-amber-400 leading-tight">
                  x{hud.combo}
                </div>
              </div>
            </div>

            {/* Combo decay bar */}
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-[width] duration-75"
                style={{ width: `${Math.round(hud.comboTimer * 100)}%` }}
              />
            </div>

            {/* Vitality Hearts + Tokens */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5" aria-label={`Momentum ${hud.hearts} of ${hud.maxHearts}`}>
                {Array.from({ length: hud.maxHearts }).map((_, idx) => {
                  const full = idx < hud.hearts;
                  return (
                    <svg key={idx} viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill={full ? '#f59e0b' : 'rgba(51,65,85,0.55)'}
                        stroke={full ? '#fef3c7' : '#475569'}
                        strokeWidth="1.5"
                      />
                    </svg>
                  );
                })}
              </div>
              <div className="text-xs font-mono-num text-slate-300">
                Cairns {hud.tokensCollected}/{hud.totalTokens}
              </div>
            </div>
          </div>

          {/* Route Progress & Current Settlement */}
          <div className="bg-slate-950/85 border border-white/15 rounded-xl px-3.5 py-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-200 font-medium gap-2">
              <span className="truncate">{hud.nearSettlement}</span>
              <span className="font-mono-num text-teal-300 shrink-0">
                {route.mode === 'sprint'
                  ? `${Math.round(hud.progress * 100)}%`
                  : `${(hud.distanceMeters / 1000).toFixed(2)} km`}
              </span>
            </div>
            {route.mode === 'sprint' && (
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-400 transition-[width] duration-100"
                  style={{ width: `${Math.round(hud.progress * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Top-Right Cluster: Speedometer, Utility Buttons & Live Minimap */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="bg-slate-950/85 border border-white/15 rounded-xl px-3 py-1.5 text-right shadow-lg">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Speed
              </div>
              <div className="font-mono-num text-xl sm:text-2xl font-bold text-white leading-tight">
                {hud.speedKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
              </div>
            </div>

            <button
              type="button"
              tabIndex={-1}
              aria-label={muted ? 'Unmute Audio [M]' : 'Mute Audio [M]'}
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleMute();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950/85 hover:bg-slate-800 border border-white/15 text-slate-100 cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Photo Mode"
              onClick={(e) => {
                e.currentTarget.blur();
                onOpenPhotoMode();
              }}
              className="w-10 h-10 hidden sm:flex items-center justify-center rounded-xl bg-slate-950/85 hover:bg-slate-800 border border-white/15 text-slate-100 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-300" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Restart Run [R]"
              onClick={(e) => {
                e.currentTarget.blur();
                onRestart();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950/85 hover:bg-slate-800 border border-white/15 text-slate-100 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Pause Game [P]"
              onClick={(e) => {
                e.currentTarget.blur();
                onPause();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950/85 hover:bg-slate-800 border border-white/15 text-slate-100 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:block rounded-xl overflow-hidden border border-white/20 shadow-lg">
            <canvas ref={minimapRef} width={116} height={116} className="block" />
          </div>
        </div>
      </div>

      {/* Dynamic Parkour Callout */}
      {hud.actionCallout && (
        <div className="self-center mb-auto mt-6 px-4 py-1.5 rounded-lg bg-slate-950/85 border border-amber-400/50 text-amber-300 font-display font-bold text-sm sm:text-base tracking-wide shadow-lg">
          {hud.actionCallout}
        </div>
      )}

      {route.mode === 'freeroam' && (
        <div className="pointer-events-auto mx-auto flex max-w-full flex-wrap justify-center gap-1 rounded-xl border border-white/15 bg-slate-950/90 p-1.5 text-xs text-white [&>button]:rounded-md [&>button]:px-2 [&>button]:py-2">
          <button type="button" onClick={onOpenMap}>Explore map</button>
          <button type="button" onClick={onToggleExplorePace} aria-pressed={!hud.exploreWalkPace}>
            {hud.exploreWalkPace ? 'Walk' : 'Sprint'}
          </button>
          <button type="button" onClick={onToggleExploreView} aria-pressed={hud.cameraViewMode === 'first_person'}>
            {hud.cameraViewMode === 'first_person' ? 'First person' : 'Third person'}
          </button>
          <button type="button" onClick={onToggleExploreLabels} aria-pressed={!hud.cleanExploreMode}>Labels</button>
          {(hud.canEnterShop || hud.insideShop) && <button type="button" onClick={onShopDoor} className="bg-amber-500 text-slate-950">
            {hud.insideShop ? 'Leave shop' : 'Enter Black Sheep Shop'}
          </button>}
          {hud.insideShop && <span className="px-2 py-2">Approximate interior</span>}
          {!hud.insideShop && !hud.cleanExploreMode && hud.nearLandmark && <span className="px-2 py-2 text-amber-200">{hud.nearLandmark}</span>}
        </div>
      )}

      <button type="button" onClick={onExploreHere} className="pointer-events-auto self-center rounded-xl bg-teal-200 px-4 py-2 text-xs font-bold text-slate-950">Leave race · Explore freely</button>
      {/* Mobile / Touch Controls */}
      {isTouchViewport && (
        <div className="flex items-end justify-between gap-4 pb-2 pointer-events-auto">
          {touchMode === 'joystick' ? (
            <div
              className="relative w-28 h-28 rounded-full bg-slate-950/70 border-2 border-white/25 flex items-center justify-center touch-none"
              onTouchStart={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                joystickCenterRef.current = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                };
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const center = joystickCenterRef.current;
                if (!touch || !center) return;
                const dx = Math.max(-42, Math.min(42, touch.clientX - center.x));
                setKnobOffset(dx);
                onTouchSteer(dx / 42);
              }}
              onTouchEnd={() => {
                setKnobOffset(0);
                onTouchSteer(0);
              }}
            >
              <div
                className="w-12 h-12 rounded-full bg-amber-400/90 border-2 border-white shadow-md"
                style={{ transform: `translateX(${knobOffset}px)` }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="Steer Left"
                onTouchStart={(e) => {
                  e.preventDefault();
                  onTouchSteer(-1);
                }}
                onTouchEnd={() => onTouchSteer(0)}
                onMouseDown={() => onTouchSteer(-1)}
                onMouseUp={() => onTouchSteer(0)}
                className="w-14 h-14 rounded-2xl bg-slate-950/80 active:bg-amber-500 active:text-slate-950 border border-white/20 text-white font-display font-bold text-xl flex items-center justify-center"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Steer Right"
                onTouchStart={(e) => {
                  e.preventDefault();
                  onTouchSteer(1);
                }}
                onTouchEnd={() => onTouchSteer(0)}
                onMouseDown={() => onTouchSteer(1)}
                onMouseUp={() => onTouchSteer(0)}
                className="w-14 h-14 rounded-2xl bg-slate-950/80 active:bg-amber-500 active:text-slate-950 border border-white/20 text-white font-display font-bold text-xl flex items-center justify-center"
              >
                →
              </button>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            {route.mode === 'freeroam' ? [-1, 1].map(direction => (
              <button key={direction} type="button" aria-label={direction === 1 ? 'Walk forward' : 'Walk backward'}
                className="h-14 touch-none rounded-2xl border border-white/20 bg-slate-950/90 px-4 font-bold text-white"
                onPointerDown={event => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  onTouchAdvance(direction);
                }}
                onLostPointerCapture={() => onTouchAdvance(0)}>
                {direction === 1 ? '↑' : '↓'}
              </button>
            )) : <>
            <button
              type="button"
              aria-label="Slide"
              onTouchStart={(e) => {
                e.preventDefault();
                onTouchSlide();
              }}
              onClick={onTouchSlide}
              className="h-14 px-4 rounded-2xl bg-slate-950/80 active:bg-teal-500 border border-white/20 text-white font-display font-bold text-sm"
            >
              Slide
            </button>
            <button
              type="button"
              aria-label="Jump and Vault"
              onTouchStart={(e) => {
                e.preventDefault();
                onTouchJump();
              }}
              onClick={onTouchJump}
              className="h-14 px-5 rounded-2xl bg-amber-500 active:bg-amber-400 text-slate-950 font-display font-extrabold text-sm shadow-lg"
            >
              Jump
            </button>
            </>}
          </div>
        </div>
      )}
    </div>
  );
};
