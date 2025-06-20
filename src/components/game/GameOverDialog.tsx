
"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button'; // Re-using Button for consistency
import { RotateCcw } from 'lucide-react';

interface GameOverDialogProps {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
  isOpen: boolean;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ score, highScore, onPlayAgain, isOpen }) => {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={() => { /* Controlled externally */ }}>
      <AlertDialogContent className="font-body">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-4xl text-destructive">Game Over!</AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-foreground pt-2">
            Your score: <span className="font-bold text-primary font-headline">{score}</span>
          </AlertDialogDescription>
          {score >= highScore && score > 0 && (
             <AlertDialogDescription className="text-md text-accent pt-1 font-headline">
                New High Score! 🎉
            </AlertDialogDescription>
          )}
           {score < highScore && (
             <AlertDialogDescription className="text-md text-muted-foreground pt-1">
                High Score: <span className="font-bold text-accent font-headline">{highScore}</span>
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <Button 
            onClick={onPlayAgain} 
            className="w-full font-headline text-lg bg-interactive-blue text-interactive-blue-foreground hover:bg-interactive-blue/90"
            aria-label="Play Again"
            autoFocus
          >
            Play Again <RotateCcw className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-xs text-muted-foreground mt-2 w-full text-center">Or press Enter to play again.</p>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameOverDialog;
