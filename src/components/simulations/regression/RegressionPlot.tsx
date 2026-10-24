'use client';

import React, { useId, useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { Point, linearPredict } from '@/lib/math/regression';

interface RegressionPlotProps {
  data: Point[];
  w: number;
  b: number;
  /** Giá trị x cần đánh dấu điểm dự đoán trên đường thẳng. */
  predictionX?: number;
  showResiduals?: boolean;
  width?: number;
  height?: number;
}

const X_MIN = 0;
const X_MAX = 140;
const Y_MIN = -1;
const Y_MAX = 7;

const X_TICKS = [0, 20, 40, 60, 80, 100, 120, 140];
const Y_TICKS = [0, 1, 2, 3, 4, 5, 6, 7];

export const RegressionPlot: React.FC<RegressionPlotProps> = ({
  data,
  w,
  b,
  predictionX,
  showResiduals = false,
  width = 560,
  height = 300,
}) => {
  const clipId = useId();
  const padding = { top: 18, right: 18, bottom: 44, left: 50 };

  const xScale = useMemo(
    () => scaleLinear().domain([X_MIN, X_MAX]).range([padding.left, width - padding.right]),
    [width, padding.left, padding.right]
  );

  const yScale = useMemo(
    () => scaleLinear().domain([Y_MIN, Y_MAX]).range([height - padding.bottom, padding.top]),
    [height, padding.bottom, padding.top]
  );

  const lineY0 = linearPredict(w, b, X_MIN);
  const lineY1 = linearPredict(w, b, X_MAX);

  const prediction = predictionX !== undefined ? linearPredict(w, b, predictionX) : null;

  return (
    <div className="relative w-full overflow-hidden border border-line bg-paper">
      <svg role="img" aria-label={`Đồ thị diện tích và giá nhà, đường dự đoán y = ${w}x + ${b}${showResiduals ? '. Các đoạn nét đứt màu đỏ nối giá quan sát với giá dự đoán.' : ''}`} viewBox={`0 0 ${width} ${height}`} className="h-auto w-full select-none">
        <defs>
          <clipPath id={clipId}>
            <rect
              x={padding.left}
              y={padding.top}
              width={width - padding.left - padding.right}
              height={height - padding.top - padding.bottom}
            />
          </clipPath>
        </defs>

        {/* Grid lines */}
        <g className="stroke-line" strokeWidth="1">
          {X_TICKS.map((tick) => (
            <line
              key={`gx-${tick}`}
              x1={xScale(tick)}
              y1={padding.top}
              x2={xScale(tick)}
              y2={height - padding.bottom}
            />
          ))}
          {Y_TICKS.map((tick) => (
            <line
              key={`gy-${tick}`}
              x1={padding.left}
              y1={yScale(tick)}
              x2={width - padding.right}
              y2={yScale(tick)}
            />
          ))}
        </g>

        {/* Axes (x = 0 and y = 0) */}
        <line
          x1={padding.left}
          y1={yScale(0)}
          x2={width - padding.right}
          y2={yScale(0)}
          className="stroke-line-strong"
          strokeWidth="1.5"
        />
        <line
          x1={xScale(0)}
          y1={padding.top}
          x2={xScale(0)}
          y2={height - padding.bottom}
          className="stroke-line-strong"
          strokeWidth="1.5"
        />

        {/* Tick labels */}
        <g className="fill-muted text-[10px] font-mono select-none">
          {X_TICKS.map((tick) => (
            <text key={`lx-${tick}`} x={xScale(tick)} y={height - padding.bottom + 16} textAnchor="middle">
              {tick}
            </text>
          ))}
          {Y_TICKS.map((tick) => (
            <text key={`ly-${tick}`} x={padding.left - 10} y={yScale(tick) + 3} textAnchor="end">
              {tick}
            </text>
          ))}
        </g>

        {/* Axis titles */}
        <text
          x={(padding.left + width - padding.right) / 2}
          y={height - 6}
          textAnchor="middle"
          className="fill-muted text-[11px]"
        >
          Diện tích (m²)
        </text>
        <text
          x={14}
          y={(padding.top + height - padding.bottom) / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${(padding.top + height - padding.bottom) / 2})`}
          className="fill-muted text-[11px]"
        >
          Giá (tỷ VNĐ)
        </text>

        {/* Clipped drawing area */}
        <g clipPath={`url(#${clipId})`}>
          {/* Regression line */}
          <line
            x1={xScale(X_MIN)}
            y1={yScale(lineY0)}
            x2={xScale(X_MAX)}
            y2={yScale(lineY1)}
            className="stroke-accent"
            strokeWidth="2.5"
          />

          {showResiduals && data.map(([x, y]) => (
            <line
              key={`residual-${x}`}
              x1={xScale(x)}
              y1={yScale(y)}
              x2={xScale(x)}
              y2={yScale(linearPredict(w, b, x))}
              className="stroke-rose-600"
              strokeWidth={predictionX === x ? 3 : 1.5}
              strokeDasharray="3 2"
            />
          ))}

          {/* Prediction drop line */}
          {prediction !== null && !showResiduals && (
            <line
              x1={xScale(predictionX!)}
              y1={yScale(prediction)}
              x2={xScale(predictionX!)}
              y2={yScale(0)}
              className="stroke-amber-500"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )}
        </g>

        {/* Data points */}
        {data.map(([x, y], idx) => (
          <circle
            key={`d-${idx}`}
            cx={xScale(x)}
            cy={yScale(y)}
            r="5.5"
            className="fill-emerald-500 stroke-background"
            strokeWidth="2"
          />
        ))}

        {/* Prediction point */}
        {prediction !== null && (
          <g>
            <circle
              cx={xScale(predictionX!)}
              cy={yScale(prediction)}
              r="6.5"
              className="fill-amber-500 stroke-background"
              strokeWidth="2"
            />
            <text
              x={xScale(predictionX!) + (predictionX! > 100 ? -8 : 8)}
              y={Math.max(padding.top + 12, yScale(prediction) - 8)}
              textAnchor={predictionX! > 100 ? 'end' : 'start'}
              className="fill-amber-700 text-[11px] font-semibold"
            >
              {predictionX} m² → {prediction.toFixed(1)} tỷ
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-line px-3 py-2 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-muted">Dữ liệu mẫu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-accent" />
          <span className="text-accent-ink">Đường dự đoán</span>
        </div>
        {showResiduals && (
          <div className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-rose-600" />
            <span className="text-muted">Residual</span>
          </div>
        )}
        {prediction !== null && (
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-amber-700">Dự đoán</span>
          </div>
        )}
      </div>
    </div>
  );
};
