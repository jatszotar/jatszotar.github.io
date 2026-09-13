export type BlankPosition = 'end' | 'middle' | 'mixed';

export type DisplayMode = 'number' | 'expression' | 'mixed';

export interface StepRange {
  min: number;
  max: number;
}

export interface SequenceLevel {
  stepRange: StepRange;
  max: number;
  blankPosition: BlankPosition;
  display: DisplayMode;
}

export interface SequenceQuestion {
  id: string;
  labels: (string | null)[];
  answer: number;
}

export const SEQUENCE_LEVELS: SequenceLevel[] = [
  { stepRange: { min: 1, max: 4 }, max: 20, blankPosition: 'end', display: 'number' },
  { stepRange: { min: -4, max: 4 }, max: 30, blankPosition: 'end', display: 'number' },
  { stepRange: { min: 1, max: 4 }, max: 30, blankPosition: 'end', display: 'expression' },
  { stepRange: { min: -4, max: 4 }, max: 50, blankPosition: 'mixed', display: 'mixed' },
];
