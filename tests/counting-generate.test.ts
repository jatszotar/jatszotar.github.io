import { describe, expect, it } from 'vitest';
import {
  checkCountingAnswer,
  generateCountingQuestion,
  generateCountingRound,
} from '../src/counting/generate';
import { COUNTING_LEVELS } from '../src/counting/types';

describe('counting generate', () => {
  it('counts emoji items correctly', () => {
    const q = generateCountingQuestion(COUNTING_LEVELS[0], () => 0.1);
    expect(q.items.length).toBe(q.answer);
    expect(checkCountingAnswer(q, String(q.answer))).toBe(true);
  });

  it('filters by colour in two-colour mode', () => {
    const q = generateCountingQuestion(COUNTING_LEVELS[3], () => 0.2);
    expect(q.filterVariant).toBeDefined();
    const filtered = q.items.filter((i) => i.variant === q.filterVariant);
    expect(filtered.length).toBe(q.answer);
  });

  it('generates a round', () => {
    const round = generateCountingRound(COUNTING_LEVELS[2], 8, () => 0.5);
    expect(round).toHaveLength(8);
  });
});
