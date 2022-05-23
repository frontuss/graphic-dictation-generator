export class Point {
  constructor(readonly x: number, readonly y: number) {}

  isEqual(point: Point) {
    return this.x === point.x && this.y === point.y;
  }
}
