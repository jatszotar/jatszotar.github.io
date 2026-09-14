import { describe, expect, it } from 'vitest';
import {
  checkCountingAnswer,
  generateCountingQuestion,
  generateCountingRound,
} from '../src/counting/generate';
import { createSeededRng } from '../src/game/random';
import { ROUND_SIZE } from '../src/game/types';
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

  it('gives the two colour groups visibly different emoji', () => {
    const rng = createSeededRng(7);
    for (let i = 0; i < 200; i += 1) {
      const q = generateCountingQuestion(COUNTING_LEVELS[3], rng);
      const red = new Set(
        q.items.filter((item) => item.variant === 'red').map((i) => i.emoji),
      );
      const blue = new Set(
        q.items.filter((item) => item.variant === 'blue').map((i) => i.emoji),
      );
      expect(red.size).toBe(1);
      expect(blue.size).toBe(1);
      expect([...red][0]).not.toBe([...blue][0]);
    }
  });

  it('generates a round', () => {
    const round = generateCountingRound(COUNTING_LEVELS[2], ROUND_SIZE, () => 0.5);
    expect(round).toHaveLength(ROUND_SIZE);
  });
});
