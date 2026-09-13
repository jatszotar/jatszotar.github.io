export function attachSummaryKeyboard(
  onEnter: () => void,
  signal: AbortSignal,
): void {
  const handleKeyboard = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    onEnter();
  };

  window.addEventListener('keydown', handleKeyboard, { signal });
}
