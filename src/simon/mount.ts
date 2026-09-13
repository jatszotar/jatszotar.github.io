import { playNote, playWrong, unlockAudio } from '../audio/sounds';
import {
  loadGameProgress,
  recordRoundResult,
  saveGameProgress,
} from '../progress/store';
import { createCard, createPlayHeader } from '../ui/shell';
import { renderQuizSummary } from '../ui/quizSummary';
import { renderLevelHome } from '../ui/levelHome';
import { strings } from '../ui/strings';
import { createSimonGame, pressPad, setPhase } from './game';
import {
  SIMON_LEVELS,
  SIMON_PADS,
  SIMON_START_DELAY_MS,
  type SimonGame,
  type SimonLevel,
} from './types';

type SimonScreen = 'home' | 'play' | 'summary';

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

  const unlockThresholdForLevel = (index: number): number =>
    SIMON_LEVELS[index].targetLength;

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
          unlockThresholdForLevel(levelIndex),
        );
        saveGameProgress('simon', progress);
        lastResult = result;
        screen = 'summary';
        game = null;
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
      const card = createCard();
      card.appendChild(
        createPlayHeader({
          onBack: () => {
            screen = 'home';
            game = null;
            render();
          },
          progressText: strings.simonProgress(
            game.playerIndex,
            game.sequence.length,
          ),
          layout: 'inline',
        }),
      );

      const status = document.createElement('div');
      status.className = 'simon-status';
      if (game.phase === 'showing') {
        status.textContent = strings.simonGetReady;
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
            status.textContent = strings.wrong;
            finishRound(
              {
                correct: game.playerIndex,
                total: game.sequence.length,
              },
              1500,
            );
            return;
          }

          status.textContent = strings.simonProgress(
            game.playerIndex,
            game.sequence.length,
          );

          if (result.won) {
            finishRound(
              {
                correct: game.sequence.length,
                total: game.sequence.length,
              },
              1000,
            );
          }
        });
        padGrid.appendChild(button);
      }

      card.appendChild(padGrid);
      root.appendChild(card);

      if (game.phase === 'showing') {
        for (const btn of padGrid.querySelectorAll<HTMLButtonElement>('.simon-btn')) {
          btn.disabled = true;
        }
        timeouts.push(
          window.setTimeout(() => {
            status.textContent = strings.simonWatch;
            playSequence(
              game!.sequence,
              game!.level.playbackMs,
              game!.level.pauseMs,
              () => {
                if (game) {
                  game = setPhase(game, 'awaiting');
                  render();
                }
              },
            );
          }, SIMON_START_DELAY_MS),
        );
      }
      return;
    }

    if (screen === 'summary' && lastResult) {
      summaryCleanup = renderQuizSummary(root, {
        levelIndex,
        maxLevelIndex,
        result: lastResult,
        progress,
        unlockThreshold: unlockThresholdForLevel(levelIndex),
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
        onHome: () => {
          screen = 'home';
          lastResult = null;
          render();
        },
      });
    }
  };

  render();
}
