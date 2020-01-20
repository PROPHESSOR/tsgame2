import { Vec2 } from '../Math';

import Game from '../Game';
import Board from '../Board';
import Cell from '../Cell';

export default class TestCell extends Cell {
  constructor(game: Game, board: Board, position: Vec2) {
    super(game, board, position, new Vec2(1, 1));
  }

  render() {
    const { board, game, coords } = this;
    const { ctx } = game;
    const { cellsize } = board;

    ctx.strokeStyle = 'red';
    ctx.strokeRect(coords.x, coords.y, cellsize.x, cellsize.y);

    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineTo(coords.x + cellsize.x, coords.y + cellsize.y);
    ctx.moveTo(coords.x + cellsize.x, coords.y);
    ctx.lineTo(coords.x, coords.y + cellsize.y);
    ctx.stroke();
  }

  tick() {
    // TODO:
  }
}
