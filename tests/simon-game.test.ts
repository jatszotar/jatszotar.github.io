import { describe, expect, it } from 'vitest';
import {
  completeSubRound,
  createSimonGame,
  generateSequence,
  pressPad,
  setPhase,
  startRetry,
} from '../src/simon/game';
import { SIMON_LEVELS, totalSubRounds } from '../src/simon/types';

describe('simon game', () => {
  it('creates level 1 with 12 sub-rounds starting at length 1', () => {
    const game = createSimonGame(SIMON_LEVELS[0], () => 0.5);
    expect(totalSubRounds(SIMON_LEVELS[0])).toBe(12);
    expect(game.sequence).toHaveLength(1);
    expect(game.phase).toBe('preparing');
    expect(game.score.total).toBe(12);
    expect(game.subRoundIndex).toBe(0);
  });

  it('generates sequences within pad range', () => {
    const sequence = generateSequence(4, () => 0);
    expect(sequence).toEqual([0, 0, 0, 0]);
    expect(sequence.every((pad) => pad >= 0 && pad <= 3)).toBe(true);
  });

  it('detects correct and incorrect presses', () => {
    const game = setPhase(
      createSimonGame(SIMON_LEVELS[0], () => 0),
      'awaiting',
    );
    const first = pressPad(game, game.sequence[0]);
    expect(first.correct).toBe(true);
    expect(first.won).toBe(true);

    const multi = setPhase(
      createSimonGame(SIMON_LEVELS[0], () => 0.99),
      'awaiting',
    );
    const level = SIMON_LEVELS[0];
    const twoStep = {
      ...multi,
      stepIndex: 1,
      sequence: generateSequence(level.steps[1].length, () => 0.99),
    };
    const stepOne = pressPad(twoStep, twoStep.sequence[0]);
    expect(stepOne.correct).toBe(true);
    expect(stepOne.won).toBe(false);

    const wrong = pressPad(stepOne.game, (twoStep.sequence[0] + 1) % 4);
    expect(wrong.correct).toBe(false);
    expect(wrong.game.phase).toBe('failed');
  });

  it('advances through three single-note reps before two-note sequences', () => {
    let game = createSimonGame(SIMON_LEVELS[0], () => 0.2);
    expect(game.sequence).toHaveLength(1);

    for (let rep = 0; rep < 2; rep += 1) {
      const result = completeSubRound(game, true, () => 0.2);
      game = result.game;
      expect(result.done).toBe(false);
      expect(game.sequence).toHaveLength(1);
      expect(game.score.correct).toBe(rep + 1);
    }

    const third = completeSubRound(game, true, () => 0.2);
    game = third.game;
    expect(third.done).toBe(false);
    expect(game.sequence).toHaveLength(2);
    expect(game.stepIndex).toBe(1);
    expect(game.repIndex).toBe(0);
    expect(game.score.correct).toBe(3);
  });

  it('advances from two-note to three-note step after three reps', () => {
    let game = createSimonGame(SIMON_LEVELS[0], () => 0.2);
    for (let i = 0; i < 3; i += 1) {
      game = completeSubRound(game, true, () => 0.2).game;
    }

    for (let rep = 0; rep < 2; rep += 1) {
      const result = completeSubRound(game, true, () => 0.2);
      game = result.game;
      expect(game.sequence).toHaveLength(2);
    }

    const next = completeSubRound(game, true, () => 0.2);
    game = next.game;
    expect(game.sequence).toHaveLength(3);
    expect(game.stepIndex).toBe(2);
  });

  it('supports one retry before scoring a failed sub-round', () => {
    const game = setPhase(createSimonGame(SIMON_LEVELS[0], () => 0), 'awaiting');
    const retry = startRetry(game);
    expect(retry.retryUsed).toBe(true);
    expect(retry.phase).toBe('showing');
    expect(retry.playerIndex).toBe(0);

    const failed = completeSubRound(retry, false, () => 0);
    expect(failed.game.score.correct).toBe(0);
    expect(failed.game.subRoundIndex).toBe(1);
    expect(failed.done).toBe(false);
  });

  it('finishes after all sub-rounds are completed', () => {
    let game = createSimonGame(SIMON_LEVELS[0], () => 0.3);
    for (let i = 0; i < 11; i += 1) {
      const result = completeSubRound(game, true, () => 0.3);
      game = result.game;
      expect(result.done).toBe(false);
    }

    const final = completeSubRound(game, true, () => 0.3);
    expect(final.done).toBe(true);
    expect(final.game.score.correct).toBe(12);
    expect(final.game.phase).toBe('won');
  });
});
