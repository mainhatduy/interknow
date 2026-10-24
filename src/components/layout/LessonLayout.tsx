import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

export interface LessonSection {
  id: string;
  label: string;
  title: string;
  content: React.ReactNode;
}

interface LessonLayoutProps {
  lessonId: string;
  category: string;
  title: string;
  duration: string;
  sections: LessonSection[];
  summary: React.ReactNode;
}

/** Each activity lives in the reading flow, immediately after its explanation. */
export function LessonLayout({
  lessonId, category, title, duration, sections, summary,
}: LessonLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-ink" data-lesson={lessonId}>
      <Navbar />
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Trang chủ
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="kicker">{category}</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {duration} phút · Đọc & thực hành
            </span>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {title}
          </h1>
          <nav aria-labelledby="lesson-toc-title" className="mt-8">
            <h2 id="lesson-toc-title" className="font-serif text-lg font-semibold">Mục lục</h2>
            <ol className="mt-3 space-y-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="group flex items-baseline gap-3 py-1.5 text-sm leading-relaxed transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:gap-4 sm:text-base">
                    <span className="w-5 shrink-0 font-mono text-xs tabular-nums text-muted">{index + 1}.</span>
                    <span className="font-serif underline-offset-4 group-hover:underline">{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <article className="min-w-0">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="lesson-section scroll-mt-24">
              <p className="kicker">Phần {String(index + 1).padStart(2, '0')} · {section.label}</p>
              <h2 id={`${section.id}-title`} className="mb-5 mt-2 font-serif text-2xl font-semibold leading-snug tracking-tight">
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}
          <aside aria-label="Điểm cần nhớ" className="mt-12 border border-line bg-paper p-5 sm:p-6">
            <p className="kicker">Điểm cần nhớ</p>
            <div className="mt-3 space-y-3 text-sm leading-relaxed">{summary}</div>
          </aside>
        </article>
      </main>
    </div>
  );
}
