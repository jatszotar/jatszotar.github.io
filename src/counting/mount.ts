import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import {
  checkCountingAnswer,
  countingCorrectAnswer,
  generateCountingRound,
} from './generate';
import { COUNTING_LEVELS, type CountingQuestion } from './types';

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

  const grid = document.createElement('div');
  grid.className =
    level.layout === 'fives' ? 'count-grid count-grid-fives' : 'count-grid';

  for (const item of question.items) {
    const span = document.createElement('span');
    span.className = 'count-emoji';
    if (item.variant === 'red') {
      span.classList.add('count-red');
    }
    if (item.variant === 'blue') {
      span.classList.add('count-blue');
    }
    span.textContent = item.emoji;
    grid.appendChild(span);
  }

  container.appendChild(grid);
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
});
