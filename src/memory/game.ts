import { createDeck } from './deck';
import type { Rng } from '../game/random';
import type { MemoryGame, MemorySizeKey } from './types';
import { getMemorySize } from './types';

export type FlipOutcome = 'ignored' | 'flipped' | 'match' | 'mismatch' | 'won';

export interface FlipResult {
  game: MemoryGame;
  outcome: FlipOutcome;
}

export function createMemoryGame(sizeKey: MemorySizeKey, rng: Rng): MemoryGame {
  const { pairs } = getMemorySize(sizeKey);
  return {
    sizeKey,
    cards: createDeck(sizeKey, rng),
    flipped: [],
    moves: 0,
    matchedPairs: 0,
    totalPairs: pairs,
  };
}

export function flipCard(game: MemoryGame, index: number): FlipResult {
  const card = game.cards[index];
  if (!card) {
    return { game, outcome: 'ignored' };
  }

  if (card.state === 'matched' || card.state === 'revealed') {
    return { game, outcome: 'ignored' };
  }

  if (game.flipped.length >= 2) {
    return { game, outcome: 'ignored' };
  }

  const cards = game.cards.map((entry, i) =>
    i === index ? { ...entry, state: 'revealed' as const } : entry,
  );
  const flipped = [...game.flipped, index];

  if (flipped.length === 1) {
    return {
      game: { ...game, cards, flipped },
      outcome: 'flipped',
    };
  }

  const first = cards[flipped[0]];
  const second = cards[flipped[1]];
  const moves = game.moves + 1;

  if (first.symbolId === second.symbolId) {
    const matchedCards = cards.map((entry, i) =>
      i === flipped[0] || i === flipped[1]
        ? { ...entry, state: 'matched' as const }
        : entry,
    );
    const matchedPairs = game.matchedPairs + 1;
    const nextGame: MemoryGame = {
      ...game,
      cards: matchedCards,
      flipped: [],
      moves,
      matchedPairs,
    };

    return {
      game: nextGame,
      outcome: matchedPairs >= game.totalPairs ? 'won' : 'match',
    };
  }

  return {
    game: {
      ...game,
      cards,
      flipped,
      moves,
    },
    outcome: 'mismatch',
  };
}

export function resolveMismatch(game: MemoryGame): MemoryGame {
  if (game.flipped.length !== 2) {
    return game;
  }

  const [firstIndex, secondIndex] = game.flipped;
  const cards = game.cards.map((entry, i) => {
    if (i === firstIndex || i === secondIndex) {
      return { ...entry, state: 'hidden' as const };
    }
    return entry;
  });

  return {
    ...game,
    cards,
    flipped: [],
  };
}
