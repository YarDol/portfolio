"use client";

import { memo } from "react";
import Markdown from "react-markdown";

export const MarkdownRenderer = memo(
  function MarkdownRenderer({ content }: { content: string }) {
    return (
      <Markdown
        components={{
          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-1.5 last:mb-0 space-y-0.5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-1.5 last:mb-0 space-y-0.5">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent-light transition-colors"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="px-1 py-0.5 rounded bg-foreground/10 text-xs font-mono">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </Markdown>
    );
  },
  (prev, next) => prev.content === next.content,
);
