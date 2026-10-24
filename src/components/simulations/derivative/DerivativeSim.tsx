'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FUNCTION_PRESETS,
  FunctionModel,
  computeCalculusState,
} from '@/lib/math/calculus';
import { FunctionPlot } from './FunctionPlot';
import { MathFormula } from '@/components/common/MathFormula';
import { Pause, RotateCcw, Zap } from 'lucide-react';
import { saveLessonProgress } from '@/lib/storage/progress';

export const DerivativeSim: React.FC = () => {
  const [selectedFunc, setSelectedFunc] = useState<FunctionModel>(FUNCTION_PRESETS[0]);
  const [x0, setX0] = useState<number>(FUNCTION_PRESETS[0].defaultX);
  const [deltaX, setDeltaX] = useState<number>(1.5);
  const [isApproachingZero, setIsApproachingZero] = useState<boolean>(false);

  const animRef = useRef<number | null>(null);

  // Compute live calculus state
  const calcState = useMemo(() => {
    return computeCalculusState(selectedFunc, x0, deltaX);
  }, [selectedFunc, x0, deltaX]);

  // Handle function change
  const handleSelectFunc = (func: FunctionModel) => {
    setSelectedFunc(func);
    setX0(func.defaultX);
    setDeltaX(1.5);
    setIsApproachingZero(false);
  };

  // Smooth animation: deltaX -> 0
  useEffect(() => {
    if (!isApproachingZero) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const startTime = performance.now();
    const startDelta = deltaX;
    const targetDelta = 0.002;
    const duration = 2800; // ms

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Exponential decay to give slow motion as it nears 0
      const currentVal = startDelta * Math.pow(targetDelta / startDelta, progress);

      setDeltaX(Number(currentVal.toFixed(4)));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setIsApproachingZero(false);
        saveLessonProgress({ lessonId: 'derivative', tinkered: true });
      }
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isApproachingZero]);

  const isConverged = Math.abs(deltaX) <= 0.05;

  return (
    <div className="space-y-4">
      {/* Simulation top bar */}
      <div className="border border-line bg-paper p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-semibold text-ink">
              Mô phỏng đạo hàm &amp; tiếp tuyến
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Click lên đồ thị để đổi điểm x₀, kéo Δx tiến dần về 0
            </p>
          </div>

          {/* Preset buttons */}
          <div className="flex items-center gap-1">
            {FUNCTION_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectFunc(p)}
                className={`rounded-sm px-3 py-1.5 text-xs transition-colors ${
                  selectedFunc.id === p.id
                    ? 'bg-accent text-background'
                    : 'bg-accent-soft text-muted hover:text-ink'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected function formula */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted">Hàm số:</span>
            <MathFormula math={selectedFunc.latex} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-ink">Đạo hàm chính xác:</span>
            <MathFormula math={selectedFunc.derivativeLatex} />
          </div>
        </div>
      </div>

      {/* SVG function canvas */}
      <div className="border border-line bg-paper p-4">
        <FunctionPlot
          func={selectedFunc}
          calcState={calcState}
          onSetX0={(newX) => {
            setX0(newX);
            saveLessonProgress({ lessonId: 'derivative', tinkered: true });
          }}
        />

        {/* Sliders */}
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-line pt-3 md:grid-cols-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-ink">
                Điểm mốc <span className="font-medium text-accent-ink">x₀</span>
              </span>
              <span className="font-mono font-medium text-accent-ink">{x0.toFixed(2)}</span>
            </div>
            <input
              aria-label="Điểm mốc x₀"
              type="range"
              min={selectedFunc.domain[0] + 0.2}
              max={selectedFunc.domain[1] - 0.5}
              step={0.05}
              value={x0}
              onChange={(e) => {
                setX0(parseFloat(e.target.value));
                saveLessonProgress({ lessonId: 'derivative', tinkered: true });
              }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-ink">
                Khoảng vi phân <span className="font-medium text-amber-700">Δx</span>
              </span>
              <span className="font-mono font-medium text-amber-700">{deltaX.toFixed(3)}</span>
            </div>
            <input
              aria-label="Khoảng vi phân Δx"
              type="range"
              min={0.002}
              max={2.5}
              step={0.001}
              value={deltaX}
              onChange={(e) => {
                setDeltaX(parseFloat(e.target.value));
                setIsApproachingZero(false);
                saveLessonProgress({ lessonId: 'derivative', tinkered: true });
              }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-amber-500"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsApproachingZero(!isApproachingZero)}
              className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-3.5 py-2 text-xs font-medium text-background transition-colors hover:bg-accent-ink"
            >
              {isApproachingZero ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  Dừng thu hẹp
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  Cho Δx → 0
                </>
              )}
            </button>
            <button
              onClick={() => {
                setDeltaX(1.5);
                setIsApproachingZero(false);
              }}
              title="Khôi phục Δx ban đầu"
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Mốc nhanh:</span>
            {[1.5, 0.5, 0.1, 0.01].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setDeltaX(val);
                  setIsApproachingZero(false);
                }}
                className={`rounded-sm px-2 py-0.5 font-mono text-[11px] transition-colors ${
                  Math.abs(deltaX - val) < 0.005
                    ? 'bg-amber-100 font-medium text-amber-900'
                    : 'bg-accent-soft text-muted hover:text-ink'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live computation values */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-line bg-paper p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            Hệ số góc cát tuyến
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-muted">Δy / Δx</span>
            <span className="font-mono text-xl font-semibold text-ink">
              {calcState.secantSlope.toFixed(3)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted">Độ dốc trung bình qua hai điểm A và B</p>
        </div>

        <div className="border border-line bg-paper p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-ink">
            Hệ số góc tiếp tuyến
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-muted">f′(x₀)</span>
            <span className="font-mono text-xl font-semibold text-ink">
              {calcState.tangentSlope.toFixed(3)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted">Độ dốc tức thời lý thuyết tại x₀</p>
        </div>

        <div
          className={`border p-4 ${
            isConverged ? 'border-emerald-600 bg-emerald-50/50' : 'border-line bg-paper'
          }`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Sai số
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-muted">|m_cát − m_tiếp|</span>
            <span className="font-mono text-xl font-semibold text-ink">
              {calcState.slopeDifference.toFixed(4)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted">
            {isConverged ? 'Cát tuyến đã tiến rất gần tiếp tuyến.' : 'Thu nhỏ Δx để sai số tiến về 0.'}
          </p>
        </div>
      </div>
    </div>
  );
};
