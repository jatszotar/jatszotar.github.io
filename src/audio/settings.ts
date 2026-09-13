const STORAGE_KEY = 'memmath-sound-v1';

export function loadSoundEnabled(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return true;
    }
    return raw === 'true';
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEY, String(enabled));
}
