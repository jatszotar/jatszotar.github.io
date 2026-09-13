import type { WordEntry } from './bank';

export interface WordsLevel {
  minGraphemes: number;
  maxGraphemes: number;
  allowDigraphs: boolean;
}

export interface WordsQuestion {
  id: string;
  entry: WordEntry;
  shuffled: string[];
}

export const WORDS_LEVELS: WordsLevel[] = [
  { minGraphemes: 3, maxGraphemes: 4, allowDigraphs: false },
  { minGraphemes: 5, maxGraphemes: 5, allowDigraphs: false },
  { minGraphemes: 6, maxGraphemes: 7, allowDigraphs: true },
  { minGraphemes: 8, maxGraphemes: 12, allowDigraphs: true },
];
