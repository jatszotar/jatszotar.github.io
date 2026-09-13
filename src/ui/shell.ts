import { createBackButton } from './backButton';
import { createHeaderActions } from './headerActions';

export function createCard(): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'card';
  return card;
}

export interface PlayHeaderOptions {
  onBack?: () => void;
  progressText?: string;
  titleText?: string;
  centerExtra?: HTMLElement;
}

export function createPlayHeader(options: PlayHeaderOptions): HTMLDivElement {
  const header = document.createElement('div');
  header.className = 'play-header';

  if (options.titleText) {
    header.classList.add('play-header-titled');

    const toolbar = document.createElement('div');
    toolbar.className = 'play-header-toolbar';

    if (options.onBack) {
      toolbar.appendChild(createBackButton(options.onBack));
    }

    toolbar.appendChild(createHeaderActions());
    header.appendChild(toolbar);

    const title = document.createElement('h1');
    title.className = 'screen-title';
    title.textContent = options.titleText;
    header.appendChild(title);
  } else {
    if (options.onBack) {
      header.appendChild(createBackButton(options.onBack));
    } else {
      header.appendChild(document.createElement('span'));
    }

    const center = document.createElement('div');
    center.className = 'play-header-center';

    if (options.progressText) {
      const progress = document.createElement('span');
      progress.className = 'play-progress';
      progress.textContent = options.progressText;
      center.appendChild(progress);
    }

    if (options.centerExtra) {
      center.appendChild(options.centerExtra);
    }

    header.appendChild(center);
    header.appendChild(createHeaderActions());
  }

  return header;
}

export function createSectionTitle(text: string): HTMLParagraphElement {
  const title = document.createElement('p');
  title.className = 'section-title';
  title.textContent = text;
  return title;
}
