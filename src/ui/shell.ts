export function createCard(): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'card';
  return card;
}

export interface PlayHeaderOptions {
  progressText?: string;
  titleText?: string;
  centerExtra?: HTMLElement;
}

export function createPlayHeader(options: PlayHeaderOptions): HTMLDivElement {
  const header = document.createElement('div');

  if (options.titleText) {
    header.className = 'play-header play-header-stacked';
    const title = document.createElement('h1');
    title.className = 'screen-title';
    title.textContent = options.titleText;
    header.appendChild(title);
    return header;
  }

  if (options.progressText || options.centerExtra) {
    header.className = 'play-header play-header-status';
    const status = document.createElement('div');
    status.className = 'play-header-status-row';

    if (options.progressText) {
      const progress = document.createElement('span');
      progress.className = 'play-progress';
      progress.textContent = options.progressText;
      status.appendChild(progress);
    }

    if (options.centerExtra) {
      status.appendChild(options.centerExtra);
    }

    header.appendChild(status);
    return header;
  }

  header.className = 'play-header';
  return header;
}

export function createSectionTitle(text: string): HTMLParagraphElement {
  const title = document.createElement('p');
  title.className = 'section-title';
  title.textContent = text;
  return title;
}
