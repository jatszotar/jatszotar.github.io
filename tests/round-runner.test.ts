import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cancelPendingRoundSteps,
  createRoundRunnerState,
  getCurrentQuestion,
  progressLabel,
  submitRoundAnswer,
} from '../src/ui/roundRunner';

vi.mock('../src/audio/sounds', () => ({
  playCorrect: vi.fn(),
  playWrong: vi.fn(),
  unlockAudio: vi.fn(),
}));

interface SimpleQ {
  id: string;
  answer: string;
}

describe('round runner', () => {
  const config = {
    questions: [
      { id: 'a', answer: '1' },
      { id: 'b', answer: '2' },
      { id: 'c', answer: '3' },
    ] as SimpleQ[],
    roundSize: 3,
    questionKey: (q: SimpleQ) => q.id,
    checkAnswer: (q: SimpleQ, input: string) => input === q.answer,
    getCorrectAnswer: (q: SimpleQ) => q.answer,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'setTimeout');
  });

  afterEach(() => {
    cancelPendingRoundSteps();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('tracks progress through questions', () => {
    const state = createRoundRunnerState(config);
    expect(getCurrentQuestion(state).id).toBe('a');
    expect(progressLabel(state)).toBe('0 / 3');
  });

  it('initializes retry fields empty', () => {
    const state = createRoundRunnerState(config);
    expect(state.roundPhase).toBe('main');
    expect(state.missedQuestions).toEqual([]);
    expect(state.awaitingAdvance).toBe(false);
  });

  it('advances through a perfect round', () => {
    let state = createRoundRunnerState(config);
    const changes: RoundRunnerStateLike[] = [];
    let result: { correct: number; total: number } | null = null;

    const onChange = (next: typeof state) => {
      state = next;
      changes.push({ phase: next.roundPhase, index: next.currentIndex });
    };
    const onComplete = (r: { correct: number; total: number }) => {
      result = r;
    };

    submitRoundAnswer({ ...state, input: '1' }, config, onComplete, onChange);
    vi.advanceTimersByTime(700);
    expect(state.currentIndex).toBe(1);

    submitRoundAnswer({ ...state, input: '2' }, config, onComplete, onChange);
    vi.advanceTimersByTime(700);
    expect(state.currentIndex).toBe(2);

    submitRoundAnswer({ ...state, input: '3' }, config, onComplete, onChange);
    vi.advanceTimersByTime(700);
    expect(result).toEqual({ correct: 3, total: 3 });
  });

  it('keeps the child answer visible on wrong without revealing the correct one', () => {
    let state = createRoundRunnerState(config);
    const onChange = (next: typeof state) => {
      state = next;
    };

    submitRoundAnswer({ ...state, input: '9' }, config, () => {}, onChange);

    expect(state.lastWrongInput).toBe('9');
    expect(state.revealedAnswer).toBeNull();
    expect(state.input).toBe('');
    expect(state.feedbackType).toBe('wrong');
    expect(state.feedback).toBe('Nem jó! Próbáld újra!');
    expect(state.awaitingAdvance).toBe(true);
  });

  it('enters retry after main phase with missed questions', () => {
    let state = createRoundRunnerState(config);
    const onChange = (next: typeof state) => {
      state = next;
    };

    submitRoundAnswer({ ...state, input: '9' }, config, () => {}, onChange);
    vi.advanceTimersByTime(2200);
    expect(state.missedQuestions).toHaveLength(1);

    submitRoundAnswer({ ...state, input: '2' }, config, () => {}, onChange);
    vi.advanceTimersByTime(700);

    submitRoundAnswer({ ...state, input: '9' }, config, () => {}, onChange);
    vi.advanceTimersByTime(2200);

    submitRoundAnswer({ ...state, input: '3' }, config, () => {}, onChange);
    vi.advanceTimersByTime(700);

    expect(state.roundPhase).toBe('retry');
    expect(state.retryTotal).toBe(2);
  });

  it('requeues a wrong retry answer to the end', () => {
    let state = createRoundRunnerState({
      ...config,
      questions: [
        { id: 'a', answer: '1' },
        { id: 'b', answer: '2' },
      ],
      roundSize: 2,
    });

    const onChange = (next: typeof state) => {
      state = next;
    };

    submitRoundAnswer({ ...state, input: '9' }, config, () => {}, onChange);
    vi.advanceTimersByTime(2200);
    submitRoundAnswer({ ...state, input: '9' }, config, () => {}, onChange);
    vi.advanceTimersByTime(2200);

    expect(state.roundPhase).toBe('retry');
    expect(state.missedQuestions.map((q) => q.id)).toEqual(['a', 'b']);

    submitRoundAnswer({ ...state, input: '9' }, config, () => {}, onChange);
    vi.advanceTimersByTime(2200);

    expect(state.missedQuestions.map((q) => q.id)).toEqual(['b', 'a']);
  });

  it('cancelPendingRoundSteps prevents delayed callbacks', () => {
    let state = createRoundRunnerState(config);
    const onChange = (next: typeof state) => {
      state = next;
    };

    submitRoundAnswer({ ...state, input: '1' }, config, () => {}, onChange);
    expect(state.awaitingAdvance).toBe(true);
    expect(state.currentIndex).toBe(0);
    cancelPendingRoundSteps();
    vi.advanceTimersByTime(700);
    expect(state.currentIndex).toBe(0);
    expect(state.awaitingAdvance).toBe(true);
  });
});

interface RoundRunnerStateLike {
  phase: string;
  index: number;
}
