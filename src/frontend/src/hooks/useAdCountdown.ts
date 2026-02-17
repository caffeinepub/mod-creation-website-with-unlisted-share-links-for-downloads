import { useState, useEffect, useRef } from 'react';

interface UseAdCountdownOptions {
  duration: number;
  onComplete?: () => void;
}

export function useAdCountdown({ duration, onComplete }: UseAdCountdownOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    setIsActive(true);
    setRemainingSeconds(duration);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = () => {
    setIsActive(false);
    setRemainingSeconds(duration);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive && remainingSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, remainingSeconds, onComplete]);

  return {
    remainingSeconds,
    isActive,
    start,
    pause,
    reset,
  };
}
