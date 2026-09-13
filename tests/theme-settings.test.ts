import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadTheme, nextTheme, saveTheme } from '../src/theme/settings';

describe('theme settings', () => {
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
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: false }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back to the system preference', () => {
    expect(loadTheme()).toBe('light');
  });

  it('prefers dark when the system does', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: true }),
    });
    expect(loadTheme()).toBe('dark');
  });

  it('persists the chosen theme', () => {
    saveTheme('dark');
    expect(loadTheme()).toBe('dark');
    saveTheme('light');
    expect(loadTheme()).toBe('light');
  });

  it('ignores unknown stored values', () => {
    store.set('memmath-theme-v1', 'banana');
    expect(loadTheme()).toBe('light');
  });

  it('toggles between themes', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });
});
