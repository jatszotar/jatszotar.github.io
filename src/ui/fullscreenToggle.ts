import {
  createFullscreenEnterIcon,
  createFullscreenExitIcon,
} from './icons';
import { strings } from './strings';

function isFullscreen(): boolean {
  return Boolean(document.fullscreenElement);
}

export function createFullscreenToggle(): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn icon-toggle fullscreen-toggle';

  const update = () => {
    const active = isFullscreen();
    const label = active ? strings.fullscreenExit : strings.fullscreenEnter;
    button.replaceChildren(
      active ? createFullscreenExitIcon() : createFullscreenEnterIcon(),
    );
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', label);
    button.title = label;
  };

  update();

  button.addEventListener('click', () => {
    if (isFullscreen()) {
      void document.exitFullscreen();
      return;
    }
    void document.documentElement.requestFullscreen();
  });

  document.addEventListener('fullscreenchange', update);

  return button;
}
