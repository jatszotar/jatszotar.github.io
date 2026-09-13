import { describe, expect, it } from 'vitest';
import {
  isLevelUnlocked,
  nextLevelIndex,
  recordRoundResult,
} from '../src/progress/store';
import { GAME_LEVELS, UNLOCK_THRESHOLD } from '../src/game/types';

const maxLevelIndex = GAME_LEVELS.length - 1;

describe('linear level progression', () => {
  it('starts with only the first level unlocked', () => {
    const progress = { unlockedLevelIndex: 0, lastScores: {} };
    expect(isLevelUnlocked(progress, 0)).toBe(true);
    expect(isLevelUnlocked(progress, 1)).toBe(false);
  });

  it('unlocks missing number in 0-5 after finishing result in 0-5', () => {
    const progress = { unlockedLevelIndex: 0, lastScores: {} };
    const next = recordRoundResult(
      progress,
      0,
      { correct: 7, total: 8 },
      maxLevelIndex,
      UNLOCK_THRESHOLD,
    );
    expect(next.unlockedLevelIndex).toBe(1);
    expect(GAME_LEVELS[1]).toEqual({ max: 5, phase: 2 });
  });

  it('unlocks 0-10 result after finishing missing number in 0-5', () => {
    let progress = { unlockedLevelIndex: 1, lastScores: {} };
    progress = recordRoundResult(
      progress,
      1,
      { correct: 7, total: 8 },
      maxLevelIndex,
      UNLOCK_THRESHOLD,
    );
    expect(progress.unlockedLevelIndex).toBe(2);
    expect(GAME_LEVELS[2]).toEqual({ max: 10, phase: 1 });
  });

  it('does not unlock when score is too low', () => {
    const progress = { unlockedLevelIndex: 0, lastScores: {} };
    const next = recordRoundResult(
      progress,
      0,
      { correct: 6, total: 8 },
      maxLevelIndex,
      UNLOCK_THRESHOLD,
    );
    expect(next.unlockedLevelIndex).toBe(0);
  });

  it('allows replaying earlier levels without changing unlock', () => {
    const progress = { unlockedLevelIndex: 2, lastScores: {} };
    const next = recordRoundResult(
      progress,
      0,
      { correct: 8, total: 8 },
      maxLevelIndex,
      UNLOCK_THRESHOLD,
    );
    expect(next.unlockedLevelIndex).toBe(2);
  });

  it('returns the next level index in sequence', () => {
    expect(nextLevelIndex(0, maxLevelIndex)).toBe(1);
    expect(nextLevelIndex(1, maxLevelIndex)).toBe(2);
    expect(nextLevelIndex(GAME_LEVELS.length - 1, maxLevelIndex)).toBeNull();
  });
});
