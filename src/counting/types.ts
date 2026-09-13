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

export const COUNTING_EMOJIS = ['🍎', '⭐', '🐱', '🌸', '⚽', '🐟', '🎈', '🍌'];

export const COUNTING_LEVELS: CountingLevel[] = [
  { min: 1, max: 5, layout: 'row' },
  { min: 1, max: 10, layout: 'row' },
  { min: 1, max: 20, layout: 'fives' },
  { min: 3, max: 12, layout: 'twocolour' },
];
