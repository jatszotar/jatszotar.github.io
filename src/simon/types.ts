export const SIMON_START_DELAY_MS = 1200;

export interface SimonLevel {
  targetLength: number;
  playbackMs: number;
  pauseMs: number;
}

export const SIMON_LEVELS: SimonLevel[] = [
  { targetLength: 4, playbackMs: 700, pauseMs: 250 },
  { targetLength: 6, playbackMs: 600, pauseMs: 200 },
  { targetLength: 8, playbackMs: 500, pauseMs: 150 },
  { targetLength: 10, playbackMs: 400, pauseMs: 120 },
];

export const SIMON_PADS = [
  { index: 0, color: '#ef4444', label: 'Piros' },
  { index: 1, color: '#22c55e', label: 'Zöld' },
  { index: 2, color: '#3b82f6', label: 'Kék' },
  { index: 3, color: '#eab308', label: 'Sárga' },
] as const;

export type SimonPhase = 'showing' | 'awaiting' | 'failed' | 'won';

export interface SimonGame {
  level: SimonLevel;
  sequence: number[];
  playerIndex: number;
  phase: SimonPhase;
}
