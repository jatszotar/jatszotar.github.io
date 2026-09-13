import type { RoundResult } from '../game/types';
import { ROUND_SIZE } from '../game/types';
import { playCorrect, playWrong } from '../audio/sounds';
import { strings } from './strings';

export type RoundPhase = 'main' | 'retry';

const CORRECT_PAUSE_MS = 700;
const WRONG_REVEAL_MS = 2200;

export interface RoundScheduler {
  schedule(callback: () => void, delayMs: number): () => void;
}

export function createDefaultScheduler(): RoundScheduler {
  return {
    schedule(callback, delayMs) {
      const id = globalThis.setTimeout(callback, delayMs);
      return () => globalThis.clearTimeout(id);
    },
  };
}

let activeScheduler: RoundScheduler = createDefaultScheduler();
const pendingCancels: Array<() => void> = [];

export function setRoundScheduler(scheduler: RoundScheduler): () => void {
  const previous = activeScheduler;
  activeScheduler = scheduler;
  return () => {
    activeScheduler = previous;
  };
}

export function cancelPendingRoundSteps(): void {
  for (const cancel of pendingCancels) {
    cancel();
  }
  pendingCancels.length = 0;
}

function scheduleStep(callback: () => void, delayMs: number): void {
  const cancel = activeScheduler.schedule(callback, delayMs);
  pendingCancels.push(cancel);
}

export interface RoundRunnerState<T> {
  questions: T[];
  currentIndex: number;
  roundPhase: RoundPhase;
  correctCount: number;
  missedQuestions: T[];
  retryTotal: number;
  retryDone: number;
  input: string;
  revealedAnswer: string | null;
  lastWrongInput: string | null;
  feedback: string;
  feedbackType: 'none' | 'correct' | 'wrong';
  awaitingAdvance: boolean;
  roundSize: number;
}

export interface RoundRunnerConfig<T> {
  questions: T[];
  roundSize?: number;
  questionKey: (question: T) => string;
  checkAnswer: (question: T, input: string) => boolean;
  getCorrectAnswer: (question: T) => string;
}

export function createRoundRunnerState<T>(
  config: RoundRunnerConfig<T>,
): RoundRunnerState<T> {
  const roundSize = config.roundSize ?? ROUND_SIZE;
  const questions = config.questions.slice(0, roundSize);
  return {
    questions,
    currentIndex: 0,
    roundPhase: 'main',
    correctCount: 0,
    missedQuestions: [],
    retryTotal: 0,
    retryDone: 0,
    input: '',
    revealedAnswer: null,
    lastWrongInput: null,
    feedback: '',
    feedbackType: 'none',
    awaitingAdvance: false,
    roundSize,
  };
}

export function getCurrentQuestion<T>(state: RoundRunnerState<T>): T {
  if (state.roundPhase === 'retry') {
    return state.missedQuestions[0];
  }
  return state.questions[state.currentIndex];
}

export function progressLabel<T>(state: RoundRunnerState<T>): string {
  if (state.roundPhase === 'retry') {
    return strings.retryProgress(state.retryDone + 1, state.retryTotal);
  }
  return strings.progress(state.correctCount, state.roundSize);
}

/** The main phase draws from a fixed list, so it ends when the list is used up. */
function isMainPhaseOver<T>(state: RoundRunnerState<T>): boolean {
  return state.currentIndex + 1 >= state.questions.length;
}

function enterRetryPhase<T>(state: RoundRunnerState<T>): RoundRunnerState<T> {
  return {
    ...state,
    roundPhase: 'retry',
    correctCount: state.roundSize,
    retryTotal: state.missedQuestions.length,
    retryDone: 0,
    input: '',
    revealedAnswer: null,
    lastWrongInput: null,
    feedback: strings.retryStart,
    feedbackType: 'none',
    awaitingAdvance: false,
  };
}

function addMissedQuestion<T>(
  missed: T[],
  question: T,
  questionKey: (q: T) => string,
): T[] {
  const key = questionKey(question);
  if (missed.some((item) => questionKey(item) === key)) {
    return missed;
  }
  return [...missed, question];
}

function requeueMissedQuestion<T>(queue: T[], current: T): T[] {
  const rest = queue.slice(1);
  return [...rest, current];
}

