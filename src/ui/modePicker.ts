import { GAME_CATEGORIES, getGame, type GameId } from '../games/registry';
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
  title.className = 'game-card-title';
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

  const card = createCard();
  card.appendChild(
    createPlayHeader({
      titleText: strings.chooseGame,
    }),
  );

  const groups = document.createElement('div');
  groups.className = 'game-groups';

  for (const group of GAME_CATEGORIES) {
    const section = document.createElement('section');
    section.className = 'game-category';

    const heading = document.createElement('h2');
    heading.className = 'game-category-title';
    heading.textContent = strings.gameCategoryLabel(group.category);
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'game-grid';

    for (const gameId of group.gameIds) {
      grid.appendChild(createGameCard(gameId, onSelect));
    }

    section.appendChild(grid);
    groups.appendChild(section);
  }

  card.appendChild(groups);
  root.appendChild(card);
}
