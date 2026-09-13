import type { GameId } from '../games/registry';
import type { RoundResult } from '../game/types';
import { ROUND_SIZE, UNLOCK_THRESHOLD } from '../game/types';
import {
  loadGameProgress,
  recordBestTime,
  recordRoundResult,
  saveGameProgress,
} from '../progress/store';
import { loadTimerVisible } from '../timer/settings';
import {
  elapsedMs,
  pauseStopwatch,
  resumeStopwatch,
  startStopwatch,
  type StopwatchState,
} from '../timer/stopwatch';
import { renderLevelHome } from './levelHome';
import { renderQuizSummary } from './quizSummary';
import {
  cancelPendingRoundSteps,
  createRoundRunnerState,
  getCurrentQuestion,
  progressLabel,
  submitRoundAnswer,
  submitRoundChoice,
  type RoundRunnerConfig,
  type RoundRunnerState,
} from './roundRunner';
import { setAppToolbarBack } from './appToolbar';
import { createCard, createPlayHeader } from './shell';
import { answerDisplayValueFromState } from './equationDisplay';
import { createKeypad, attachKeypadKeyboard } from './keypad';
import { createChoicePad, type ChoiceVariant } from './choicePad';
import { createTimerDisplay, type TimerDisplay } from './timerDisplay';

type QuizScreen = 'home' | 'play' | 'summary';

interface QuizInputContext<TQuestion> {
  card: HTMLDivElement;
  question: TQuestion;
  state: RoundRunnerState<TQuestion>;
  disabled: boolean;
  onSubmit: (input: string) => void;
  requestRender: () => void;
  registerCleanup: (fn: () => void) => void;
}

type QuizMountOptionsBase<TQuestion, TLevel> = {
  gameId: GameId;
  title: string;
  levels: TLevel[];
  levelLabel: (level: TLevel, index: number) => string;
  generateRound: (level: TLevel, roundSize: number) => TQuestion[];
  questionKey: (question: TQuestion) => string;
  checkAnswer: (question: TQuestion, input: string) => boolean;
  getCorrectAnswer: (question: TQuestion) => string;
  renderPrompt: (
    question: TQuestion,
    state: RoundRunnerState<TQuestion>,
  ) => HTMLElement;
  maxInputDigits?: number;
  inlineAnswer?: boolean;
  extraHomeContent?: (card: HTMLDivElement) => void;
  playClass?: string;
  onPlayPrompt?: (
    promptEl: HTMLElement,
    registerCleanup: (fn: () => void) => void,
  ) => void;
};

export type QuizMountOptions<TQuestion, TLevel> = QuizMountOptionsBase<
  TQuestion,
  TLevel
> &
  (
    | {
        inputMode: 'keypad';
        getChoices?: never;
        renderInput?: never;
      }
    | {
        inputMode: 'choice';
        getChoices: (question: TQuestion) => string[];
        choiceVariant?: (question: TQuestion) => ChoiceVariant;
        renderInput?: never;
      }
    | {
        inputMode: 'custom';
        getChoices?: never;
        renderInput: (ctx: QuizInputContext<TQuestion>) => void;
      }
  );

