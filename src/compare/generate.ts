import { generateUniqueRound } from '../game/round';
import { randomInt, type Rng } from '../game/random';
import { COUNTING_EMOJIS } from '../counting/types';
import type {
  CompareAnswer,
  CompareLevel,
  CompareQuestion,
  CompareValue,
} from './types';

function answerFor(left: number, right: number): CompareAnswer {
  if (left < right) {
    return '<';
  }
  if (left > right) {
    return '>';
  }
  return '=';
}

function numberValue(max: number, rng: Rng): CompareValue {
  const n = randomInt(0, max, rng);
  return { type: 'number', display: String(n), value: n };
}

function emojiValue(max: number, rng: Rng): CompareValue {
  const count = randomInt(1, max, rng);
  const emoji = COUNTING_EMOJIS[randomInt(0, COUNTING_EMOJIS.length - 1, rng)];
  return {
    type: 'emoji',
    display: emoji.repeat(count),
    value: count,
  };
}

function sumValue(max: number, rng: Rng): CompareValue {
  const a = randomInt(0, max, rng);
  const b = randomInt(0, max - a, rng);
  return {
    type: 'sum',
    display: `${a} + ${b}`,
    value: a + b,
  };
}

function pickValue(level: CompareLevel, rng: Rng): CompareValue {
  const roll = rng();
  if (level.includeSum && roll < 0.3) {
    return sumValue(level.max, rng);
  }
  if (level.includeEmoji && roll < 0.5) {
    return emojiValue(level.max, rng);
  }
  return numberValue(level.max, rng);
}

export function generateCompareQuestion(
  level: CompareLevel,
  rng: Rng = Math.random,
): CompareQuestion {
  const left = pickValue(level, rng);
  let right = pickValue(level, rng);

  if (rng() < level.equalityChance) {
    right =
      left.type === 'number'
        ? { type: 'number', display: String(left.value), value: left.value }
        : { ...left };
  }

  return {
    id: `${left.value}${answerFor(left.value, right.value)}${right.value}`,
    left,
    right,
    answer: answerFor(left.value, right.value),
  };
}

export function generateCompareRound(
  level: CompareLevel,
  roundSize: number,
  rng: Rng = Math.random,
): CompareQuestion[] {
  return generateUniqueRound(
    roundSize,
    () => generateCompareQuestion(level, rng),
    (q) => q.id,
    rng,
  );
}

export function checkCompareAnswer(
  question: CompareQuestion,
  input: string,
): boolean {
  return input === question.answer;
}

export function compareCorrectAnswer(question: CompareQuestion): string {
  return question.answer;
}
