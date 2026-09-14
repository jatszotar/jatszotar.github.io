import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadAllProgress,
  loadGameProgress,
  recordRoundResult,
  saveAllProgress,
} from '../src/progress/store';

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
});

describe('progress store', () => {
  it('migrates v2 math progress into v3', () => {
    storage.set(
      'memmath-progress-v2',
      JSON.stringify({ unlockedLevelIndex: 3, lastScores: { 0: { correct: 8, total: 8 } } }),
    );
    const all = loadAllProgress();
    expect(all.games.math?.unlockedLevelIndex).toBe(3);
  });

  it('saves and loads per-game progress', () => {
    saveAllProgress({
      games: {
        counting: { unlockedLevelIndex: 2, lastScores: {} },
      },
    });
    const progress = loadGameProgress('counting', 3);
    expect(progress.unlockedLevelIndex).toBe(2);
  });

  it('unlocks next level on threshold', () => {
    const progress = { unlockedLevelIndex: 0, lastScores: {} };
    const next = recordRoundResult(progress, 0, { correct: 9, total: 10 }, 3, 9);
    expect(next.unlockedLevelIndex).toBe(1);
  });
});
