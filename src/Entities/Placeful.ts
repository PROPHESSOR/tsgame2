import Entity, { Direction } from '../Entity';
import { Vec2 } from '../Math';

export default class Placeful extends Entity {
  color: string;
  direction: Direction;

  constructor(game, position = new Vec2()) {
    super(game, position, new Vec2(8, 8));
    this.color = 'green';
    this.direction = Direction.DOWN;
  }

  tick() {
    switch (this.direction) {
      case Direction.UP:
        this.position.y--;
        if (this.top <= 0) this.direction = Direction.DOWN;
        break;
      case Direction.DOWN:
        this.position.y++;
        if (this.bottom >= this.game.window_size.y)
          this.direction = Direction.UP;
        break;
      default:
        throw new Error(`Unknown direction ${this.direction}`);
    }
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y,
    );
  }
}
