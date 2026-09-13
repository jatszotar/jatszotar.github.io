const STORAGE_KEY = 'memmath-timer-v1';

export function loadTimerVisible(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return false;
    }
    return raw === 'true';
  } catch {
    return false;
  }
}

export function saveTimerVisible(visible: boolean): void {
  localStorage.setItem(STORAGE_KEY, String(visible));
}

export function applyTimerVisible(visible: boolean): void {
  document.documentElement.dataset.timer = visible ? 'on' : 'off';
}
