import { describe, expect, it } from 'vitest';
import {
  checkMultiplyAnswer,
  formatMultiplyQuestion,
  generateMultiplyQuestion,
} from '../src/multiply/generate';
import { MULTIPLY_LEVELS } from '../src/multiply/types';

describe('multiply generate', () => {
  it('creates table questions with correct answer', () => {
    const q = generateMultiplyQuestion(MULTIPLY_LEVELS[0], () => 0.5);
    expect(q.a).toBe(2);
    expect(checkMultiplyAnswer(q, String(q.answer))).toBe(true);
    expect(formatMultiplyQuestion(q)).toContain('×');
  });

  it('supports mixed blank positions', () => {
    const q = generateMultiplyQuestion(MULTIPLY_LEVELS[10], () => 0.9);
    expect(['left', 'right', 'result']).toContain(q.blank);
    expect(checkMultiplyAnswer(q, String(q.answer))).toBe(true);
  });
});
