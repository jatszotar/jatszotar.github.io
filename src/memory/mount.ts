import {
  loadGameProgress,
  recordBestTime,
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
import { setAppToolbarBack } from '../ui/appToolbar';
import { renderMemoryHome } from '../ui/memoryHome';
import {
  createMemoryPlaySession,
  destroyMemoryPlay,
  renderMemoryPlay,
} from '../ui/memoryPlay';
import { renderMemorySummary } from '../ui/memorySummary';
import { createTimerDisplay, type TimerDisplay } from '../ui/timerDisplay';
import {
  MEMORY_SIZES,
  memorySizeIndex,
  type MemorySizeKey,
  type MemoryWinResult,
} from './types';

type MemoryScreen = 'home' | 'play' | 'summary';

export function mountMemory(root: HTMLElement, onExit: () => void): void {
  const maxSizeIndex = MEMORY_SIZES.length - 1;
  let screen: MemoryScreen = 'home';
  let progress = loadGameProgress('memory', maxSizeIndex);
  let memorySize: MemorySizeKey | null = null;
  let memoryResult: MemoryWinResult | null = null;
  let stopwatch: StopwatchState | null = null;
  let timerDisplay: TimerDisplay | null = null;
  let lastElapsedMs: number | undefined;
  let lastBestMs: number | undefined;
  let lastIsNewBest = false;
  let summaryCleanup: (() => void) | null = null;

  const stopTimer = (): void => {
    timerDisplay?.stop();
    timerDisplay = null;
    stopwatch = null;
  };

  const startTimer = (): void => {
    stopTimer();
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
  };

  const render = (): void => {
    destroyMemoryPlay();
    summaryCleanup?.();
    summaryCleanup = null;
    root.innerHTML = '';

    if (screen === 'home') {
      stopTimer();
      lastElapsedMs = undefined;
      lastBestMs = undefined;
      lastIsNewBest = false;
      renderMemoryHome(
        root,
        progress,
        (sizeKey) => {
          memorySize = sizeKey;
          memoryResult = null;
          screen = 'play';
          render();
        },
        onExit,
      );
      return;
    }

    if (screen === 'play' && memorySize) {
      startTimer();
      renderMemoryPlay(
        root,
        createMemoryPlaySession(memorySize),
        () => {
          stopTimer();
          screen = 'home';
          memoryResult = null;
          render();
        },
        (result) => {
          const roundElapsedMs = stopwatch
            ? elapsedMs(stopwatch, Date.now())
            : 0;
          stopTimer();
          const sizeIndex = memorySizeIndex(memorySize!);
          const bestTimeResult = recordBestTime(
            progress,
            sizeIndex,
            roundElapsedMs,
          );
          progress = bestTimeResult.progress;
          saveGameProgress('memory', progress);
          lastElapsedMs = roundElapsedMs;
          lastBestMs = progress.bestTimesMs?.[sizeIndex];
          lastIsNewBest = bestTimeResult.isNewBest;
          memoryResult = result;
          screen = 'summary';
          render();
        },
        timerDisplay?.element,
      );
      return;
    }

    if (screen === 'summary' && memorySize && memoryResult) {
      const timerVisible = loadTimerVisible();
      const goHome = () => {
        screen = 'home';
        memoryResult = null;
        render();
      };
      setAppToolbarBack(goHome);
      summaryCleanup = renderMemorySummary(
        root,
        memoryResult,
        {
          elapsedMs: timerVisible ? lastElapsedMs : undefined,
          bestMs: timerVisible ? lastBestMs : undefined,
          isNewBest: timerVisible ? lastIsNewBest : false,
        },
        () => {
          screen = 'play';
          render();
        },
        goHome,
      );
    }
  };

  render();
}
