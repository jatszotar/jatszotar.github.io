import { answerFor, generateRound, problemKey } from './generate';
import { isCorrectAnswer, formatProblem } from './check';
import {
  GAME_LEVELS,
  type GameLevel,
  type OperationFilter,
} from './types';
import { createQuizMount } from '../ui/quizMount';
import { strings } from '../ui/strings';
import { createSectionTitle } from '../ui/shell';

function createOperationFilter(
  selected: OperationFilter,
  onChange: (filter: OperationFilter) => void,
): HTMLDivElement {
  const container = document.createElement('div');

  container.appendChild(createSectionTitle('Művelet'));

  const filterRow = document.createElement('div');
  filterRow.className = 'filter-row';

  const filters: OperationFilter[] = ['mixed', 'add', 'subtract'];
  const filterButtons = new Map<OperationFilter, HTMLButtonElement>();

  for (const filter of filters) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn';
    button.textContent = strings.operationLabel(filter);
    button.addEventListener('click', () => {
      onChange(filter);
      for (const [key, btn] of filterButtons) {
        btn.classList.toggle('btn-selected', key === filter);
      }
    });
    filterButtons.set(filter, button);
    filterRow.appendChild(button);
  }

  filterButtons.get(selected)?.classList.add('btn-selected');
  container.appendChild(filterRow);
  return container;
}

function renderMathPrompt(problem: ReturnType<typeof generateRound>[number]): HTMLElement {
  const equation = document.createElement('div');
  equation.className = 'equation multiply-equation';
  equation.textContent = formatProblem(problem);
  return equation;
}

export function mountMath(root: HTMLElement, onExit: () => void): void {
  let operationFilter: OperationFilter = 'mixed';

  createQuizMount({
    gameId: 'math',
    title: strings.title,
    levels: GAME_LEVELS,
    levelLabel: (level: GameLevel) =>
      strings.levelLabel(level.max, level.phase),
    generateRound: (level, roundSize) =>
      generateRound({
        max: level.max,
        phase: level.phase,
        operationFilter,
        roundSize,
      }),
    questionKey: problemKey,
    checkAnswer: (problem, input) =>
      isCorrectAnswer(problem, Number(input)),
    getCorrectAnswer: (problem) => String(answerFor(problem)),
    renderPrompt: (question) => renderMathPrompt(question),
    inputMode: 'keypad',
    maxInputDigits: 2,
    extraHomeContent: (card) => {
      card.appendChild(
        createOperationFilter(operationFilter, (filter) => {
          operationFilter = filter;
        }),
      );
    },
  })(root, onExit);
}
