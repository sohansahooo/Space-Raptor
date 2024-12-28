import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: (deltaTime: number) => void) => {
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current != null) {
        const deltaTime = (time - lastTimeRef.current) / 1000;
        callback(deltaTime);
      }
      lastTimeRef.current = time;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [callback]);
};