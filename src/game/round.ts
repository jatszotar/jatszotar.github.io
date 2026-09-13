import type { Rng } from './random';

export function generateUniqueRound<T>(
  roundSize: number,
  generate: (rng: Rng) => T,
  keyOf: (item: T) => string,
  rng: Rng = Math.random,
  maxAttemptsPerItem = 10,
): T[] {
  const questions: T[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  while (questions.length < roundSize && attempts < roundSize * maxAttemptsPerItem) {
    attempts += 1;
    const item = generate(rng);
    const key = keyOf(item);
    if (!seen.has(key)) {
      seen.add(key);
      questions.push(item);
    }
  }
  while (questions.length < roundSize) {
    questions.push(generate(rng));
  }
  return questions;
}

export function checkNumericAnswer(
  question: { answer: number },
  input: string,
): boolean {
  return Number(input) === question.answer;
}

export function numericCorrectAnswer(question: { answer: number }): string {
  return String(question.answer);
}
