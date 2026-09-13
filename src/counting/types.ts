export type CountingLayout = 'row' | 'fives' | 'twocolour';

export interface CountingLevel {
  min: number;
  max: number;
  layout: CountingLayout;
}

export interface CountingItem {
  emoji: string;
  variant?: 'red' | 'blue';
}

export interface CountingQuestion {
  id: string;
  items: CountingItem[];
  filterVariant?: 'red' | 'blue';
  answer: number;
}

export interface CountingColourPair {
  red: string;
  blue: string;
}

export const COUNTING_EMOJIS = ['🍎', '⭐', '🐱', '🌸', '⚽', '🐟', '🎈', '🍌'];

/**
 * Both halves of a pair share a shape so colour is the only thing that tells
 * the two groups apart, which is what the two-colour level asks kids to spot.
 */
export const COUNTING_COLOUR_PAIRS: CountingColourPair[] = [
  { red: '🔴', blue: '🔵' },
  { red: '❤️', blue: '💙' },
  { red: '🟥', blue: '🟦' },
  { red: '📕', blue: '📘' },
];

export const COUNTING_LEVELS: CountingLevel[] = [
  { min: 1, max: 5, layout: 'row' },
  { min: 1, max: 10, layout: 'row' },
  { min: 1, max: 20, layout: 'fives' },
  { min: 3, max: 12, layout: 'twocolour' },
];
