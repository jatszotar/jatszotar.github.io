import { playCorrect, playFlip, playWrong, unlockAudio } from '../audio/sounds';
import {
  createMemoryGame,
  flipCard,
  resolveMismatch,
  type FlipOutcome,
} from '../memory/game';
import type { MemoryGame, MemorySizeKey, MemoryWinResult } from '../memory/types';
import { getMemorySize, getSymbolById } from '../memory/types';
import { createPlayHeader } from './shell';
import { strings } from './strings';

export interface MemoryPlaySession {
  sizeKey: MemorySizeKey;
  game: MemoryGame;
}

export function createMemoryPlaySession(sizeKey: MemorySizeKey): MemoryPlaySession {
  return {
    sizeKey,
    game: createMemoryGame(sizeKey, Math.random),
  };
}

let playCleanup: (() => void) | null = null;

function updateTile(
  button: HTMLButtonElement,
  game: MemoryGame,
  index: number,
): void {
  const card = game.cards[index];
  const symbol = getSymbolById(card.symbolId);
  const inner = button.querySelector<HTMLSpanElement>('.memory-tile-inner');
  const front = button.querySelector<HTMLSpanElement>('.memory-tile-front');
  const back = button.querySelector<HTMLSpanElement>('.memory-tile-back');

  if (!inner || !front || !back) {
    return;
  }

  const isFaceUp = card.state === 'revealed' || card.state === 'matched';
  inner.classList.toggle('memory-tile-flipped', isFaceUp);
  button.classList.toggle('memory-tile-matched', card.state === 'matched');
  button.disabled = card.state === 'matched' || game.flipped.length >= 2;
  front.textContent = symbol.emoji;
  back.textContent = '?';

  if (isFaceUp) {
    button.setAttribute('aria-label', symbol.label);
  } else {
    button.setAttribute('aria-label', strings.hiddenCard);
  }
}

function updateStatus(status: HTMLElement, game: MemoryGame): void {
  status.textContent = strings.pairsFound(game.matchedPairs, game.totalPairs);
}

export function renderMemoryPlay(
  root: HTMLElement,
  session: MemoryPlaySession,
  onExit: () => void,
  onWin: (result: MemoryWinResult) => void,
  timerElement?: HTMLElement,
): void {
  playCleanup?.();
  root.innerHTML = '';

  const timeouts: number[] = [];
  playCleanup = () => {
    for (const id of timeouts) {
      window.clearTimeout(id);
    }
    timeouts.length = 0;
  };

  const scheduleTimeout = (callback: () => void, delayMs: number): void => {
    timeouts.push(window.setTimeout(callback, delayMs));
  };

  const { cols } = getMemorySize(session.sizeKey);
  let game = session.game;
  let locked = false;

  const card = document.createElement('div');
  card.className = 'card';

  const header = createPlayHeader({
    onBack: onExit,
    progressText: strings.pairsFound(game.matchedPairs, game.totalPairs),
    centerExtra: timerElement,
  });
  const status = header.querySelector<HTMLElement>('.play-progress');
  if (!status) {
    throw new Error('Missing play progress element');
  }
  card.appendChild(header);

  const moves = document.createElement('div');
  moves.className = 'memory-moves';
  moves.textContent = strings.moves(game.moves);
  card.appendChild(moves);

  const grid = document.createElement('div');
  grid.className = 'memory-grid';
  grid.style.setProperty('--memory-cols', String(cols));

  const tileButtons: HTMLButtonElement[] = [];

  game.cards.forEach((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'memory-tile';
    button.dataset.index = String(index);

    const inner = document.createElement('span');
    inner.className = 'memory-tile-inner';

    const front = document.createElement('span');
    front.className = 'memory-tile-face memory-tile-front';
    front.setAttribute('aria-hidden', 'true');

    const back = document.createElement('span');
    back.className = 'memory-tile-face memory-tile-back';
    back.setAttribute('aria-hidden', 'true');

    inner.appendChild(front);
    inner.appendChild(back);
    button.appendChild(inner);

    updateTile(button, game, index);
    tileButtons.push(button);
    grid.appendChild(button);
  });

  card.appendChild(grid);
  root.appendChild(card);

  const refreshBoard = (outcome: FlipOutcome): void => {
    game.cards.forEach((_, index) => {
      updateTile(tileButtons[index], game, index);
    });
    updateStatus(status, game);
    moves.textContent = strings.moves(game.moves);

    if (outcome === 'match') {
      playCorrect();
    } else if (outcome === 'mismatch') {
      playWrong();
    } else if (outcome === 'flipped') {
      playFlip();
    }
  };

  const handleTileClick = (index: number) => {
    if (locked) {
      return;
    }

    void unlockAudio();
    const result = flipCard(game, index);
    if (result.outcome === 'ignored') {
      return;
    }

    game = result.game;
    refreshBoard(result.outcome);

    if (result.outcome === 'mismatch') {
      locked = true;
      tileButtons.forEach((button) => {
        button.disabled = true;
      });
      scheduleTimeout(() => {
        game = resolveMismatch(game);
        refreshBoard('ignored');
        locked = false;
      }, 900);
      return;
    }

    if (result.outcome === 'won') {
      locked = true;
      tileButtons.forEach((button) => {
        button.disabled = true;
      });
      scheduleTimeout(() => {
        onWin({ moves: game.moves, pairs: game.totalPairs });
      }, 700);
    }
  };

  tileButtons.forEach((button, index) => {
    button.addEventListener('click', () => handleTileClick(index));
  });
}

export function destroyMemoryPlay(): void {
  playCleanup?.();
  playCleanup = null;
}
