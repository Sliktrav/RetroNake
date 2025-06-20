
"use client";

import React from 'react';
import GameBoard from '@/components/game/GameBoard';
import ScoreDisplay from '@/components/game/ScoreDisplay';
import StartScreen from '@/components/game/StartScreen';
import GameOverDialog from '@/components/game/GameOverDialog';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameState } from '@/config/game';
import { Button } from '@/components/ui/button';
import { Github, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { snake, food, score, gameState, startGame, resetGame, GRID_SIZE, highScore } = useSnakeGame();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground relative">
      <div className="absolute top-4 left-4 md:left-auto md:right-4 flex gap-2">
          <Button variant="outline" size="icon" onClick={resetGame} aria-label="Reset Game">
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" asChild aria-label="View on GitHub">
            <Link href="https://github.com/FirebaseExtended/ai-apps" target="_blank">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
      </div>
      
      <h1 className="font-headline text-6xl text-primary mb-2">RetroNake</h1>
      <p className="text-muted-foreground mb-6 font-body">A classic snake game with a modern twist.</p>

      <ScoreDisplay score={score} highScore={highScore} />
      
      <div className="relative">
        <GameBoard snake={snake} food={food} />
        {gameState === GameState.NotStarted && (
          <StartScreen onStartGame={startGame} />
        )}
        <GameOverDialog
          isOpen={gameState === GameState.GameOver}
          score={score}
          highScore={highScore}
          onPlayAgain={startGame}
        />
      </div>
      
      <div className="mt-8 text-center text-muted-foreground font-body">
        <p>Use <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Arrow Keys</kbd> to control the snake.</p>
        <p className="mt-2 text-xs">Built with Next.js, Tailwind CSS, and ShadCN UI.</p>
      </div>
    </main>
  );
}
