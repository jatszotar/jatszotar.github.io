import { describe, expect, it } from 'vitest';
import {
  elapsedMs,
  pauseStopwatch,
  resumeStopwatch,
  startStopwatch,
} from '../src/timer/stopwatch';

describe('stopwatch', () => {
  it('starts at zero elapsed', () => {
    const state = startStopwatch(1000);
    expect(elapsedMs(state, 1000)).toBe(0);
    expect(elapsedMs(state, 3500)).toBe(2500);
  });

  it('pauses and freezes elapsed time', () => {
    let state = startStopwatch(0);
    state = pauseStopwatch(state, 2000);
    expect(elapsedMs(state, 5000)).toBe(2000);
  });

  it('resumes counting after pause', () => {
    let state = startStopwatch(0);
    state = pauseStopwatch(state, 2000);
    state = resumeStopwatch(state, 8000);
    expect(elapsedMs(state, 9000)).toBe(3000);
  });

  it('ignores duplicate pause calls', () => {
    let state = startStopwatch(0);
    state = pauseStopwatch(state, 1000);
    state = pauseStopwatch(state, 5000);
    expect(elapsedMs(state, 9000)).toBe(1000);
  });

  it('ignores resume when not paused', () => {
    const state = startStopwatch(0);
    const resumed = resumeStopwatch(state, 5000);
    expect(elapsedMs(resumed, 7000)).toBe(7000);
  });
});
