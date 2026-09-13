import { createFullscreenToggle } from './fullscreenToggle';
import { createGitHubLink } from './githubLink';
import { createSoundToggle } from './soundToggle';
import { createThemeToggle } from './themeToggle';
import { createTimerToggle } from './timerToggle';

export function createHeaderActions(): HTMLDivElement {
  const actions = document.createElement('div');
  actions.className = 'header-actions';
  actions.appendChild(createSoundToggle());
  actions.appendChild(createTimerToggle());
  actions.appendChild(createThemeToggle());
  actions.appendChild(createFullscreenToggle());
  actions.appendChild(createGitHubLink());
  return actions;
}
