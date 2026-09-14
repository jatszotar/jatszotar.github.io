import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../src/game/random';
import { createDeck } from '../src/memory/deck';
import {
  TRICKY_CATEGORIES,
  trickyCategoryForSymbolId,
  type TrickyCategory,
} from '../src/memory/types';

function deckCategory(deck: ReturnType<typeof createDeck>): TrickyCategory {
  const ids = new Set(deck.map((card) => card.symbolId));
  const categories = [...ids].map((id) => trickyCategoryForSymbolId(id));
  return categories[0];
}

describe('createDeck', () => {
  it('builds the expected number of cards for each size', () => {
    const rng = createSeededRng(42);
    expect(createDeck('easy', rng)).toHaveLength(6);
    expect(createDeck('medium', createSeededRng(42))).toHaveLength(12);
    expect(createDeck('hard', createSeededRng(42))).toHaveLength(16);
    expect(createDeck('tricky', createSeededRng(42))).toHaveLength(16);
    expect(createDeck('clocks', createSeededRng(42))).toHaveLength(16);
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
      expect(id.startsWith('clock-')).toBe(false);
    }
  });

  it('uses clock symbols on the clocks level', () => {
    const deck = createDeck('clocks', createSeededRng(8));
    const ids = new Set(deck.map((card) => card.symbolId));
    expect(ids.size).toBe(8);
    for (const id of ids) {
      expect(id.startsWith('clock-')).toBe(true);
    }
  });

  it('uses symbols from a single tricky category per game', () => {
    const deck = createDeck('tricky', createSeededRng(5));
    const ids = new Set(deck.map((card) => card.symbolId));
    expect(ids.size).toBe(8);

    const categories = new Set(
      [...ids].map((id) => trickyCategoryForSymbolId(id)),
    );
    expect(categories.size).toBe(1);
  });

  it('can draw from each tricky category across replays', () => {
    const seedsByCategory: Record<TrickyCategory, number> = {
      shapes: 0,
      animals: 251,
      nature: 1112,
    };

    for (const category of TRICKY_CATEGORIES) {
      const deck = createDeck('tricky', createSeededRng(seedsByCategory[category]));
      expect(deckCategory(deck)).toBe(category);
    }
  });
});
