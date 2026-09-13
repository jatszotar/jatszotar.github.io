import { renderMemoryHome } from '../ui/memoryHome';
import {
  createMemoryPlaySession,
  destroyMemoryPlay,
  renderMemoryPlay,
} from '../ui/memoryPlay';
import { renderMemorySummary } from '../ui/memorySummary';
import type { MemorySizeKey, MemoryWinResult } from './types';

type MemoryScreen = 'home' | 'play' | 'summary';

export function mountMemory(root: HTMLElement, onExit: () => void): void {
  let screen: MemoryScreen = 'home';
  let memorySize: MemorySizeKey | null = null;
  let memoryResult: MemoryWinResult | null = null;

  const render = (): void => {
    destroyMemoryPlay();
    root.innerHTML = '';

    if (screen === 'home') {
      renderMemoryHome(
        root,
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
      renderMemoryPlay(
        root,
        createMemoryPlaySession(memorySize),
        () => {
          screen = 'home';
          memoryResult = null;
          render();
        },
        (result) => {
          memoryResult = result;
          screen = 'summary';
          render();
        },
      );
      return;
    }

    if (screen === 'summary' && memorySize && memoryResult) {
      renderMemorySummary(
        root,
        memoryResult,
        () => {
          screen = 'play';
          render();
        },
        () => {
          screen = 'home';
          memoryResult = null;
          render();
        },
      );
    }
  };

  render();
}
