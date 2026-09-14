export type Rng = () => number;

export function createSeededRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function shuffle<T>(items: T[], rng: Rng): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickOne<T>(items: T[], rng: Rng): T {
  if (items.length === 0) {
    throw new Error('Cannot pick from an empty list');
  }
  const index = Math.floor(rng() * items.length);
  return items[index];
}

export function randomInt(min: number, max: number, rng: Rng): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pickWeighted<T>(
  items: T[],
  weightFn: (item: T) => number,
  rng: Rng,
): T {
  if (items.length === 0) {
    throw new Error('Cannot pick from an empty list');
  }

  const weights = items.map((item) => Math.max(weightFn(item), 0.001));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = rng() * total;

  for (let i = 0; i < items.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

/** Weighted shuffle: higher-weight items tend to appear earlier. */
export function weightedShuffle<T>(
  items: T[],
  weightFn: (item: T) => number,
  rng: Rng,
): T[] {
  return [...items]
    .map((item) => ({
      item,
      key: Math.pow(rng(), 1 / Math.max(weightFn(item), 0.001)),
    }))
    .sort((a, b) => b.key - a.key)
    .map(({ item }) => item);
}
