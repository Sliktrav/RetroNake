
export const GRID_SIZE = 20; // Number of cells in width and height
export const CELL_PIXEL_SIZE = 24; // Visual size of a cell in pixels
export const INITIAL_SNAKE_POSITION = [{ x: Math.floor(GRID_SIZE / 2) -1 , y: Math.floor(GRID_SIZE / 2) }, { x: Math.floor(GRID_SIZE / 2) - 2, y: Math.floor(GRID_SIZE / 2) }];
export const INITIAL_DIRECTION = { x: 1, y: 0 }; // Moving right
export const GAME_SPEED_MS = 150; // Milliseconds per game tick

export type Position = { x: number; y: number };
export type Direction = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

export enum GameState {
  NotStarted = "NotStarted",
  Running = "Running",
  Paused = "Paused",
  GameOver = "GameOver",
}
