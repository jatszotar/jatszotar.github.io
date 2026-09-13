import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../src/game/random';
import {
  createMemoryGame,
  flipCard,
  resolveMismatch,
} from '../src/memory/game';

describe('memory game', () => {
  it('reveals the first card without counting a move', () => {
    const game = createMemoryGame('easy', createSeededRng(1));
    const result = flipCard(game, 0);

    expect(result.outcome).toBe('flipped');
    expect(result.game.moves).toBe(0);
    expect(result.game.cards[0].state).toBe('revealed');
  });

  it('matches a pair and marks both cards matched', () => {
    let game = createMemoryGame('easy', createSeededRng(2));
    const firstSymbol = game.cards[0].symbolId;
    const pairIndex = game.cards.findIndex(
      (card, index) => index !== 0 && card.symbolId === firstSymbol,
    );

    game = flipCard(game, 0).game;
    const result = flipCard(game, pairIndex);

    expect(result.outcome).toBe('match');
    expect(result.game.moves).toBe(1);
    expect(result.game.cards[0].state).toBe('matched');
    expect(result.game.cards[pairIndex].state).toBe('matched');
  });

  it('returns mismatched cards to hidden after resolveMismatch', () => {
    let game = createMemoryGame('easy', createSeededRng(3));
    const mismatchIndex = game.cards.findIndex(
      (card) => card.symbolId !== game.cards[0].symbolId,
    );

    game = flipCard(game, 0).game;
    const mismatch = flipCard(game, mismatchIndex);
    game = mismatch.game;
    expect(mismatch.outcome).toBe('mismatch');
    expect(game.cards[0].state).toBe('revealed');
    expect(game.cards[mismatchIndex].state).toBe('revealed');

    game = resolveMismatch(game);
    expect(game.cards[0].state).toBe('hidden');
    expect(game.cards[mismatchIndex].state).toBe('hidden');
    expect(game.flipped).toEqual([]);
  });

  it('ignores invalid taps', () => {
    let game = createMemoryGame('easy', createSeededRng(4));
    game = flipCard(game, 0).game;

    expect(flipCard(game, 0).outcome).toBe('ignored');

    const firstSymbol = game.cards[0].symbolId;
    const secondIndex = game.cards.findIndex(
      (card, index) => index !== 0 && card.symbolId !== firstSymbol,
    );
    game = flipCard(game, secondIndex).game;

    const thirdIndex = game.cards.findIndex(
      (card, index) =>
        index !== 0 && index !== secondIndex && card.state === 'hidden',
    );
    expect(flipCard(game, thirdIndex).outcome).toBe('ignored');

    game = resolveMismatch(game);
    const pairIndex = game.cards.findIndex(
      (card, index) => index !== 0 && card.symbolId === firstSymbol,
    );
    game = flipCard(game, 0).game;
    game = flipCard(game, pairIndex).game;

    expect(flipCard(game, 0).outcome).toBe('ignored');
    expect(flipCard(game, pairIndex).outcome).toBe('ignored');
  });

  it('reports won on the final match', () => {
    let game = createMemoryGame('easy', createSeededRng(5));
    const groups = new Map<string, number[]>();

    game.cards.forEach((card, index) => {
      const list = groups.get(card.symbolId) ?? [];
      list.push(index);
      groups.set(card.symbolId, list);
    });

    for (const indexes of groups.values()) {
      game = flipCard(game, indexes[0]).game;
      const result = flipCard(game, indexes[1]);
      game = result.game;
      if (result.outcome === 'won') {
        expect(game.matchedPairs).toBe(game.totalPairs);
        return;
      }
    }

    throw new Error('Expected a winning outcome');
  });
});
