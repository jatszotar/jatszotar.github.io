import { getGame } from './games/registry';
import { applyTheme, loadTheme } from './theme/settings';
import { applyTimerVisible, loadTimerVisible } from './timer/settings';
import { createAppFooter } from './ui/appFooter';
import { createAppHeader } from './ui/appHeader';
import { createAppToolbar, setAppToolbarBack } from './ui/appToolbar';
import { renderModePicker } from './ui/modePicker';

applyTheme(loadTheme());
applyTimerVisible(loadTimerVisible());

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) {
  throw new Error('Missing #app root element');
}

const shell = document.createElement('div');
shell.className = 'app-shell';
shell.appendChild(createAppToolbar());
shell.appendChild(createAppHeader());

// Screens replace this container's contents, so the header above it survives navigation.
const screenRoot = document.createElement('div');
screenRoot.className = 'app-screen';
shell.appendChild(screenRoot);
shell.appendChild(createAppFooter());
appRoot.appendChild(shell);

function showPicker(): void {
  setAppToolbarBack(null);
  renderModePicker(screenRoot, (gameId) => {
    const game = getGame(gameId);
    screenRoot.innerHTML = '';
    game.mount(screenRoot, showPicker);
  });
}

showPicker();
