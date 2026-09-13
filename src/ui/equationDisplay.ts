export type EquationFeedbackType = 'none' | 'correct' | 'wrong';

export interface BlankSlotOptions {
  value: string;
  feedbackType: EquationFeedbackType;
  size?: 'narrow' | 'wide';
}

export interface EquationAnswerState {
  input: string;
  revealedAnswer: string | null;
  lastWrongInput?: string | null;
  feedbackType: EquationFeedbackType;
}

export function blankValueFromState(state: EquationAnswerState): string {
  if (state.feedbackType === 'wrong' && state.lastWrongInput) {
    return state.lastWrongInput;
  }
  return state.revealedAnswer ?? state.input;
}

export function answerDisplayValueFromState(state: EquationAnswerState): string {
  if (state.feedbackType === 'wrong' && state.lastWrongInput) {
    return state.lastWrongInput;
  }
  const value = state.revealedAnswer ?? state.input;
  return value.length > 0 ? value : '?';
}

export function createBlankSlot(options: BlankSlotOptions): HTMLElement {
  const slot = document.createElement('span');
  slot.className = 'blank-slot';
  if (options.size === 'wide') {
    slot.classList.add('blank-slot-wide');
  }
  if (options.feedbackType !== 'none') {
    slot.classList.add(options.feedbackType);
  }
  slot.textContent = options.value;
  slot.setAttribute('aria-hidden', options.value.length === 0 ? 'true' : 'false');
  return slot;
}

export function createTextPart(text: string): HTMLElement {
  const part = document.createElement('span');
  part.className = 'equation-part';
  part.textContent = text;
  return part;
}

export function createEquationRow(
  children: HTMLElement[],
  className = 'equation',
): HTMLElement {
  const row = document.createElement('div');
  row.className = className;
  for (const child of children) {
    row.appendChild(child);
  }
  return row;
}

export type OperandBlankPosition = 'left' | 'right' | 'result';

export function buildOperandEquation(options: {
  left: number;
  right: number;
  result: number;
  op: string;
  blank: OperandBlankPosition;
  state: EquationAnswerState;
  rowClass?: string;
}): HTMLElement {
  const blankValue = blankValueFromState(options.state);
  const feedbackType = options.state.feedbackType;

  const leftPart =
    options.blank === 'left'
      ? createBlankSlot({ value: blankValue, feedbackType })
      : createTextPart(String(options.left));

  const rightPart =
    options.blank === 'right'
      ? createBlankSlot({ value: blankValue, feedbackType })
      : createTextPart(String(options.right));

  const resultPart =
    options.blank === 'result'
      ? createBlankSlot({ value: blankValue, feedbackType })
      : createTextPart(String(options.result));

  return createEquationRow(
    [leftPart, createTextPart(options.op), rightPart, createTextPart('='), resultPart],
    options.rowClass ?? 'equation multiply-equation',
  );
}
