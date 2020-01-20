import Cell from '../Cell';
import { Vec2 } from '../Math';
import Game from '../Game';
import Board from '../Board';
import Arrow from '../Entities/Arrow';
import { rotateCoordsAroundThePoint } from '../Utils';

export enum RotateDirection {
  CLOCKWISE /* \ */,
  ANTICLOCKWISE /* / */,
}

/** Rotates the arrow to some direction on the arrow in
 * @abstract
 * @class
 */

export default abstract class RotateCell extends Cell {
  protected abstract rotateDirection: RotateDirection;

  constructor(game: Game, board: Board, position: Vec2) {
    super(game, board, position, new Vec2(1, 1));
  }

  private _r(coords: Vec2): Vec2 {
    return rotateCoordsAroundThePoint(
      coords,
      0,
      this.coords.plus(this.board.cellsize.divide(2)),
    );
  }

  tick() {
    // TODO:
  }

  render() {
    const { board, game, coords } = this;
    const { ctx } = game;
    const { cellsize } = board;

    ctx.strokeStyle = 'red';
    ctx.strokeRect(coords.x, coords.y, cellsize.x, cellsize.y);

    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    if (this.rotateDirection === RotateDirection.CLOCKWISE) {
      ctx.moveTo(coords.x + cellsize.x, coords.y);
      ctx.lineTo(coords.x, coords.y + cellsize.y);
    } else if (this.rotateDirection === RotateDirection.ANTICLOCKWISE) {
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x + cellsize.x, coords.y + cellsize.y);
    }
    ctx.stroke();
  }

  abstract processArrow(arrow: Arrow);
}
