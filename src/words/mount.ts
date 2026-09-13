import { unlockAudio } from '../audio/sounds';
import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import {
  checkWordsAnswer,
  generateWordsRound,
  wordsCorrectAnswer,
} from './generate';
import {
  canDelete,
  consumeKey,
  createWordsTileState,
  deleteLast,
  isTileUsed,
  pickTile,
  selectedGraphemes,
  type WordsTileState,
} from './input';
import { WORDS_LEVELS, type WordsLevel, type WordsQuestion } from './types';

function renderWordsPrompt(question: WordsQuestion): HTMLElement {
  const hint = document.createElement('div');
  hint.className = 'words-hint';
  hint.textContent = question.entry.emoji;
  return hint;
}

function maybeSubmit(
  tiles: WordsTileState,
  question: WordsQuestion,
  disabled: boolean,
  onSubmit: (input: string) => void,
  requestRender: () => void,
): void {
  if (disabled) {
    return;
  }

  const target = question.entry.graphemes.join('');
  const selected = selectedGraphemes(tiles, question.shuffled).join('');

  if (tiles.selectedTiles.length === question.entry.graphemes.length) {
    onSubmit(selected);
    return;
  }

  if (selected === target) {
    onSubmit(target);
    return;
  }

  requestRender();
}

export function mountWords(root: HTMLElement, onExit: () => void): void {
  const tileState = new Map<string, WordsTileState>();

  createQuizMount({
    gameId: 'words',
    title: strings.wordsTitle,
    levels: WORDS_LEVELS,
    levelLabel: (level: WordsLevel) => strings.wordsLevelLabel(level),
    generateRound: generateWordsRound,
    questionKey: (q) => q.id,
    checkAnswer: checkWordsAnswer,
    getCorrectAnswer: wordsCorrectAnswer,
    renderPrompt: (question) => renderWordsPrompt(question),
    inputMode: 'custom',
    renderInput: ({
      card,
      question,
      state,
      disabled,
      onSubmit,
      requestRender,
      registerCleanup,
    }) => {
      const key = `${state.currentIndex}:${question.id}:${state.roundPhase}`;
      if (!tileState.has(key)) {
        tileState.set(key, createWordsTileState());
      }
      const tiles = tileState.get(key)!;
      const graphemeCount = question.entry.graphemes.length;
      const selected = selectedGraphemes(tiles, question.shuffled);

      const answerRow = document.createElement('div');
      answerRow.className = 'words-answer';
      for (let i = 0; i < graphemeCount; i += 1) {
        const slot = document.createElement('span');
        slot.className = 'words-slot';
        if (i < selected.length) {
          slot.textContent = selected[i];
        } else if (i === selected.length && tiles.pending.length > 0) {
          slot.classList.add('is-pending');
          slot.textContent = tiles.pending;
        } else {
          slot.textContent = '';
        }
        answerRow.appendChild(slot);
      }
      card.appendChild(answerRow);

      const tileGrid = document.createElement('div');
      tileGrid.className = 'letter-tile-grid';

      question.shuffled.forEach((grapheme, tileIndex) => {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'btn letter-tile';
        tile.textContent = grapheme;
        tile.disabled = disabled || isTileUsed(tiles, tileIndex);
        tile.addEventListener('click', () => {
          const current = tileState.get(key)!;
          if (disabled || isTileUsed(current, tileIndex)) {
            return;
          }
          void unlockAudio();
          tileState.set(key, pickTile(current, tileIndex));
          maybeSubmit(
            tileState.get(key)!,
            question,
            disabled,
            onSubmit,
            requestRender,
          );
        });
        tileGrid.appendChild(tile);
      });

      card.appendChild(tileGrid);

      const actions = document.createElement('div');
      actions.className = 'words-actions';

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'btn letter-tile words-delete';
      deleteButton.textContent = '⌫';
      deleteButton.setAttribute('aria-label', strings.wordsUndo);
      deleteButton.title = strings.wordsUndo;
      deleteButton.disabled = disabled || !canDelete(tiles);
      deleteButton.addEventListener('click', () => {
        const current = tileState.get(key)!;
        if (disabled || !canDelete(current)) {
          return;
        }
        void unlockAudio();
        tileState.set(key, deleteLast(current));
        requestRender();
      });
      actions.appendChild(deleteButton);
      card.appendChild(actions);

      const controller = new AbortController();
      registerCleanup(() => {
        controller.abort();
      });

      const handleKeyboard = (event: KeyboardEvent) => {
        const current = tileState.get(key)!;
        if (disabled || event.ctrlKey || event.metaKey || event.altKey) {
          return;
        }

        if (event.key === 'Backspace') {
          if (!canDelete(current)) {
            return;
          }
          event.preventDefault();
          void unlockAudio();
          tileState.set(key, deleteLast(current));
          requestRender();
          return;
        }

        if (!/^\p{L}$/u.test(event.key)) {
          return;
        }

        void unlockAudio();
        tileState.set(key, consumeKey(current, event.key, question.shuffled));
        maybeSubmit(
          tileState.get(key)!,
          question,
          disabled,
          onSubmit,
          requestRender,
        );
      };

      window.addEventListener('keydown', handleKeyboard, {
        signal: controller.signal,
      });
    },
  })(root, onExit);
}
