import type { GameId } from '../games/registry';
import type { RoundResult } from '../game/types';
import { GAME_LEVELS } from '../game/types';

const STORAGE_KEY_V3 = 'memmath-progress-v3';
const STORAGE_KEY_V2 = 'memmath-progress-v2';
// Keys keep the legacy "memmath" prefix so existing players keep their saved progress.

export interface GameProgress {
  unlockedLevelIndex: number;
  lastScores: Partial<Record<number, RoundResult>>;
  bestTimesMs?: Partial<Record<number, number>>;
}

export interface AllProgress {
  games: Partial<Record<GameId, GameProgress>>;
}

function defaultGameProgress(): GameProgress {
  return {
    unlockedLevelIndex: 0,
    lastScores: {},
    bestTimesMs: {},
  };
}

function migrateV2Math(): GameProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as GameProgress;
    const maxIndex = GAME_LEVELS.length - 1;
    return {
      unlockedLevelIndex: Math.min(
        Math.max(0, parsed.unlockedLevelIndex ?? 0),
        maxIndex,
      ),
      lastScores: parsed.lastScores ?? {},
    };
  } catch {
    return null;
  }
}

export function loadAllProgress(): AllProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V3);
    if (raw) {
      const parsed = JSON.parse(raw) as AllProgress;
      return { games: parsed.games ?? {} };
    }
  } catch {
    // fall through to migration
  }

  const migratedMath = migrateV2Math();
  const games: Partial<Record<GameId, GameProgress>> = {};
  if (migratedMath) {
    games.math = migratedMath;
  }
  return { games };
}

export function saveAllProgress(progress: AllProgress): void {
  localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(progress));
}

export function loadGameProgress(
  gameId: GameId,
  maxLevelIndex: number,
): GameProgress {
  const all = loadAllProgress();
  const stored = all.games[gameId];
  if (!stored) {
    return defaultGameProgress();
  }
  return {
    unlockedLevelIndex: Math.min(
      Math.max(0, stored.unlockedLevelIndex ?? 0),
      maxLevelIndex,
    ),
    lastScores: stored.lastScores ?? {},
    bestTimesMs: stored.bestTimesMs ?? {},
  };
}

export function saveGameProgress(
  gameId: GameId,
  progress: GameProgress,
): void {
  const all = loadAllProgress();
  all.games[gameId] = progress;
  saveAllProgress(all);
}

export function isLevelUnlocked(
  progress: GameProgress,
  levelIndex: number,
): boolean {
  return levelIndex <= progress.unlockedLevelIndex;
}

export function recordRoundResult(
  progress: GameProgress,
  levelIndex: number,
  result: RoundResult,
  maxLevelIndex: number,
  unlockThreshold: number,
): GameProgress {
  const next: GameProgress = {
    unlockedLevelIndex: progress.unlockedLevelIndex,
    lastScores: { ...progress.lastScores, [levelIndex]: result },
    bestTimesMs: progress.bestTimesMs,
  };

  if (
    result.correct >= unlockThreshold &&
    levelIndex === progress.unlockedLevelIndex &&
    levelIndex < maxLevelIndex
  ) {
    next.unlockedLevelIndex = levelIndex + 1;
  }

  return next;
}

export function nextLevelIndex(
  levelIndex: number,
  maxLevelIndex: number,
): number | null {
  if (levelIndex >= maxLevelIndex) {
    return null;
  }
  return levelIndex + 1;
}

export function recordBestTime(
  progress: GameProgress,
  levelIndex: number,
  elapsedMs: number,
): { progress: GameProgress; isNewBest: boolean } {
  const bestTimesMs = { ...progress.bestTimesMs };
  const existing = bestTimesMs[levelIndex];

  if (existing === undefined) {
    bestTimesMs[levelIndex] = elapsedMs;
    return {
      progress: { ...progress, bestTimesMs },
      isNewBest: false,
    };
  }

  if (elapsedMs < existing) {
    bestTimesMs[levelIndex] = elapsedMs;
    return {
      progress: { ...progress, bestTimesMs },
      isNewBest: true,
    };
  }

  return {
    progress,
    isNewBest: false,
  };
}
