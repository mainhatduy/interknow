'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePlaybackOptions {
  totalSteps: number;
  initialStep?: number;
  baseIntervalMs?: number;
  onStepChange?: (step: number) => void;
  onReachEnd?: () => void;
}

export function usePlayback({
  totalSteps,
  initialStep = 0,
  baseIntervalMs = 1200,
  onStepChange,
  onReachEnd,
}: UsePlaybackOptions) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5, 1, 2

  const onReachEndRef = useRef(onReachEnd);
  const onStepChangeRef = useRef(onStepChange);

  useEffect(() => {
    onReachEndRef.current = onReachEnd;
    onStepChangeRef.current = onStepChange;
  }, [onReachEnd, onStepChange]);

  const setStepSafely = useCallback(
    (step: number | ((prev: number) => number)) => {
      setCurrentStep((prev) => {
        const nextVal = typeof step === 'function' ? step(prev) : step;
        const clamped = Math.max(0, Math.min(totalSteps - 1, nextVal));
        if (clamped !== prev && onStepChangeRef.current) {
          onStepChangeRef.current(clamped);
        }
        return clamped;
      });
    },
    [totalSteps]
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= totalSteps - 1) {
        setIsPlaying(false);
        if (onReachEndRef.current) onReachEndRef.current();
        return prev;
      }
      const nextVal = prev + 1;
      if (onStepChangeRef.current) onStepChangeRef.current(nextVal);
      return nextVal;
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => {
      const prevVal = Math.max(0, prev - 1);
      if (onStepChangeRef.current) onStepChangeRef.current(prevVal);
      return prevVal;
    });
  }, []);

  const jumpToStep = useCallback(
    (step: number) => {
      setStepSafely(step);
    },
    [setStepSafely]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      // If at end and user clicks play, restart from 0
      if (!prev && currentStep >= totalSteps - 1) {
        setCurrentStep(0);
        return true;
      }
      return !prev;
    });
  }, [currentStep, totalSteps]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (onStepChangeRef.current) onStepChangeRef.current(0);
  }, []);

  // Interval timer for playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          if (onReachEndRef.current) onReachEndRef.current();
          return prev;
        }
        const next = prev + 1;
        if (onStepChangeRef.current) onStepChangeRef.current(next);
        return next;
      });
    }, baseIntervalMs / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, totalSteps, baseIntervalMs]);

  return {
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    setSpeed,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    togglePlay,
    nextStep,
    prevStep,
    jumpToStep,
    reset,
  };
}
