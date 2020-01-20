import { Vec2 } from '../Math';
// import { snapToGrid } from '../Utils'; // TODO:

import Entity from '../Entity';
import Game from '../Game';
import Board from '../Board';
import Arrow from './Arrow';

const PLAYER_OFFSET_IN_BOARD: number = 10;
const PLAYER_SIZE: Vec2 = new Vec2(10, 10);

export default class Player extends Entity {
  color: string;
  board: Board;
  arrow: Arrow;

  /**
   *
   * @param game
   * @param board
   * @param {Vec2} position - cell position; The x value is ignored.
   */
  constructor(game: Game, position = new Vec2(0, 0)) {
    super(
      game,
      // Position
      position,
      // Size
      PLAYER_SIZE,
    );
    this.color = 'yellow';
    this.arrow = null;

    window.addEventListener('keypress', event =>
      this.onKeyDown(event.keyCode),
    );
  }

  get screenposition() {
    const { board, position } = this;

    return new Vec2(
      board.right + PLAYER_OFFSET_IN_BOARD,
      board.top +
        (board.cellsize.y / 2 - PLAYER_SIZE.y / 2) +
        position.y * board.cellsize.y,
    );
  }

  onKeyDown(key) {
    switch (key) {
      case 119: // W
        if (this.position.y > 0) this.position.y--;
        break;
      case 97: // A
        if (!this.arrow) {
          this.arrow = new Arrow(
            this.game,
            new Vec2(
              this.screenposition.x,
              this.screenposition.y -
                PLAYER_OFFSET_IN_BOARD -
                this.size.y / 2 +
                2,
            ),
          );
          this.arrow.on('destroy', () => (this.arrow = null));
        }
        break;
      case 115: // S
        if (this.position.y < this.board.boardsize.y - 1)
          this.position.y++;
        break;
      case 100: // D
        break;
    }
  }

  tick() {
    if (this.arrow) this.arrow.tick();
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.screenposition.x,
      this.screenposition.y,
      this.size.x,
      this.size.y,
    );
    if (this.arrow) this.arrow.render();
  }
}
