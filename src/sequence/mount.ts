import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import {
  checkSequenceAnswer,
  generateSequenceRound,
  sequenceCorrectAnswer,
} from './generate';
import { SEQUENCE_LEVELS, type SequenceQuestion } from './types';

function renderSequencePrompt(question: SequenceQuestion): HTMLElement {
  const container = document.createElement('div');
  container.className = 'sequence-display';

  for (const label of question.labels) {
    const part = document.createElement('span');
    part.className = label === null ? 'seq-blank' : 'seq-num';
    part.textContent = label === null ? '?' : label;
    container.appendChild(part);
  }

  return container;
}

export const mountSequence = createQuizMount({
  gameId: 'sequence',
  title: strings.sequenceTitle,
  levels: SEQUENCE_LEVELS,
  levelLabel: (level) => strings.sequenceLevelLabel(level),
  generateRound: generateSequenceRound,
  questionKey: (q) => q.id,
  checkAnswer: checkSequenceAnswer,
  getCorrectAnswer: sequenceCorrectAnswer,
  renderPrompt: (question) => renderSequencePrompt(question),
  inputMode: 'keypad',
  maxInputDigits: 3,
});
