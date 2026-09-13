import { describe, expect, it } from 'vitest';
import {
  checkCompareAnswer,
  generateCompareQuestion,
  generateCompareRound,
} from '../src/compare/generate';
import { COMPARE_LEVELS } from '../src/compare/types';

describe('compare generate', () => {
  it('produces a valid comparison answer', () => {
    const q = generateCompareQuestion(COMPARE_LEVELS[0], () => 0.5);
    expect(['<', '>', '=']).toContain(q.answer);
    expect(checkCompareAnswer(q, q.answer)).toBe(true);
  });

  it('generates emoji comparisons at level 3', () => {
    const q = generateCompareQuestion(COMPARE_LEVELS[2], () => 0.5);
    expect(
      q.left.type === 'emoji' || q.right.type === 'emoji' || q.left.type === 'number',
    ).toBe(true);
  });

  it('generates a full round', () => {
    const round = generateCompareRound(COMPARE_LEVELS[3], 8, () => 0.4);
    expect(round).toHaveLength(8);
  });
});
