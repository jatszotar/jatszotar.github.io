import { describe, expect, it } from 'vitest';
import {
  consumeKey,
  createWordsTileState,
  deleteLast,
  isTileUsed,
  pickTile,
  selectedGraphemes,
} from '../src/words/input';

describe('words input', () => {
  it('places single-letter tiles from keyboard input', () => {
    const shuffled = ['a', 'l', 'm'];
    let state = createWordsTileState();

    state = consumeKey(state, 'a', shuffled);
    state = consumeKey(state, 'l', shuffled);
    state = consumeKey(state, 'm', shuffled);

    expect(selectedGraphemes(state, shuffled)).toEqual(['a', 'l', 'm']);
    expect(state.pending).toBe('');
  });

  it('buffers digraph prefixes until the full tile spelling is typed', () => {
    const shuffled = ['sz', 'é', 'k'];
    let state = createWordsTileState();

    state = consumeKey(state, 's', shuffled);
    expect(state.pending).toBe('s');
    expect(state.selectedTiles).toEqual([]);

    state = consumeKey(state, 'z', shuffled);
    expect(selectedGraphemes(state, shuffled)).toEqual(['sz']);
    expect(state.pending).toBe('');
  });

  it('ignores unmatched keys', () => {
    const shuffled = ['a', 'l', 'm'];
    const state = consumeKey(createWordsTileState(), 'x', shuffled);

    expect(state.selectedTiles).toEqual([]);
    expect(state.pending).toBe('');
  });

  it('clears pending before removing the last placed tile', () => {
    const shuffled = ['sz', 'é', 'k'];
    let state = createWordsTileState();

    state = consumeKey(state, 's', shuffled);
    state = deleteLast(state);
    expect(state.pending).toBe('');
    expect(state.selectedTiles).toEqual([]);

    state = consumeKey(state, 's', shuffled);
    state = consumeKey(state, 'z', shuffled);
    state = deleteLast(state);
    expect(selectedGraphemes(state, shuffled)).toEqual([]);
    expect(isTileUsed(state, 0)).toBe(false);
  });

  it('commits pending input when the next key cannot continue a digraph', () => {
    const shuffled = ['s', 'sz', 'z'];
    let state = createWordsTileState();

    state = consumeKey(state, 's', shuffled);
    expect(state.pending).toBe('s');
    expect(selectedGraphemes(state, shuffled)).toEqual([]);

    state = consumeKey(state, 'x', shuffled);
    expect(selectedGraphemes(state, shuffled)).toEqual(['s']);

    state = consumeKey(state, 's', shuffled);
    expect(state.pending).toBe('s');

    state = consumeKey(state, 'z', shuffled);
    expect(selectedGraphemes(state, shuffled)).toEqual(['s', 'sz']);
  });

  it('supports tile clicks and undo via deleteLast', () => {
    const shuffled = ['k', 'u', 't', 'y', 'a'];
    let state = createWordsTileState();

    state = pickTile(state, 0);
    state = pickTile(state, 1);
    expect(selectedGraphemes(state, shuffled)).toEqual(['k', 'u']);

    state = deleteLast(state);
    expect(selectedGraphemes(state, shuffled)).toEqual(['k']);
    expect(isTileUsed(state, 1)).toBe(false);
  });
});
