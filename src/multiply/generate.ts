import {
  checkNumericAnswer,
  generateUniqueRound,
  numericCorrectAnswer,
} from '../game/round';
import { pickOne, randomInt, type Rng } from '../game/random';
import {
  buildOperandEquation,
  type EquationAnswerState,
} from '../ui/equationDisplay';
import type {
  MultiplyBlank,
  MultiplyLevel,
  MultiplyQuestion,
} from './types';

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10];

function pickTable(level: MultiplyLevel, rng: Rng): number {
  if (level.table === 'mixed') {
    return pickOne(TABLES, rng);
  }
  return level.table;
}

function pickBlank(level: MultiplyLevel, rng: Rng): MultiplyBlank {
  if (level.blank === 'mixed') {
    return pickOne(['result', 'left', 'right'] as MultiplyBlank[], rng);
  }
  return level.blank;
}

export function generateMultiplyQuestion(
  level: MultiplyLevel,
  rng: Rng = Math.random,
): MultiplyQuestion {
  const table = pickTable(level, rng);
  const multiplier = randomInt(1, 10, rng);
  const blank = pickBlank(level, rng);
  const a = table;
  const b = multiplier;
  const result = a * b;

  let answer: number;
  if (blank === 'left') {
    answer = a;
  } else if (blank === 'right') {
    answer = b;
  } else {
    answer = result;
  }

  return {
    id: `${a}x${b}:${blank}`,
    a,
    b,
    blank,
    answer,
  };
}

export function generateMultiplyRound(
  level: MultiplyLevel,
  roundSize: number,
  rng: Rng = Math.random,
): MultiplyQuestion[] {
  return generateUniqueRound(
    roundSize,
    () => generateMultiplyQuestion(level, rng),
    (q) => q.id,
    rng,
  );
}

export const checkMultiplyAnswer = checkNumericAnswer;
export const multiplyCorrectAnswer = numericCorrectAnswer;

export function renderMultiplyPrompt(
  question: MultiplyQuestion,
  state: EquationAnswerState,
): HTMLElement {
  return buildOperandEquation({
    left: question.a,
    right: question.b,
    result: question.a * question.b,
    op: '×',
    blank: question.blank,
    state,
  });
}

export function formatMultiplyQuestion(question: MultiplyQuestion): string {
  const left =
    question.blank === 'left' ? '?' : String(question.a);
  const right =
    question.blank === 'right' ? '?' : String(question.b);
  const result =
    question.blank === 'result' ? '?' : String(question.a * question.b);
  return `${left} × ${right} = ${result}`;
}
