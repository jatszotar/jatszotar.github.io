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
  { id: 'turtle', emoji: '🐢', label: 'teknős' },
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

export type TrickyCategory = 'shapes' | 'animals' | 'nature';

export const TRICKY_CATEGORIES: TrickyCategory[] = ['shapes', 'animals', 'nature'];

const MEMORY_TRICKY_SHAPES: MemorySymbol[] = [
  { id: 'heart-red', emoji: '❤️', label: 'piros szív' },
  { id: 'heart-orange', emoji: '🧡', label: 'narancs szív' },
  { id: 'heart-yellow', emoji: '💛', label: 'sárga szív' },
  { id: 'heart-green', emoji: '💚', label: 'zöld szív' },
  { id: 'heart-blue', emoji: '💙', label: 'kék szív' },
  { id: 'heart-purple', emoji: '💜', label: 'lila szív' },
  { id: 'circle-red', emoji: '🔴', label: 'piros kör' },
  { id: 'circle-orange', emoji: '🟠', label: 'narancs kör' },
  { id: 'circle-yellow', emoji: '🟡', label: 'sárga kör' },
  { id: 'circle-green', emoji: '🟢', label: 'zöld kör' },
  { id: 'circle-blue', emoji: '🔵', label: 'kék kör' },
  { id: 'circle-purple', emoji: '🟣', label: 'lila kör' },
  { id: 'square-red', emoji: '🟥', label: 'piros négyzet' },
  { id: 'square-orange', emoji: '🟧', label: 'narancs négyzet' },
  { id: 'square-yellow', emoji: '🟨', label: 'sárga négyzet' },
  { id: 'square-green', emoji: '🟩', label: 'zöld négyzet' },
  { id: 'square-blue', emoji: '🟦', label: 'kék négyzet' },
  { id: 'square-purple', emoji: '🟪', label: 'lila négyzet' },
];

const MEMORY_TRICKY_ANIMALS: MemorySymbol[] = [
  { id: 'monkey-see', emoji: '🙈', label: 'nem lát' },
  { id: 'monkey-hear', emoji: '🙉', label: 'nem hall' },
  { id: 'monkey-speak', emoji: '🙊', label: 'nem szól' },
  { id: 'monkey', emoji: '🐵', label: 'majom' },
  { id: 'catface-happy', emoji: '😺', label: 'mosolygó macska' },
  { id: 'catface-grin', emoji: '😸', label: 'vigyor' },
  { id: 'catface-joy', emoji: '😹', label: 'nevető macska' },
  { id: 'catface-love', emoji: '😻', label: 'szerelmes macska' },
  { id: 'bird-chick', emoji: '🐤', label: 'csibe' },
  { id: 'bird-baby', emoji: '🐥', label: 'baba csibe' },
  { id: 'bird-sparrow', emoji: '🐦', label: 'madár' },
  { id: 'bird-penguin', emoji: '🐧', label: 'pingvin' },
];

const MEMORY_TRICKY_NATURE: MemorySymbol[] = [
  { id: 'book-red', emoji: '📕', label: 'piros könyv' },
  { id: 'book-green', emoji: '📗', label: 'zöld könyv' },
  { id: 'book-blue', emoji: '📘', label: 'kék könyv' },
  { id: 'book-orange', emoji: '📙', label: 'narancs könyv' },
  { id: 'flower-cherry', emoji: '🌸', label: 'cseresznyevirág' },
  { id: 'flower-hibiscus', emoji: '🌺', label: 'hibiszkusz' },
  { id: 'flower-sunflower', emoji: '🌻', label: 'napraforgó' },
  { id: 'flower-blossom', emoji: '🌼', label: 'virág' },
  { id: 'leaf-clover', emoji: '🍀', label: 'lóhere' },
  { id: 'leaf-herb', emoji: '🌿', label: 'fű' },
  { id: 'leaf-sprout', emoji: '🌱', label: 'hajtás' },
  { id: 'leaf-fallen', emoji: '🍃', label: 'levél' },
];

