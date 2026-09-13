import { createBackButton } from './backButton';
import { createHeaderActions } from './headerActions';

let backSlot: HTMLDivElement | null = null;

export function createAppToolbar(): HTMLElement {
  const toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar';

  backSlot = document.createElement('div');
  backSlot.className = 'app-toolbar-back';

  const actions = document.createElement('div');
  actions.className = 'app-toolbar-actions';
  actions.appendChild(createHeaderActions());

  toolbar.appendChild(backSlot);
  toolbar.appendChild(actions);
  return toolbar;
}

export function setAppToolbarBack(onBack: (() => void) | null): void {
  if (!backSlot) {
    return;
  }

  backSlot.replaceChildren();
  if (onBack) {
    backSlot.appendChild(createBackButton(onBack));
  }
}
