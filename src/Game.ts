import { Vec2 } from './Math';

import Board from './Board';

import Entity from './Entity';
import Placeful from './Entities/Placeful';
import Player from './Entities/Player';

const BOARD_OFFSET: number = 20;
const BOARD_PLAYER_AREA: number = 50;

export default class Game {
  window_size: Vec2;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  board: Board;
  entities: Array<Entity>;
  player: Player;
  tickno: number = 0;

  constructor({
    window_size = new Vec2(500 - BOARD_PLAYER_AREA, 400),
    canvas = document.querySelector('canvas'),
  } = {}) {
    [this.window_size, this.canvas] = [window_size, canvas];
    [canvas.width, canvas.height] = [window_size.x, window_size.y];
    this.ctx = canvas.getContext('2d', { alpha: false });

    const boardscreensize = this.window_size.map(
      val => val - BOARD_OFFSET,
    );
    boardscreensize.x -= BOARD_PLAYER_AREA;

    this.board = new Board(this, {
      position: new Vec2(BOARD_OFFSET / 2, BOARD_OFFSET / 2),
      size: boardscreensize,
      boardsize: new Vec2(10, 10),
    });

    this.player = new Player(this);

    this.entities = [new Placeful(this)];
    this.entities.forEach((entity, idx) =>
      entity.on('destroy', () => {
        this.entities.splice(idx, 1);
      }),
    );

    this.render();
  }

  start() {
    // setInterval(() => this.tick(), 10);
    requestAnimationFrame(() => this.tick());
  }

  tick() {
    requestAnimationFrame(() => this.tick());
    this.tickno++;
    this.entities.forEach(entity => entity.tick(this.tickno));
    this.player.tick();
    this.ctx.save();
    this.render();
    this.ctx.restore();
  }

  render() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.window_size.x, this.window_size.y);

    this.board.render();

    this.entities.forEach(entity => entity.render());

    this.player.render();
  }
}
