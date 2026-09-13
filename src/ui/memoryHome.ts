import type { MemorySizeKey } from '../memory/types';
import { MEMORY_SIZES } from '../memory/types';
import type { GameProgress } from '../progress/store';
import { formatDuration } from '../timer/format';
import { loadTimerVisible } from '../timer/settings';
import { createBackButton } from './backButton';
import { createHeaderActions } from './headerActions';
import { strings } from './strings';

export function renderMemoryHome(
  root: HTMLElement,
  progress: GameProgress,
  onStart: (sizeKey: MemorySizeKey) => void,
  onBack: () => void,
): void {
  root.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card';

  const header = document.createElement('div');
  header.className = 'play-header';

  header.appendChild(createBackButton(onBack));

  const title = document.createElement('span');
  title.className = 'play-progress';
  title.textContent = strings.memoryTitle;
  header.appendChild(title);

  header.appendChild(createHeaderActions());
  card.appendChild(header);

  const sizeTitle = document.createElement('p');
  sizeTitle.className = 'section-title';
  sizeTitle.textContent = strings.memorySizes;
  card.appendChild(sizeTitle);

  const sizeGrid = document.createElement('div');
  sizeGrid.className = 'range-grid';

  MEMORY_SIZES.forEach((size, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn range-card';
    if (size.key === 'tricky') {
      button.classList.add('range-card-tricky');
    }

    const label = document.createElement('div');
    label.textContent = strings.memorySizeLabel(size.key);
    button.appendChild(label);

    const bestMs = progress.bestTimesMs?.[index];
    const bestText =
      loadTimerVisible() && bestMs !== undefined
        ? strings.bestTime(formatDuration(bestMs))
        : '';

    if (size.key === 'tricky') {
      const hint = document.createElement('small');
      hint.textContent = bestText
        ? `${strings.memoryTrickyHint} · ${bestText}`
        : strings.memoryTrickyHint;
      button.appendChild(hint);
    } else if (bestText) {
      const hint = document.createElement('small');
      hint.textContent = bestText;
      button.appendChild(hint);
    }

    button.addEventListener('click', () => onStart(size.key));
    sizeGrid.appendChild(button);
  });

  card.appendChild(sizeGrid);
  root.appendChild(card);
}
