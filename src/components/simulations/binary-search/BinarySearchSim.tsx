'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { generateBinarySearchSteps, BinarySearchStep } from '@/lib/algorithms/binarySearch';
import { usePlayback } from '@/lib/hooks/usePlayback';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { ArrayVisualizer } from './ArrayVisualizer';
import { CodeTracker } from './CodeTracker';
import { Search, Shuffle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { saveLessonProgress } from '@/lib/storage/progress';

const DEFAULT_ARRAY = [3, 7, 11, 15, 19, 24, 33, 42, 55, 68, 79, 88, 97, 112, 130];

export const BinarySearchSim: React.FC = () => {
  const [array, setArray] = useState<number[]>(DEFAULT_ARRAY);
  const [targetInput, setTargetInput] = useState<string>('55');
  const [target, setTarget] = useState<number>(55);

  const steps = useMemo(() => {
    return generateBinarySearchSteps(array, target);
  }, [array, target]);

  const playback = usePlayback({
    totalSteps: steps.length,
    baseIntervalMs: 1400,
    onStepChange: () => {
      saveLessonProgress({ lessonId: 'binary-search', tinkered: true });
    },
  });

  // Reset step whenever array or target changes
  useEffect(() => {
    playback.reset();
  }, [array, target]);

  const currentStepData: BinarySearchStep = steps[playback.currentStep] || steps[0];

  const handleApplyTarget = (val: number) => {
    setTarget(val);
    setTargetInput(val.toString());
  };

  const handleRandomizeTarget = () => {
    const isPresent = Math.random() > 0.3;
    if (isPresent) {
      const randomVal = array[Math.floor(Math.random() * array.length)];
      handleApplyTarget(randomVal);
    } else {
      // Pick a number not in array
      const randomVal = Math.floor(Math.random() * 150);
      handleApplyTarget(randomVal);
    }
  };

  return (
    <div className="space-y-4">
      {/* Simulation header & target selector */}
      <div className="border border-line bg-paper p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-semibold text-ink">
              Mô phỏng tìm kiếm nhị phân
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Đổi mục tiêu cần tìm hoặc bấm từng bước để quan sát không gian tìm kiếm bị thu hẹp
            </p>
          </div>

          {/* Target input form */}
          <div className="flex items-center gap-2">
            <input
              aria-label="Số cần tìm"
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const parsed = parseInt(targetInput, 10);
                  if (!isNaN(parsed)) handleApplyTarget(parsed);
                }
              }}
              className="w-24 rounded-sm border border-line bg-paper px-3 py-1.5 text-sm font-medium text-ink focus:border-accent focus:outline-none"
              placeholder="Target"
            />
            <button
              onClick={() => {
                const parsed = parseInt(targetInput, 10);
                if (!isNaN(parsed)) handleApplyTarget(parsed);
              }}
              className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-3 py-1.5 text-xs font-medium text-background transition-colors hover:bg-accent-ink"
            >
              <Search className="h-3.5 w-3.5" />
              Tìm
            </button>
            <button
              onClick={handleRandomizeTarget}
              title="Chọn ngẫu nhiên"
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <Shuffle className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Quick select pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
          <span className="text-[11px] text-muted">Chọn nhanh:</span>
          {[7, 33, 55, 97, 130, 50].map((val) => (
            <button
              key={val}
              onClick={() => handleApplyTarget(val)}
              className={`rounded-sm px-2.5 py-0.5 font-mono text-xs transition-colors ${
                target === val
                  ? 'bg-accent text-background'
                  : 'bg-accent-soft text-muted hover:text-ink'
              }`}
            >
              {val} {val === 50 ? '(không có)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Visualizer canvas card */}
      <div className="border border-line bg-paper p-5">
        <ArrayVisualizer
          array={array}
          currentStepData={currentStepData}
          onSelectTarget={handleApplyTarget}
        />

        {/* Current step explanation */}
        <div
          className={`mt-4 border-l-2 p-4 text-sm leading-relaxed ${
            currentStepData.status === 'found'
              ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900'
              : currentStepData.status === 'not-found'
                ? 'border-rose-500 bg-rose-50/60 text-rose-900'
                : 'border-accent bg-accent-soft/50 text-ink'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {currentStepData.status === 'found' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            ) : currentStepData.status === 'not-found' ? (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink" />
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider opacity-75">
                Bước {playback.currentStep + 1}
              </p>
              <p className="mt-0.5">{currentStepData.description}</p>
            </div>
          </div>
        </div>

        {/* Pointer inspector metrics */}
        <div className="mt-4 grid grid-cols-4 gap-2 border-t border-line pt-3 text-center">
          <div className="bg-accent-soft/60 p-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
              Low
            </span>
            <p className="font-mono text-sm font-semibold text-ink">{currentStepData.low}</p>
          </div>
          <div className="bg-accent-soft/60 p-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
              Mid
            </span>
            <p className="font-mono text-sm font-semibold text-ink">
              {currentStepData.mid >= 0 ? currentStepData.mid : '—'}
            </p>
          </div>
          <div className="bg-accent-soft/60 p-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
              High
            </span>
            <p className="font-mono text-sm font-semibold text-ink">{currentStepData.high}</p>
          </div>
          <div className="bg-accent-soft/60 p-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
              Target
            </span>
            <p className="font-mono text-sm font-semibold text-ink">{target}</p>
          </div>
        </div>
      </div>

      {/* Playback controls */}
      <PlaybackControls
        currentStep={playback.currentStep}
        totalSteps={playback.totalSteps}
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        onTogglePlay={playback.togglePlay}
        onNextStep={playback.nextStep}
        onPrevStep={playback.prevStep}
        onJumpToStep={playback.jumpToStep}
        onReset={playback.reset}
        onSpeedChange={playback.setSpeed}
      />

      <CodeTracker activeLine={currentStepData.codeLine} />
    </div>
  );
};
