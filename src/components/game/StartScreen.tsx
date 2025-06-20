
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
      <Card className="w-full max-w-sm text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-5xl text-primary">RetroNake</CardTitle>
          <CardDescription className="font-body text-muted-foreground pt-2">
            Use arrow keys to move. Eat eggs to grow. Avoid walls and yourself!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onStartGame} 
            className="w-full font-headline text-lg bg-interactive-blue text-interactive-blue-foreground hover:bg-interactive-blue/90"
            size="lg"
            aria-label="Start Game"
          >
            Start Game <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
           <p className="text-xs text-muted-foreground mt-4">Or press any arrow key to begin.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartScreen;
