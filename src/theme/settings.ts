export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'memmath-theme-v1';

export function systemTheme(): Theme {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

export function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'dark' || raw === 'light') {
      return raw;
    }
  } catch {
    return systemTheme();
  }
  return systemTheme();
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function nextTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
