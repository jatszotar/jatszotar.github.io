import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import {
  checkClockAnswer,
  clockCorrectAnswer,
  generateClockRound,
} from './generate';
import { createClockFace } from './render';
import { CLOCK_LEVELS } from './types';

export const mountClock = createQuizMount({
  gameId: 'clock',
  title: strings.clockTitle,
  levels: CLOCK_LEVELS,
  levelLabel: (level) => strings.clockLevelLabel(level),
  generateRound: generateClockRound,
  questionKey: (q) => q.id,
  checkAnswer: checkClockAnswer,
  getCorrectAnswer: clockCorrectAnswer,
  renderPrompt: (question) => {
    const container = document.createElement('div');
    container.className = 'clock-container';
    container.appendChild(createClockFace(question.hour, question.minute));
    return container;
  },
  inputMode: 'choice',
  getChoices: (question) => question.choices,
});
