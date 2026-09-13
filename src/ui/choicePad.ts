export type ChoiceVariant = 'compact' | 'wide';

export interface ChoicePadOptions {
  choices: string[];
  disabled?: boolean;
  variant?: ChoiceVariant;
  wrongChoice?: string | null;
  onChoice: (choice: string) => void;
}

export function createChoicePad(options: ChoicePadOptions): HTMLDivElement {
  const pad = document.createElement('div');
  const variant = options.variant ?? 'compact';
  pad.className =
    variant === 'wide' ? 'choice-pad choice-pad-wide' : 'choice-pad';
  const disabled = options.disabled ?? false;

  for (const choice of options.choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className =
      variant === 'wide' ? 'btn choice-btn choice-btn-wide' : 'btn choice-btn';
    button.textContent = choice;
    button.disabled = disabled;
    if (options.wrongChoice === choice) {
      button.classList.add('choice-wrong');
    }
    button.addEventListener('click', () => {
      if (!disabled) {
        options.onChoice(choice);
      }
    });
    pad.appendChild(button);
  }

  return pad;
}
