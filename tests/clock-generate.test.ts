import { describe, expect, it } from 'vitest';
import {
  checkClockAnswer,
  formatDigitalTime,
  formatSpokenHungarian,
  generateClockQuestion,
  getClockChoices,
} from '../src/clock/generate';
import { CLOCK_LEVELS } from '../src/clock/types';

describe('clock generate', () => {
  it('formats digital time', () => {
    expect(formatDigitalTime(14, 30)).toBe('2:30');
    expect(formatDigitalTime(12, 0)).toBe('12:00');
  });

  it('formats Hungarian spoken time', () => {
    expect(formatSpokenHungarian(2, 30)).toBe('fél három');
    expect(formatSpokenHungarian(4, 45)).toBe('háromnegyed öt');
  });

  it('creates questions with valid answers', () => {
    const q = generateClockQuestion(CLOCK_LEVELS[0], () => 0.1);
    expect(checkClockAnswer(q, q.answer)).toBe(true);
    const choices = getClockChoices(q, () => 0.5);
    expect(choices).toContain(q.answer);
    expect(choices.length).toBe(4);
  });
});
