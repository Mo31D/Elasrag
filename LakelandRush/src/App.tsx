/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ExploreStop } from './components/AmblesideMap';
import { GameHUD } from './components/GameHUD';
import { InteractiveMapModal } from './components/InteractiveMapModal';
import { PauseAndPhotoModal } from './components/PauseAndPhotoModal';
import { ResultsModal } from './components/ResultsModal';
import { SettingsModal } from './components/SettingsModal';
import { TitleScreen } from './components/TitleScreen';
import { TutorialModal } from './components/TutorialModal';
import { LAKELAND_ROUTES } from './data/routes';
import { LakelandEngine } from './engine/LakelandEngine';
import { commitRunToSaveData, loadSaveData, STORAGE_KEY } from './game/rules';
import type {
  GameSettings,
  GameState,
  HudSnapshot,
  PhotoPreset,
  RouteDefinition,
  RunResult,
  SaveData,
  WeatherPreset,
} from './types/game';

const SETTINGS_STORAGE_KEY = 'lakeland_rush_settings_v1';

const DEFAULT_SETTINGS: GameSettings = {
  weather: 'clear',
  graphics: 'auto',
  masterVolume: 0.75,
  musicVolume: 0.55,
  sfxVolume: 0.82,
  ambienceVolume: 0.6,
  muted: false,
  sensitivity: 1.0,
  touchMode: 'buttons',
  autoPilot: false,
};

function loadInitialSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<GameSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const INITIAL_HUD: HudSnapshot = {
  score: 0,
  combo: 1,
  comboTimer: 0,
  speedKmh: 34,
  hearts: 3,
  maxHearts: 3,
  progress: 0,
  distanceMeters: 0,
  elapsedSec: 0,
  tokensCollected: 0,
  totalTokens: 0,
  actionCallout: '',
  nearSettlement: 'Waterhead',
  playerX: 0,
  playerZ: 0,
  playerHeading: 0,
  fps: 60,
  isGrinding: false,
  isSliding: false,
  isAirborne: false,
};

