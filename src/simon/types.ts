export interface SimonStep {
  length: number;
  reps: number;
}

export interface SimonLevel {
  steps: SimonStep[];
  playbackMs: number;
  pauseMs: number;
  prepMs: number;
}

function buildSteps(startLength: number): SimonStep[] {
  return [
    { length: startLength, reps: 3 },
    { length: startLength + 1, reps: 3 },
    { length: startLength + 2, reps: 3 },
    { length: startLength + 3, reps: 3 },
  ];
}

export const SIMON_LEVELS: SimonLevel[] = [
  { steps: buildSteps(1), playbackMs: 800, pauseMs: 550, prepMs: 2200 },
  { steps: buildSteps(2), playbackMs: 700, pauseMs: 450, prepMs: 2000 },
  { steps: buildSteps(3), playbackMs: 600, pauseMs: 350, prepMs: 1800 },
  { steps: buildSteps(4), playbackMs: 550, pauseMs: 300, prepMs: 1600 },
];

export const SIMON_PADS = [
  { index: 0, color: '#ef4444', label: 'Piros' },
  { index: 1, color: '#22c55e', label: 'Zöld' },
  { index: 2, color: '#3b82f6', label: 'Kék' },
  { index: 3, color: '#eab308', label: 'Sárga' },
] as const;

export function totalSubRounds(level: SimonLevel): number {
  return level.steps.reduce((sum, step) => sum + step.reps, 0);
}

export function simonUnlockThreshold(level: SimonLevel): number {
  return Math.ceil(totalSubRounds(level) * 0.75);
}

export type SimonPhase = 'preparing' | 'showing' | 'awaiting' | 'failed' | 'won';

export interface SimonGame {
  level: SimonLevel;
  stepIndex: number;
  repIndex: number;
  subRoundIndex: number;
  sequence: number[];
  playerIndex: number;
  phase: SimonPhase;
  retryUsed: boolean;
  score: { correct: number; total: number };
}