export function createQuizMount<TQuestion, TLevel>(
  options: QuizMountOptions<TQuestion, TLevel>,
): (root: HTMLElement, onExit: () => void) => void {
  const maxLevelIndex = options.levels.length - 1;
  const maxInputDigits = options.maxInputDigits ?? 2;

  return (root: HTMLElement, onExit: () => void) => {
    let screen: QuizScreen = 'home';
    let progress = loadGameProgress(options.gameId, maxLevelIndex);
    let levelIndex = 0;
    let playState: RoundRunnerState<TQuestion> | null = null;
    let runnerConfig: RoundRunnerConfig<TQuestion> | null = null;
    let lastResult: RoundResult | null = null;
    let stopwatch: StopwatchState | null = null;
    let timerDisplay: TimerDisplay | null = null;
    let lastElapsedMs: number | undefined;
    let lastBestMs: number | undefined;
    let lastIsNewBest = false;
    let cleanup: (() => void) | null = null;

    const stopTimer = (): void => {
      timerDisplay?.stop();
      timerDisplay = null;
      stopwatch = null;
    };

    const startRound = (index: number): void => {
      levelIndex = index;
      lastElapsedMs = undefined;
      lastBestMs = undefined;
      lastIsNewBest = false;
      const level = options.levels[index];
      const questions = options.generateRound(level, ROUND_SIZE);
      runnerConfig = {
        questions,
        questionKey: options.questionKey,
        checkAnswer: options.checkAnswer,
        getCorrectAnswer: options.getCorrectAnswer,
      };
      playState = createRoundRunnerState(runnerConfig);
      stopwatch = startStopwatch(Date.now());
      timerDisplay = createTimerDisplay({
        getElapsedMs: () =>
          stopwatch ? elapsedMs(stopwatch, Date.now()) : 0,
        pause: () => {
          if (stopwatch) {
            stopwatch = pauseStopwatch(stopwatch, Date.now());
          }
        },
        resume: () => {
          if (stopwatch) {
            stopwatch = resumeStopwatch(stopwatch, Date.now());
          }
        },
      });
      screen = 'play';
      render();
    };

    const render = (): void => {
      cleanup?.();
      cleanup = () => {
        cancelPendingRoundSteps();
      };
      root.innerHTML = '';

      if (screen === 'home') {
        renderLevelHome(root, {
          title: options.title,
          levels: options.levels,
          levelLabel: options.levelLabel,
          progress,
          onStart: startRound,
          onBack: onExit,
          extraContent: options.extraHomeContent,
        });
        return;
      }

      if (screen === 'play' && playState && runnerConfig) {
        const state = playState;
        const config = runnerConfig;
        const card = createCard();
        card.classList.add('card-play');
        if (options.playClass) {
          card.classList.add(options.playClass);
        }

        const play = document.createElement('div');
        play.className = 'quiz-play';

        setAppToolbarBack(() => {
          stopTimer();
          screen = 'home';
          playState = null;
          runnerConfig = null;
          render();
        });

        const header = createPlayHeader({
          progressText: progressLabel(state),
          centerExtra: timerDisplay?.element,
        });
        play.appendChild(header);

        const body = document.createElement('div');
        body.className = 'quiz-play-body';

        const question = getCurrentQuestion(state);
        const prompt = options.renderPrompt(question, state);

        const promptArea = document.createElement('div');
        promptArea.className = 'quiz-play-prompt';
        promptArea.appendChild(prompt);
        body.appendChild(promptArea);

        if (options.onPlayPrompt) {
          const registerPromptCleanup = (fn: () => void) => {
            const baseCleanup = cleanup;
            cleanup = () => {
              baseCleanup?.();
              fn();
            };
          };
          options.onPlayPrompt(prompt, registerPromptCleanup);
        }

        const feedback = document.createElement('div');
        feedback.className = `feedback ${state.feedbackType}`;
        feedback.textContent = state.feedback;
        body.appendChild(feedback);

        const inputArea = document.createElement('div');
        inputArea.className = 'quiz-play-input';

        const onChange = (next: RoundRunnerState<TQuestion>) => {
          playState = next;
          render();
        };

        const onComplete = (result: RoundResult) => {
          const roundElapsedMs = stopwatch
            ? elapsedMs(stopwatch, Date.now())
            : 0;
          stopTimer();

          const bestTimeResult = recordBestTime(
            progress,
            levelIndex,
            roundElapsedMs,
          );
          progress = recordRoundResult(
            bestTimeResult.progress,
            levelIndex,
            result,
            maxLevelIndex,
            UNLOCK_THRESHOLD,
          );
          saveGameProgress(options.gameId, progress);
          lastResult = result;
          lastElapsedMs = roundElapsedMs;
          lastBestMs = progress.bestTimesMs?.[levelIndex];
          lastIsNewBest = bestTimeResult.isNewBest;
          playState = null;
          runnerConfig = null;
          screen = 'summary';
          render();
        };

        const submitInput = (input: string) => {
          submitRoundAnswer(
            { ...state, input },
            config,
            onComplete,
            onChange,
          );
        };

        if (options.inputMode === 'keypad') {
          if (!options.inlineAnswer) {
            const answerBox = document.createElement('div');
            answerBox.className = `answer-display ${state.feedbackType}`;
            answerBox.textContent = answerDisplayValueFromState(state);
            inputArea.appendChild(answerBox);
          }

          const keypadHandlers = {
            disabled: state.awaitingAdvance,
            maxDigits: maxInputDigits,
            onDigit: (digit: string) => {
              if (state.input.length >= maxInputDigits) {
                return;
              }
              onChange({
                ...state,
                input: state.input + digit,
                lastWrongInput: null,
                feedback: '',
                feedbackType: 'none',
              });
            },
            onClear: () => {
              onChange({
                ...state,
                input: '',
                lastWrongInput: null,
                feedback: '',
                feedbackType: 'none',
              });
            },
            onSubmit: () => {
              submitRoundAnswer(state, config, onComplete, onChange);
            },
          };

          inputArea.appendChild(
            createKeypad(keypadHandlers),
          );

          const controller = new AbortController();
          attachKeypadKeyboard(
            {
              ...keypadHandlers,
              getInputLength: () => state.input.length,
            },
            controller.signal,
          );
          const baseCleanup = cleanup;
          cleanup = () => {
            baseCleanup?.();
            controller.abort();
          };
        } else if (options.inputMode === 'choice') {
          const choices = options.getChoices(question);
          const choicePad = createChoicePad({
            choices,
            disabled: state.awaitingAdvance,
            variant: options.choiceVariant?.(question),
            wrongChoice:
              state.feedbackType === 'wrong' ? state.lastWrongInput : null,
            onChoice: (choice) => {
              submitRoundChoice(state, config, choice, onComplete, onChange);
            },
          });
          inputArea.appendChild(choicePad);
        } else {
          const registerCleanup = (fn: () => void) => {
            const baseCleanup = cleanup;
            cleanup = () => {
              baseCleanup?.();
              fn();
            };
          };

          options.renderInput({
            card: inputArea,
            question,
            state,
            disabled: state.awaitingAdvance,
            onSubmit: submitInput,
            requestRender: () => render(),
            registerCleanup,
          });
        }

        play.appendChild(body);
        play.appendChild(inputArea);
        card.appendChild(play);
        root.appendChild(card);
        return;
      }

      if (screen === 'summary' && lastResult) {
        const timerVisible = loadTimerVisible();
        const goHome = () => {
          screen = 'home';
          lastResult = null;
          lastElapsedMs = undefined;
          lastBestMs = undefined;
          lastIsNewBest = false;
          render();
        };
        setAppToolbarBack(goHome);
        const summaryCleanup = renderQuizSummary(root, {
          levelIndex,
          maxLevelIndex,
          result: lastResult,
          progress,
          levelLabel: (index) =>
            options.levelLabel(options.levels[index], index),
          elapsedMs: timerVisible ? lastElapsedMs : undefined,
          bestMs: timerVisible ? lastBestMs : undefined,
          isNewBest: timerVisible ? lastIsNewBest : false,
          onReplay: () => startRound(levelIndex),
          onNextLevel: () => startRound(levelIndex + 1),
          onHome: goHome,
        });
        const baseCleanup = cleanup;
        cleanup = () => {
          baseCleanup();
          summaryCleanup();
        };
      }
    };

    render();
  };
}
