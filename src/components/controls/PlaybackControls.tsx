'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (step: number) => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onReset,
  onSpeedChange,
  className = '',
}) => {
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className={`flex flex-col gap-3 border border-line bg-paper p-4 ${className}`}>
      {/* Scrubber */}
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider text-muted">Bước</span>
        <input
          aria-label="Bước mô phỏng"
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => onJumpToStep(parseInt(e.target.value, 10))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
        />
        <span className="min-w-[4rem] text-right font-mono text-xs font-medium text-ink">
          {totalSteps > 0 ? currentStep + 1 : 0} / {totalSteps}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <div className="flex items-center gap-1">
          <button
            onClick={onReset}
            title="Quay lại từ đầu"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={onPrevStep}
            disabled={currentStep <= 0}
            title="Lùi một bước"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Tạm dừng' : 'Tự động phát'}
            className="flex h-8 w-24 items-center justify-center gap-1.5 rounded-sm bg-accent px-3 text-sm font-medium text-background transition-colors hover:bg-accent-ink"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                Dừng
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Chạy
              </>
            )}
          </button>

          <button
            onClick={onNextStep}
            disabled={currentStep >= totalSteps - 1}
            title="Tiến một bước"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-muted">Tốc độ:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`rounded-sm px-2 py-1 font-mono text-xs transition-colors ${
                speed === s
                  ? 'bg-accent-soft font-medium text-accent-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
