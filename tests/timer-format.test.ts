import { describe, expect, it } from 'vitest';
import { formatDuration } from '../src/timer/format';

describe('formatDuration', () => {
  it('formats sub-minute durations in seconds', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(999)).toBe('0s');
    expect(formatDuration(42_500)).toBe('42s');
    expect(formatDuration(59_999)).toBe('59s');
  });

  it('formats minute durations as m:ss', () => {
    expect(formatDuration(60_000)).toBe('1:00');
    expect(formatDuration(64_000)).toBe('1:04');
    expect(formatDuration(3_599_000)).toBe('59:59');
  });
});
