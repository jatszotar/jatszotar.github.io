import { describe, expect, it } from 'vitest';
import { computeEmojiSizePx } from '../src/ui/fitCountGrid';

describe('computeEmojiSizePx', () => {
  it('fits rows within available height', () => {
    const size = computeEmojiSizePx(200, 4, 8, 16);
    expect(size).toBeCloseTo((200 - 3 * 8 - 4 * 8) / 4 / 1.3, 1);
  });

  it('clamps to minimum size', () => {
    const size = computeEmojiSizePx(40, 4, 8, 16);
    expect(size).toBe(0.85 * 16);
  });

  it('clamps to maximum size', () => {
    const size = computeEmojiSizePx(400, 1, 0, 16);
    expect(size).toBe(2.25 * 16);
  });
});
