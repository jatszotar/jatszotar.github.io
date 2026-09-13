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
