import { generateUniqueRound } from '../game/round';
import { pickOne, shuffle, type Rng } from '../game/random';
import { WORD_BANK, wordsForLevel } from './bank';
import type { WordsLevel, WordsQuestion } from './types';

function wordsForLevelPool(level: WordsLevel): typeof WORD_BANK {
  return wordsForLevel(level);
}

export function generateWordsQuestion(
  level: WordsLevel,
  rng: Rng = Math.random,
): WordsQuestion {
  const pool = wordsForLevelPool(level);
  const entry = pickOne(pool.length > 0 ? pool : WORD_BANK, rng);
  const shuffled = shuffle(entry.graphemes, rng);
  return {
    id: entry.id,
    entry,
    shuffled,
  };
}

export function generateWordsRound(
  level: WordsLevel,
  roundSize: number,
  rng: Rng = Math.random,
): WordsQuestion[] {
  return generateUniqueRound(
    roundSize,
    () => generateWordsQuestion(level, rng),
    (q) => q.id,
    rng,
    20,
  );
}

export function checkWordsAnswer(
  question: WordsQuestion,
  input: string,
): boolean {
  return input === question.entry.graphemes.join('');
}

export function wordsCorrectAnswer(question: WordsQuestion): string {
  return question.entry.graphemes.join('');
}
