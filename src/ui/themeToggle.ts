import {
  applyTheme,
  loadTheme,
  nextTheme,
  saveTheme,
  type Theme,
} from '../theme/settings';
import { createMoonIcon, createSunIcon } from './icons';
import { strings } from './strings';

export function createThemeToggle(): HTMLButtonElement {
  let theme: Theme = loadTheme();

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn icon-toggle theme-toggle';

  const update = () => {
    const dark = theme === 'dark';
    // The icon shows what tapping switches to.
    const label = dark ? strings.themeLight : strings.themeDark;
    button.replaceChildren(dark ? createSunIcon() : createMoonIcon());
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', label);
    button.title = label;
  };

  update();

  button.addEventListener('click', () => {
    theme = nextTheme(theme);
    saveTheme(theme);
    applyTheme(theme);
    update();
  });

  return button;
}
