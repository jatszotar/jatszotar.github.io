export interface ChoicePadOptions {
  choices: string[];
  disabled?: boolean;
  onChoice: (choice: string) => void;
}

export function createChoicePad(options: ChoicePadOptions): HTMLDivElement {
  const pad = document.createElement('div');
  pad.className = 'choice-pad';
  const disabled = options.disabled ?? false;

  for (const choice of options.choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn choice-btn';
    button.textContent = choice;
    button.disabled = disabled;
    button.addEventListener('click', () => {
      if (!disabled) {
        options.onChoice(choice);
      }
    });
    pad.appendChild(button);
  }

  return pad;
}
