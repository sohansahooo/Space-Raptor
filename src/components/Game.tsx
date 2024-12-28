import React, { useEffect, useRef, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { drawBackground, drawPlayer, drawEnemies, drawBullets, drawParticles } from '../utils/render';
import { updateGameState } from '../utils/gameLogic';
import { GameState, initialGameState } from '../utils/gameState';
import { Pause, Play } from 'lucide-react';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState] = useState<GameState>(initialGameState());
  const [isPaused, setIsPaused] = useState(false);

  const update = (deltaTime: number) => {
    if (!canvasRef.current || isPaused) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    updateGameState(gameState, deltaTime);

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw game elements
    drawBackground(ctx);
    drawParticles(ctx, gameState.particles);
    drawBullets(ctx, gameState.bullets);
    drawPlayer(ctx, gameState.player);
    drawEnemies(ctx, gameState.enemies);
  };

  useGameLoop(update);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev);
        return;
      }
      if (!isPaused) {
        gameState.keys[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isPaused) {
        gameState.keys[e.key] = false;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.keys, isPaused]);

  return (
    <div className="fixed inset-0 bg-black">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
      <button
        onClick={() => setIsPaused(prev => !prev)}
        className="fixed top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label={isPaused ? 'Play' : 'Pause'}
      >
        {isPaused ? (
          <Play className="w-6 h-6 text-white" />
        ) : (
          <Pause className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default Game;