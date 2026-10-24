'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  math,
  block = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`my-4 overflow-x-auto py-1 text-center text-ink [&_.katex-display]:my-0 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block px-0.5 align-baseline text-ink ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
