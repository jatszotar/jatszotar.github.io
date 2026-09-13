import { createQuizMount } from '../ui/quizMount';
import {
  blankValueFromState,
  createBlankSlot,
  createEquationRow,
  createTextPart,
} from '../ui/equationDisplay';
import { strings } from '../ui/strings';
import {
  checkSequenceAnswer,
  generateSequenceRound,
  sequenceCorrectAnswer,
} from './generate';
import { SEQUENCE_LEVELS, type SequenceQuestion } from './types';
import type { RoundRunnerState } from '../ui/roundRunner';

function renderSequencePrompt(
  question: SequenceQuestion,
  state: RoundRunnerState<SequenceQuestion>,
): HTMLElement {
  const parts: HTMLElement[] = [];

  for (const label of question.labels) {
    if (label === null) {
      parts.push(
        createBlankSlot({
          value: blankValueFromState(state),
          feedbackType: state.feedbackType,
        }),
      );
      continue;
    }
    const part = createTextPart(label);
    part.classList.add('seq-num');
    parts.push(part);
  }

  const row = createEquationRow(parts, 'sequence-display');
  return row;
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
  renderPrompt: (question, state) => renderSequencePrompt(question, state),
  inputMode: 'keypad',
  inlineAnswer: true,
  maxInputDigits: 3,
});
