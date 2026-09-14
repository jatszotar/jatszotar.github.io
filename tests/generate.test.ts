import { describe, expect, it } from 'vitest';
import {
  answerFor,
  buildProblem,
  createProblemBag,
  drawProblem,
  enumerateFacts,
  factKey,
  factWeight,
  generateRound,
  isTrivialZeroFact,
  operandWeight,
} from '../src/game/generate';
import { createSeededRng } from '../src/game/random';
import type { Fact, Problem, RoundConfig } from '../src/game/types';

function averageMaxOperand(problems: Problem[]): number {
  const values = problems.flatMap((p) => [p.left, p.right, p.result]);
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

function zeroRate(problems: Problem[]): number {
  const values = problems.flatMap((p) => [p.left, p.right, p.result]);
  const zeros = values.filter((n) => n === 0).length;
  return zeros / values.length;
}

function trivialZeroFactRate(problems: Problem[]): number {
  const trivial = problems.filter((problem) =>
    isTrivialZeroFact({
      left: problem.left,
      op: problem.op,
      right: problem.right,
      result: problem.result,
    }),
  ).length;
  return trivial / problems.length;
}

describe('isTrivialZeroFact', () => {
  it('flags n±0, 0+n, and n−n patterns', () => {
    expect(isTrivialZeroFact({ left: 4, op: '-', right: 0, result: 4 })).toBe(true);
    expect(isTrivialZeroFact({ left: 4, op: '-', right: 4, result: 0 })).toBe(true);
    expect(isTrivialZeroFact({ left: 0, op: '+', right: 4, result: 4 })).toBe(true);
    expect(isTrivialZeroFact({ left: 2, op: '+', right: 3, result: 5 })).toBe(false);
    expect(isTrivialZeroFact({ left: 5, op: '-', right: 2, result: 3 })).toBe(false);
  });

  it('applies a stronger penalty at max 5 than at max 15', () => {
    const trivial = { left: 4, op: '-' as const, right: 0, result: 4 };
    const normal = { left: 4, op: '+' as const, right: 1, result: 5 };
    const trivialAt5 = factWeight(trivial, 5);
    const trivialAt15 = factWeight(trivial, 15);
    const normalAt5 = factWeight(normal, 5);
    expect(trivialAt5).toBeLessThan(trivialAt15);
    expect(trivialAt5 / normalAt5).toBeLessThan(trivialAt15 / factWeight(normal, 15));
  });
});

describe('enumerateFacts', () => {
  it('includes only valid addition facts within range', () => {
    const facts = enumerateFacts(5, 'add');
    expect(facts).toContainEqual({ left: 2, op: '+', right: 3, result: 5 });
    expect(facts.some((fact) => fact.left + fact.right > 5)).toBe(false);
  });

  it('includes only non-negative subtraction facts', () => {
    const facts = enumerateFacts(5, 'subtract');
    expect(facts).toContainEqual({ left: 5, op: '-', right: 2, result: 3 });
    expect(facts.some((fact) => fact.result < 0)).toBe(false);
  });
});

describe('buildProblem', () => {
  const fact: Fact = { left: 2, op: '+', right: 5, result: 7 };

  it('uses result blank in phase 1', () => {
    const rng = createSeededRng(1);
    const problem = buildProblem(fact, 1, rng);
    expect(problem.blank).toBe('result');
    expect(answerFor(problem)).toBe(7);
  });

  it('uses operand blanks in phase 2', () => {
    const rng = createSeededRng(2);
    const problem = buildProblem(fact, 2, rng);
    expect(['left', 'right']).toContain(problem.blank);
  });

  it('can blank any position in phase 3', () => {
    const rng = createSeededRng(3);
    const problem = buildProblem(fact, 3, rng);
    expect(['left', 'right', 'result']).toContain(problem.blank);
  });
});

describe('generateRound', () => {
  it('reproduces the same round for the same seed', () => {
    const config: RoundConfig = { max: 5, phase: 1, operationFilter: 'mixed', roundSize: 8 };
    const first = generateRound(config, createSeededRng(42));
    const second = generateRound(config, createSeededRng(42));
    expect(first.map((problem) => factKey(problem))).toEqual(
      second.map((problem) => factKey(problem)),
    );
  });

  it('does not repeat the same fact back to back', () => {
    const config: RoundConfig = { max: 5, phase: 1, operationFilter: 'add', roundSize: 8 };
    const round = generateRound(config, createSeededRng(99));
    for (let i = 1; i < round.length; i += 1) {
      expect(factKey(round[i])).not.toBe(factKey(round[i - 1]));
    }
  });

  it('respects blank phase constraints', () => {
    const config: RoundConfig = { max: 10, phase: 2, operationFilter: 'mixed', roundSize: 8 };
    const round = generateRound(config, createSeededRng(7));
    for (const problem of round) {
      expect(['left', 'right']).toContain(problem.blank);
    }
  });
});

describe('weighted generation', () => {
  it('gives lower weight to zero and earlier tiers', () => {
    expect(operandWeight(0, 15)).toBeLessThan(operandWeight(3, 15));
    expect(operandWeight(3, 15)).toBeLessThan(operandWeight(12, 15));
    expect(factWeight({ left: 2, op: '+', right: 3, result: 5 }, 15)).toBeLessThan(
      factWeight({ left: 12, op: '+', right: 3, result: 15 }, 15),
    );
  });

  it('favors higher numbers over uniform sampling at max 15', () => {
    const config: RoundConfig = { max: 15, phase: 1, operationFilter: 'mixed', roundSize: 200 };
    const weighted = generateRound(config, createSeededRng(100));
    const uniformPool = enumerateFacts(15, 'mixed');
    const uniform: Problem[] = [];
    for (let i = 0; i < 200; i += 1) {
      uniform.push({ ...uniformPool[i % uniformPool.length], blank: 'result' });
    }

    expect(averageMaxOperand(weighted)).toBeGreaterThan(averageMaxOperand(uniform));
    expect(zeroRate(weighted)).toBeLessThan(zeroRate(uniform));
  });

  it('keeps trivial zero facts rare at max 5', () => {
    const phase1: RoundConfig = { max: 5, phase: 1, operationFilter: 'mixed', roundSize: 200 };
    const phase2: RoundConfig = { max: 5, phase: 2, operationFilter: 'mixed', roundSize: 200 };
    const round1 = generateRound(phase1, createSeededRng(501));
    const round2 = generateRound(phase2, createSeededRng(502));

    expect(trivialZeroFactRate(round1)).toBeLessThan(0.15);
    expect(trivialZeroFactRate(round2)).toBeLessThan(0.15);
  });

  it('still reduces trivial zero facts at max 15', () => {
    const config: RoundConfig = { max: 15, phase: 1, operationFilter: 'mixed', roundSize: 200 };
    const round = generateRound(config, createSeededRng(503));
    expect(trivialZeroFactRate(round)).toBeLessThan(0.25);
  });
});

describe('drawProblem', () => {
  it('draws problems one at a time from the bag', () => {
    const config: RoundConfig = { max: 5, phase: 1, operationFilter: 'add', roundSize: 8 };
    const bag = createProblemBag(config, createSeededRng(11));
    const first = drawProblem(bag, 1, createSeededRng(11));
    const second = drawProblem(first.bag, 1, createSeededRng(12));
    expect(first.problem.blank).toBe('result');
    expect(factKey(first.problem)).not.toBe(factKey(second.problem));
  });
});
