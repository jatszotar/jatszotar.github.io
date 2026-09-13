export interface StopwatchState {
  startedAt: number;
  accumulatedMs: number;
  pausedAt: number | null;
}

export function startStopwatch(now: number): StopwatchState {
  return {
    startedAt: now,
    accumulatedMs: 0,
    pausedAt: null,
  };
}

export function pauseStopwatch(
  state: StopwatchState,
  now: number,
): StopwatchState {
  if (state.pausedAt !== null) {
    return state;
  }
  return {
    ...state,
    accumulatedMs: state.accumulatedMs + (now - state.startedAt),
    pausedAt: now,
  };
}

export function resumeStopwatch(
  state: StopwatchState,
  now: number,
): StopwatchState {
  if (state.pausedAt === null) {
    return state;
  }
  return {
    startedAt: now,
    accumulatedMs: state.accumulatedMs,
    pausedAt: null,
  };
}

export function elapsedMs(state: StopwatchState, now: number): number {
  if (state.pausedAt !== null) {
    return state.accumulatedMs;
  }
  return state.accumulatedMs + (now - state.startedAt);
}
