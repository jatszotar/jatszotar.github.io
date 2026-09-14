import { describe, expect, it } from 'vitest';
import {
  graphemeCount,
  hasDigraph,
  tokenizeHungarian,
  wordsForLevel,
  WORD_BANK,
} from '../src/words/bank';
import {
  checkWordsAnswer,
  generateWordsQuestion,
  generateWordsRound,
} from '../src/words/generate';
import { ROUND_SIZE } from '../src/game/types';
import { WORDS_LEVELS } from '../src/words/types';

describe('word bank', () => {
  it('tokenizes Hungarian digraphs', () => {
    expect(tokenizeHungarian('csillag')).toEqual(['cs', 'i', 'l', 'l', 'a', 'g']);
    expect(tokenizeHungarian('szív')).toEqual(['sz', 'í', 'v']);
    expect(tokenizeHungarian('gyerek')).toEqual(['gy', 'e', 'r', 'e', 'k']);
  });

  it('provides a non-empty pool for every level', () => {
    for (const level of WORDS_LEVELS) {
      expect(wordsForLevel(level).length).toBeGreaterThan(0);
    }
  });

  it('provides at least ROUND_SIZE words for every level', () => {
    for (const level of WORDS_LEVELS) {
      expect(wordsForLevel(level).length).toBeGreaterThanOrEqual(ROUND_SIZE);
    }
  });

  it('includes every bank word in at least one level', () => {
    for (const entry of WORD_BANK) {
      const matched = WORDS_LEVELS.some((level) =>
        wordsForLevel(level).some((candidate) => candidate.id === entry.id),
      );
      expect(matched).toBe(true);
    }
  });

  it('keeps unique word ids', () => {
    const ids = WORD_BANK.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('words generate', () => {
  it('respects grapheme count levels without digraphs', () => {
    const q = generateWordsQuestion(WORDS_LEVELS[0], () => 0.1);
    expect(graphemeCount(q.entry)).toBeGreaterThanOrEqual(2);
    expect(graphemeCount(q.entry)).toBeLessThanOrEqual(4);
    expect(hasDigraph(q.entry)).toBe(false);
    expect(checkWordsAnswer(q, q.entry.graphemes.join(''))).toBe(true);
  });

  it('allows digraphs at higher levels', () => {
    const round = generateWordsRound(WORDS_LEVELS[2], ROUND_SIZE, () => 0.5);
    expect(round).toHaveLength(ROUND_SIZE);
    for (const q of round) {
      expect(graphemeCount(q.entry)).toBeGreaterThanOrEqual(6);
    }
  });
});
