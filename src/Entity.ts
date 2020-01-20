import Game from './Game';

import { Vec2 } from './Math';
import { EventEmitter, random } from './Utils';
import Board from './Board';

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface iEntity {
  position: Vec2;
  size: Vec2;
  render: Function;
  tick: Function;
}

export default abstract class Entity extends EventEmitter
  implements iEntity {
  protected game: Game;
  protected board: Board;
  protected ctx: CanvasRenderingContext2D;

  position: Vec2; // Screen position in px
  size: Vec2; // Screen rect size in px
  waschanged: boolean; // TODO: Conditional re-rendering

  constructor(game, position: Vec2 = new Vec2(), size: Vec2 = new Vec2()) {
    super();
    this.game = game;
    this.board = game.board;
    this.ctx = game.ctx;
    this.position = position;
    this.size = size;
    this.waschanged = true;
  }

  get top() {
    return this.position.y;
  }

  get bottom() {
    return this.position.y + this.size.y;
  }

  get left() {
    return this.position.x;
  }

  get right() {
    return this.position.x + this.size.x;
  }

  get topleft() {
    return this.position;
  }

  get topright() {
    return new Vec2(this.right, this.top);
  }

  get bottomleft() {
    return new Vec2(this.left, this.bottom);
  }

  get bottomright() {
    return new Vec2(this.right, this.bottom);
  }

  destroy(): void {
    this.emit('destroy');
  }

  abstract tick(tickno);

  abstract render();

  rerender() {
    if (!this.waschanged) return;
    this.render();
    this.waschanged = false;
  }

  /**
   * Draws an random color flashing rect using this.positon and this.size
   */
  devrender() {
    this.ctx.fillStyle = `rgb(${random(0, 255)}, ${random(
      0,
      255,
    )}, ${random(0, 255)})`;
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y,
    );
  }
}
