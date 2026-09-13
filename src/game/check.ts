import { answerFor } from './generate';
import type { Problem } from './types';
import {
  buildOperandEquation,
  type EquationAnswerState,
} from '../ui/equationDisplay';

export function isCorrectAnswer(problem: Problem, value: number): boolean {
  return value === answerFor(problem);
}

export function formatProblem(problem: Problem): string {
  const left = problem.blank === 'left' ? '?' : String(problem.left);
  const right = problem.blank === 'right' ? '?' : String(problem.right);
  const result = problem.blank === 'result' ? '?' : String(problem.result);
  return `${left} ${problem.op} ${right} = ${result}`;
}

export function renderMathPrompt(
  problem: Problem,
  state: EquationAnswerState,
): HTMLElement {
  return buildOperandEquation({
    left: problem.left,
    right: problem.right,
    result: problem.result,
    op: problem.op,
    blank: problem.blank,
    state,
  });
}
