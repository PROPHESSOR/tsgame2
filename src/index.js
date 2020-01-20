import './styles.scss';

import Game from './Game';

function main() {
  const game = new Game();
  game.start();
  return game;
}

window.game = main();
