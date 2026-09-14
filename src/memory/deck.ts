import { pickOne, shuffle, type Rng } from '../game/random';
import {
  getMemorySize,
  getSymbolPool,
  MEMORY_TRICKY_SYMBOLS_BY_CATEGORY,
  TRICKY_CATEGORIES,
  type MemoryCard,
  type MemorySizeKey,
} from './types';

function createTrickyDeck(pairs: number, rng: Rng): MemoryCard[] {
  const category = pickOne(TRICKY_CATEGORIES, rng);
  const pool = MEMORY_TRICKY_SYMBOLS_BY_CATEGORY[category];
  const chosen = shuffle(pool, rng).slice(0, pairs);
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
