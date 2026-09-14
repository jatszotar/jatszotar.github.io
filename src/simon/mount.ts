import { playNote, playWrong, unlockAudio } from '../audio/sounds';
import {
  loadGameProgress,
  recordRoundResult,
  saveGameProgress,
} from '../progress/store';
import { setAppToolbarBack } from '../ui/appToolbar';
import { createCard, createPlayHeader } from '../ui/shell';
import { renderQuizSummary } from '../ui/quizSummary';
import { renderLevelHome } from '../ui/levelHome';
import { strings } from '../ui/strings';
import {
  completeSubRound,
  createSimonGame,
  pressPad,
  setPhase,
  startRetry,
} from './game';
import {
  SIMON_LEVELS,
  SIMON_PADS,
  simonUnlockThreshold,
  type SimonGame,
  type SimonLevel,
} from './types';

type SimonScreen = 'home' | 'play' | 'summary';

const BETWEEN_SUBROUNDS_MS = 900;

export function mountSimon(root: HTMLElement, onExit: () => void): void {
  const maxLevelIndex = SIMON_LEVELS.length - 1;
  let screen: SimonScreen = 'home';
  let progress = loadGameProgress('simon', maxLevelIndex);
  let levelIndex = 0;
  let game: SimonGame | null = null;
  let lastResult: { correct: number; total: number } | null = null;
  let summaryCleanup: (() => void) | null = null;
  let timeouts: number[] = [];

  const clearTimeouts = (): void => {
    for (const id of timeouts) {
      window.clearTimeout(id);
    }
    timeouts = [];
  };

  const watchTextFor = (sequenceLength: number): string =>
    sequenceLength === 1
      ? strings.simonWatchOne
      : strings.simonWatchMany(sequenceLength);

  const finishRound = (
    result: { correct: number; total: number },
    delayMs: number,
  ): void => {
    timeouts.push(
      window.setTimeout(() => {
        progress = recordRoundResult(
          progress,
          levelIndex,
          result,
          maxLevelIndex,
          simonUnlockThreshold(SIMON_LEVELS[levelIndex]),
        );
        saveGameProgress('simon', progress);
        lastResult = result;
        screen = 'summary';
        game = null;
        render();
      }, delayMs),
    );
  };

  const advanceAfterSubRound = (success: boolean, delayMs: number): void => {
    if (!game) {
      return;
    }

    const { game: nextGame, done } = completeSubRound(game, success);
    game = nextGame;

    if (done) {
      finishRound(game.score, delayMs);
      return;
    }

    timeouts.push(
      window.setTimeout(() => {
        render();
      }, delayMs),
    );
  };

  const playSequence = (
    sequence: number[],
    playbackMs: number,
    pauseMs: number,
    onDone: () => void,
  ): void => {
    let i = 0;
    const step = (): void => {
      if (i >= sequence.length) {
        onDone();
        return;
      }
      const padIndex = sequence[i];
      playNote(padIndex as 0 | 1 | 2 | 3);
      const padEl = root.querySelector(`[data-pad="${padIndex}"]`);
      padEl?.classList.add('simon-lit');
      timeouts.push(
        window.setTimeout(() => {
          padEl?.classList.remove('simon-lit');
          i += 1;
          timeouts.push(window.setTimeout(step, pauseMs));
        }, playbackMs),
      );
    };
    step();
  };

  const beginPlayback = (status: HTMLElement): void => {
    if (!game) {
      return;
    }

    status.textContent = watchTextFor(game.sequence.length);
    for (const btn of root.querySelectorAll<HTMLButtonElement>('.simon-btn')) {
      btn.disabled = true;
    }

    playSequence(
      game.sequence,
      game.level.playbackMs,
      game.level.pauseMs,
      () => {
        if (game) {
          game = setPhase(game, 'awaiting');
          render();
        }
      },
    );
  };

  const render = (): void => {
    clearTimeouts();
    summaryCleanup?.();
    summaryCleanup = null;
    root.innerHTML = '';

    if (screen === 'home') {
      renderLevelHome(root, {
        title: strings.simonTitle,
        levels: SIMON_LEVELS,
        levelLabel: (level: SimonLevel) => strings.simonLevelLabel(level),
        progress,
        onStart: (index) => {
          levelIndex = index;
          game = createSimonGame(SIMON_LEVELS[index]);
          screen = 'play';
          render();
        },
        onBack: onExit,
      });
      return;
    }

    if (screen === 'play' && game) {
      setAppToolbarBack(() => {
        screen = 'home';
        game = null;
        render();
      });

      const card = createCard();
      card.appendChild(
        createPlayHeader({
          progressText: strings.simonProgress(
            game.subRoundIndex + 1,
            game.score.total,
          ),
        }),
      );

      const status = document.createElement('div');
      status.className = 'simon-status';
      if (game.phase === 'preparing') {
        status.textContent = strings.simonPrep;
      } else if (game.phase === 'showing') {
        status.textContent = watchTextFor(game.sequence.length);
      } else if (game.phase === 'awaiting') {
        status.textContent = strings.simonYourTurn;
      } else if (game.phase === 'failed') {
        status.textContent = strings.wrong;
      } else {
        status.textContent = strings.simonWin;
      }
      card.appendChild(status);

      const padGrid = document.createElement('div');
      padGrid.className = 'simon-pad';

      for (const pad of SIMON_PADS) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'simon-btn';
        button.dataset.pad = String(pad.index);
        button.style.setProperty('--simon-color', pad.color);
        button.setAttribute('aria-label', pad.label);
        button.disabled = game.phase !== 'awaiting';
        button.addEventListener('click', () => {
          if (!game || game.phase !== 'awaiting') {
            return;
          }
          void unlockAudio();
          playNote(pad.index as 0 | 1 | 2 | 3);
          button.classList.add('simon-lit');
          timeouts.push(
            window.setTimeout(() => button.classList.remove('simon-lit'), 300),
          );

          const result = pressPad(game, pad.index);
          game = result.game;

          if (!result.correct) {
            playWrong();
            if (!game.retryUsed) {
              status.textContent = strings.simonRetry;
              game = startRetry(game);
              beginPlayback(status);
              return;
            }

            status.textContent = strings.wrong;
            advanceAfterSubRound(false, 1200);
            return;
          }

          if (result.won) {
            for (const btn of padGrid.querySelectorAll<HTMLButtonElement>('.simon-btn')) {
              btn.disabled = true;
            }
            status.textContent = strings.simonBetweenRounds;
            advanceAfterSubRound(true, BETWEEN_SUBROUNDS_MS);
          }
        });
        padGrid.appendChild(button);
      }

      card.appendChild(padGrid);
      root.appendChild(card);

      if (game.phase === 'preparing') {
        for (const btn of padGrid.querySelectorAll<HTMLButtonElement>('.simon-btn')) {
          btn.disabled = true;
        }
        timeouts.push(
          window.setTimeout(() => {
            beginPlayback(status);
          }, game.level.prepMs),
        );
      } else if (game.phase === 'showing') {
        beginPlayback(status);
      }

      return;
    }

    if (screen === 'summary' && lastResult) {
      const goHome = () => {
        screen = 'home';
        lastResult = null;
        render();
      };
      setAppToolbarBack(goHome);
      summaryCleanup = renderQuizSummary(root, {
        levelIndex,
        maxLevelIndex,
        result: lastResult,
        progress,
        unlockThreshold: simonUnlockThreshold(SIMON_LEVELS[levelIndex]),
        levelLabel: (index) => strings.simonLevelLabel(SIMON_LEVELS[index]),
        onReplay: () => {
          game = createSimonGame(SIMON_LEVELS[levelIndex]);
          screen = 'play';
          render();
        },
        onNextLevel: () => {
          levelIndex += 1;
          game = createSimonGame(SIMON_LEVELS[levelIndex]);
          screen = 'play';
          render();
        },
        onHome: goHome,
      });
    }
  };

  render();
}
