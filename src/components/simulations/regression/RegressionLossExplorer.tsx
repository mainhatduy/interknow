'use client';

import { useState } from 'react';
import { MathFormula } from '@/components/common/MathFormula';
import { RegressionPlot } from './RegressionPlot';
import { REGRESSION_DATA, formatEquation, linearPredict, meanSquaredError } from '@/lib/math/regression';
import { saveLessonProgress } from '@/lib/storage/progress';

const MODELS = [
  { name: 'Mô hình A', w: 0.03, b: 1 },
  { name: 'Mô hình B', w: 0.05, b: 0 },
];

export function RegressionLossExplorer() {
  const [modelIndex, setModelIndex] = useState(0);
  const [observationIndex, setObservationIndex] = useState(4);
  const model = MODELS[modelIndex];
  const rows = REGRESSION_DATA.map(([x, y]) => {
    const prediction = linearPredict(model.w, model.b, x);
    const residual = y - prediction;
    return { x, y, prediction, residual, squaredError: residual ** 2 };
  });
  const selected = rows[observationIndex];
  const sumSquaredError = rows.reduce((sum, row) => sum + row.squaredError, 0);
  const mse = meanSquaredError(REGRESSION_DATA, model.w, model.b);

  return (
    <div className="border border-line bg-paper p-4 sm:p-5">
      <h3 className="font-serif text-lg font-semibold">So sánh loss của hai mô hình</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Chọn mô hình rồi chọn một căn nhà. Đoạn đỏ biểu diễn chênh lệch giữa giá quan sát và giá dự đoán.
      </p>
      <div role="group" aria-label="Mô hình để so sánh loss" className="my-4 grid grid-cols-2 gap-3">
        {MODELS.map((candidate, index) => (
          <button
            key={candidate.name}
            aria-pressed={modelIndex === index}
            onClick={() => {
              setModelIndex(index);
              saveLessonProgress({ lessonId: 'regression', tinkered: true });
            }}
            className={`border p-3 text-left transition-colors ${modelIndex === index ? 'border-accent bg-accent-soft' : 'border-line hover:border-line-strong'}`}
          >
            <span className="block text-sm font-medium">{candidate.name}</span>
            <span className="mt-1 block font-mono text-xs text-muted">
              MSE {meanSquaredError(REGRESSION_DATA, candidate.w, candidate.b).toFixed(4)}
            </span>
          </button>
        ))}
      </div>
      <MathFormula math={formatEquation(model.w, model.b)} block />
      <RegressionPlot data={REGRESSION_DATA} w={model.w} b={model.b} predictionX={selected.x} showResiduals />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="loss-observation" className="text-sm">Quan sát đang xét</label>
        <select
          id="loss-observation"
          value={observationIndex}
          onChange={(event) => {
            setObservationIndex(Number(event.target.value));
            saveLessonProgress({ lessonId: 'regression', tinkered: true });
          }}
          className="rounded-sm border border-line bg-paper px-3 py-2 text-sm"
        >
          {rows.map((row, index) => <option key={row.x} value={index}>Nhà {row.x} m²</option>)}
        </select>
      </div>
      <div aria-live="polite" aria-atomic="true" className="mt-4 border-l-2 border-accent bg-accent-soft/40 p-4">
        <p className="text-sm leading-relaxed">
          Giá quan sát {selected.y.toFixed(2)} tỷ; dự đoán {selected.prediction.toFixed(2)} tỷ.
        </p>
        <MathFormula math={`e = ${selected.y.toFixed(2)} - (${selected.prediction.toFixed(2)}) = ${selected.residual.toFixed(2)}`} block />
        <p className="text-sm">Squared error: <MathFormula math={`e^2 = (${selected.residual.toFixed(2)})^2 = ${selected.squaredError.toFixed(4)}`} />.</p>
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-sm">Trung bình trên cả {rows.length} quan sát:</p>
          <MathFormula math={String.raw`\mathrm{MSE} = \frac{${sumSquaredError.toFixed(4)}}{${rows.length}} = ${mse.toFixed(4)}`} block />
          <p className="text-xs leading-relaxed text-muted">MSE có đơn vị (tỷ VNĐ)², không phải số tiền chênh lệch trung bình.</p>
        </div>
      </div>

      <details className="mt-4 border-t border-line pt-4">
        <summary className="cursor-pointer text-sm text-accent-ink">Chi tiết {rows.length} quan sát</summary>
        <div className="mt-3 overflow-x-auto" tabIndex={0} aria-label="Bảng tính sai số">
          <table className="w-full min-w-[480px] text-right text-xs">
            <thead className="border-b border-line text-muted">
              <tr>{['Diện tích (m²)', 'Giá (tỷ)', 'Dự đoán (tỷ)', 'Residual', 'Squared error'].map(label => <th key={label} scope="col" className="px-2 py-3 font-medium">{label}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line font-mono">
              {rows.map(row => (
                <tr key={row.x} className={row.x === selected.x ? 'bg-accent-soft' : ''}>
                  <td className="px-2 py-2">{row.x}</td>
                  <td className="px-2 py-2">{row.y.toFixed(2)}</td>
                  <td className="px-2 py-2">{row.prediction.toFixed(2)}</td>
                  <td className="px-2 py-2">{row.residual.toFixed(2)}</td>
                  <td className="px-2 py-2">{row.squaredError.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
