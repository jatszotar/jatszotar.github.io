export type ClockAnswerMode = 'digital' | 'spoken';

export interface ClockLevel {
  minuteStep: number;
  answerMode: ClockAnswerMode;
}

export interface ClockQuestion {
  id: string;
  hour: number;
  minute: number;
  answerMode: ClockAnswerMode;
  answer: string;
  choices: string[];
}

export const CLOCK_LEVELS: ClockLevel[] = [
  { minuteStep: 60, answerMode: 'digital' },
  { minuteStep: 30, answerMode: 'digital' },
  { minuteStep: 15, answerMode: 'digital' },
  { minuteStep: 5, answerMode: 'digital' },
  { minuteStep: 15, answerMode: 'spoken' },
];
