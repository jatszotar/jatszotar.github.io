import { describe, expect, it } from 'vitest';
import { createSimonGame, pressPad, setPhase } from '../src/simon/game';
import { SIMON_LEVELS } from '../src/simon/types';

describe('simon game', () => {
  it('creates a sequence of the target length', () => {
    const game = createSimonGame(SIMON_LEVELS[0], () => 0.5);
    expect(game.sequence).toHaveLength(4);
    expect(game.phase).toBe('showing');
  });

  it('detects correct and incorrect presses', () => {
    const game = setPhase(
      createSimonGame(SIMON_LEVELS[0], () => 0),
      'awaiting',
    );
    const first = pressPad(game, game.sequence[0]);
    expect(first.correct).toBe(true);
    expect(first.won).toBe(false);

    const wrong = pressPad(first.game, (game.sequence[0] + 1) % 4);
    expect(wrong.correct).toBe(false);
    expect(wrong.game.phase).toBe('failed');
  });
});
