import { createQuizMount } from '../ui/quizMount';
import { attachFitCountGrid } from '../ui/fitCountGrid';
import { strings } from '../ui/strings';
import {
  checkCountingAnswer,
  countingCorrectAnswer,
  generateCountingRound,
} from './generate';
import { COUNTING_LEVELS, type CountingItem, type CountingQuestion } from './types';

function appendEmojiItem(parent: HTMLElement, item: CountingItem): void {
  const span = document.createElement('span');
  span.className = 'count-emoji';
  span.textContent = item.emoji;
  parent.appendChild(span);
}

function renderCountingPrompt(
  question: CountingQuestion,
  level: (typeof COUNTING_LEVELS)[number],
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'count-field';

  if (question.filterVariant) {
    const hint = document.createElement('p');
    hint.className = 'count-hint';
    hint.textContent = strings.countingFilterHint(question.filterVariant);
    container.appendChild(hint);
  }

  if (level.layout === 'fives') {
    const groups = document.createElement('div');
    groups.className = 'count-groups';
    const groupCount = Math.ceil(question.items.length / 5);
    groups.dataset.rows = String(groupCount);

    for (let index = 0; index < question.items.length; index += 5) {
      const group = document.createElement('div');
      group.className = 'count-group';
      for (const item of question.items.slice(index, index + 5)) {
        appendEmojiItem(group, item);
      }
      groups.appendChild(group);
    }

    container.appendChild(groups);
  } else {
    const grid = document.createElement('div');
    grid.className = 'count-grid';
    const rows = Math.ceil(question.items.length / 5);
    grid.dataset.rows = String(rows);

    for (const item of question.items) {
      appendEmojiItem(grid, item);
    }

    container.appendChild(grid);
  }

  return container;
}

export const mountCounting = createQuizMount({
  gameId: 'counting',
  title: strings.countingTitle,
  levels: COUNTING_LEVELS,
  levelLabel: (level) => strings.countingLevelLabel(level),
  generateRound: generateCountingRound,
  questionKey: (q) => q.id,
  checkAnswer: checkCountingAnswer,
  getCorrectAnswer: countingCorrectAnswer,
  renderPrompt: (question, _state) => {
    const level = COUNTING_LEVELS.find(
      (l) =>
        question.filterVariant
          ? l.layout === 'twocolour'
          : l.layout !== 'twocolour' &&
            question.answer >= l.min &&
            question.answer <= l.max,
    ) ?? COUNTING_LEVELS[0];
    return renderCountingPrompt(question, level);
  },
  inputMode: 'keypad',
  maxInputDigits: 2,
  playClass: 'counting-play',
  onPlayPrompt: (prompt, registerCleanup) => {
    const grid = prompt.querySelector('.count-groups, .count-grid');
    if (grid instanceof HTMLElement) {
      registerCleanup(attachFitCountGrid(grid));
    }
  },
});
