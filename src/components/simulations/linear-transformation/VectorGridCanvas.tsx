'use client';

import React, { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import {
  Matrix2x2,
  Vector2D,
  generateTransformedGrid,
  multiplyMatrixVector,
} from '@/lib/math/linearAlgebra';

interface VectorGridCanvasProps {
  matrix: Matrix2x2;
  customVector: Vector2D;
  width?: number;
  height?: number;
  range?: number;
}

export const VectorGridCanvas: React.FC<VectorGridCanvasProps> = ({
  matrix,
  customVector,
  width = 560,
  height = 400,
  range = 4,
}) => {
  // Coordinate mapping from math space [-range, range] to SVG space [0, width/height]
  const xScale = useMemo(() => {
    return scaleLinear().domain([-range, range]).range([30, width - 30]);
  }, [range, width]);

  const yScale = useMemo(() => {
    return scaleLinear().domain([-range, range]).range([height - 30, 30]);
  }, [range, height]);

  // Transformed grid lines & basis vectors
  const { lines, iHatTransformed, jHatTransformed, determinant } = useMemo(() => {
    return generateTransformedGrid(matrix, range, 1);
  }, [matrix, range]);

  // Transformed custom vector
  const transformedCustomVector = useMemo(() => {
    return multiplyMatrixVector(matrix, customVector);
  }, [matrix, customVector]);

  // Origin coordinates
  const originX = xScale(0);
  const originY = yScale(0);

  // Parallelogram vertices for area visualizer: (0,0) -> iHat -> (iHat + jHat) -> jHat
  const p0 = [originX, originY];
  const p1 = [xScale(iHatTransformed[0]), yScale(iHatTransformed[1])];
  const p2 = [
    xScale(iHatTransformed[0] + jHatTransformed[0]),
    yScale(iHatTransformed[1] + jHatTransformed[1]),
  ];
  const p3 = [xScale(jHatTransformed[0]), yScale(jHatTransformed[1])];
  const parallelogramPoints = `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`;

  return (
    <div className="relative w-full overflow-hidden border border-line bg-paper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none"
      >
        <defs>
          {/* Arrowhead marker for i-hat (Red) */}
          <marker
            id="arrow-red"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
          </marker>

          {/* Arrowhead marker for j-hat (Green) */}
          <marker
            id="arrow-green"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
          </marker>

          {/* Arrowhead marker for custom vector (Cyan) */}
          <marker
            id="arrow-cyan"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
          </marker>
        </defs>

        {/* Transformed Grid Lines */}
        <g>
          {lines.map((line) => {
            const x1 = xScale(line.points[0][0]);
            const y1 = yScale(line.points[0][1]);
            const x2 = xScale(line.points[1][0]);
            const y2 = yScale(line.points[1][1]);

            return (
              <line
                key={line.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={
                  line.isAxis
                    ? 'stroke-line-strong'
                    : 'stroke-line'
                }
                strokeWidth={line.isAxis ? 1.5 : 1}
                strokeDasharray={line.isAxis ? undefined : '2 2'}
              />
            );
          })}
        </g>

        {/* Determinant Parallelogram (Area Scaling) */}
        <polygon
          points={parallelogramPoints}
          className={`transition-colors duration-200 ${
            Math.abs(determinant) < 0.01
              ? 'fill-rose-500/20 stroke-rose-500'
              : 'fill-accent/25 stroke-accent'
          }`}
          strokeWidth="2"
        />

        {/* Basis Vector i-hat (Transformed) */}
        <line
          x1={originX}
          y1={originY}
          x2={xScale(iHatTransformed[0])}
          y2={yScale(iHatTransformed[1])}
          stroke="#ef4444"
          strokeWidth="3.5"
          markerEnd="url(#arrow-red)"
        />
        <text
          x={xScale(iHatTransformed[0]) + 8}
          y={yScale(iHatTransformed[1]) - 4}
          fill="#ef4444"
          className="text-xs font-black font-mono select-none"
        >
          î [{iHatTransformed[0].toFixed(1)}, {iHatTransformed[1].toFixed(1)}]
        </text>

        {/* Basis Vector j-hat (Transformed) */}
        <line
          x1={originX}
          y1={originY}
          x2={xScale(jHatTransformed[0])}
          y2={yScale(jHatTransformed[1])}
          stroke="#10b981"
          strokeWidth="3.5"
          markerEnd="url(#arrow-green)"
        />
        <text
          x={xScale(jHatTransformed[0]) + 8}
          y={yScale(jHatTransformed[1]) - 4}
          fill="#10b981"
          className="text-xs font-black font-mono select-none"
        >
          ĵ [{jHatTransformed[0].toFixed(1)}, {jHatTransformed[1].toFixed(1)}]
        </text>

        {/* Custom Test Vector v */}
        <line
          x1={originX}
          y1={originY}
          x2={xScale(transformedCustomVector[0])}
          y2={yScale(transformedCustomVector[1])}
          stroke="#06b6d4"
          strokeWidth="3"
          strokeDasharray="4 2"
          markerEnd="url(#arrow-cyan)"
        />
        <text
          x={xScale(transformedCustomVector[0]) + 8}
          y={yScale(transformedCustomVector[1]) + 12}
          fill="#06b6d4"
          className="text-[11px] font-bold font-mono select-none"
        >
          v⃗ [{transformedCustomVector[0].toFixed(1)}, {transformedCustomVector[1].toFixed(1)}]
        </text>

        {/* Origin dot */}
        <circle cx={originX} cy={originY} r="4" fill="#64748b" />
      </svg>

      {/* Canvas overlay info */}
      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 border border-line bg-paper/95 p-2 text-xs">
        <div className="flex items-center gap-1.5 text-rose-700">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Vector î (Cột 1)</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Vector ĵ (Cột 2)</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-700">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          <span>Vector test v⃗</span>
        </div>
      </div>
    </div>
  );
};
