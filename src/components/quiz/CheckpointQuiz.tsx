'use client';

import React, { useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface CheckpointQuizProps {
  lessonId: string;
  title?: string;
  questions: QuizQuestion[];
  onCompleteLesson?: () => void;
  className?: string;
}

export const CheckpointQuiz: React.FC<CheckpointQuizProps> = ({
  lessonId,
  title = 'Bài tập kiểm tra',
  questions,
  onCompleteLesson,
  className = '',
}) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const isAllAnswered = questions.every((_, idx) => answers[idx] !== undefined);

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    const passed = score >= Math.ceil(questions.length * 0.6);

    if (passed && onCompleteLesson) {
      onCompleteLesson();
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const passed = score >= Math.ceil(questions.length * 0.6);

  return (
    <section data-quiz={lessonId} className={`border border-line bg-paper p-4 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="kicker">{title}</p>
          <p className="mt-1 text-xs text-muted">Trả lời đúng để ghi nhận hoàn thành bài học</p>
        </div>

        {submitted && (
          <span className={`text-sm font-medium ${passed ? 'text-emerald-700' : 'text-amber-700'}`}>
            Điểm {score}/{questions.length} — {passed ? 'Đạt' : 'Chưa đạt'}
          </span>
        )}
      </div>

      {/* Question list */}
      <div className="mt-5 space-y-7">
        {questions.map((q, qIdx) => {
          const selected = answers[qIdx];
          const isCorrect = selected === q.correctIndex;

          return (
            <div key={q.id} className="space-y-3">
              <p className="text-sm font-medium leading-relaxed text-ink">
                <span className="font-serif text-accent-ink">Câu {qIdx + 1}.</span> {q.question}
              </p>

              <div className="space-y-1.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selected === optIdx;
                  let optClass = 'border-line text-muted hover:border-line-strong';

                  if (isSelected && !submitted) {
                    optClass = 'border-accent bg-accent-soft text-ink';
                  } else if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optClass = 'border-emerald-600 bg-emerald-50 text-emerald-900';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                    } else {
                      optClass = 'border-line text-muted opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`flex w-full items-center justify-between gap-3 border p-3 text-left text-sm transition-colors ${optClass}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <Check className="h-4 w-4 shrink-0 text-emerald-700" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <X className="h-4 w-4 shrink-0 text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`border-l-2 p-3 text-sm leading-relaxed ${
                    isCorrect
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900'
                      : 'border-rose-500 bg-rose-50/60 text-rose-900'
                  }`}
                >
                  <span className="font-medium">Giải thích. </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered}
            className="rounded-sm bg-accent px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 rounded-sm border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Làm lại
          </button>
        )}
      </div>
    </section>
  );
};
