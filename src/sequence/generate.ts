import {
  checkNumericAnswer,
  generateUniqueRound,
  numericCorrectAnswer,
} from '../game/round';
import { pickOne, randomInt, type Rng } from '../game/random';
import type { DisplayMode, SequenceLevel, SequenceQuestion } from './types';

const SEQUENCE_LENGTH = 4;

function pickStep(stepRange: SequenceLevel['stepRange'], rng: Rng): number {
  const steps: number[] = [];
  for (let step = stepRange.min; step <= stepRange.max; step += 1) {
    if (step !== 0) {
      steps.push(step);
    }
  }
  return pickOne(steps, rng);
}

function validStartRange(
  step: number,
  length: number,
  max: number,
): [number, number] {
  let minStart = 0;
  let maxStart = max;
  for (let i = 0; i < length; i += 1) {
    const offset = i * step;
    minStart = Math.max(minStart, -offset);
    maxStart = Math.min(maxStart, max - offset);
  }
  return [minStart, maxStart];
}

function pickBlankIndex(
  length: number,
  blankPosition: SequenceLevel['blankPosition'],
  rng: Rng,
): number {
  if (blankPosition === 'end') {
    return length - 1;
  }
  if (blankPosition === 'middle') {
    return randomInt(1, length - 2, rng);
  }
  return randomInt(1, length - 1, rng);
}

function expressionForValue(value: number, rng: Rng): string {
  if (value === 0) {
    return rng() < 0.5 ? '0+0' : '1-1';
  }

  if (rng() < 0.5) {
    const left = randomInt(0, value, rng);
    const right = value - left;
    return `${left}+${right}`;
  }

  const subtracted = randomInt(1, Math.min(value + 10, 20), rng);
  const left = value + subtracted;
  return `${left}-${subtracted}`;
}

function labelForValue(
  value: number,
  display: DisplayMode,
  rng: Rng,
): string {
  if (display === 'number') {
    return String(value);
  }
  if (display === 'expression') {
    return expressionForValue(value, rng);
  }
  return rng() < 0.5 ? String(value) : expressionForValue(value, rng);
}

export function generateSequenceQuestion(
  level: SequenceLevel,
  rng: Rng = Math.random,
): SequenceQuestion {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const step = pickStep(level.stepRange, rng);
    const [minStart, maxStart] = validStartRange(
      step,
      SEQUENCE_LENGTH,
      level.max,
    );
    if (minStart > maxStart) {
      continue;
    }

    const start = randomInt(minStart, maxStart, rng);
    const values = Array.from(
      { length: SEQUENCE_LENGTH },
      (_, index) => start + step * index,
    );
    const blankIndex = pickBlankIndex(
      SEQUENCE_LENGTH,
      level.blankPosition,
      rng,
    );
    const answer = values[blankIndex];
    const labels = values.map((value, index) =>
      index === blankIndex
        ? null
        : labelForValue(value, level.display, rng),
    );

    return {
      id: `${values.join(',')}:${answer}:${blankIndex}`,
      labels,
      answer,
    };
  }

  const fallback = generateSequenceQuestion(
    { ...level, stepRange: { min: 1, max: 1 }, blankPosition: 'end' },
    rng,
  );
  return fallback;
}

export function generateSequenceRound(
  level: SequenceLevel,
  roundSize: number,
  rng: Rng = Math.random,
): SequenceQuestion[] {
  return generateUniqueRound(
    roundSize,
    () => generateSequenceQuestion(level, rng),
    (q) => q.id,
    rng,
  );
}

export const checkSequenceAnswer = checkNumericAnswer;
export const sequenceCorrectAnswer = numericCorrectAnswer;
