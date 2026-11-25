import type { RouteDefinition, RouteRecord, RunResult, SaveData } from '../types/game';

export const BASE_SPEED_MPS = 9.5; // ~34 km/h brisk parkour stride
export const MAX_SPEED_MPS = 32.5; // ~117 km/h peak flow rush
export const MIN_SPEED_MPS = 6.0;
export const COMBO_DURATION_SEC = 4.2;
export const MAX_COMBO = 10;
export const MAX_HEARTS = 3;

export const STORAGE_KEY = 'lakeland_rush_save_v1';

export interface ScoringState {
  score: number;
  combo: number;
  comboTimer: number;
  speedMps: number;
  topSpeedMps: number;
  maxCombo: number;
  hearts: number;
  tokensCollected: number;
}

export function createInitialScoringState(): ScoringState {
  return {
    score: 0,
    combo: 1,
    comboTimer: 0,
    speedMps: BASE_SPEED_MPS,
    topSpeedMps: BASE_SPEED_MPS,
    maxCombo: 1,
    hearts: MAX_HEARTS,
    tokensCollected: 0,
  };
}

export function speedMpsToKmh(mps: number): number {
  return Math.round(mps * 3.6);
}

export function awardFlowEvent(
  state: ScoringState,
  basePoints: number,
  speedBoostMps: number,
  isToken = false,
): { state: ScoringState; pointsAdded: number; leveledUp: boolean } {
  const prevCombo = state.combo;
  const nextCombo = Math.min(MAX_COMBO, state.comboTimer > 0 ? state.combo + 1 : 1);
  const pointsAdded = Math.round(basePoints * nextCombo);
  const nextSpeed = Math.min(MAX_SPEED_MPS, state.speedMps + speedBoostMps);

  return {
    pointsAdded,
    leveledUp: nextCombo > prevCombo,
    state: {
      ...state,
      score: state.score + pointsAdded,
      combo: nextCombo,
      comboTimer: COMBO_DURATION_SEC,
      speedMps: nextSpeed,
      topSpeedMps: Math.max(state.topSpeedMps, nextSpeed),
      maxCombo: Math.max(state.maxCombo, nextCombo),
      tokensCollected: state.tokensCollected + (isToken ? 1 : 0),
    },
  };
}

export function tickScoring(state: ScoringState, dt: number, isGrinding: boolean): ScoringState {
  const nextComboTimer = Math.max(0, state.comboTimer - dt);
  const nextCombo = nextComboTimer <= 0 ? 1 : state.combo;

  // Natural acceleration toward flow cruise speed, faster while rail-grinding
  const targetCruise = BASE_SPEED_MPS + (nextCombo - 1) * 1.85 + (isGrinding ? 4.5 : 0);
  const accelRate = state.speedMps < targetCruise ? 3.2 : 0.9;
  const nextSpeed = Math.min(
    MAX_SPEED_MPS,
    Math.max(
      MIN_SPEED_MPS,
      state.speedMps + (targetCruise - state.speedMps) * (1 - Math.exp(-accelRate * dt)),
    ),
  );

  // Continuous flow points for sprinting at high speed
  const distPoints = nextSpeed * dt * 1.4 * nextCombo;
  const grindBonus = isGrinding ? dt * 65 * nextCombo : 0;

  return {
    ...state,
    score: state.score + distPoints + grindBonus,
    combo: nextCombo,
    comboTimer: nextComboTimer,
    speedMps: nextSpeed,
    topSpeedMps: Math.max(state.topSpeedMps, nextSpeed),
  };
}

export function applyCollisionPenalty(state: ScoringState): ScoringState {
  const nextHearts = Math.max(0, state.hearts - 1);
  return {
    ...state,
    hearts: nextHearts,
    combo: 1,
    comboTimer: 0,
    speedMps: Math.max(MIN_SPEED_MPS, state.speedMps * 0.48),
  };
}

export function computeMedal(
  victory: boolean,
  score: number,
  elapsedSec: number,
  route: RouteDefinition,
): 'Gold' | 'Silver' | 'Bronze' | 'Finish' | 'None' {
  if (!victory) return 'None';
  if (route.mode === 'freeroam') {
    if (score >= 18000) return 'Gold';
    if (score >= 9000) return 'Silver';
    if (score >= 3500) return 'Bronze';
    return 'Finish';
  }
  if (score >= route.parScore && elapsedSec <= route.targetTimeSec * 1.15) {
    return 'Gold';
  }
  if (score >= route.parScore * 0.65) {
    return 'Silver';
  }
  if (score >= route.parScore * 0.35) {
    return 'Bronze';
  }
  return 'Finish';
}

export function buildRunResult(
  route: RouteDefinition,
  victory: boolean,
  reason: string,
  scoring: ScoringState,
  elapsedSec: number,
  distanceMeters: number,
  totalTokens: number,
  prevRecord?: RouteRecord,
): RunResult {
  const finalScore = Math.round(scoring.score);
  const topSpeedKmh = speedMpsToKmh(scoring.topSpeedMps);
  const medal = computeMedal(victory, finalScore, elapsedSec, route);
  const prevBest = prevRecord?.bestScore ?? 0;
  const isNewBest = finalScore > prevBest;

  return {
    routeId: route.id,
    routeTitle: route.title,
    victory,
    score: finalScore,
    bestScore: Math.max(finalScore, prevBest),
    isNewBest,
    topSpeedKmh,
    maxCombo: scoring.maxCombo,
    elapsedSec,
    distanceMeters: Math.round(distanceMeters),
    tokensCollected: scoring.tokensCollected,
    totalTokens,
    medal,
    reason,
  };
}

export function createDefaultSaveData(): SaveData {
  return {
    records: {},
    discoveredSettlements: ['waterhead', 'ambleside'],
    totalRuns: 0,
    totalDistanceM: 0,
  };
}

export function loadSaveData(storage: Pick<Storage, 'getItem'> | null | undefined): SaveData {
  if (!storage) return createDefaultSaveData();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultSaveData();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      records: parsed.records && typeof parsed.records === 'object' ? parsed.records : {},
      discoveredSettlements: Array.isArray(parsed.discoveredSettlements)
        ? parsed.discoveredSettlements
        : ['waterhead', 'ambleside'],
      totalRuns: typeof parsed.totalRuns === 'number' ? parsed.totalRuns : 0,
      totalDistanceM: typeof parsed.totalDistanceM === 'number' ? parsed.totalDistanceM : 0,
    };
  } catch {
    return createDefaultSaveData();
  }
}

export function commitRunToSaveData(save: SaveData, result: RunResult): SaveData {
  const medalOrder = { None: 0, Finish: 1, Bronze: 2, Silver: 3, Gold: 4 };
  const existing = save.records[result.routeId];
  const nextMedal =
    existing && medalOrder[existing.medal] > medalOrder[result.medal]
      ? existing.medal
      : result.medal;

  const nextBestTime =
    result.victory && result.elapsedSec > 0
      ? existing?.bestTimeSec != null
        ? Math.min(existing.bestTimeSec, result.elapsedSec)
        : result.elapsedSec
      : existing?.bestTimeSec ?? null;

  return {
    ...save,
    totalRuns: save.totalRuns + 1,
    totalDistanceM: save.totalDistanceM + result.distanceMeters,
    records: {
      ...save.records,
      [result.routeId]: {
        bestScore: Math.max(existing?.bestScore ?? 0, result.score),
        bestTimeSec: nextBestTime,
        topSpeedKmh: Math.max(existing?.topSpeedKmh ?? 0, result.topSpeedKmh),
        medal: nextMedal,
      },
    },
  };
}
