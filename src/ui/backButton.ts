import { createBackIcon } from './icons';
import { strings } from './strings';

export function createBackButton(
  onClick: () => void,
  options?: { id?: string },
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn icon-toggle back-toggle';
  button.appendChild(createBackIcon());
  button.setAttribute('aria-label', strings.home);
  button.title = strings.home;
  if (options?.id) {
    button.id = options.id;
  }
  button.addEventListener('click', onClick);
  return button;
}
