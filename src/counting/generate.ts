import {
  checkNumericAnswer,
  generateUniqueRound,
  numericCorrectAnswer,
} from '../game/round';
import { randomInt, pickOne, shuffle, type Rng } from '../game/random';
import {
  COUNTING_EMOJIS,
  type CountingItem,
  type CountingLevel,
  type CountingQuestion,
} from './types';

function buildItems(
  count: number,
  emoji: string,
  variant?: 'red' | 'blue',
): CountingItem[] {
  return Array.from({ length: count }, () => ({ emoji, variant }));
}

export function generateCountingQuestion(
  level: CountingLevel,
  rng: Rng = Math.random,
): CountingQuestion {
  const emoji = pickOne(COUNTING_EMOJIS, rng);

  if (level.layout === 'twocolour') {
    const redCount = randomInt(1, Math.min(8, level.max - 1), rng);
    const blueCount = randomInt(1, Math.min(8, level.max - redCount), rng);
    const filterVariant = rng() < 0.5 ? 'red' : 'blue';
    const answer = filterVariant === 'red' ? redCount : blueCount;
    const items = shuffle(
      [
        ...buildItems(redCount, emoji, 'red'),
        ...buildItems(blueCount, emoji, 'blue'),
      ],
      rng,
    );
    return {
      id: `tc:${redCount}:${blueCount}:${filterVariant}`,
      items,
      filterVariant,
      answer,
    };
  }

  const count = randomInt(level.min, level.max, rng);
  const items = buildItems(count, emoji);
  return {
    id: `c:${count}:${emoji}`,
    items,
    answer: count,
  };
}

export function generateCountingRound(
  level: CountingLevel,
  roundSize: number,
  rng: Rng = Math.random,
): CountingQuestion[] {
  return generateUniqueRound(
    roundSize,
    () => generateCountingQuestion(level, rng),
    (q) => q.id,
    rng,
  );
}

export const checkCountingAnswer = checkNumericAnswer;
export const countingCorrectAnswer = numericCorrectAnswer;
