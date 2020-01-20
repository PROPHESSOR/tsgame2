import RotateCell, { RotateDirection } from './RotateCell';
import Arrow from '../Entities/Arrow';
import { Direction } from '../Entity';

export default class RotateCellClockwise extends RotateCell {
  protected rotateDirection: RotateDirection = RotateDirection.CLOCKWISE;

  processArrow(arrow: Arrow) {
    switch (arrow.direction) {
      case Direction.UP:
        arrow.rotate(Direction.RIGHT);
        break;
      case Direction.RIGHT:
        arrow.rotate(Direction.UP);
        break;
      case Direction.DOWN:
        arrow.rotate(Direction.LEFT);
        break;
      case Direction.LEFT:
        arrow.rotate(Direction.DOWN);
        break;
      default:
        throw new Error(`Unknown direction ${arrow.direction}`);
    }
  }
}
