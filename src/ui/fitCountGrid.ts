const LINE_HEIGHT = 1.3;
const ROW_OVERHEAD_PX = 8;
const MIN_REM = 0.85;
const MAX_REM = 2.25;

export function computeEmojiSizePx(
  availableHeight: number,
  rowCount: number,
  rowGapPx: number,
  rootFontSizePx: number,
): number {
  if (availableHeight <= 0 || rowCount <= 0) {
    return MIN_REM * rootFontSizePx;
  }

  const gaps = Math.max(0, rowCount - 1) * rowGapPx;
  const overhead = rowCount * ROW_OVERHEAD_PX;
  const sizePx = (availableHeight - gaps - overhead) / rowCount / LINE_HEIGHT;
  const minPx = MIN_REM * rootFontSizePx;
  const maxPx = MAX_REM * rootFontSizePx;
  return Math.min(maxPx, Math.max(minPx, sizePx));
}

export function attachFitCountGrid(grid: HTMLElement): () => void {
  const field = grid.closest('.count-field');
  if (!field) {
    return () => {};
  }

  const apply = (): void => {
    const rowCount = Number(grid.dataset.rows) || 1;
    const hint = field.querySelector('.count-hint');
    const hintHeight = hint?.getBoundingClientRect().height ?? 0;
    const availableHeight = field.clientHeight - hintHeight;
    const rowGapPx = parseFloat(getComputedStyle(grid).rowGap || getComputedStyle(grid).gap) || 0;
    const rootFontSizePx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const sizePx = computeEmojiSizePx(
      availableHeight,
      rowCount,
      rowGapPx,
      rootFontSizePx,
    );
    grid.style.setProperty('--count-emoji-size', `${sizePx}px`);
  };

  const observer = new ResizeObserver(apply);
  observer.observe(field);
  observer.observe(grid);
  apply();
  requestAnimationFrame(apply);

  return () => {
    observer.disconnect();
  };
}
