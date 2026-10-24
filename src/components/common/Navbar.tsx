'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const lessons = [
    { id: 'binary-search', title: 'Tìm kiếm nhị phân', href: '/lessons/binary-search' },
    { id: 'derivative', title: 'Đạo hàm và tiếp tuyến', href: '/lessons/derivative' },
    { id: 'linear-transformation', title: 'Biến đổi tuyến tính và định thức', href: '/lessons/linear-transformation' },
    { id: 'regression', title: 'Hồi quy tuyến tính đơn', href: '/lessons/regression' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-serif text-xl font-semibold tracking-tight text-ink">
            Inter<span className="text-accent-ink">Know</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
              pathname === '/'
                ? 'text-accent-ink font-medium'
                : 'text-muted hover:text-ink'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Trang chủ
          </Link>

          {lessons.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`px-3 py-1.5 text-sm transition-colors border-b-2 ${
                  isActive
                    ? 'border-accent text-ink font-medium'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
