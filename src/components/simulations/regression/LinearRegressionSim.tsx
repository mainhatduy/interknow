'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { RegressionPlot } from './RegressionPlot';
import { MathFormula } from '@/components/common/MathFormula';
import {
  REGRESSION_DATA,
  linearPredict,
  meanSquaredError,
  formatEquation,
  fitLinearRegression,
} from '@/lib/math/regression';
import { saveLessonProgress } from '@/lib/storage/progress';

const DEFAULT_W = 0.03;
const DEFAULT_B = 1;
const PREDICT_X = 80;
const FITTED_MODEL = fitLinearRegression(REGRESSION_DATA);
const REFERENCE_MSE = meanSquaredError(REGRESSION_DATA, FITTED_MODEL.w, FITTED_MODEL.b);

export const LinearRegressionSim: React.FC = () => {
  const [w, setW] = useState<number>(DEFAULT_W);
  const [b, setB] = useState<number>(DEFAULT_B);
  const [showResiduals, setShowResiduals] = useState(true);

  const mse = meanSquaredError(REGRESSION_DATA, w, b);
  const prediction = linearPredict(w, b, PREDICT_X);

  const handleWChange = (val: number) => {
    setW(val);
    saveLessonProgress({ lessonId: 'regression', tinkered: true });
  };

  const handleBChange = (val: number) => {
    setB(val);
    saveLessonProgress({ lessonId: 'regression', tinkered: true });
  };

  const handleReset = () => {
    setW(DEFAULT_W);
    setB(DEFAULT_B);
  };

  return (
    <div className="border border-line bg-paper p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-base font-semibold text-ink">Mô hình của bạn</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setW(FITTED_MODEL.w);
              setB(FITTED_MODEL.b);
              saveLessonProgress({ lessonId: 'regression', tinkered: true });
            }}
            className="rounded-sm bg-accent px-3 py-1.5 text-xs font-medium text-background transition-colors hover:bg-accent-ink"
          >
            Fit model
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Làm lại
          </button>
        </div>
      </div>

      {/* Live equation */}
      <div className="my-3 border-y border-line py-3 text-center">
        <MathFormula math={formatEquation(w, b)} block />
      </div>

      {/* Plot */}
      <label className="mb-3 flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" checked={showResiduals} onChange={event => setShowResiduals(event.target.checked)} className="accent-accent" />
        Hiện residual
      </label>
      <RegressionPlot data={REGRESSION_DATA} w={w} b={b} predictionX={PREDICT_X} showResiduals={showResiduals} />

      {/* Sliders */}
      <div className="mt-5 grid grid-cols-1 gap-5 border-t border-line pt-4 md:grid-cols-2">
        {/* w slider */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between text-xs">
            <label htmlFor="regression-w" className="text-ink">
              <span className="font-mono font-medium text-accent-ink">w</span> — Độ dốc
            </label>
            <span className="font-mono font-medium text-accent-ink">{w.toFixed(3)}</span>
          </div>
          <input
            id="regression-w"
            type="range"
            min={-0.05}
            max={0.15}
            step={0.005}
            value={w}
            onChange={(e) => handleWChange(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
          />
        </div>

        {/* b slider */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between text-xs">
            <label htmlFor="regression-b" className="text-ink">
              <span className="font-mono font-medium text-accent-ink">b</span> — Độ dịch chuyển
            </label>
            <span className="font-mono font-medium text-accent-ink">{b.toFixed(1)}</span>
          </div>
          <input
            id="regression-b"
            type="range"
            min={-2}
            max={4}
            step={0.1}
            value={b}
            onChange={(e) => handleBChange(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="border border-line bg-paper p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Dự đoán nhà {PREDICT_X} m²
          </span>
          <div className="mt-1 font-serif text-2xl font-semibold text-ink">
            {prediction.toFixed(2)} <span className="text-sm font-normal text-muted">tỷ</span>
          </div>
        </div>

        <div className="border border-line bg-paper p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            MSE loss
          </span>
          <div className="mt-1 font-serif text-2xl font-semibold text-ink">
            {mse.toFixed(4)}
          </div>
          <p className="mt-1 text-[11px] text-muted">
            Mức nhỏ nhất trên {REGRESSION_DATA.length} quan sát: {REFERENCE_MSE.toFixed(4)}.
          </p>
        </div>
      </div>

      <p role="status" className="mt-4 border-l-2 border-accent bg-accent-soft/50 p-3 text-sm leading-relaxed">
        {mse <= REFERENCE_MSE + 0.001
          ? 'MSE đã gần mức nhỏ nhất trên bộ dữ liệu này. Residual vẫn còn vì các điểm không nằm trên cùng một đường thẳng.'
          : 'Điều chỉnh w và b để giảm MSE, rồi bấm “Fit model” để đối chiếu với kết quả least squares.'}
      </p>
    </div>
  );
};
