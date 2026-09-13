import { describe, expect, it } from 'vitest';
import {
  loadGameProgress,
  recordBestTime,
} from '../src/progress/store';

describe('recordBestTime', () => {
  it('marks the first run as a new best', () => {
    const progress = { unlockedLevelIndex: 0, lastScores: {} };
    const result = recordBestTime(progress, 0, 42_000);

    expect(result.isNewBest).toBe(true);
    expect(result.progress.bestTimesMs?.[0]).toBe(42_000);
  });

  it('marks a faster run as a new best', () => {
    const progress = {
      unlockedLevelIndex: 0,
      lastScores: {},
      bestTimesMs: { 0: 42_000 },
    };
    const result = recordBestTime(progress, 0, 35_000);

    expect(result.isNewBest).toBe(true);
    expect(result.progress.bestTimesMs?.[0]).toBe(35_000);
  });

  it('keeps the existing best on a slower run', () => {
    const progress = {
      unlockedLevelIndex: 0,
      lastScores: {},
      bestTimesMs: { 0: 35_000 },
    };
    const result = recordBestTime(progress, 0, 50_000);

    expect(result.isNewBest).toBe(false);
    expect(result.progress.bestTimesMs?.[0]).toBe(35_000);
  });

  it('loads progress without bestTimesMs as an empty map', () => {
    const progress = loadGameProgress('counting', 3);
    expect(progress.bestTimesMs).toEqual({});
  });
});
