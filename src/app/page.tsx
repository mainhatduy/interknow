'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { getAllLessonsProgress, LessonProgress } from '@/lib/storage/progress';

interface LessonEntry {
  id: string;
  number: string;
  category: string;
  title: string;
  href: string;
  description: string;
  tags: string[];
}

const LESSONS: LessonEntry[] = [
  {
    id: 'binary-search',
    number: '01',
    category: 'Thuật toán & Cấu trúc dữ liệu',
    title: 'Tìm kiếm nhị phân',
    href: '/lessons/binary-search',
    description:
      'Cách cắt đôi không gian tìm kiếm theo cấp số nhân O(log n): theo dõi con trỏ low/mid/high và dòng mã thực thi theo từng bước.',
    tags: ['O(log n)', 'Con trỏ L/M/R', 'Mã nguồn trực tiếp'],
  },
  {
    id: 'derivative',
    number: '02',
    category: 'Giải tích & Vi phân',
    title: 'Đạo hàm và tiếp tuyến',
    href: '/lessons/derivative',
    description:
      'Trực quan hóa giới hạn Δx → 0: kéo điểm mốc x₀ trên đồ thị và quan sát cát tuyến tiệm cận chính xác về tiếp tuyến.',
    tags: ['Giới hạn Δx → 0', 'Hệ số góc', 'Tam giác vi phân'],
  },
  {
    id: 'linear-transformation',
    number: '03',
    category: 'Đại số tuyến tính',
    title: 'Biến đổi tuyến tính và định thức',
    href: '/lessons/linear-transformation',
    description:
      'Đọc ma trận như phép nhào nặn không gian qua hai vector cơ sở î và ĵ, và đo diện tích biến đổi bằng định thức det(A).',
    tags: ['Ma trận 2×2', 'Vector î & ĵ', 'det(A)'],
  },
  {
    id: 'regression',
    number: '04',
    category: 'Machine Learning',
    title: 'Hồi quy tuyến tính đơn',
    href: '/lessons/regression',
    description:
      'Học cách hồi quy tuyến tính dự đoán giá trị số bằng đường thẳng ŷ = wx + b: tự chỉnh tham số, quan sát MSE và viết lại bằng Python.',
    tags: ['ŷ = wx + b', 'MSE', 'scikit-learn'],
  },
];

const METHOD_STEPS = [
  {
    num: '1',
    title: 'Đọc giải thích',
    desc: 'Lý thuyết ngắn gọn, nhấn mạnh trực giác và công thức KaTeX chuẩn mực.',
  },
  {
    num: '2',
    title: 'Dự đoán kết quả',
    desc: 'Đặt giả thuyết trước khi thao tác, để kích hoạt tư duy phản biện.',
  },
  {
    num: '3',
    title: 'Thay đổi tham số',
    desc: 'Kéo thanh trượt, đổi giá trị, chọn preset hoặc click trực tiếp lên hình vẽ.',
  },
  {
    num: '4',
    title: 'Quan sát mô phỏng',
    desc: 'Khung vẽ SVG phản hồi tức thì, kèm bảng số liệu và con trỏ chuyển động.',
  },
  {
    num: '5',
    title: 'Kiểm tra hiểu biết',
    desc: 'Trắc nghiệm củng cố với phản hồi và lời giải thích chi tiết.',
  },
];

export default function HomePage() {
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});

  useEffect(() => {
    const updateProgress = () => {
      const data = getAllLessonsProgress(['binary-search', 'derivative', 'linear-transformation', 'regression']);
      setProgressMap(data);
    };

    updateProgress();
    window.addEventListener('interknow-progress-update', updateProgress);
    return () => window.removeEventListener('interknow-progress-update', updateProgress);
  }, []);

  const totalCompleted = Object.values(progressMap).filter((p) => p.completed).length;

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col">
      <Navbar />

      {/* Masthead */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="kicker flex items-center gap-3">
            <span>Tạp chí tri thức tương tác</span>
            <span className="h-px flex-1 bg-line-strong" />
            <span>Số 1 · 2026</span>
          </p>

          <h1 className="mt-5 max-w-3xl font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Hiểu sâu khoa học &amp; thuật toán bằng{' '}
            <em className="not-italic text-accent-ink">trực quan hóa</em>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Không học vẹt công thức. Mỗi bài là một phòng thí nghiệm tương tác, nơi bạn đặt giả
            thuyết, kéo thả tham số và tận mắt quan sát quy luật toán học vận hành.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="font-serif text-base text-ink">{LESSONS.length} bài</span>
            <span className="text-line-strong">·</span>
            <span>4 lĩnh vực</span>
            <span className="text-line-strong">·</span>
            <span>{totalCompleted}/{LESSONS.length} bài đã hoàn thành</span>
            <Link
              href="/lessons/binary-search"
              className="ml-auto inline-flex items-center gap-1.5 font-medium text-accent-ink hover:underline"
            >
              Bắt đầu đọc
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mục lục — lesson entries */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">Mục lục</h2>
          <span className="h-px flex-1 bg-line" />
        </div>

        <ol className="mt-6 divide-y divide-line border-y border-line">
          {LESSONS.map((lesson) => {
            const progress = progressMap[lesson.id];
            const isCompleted = progress?.completed;
            const isTinkered = progress?.tinkered;

            return (
              <li key={lesson.id}>
                <Link
                  href={lesson.href}
                  className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-start sm:gap-8"
                >
                  {/* Số thứ tự */}
                  <div className="flex w-16 shrink-0 items-baseline gap-3">
                    <span className="font-serif text-2xl font-light text-line-strong">
                      {lesson.number}
                    </span>
                  </div>

                  {/* Nội dung */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="kicker">{lesson.category}</span>
                      <span className="text-line-strong">·</span>
                      <span className="text-xs text-muted">
                        {isCompleted
                          ? 'Đã hoàn thành'
                          : isTinkered
                            ? 'Đang đọc'
                            : 'Chưa đọc'}
                      </span>
                    </div>

                    <h3 className="mt-1.5 font-serif text-xl font-semibold text-ink transition-colors group-hover:text-accent-ink sm:text-2xl">
                      {lesson.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                      {lesson.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      {lesson.tags.map((tag) => (
                        <span key={tag} className="font-mono text-[11px]">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <span className="flex shrink-0 items-center gap-1.5 self-start pt-1 text-sm font-medium text-accent-ink">
                    Đọc
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        {/* Phương pháp */}
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">Phương pháp học</h2>
            <span className="h-px flex-1 bg-line" />
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Mỗi bài được cấu trúc theo một vòng lặp năm bước, dựa trên nghiên cứu khoa học nhận
            thức về học chủ động.
          </p>

          <ol className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {METHOD_STEPS.map((step) => (
              <li key={step.num} className="border-t-2 border-line pt-4">
                <span className="font-serif text-2xl font-light text-line-strong">{step.num}</span>
                <h3 className="mt-2 font-medium text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs leading-relaxed text-muted sm:px-6 lg:px-8">
          <p className="font-serif text-sm text-ink">InterKnow</p>
          <p className="mt-1">
            © 2026 · Xây dựng bằng Next.js, TypeScript, KaTeX, React và D3/SVG.
          </p>
        </div>
      </footer>
    </div>
  );
}
