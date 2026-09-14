import { GAME_CATEGORIES, getGame, type GameId } from '../games/registry';
import { setAppToolbarBack } from './appToolbar';
import { createCard, createPlayHeader } from './shell';
import { strings } from './strings';

function createGameCard(
  gameId: GameId,
  onSelect: (gameId: GameId) => void,
): HTMLButtonElement {
  const game = getGame(gameId);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn game-card';

  const emoji = document.createElement('span');
  emoji.className = 'game-card-emoji';
  emoji.textContent = game.emoji;

  const title = document.createElement('span');
  title.className = 'card-title';
  title.textContent = game.title;

  const age = document.createElement('span');
  age.className = 'game-card-age';
  age.textContent = game.ageHint;

  button.appendChild(emoji);
  button.appendChild(title);
  button.appendChild(age);
  button.addEventListener('click', () => onSelect(game.id));
  return button;
}

export function renderModePicker(
  root: HTMLElement,
  onSelect: (gameId: GameId) => void,
): void {
  root.innerHTML = '';
  setAppToolbarBack(null);

  const card = createCard();
  card.classList.add('mode-picker');
  card.appendChild(
    createPlayHeader({
      titleText: strings.chooseGame,
    }),
  );

  const grid = document.createElement('div');
  grid.className = 'game-grid';

  for (const group of GAME_CATEGORIES) {
    for (const gameId of group.gameIds) {
      grid.appendChild(createGameCard(gameId, onSelect));
    }
  }

  card.appendChild(grid);
  root.appendChild(card);
}
