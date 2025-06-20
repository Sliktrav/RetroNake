
"use client";

import React from 'react';
import { Position, GRID_SIZE, CELL_PIXEL_SIZE } from '@/config/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food }) => {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);

    const isSnakeSegment = snake.some(segment => segment.x === x && segment.y === y);
    const isSnakeHead = isSnakeSegment && snake[0].x === x && snake[0].y === y;
    const isFood = food.x === x && food.y === y;

    let cellClass = 'border border-background/10';
    let cellContent = null;

    if (isSnakeHead) {
      cellClass = 'bg-primary rounded-sm';
    } else if (isSnakeSegment) {
      cellClass = 'bg-primary/80 rounded-sm';
    } else if (isFood) {
      cellClass = 'bg-accent rounded-full animate-pulse';
    }

    return (
      <div
        key={`${x}-${y}`}
        className={`aspect-square ${cellClass} flex items-center justify-center transition-colors duration-50`}
        style={{ width: `${CELL_PIXEL_SIZE}px`, height: `${CELL_PIXEL_SIZE}px` }}
        aria-label={`Cell ${x},${y} ${isSnakeSegment ? 'Snake' : ''} ${isFood ? 'Food' : ''}`}
      >
        {cellContent}
      </div>
    );
  });

  return (
    <div
      className="grid bg-secondary/20 shadow-xl rounded-lg p-2"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_PIXEL_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_PIXEL_SIZE}px)`,
        width: `${GRID_SIZE * CELL_PIXEL_SIZE + 16}px`, // 16 for padding
        height: `${GRID_SIZE * CELL_PIXEL_SIZE + 16}px`,
      }}
      role="grid"
      aria-label="Game Board"
    >
      {cells}
    </div>
  );
};

export default GameBoard;
