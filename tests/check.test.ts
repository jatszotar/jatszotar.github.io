import { describe, expect, it } from 'vitest';
import { formatProblem, isCorrectAnswer } from '../src/game/check';
import type { Problem } from '../src/game/types';

const resultBlank: Problem = {
  left: 2,
  op: '+',
  right: 5,
  result: 7,
  blank: 'result',
};

const leftBlank: Problem = {
  left: 2,
  op: '+',
  right: 5,
  result: 7,
  blank: 'left',
};

describe('isCorrectAnswer', () => {
  it('checks result blanks', () => {
    expect(isCorrectAnswer(resultBlank, 7)).toBe(true);
    expect(isCorrectAnswer(resultBlank, 8)).toBe(false);
  });

  it('checks operand blanks', () => {
    expect(isCorrectAnswer(leftBlank, 2)).toBe(true);
    expect(isCorrectAnswer(leftBlank, 5)).toBe(false);
  });
});

describe('formatProblem', () => {
  it('shows question marks in blank positions', () => {
    expect(formatProblem(resultBlank)).toBe('2 + 5 = ?');
    expect(formatProblem(leftBlank)).toBe('? + 5 = 7');
  });
});
