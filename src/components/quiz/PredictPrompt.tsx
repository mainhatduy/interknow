'use client';

import React, { useState } from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';

export interface PredictOption {
  text: string;
  isCorrect?: boolean;
  explanation: string;
}

interface PredictPromptProps {
  question: string;
  options: PredictOption[];
  onAnswered?: (chosenIndex: number) => void;
  savedChoice?: number;
  className?: string;
}

export const PredictPrompt: React.FC<PredictPromptProps> = ({
  question,
  options,
  onAnswered,
  savedChoice,
  className = '',
}) => {
  const [selected, setSelected] = useState<number | null>(
    savedChoice !== undefined ? savedChoice : null
  );
  const [revealed, setRevealed] = useState<boolean>(savedChoice !== undefined);

  const handleSelect = (index: number) => {
    setSelected(index);
    setRevealed(true);
    if (onAnswered) {
      onAnswered(index);
    }
  };

  return (
    <section className={`border border-line bg-paper p-4 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-accent-soft text-accent-ink">
          <Lightbulb className="h-3.5 w-3.5" />
        </span>
        <span className="kicker">Thử dự đoán trước khi xem kết quả</span>
      </div>

      <h3 className="mt-3 font-serif text-base font-semibold leading-snug text-ink">
        {question}
      </h3>

      {/* Options */}
      <div className="mt-4 space-y-2">
        {options.map((opt, idx) => {
          const isChosen = selected === idx;
          return (
            <button
              key={idx}
              aria-pressed={isChosen}
              onClick={() => handleSelect(idx)}
              className={`flex w-full items-start gap-3 border p-3 text-left text-sm transition-colors ${
                isChosen
                  ? 'border-accent bg-accent-soft'
                  : 'border-line bg-paper hover:border-line-strong'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm font-mono text-xs ${
                  isChosen ? 'bg-accent text-background' : 'bg-accent-soft text-muted'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className={isChosen ? 'text-ink' : 'text-muted'}>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation reveal */}
      {revealed && selected !== null && (
        <div role="status" className="mt-4 border-l-2 border-accent bg-accent-soft/60 p-4 text-sm leading-relaxed text-ink">
          <div className="flex items-center gap-1.5 font-medium text-accent-ink">
            <ArrowRight className="h-3.5 w-3.5" />
            Phân tích giả thuyết
          </div>
          <p className="mt-1.5 text-muted">{options[selected].explanation}</p>
          <p className="mt-3 text-xs text-muted">
            Tiếp tục xuống phần thực hành để đối chiếu dự đoán của bạn.
          </p>
        </div>
      )}
    </section>
  );
};
