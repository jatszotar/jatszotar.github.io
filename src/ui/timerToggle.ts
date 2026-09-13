import {
  applyTimerVisible,
  loadTimerVisible,
  saveTimerVisible,
} from '../timer/settings';
import { createClockIcon, createClockOffIcon } from './icons';
import { strings } from './strings';

export function createTimerToggle(onChange?: () => void): HTMLButtonElement {
  let visible = loadTimerVisible();

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn icon-toggle timer-toggle';

  const update = () => {
    const label = visible ? strings.timerHide : strings.timerShow;
    button.replaceChildren(
      visible ? createClockIcon() : createClockOffIcon(),
    );
    button.setAttribute('aria-pressed', String(visible));
    button.setAttribute('aria-label', label);
    button.title = label;
  };

  update();

  button.addEventListener('click', () => {
    visible = !visible;
    saveTimerVisible(visible);
    applyTimerVisible(visible);
    update();
    onChange?.();
  });

  return button;
}
