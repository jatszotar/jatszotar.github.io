import { unlockAudio } from '../audio/sounds';
import { loadSoundEnabled, saveSoundEnabled } from '../audio/settings';
import { createSoundOffIcon, createSoundOnIcon } from './icons';
import { strings } from './strings';

export function createSoundToggle(onChange?: () => void): HTMLButtonElement {
  let enabled = loadSoundEnabled();

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn icon-toggle sound-toggle';

  const update = () => {
    const label = enabled ? strings.soundHide : strings.soundShow;
    button.replaceChildren(
      enabled ? createSoundOnIcon() : createSoundOffIcon(),
    );
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', label);
    button.title = label;
  };

  update();

  button.addEventListener('click', () => {
    enabled = !enabled;
    saveSoundEnabled(enabled);
    void unlockAudio();
    update();
    onChange?.();
  });

  return button;
}
