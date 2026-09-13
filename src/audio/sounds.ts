import { loadSoundEnabled } from './settings';

let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function unlockAudio(): Promise<void> {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}

function playTone(
  frequency: number,
  durationMs: number,
  type: OscillatorType,
  volume = 0.12,
): void {
  const ctx = getContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000);
}

export function playCorrect(): void {
  if (!loadSoundEnabled()) {
    return;
  }
  void unlockAudio().then(() => {
    playTone(523.25, 120, 'sine', 0.1);
    window.setTimeout(() => {
      playTone(659.25, 160, 'sine', 0.09);
    }, 110);
  });
}

export function playWrong(): void {
  if (!loadSoundEnabled()) {
    return;
  }
  void unlockAudio().then(() => {
    playTone(220, 180, 'square', 0.06);
  });
}

export function playFlip(): void {
  if (!loadSoundEnabled()) {
    return;
  }
  void unlockAudio().then(() => {
    playTone(392, 70, 'sine', 0.05);
  });
}

const NOTE_FREQUENCIES = [261.63, 329.63, 392.0, 523.25];

export function playNote(index: 0 | 1 | 2 | 3): void {
  if (!loadSoundEnabled()) {
    return;
  }
  void unlockAudio().then(() => {
    playTone(NOTE_FREQUENCIES[index], 200, 'sine', 0.12);
  });
}
