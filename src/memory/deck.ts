import { shuffle, type Rng } from '../game/random';
import {
  getMemorySize,
  getSymbolPool,
  MEMORY_TRICKY_SYMBOLS,
  type MemoryCard,
  type MemorySizeKey,
} from './types';

const TRICKY_CORE_MONKEY_IDS = ['monkey-see', 'monkey-hear', 'monkey-speak'];

function createTrickyDeck(pairs: number, rng: Rng): MemoryCard[] {
  const coreMonkeys = TRICKY_CORE_MONKEY_IDS.map((id) =>
    MEMORY_TRICKY_SYMBOLS.find((symbol) => symbol.id === id)!,
  );
  const hearts = shuffle(
    MEMORY_TRICKY_SYMBOLS.filter((symbol) => symbol.id.startsWith('heart-')),
    rng,
  ).slice(0, pairs - coreMonkeys.length);
  const chosen = [...coreMonkeys, ...hearts];
  const cards: MemoryCard[] = [];
  let id = 0;

  for (const symbol of chosen) {
    cards.push({ id: id++, symbolId: symbol.id, state: 'hidden' });
    cards.push({ id: id++, symbolId: symbol.id, state: 'hidden' });
  }

  return shuffle(cards, rng);
}

export function createDeck(sizeKey: MemorySizeKey, rng: Rng): MemoryCard[] {
  const { pairs, pool } = getMemorySize(sizeKey);
  if (pool === 'tricky') {
    return createTrickyDeck(pairs, rng);
  }

  const chosen = shuffle(getSymbolPool(sizeKey), rng).slice(0, pairs);
  const cards: MemoryCard[] = [];
  let id = 0;

  for (const symbol of chosen) {
    cards.push({ id: id++, symbolId: symbol.id, state: 'hidden' });
    cards.push({ id: id++, symbolId: symbol.id, state: 'hidden' });
  }

  return shuffle(cards, rng);
}
