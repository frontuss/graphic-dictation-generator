import { Point } from '../Point/Point';

export enum SimpleDirection {
  Top = 0,
  TopRight = 45,
  Right = 90,
  BottomRight = 135,
  Bottom = 180,
  BottomLeft = 225,
  Left = 270,
  TopLeft = 315
}

export function getDirection(pointA: Point, pointB: Point): SimpleDirection | undefined {
  const vectorX = pointB.x - pointA.x;
  const vectorY = pointB.y - pointA.y;

  if (vectorX > 0) {
    if (vectorY === 0) return SimpleDirection.Right;
    if (vectorY > 0) return SimpleDirection.TopRight;
    if (vectorY < 0) return SimpleDirection.BottomRight;
  }

  if (vectorX < 0) {
    if (vectorY === 0) return SimpleDirection.Left;
    if (vectorY > 0) return SimpleDirection.TopLeft;
    if (vectorY < 0) return SimpleDirection.BottomLeft;
  }

  if (vectorX === 0) {
    if (vectorY > 0) return SimpleDirection.Top;
    if (vectorY < 0) return SimpleDirection.Bottom;
  }

  return undefined;
}
