export interface MemorySymbol {
  id: string;
  emoji: string;
  label: string;
}

export const MEMORY_SYMBOLS: MemorySymbol[] = [
  { id: 'cat', emoji: '🐱', label: 'macska' },
  { id: 'dog', emoji: '🐶', label: 'kutya' },
  { id: 'house', emoji: '🏠', label: 'ház' },
  { id: 'car', emoji: '🚗', label: 'autó' },
  { id: 'sun', emoji: '☀️', label: 'nap' },
  { id: 'flower', emoji: '🌸', label: 'virág' },
  { id: 'fish', emoji: '🐟', label: 'hal' },
  { id: 'bird', emoji: '🐦', label: 'madár' },
  { id: 'apple', emoji: '🍎', label: 'alma' },
  { id: 'star', emoji: '⭐', label: 'csillag' },
  { id: 'ball', emoji: '⚽', label: 'labda' },
  { id: 'tree', emoji: '🌳', label: 'fa' },
  { id: 'bear', emoji: '🐻', label: 'medve' },
  { id: 'rabbit', emoji: '🐰', label: 'nyuszi' },
  { id: 'frog', emoji: '🐸', label: 'béka' },
  { id: 'bee', emoji: '🐝', label: 'méh' },
  { id: 'butterfly', emoji: '🦋', label: 'pillangó' },
  { id: 'banana', emoji: '🍌', label: 'banán' },
  { id: 'strawberry', emoji: '🍓', label: 'eper' },
  { id: 'balloon', emoji: '🎈', label: 'lufi' },
  { id: 'rainbow', emoji: '🌈', label: 'szivárvány' },
  { id: 'train', emoji: '🚂', label: 'vonat' },
  { id: 'moon', emoji: '🌙', label: 'hold' },
  { id: 'heart', emoji: '❤️', label: 'szív' },
];

/** Similar-looking symbols for the extra-hard level only. */
export const MEMORY_TRICKY_SYMBOLS: MemorySymbol[] = [
  { id: 'monkey-see', emoji: '🙈', label: 'nem lát' },
  { id: 'monkey-hear', emoji: '🙉', label: 'nem hall' },
  { id: 'monkey-speak', emoji: '🙊', label: 'nem szól' },
  { id: 'monkey', emoji: '🐵', label: 'majom' },
  { id: 'heart-red', emoji: '❤️', label: 'piros szív' },
  { id: 'heart-orange', emoji: '🧡', label: 'narancs szív' },
  { id: 'heart-yellow', emoji: '💛', label: 'sárga szív' },
  { id: 'heart-green', emoji: '💚', label: 'zöld szív' },
  { id: 'heart-blue', emoji: '💙', label: 'kék szív' },
  { id: 'heart-purple', emoji: '💜', label: 'lila szív' },
];

export type MemorySymbolPool = 'classic' | 'tricky';

export type MemorySizeKey = 'easy' | 'medium' | 'hard' | 'tricky';

export interface MemorySize {
  key: MemorySizeKey;
  pairs: number;
  cols: number;
  pool: MemorySymbolPool;
}

export const MEMORY_SIZES: MemorySize[] = [
  { key: 'easy', pairs: 3, cols: 3, pool: 'classic' },
  { key: 'medium', pairs: 6, cols: 4, pool: 'classic' },
  { key: 'hard', pairs: 8, cols: 4, pool: 'classic' },
  { key: 'tricky', pairs: 8, cols: 4, pool: 'tricky' },
];

export type CardState = 'hidden' | 'revealed' | 'matched';

export interface MemoryCard {
  id: number;
  symbolId: string;
  state: CardState;
}

export interface MemoryGame {
  sizeKey: MemorySizeKey;
  cards: MemoryCard[];
  flipped: number[];
  moves: number;
  matchedPairs: number;
  totalPairs: number;
}

export interface MemoryWinResult {
  moves: number;
  pairs: number;
}

export function getMemorySize(key: MemorySizeKey): MemorySize {
  const size = MEMORY_SIZES.find((entry) => entry.key === key);
  if (!size) {
    throw new Error(`Unknown memory size: ${key}`);
  }
  return size;
}

export function memorySizeIndex(key: MemorySizeKey): number {
  const index = MEMORY_SIZES.findIndex((entry) => entry.key === key);
  if (index < 0) {
    throw new Error(`Unknown memory size: ${key}`);
  }
  return index;
}

export function getSymbolPool(sizeKey: MemorySizeKey): MemorySymbol[] {
  const { pool } = getMemorySize(sizeKey);
  return pool === 'tricky' ? MEMORY_TRICKY_SYMBOLS : MEMORY_SYMBOLS;
}

export function getSymbolById(symbolId: string): MemorySymbol {
  const symbol =
    MEMORY_SYMBOLS.find((entry) => entry.id === symbolId) ??
    MEMORY_TRICKY_SYMBOLS.find((entry) => entry.id === symbolId);
  if (!symbol) {
    throw new Error(`Unknown symbol: ${symbolId}`);
  }
  return symbol;
}
