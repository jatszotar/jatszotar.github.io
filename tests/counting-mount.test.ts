import { describe, expect, it } from 'vitest';
import { COUNTING_LEVELS } from '../src/counting/types';

function groupCount(itemCount: number): number {
  return Math.ceil(itemCount / 5);
}

describe('counting fives layout', () => {
  it('uses one group per five items', () => {
    expect(groupCount(10)).toBe(2);
    expect(groupCount(17)).toBe(4);
    expect(groupCount(20)).toBe(4);
  });

  it('level 3 is fives layout up to 20', () => {
    expect(COUNTING_LEVELS[2]).toEqual({ min: 1, max: 20, layout: 'fives' });
  });
});
