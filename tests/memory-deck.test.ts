import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../src/game/random';
import { createDeck } from '../src/memory/deck';

const TRICKY_CORE_MONKEY_IDS = ['monkey-see', 'monkey-hear', 'monkey-speak'];

describe('createDeck', () => {
  it('builds the expected number of cards for each size', () => {
    const rng = createSeededRng(42);
    expect(createDeck('easy', rng)).toHaveLength(6);
    expect(createDeck('medium', createSeededRng(42))).toHaveLength(12);
    expect(createDeck('hard', createSeededRng(42))).toHaveLength(16);
    expect(createDeck('tricky', createSeededRng(42))).toHaveLength(16);
  });

  it('uses each chosen symbol exactly twice', () => {
    const deck = createDeck('medium', createSeededRng(7));
    const counts = new Map<string, number>();

    for (const card of deck) {
      counts.set(card.symbolId, (counts.get(card.symbolId) ?? 0) + 1);
    }

    expect(counts.size).toBe(6);
    for (const count of counts.values()) {
      expect(count).toBe(2);
    }
  });

  it('produces a reproducible order with a seeded rng', () => {
    const first = createDeck('easy', createSeededRng(123));
    const second = createDeck('easy', createSeededRng(123));
    expect(first.map((card) => card.symbolId)).toEqual(
      second.map((card) => card.symbolId),
    );
  });

  it('draws from the full symbol pool so replays can vary', () => {
    const decks = Array.from({ length: 20 }, (_, i) =>
      createDeck('hard', createSeededRng(i + 100)),
    );
    const uniqueSymbols = new Set(decks.flatMap((deck) => deck.map((card) => card.symbolId)));
    expect(uniqueSymbols.size).toBeGreaterThan(8);
  });

  it('uses only classic symbols on child-friendly levels', () => {
    const classicIds = new Set(
      createDeck('hard', createSeededRng(99)).map((card) => card.symbolId),
    );
    for (const id of classicIds) {
      expect(id.startsWith('monkey-')).toBe(false);
      expect(id.startsWith('heart-')).toBe(false);
    }
  });

  it('uses similar symbols on the tricky level', () => {
    const deck = createDeck('tricky', createSeededRng(5));
    const ids = new Set(deck.map((card) => card.symbolId));
    expect(ids.has('monkey-see')).toBe(true);
    expect(ids.has('monkey-hear')).toBe(true);
    expect(ids.has('monkey-speak')).toBe(true);
    expect(ids.size).toBe(8);
    for (const id of ids) {
      expect(
        TRICKY_CORE_MONKEY_IDS.includes(id) || id.startsWith('heart-'),
      ).toBe(true);
    }
  });
});
