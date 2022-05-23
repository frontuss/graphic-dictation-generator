import classNames from 'classnames';
import throttle from 'lodash.throttle';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Btn } from '../Btn/Btn';
import { getNearestGridPointOnNode, isAvailableNewPoint } from './DrawingAreaUtils';
import { Icon } from '../Icon/Icon';
import { Point } from '../Point/Point';
import { getDirection } from '../SimpleDirection/SimpleDirection';

import './DrawingArea.scss';
import { DrawingAreaFileSelectionButton } from './DrawingAreaFileSelectionButton';

export function DrawingArea() {
  const [cellSize, setCellSize] = useState(20);
  const [mousePoint, setMousePoint] = useState(new Point(0, 0));
  const [points, setPoints] = useState<Point[]>([]);
  const [image, setImage] = useState('');

  const isMouseOver = useRef(false);

  const bodyStyle = useMemo(() => ({ backgroundSize: `${cellSize}px ${cellSize}px` }), [cellSize]);
  const bgStyle = useMemo(() => ({ backgroundImage: `url(${image})` }), [image]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isMouseOver.current) return;

      const node = e.target as HTMLElement;

      const nearestPoint = getNearestGridPointOnNode(node, e, cellSize);

      setMousePoint(nearestPoint);
    },
    [cellSize]
  );

  const onMouseMove = useMemo(() => throttle(handleMouseMove, 200), [handleMouseMove]);

  const onMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      handleMouseMove(e);
      isMouseOver.current = true;
    },
    [handleMouseMove]
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      handleMouseMove(e);
      isMouseOver.current = false;
    },
    [handleMouseMove]
  );

  const onBodyClick = useCallback(
    (e: React.MouseEvent) => {
      handleMouseMove(e);

      const node = e.target as HTMLElement;

      const nearestPoint = getNearestGridPointOnNode(node, e, cellSize);

      if (points.length === 0) {
        setPoints([nearestPoint]);
      }

      const lastExistPoint = points[points.length - 1];

      const newPoints = [...points];

      if (lastExistPoint.isEqual(nearestPoint)) {
        newPoints.pop();
        setPoints(newPoints);
      } else if (isAvailableNewPoint(points, nearestPoint)) {
        // checking the continuation of movement in the same direction
        if (points.length > 1) {
          const lastPoint = points[points.length - 1];
          const prevLastPoint = points[points.length - 2];
          const lastDirection = getDirection(prevLastPoint, lastPoint);
          const newDirection = getDirection(lastPoint, nearestPoint);

          if (lastDirection === newDirection) {
            newPoints.pop();
          }
        }

        newPoints.push(nearestPoint);
        setPoints(newPoints);
      }
    },
    [cellSize, handleMouseMove, points]
  );

  const onFileChoice = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const cellSizeIncrement = useCallback(() => {
    setCellSize(cellSize + 1);
  }, [cellSize]);

  const cellSizeDecrement = useCallback(() => {
    setCellSize(cellSize - 1);
  }, [cellSize]);

  const isAvailableMousePoint = isAvailableNewPoint(points, mousePoint);

  const svgPathCommands = points.map(
    (point, index) => `${index === 0 ? 'M' : 'L'} ${point.x * cellSize} ${point.y * cellSize}`
  );

  return (
    <div className="drawing-area">
      <div className="drawing-area__wrap">
        <div className="drawing-area__background" style={bgStyle} />
        <div className="drawing-area__background-grid" style={bodyStyle} />

        <span
          className={classNames('drawing-area__point', {
            'drawing-area__point_available': isAvailableMousePoint
          })}
          style={{ left: mousePoint.x * cellSize, top: mousePoint.y * cellSize }}
        />

        {points.map((point, index) => (
          <span
            className={classNames('drawing-area__marked-point', {
              'drawing-area__marked-point_last': index === points.length - 1
            })}
            key={`${point.x}-${point.y}`}
            style={{ left: point.x * cellSize, top: point.y * cellSize }}
          />
        ))}

        <svg className="drawing-area__svg">
          <path d={svgPathCommands.join(' ')} fill="transparent" stroke="black" />
        </svg>

        <div
          className="drawing-area__workspace"
          onMouseEnter={onMouseEnter}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={onBodyClick}
        />
      </div>

      <div className="drawing-area__controls">
        <div className="drawing-area__controls__left">
          <DrawingAreaFileSelectionButton onChoice={onFileChoice} />
        </div>

        <div className="drawing-area__controls__right">
          <Btn onClick={cellSizeIncrement}>
            <Icon iconName="zoom-in" />
          </Btn>

          <Btn onClick={cellSizeDecrement}>
            <Icon iconName="zoom-out" />
          </Btn>
        </div>
      </div>
    </div>
  );
}
