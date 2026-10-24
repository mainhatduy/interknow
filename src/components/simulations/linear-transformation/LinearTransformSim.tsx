'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Matrix2x2,
  Vector2D,
  MATRIX_PRESETS,
  MatrixPreset,
  computeDeterminant,
  interpolateMatrix,
} from '@/lib/math/linearAlgebra';
import { VectorGridCanvas } from './VectorGridCanvas';
import { MathFormula } from '@/components/common/MathFormula';
import { saveLessonProgress } from '@/lib/storage/progress';

const IDENTITY_MATRIX: Matrix2x2 = [
  [1, 0],
  [0, 1],
];

export const LinearTransformSim: React.FC = () => {
  const [targetMatrix, setTargetMatrix] = useState<Matrix2x2>(MATRIX_PRESETS[1].matrix); // Default Shear
  const [activePresetId, setActivePresetId] = useState<string>('shear-x');
  const [t, setT] = useState<number>(1); // 0 (Identity) -> 1 (Transformed)
  const [isMorphing, setIsMorphing] = useState<boolean>(false);
  const [customVector, setCustomVector] = useState<Vector2D>([1, 1]);

  const animRef = useRef<number | null>(null);

  // Interpolated matrix at progress t
  const currentMatrix = useMemo(() => {
    return interpolateMatrix(IDENTITY_MATRIX, targetMatrix, t);
  }, [targetMatrix, t]);

  const determinant = useMemo(() => {
    return computeDeterminant(currentMatrix);
  }, [currentMatrix]);

  const finalDeterminant = useMemo(() => {
    return computeDeterminant(targetMatrix);
  }, [targetMatrix]);

  const handleSelectPreset = (preset: MatrixPreset) => {
    setTargetMatrix(preset.matrix);
    setActivePresetId(preset.id);
    setT(1);
    setIsMorphing(false);
    saveLessonProgress({ lessonId: 'linear-transformation', tinkered: true });
  };

  const handleUpdateMatrixEntry = (
    row: 0 | 1,
    col: 0 | 1,
    val: number
  ) => {
    setActivePresetId('custom');
    setTargetMatrix((prev) => {
      const next: Matrix2x2 = [
        [...prev[0]],
        [...prev[1]],
      ];
      next[row][col] = val;
      return next;
    });
    setT(1);
    saveLessonProgress({ lessonId: 'linear-transformation', tinkered: true });
  };

  // Morph animation from 0 to 1
  useEffect(() => {
    if (!isMorphing) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const duration = 2000; // ms
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth easeInOut
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setT(ease);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        setIsMorphing(false);
        saveLessonProgress({ lessonId: 'linear-transformation', tinkered: true });
      }
    };

    animRef.current = requestAnimationFrame(frame);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isMorphing]);

  const startMorphAnimation = () => {
    setT(0);
    setIsMorphing(true);
  };

  return (
    <div className="space-y-4">
      {/* Header & presets */}
      <div className="border border-line bg-paper p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-semibold text-ink">
              Mô phỏng biến đổi tuyến tính 2D
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Quan sát lưới không gian bị kéo giãn, trượt và nén lại qua ma trận biến đổi
            </p>
          </div>

          {/* Morph button */}
          <button
            onClick={startMorphAnimation}
            disabled={isMorphing}
            className="rounded-sm bg-accent px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-accent-ink disabled:opacity-50"
          >
            {isMorphing ? 'Đang chuyển đổi…' : 'Xem biến hình (0 → 1)'}
          </button>
        </div>

        {/* Preset chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
          <span className="text-[11px] text-muted">Các phép biến đổi mẫu:</span>
          {MATRIX_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`rounded-sm px-2.5 py-1 text-xs transition-colors ${
                activePresetId === preset.id
                  ? 'bg-accent text-background'
                  : 'bg-accent-soft text-muted hover:text-ink'
              }`}
            >
              {preset.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="border border-line bg-paper p-4">
        <VectorGridCanvas matrix={currentMatrix} customVector={customVector} />

        {/* Morphing timeline slider */}
        <div className="mt-4 space-y-1.5 border-t border-line pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink">
              Tiến trình nội suy <span className="font-medium text-accent-ink">t</span>
            </span>
            <span className="font-mono font-medium text-accent-ink">
              {t === 0 ? 'Lưới ban đầu (t = 0)' : t === 1 ? 'Lưới biến đổi xong (t = 1)' : `t = ${t.toFixed(2)}`}
            </span>
          </div>
          <input
            aria-label="Tiến trình biến đổi"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={t}
            onChange={(e) => {
              setT(parseFloat(e.target.value));
              setIsMorphing(false);
            }}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
          />
        </div>

        {/* Manual matrix entry sliders */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-3 sm:grid-cols-4">
          {/* a (î_x) */}
          <div className="border-l-2 border-rose-400 bg-accent-soft/40 p-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-mono font-medium text-ink">a (î_x)</span>
              <span className="font-mono font-medium text-ink">{targetMatrix[0][0].toFixed(1)}</span>
            </div>
            <input
              aria-label="Phần tử a của ma trận"
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={targetMatrix[0][0]}
              onChange={(e) => handleUpdateMatrixEntry(0, 0, parseFloat(e.target.value))}
              className="mt-1 h-1.5 w-full appearance-none rounded bg-line accent-rose-500"
            />
          </div>

          {/* b (ĵ_x) */}
          <div className="border-l-2 border-emerald-500 bg-accent-soft/40 p-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-mono font-medium text-ink">b (ĵ_x)</span>
              <span className="font-mono font-medium text-ink">{targetMatrix[0][1].toFixed(1)}</span>
            </div>
            <input
              aria-label="Phần tử b của ma trận"
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={targetMatrix[0][1]}
              onChange={(e) => handleUpdateMatrixEntry(0, 1, parseFloat(e.target.value))}
              className="mt-1 h-1.5 w-full appearance-none rounded bg-line accent-emerald-500"
            />
          </div>

          {/* c (î_y) */}
          <div className="border-l-2 border-rose-400 bg-accent-soft/40 p-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-mono font-medium text-ink">c (î_y)</span>
              <span className="font-mono font-medium text-ink">{targetMatrix[1][0].toFixed(1)}</span>
            </div>
            <input
              aria-label="Phần tử c của ma trận"
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={targetMatrix[1][0]}
              onChange={(e) => handleUpdateMatrixEntry(1, 0, parseFloat(e.target.value))}
              className="mt-1 h-1.5 w-full appearance-none rounded bg-line accent-rose-500"
            />
          </div>

          {/* d (ĵ_y) */}
          <div className="border-l-2 border-emerald-500 bg-accent-soft/40 p-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-mono font-medium text-ink">d (ĵ_y)</span>
              <span className="font-mono font-medium text-ink">{targetMatrix[1][1].toFixed(1)}</span>
            </div>
            <input
              aria-label="Phần tử d của ma trận"
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={targetMatrix[1][1]}
              onChange={(e) => handleUpdateMatrixEntry(1, 1, parseFloat(e.target.value))}
              className="mt-1 h-1.5 w-full appearance-none rounded bg-line accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Determinant & matrix cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Matrix latex */}
        <div className="border border-line bg-paper p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Ma trận tại tiến trình hiện tại
          </span>
          <div className="my-1 flex items-center justify-center">
            <MathFormula
              math={String.raw`A = \begin{bmatrix} ${currentMatrix[0][0].toFixed(1)} & ${currentMatrix[0][1].toFixed(1)} \\ ${currentMatrix[1][0].toFixed(1)} & ${currentMatrix[1][1].toFixed(1)} \end{bmatrix}`}
              block
            />
          </div>
          <p className="text-center text-[11px] text-muted">
            Cột 1 là đích đến của î, cột 2 là đích đến của ĵ
          </p>
        </div>

        {/* Determinant & area */}
        <div
          className={`border p-4 ${
            Math.abs(determinant) < 0.01
              ? 'border-rose-500 bg-rose-50/50 text-rose-900'
              : determinant < 0
                ? 'border-accent bg-accent-soft/50 text-ink'
                : 'border-line bg-paper text-ink'
          }`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75">
            Định thức det(A)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs opacity-70">ad − bc</span>
            <span className="font-mono text-2xl font-semibold">{determinant.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed opacity-85">
            {Math.abs(determinant) < 0.01
              ? 'det = 0: mặt phẳng bị ép phẳng thành một đường thẳng, không thể nghịch đảo.'
              : determinant < 0
                ? `det < 0: diện tích nhân ${Math.abs(determinant).toFixed(2)} lần và hướng mặt phẳng bị đảo ngược.`
                : `det > 0: diện tích mọi hình được phóng to ${determinant.toFixed(2)} lần.`}
          </p>
        </div>
      </div>
    </div>
  );
};
