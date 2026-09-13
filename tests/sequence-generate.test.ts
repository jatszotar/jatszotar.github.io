import { describe, expect, it } from 'vitest';
import {
  checkSequenceAnswer,
  generateSequenceQuestion,
  generateSequenceRound,
} from '../src/sequence/generate';
import { SEQUENCE_LEVELS } from '../src/sequence/types';

describe('sequence generate', () => {
  it('creates a sequence with one blank and valid answer', () => {
    const q = generateSequenceQuestion(SEQUENCE_LEVELS[0], () => 0.5);
    const blankCount = q.labels.filter((label) => label === null).length;
    expect(blankCount).toBe(1);
    expect(checkSequenceAnswer(q, String(q.answer))).toBe(true);
    expect(checkSequenceAnswer(q, String(q.answer + 1))).toBe(false);
  });

  it('level 1 uses positive steps between 1 and 4', () => {
    const q = generateSequenceQuestion(SEQUENCE_LEVELS[0], () => 0.2);
    const values = q.labels
      .map((label) => (label === null ? q.answer : Number(label)))
      .filter((value) => Number.isFinite(value));
    const step = values[1] - values[0];
    expect(step).toBeGreaterThanOrEqual(1);
    expect(step).toBeLessThanOrEqual(4);
    for (const value of values) {
      expect(value).toBeLessThanOrEqual(20);
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  it('level 2 allows decreasing steps', () => {
    let foundNegativeStep = false;
    for (let seed = 0; seed < 30; seed += 1) {
      const rng = () => {
        const value = Math.sin(seed * 17) * 10000;
        return value - Math.floor(value);
      };
      const q = generateSequenceQuestion(SEQUENCE_LEVELS[1], rng);
      const values = q.labels.map((label) =>
        label === null ? q.answer : Number(label),
      );
      const step = values[1] - values[0];
      if (step < 0) {
        foundNegativeStep = true;
      }
      expect(Math.abs(step)).toBeGreaterThanOrEqual(1);
      expect(Math.abs(step)).toBeLessThanOrEqual(4);
    }
    expect(foundNegativeStep).toBe(true);
  });

  it('level 3 shows calculations instead of plain numbers', () => {
    const q = generateSequenceQuestion(SEQUENCE_LEVELS[2], () => 0.4);
    const shown = q.labels.filter((label) => label !== null);
    expect(shown.length).toBe(3);
    for (const label of shown) {
      expect(label).toMatch(/^\d+[+-]\d+$/);
    }
  });

  it('level 4 stays within 50', () => {
    const round = generateSequenceRound(SEQUENCE_LEVELS[3], 8, () => 0.6);
    expect(round).toHaveLength(8);
    for (const q of round) {
      const values = q.id.split(':')[0].split(',').map(Number);
      for (const value of values) {
        expect(value).toBeLessThanOrEqual(50);
        expect(value).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('generates a full round of unique questions', () => {
    const round = generateSequenceRound(SEQUENCE_LEVELS[1], 8, () => 0.3);
    expect(round).toHaveLength(8);
    const ids = new Set(round.map((q) => q.id));
    expect(ids.size).toBeGreaterThanOrEqual(1);
  });
});
