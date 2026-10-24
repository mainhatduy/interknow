'use client';

import React from 'react';
import { Code2 } from 'lucide-react';

interface CodeTrackerProps {
  activeLine: number;
}

const CODE_LINES = [
  { line: 1, text: 'let low = 0, high = arr.length - 1;' },
  { line: 2, text: 'while (low <= high) {' },
  { line: 3, text: '  const mid = Math.floor((low + high) / 2);' },
  { line: 4, text: '  if (arr[mid] === target) return mid;' },
  { line: 5, text: '  if (arr[mid] < target) low = mid + 1;' },
  { line: 6, text: '  else high = mid - 1;' },
  { line: 7, text: 'return -1; // Not found' },
];

export const CodeTracker: React.FC<CodeTrackerProps> = ({ activeLine }) => {
  return (
    <div className="border border-line bg-paper p-4 font-mono text-xs text-ink">
      <div className="mb-2 flex items-center justify-between border-b border-line pb-2 text-muted">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-accent-ink" />
          <span className="text-[11px] font-medium tracking-wide">Mã nguồn (TypeScript)</span>
        </div>
        <span className="text-[10px]">dòng {activeLine}</span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max space-y-0.5">
        {CODE_LINES.map((item) => {
          const isActive = item.line === activeLine;
          return (
            <div
              key={item.line}
              className={`flex items-center gap-3 px-2.5 py-1 transition-colors ${
                isActive
                  ? 'border-l-2 border-accent bg-accent-soft font-medium text-ink'
                  : 'border-l-2 border-transparent text-muted'
              }`}
            >
              <span className="w-5 select-none text-right text-[10px] text-muted">
                {item.line}
              </span>
              <pre className="whitespace-pre font-mono text-xs">{item.text}</pre>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
