import { randomInt, type Rng } from '../game/random';
import { totalSubRounds, type SimonGame, type SimonLevel } from './types';

export function generateSequence(length: number, rng: Rng): number[] {
  const sequence: number[] = [];
  for (let i = 0; i < length; i += 1) {
    sequence.push(randomInt(0, 3, rng));
  }
  return sequence;
}

export function createSimonGame(level: SimonLevel, rng: Rng = Math.random): SimonGame {
  const total = totalSubRounds(level);
  return {
    level,
    stepIndex: 0,
    repIndex: 0,
    subRoundIndex: 0,
    sequence: generateSequence(level.steps[0].length, rng),
    playerIndex: 0,
    phase: 'preparing',
    retryUsed: false,
    score: { correct: 0, total },
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
      game: { ...game, playerIndex: nextIndex },
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

export function startRetry(game: SimonGame): SimonGame {
  return {
    ...game,
    playerIndex: 0,
    retryUsed: true,
    phase: 'showing',
  };
}

export function completeSubRound(
  game: SimonGame,
  success: boolean,
  rng: Rng = Math.random,
): { game: SimonGame; done: boolean } {
  const score = {
    correct: game.score.correct + (success ? 1 : 0),
    total: game.score.total,
  };

  const nextSubRoundIndex = game.subRoundIndex + 1;
  if (nextSubRoundIndex >= game.score.total) {
    return {
      game: {
        ...game,
        score,
        phase: 'won',
        playerIndex: 0,
      },
      done: true,
    };
  }

  let stepIndex = game.stepIndex;
  let repIndex = game.repIndex + 1;
  const currentStep = game.level.steps[stepIndex];
  if (repIndex >= currentStep.reps) {
    stepIndex += 1;
    repIndex = 0;
  }

  const nextLength = game.level.steps[stepIndex].length;
  return {
    game: {
      ...game,
      stepIndex,
      repIndex,
      subRoundIndex: nextSubRoundIndex,
      sequence: generateSequence(nextLength, rng),
      playerIndex: 0,
      phase: 'preparing',
      retryUsed: false,
      score,
    },
    done: false,
  };
}

export function setPhase(game: SimonGame, phase: SimonGame['phase']): SimonGame {
  return {
    ...game,
    phase,
    playerIndex: phase === 'awaiting' ? 0 : game.playerIndex,
  };
}
