import { createBackButton } from './backButton';
import { createHeaderActions } from './headerActions';

export function createCard(): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'card';
  return card;
}

export type PlayHeaderLayout = 'stacked' | 'inline';

export interface PlayHeaderOptions {
  onBack?: () => void;
  progressText?: string;
  titleText?: string;
  centerExtra?: HTMLElement;
  layout?: PlayHeaderLayout;
}

export function createPlayHeader(options: PlayHeaderOptions): HTMLDivElement {
  const layout = options.layout ?? 'stacked';
  const header = document.createElement('div');
  header.className =
    layout === 'inline'
      ? 'play-header play-header-inline'
      : 'play-header play-header-stacked';

  const toolbar = document.createElement('div');
  toolbar.className = 'play-header-toolbar';

  if (options.onBack) {
    toolbar.appendChild(createBackButton(options.onBack));
  } else {
    const backSpacer = document.createElement('span');
    backSpacer.className = 'back-toggle-spacer';
    backSpacer.setAttribute('aria-hidden', 'true');
    toolbar.appendChild(backSpacer);
  }

  if (
    layout === 'inline' &&
    (options.progressText || options.centerExtra) &&
    !options.titleText
  ) {
    const inlineCenter = document.createElement('div');
    inlineCenter.className = 'play-header-inline-center';

    if (options.progressText) {
      const progress = document.createElement('span');
      progress.className = 'play-progress';
      progress.textContent = options.progressText;
      inlineCenter.appendChild(progress);
    }

    if (options.centerExtra) {
      inlineCenter.appendChild(options.centerExtra);
    }

    toolbar.appendChild(inlineCenter);
  }

  toolbar.appendChild(createHeaderActions());
  header.appendChild(toolbar);

  if (options.titleText) {
    const title = document.createElement('h1');
    title.className = 'screen-title';
    title.textContent = options.titleText;
    header.appendChild(title);
  }

  return header;
}

export function createSectionTitle(text: string): HTMLParagraphElement {
  const title = document.createElement('p');
  title.className = 'section-title';
  title.textContent = text;
  return title;
}
