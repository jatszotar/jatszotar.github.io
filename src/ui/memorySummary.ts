import type { MemoryWinResult } from '../memory/types';
import { formatDuration } from '../timer/format';
import { strings } from './strings';

export interface MemorySummaryTimerOptions {
  elapsedMs?: number;
  bestMs?: number;
  isNewBest?: boolean;
}

export function renderMemorySummary(
  root: HTMLElement,
  result: MemoryWinResult,
  timer: MemorySummaryTimerOptions,
  onReplay: () => void,
  onHome: () => void,
): void {
  root.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h1');
  title.className = 'title';
  title.textContent = strings.memoryWin;
  card.appendChild(title);

  const score = document.createElement('div');
  score.className = 'summary-score';
  score.textContent = strings.moves(result.moves);
  card.appendChild(score);

  if (timer.elapsedMs !== undefined) {
    const time = document.createElement('div');
    time.className = 'summary-time';
    time.textContent = strings.elapsedTime(formatDuration(timer.elapsedMs));
    card.appendChild(time);

    if (timer.bestMs !== undefined) {
      const best = document.createElement('div');
      best.className = 'summary-best-time';
      best.textContent = strings.bestTime(formatDuration(timer.bestMs));
      card.appendChild(best);
    }

    if (timer.isNewBest) {
      const record = document.createElement('div');
      record.className = 'summary-new-best';
      record.textContent = strings.newBestTime;
      card.appendChild(record);
    }
  }

  const message = document.createElement('div');
  message.className = 'summary-message';
  message.textContent = strings.pairsFound(result.pairs, result.pairs);
  card.appendChild(message);

  const actions = document.createElement('div');
  actions.className = 'button-row';

  const replay = document.createElement('button');
  replay.type = 'button';
  replay.className = 'btn btn-primary';
  replay.textContent = strings.replay;
  replay.addEventListener('click', onReplay);
  actions.appendChild(replay);

  const home = document.createElement('button');
  home.type = 'button';
  home.className = 'btn';
  home.textContent = strings.home;
  home.addEventListener('click', onHome);
  actions.appendChild(home);

  card.appendChild(actions);
  root.appendChild(card);
}
