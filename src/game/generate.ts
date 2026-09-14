import type {
  BlankPhase,
  BlankPosition,
  Fact,
  OperationFilter,
  Problem,
  RangeMax,
  RoundConfig,
} from './types';
import { RANGE_MAXES } from './types';
import { pickOne, pickWeighted, type Rng } from './random';

const MAX_PICK_ATTEMPTS = 10;

function factKey(fact: Fact): string {
  return `${fact.left}${fact.op}${fact.right}`;
}

export function problemKey(problem: Problem): string {
  return `${factKey(problem)}:${problem.blank}`;
}

function tiersForMax(max: RangeMax): RangeMax[] {
  return RANGE_MAXES.filter((boundary) => boundary <= max);
}

/** n±0, 0+n, and n−n — too easy to dominate early levels. */
export function isTrivialZeroFact(fact: Fact): boolean {
  if (fact.left === 0 || fact.right === 0) {
    return true;
  }
  if (fact.op === '-' && fact.left === fact.right) {
    return true;
  }
  return false;
}

function trivialZeroWeightFactor(max: RangeMax): number {
  if (max === 5) {
    return 0.08;
  }
  if (max === 10) {
    return 0.25;
  }
  return 0.5;
}

/** Higher for larger numbers and for the current range tier; low for 0. */
export function operandWeight(n: number, max: RangeMax): number {
  if (n === 0) {
    return 0.12;
  }

  const tiers = tiersForMax(max);

  if (tiers.length === 1) {
    return 0.45 + 0.55 * (n / max);
  }

  const tierIdx = tiers.findIndex((boundary) => n <= boundary);
  const tierProgress = tierIdx / (tiers.length - 1);
  const tierFactor = 0.35 + 0.65 * tierProgress;

  const tierStart = tierIdx === 0 ? 1 : tiers[tierIdx - 1] + 1;
  const tierEnd = tiers[tierIdx];
  const withinTier = (n - tierStart) / Math.max(tierEnd - tierStart, 1);
  const withinFactor = 0.55 + 0.45 * withinTier;

  return tierFactor * withinFactor;
}

export function factWeight(fact: Fact, max: RangeMax): number {
  const parts = [fact.left, fact.right, fact.result];
  const total = parts.reduce((sum, n) => sum + operandWeight(n, max), 0);
  let weight = total / parts.length;

  if (isTrivialZeroFact(fact)) {
    weight *= trivialZeroWeightFactor(max);
  }

  return weight;
}

function enumerateFacts(max: RangeMax, operationFilter: OperationFilter): Fact[] {
  const facts: Fact[] = [];

  const includeAdd = operationFilter === 'add' || operationFilter === 'mixed';
  const includeSubtract = operationFilter === 'subtract' || operationFilter === 'mixed';

  if (includeAdd) {
    for (let left = 0; left <= max; left += 1) {
      for (let right = 0; right <= max; right += 1) {
        const result = left + right;
        if (result <= max) {
          facts.push({ left, op: '+', right, result });
        }
      }
    }
  }

  if (includeSubtract) {
    for (let left = 0; left <= max; left += 1) {
      for (let right = 0; right <= left; right += 1) {
        facts.push({ left, op: '-', right, result: left - right });
      }
    }
  }

  return facts;
}

function blankPositionsForPhase(phase: BlankPhase): BlankPosition[] {
  if (phase === 1) {
    return ['result'];
  }
  if (phase === 2) {
    return ['left', 'right'];
  }
  return ['left', 'right', 'result'];
}

function withBlank(fact: Fact, blank: BlankPosition): Problem {
  return { ...fact, blank };
}

function answerFor(problem: Problem): number {
  if (problem.blank === 'left') {
    return problem.left;
  }
  if (problem.blank === 'right') {
    return problem.right;
  }
  return problem.result;
}

function pickFact(
  pool: Fact[],
  max: RangeMax,
  previousKey: string | null,
  rng: Rng,
): Fact {
  const weightFn = (fact: Fact) => factWeight(fact, max);
  let fact = pickWeighted(pool, weightFn, rng);

  if (previousKey === null || pool.length === 1) {
    return fact;
  }

  for (let attempt = 0; attempt < MAX_PICK_ATTEMPTS && factKey(fact) === previousKey; attempt += 1) {
    fact = pickWeighted(pool, weightFn, rng);
  }

  return fact;
}

export function buildProblem(
  fact: Fact,
  phase: BlankPhase,
  rng: Rng,
): Problem {
  const blank = pickOne(blankPositionsForPhase(phase), rng);
  return withBlank(fact, blank);
}

export interface ProblemBag {
  max: RangeMax;
  pool: Fact[];
  previousKey: string | null;
}

export function createProblemBag(
  config: RoundConfig,
  _rng: Rng = Math.random,
): ProblemBag {
  const pool = enumerateFacts(config.max, config.operationFilter);
  if (pool.length === 0) {
    throw new Error('No facts available for the selected settings');
  }
  return {
    max: config.max,
    pool,
    previousKey: null,
  };
}

export function drawProblem(
  problemBag: ProblemBag,
  phase: BlankPhase,
  rng: Rng = Math.random,
): { problem: Problem; bag: ProblemBag } {
  const { max, pool, previousKey } = problemBag;
  const fact = pickFact(pool, max, previousKey, rng);
  const key = factKey(fact);

  return {
    problem: buildProblem(fact, phase, rng),
    bag: { max, pool, previousKey: key },
  };
}

export function generateRound(
  config: RoundConfig,
  rng: Rng = Math.random,
): Problem[] {
  const pool = enumerateFacts(config.max, config.operationFilter);
  if (pool.length === 0) {
    throw new Error('No facts available for the selected settings');
  }

  const problems: Problem[] = [];
  let previousKey: string | null = null;

  while (problems.length < config.roundSize) {
    const fact = pickFact(pool, config.max, previousKey, rng);
    const key = factKey(fact);
    problems.push(buildProblem(fact, config.phase, rng));
    previousKey = key;
  }

  return problems;
}

export { answerFor, enumerateFacts, factKey };
