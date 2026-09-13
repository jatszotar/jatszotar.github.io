import { createFullscreenToggle } from './fullscreenToggle';
import { createSoundToggle } from './soundToggle';
import { createThemeToggle } from './themeToggle';

export function createHeaderActions(): HTMLDivElement {
  const actions = document.createElement('div');
  actions.className = 'header-actions';
  actions.appendChild(createSoundToggle());
  actions.appendChild(createThemeToggle());
  actions.appendChild(createFullscreenToggle());
  return actions;
}
