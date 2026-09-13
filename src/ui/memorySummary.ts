import type { MemoryWinResult } from '../memory/types';
import { strings } from './strings';

export function renderMemorySummary(
  root: HTMLElement,
  result: MemoryWinResult,
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
