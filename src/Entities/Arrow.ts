import { Vec2 } from '../Math';
import { rotateCoordsAroundThePoint } from '../Utils';

import Game from '../Game';
import Entity, { Direction } from '../Entity';
import Cell from '../Cell';
import Obstacle from './Obstacle';
import TestCell from '../Cells/TestCell';
import RotateCell from '../Cells/RotateCell';
import RotateCellClockwise from '../Cells/RotateCellClockwise';

const ARROW_SPEED: number = 2;

export default class Arrow extends Entity {
  protected color: string;
  protected scale: number = 10; // Number of pixels to squeeze. scale+ -> height-
  public direction: Direction = Direction.LEFT;

  constructor(game: Game, position: Vec2 = new Vec2()) {
    super(game, position, game.board.cellsize.map(val => val - 2)); // new Vec2(50, 15)
    // NOTE: Size must be square to proper collision detection on rotations
    this.direction = Direction.LEFT;
    this.scale = 10;
  }

  destroy(): void {
    this.emit('destroy');
  }

  rotate(direction: Direction): void {
    this.direction = direction;
  }

  tick() {
    switch (this.direction) {
      case Direction.UP:
        this.position.y -= ARROW_SPEED;
        break;
      case Direction.DOWN:
        this.position.y += ARROW_SPEED;
        break;
      case Direction.LEFT:
        this.position.x -= ARROW_SPEED;
        break;
      case Direction.RIGHT:
        this.position.x += ARROW_SPEED;
        break;
      default:
        throw new Error(`Unknown direction ${this.direction}`);
    }

    // Check for obstacle collision
    for (const cell of this.board.cells) {
      let obstacle = null;
      if (cell instanceof TestCell || cell instanceof RotateCell) {
        obstacle = new Obstacle(
          this.game,
          cell.coords,
          this.board.cellsize,
        );
      } else if (cell instanceof Obstacle) {
        obstacle = cell;
      }

      if (obstacle && cell instanceof RotateCell) {
        if (this.direction === Direction.LEFT) {
          if (
            this.left <= obstacle.right &&
            this.right >= obstacle.left &&
            this.position.y >= obstacle.top &&
            this.position.y <= obstacle.bottom
          ) {
            cell.processArrow(this);
          }
        }
      } else if (obstacle) {
        // TestCell
        if (this.direction === Direction.LEFT) {
          if (
            this.left <= obstacle.right &&
            this.right >= obstacle.left &&
            this.position.y >= obstacle.top &&
            this.position.y <= obstacle.bottom
          ) {
            console.log(`Collision with`, obstacle);
            this.destroy();
          }
        }
      }
    }

    // Check for Entities collision
    for (const entity of this.game.entities) {
      if (this.direction === Direction.LEFT) {
        if (
          this.left <= entity.right &&
          this.right >= entity.left &&
          entity.position.y + entity.size.y / 2 >= this.top &&
          entity.position.y + entity.size.y / 2 <= this.bottom
        ) {
          console.log(`Killed`, entity);
          entity.destroy();
        }
      }
    }

    // Check for screen leaving
    if (
      (this.direction === Direction.LEFT && this.right < 0) ||
      (this.direction === Direction.DOWN &&
        this.top >= this.board.bottom) ||
      (this.direction === Direction.UP && this.bottom < 0) ||
      (this.direction === Direction.RIGHT && this.left >= this.board.right)
    )
      this.destroy();
  }

  /**
   * Returns rotated coordinates by angle relates to arrow direction.
   */
  private _r(coord: Vec2): Vec2 {
    let deg = null;

    switch (this.direction) {
      case Direction.LEFT:
        deg = 0;
        break;
      case Direction.DOWN:
        deg = 90;
        break;
      case Direction.RIGHT:
        deg = 180;
        break;
      case Direction.UP:
        deg = 270;
        break;
      default:
        throw new Error(`Unknown direction ${this.direction}`);
    }

    const centerPoint = new Vec2(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2,
    );

    return rotateCoordsAroundThePoint(coord, deg, centerPoint);
  }

  render() {
    const { ctx } = this;

    // Fucking typescript's spread operator problem :/
    function moveTo(coords: Vec2): void {
      ctx.moveTo(coords.x, coords.y);
    }

    function lineTo(coords: Vec2): void {
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.strokeStyle = 'white';
    ctx.beginPath();

    // Horizonral
    moveTo(this._r(this.position.plus(new Vec2(0, this.size.y / 2))));
    lineTo(
      this._r(this.position.plus(new Vec2(this.size.x, this.size.y / 2))),
    );
    // Left bottom
    moveTo(this._r(this.position.plus(new Vec2(0, this.size.y / 2))));
    lineTo(
      this._r(
        this.position.plus(
          new Vec2(this.size.x / 2, this.size.y - this.scale),
        ),
      ),
    );
    // Left top
    moveTo(this._r(this.position.plus(new Vec2(0, this.size.y / 2))));
    lineTo(
      this._r(this.position.plus(new Vec2(this.size.x / 2, this.scale))),
    );
    // Right bottom
    moveTo(
      this._r(
        this.position.plus(new Vec2(this.size.x / 1.5, this.size.y / 2)),
      ),
    );
    lineTo(this._r(this.position.plus(new Vec2(this.size.x, this.scale))));
    // Right top
    moveTo(
      this._r(
        this.position.plus(new Vec2(this.size.x / 1.5, this.size.y / 2)),
      ),
    );
    lineTo(
      this._r(
        this.position.plus(
          new Vec2(this.size.x, this.size.y - this.scale),
        ),
      ),
    );
    ctx.stroke();
  }
}
