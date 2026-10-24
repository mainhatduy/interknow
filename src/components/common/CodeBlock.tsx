'use client';

import React, { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import './CodeBlock.css';

hljs.registerLanguage('python', python);

interface CodeBlockProps {
  code: string;
  language?: 'python' | 'text';
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  className = '',
}) => {
  const highlightedCode = useMemo(
    () => language === 'python' ? hljs.highlight(code, { language: 'python' }).value : null,
    [code, language]
  );

  return (
    <div className={`code-block min-w-0 border border-line bg-paper ${className}`}>
      <div className="border-b border-line px-4 py-2 font-mono text-xs text-muted">
        {language === 'python' ? 'Python' : 'Kết quả'}
      </div>
      <pre tabIndex={0} aria-label={language === 'python' ? 'Mã Python' : 'Kết quả'} className="overflow-x-auto p-4 font-mono text-[13px] leading-7 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        {highlightedCode !== null ? (
          <code className="language-python" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
};
