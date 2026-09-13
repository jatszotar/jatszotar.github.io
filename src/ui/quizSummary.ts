import type { RoundResult } from '../game/types';
import type { GameProgress } from '../progress/store';
import { nextLevelIndex } from '../progress/store';
import { UNLOCK_THRESHOLD } from '../game/types';
import { formatDuration } from '../timer/format';
import { createCard } from './shell';
import { strings } from './strings';

export interface QuizSummaryOptions {
  levelIndex: number;
  maxLevelIndex: number;
  result: RoundResult;
  progress: GameProgress;
  levelLabel: (index: number) => string;
  unlockThreshold?: number;
  elapsedMs?: number;
  bestMs?: number;
  isNewBest?: boolean;
  onReplay: () => void;
  onNextLevel: () => void;
  onHome: () => void;
}

export function renderQuizSummary(
  root: HTMLElement,
  options: QuizSummaryOptions,
): void {
  root.innerHTML = '';

  const card = createCard();

  const title = document.createElement('h1');
  title.className = 'title';
  title.textContent = strings.roundEnd;
  card.appendChild(title);

  const score = document.createElement('div');
  score.className = 'summary-score';
  score.textContent = strings.score(options.result.correct, options.result.total);
  card.appendChild(score);

  if (options.elapsedMs !== undefined) {
    const time = document.createElement('div');
    time.className = 'summary-time';
    time.textContent = strings.elapsedTime(formatDuration(options.elapsedMs));
    card.appendChild(time);

    if (options.bestMs !== undefined) {
      const best = document.createElement('div');
      best.className = 'summary-best-time';
      best.textContent = strings.bestTime(formatDuration(options.bestMs));
      card.appendChild(best);
    }

    if (options.isNewBest) {
      const record = document.createElement('div');
      record.className = 'summary-new-best';
      record.textContent = strings.newBestTime;
      card.appendChild(record);
    }
  }

  const threshold = options.unlockThreshold ?? UNLOCK_THRESHOLD;
  const nextIndex = nextLevelIndex(options.levelIndex, options.maxLevelIndex);
  const unlocked =
    options.result.correct >= threshold &&
    nextIndex !== null &&
    options.progress.unlockedLevelIndex >= nextIndex;

  const message = document.createElement('div');
  message.className = 'summary-message';
  message.textContent =
    unlocked && nextIndex !== null
      ? `${strings.nextPhase}: ${options.levelLabel(nextIndex)}`
      : options.levelLabel(options.levelIndex);
  card.appendChild(message);

  const actions = document.createElement('div');
  actions.className = 'button-row';

  const replay = document.createElement('button');
  replay.type = 'button';
  replay.className = 'btn';
  replay.textContent = strings.replay;
  replay.addEventListener('click', options.onReplay);
  actions.appendChild(replay);

  if (unlocked) {
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn-primary';
    next.textContent = strings.next;
    next.addEventListener('click', options.onNextLevel);
    actions.appendChild(next);
  }

  const home = document.createElement('button');
  home.type = 'button';
  home.className = 'btn';
  home.textContent = strings.home;
  home.addEventListener('click', options.onHome);
  actions.appendChild(home);

  card.appendChild(actions);
  root.appendChild(card);
}
