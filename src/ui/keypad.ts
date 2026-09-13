import { unlockAudio } from '../audio/sounds';
import { strings } from './strings';

export interface KeypadOptions {
  disabled?: boolean;
  maxDigits?: number;
  onDigit: (digit: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export function createKeypad(options: KeypadOptions): HTMLDivElement {
  const keypad = document.createElement('div');
  keypad.className = 'keypad';
  const disabled = options.disabled ?? false;

  const appendDigit = (digit: string) => {
    if (disabled) {
      return;
    }
    void unlockAudio();
    options.onDigit(digit);
  };

  for (let digit = 1; digit <= 9; digit += 1) {
    const key = document.createElement('button');
    key.type = 'button';
    key.className = 'btn key';
    key.textContent = String(digit);
    key.disabled = disabled;
    key.addEventListener('click', () => appendDigit(String(digit)));
    keypad.appendChild(key);
  }

  const clearKey = document.createElement('button');
  clearKey.type = 'button';
  clearKey.className = 'btn key';
  clearKey.textContent = strings.clear;
  clearKey.disabled = disabled;
  clearKey.addEventListener('click', () => {
    if (!disabled) {
      options.onClear();
    }
  });
  keypad.appendChild(clearKey);

  const zeroKey = document.createElement('button');
  zeroKey.type = 'button';
  zeroKey.className = 'btn key';
  zeroKey.textContent = '0';
  zeroKey.disabled = disabled;
  zeroKey.addEventListener('click', () => appendDigit('0'));
  keypad.appendChild(zeroKey);

  const submitKey = document.createElement('button');
  submitKey.type = 'button';
  submitKey.className = 'btn btn-primary key';
  submitKey.textContent = strings.submit;
  submitKey.disabled = disabled;
  submitKey.addEventListener('click', () => {
    if (!disabled) {
      options.onSubmit();
    }
  });
  keypad.appendChild(submitKey);

  return keypad;
}

export function attachKeypadKeyboard(
  options: KeypadOptions & { getInputLength: () => number },
  signal: AbortSignal,
): void {
  const handleKeyboard = (event: KeyboardEvent) => {
    if (options.disabled) {
      return;
    }

    if (event.key >= '0' && event.key <= '9') {
      if (options.getInputLength() < (options.maxDigits ?? 2)) {
        void unlockAudio();
        options.onDigit(event.key);
      }
      return;
    }

    if (event.key === 'Backspace') {
      options.onClear();
      return;
    }

    if (event.key === 'Enter') {
      options.onSubmit();
    }
  };

  window.addEventListener('keydown', handleKeyboard, { signal });
}
