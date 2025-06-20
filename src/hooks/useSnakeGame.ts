
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, INITIAL_SNAKE_POSITION, INITIAL_DIRECTION, GAME_SPEED_MS, Position, Direction, GameState } from '@/config/game';

// Define a fixed initial position for food to be used for server-side rendering
// and client's first render pass before useEffect runs. This avoids hydration mismatch.
// It should ideally not overlap with the initial snake position.
const DETERMINISTIC_INITIAL_FOOD_POSITION: Position = { 
  x: Math.floor(GRID_SIZE / 3), 
  y: Math.floor(GRID_SIZE / 3) 
};

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE_POSITION);
  // Initialize food with a deterministic position for SSR and initial client render
  const [food, setFood] = useState<Position>(DETERMINISTIC_INITIAL_FOOD_POSITION);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [pendingDirection, setPendingDirection] = useState<Direction | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [highScore, setHighScore] = useState<number>(0);
  
  const gameLoopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load high score from localStorage (client-side only)
    const storedHighScore = localStorage.getItem('retrorakeHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }

    // Set the *actual* initial random food position on the client after hydration.
    // This ensures Math.random() (via getRandomPosition) is called client-side
    // after the initial render, preventing hydration mismatch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    generateFood(); // We intend to call the generateFood based on initial snake state.
  }, []); // Empty dependency array ensures this runs once on mount (client-side).

  function getRandomPosition(): Position {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

  const generateFood = useCallback(() => {
    let newFoodPosition: Position;
    do {
      newFoodPosition = getRandomPosition();
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    setFood(newFoodPosition);
  }, [snake]); // generateFood depends on `snake` to avoid placing food on it.

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE_POSITION);
    generateFood(); // Sets a new random food position
    setDirection(INITIAL_DIRECTION);
    setPendingDirection(null);
    setScore(0);
    setGameState(GameState.NotStarted);
    if (gameLoopTimeoutRef.current) {
      clearTimeout(gameLoopTimeoutRef.current);
    }
  }, [generateFood]);
  
  const startGame = () => {
    resetGame();
    setGameState(GameState.Running);
  };

  const gameTick = useCallback(() => {
    if (gameState !== GameState.Running) return;

    let currentDirection = direction;
    if (pendingDirection) {
        if (!(pendingDirection.x === -direction.x && pendingDirection.y !== 0) && 
            !(pendingDirection.y === -direction.y && pendingDirection.x !== 0)) {
             if (pendingDirection.x !== 0 && direction.x === 0 || pendingDirection.y !== 0 && direction.y === 0 ||
                 pendingDirection.x === 0 && direction.y !== 0 || pendingDirection.y === 0 && direction.x !== 0 ||
                 (pendingDirection.x !== -direction.x || pendingDirection.y !== -direction.y)
                ) {
                 currentDirection = pendingDirection;
                 setDirection(pendingDirection);
            }
        }
        setPendingDirection(null);
    }

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += currentDirection.x;
      head.y += currentDirection.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState(GameState.GameOver);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('retrorakeHighScore', score.toString());
        }
        return prevSnake;
      }

      for (let i = 1; i < newSnake.length; i++) {
        if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
          setGameState(GameState.GameOver);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('retrorakeHighScore', score.toString());
          }
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        generateFood();
      } else {
        newSnake.pop();
      }
      return newSnake;
    });

  }, [direction, food, gameState, generateFood, score, highScore, pendingDirection]);


  useEffect(() => {
    if (gameState === GameState.Running) {
      gameLoopTimeoutRef.current = setTimeout(gameTick, GAME_SPEED_MS);
    } else if (gameLoopTimeoutRef.current) {
      clearTimeout(gameLoopTimeoutRef.current);
    }
    return () => {
      if (gameLoopTimeoutRef.current) {
        clearTimeout(gameLoopTimeoutRef.current);
      }
    };
  }, [gameState, gameTick, snake]);


  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameState === GameState.GameOver && event.key === 'Enter') {
        startGame();
        return;
    }
    if (gameState !== GameState.Running && gameState !== GameState.NotStarted && gameState !== GameState.Paused ) return;
    if (gameState === GameState.NotStarted && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Enter')) {
        startGame();
    }

    let newDirection: Direction | null = null;
    switch (event.key) {
      case 'ArrowUp':
        if (direction.y === 0) newDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (direction.y === 0) newDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (direction.x === 0) newDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (direction.x === 0) newDirection = { x: 1, y: 0 };
        break;
      default:
        return;
    }
    
    if (newDirection) {
        if (snake.length === 1) {
            setPendingDirection(newDirection);
        } else {
            if (newDirection.x !== -direction.x || newDirection.y !== -direction.y) {
                setPendingDirection(newDirection);
            }
        }
    }
  }, [direction, gameState, startGame, snake]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { snake, food, score, gameState, startGame, resetGame, GRID_SIZE, highScore };
}
