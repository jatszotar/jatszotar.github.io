import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import {
  checkMultiplyAnswer,
  generateMultiplyRound,
  multiplyCorrectAnswer,
  renderMultiplyPrompt,
} from './generate';
import { MULTIPLY_LEVELS } from './types';

export const mountMultiply = createQuizMount({
  gameId: 'multiply',
  title: strings.multiplyTitle,
  levels: MULTIPLY_LEVELS,
  levelLabel: (level) => strings.multiplyLevelLabel(level),
  generateRound: generateMultiplyRound,
  questionKey: (q) => q.id,
  checkAnswer: checkMultiplyAnswer,
  getCorrectAnswer: multiplyCorrectAnswer,
  renderPrompt: (question, state) => renderMultiplyPrompt(question, state),
  inputMode: 'keypad',
  inlineAnswer: true,
  maxInputDigits: 2,
});
