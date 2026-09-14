import { mountMath } from '../game/mount';
import { mountMemory } from '../memory/mount';
import { mountCounting } from '../counting/mount';
import { mountSequence } from '../sequence/mount';
import { mountCompare } from '../compare/mount';
import { mountMultiply } from '../multiply/mount';
import { mountClock } from '../clock/mount';
import { mountSimon } from '../simon/mount';
import { mountWords } from '../words/mount';
import { strings } from '../ui/strings';

export type GameId =
  | 'counting'
  | 'sequence'
  | 'compare'
  | 'multiply'
  | 'clock'
  | 'simon'
  | 'words'
  | 'math'
  | 'memory';

export type GameCategory = 'simple' | 'math' | 'hard';

export interface GameModule {
  id: GameId;
  emoji: string;
  title: string;
  ageHint: string;
  category: GameCategory;
  mount: (root: HTMLElement, onExit: () => void) => void;
}

export interface GameCategoryGroup {
  category: GameCategory;
  gameIds: GameId[];
}

const GAME_MODULES: Record<GameId, GameModule> = {
  counting: {
    id: 'counting',
    emoji: '🔢',
    title: strings.countingTitle,
    ageHint: '5–7 év',
    category: 'simple',
    mount: mountCounting,
  },
  memory: {
    id: 'memory',
    emoji: '🃏',
    title: strings.memoryTitle,
    ageHint: '5–10 év',
    category: 'simple',
    mount: mountMemory,
  },
  simon: {
    id: 'simon',
    emoji: '🎨',
    title: strings.simonTitle,
    ageHint: '5–10 év',
    category: 'simple',
    mount: mountSimon,
  },
  sequence: {
    id: 'sequence',
    emoji: '🔣',
    title: strings.sequenceTitle,
    ageHint: '7–10 év',
    category: 'math',
    mount: mountSequence,
  },
  compare: {
    id: 'compare',
    emoji: '⚖️',
    title: strings.compareTitle,
    ageHint: '5–10 év',
    category: 'math',
    mount: mountCompare,
  },
  math: {
    id: 'math',
    emoji: '➕',
    title: strings.title,
    ageHint: '7–10 év',
    category: 'math',
    mount: mountMath,
  },
  multiply: {
    id: 'multiply',
    emoji: '✖️',
    title: strings.multiplyTitle,
    ageHint: '8–10 év',
    category: 'hard',
    mount: mountMultiply,
  },
  clock: {
    id: 'clock',
    emoji: '🕐',
    title: strings.clockTitle,
    ageHint: '6–10 év',
    category: 'hard',
    mount: mountClock,
  },
  words: {
    id: 'words',
    emoji: '📝',
    title: strings.wordsTitle,
    ageHint: '7–10 év',
    category: 'hard',
    mount: mountWords,
  },
};

export const GAME_CATEGORIES: GameCategoryGroup[] = [
  { category: 'simple', gameIds: ['counting', 'memory', 'simon'] },
  { category: 'math', gameIds: ['sequence', 'compare', 'math'] },
  { category: 'hard', gameIds: ['multiply', 'clock', 'words'] },
];

export function getGame(id: GameId): GameModule {
  return GAME_MODULES[id];
}
