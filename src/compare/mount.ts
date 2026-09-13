import { createQuizMount } from '../ui/quizMount';
import {
  blankValueFromState,
  createBlankSlot,
} from '../ui/equationDisplay';
import { strings } from '../ui/strings';
import {
  checkCompareAnswer,
  compareCorrectAnswer,
  generateCompareRound,
} from './generate';
import { COMPARE_LEVELS } from './types';
import type { RoundRunnerState } from '../ui/roundRunner';
import type { CompareQuestion } from './types';

function renderComparePrompt(
  question: CompareQuestion,
  state: RoundRunnerState<CompareQuestion>,
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'compare-display';

  const left = document.createElement('div');
  left.className = 'compare-side';
  left.textContent = question.left.display;

  const blank = createBlankSlot({
    value: blankValueFromState(state),
    feedbackType: state.feedbackType,
    size: 'wide',
  });
  blank.classList.add('compare-blank');

  const right = document.createElement('div');
  right.className = 'compare-side';
  right.textContent = question.right.display;

  container.appendChild(left);
  container.appendChild(blank);
  container.appendChild(right);
  return container;
}

export const mountCompare = createQuizMount({
  gameId: 'compare',
  title: strings.compareTitle,
  levels: COMPARE_LEVELS,
  levelLabel: (level) => strings.compareLevelLabel(level),
  generateRound: generateCompareRound,
  questionKey: (q) => q.id,
  checkAnswer: checkCompareAnswer,
  getCorrectAnswer: compareCorrectAnswer,
  renderPrompt: (question, state) => renderComparePrompt(question, state),
  inputMode: 'choice',
  inlineAnswer: true,
  getChoices: () => ['<', '=', '>'],
});
