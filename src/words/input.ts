export interface WordsTileState {
  selectedTiles: number[];
  pending: string;
}

export function createWordsTileState(): WordsTileState {
  return { selectedTiles: [], pending: '' };
}

export function isTileUsed(state: WordsTileState, tileIndex: number): boolean {
  return state.selectedTiles.includes(tileIndex);
}

export function selectedGraphemes(
  state: WordsTileState,
  shuffled: string[],
): string[] {
  return state.selectedTiles.map((tileIndex) => shuffled[tileIndex]);
}

export function pickTile(
  state: WordsTileState,
  tileIndex: number,
): WordsTileState {
  if (isTileUsed(state, tileIndex)) {
    return state;
  }

  return {
    selectedTiles: [...state.selectedTiles, tileIndex],
    pending: '',
  };
}

function findUnusedTiles(
  state: WordsTileState,
  shuffled: string[],
): { index: number; grapheme: string }[] {
  return shuffled
    .map((grapheme, index) => ({ index, grapheme }))
    .filter(({ index }) => !isTileUsed(state, index));
}

function findExactUnusedTile(
  state: WordsTileState,
  shuffled: string[],
  candidate: string,
): number | null {
  const match = findUnusedTiles(state, shuffled).find(
    ({ grapheme }) => grapheme === candidate,
  );
  return match?.index ?? null;
}

function hasPrefixMatch(
  state: WordsTileState,
  shuffled: string[],
  candidate: string,
): boolean {
  return findUnusedTiles(state, shuffled).some(
    ({ grapheme }) =>
      grapheme.length > candidate.length && grapheme.startsWith(candidate),
  );
}

function tryConsumeCandidate(
  state: WordsTileState,
  shuffled: string[],
  candidate: string,
): WordsTileState | null {
  if (hasPrefixMatch(state, shuffled, candidate)) {
    return { ...state, pending: candidate };
  }

  const exactIndex = findExactUnusedTile(state, shuffled, candidate);
  if (exactIndex !== null) {
    return pickTile(state, exactIndex);
  }

  return null;
}

export function consumeKey(
  state: WordsTileState,
  key: string,
  shuffled: string[],
): WordsTileState {
  const normalizedKey = key.toLowerCase();

  const withPending = tryConsumeCandidate(
    state,
    shuffled,
    state.pending + normalizedKey,
  );
  if (withPending) {
    return withPending;
  }

  if (state.pending.length > 0) {
    const pendingTile = findExactUnusedTile(state, shuffled, state.pending);
    if (pendingTile !== null) {
      const afterPending = pickTile(state, pendingTile);
      const afterKey = tryConsumeCandidate(afterPending, shuffled, normalizedKey);
      if (afterKey) {
        return afterKey;
      }
      return afterPending;
    }

    return consumeKey({ ...state, pending: '' }, normalizedKey, shuffled);
  }

  const direct = tryConsumeCandidate(state, shuffled, normalizedKey);
  return direct ?? state;
}

export function deleteLast(state: WordsTileState): WordsTileState {
  if (state.pending.length > 0) {
    return { ...state, pending: '' };
  }

  if (state.selectedTiles.length === 0) {
    return state;
  }

  return {
    selectedTiles: state.selectedTiles.slice(0, -1),
    pending: '',
  };
}

export function canDelete(state: WordsTileState): boolean {
  return state.pending.length > 0 || state.selectedTiles.length > 0;
}
