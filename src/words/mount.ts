import { unlockAudio } from '../audio/sounds';
import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import {
  checkWordsAnswer,
  generateWordsRound,
  wordsCorrectAnswer,
} from './generate';
import { WORDS_LEVELS, type WordsLevel, type WordsQuestion } from './types';

function renderWordsPrompt(question: WordsQuestion): HTMLElement {
  const hint = document.createElement('div');
  hint.className = 'words-hint';
  hint.textContent = question.entry.emoji;
  return hint;
}

export function mountWords(root: HTMLElement, onExit: () => void): void {
  const tileState = new Map<
    string,
    { selected: string[]; usedTiles: boolean[] }
  >();

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
    renderInput: ({ card, question, state, disabled, onSubmit, requestRender }) => {
      const key = `${state.currentIndex}:${question.id}:${state.roundPhase}`;
      if (!tileState.has(key)) {
        tileState.set(key, {
          selected: [],
          usedTiles: question.shuffled.map(() => false),
        });
      }
      const tiles = tileState.get(key)!;
      const target = question.entry.graphemes.join('');

      const answerRow = document.createElement('div');
      answerRow.className = 'words-answer';
      for (let i = 0; i < target.length; i += 1) {
        const slot = document.createElement('span');
        slot.className = 'words-slot';
        slot.textContent = tiles.selected[i] ?? '';
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
        tile.disabled = disabled || tiles.usedTiles[tileIndex];
        tile.addEventListener('click', () => {
          if (disabled || tiles.usedTiles[tileIndex]) {
            return;
          }
          void unlockAudio();
          tiles.selected.push(question.shuffled[tileIndex]);
          tiles.usedTiles[tileIndex] = true;

          if (tiles.selected.join('') === target) {
            onSubmit(target);
            return;
          }

          if (tiles.selected.length >= target.length) {
            onSubmit(tiles.selected.join(''));
            return;
          }

          requestRender();
        });
        tileGrid.appendChild(tile);
      });

      card.appendChild(tileGrid);
    },
  })(root, onExit);
}
