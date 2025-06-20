
"use client";

import React from 'react';
import { Trophy } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-card rounded-lg shadow-md w-full max-w-md mb-4">
      <div className="text-left">
        <p className="text-sm text-muted-foreground font-headline">SCORE</p>
        <p className="text-3xl font-bold text-primary font-headline">{score}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground font-headline flex items-center justify-end">
          <Trophy className="w-4 h-4 mr-1 text-accent" /> BEST
        </p>
        <p className="text-3xl font-bold text-accent font-headline">{highScore}</p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