export const MEMORY_TRICKY_SYMBOLS_BY_CATEGORY: Record<
  TrickyCategory,
  MemorySymbol[]
> = {
  shapes: MEMORY_TRICKY_SHAPES,
  animals: MEMORY_TRICKY_ANIMALS,
  nature: MEMORY_TRICKY_NATURE,
};

/** Similar-looking symbols for the extra-hard level only. */
export const MEMORY_TRICKY_SYMBOLS: MemorySymbol[] = [
  ...MEMORY_TRICKY_SHAPES,
  ...MEMORY_TRICKY_ANIMALS,
  ...MEMORY_TRICKY_NATURE,
];

export function trickyCategoryForSymbolId(symbolId: string): TrickyCategory {
  for (const category of TRICKY_CATEGORIES) {
    if (
      MEMORY_TRICKY_SYMBOLS_BY_CATEGORY[category].some(
        (symbol) => symbol.id === symbolId,
      )
    ) {
      return category;
    }
  }
  throw new Error(`Unknown tricky symbol: ${symbolId}`);
}

/** Similar-looking clock faces for the hardest level. */
export const MEMORY_CLOCK_SYMBOLS: MemorySymbol[] = [
  { id: 'clock-1230', emoji: '🕧', label: 'fél 1' },
  { id: 'clock-100', emoji: '🕐', label: '1 óra' },
  { id: 'clock-130', emoji: '🕜', label: 'fél 2' },
  { id: 'clock-200', emoji: '🕑', label: '2 óra' },
  { id: 'clock-230', emoji: '🕝', label: 'fél 3' },
  { id: 'clock-300', emoji: '🕒', label: '3 óra' },
  { id: 'clock-330', emoji: '🕞', label: 'fél 4' },
  { id: 'clock-400', emoji: '🕓', label: '4 óra' },
  { id: 'clock-430', emoji: '🕟', label: 'fél 5' },
  { id: 'clock-500', emoji: '🕔', label: '5 óra' },
  { id: 'clock-530', emoji: '🕠', label: 'fél 6' },
  { id: 'clock-600', emoji: '🕕', label: '6 óra' },
  { id: 'clock-630', emoji: '🕡', label: 'fél 7' },
  { id: 'clock-700', emoji: '🕖', label: '7 óra' },
  { id: 'clock-730', emoji: '🕢', label: 'fél 8' },
  { id: 'clock-800', emoji: '🕗', label: '8 óra' },
  { id: 'clock-830', emoji: '🕣', label: 'fél 9' },
  { id: 'clock-900', emoji: '🕘', label: '9 óra' },
  { id: 'clock-930', emoji: '🕤', label: 'fél 10' },
  { id: 'clock-1000', emoji: '🕙', label: '10 óra' },
  { id: 'clock-1030', emoji: '🕥', label: 'fél 11' },
  { id: 'clock-1100', emoji: '🕚', label: '11 óra' },
  { id: 'clock-1130', emoji: '🕦', label: 'fél 12' },
  { id: 'clock-1200', emoji: '🕛', label: '12 óra' },
];

export type MemorySymbolPool = 'classic' | 'tricky' | 'clocks';

export type MemorySizeKey = 'easy' | 'medium' | 'hard' | 'tricky' | 'clocks';

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
  { key: 'clocks', pairs: 8, cols: 4, pool: 'clocks' },
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
  if (pool === 'tricky') {
    return MEMORY_TRICKY_SYMBOLS;
  }
  if (pool === 'clocks') {
    return MEMORY_CLOCK_SYMBOLS;
  }
  return MEMORY_SYMBOLS;
}

export function getSymbolById(symbolId: string): MemorySymbol {
  const symbol =
    MEMORY_SYMBOLS.find((entry) => entry.id === symbolId) ??
    MEMORY_TRICKY_SYMBOLS.find((entry) => entry.id === symbolId) ??
    MEMORY_CLOCK_SYMBOLS.find((entry) => entry.id === symbolId);
  if (!symbol) {
    throw new Error(`Unknown symbol: ${symbolId}`);
  }
  return symbol;
}
