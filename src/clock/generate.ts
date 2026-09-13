import { generateUniqueRound } from '../game/round';
import { pickOne, randomInt, shuffle, type Rng } from '../game/random';
import type { ClockLevel, ClockQuestion } from './types';

export function formatDigitalTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m}`;
}

const HOUR_NAMES = [
  'tizenkettő',
  'egy',
  'kettő',
  'három',
  'négy',
  'öt',
  'hat',
  'hét',
  'nyolc',
  'kilenc',
  'tíz',
  'tizenegy',
];

export function formatSpokenHungarian(hour: number, minute: number): string {
  const h12 = hour % 12;
  const nextHour = (h12 + 1) % 12;
  const nextName = HOUR_NAMES[nextHour];

  if (minute === 0) {
    return `${HOUR_NAMES[h12]} óra`;
  }
  if (minute === 15) {
    return `negyed ${nextName}`;
  }
  if (minute === 30) {
    return `fél ${nextName}`;
  }
  if (minute === 45) {
    return `háromnegyed ${nextName}`;
  }
  return formatDigitalTime(hour, minute);
}

function validMinutes(step: number, rng: Rng): number {
  if (step >= 60) {
    return 0;
  }
  const options: number[] = [];
  for (let m = 0; m < 60; m += step) {
    options.push(m);
  }
  return pickOne(options, rng);
}

function digitalDistractors(
  hour: number,
  minute: number,
  rng: Rng,
): string[] {
  const correct = formatDigitalTime(hour, minute);
  const candidates = new Set<string>();
  candidates.add(correct);
  candidates.add(formatDigitalTime(hour + 1, minute));
  candidates.add(formatDigitalTime(hour, minute === 0 ? 30 : 0));
  candidates.add(formatDigitalTime(hour, minute === 30 ? 0 : 30));
  candidates.add(formatDigitalTime(hour - 1, minute));

  const choices = [correct];
  const pool = [...candidates].filter((c) => c !== correct);
  while (choices.length < 4 && pool.length > 0) {
    const idx = randomInt(0, pool.length - 1, rng);
    choices.push(pool.splice(idx, 1)[0]);
  }
  while (choices.length < 4) {
    choices.push(formatDigitalTime(randomInt(1, 12, rng), validMinutes(30, rng)));
  }
  return shuffle(choices, rng);
}

function spokenDistractors(
  hour: number,
  minute: number,
  rng: Rng,
): string[] {
  const correct = formatSpokenHungarian(hour, minute);
  const candidates = new Set<string>();
  candidates.add(correct);
  candidates.add(formatSpokenHungarian(hour, 0));
  candidates.add(formatSpokenHungarian(hour, 30));
  candidates.add(formatSpokenHungarian(hour, 15));
  candidates.add(formatSpokenHungarian(hour, 45));
  candidates.add(formatSpokenHungarian(hour + 1, minute));

  const choices = [correct];
  const pool = [...candidates].filter((c) => c !== correct);
  while (choices.length < 4 && pool.length > 0) {
    const idx = randomInt(0, pool.length - 1, rng);
    choices.push(pool.splice(idx, 1)[0]);
  }
  return shuffle(choices, rng);
}

export function generateClockQuestion(
  level: ClockLevel,
  rng: Rng = Math.random,
): ClockQuestion {
  const hour = randomInt(1, 12, rng);
  const minute = validMinutes(level.minuteStep, rng);
  const answer =
    level.answerMode === 'spoken'
      ? formatSpokenHungarian(hour, minute)
      : formatDigitalTime(hour, minute);

  const question: ClockQuestion = {
    id: `${hour}:${minute}:${level.answerMode}`,
    hour,
    minute,
    answerMode: level.answerMode,
    answer,
    choices: [],
  };
  question.choices = getClockChoices(question, rng);
  return question;
}

export function generateClockRound(
  level: ClockLevel,
  roundSize: number,
  rng: Rng = Math.random,
): ClockQuestion[] {
  return generateUniqueRound(
    roundSize,
    () => generateClockQuestion(level, rng),
    (q) => q.id,
    rng,
  );
}

export function getClockChoices(
  question: ClockQuestion,
  rng: Rng = Math.random,
): string[] {
  if (question.answerMode === 'spoken') {
    return spokenDistractors(question.hour, question.minute, rng);
  }
  return digitalDistractors(question.hour, question.minute, rng);
}

export function checkClockAnswer(
  question: ClockQuestion,
  input: string,
): boolean {
  return input === question.answer;
}

export function clockCorrectAnswer(question: ClockQuestion): string {
  return question.answer;
}
