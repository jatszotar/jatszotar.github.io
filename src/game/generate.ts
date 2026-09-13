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
import { pickOne, weightedShuffle, type Rng } from './random';

function factKey(fact: Fact): string {
  return `${fact.left}${fact.op}${fact.right}`;
}

export function problemKey(problem: Problem): string {
  return `${factKey(problem)}:${problem.blank}`;
}

function tiersForMax(max: RangeMax): RangeMax[] {
  return RANGE_MAXES.filter((boundary) => boundary <= max);
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
  return total / parts.length;
}

function shuffleFacts(facts: Fact[], max: RangeMax, rng: Rng): Fact[] {
  return weightedShuffle(facts, (fact) => factWeight(fact, max), rng);
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
  bag: Fact[];
  previousKey: string | null;
}

export function createProblemBag(
  config: RoundConfig,
  rng: Rng = Math.random,
): ProblemBag {
  const pool = enumerateFacts(config.max, config.operationFilter);
  if (pool.length === 0) {
    throw new Error('No facts available for the selected settings');
  }
  return {
    max: config.max,
    pool,
    bag: shuffleFacts(pool, config.max, rng),
    previousKey: null,
  };
}

export function drawProblem(
  problemBag: ProblemBag,
  phase: BlankPhase,
  rng: Rng = Math.random,
): { problem: Problem; bag: ProblemBag } {
  let { bag } = problemBag;
  const { max, pool, previousKey } = problemBag;

  if (bag.length === 0) {
    bag = shuffleFacts(pool, max, rng);
  }

  let fact = bag.shift()!;
  let key = factKey(fact);

  if (key === previousKey && bag.length > 0) {
    const alternate = bag.shift()!;
    bag.push(fact);
    fact = alternate;
    key = factKey(fact);
  }

  return {
    problem: buildProblem(fact, phase, rng),
    bag: { max, pool, bag, previousKey: key },
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

  let bag = shuffleFacts(pool, config.max, rng);
  const problems: Problem[] = [];
  let previousKey: string | null = null;

  while (problems.length < config.roundSize) {
    if (bag.length === 0) {
      bag = shuffleFacts(pool, config.max, rng);
    }

    let fact = bag.shift()!;
    let key = factKey(fact);

    if (key === previousKey && bag.length > 0) {
      const alternate = bag.shift()!;
      bag.push(fact);
      fact = alternate;
      key = factKey(fact);
    }

    problems.push(buildProblem(fact, config.phase, rng));
    previousKey = key;
  }

  return problems;
}

export { answerFor, enumerateFacts, factKey };
