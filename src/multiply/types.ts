export type MultiplyBlank = 'result' | 'left' | 'right';

export interface MultiplyLevel {
  table: number | 'mixed';
  blank: MultiplyBlank | 'mixed';
}

export interface MultiplyQuestion {
  id: string;
  a: number;
  b: number;
  blank: MultiplyBlank;
  answer: number;
}

export const MULTIPLY_LEVELS: MultiplyLevel[] = [
  { table: 2, blank: 'result' },
  { table: 10, blank: 'result' },
  { table: 5, blank: 'result' },
  { table: 3, blank: 'result' },
  { table: 4, blank: 'result' },
  { table: 6, blank: 'result' },
  { table: 7, blank: 'result' },
  { table: 8, blank: 'result' },
  { table: 9, blank: 'result' },
  { table: 'mixed', blank: 'result' },
  { table: 'mixed', blank: 'mixed' },
];
