import type { GameProgress } from '../progress/store';
import { isLevelUnlocked } from '../progress/store';
import { createCard, createPlayHeader, createSectionTitle } from './shell';
import { strings } from './strings';

export interface LevelHomeOptions<TLevel = unknown> {
  title: string;
  levels: TLevel[];
  levelLabel: (level: TLevel, index: number) => string;
  progress: GameProgress;
  onStart: (levelIndex: number) => void;
  onBack: () => void;
  extraContent?: (card: HTMLDivElement) => void;
}

export function renderLevelHome<TLevel>(
  root: HTMLElement,
  options: LevelHomeOptions<TLevel>,
): void {
  root.innerHTML = '';

  const card = createCard();
  card.appendChild(
    createPlayHeader({
      onBack: options.onBack,
      titleText: options.title,
    }),
  );

  options.extraContent?.(card);

  card.appendChild(createSectionTitle(strings.levels));

  const levelGrid = document.createElement('div');
  levelGrid.className = 'range-grid';

  options.levels.forEach((level, index) => {
    const unlocked = isLevelUnlocked(options.progress, index);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn range-card';
    if (index === options.progress.unlockedLevelIndex) {
      button.classList.add('btn-selected');
    }
    button.disabled = !unlocked;
    button.innerHTML = `
      <div>${options.levelLabel(level, index)}</div>
      <small>${unlocked ? strings.unlocked : strings.locked}</small>
    `;
    if (unlocked) {
      button.addEventListener('click', () => options.onStart(index));
    }
    levelGrid.appendChild(button);
  });

  card.appendChild(levelGrid);
  root.appendChild(card);
}
