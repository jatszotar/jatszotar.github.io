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
}

export function createPlayHeader(options: PlayHeaderOptions): HTMLDivElement {
  const header = document.createElement('div');
  header.className = 'play-header';

  if (options.onBack) {
    header.appendChild(createBackButton(options.onBack));
  } else {
    header.appendChild(document.createElement('span'));
  }

  if (options.titleText) {
    const title = document.createElement('h1');
    title.className = 'title play-progress';
    title.textContent = options.titleText;
    header.appendChild(title);
  } else {
    const progress = document.createElement('span');
    progress.className = 'play-progress';
    progress.textContent = options.progressText ?? '';
    header.appendChild(progress);
  }

  header.appendChild(createHeaderActions());
  return header;
}

export function createSectionTitle(text: string): HTMLParagraphElement {
  const title = document.createElement('p');
  title.className = 'section-title';
  title.textContent = text;
  return title;
}
