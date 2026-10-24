'use client';

import React, { useRef, useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { FunctionModel, CalculusState, sampleFunctionCurve } from '@/lib/math/calculus';

interface FunctionPlotProps {
  func: FunctionModel;
  calcState: CalculusState;
  onSetX0: (x: number) => void;
  width?: number;
  height?: number;
}

export const FunctionPlot: React.FC<FunctionPlotProps> = ({
  func,
  calcState,
  onSetX0,
  width = 580,
  height = 360,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const { x0, x1, y0, y1, secantLine, tangentLine, deltaX, deltaY } = calcState;

  // D3 linear scales
  const xScale = useMemo(() => {
    return scaleLinear()
      .domain(func.domain)
      .range([padding.left, width - padding.right]);
  }, [func.domain, width, padding.left, padding.right]);

  const yScale = useMemo(() => {
    return scaleLinear()
      .domain(func.range)
      .range([height - padding.bottom, padding.top]);
  }, [func.range, height, padding.bottom, padding.top]);

  // Curve points path
  const curvePath = useMemo(() => {
    const rawPoints = sampleFunctionCurve(func, 180);
    return rawPoints.reduce((acc, [px, py], idx) => {
      const cx = xScale(px);
      const cy = yScale(py);
      return idx === 0 ? `M ${cx} ${cy}` : `${acc} L ${cx} ${cy}`;
    }, '');
  }, [func, xScale, yScale]);

  // Handle clicking or dragging on SVG to change x0
  const handleSvgInteraction = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (width / rect.width);
    const mathX = xScale.invert(clickX);
    const clampedX = Math.max(func.domain[0] + 0.2, Math.min(func.domain[1] - 0.5, mathX));
    onSetX0(Number(clampedX.toFixed(2)));
  };

  // Convert points for Secant line
  const secantX1 = xScale(secantLine[0][0]);
  const secantY1 = yScale(secantLine[0][1]);
  const secantX2 = xScale(secantLine[1][0]);
  const secantY2 = yScale(secantLine[1][1]);

  // Convert points for Tangent line
  const tangentX1 = xScale(tangentLine[0][0]);
  const tangentY1 = yScale(tangentLine[0][1]);
  const tangentX2 = xScale(tangentLine[1][0]);
  const tangentY2 = yScale(tangentLine[1][1]);

  // Screen coordinates for points A and B
  const screenA = { x: xScale(x0), y: yScale(y0) };
  const screenB = { x: xScale(x1), y: yScale(y1) };

  // Generate grid ticks
  const xTicks = xScale.ticks(8);
  const yTicks = yScale.ticks(6);

  return (
    <div className="relative w-full overflow-hidden border border-line bg-paper">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto cursor-crosshair select-none"
        onClick={handleSvgInteraction}
      >
        <defs>
          <clipPath id="plot-clip">
            <rect
              x={padding.left}
              y={padding.top}
              width={width - padding.left - padding.right}
              height={height - padding.top - padding.bottom}
            />
          </clipPath>
        </defs>

        {/* Background Grid Lines */}
        <g className="stroke-line" strokeWidth="1">
          {xTicks.map((tick) => (
            <line
              key={`x-grid-${tick}`}
              x1={xScale(tick)}
              y1={padding.top}
              x2={xScale(tick)}
              y2={height - padding.bottom}
            />
          ))}
          {yTicks.map((tick) => (
            <line
              key={`y-grid-${tick}`}
              x1={padding.left}
              y1={yScale(tick)}
              x2={width - padding.right}
              y2={yScale(tick)}
            />
          ))}
        </g>

        {/* Axes (0 line) */}
        {func.domain[0] <= 0 && func.domain[1] >= 0 && (
          <line
            x1={xScale(0)}
            y1={padding.top}
            x2={xScale(0)}
            y2={height - padding.bottom}
            className="stroke-line-strong"
            strokeWidth="1.5"
          />
        )}
        {func.range[0] <= 0 && func.range[1] >= 0 && (
          <line
            x1={padding.left}
            y1={yScale(0)}
            x2={width - padding.right}
            y2={yScale(0)}
            className="stroke-line-strong"
            strokeWidth="1.5"
          />
        )}

        {/* Ticks and Axis Labels */}
        <g className="fill-muted text-[10px] font-mono select-none">
          {xTicks.map((tick) => (
            <text
              key={`x-label-${tick}`}
              x={xScale(tick)}
              y={height - padding.bottom + 16}
              textAnchor="middle"
            >
              {tick}
            </text>
          ))}
          {yTicks.map((tick) => (
            <text
              key={`y-label-${tick}`}
              x={padding.left - 10}
              y={yScale(tick) + 3}
              textAnchor="end"
            >
              {tick}
            </text>
          ))}
        </g>

        {/* Clipped Group for Math Lines & Curves */}
        <g clipPath="url(#plot-clip)">
          {/* Tangent Line (Dashed Accent) */}
          <line
            x1={tangentX1}
            y1={tangentY1}
            x2={tangentX2}
            y2={tangentY2}
            className="stroke-accent"
            strokeWidth="2"
            strokeDasharray="5 4"
          />

          {/* Secant Line (Amber / Rose) */}
          <line
            x1={secantX1}
            y1={secantY1}
            x2={secantX2}
            y2={secantY2}
            className="stroke-amber-500 dark:stroke-amber-400"
            strokeWidth="2.5"
          />

          {/* Function Curve f(x) */}
          <path
            d={curvePath}
            fill="none"
            className="stroke-ink"
            strokeWidth="2.5"
          />

          {/* Differential Triangle (Delta X, Delta Y) */}
          {Math.abs(deltaX) > 0.05 && (
            <g className="transition-opacity">
              {/* Horizontal run: (x0, y0) to (x1, y0) */}
              <line
                x1={screenA.x}
                y1={screenA.y}
                x2={screenB.x}
                y2={screenA.y}
                className="stroke-accent"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              {/* Vertical rise: (x1, y0) to (x1, y1) */}
              <line
                x1={screenB.x}
                y1={screenA.y}
                x2={screenB.x}
                y2={screenB.y}
                className="stroke-amber-600"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {/* Point B (x0 + deltaX, f(x0 + deltaX)) */}
          {Math.abs(deltaX) > 0.02 && (
            <g transform={`translate(${screenB.x}, ${screenB.y})`}>
              <circle r="6" className="fill-amber-500 stroke-background" strokeWidth="2" />
              <text
                x="8"
                y="-6"
                className="fill-amber-700 text-[10px] font-semibold"
              >
                B
              </text>
            </g>
          )}

          {/* Point A (x0, f(x0)) - Main Anchor */}
          <g transform={`translate(${screenA.x}, ${screenA.y})`}>
            <circle
              r="7"
              className="fill-accent stroke-background"
              strokeWidth="2.5"
            />
            <text
              x="-14"
              y="-8"
              className="fill-accent-ink text-xs font-semibold"
            >
              A (x₀)
            </text>
          </g>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute right-3 top-2 flex flex-wrap items-center gap-3 border border-line bg-paper/95 px-2.5 py-1 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink" />
          <span className="text-muted">f(x)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1 w-3 bg-amber-500" />
          <span className="text-amber-700">Cát tuyến</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1 w-3 border-b-2 border-dashed border-accent" />
          <span className="text-accent-ink">Tiếp tuyến</span>
        </div>
      </div>
    </div>
  );
};
