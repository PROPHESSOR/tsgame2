import { Vec2 } from './Math';

import Entity from './Entity';
import Game from './Game';
import Board from './Board';
import Arrow from './Entities/Arrow';

export default abstract class Cell extends Entity {
  boardposition: Vec2;
  boardsize: Vec2;

  constructor(game: Game, board: Board, position: Vec2, size: Vec2) {
    super(
      game,
      Cell.positionToBoardPosition(board, position),
      Cell.sizeToBoardSize(board, size),
    );
    this.board = board; // TODO: Why is it an error if I remove this line? :/
    this.boardposition = position;
    this.boardsize = size;
  }

  get coords(): Vec2 {
    return Cell.positionToBoardPosition(this.board, this.boardposition);
  }

  get screenSize(): Vec2 {
    return Cell.sizeToBoardSize(this.board, this.boardsize);
  }

  processArrow(arrow: Arrow): void {
    // console.warn(`Cell::processArrow(): Nothing to process`);
  }

  static positionToBoardPosition(board: Board, position: Vec2) {
    return new Vec2(
      board.left + position.x * board.cellsize.x,
      board.top + position.y * board.cellsize.y,
    );
  }

  static sizeToBoardSize(board: Board, size: Vec2) {
    // FIXME: It doesn't work :/ (Incorrect values)
    return size.map((val, idx) => val * board.cellsize[idx]);
  }
}
