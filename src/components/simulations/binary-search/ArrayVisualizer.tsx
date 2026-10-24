'use client';

import React from 'react';
import { BinarySearchStep } from '@/lib/algorithms/binarySearch';
import { Check } from 'lucide-react';

interface ArrayVisualizerProps {
  array: number[];
  currentStepData: BinarySearchStep;
  onSelectTarget?: (val: number) => void;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  array,
  currentStepData,
  onSelectTarget,
}) => {
  const { low, high, mid, status, eliminatedIndices } = currentStepData;
  const eliminatedSet = new Set(eliminatedIndices);

  return (
    <div className="w-full overflow-x-auto pb-4 pt-6">
      <div className="inline-flex min-w-full items-end justify-start gap-1.5 px-4 sm:justify-center">
        {array.map((val, idx) => {
          const isLow = idx === low;
          const isHigh = idx === high;
          const isMid = idx === mid;
          const isEliminated = eliminatedSet.has(idx);
          const isFound = status === 'found' && isMid;

          // Border & background style
          let boxClass = 'border-line bg-paper text-ink';

          if (isFound) {
            boxClass = 'border-emerald-600 bg-emerald-100 font-semibold text-emerald-900';
          } else if (isMid) {
            boxClass = 'border-amber-500 bg-amber-50 font-medium text-amber-900';
          } else if (idx >= low && idx <= high) {
            boxClass = 'border-accent bg-accent-soft font-medium text-ink';
          } else if (isEliminated) {
            boxClass = 'border-line bg-background text-muted opacity-40';
          }

          return (
            <div key={idx} className="flex select-none flex-col items-center" style={{ minWidth: '42px' }}>
              {/* Pointer labels above cell */}
              <div className="mb-1 flex h-9 flex-col items-center justify-end text-[10px] font-semibold tracking-tight">
                {isMid && (
                  <span className="rounded-sm bg-amber-500 px-1.5 py-0.5 font-mono text-white">
                    MID
                  </span>
                )}
                <div className="flex gap-1 text-[9px]">
                  {isLow && <span className="font-bold text-accent-ink">L</span>}
                  {isHigh && <span className="font-bold text-rose-700">H</span>}
                </div>
              </div>

              {/* Value box */}
              <button
                onClick={() => onSelectTarget && onSelectTarget(val)}
                title={`Click để đặt mục tiêu = ${val}`}
                className={`relative flex h-14 w-11 items-center justify-center border-2 text-sm transition-colors sm:w-12 sm:text-base ${boxClass}`}
              >
                {val}
                {isFound && (
                  <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Index label below cell */}
              <span className="mt-1.5 font-mono text-[10px] text-muted">[{idx}]</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