function advanceToNextQuestion<T>(
  state: RoundRunnerState<T>,
): RoundRunnerState<T> {
  return {
    ...state,
    currentIndex: state.currentIndex + 1,
    input: '',
    revealedAnswer: null,
    lastWrongInput: null,
    feedback: '',
    feedbackType: 'none',
    awaitingAdvance: false,
  };
}

export function submitRoundAnswer<T>(
  state: RoundRunnerState<T>,
  config: RoundRunnerConfig<T>,
  onComplete: (result: RoundResult) => void,
  onChange: (next: RoundRunnerState<T>) => void,
): void {
  if (state.awaitingAdvance || state.input.length === 0) {
    return;
  }

  const question = getCurrentQuestion(state);
  const correct = config.checkAnswer(question, state.input);

  if (correct) {
    playCorrect();

    if (state.roundPhase === 'retry') {
      const remaining = state.missedQuestions.slice(1);
      const nextSession: RoundRunnerState<T> = {
        ...state,
        retryDone: state.retryDone + 1,
        feedback: strings.correct,
        feedbackType: 'correct',
        awaitingAdvance: true,
      };
      onChange(nextSession);

      scheduleStep(() => {
        if (remaining.length === 0) {
          onComplete({ correct: state.roundSize, total: state.roundSize });
          return;
        }
        onChange({
          ...nextSession,
          missedQuestions: remaining,
          input: '',
          revealedAnswer: null,
          lastWrongInput: null,
          feedback: '',
          feedbackType: 'none',
          awaitingAdvance: false,
        });
      }, CORRECT_PAUSE_MS);
      return;
    }

    const correctCount = state.correctCount + 1;
    const nextSession: RoundRunnerState<T> = {
      ...state,
      correctCount,
      feedback: strings.correct,
      feedbackType: 'correct',
      awaitingAdvance: true,
    };
    onChange(nextSession);

    scheduleStep(() => {
      if (isMainPhaseOver(state)) {
        if (nextSession.missedQuestions.length === 0) {
          onComplete({ correct: correctCount, total: state.roundSize });
          return;
        }
        onChange(enterRetryPhase(nextSession));
        return;
      }
      onChange(advanceToNextQuestion(nextSession));
    }, CORRECT_PAUSE_MS);
    return;
  }

  playWrong();
  const wrongInput = state.input;

  if (state.roundPhase === 'retry') {
    const missedQuestions = requeueMissedQuestion(
      state.missedQuestions,
      state.missedQuestions[0],
    );
    const nextSession: RoundRunnerState<T> = {
      ...state,
      input: '',
      revealedAnswer: null,
      lastWrongInput: wrongInput,
      feedback: strings.wrongGiven(wrongInput),
      feedbackType: 'wrong',
      awaitingAdvance: true,
    };
    onChange(nextSession);

    scheduleStep(() => {
      onChange({
        ...nextSession,
        missedQuestions,
        input: '',
        revealedAnswer: null,
        lastWrongInput: null,
        feedback: '',
        feedbackType: 'none',
        awaitingAdvance: false,
      });
    }, WRONG_REVEAL_MS);
    return;
  }

  const missedQuestions = addMissedQuestion(
    state.missedQuestions,
    question,
    config.questionKey,
  );

  const nextSession: RoundRunnerState<T> = {
    ...state,
    missedQuestions,
    input: '',
    revealedAnswer: null,
    lastWrongInput: wrongInput,
    feedback: strings.wrongGiven(wrongInput),
    feedbackType: 'wrong',
    awaitingAdvance: true,
  };
  onChange(nextSession);

  scheduleStep(() => {
    if (isMainPhaseOver(state)) {
      onChange(enterRetryPhase(nextSession));
      return;
    }
    onChange(advanceToNextQuestion(nextSession));
  }, WRONG_REVEAL_MS);
}

export function submitRoundChoice<T>(
  state: RoundRunnerState<T>,
  config: RoundRunnerConfig<T>,
  choice: string,
  onComplete: (result: RoundResult) => void,
  onChange: (next: RoundRunnerState<T>) => void,
): void {
  if (state.awaitingAdvance) {
    return;
  }
  submitRoundAnswer(
    { ...state, input: choice },
    config,
    onComplete,
    onChange,
  );
}
