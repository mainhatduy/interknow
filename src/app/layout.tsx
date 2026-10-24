import type { Metadata } from 'next';
import { Geist, Geist_Mono, Source_Serif_4 } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'InterKnow — Tạp chí tri thức tương tác',
  description:
    'Đọc giải thích → Dự đoán kết quả → Thay đổi tham số → Quan sát phản hồi → Kiểm tra hiểu biết. Học thuật toán và toán học qua mô phỏng trực quan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink selection:bg-accent selection:text-background">
        {children}
      </body>
    </html>
  );
}
