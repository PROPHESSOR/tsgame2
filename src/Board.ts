import { Vec2 } from './Math';

import Game from './Game';
import Entity from './Entity';
import Cell from './Cell';
import EmptyCell from './Cells/EmptyCell';
import TestCell from './Cells/TestCell';
import RotateCellClockwise from './Cells/RotateCellClockwise';

interface iBoardConstructor {
  boardsize: Vec2; // Board size in cells
  position: Vec2; // Left-top screen position in pixels
  size: Vec2; // Screen size in pixels
}

export default class Board extends Entity {
  boardsize: Vec2; // Board size in cells
  cells: Array<Cell>;
  cellsize: Vec2;

  /**
   * @constructor
   * @param {Game} game
   * @param {Vec2} size - Size in cells
   */
  constructor(
    game: Game,
    {
      position = new Vec2(),
      size,
      boardsize = new Vec2(10, 10),
    }: iBoardConstructor,
  ) {
    super(game, position, size);
    Vec2.notZero(boardsize);
    this.boardsize = boardsize;

    this.cellsize = new Vec2(
      Math.floor(size.x / boardsize.x),
      Math.floor(size.y / boardsize.y),
    );

    // console.log(this.cellsize.x, this.cellsize.y);

    game.canvas.addEventListener('click', event =>
      this.onClick(new Vec2(event.offsetX, event.offsetY)),
    );

    this.cells = [];

    this.todoSpawnCells();
  }

  todoSpawnCells() {
    console.log(this.size);
    for (let col = 0; col < this.boardsize.x; col++) {
      for (let row = 0; row < this.boardsize.y; row++) {
        this.cells.push(
          new EmptyCell(this.game, this, new Vec2(row, col)),
        );
      }
    }

    this.cells[11] = new RotateCellClockwise(
      this.game,
      this,
      new Vec2(1, 1),
    );
  }

  onClick(coords: Vec2): void {
    const idx = this.getCellIndexByScreenCoords(coords);
    this.cells[idx] = new TestCell(
      this.game,
      this,
      this.getCellPositionByCellIndex(idx),
    );
  }

  getCellPositionByCellIndex(index: number): Vec2 {
    const y = Math.floor(index / this.boardsize.y);
    index %= this.boardsize.x;
    index -= y;
    return new Vec2(index + y, y);
  }

  getCellIndexByScreenCoords(coords: Vec2): number {
    coords.x = Math.min(coords.x, this.right);
    coords.y = Math.min(coords.y, this.bottom);
    return (
      Math.floor((coords.y - this.top) / this.cellsize.y) *
        this.boardsize.x +
      Math.floor((coords.x - this.left) / this.cellsize.x)
    );
  }

  getCellByScreenCoords(coords: Vec2): Cell {
    return this.cells[this.getCellIndexByScreenCoords(coords)];
  }

  render(): void {
    // this.ctx.strokeStyle = 'gray';
    // for (let x = 0; x < this.boardsize.x; x++) {
    //   for (let y = 0; y < this.boardsize.y; y++) {
    //     this.ctx.strokeRect(
    //       this.left + x * this.cellsize.x,
    //       this.top + y * this.cellsize.y,
    //       this.cellsize.x,
    //       this.cellsize.y,
    //     );
    //   }
    // }
    this.cells.forEach(entity => entity.render());
  }

  tick(tickno: number): void {
    this.cells.forEach(entity => entity.tick(tickno));
  }
}