export default function App() {
  const mapResume = useRef(false);
  const lookPointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<LakelandEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('title');
  const [isReady, setIsReady] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteDefinition>(LAKELAND_ROUTES.find(route=>route.mode==='freeroam')??LAKELAND_ROUTES[0]);
  const [settings, setSettings] = useState<GameSettings>(loadInitialSettings);
  const [saveData, setSaveData] = useState<SaveData>(() =>
    loadSaveData(typeof window !== 'undefined' ? window.localStorage : null),
  );
  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);
  const [lastResult, setLastResult] = useState<RunResult | null>(null);

  const [showMapModal, setShowMapModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [photoPreset, setPhotoPreset] = useState<PhotoPreset>('runner');

  // Keep body data-state synchronized for accessibility and test verification
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  const selectedRouteRef = useRef(selectedRoute);
  selectedRouteRef.current = selectedRoute;
  const saveDataRef = useRef(saveData);
  saveDataRef.current = saveData;
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const handleRunEnd = useCallback((result: RunResult) => {
    const nextSave = commitRunToSaveData(saveDataRef.current, result);
    setSaveData(nextSave);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSave));
    } catch {
      // ignore quota error
    }
    setLastResult(result);
    document.body.dataset.state = 'gameover';
    setGameState('gameover');
  }, []);

  // Initialize Three.js LakelandEngine once in an isolated canvas container
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const engine = new LakelandEngine(container, selectedRouteRef.current, settings, {
      onHudUpdate: (snapshot) => setHud(snapshot),
      onRunEnd: handleRunEnd,
      onReady: () => {
        setIsReady(true);
        const params = new URLSearchParams(window.location.search);
        if (params.get('autostart') === '1') {
          document.body.dataset.state = 'playing';
          setGameState('playing');
          engine.startRun(
            selectedRouteRef.current,
            saveDataRef.current.records[selectedRouteRef.current.id],
          );
        }
      },
      onError: (msg) => setEngineError(msg),
    });

    engineRef.current = engine;
    void engine.init();

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSettings = useCallback((next: GameSettings) => {
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage failure
    }
    engineRef.current?.setSettings(next);
  }, []);

  const handleSelectRoute = useCallback(
    (route: RouteDefinition) => {
      setSelectedRoute(route);
      engineRef.current?.selectRoute(route, saveDataRef.current.records[route.id]);
    },
    [],
  );

  const startRouteRun = useCallback(
    (route: RouteDefinition) => {
      if (!isReady || !engineRef.current) return;
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setShowMapModal(false);
      setShowSettingsModal(false);
      setShowTutorialModal(false);
      setIsPhotoMode(false);
      setLastResult(null);
      setSelectedRoute(route);
      document.body.dataset.state = 'playing';
      setGameState('playing');
      engineRef.current.startRun(route, saveDataRef.current.records[route.id]);
    },
    [isReady],
  );

  const handleStartCurrentRun = useCallback(() => {
    startRouteRun(selectedRouteRef.current);
  }, [startRouteRun]);

  const handlePause = useCallback((photo = false) => {
    if (gameStateRef.current !== 'playing') return;
    document.body.dataset.state = 'paused';
    setGameState('paused');
    setIsPhotoMode(photo);
    engineRef.current?.setGameState('paused');
    if (photo) {
      engineRef.current?.setPhotoModePreset('runner');
      setPhotoPreset('runner');
    }
  }, []);

  const handleResume = useCallback(() => {
    if (gameStateRef.current !== 'paused') return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsPhotoMode(false);
    document.body.dataset.state = 'playing';
    setGameState('playing');
    engineRef.current?.setGameState('playing');
  }, []);

  const travelToStop = useCallback((stop: ExploreStop) => {
    const explorer = LAKELAND_ROUTES.find(route => route.mode === 'freeroam');
    if (!explorer) return;
    const [x, z] = stop.spawn;
    const [targetX, targetZ] = stop.heading ?? stop.point;
    const heading: [number, number] = Math.hypot(targetX - x, targetZ - z) < .1
      ? [x, z - 8] : [targetX, targetZ];
    mapResume.current = false;
    startRouteRun({ ...explorer, startName: stop.name, waypoints: [[x, z], heading] });
  }, [startRouteRun]);

  const openTravelMap = () => {
    mapResume.current = gameState === 'playing';
    if (mapResume.current) handlePause();
    setShowMapModal(true);
  };

  const closeTravelMap = useCallback(() => {
    setShowMapModal(false);
    if (mapResume.current) handleResume();
    mapResume.current = false;
  }, [handleResume]);

  const handleReturnToTitle = useCallback(() => {
    setIsPhotoMode(false);
    setLastResult(null);
    document.body.dataset.state = 'title';
    setGameState('title');
    engineRef.current?.setGameState('title');
    engineRef.current?.selectRoute(
      selectedRouteRef.current,
      saveDataRef.current.records[selectedRouteRef.current.id],
    );
  }, []);

  const handleToggleMute = useCallback(() => {
    updateSettings({ ...settings, muted: !settings.muted });
  }, [settings, updateSettings]);

  const handleChangeWeather = useCallback(
    (weather: WeatherPreset) => {
      updateSettings({ ...settings, weather });
    },
    [settings, updateSettings],
  );

  // Global keyboard shortcuts (Title start, Pause, Restart, Mute)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const anyModal = showMapModal || showSettingsModal || showTutorialModal;
      if (anyModal) {
        if (e.code === 'Escape') {
          if (showMapModal) closeTravelMap();
          setShowSettingsModal(false);
          setShowTutorialModal(false);
        }
        return;
      }

      if (gameStateRef.current === 'title' && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        handleStartCurrentRun();
        return;
      }

      if (gameStateRef.current === 'playing') {
        if (e.code === 'Escape' || e.code === 'KeyP') {
          e.preventDefault();
          handlePause(false);
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          handleStartCurrentRun();
        } else if (e.code === 'KeyM') {
          e.preventDefault();
          handleToggleMute();
        }
      } else if (gameStateRef.current === 'paused') {
        if (e.code === 'Escape' || e.code === 'KeyP') {
          e.preventDefault();
          handleResume();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    closeTravelMap,
    handlePause,
    handleResume,
    handleStartCurrentRun,
    handleToggleMute,
    showMapModal,
    showSettingsModal,
    showTutorialModal,
  ]);

  useEffect(()=>{
    const clearLook=()=>{const pointer=lookPointer.current;lookPointer.current=null;const mount=mountRef.current;if(pointer&&mount?.hasPointerCapture(pointer.id))mount.releasePointerCapture(pointer.id);};
    if(gameState!=='playing'||showMapModal||showSettingsModal||showTutorialModal)clearLook();
    window.addEventListener('blur',clearLook);document.addEventListener('visibilitychange',clearLook);
    return()=>{window.removeEventListener('blur',clearLook);document.removeEventListener('visibilitychange',clearLook);};
  },[gameState,showMapModal,showSettingsModal,showTutorialModal]);
  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* Isolated WebGL Viewport */}
      <div
        ref={mountRef}
        data-testid="game-canvas-mount"
        className="fixed inset-0 h-full w-full touch-none"
        onPointerDown={event => {
          if (gameState !== 'playing' || showMapModal || showSettingsModal || showTutorialModal || selectedRoute.mode !== 'freeroam' || lookPointer.current || (event.pointerType==='mouse'&&event.button!==0)) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          lookPointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        }}
        onPointerMove={event => {
          const pointer = lookPointer.current;
          if (gameState !== 'playing' || showMapModal || showSettingsModal || showTutorialModal || pointer?.id !== event.pointerId) return;
          engineRef.current?.rotateExploreView(event.clientX - pointer.x, event.clientY - pointer.y);
          pointer.x = event.clientX;
          pointer.y = event.clientY;
        }}
        onPointerUp={event=>{if(lookPointer.current?.id===event.pointerId)lookPointer.current=null;}}
        onPointerCancel={event=>{if(lookPointer.current?.id===event.pointerId)lookPointer.current=null;}}
        onLostPointerCapture={event=>{if(lookPointer.current?.id===event.pointerId)lookPointer.current=null;}}
      />

      {/* Initial Terrain Loading Curtain */}
      {!isReady && !engineError && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6">
          <div className="font-display text-3xl font-extrabold tracking-tight text-white">
            LAKELAND RUSH
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Loading Windermere topography &amp; OpenStreetMap world chunks...
          </p>
        </div>
      )}

      {/* WebGL Error Fallback */}
      {engineError && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 text-center">
          <h1 className="font-display text-2xl font-bold text-rose-400">3D Engine Unavailable</h1>
          <p className="mt-2 max-w-md text-sm text-slate-300">{engineError}</p>
        </div>
      )}

      {/* Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          routes={LAKELAND_ROUTES}
          selectedRouteId={selectedRoute.id}
          onSelectRoute={handleSelectRoute}
          onStartRun={handleStartCurrentRun}
          onOpenMap={() => setShowMapModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenTutorial={() => setShowTutorialModal(true)}
          weather={settings.weather}
          onChangeWeather={handleChangeWeather}
          saveData={saveData}
          isReady={isReady}
        />
      )}

      {/* Active Gameplay HUD */}
      {gameState === 'playing' && (
        <GameHUD
          hud={hud}
          route={selectedRoute}
          lakeData={engineRef.current?.getLakeData() ?? null}
          muted={settings.muted}
          touchMode={settings.touchMode}
          onToggleMute={handleToggleMute}
          onPause={() => handlePause(false)}
          onOpenPhotoMode={() => handlePause(true)}
          onRestart={handleStartCurrentRun}
          onTouchSteer={(val) => engineRef.current?.setTouchSteer(val)}
          onTouchJump={() => engineRef.current?.triggerTouchJump()}
          onToggleFlight={()=>engineRef.current?.toggleFreeFlight()}
          onFlightVertical={value=>engineRef.current?.setFlightVertical(value)}
          onTouchSlide={() => engineRef.current?.triggerTouchSlide()}
          onOpenMap={openTravelMap}
          onTouchAdvance={value => engineRef.current?.setTouchAdvance(value)}
          onExploreHere={() => {
            const route=LAKELAND_ROUTES.find(r=>r.mode==='freeroam');
            if(!route)return;
            const x=hud.playerX,z=hud.playerZ,h=hud.playerHeading;
            startRouteRun({...route,startName:hud.nearSettlement,waypoints:[[x,z],[x-Math.sin(h)*8,z-Math.cos(h)*8]]});
          }}
          onToggleExplorePace={() => engineRef.current?.toggleExplorePace()}
          onSetExplorePace={pace=>engineRef.current?.setExplorePace(pace)}
          onRecenterExploreCamera={()=>engineRef.current?.recenterExploreCamera()}
          onToggleExploreView={() => engineRef.current?.toggleExploreView()}
          onToggleExploreLabels={() => engineRef.current?.toggleExploreLabels()}
          onShopDoor={() => engineRef.current?.toggleShop()}
        />
      )}

      {/* Pause & Photo Mode Modal */}
      {gameState === 'paused' && !showSettingsModal && !showMapModal && (
        <PauseAndPhotoModal
          isPhotoMode={isPhotoMode}
          exploring={selectedRoute.mode==='freeroam'}
          labelsVisible={!hud.cleanExploreMode}
          muted={settings.muted}
          onToggleLabels={()=>engineRef.current?.toggleExploreLabels()}
          onToggleMute={handleToggleMute}
          photoPreset={photoPreset}
          onTogglePhotoMode={(enabled) => {
            setIsPhotoMode(enabled);
            if (enabled) {
              setPhotoPreset('runner');
              engineRef.current?.setPhotoModePreset('runner');
            }
          }}
          onSelectPhotoPreset={(preset) => {
            setPhotoPreset(preset);
            engineRef.current?.setPhotoModePreset(preset);
          }}
          onOrbitPhoto={(dx, dy, dz) => engineRef.current?.orbitPhotoCamera(dx, dy, dz)}
          onResume={handleResume}
          onRestart={handleStartCurrentRun}
          onOpenSettings={() => setShowSettingsModal(true)}
          onReturnToTitle={handleReturnToTitle}
        />
      )}

      {/* End of Run Results Modal */}
      {gameState === 'gameover' && lastResult && (
        <ResultsModal
          result={lastResult}
          onPlayAgain={handleStartCurrentRun}
          onReturnToTitle={handleReturnToTitle}
        />
      )}

      {/* Interactive Geographic Map Modal */}
      {showMapModal && (
        <InteractiveMapModal
          manifest={engineRef.current?.getRegionManifest() ?? null}
          lakeData={engineRef.current?.getLakeData() ?? null}
          routes={LAKELAND_ROUTES}
          selectedRouteId={selectedRoute.id}
          onSelectRoute={gameState === 'title' ? handleSelectRoute : () => {}}
          onSelectAndStart={route => { mapResume.current = false; startRouteRun(route); }}
          player={gameState === 'title' ? undefined : { x: hud.playerX, z: hud.playerZ }}
          onTravel={travelToStop}
          onClose={closeTravelMap}
        />
      )}

      {/* Settings & Attribution Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* How-To-Play Modal */}
      {showTutorialModal && <TutorialModal onClose={() => setShowTutorialModal(false)} />}
    </div>
  );
}
