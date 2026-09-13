import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import {
  checkCompareAnswer,
  compareCorrectAnswer,
  generateCompareRound,
} from './generate';
import { COMPARE_LEVELS } from './types';

export const mountCompare = createQuizMount({
  gameId: 'compare',
  title: strings.compareTitle,
  levels: COMPARE_LEVELS,
  levelLabel: (level) => strings.compareLevelLabel(level),
  generateRound: generateCompareRound,
  questionKey: (q) => q.id,
  checkAnswer: checkCompareAnswer,
  getCorrectAnswer: compareCorrectAnswer,
  renderPrompt: (question) => {
    const container = document.createElement('div');
    container.className = 'compare-display';

    const left = document.createElement('div');
    left.className = 'compare-side';
    left.textContent = question.left.display;

    const mid = document.createElement('div');
    mid.className = 'compare-op';
    mid.textContent = '?';

    const right = document.createElement('div');
    right.className = 'compare-side';
    right.textContent = question.right.display;

    container.appendChild(left);
    container.appendChild(mid);
    container.appendChild(right);
    return container;
  },
  inputMode: 'choice',
  getChoices: () => ['<', '=', '>'],
});
