export type CompareValueType = 'number' | 'emoji' | 'sum';

export interface CompareValue {
  type: CompareValueType;
  display: string;
  value: number;
}

export type CompareAnswer = '<' | '>' | '=';

export interface CompareLevel {
  max: number;
  includeEmoji: boolean;
  includeSum: boolean;
  equalityChance: number;
}

export interface CompareQuestion {
  id: string;
  left: CompareValue;
  right: CompareValue;
  answer: CompareAnswer;
}

export const COMPARE_LEVELS: CompareLevel[] = [
  { max: 10, includeEmoji: false, includeSum: false, equalityChance: 0.2 },
  { max: 20, includeEmoji: false, includeSum: false, equalityChance: 0.2 },
  { max: 10, includeEmoji: true, includeSum: false, equalityChance: 0.2 },
  { max: 20, includeEmoji: false, includeSum: true, equalityChance: 0.25 },
];
