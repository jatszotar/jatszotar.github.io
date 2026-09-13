import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { attachSummaryKeyboard } from '../src/ui/summaryKeyboard';

describe('summary keyboard', () => {
  const controllers: AbortController[] = [];
  const listeners = new Map<string, Set<EventListener>>();

  beforeEach(() => {
    listeners.clear();
    vi.stubGlobal('window', {
      addEventListener: (
        type: string,
        listener: EventListener,
        options?: { signal?: AbortSignal },
      ) => {
        if (!listeners.has(type)) {
          listeners.set(type, new Set());
        }
        listeners.get(type)!.add(listener);
        options?.signal?.addEventListener('abort', () => {
          listeners.get(type)?.delete(listener);
        });
      },
    });
  });

  afterEach(() => {
    for (const controller of controllers) {
      controller.abort();
    }
    controllers.length = 0;
    vi.unstubAllGlobals();
  });

  const dispatchKey = (key: string): void => {
    const event = {
      key,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;
    for (const listener of listeners.get('keydown') ?? []) {
      listener(event);
    }
  };

  it('calls onEnter when Enter is pressed', () => {
    const onEnter = vi.fn();
    const controller = new AbortController();
    controllers.push(controller);

    attachSummaryKeyboard(onEnter, controller.signal);
    dispatchKey('Enter');

    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('ignores other keys', () => {
    const onEnter = vi.fn();
    const controller = new AbortController();
    controllers.push(controller);

    attachSummaryKeyboard(onEnter, controller.signal);
    dispatchKey('a');
    dispatchKey('Escape');

    expect(onEnter).not.toHaveBeenCalled();
  });

  it('stops listening after abort', () => {
    const onEnter = vi.fn();
    const controller = new AbortController();
    controllers.push(controller);

    attachSummaryKeyboard(onEnter, controller.signal);
    controller.abort();
    dispatchKey('Enter');

    expect(onEnter).not.toHaveBeenCalled();
  });
});
