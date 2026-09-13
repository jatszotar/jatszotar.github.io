import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import {
  checkMultiplyAnswer,
  formatMultiplyQuestion,
  generateMultiplyRound,
  multiplyCorrectAnswer,
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
  renderPrompt: (question) => {
    const el = document.createElement('div');
    el.className = 'equation multiply-equation';
    el.textContent = formatMultiplyQuestion(question);
    return el;
  },
  inputMode: 'keypad',
  maxInputDigits: 2,
});
