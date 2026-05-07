/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { QuizScreen } from './components/QuizScreen';
import { GameMode, BinCount } from './types';

export default function App() {
  const store = useGameStore();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'quiz' | 'result'>('start');
  const [myCriteria, setMyCriteria] = useState('');

  const handleStart = (count: number, bins: BinCount, mode: GameMode) => {
    store.initGame(count, bins, mode);
    setGameState('playing');
  };

  const handleNext = () => {
    setGameState('quiz');
  };

  const handleQuizComplete = (criteria: string) => {
    setMyCriteria(criteria);
    setGameState('result');
  };

  const handleRestart = () => {
    setGameState('start');
    setMyCriteria('');
  };

  const handleBackToGame = () => {
    setGameState('playing');
  };

  return (
    <div className="h-screen w-screen bg-[var(--color-bg)] font-sans selection:bg-blue-200 overflow-hidden">
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {gameState === 'playing' && (
        <GameScreen 
          store={store} 
          onFinish={handleNext} 
          onHome={handleRestart}
        />
      )}
      {gameState === 'quiz' && (
        <QuizScreen 
          store={store} 
          onComplete={handleQuizComplete} 
          onBack={handleBackToGame}
          onHome={handleRestart}
        />
      )}
      {gameState === 'result' && (
        <ResultScreen 
          store={store} 
          myCriteria={myCriteria} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}
