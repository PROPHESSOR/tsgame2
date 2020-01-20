import { Vec2, Matrix2, deg2rad } from './Math';

export class Switch {
  cases: Array<String>;
  case: String;

  constructor(...cases) {
    if (!cases.length)
      throw new Error('Switch must have at least one case!');
    this.cases = cases;
    this.switch(this.cases[0]);
  }

  switch(Case) {
    if (this.cases.includes(Case)) this.case = Case;
    else
      throw new Error(
        `Case ${Case} doesn't contained in (${this.cases.join(', ')})`,
      );
  }

  *[Symbol.iterator]() {
    for (const Case in this.cases) yield Case;
  }
}

export class EventEmitter {
  events: Object;

  constructor() {
    this.events = {};
  }
  on(event, listener) {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.removeListener(event, listener);
  }
  removeListener(event, listener) {
    if (typeof this.events[event] === 'object') {
      const idx = this.events[event].indexOf(listener);
      if (idx > -1) {
        this.events[event].splice(idx, 1);
      }
    }
  }
  emit(event, ...args) {
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach(listener => listener.apply(this, args));
    }
  }
  once(event, listener) {
    const remove = this.on(event, (...args) => {
      remove();
      listener.apply(this, args);
    });
  }
}

export function snapToGrid(position: Vec2, gridsize: Vec2): Vec2 {
  return position
    .map((val, idx) => Math.floor(val / gridsize[idx]))
    .map((val, idx) => val * gridsize[idx]);
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

export function generateRotationMatrix2D(deg: number): Matrix2 {
  const rad = deg2rad(deg);
  // ...[...] is used for rectangular view of the matrix in pretted code =D
  return new Matrix2([
    ...[Math.cos(rad), -Math.sin(rad)],
    ...[Math.sin(rad), Math.cos(rad)],
  ]);
}

export function rotateCoords(coords: Vec2, deg: number): Vec2 {
  const rotationMatrix = generateRotationMatrix2D(deg);

  return rotationMatrix.transform(coords);
}

export function rotateCoordsAroundThePoint(
  coords: Vec2,
  deg: number,
  point: Vec2,
): Vec2 {
  // Move the origin of coordinates to the (0, 0)
  const zeroCoords = new Vec2(coords.x - point.x, coords.y - point.y);

  // Rotate around the (0, 0)
  const rotatedCoords = rotateCoords(zeroCoords, deg);

  // Move back the origin of coordinates to the point
  const originCoords = new Vec2(
    rotatedCoords.x + point.x,
    rotatedCoords.y + point.y,
  );

  return originCoords;
}
