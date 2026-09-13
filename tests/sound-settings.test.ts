import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadSoundEnabled, saveSoundEnabled } from '../src/audio/settings';

describe('sound settings', () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to enabled', () => {
    expect(loadSoundEnabled()).toBe(true);
  });

  it('persists disabled state', () => {
    saveSoundEnabled(false);
    expect(loadSoundEnabled()).toBe(false);
  });

  it('persists enabled state', () => {
    saveSoundEnabled(false);
    saveSoundEnabled(true);
    expect(loadSoundEnabled()).toBe(true);
  });
});
