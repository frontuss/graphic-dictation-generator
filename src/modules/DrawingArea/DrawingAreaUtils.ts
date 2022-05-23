import { restrictNumberBetween } from '../number/numberUtils';
import { Point } from '../Point/Point';
import { getDirection } from '../SimpleDirection/SimpleDirection';

export function getNearestGridPointOnNode(node: HTMLElement, e: React.MouseEvent, cellSize: number): Point {
  const { left, top } = node.getBoundingClientRect();

  const maxPointXNumber = Math.floor((node.offsetWidth - 1) / cellSize);
  const maxPointYNumber = Math.floor((node.offsetHeight - 1) / cellSize);

  const x = restrictNumberBetween(Math.round((e.pageX - left) / cellSize), 0, maxPointXNumber);
  const y = restrictNumberBetween(Math.round((e.pageY - top) / cellSize), 0, maxPointYNumber);

  return new Point(x, y);
}

export function isAvailableNewPoint(points: Point[], newPoint: Point): boolean {
  if (points.length === 0) {
    return true;
  }

  const lastPoint = points[points.length - 1];

  // checking reverse direction relative to previous
  if (points.length >= 2) {
    const prevLastPoint = points[points.length - 2];
    const lastReverseDirection = getDirection(lastPoint, prevLastPoint);
    const newDirection = getDirection(lastPoint, newPoint);

    if (newDirection === lastReverseDirection) {
      return false;
    }
  }

  return (
    lastPoint.x === newPoint.x ||
    lastPoint.y === newPoint.y ||
    Math.abs(lastPoint.x - newPoint.x) === Math.abs(lastPoint.y - newPoint.y)
  );
}
