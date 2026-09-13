import { randomInt, type Rng } from '../game/random';
import type { SimonGame, SimonLevel } from './types';

export function createSimonGame(level: SimonLevel, rng: Rng = Math.random): SimonGame {
  const sequence: number[] = [];
  for (let i = 0; i < level.targetLength; i += 1) {
    sequence.push(randomInt(0, 3, rng));
  }
  return {
    level,
    sequence,
    playerIndex: 0,
    phase: 'showing',
  };
}

export function pressPad(
  game: SimonGame,
  padIndex: number,
): { game: SimonGame; correct: boolean; won: boolean } {
  if (game.phase !== 'awaiting') {
    return { game, correct: false, won: false };
  }

  const expected = game.sequence[game.playerIndex];
  if (padIndex !== expected) {
    return {
      game: { ...game, phase: 'failed' },
      correct: false,
      won: false,
    };
  }

  const nextIndex = game.playerIndex + 1;
  if (nextIndex >= game.sequence.length) {
    return {
      game: { ...game, playerIndex: nextIndex, phase: 'won' },
      correct: true,
      won: true,
    };
  }

  return {
    game: { ...game, playerIndex: nextIndex },
    correct: true,
    won: false,
  };
}

export function setPhase(game: SimonGame, phase: SimonGame['phase']): SimonGame {
  return { ...game, phase, playerIndex: phase === 'awaiting' ? 0 : game.playerIndex };
}
