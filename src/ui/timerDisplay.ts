import { formatDuration } from '../timer/format';

const TICK_MS = 250;

export interface TimerDisplayOptions {
  getElapsedMs: () => number;
  pause: () => void;
  resume: () => void;
}

export interface TimerDisplay {
  element: HTMLElement;
  stop: () => void;
}

export function createTimerDisplay(options: TimerDisplayOptions): TimerDisplay {
  const element = document.createElement('span');
  element.className = 'play-timer';

  const update = (): void => {
    element.textContent = formatDuration(options.getElapsedMs());
  };

  const intervalId = globalThis.setInterval(update, TICK_MS);
  update();

  const onVisibilityChange = (): void => {
    if (document.hidden) {
      options.pause();
    } else {
      options.resume();
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);

  return {
    element,
    stop() {
      globalThis.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}
