export type RangeMax = 5 | 10 | 15 | 20;

export type Operation = '+' | '-';

export type OperationFilter = 'add' | 'subtract' | 'mixed';

export type BlankPhase = 1 | 2 | 3;

export type BlankPosition = 'left' | 'right' | 'result';

export interface Fact {
  left: number;
  op: Operation;
  right: number;
  result: number;
}

export interface Problem extends Fact {
  blank: BlankPosition;
}

export interface RoundConfig {
  max: RangeMax;
  phase: BlankPhase;
  operationFilter: OperationFilter;
  roundSize: number;
}

export interface RoundResult {
  correct: number;
  total: number;
}

export const RANGE_MAXES: RangeMax[] = [5, 10, 15, 20];

export interface GameLevel {
  max: RangeMax;
  phase: BlankPhase;
}

/** Linear progression: result → missing number, then next range. */
export const GAME_LEVELS: GameLevel[] = [
  { max: 5, phase: 1 },
  { max: 5, phase: 2 },
  { max: 10, phase: 1 },
  { max: 10, phase: 2 },
  { max: 15, phase: 1 },
  { max: 15, phase: 2 },
  { max: 20, phase: 1 },
  { max: 20, phase: 2 },
];

export const ROUND_SIZE = 8;

export const UNLOCK_THRESHOLD = 7;
