"use client";

import { Sparkles } from "lucide-react";

interface ChatWelcomeProps {
  title: string;
  subtitle: string;
  quickActions: string[];
  onAction: (text: string) => void;
}

export function ChatWelcome({
  title,
  subtitle,
  quickActions,
  onAction,
}: ChatWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
      <div className="flex items-center justify-center size-14 rounded-2xl bg-accent/10">
        <Sparkles className="size-6 text-accent" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted mt-1.5 leading-relaxed">{subtitle}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-1">
        {quickActions.map((q) => (
          <button
            key={q}
            onClick={() => onAction(q)}
            className="px-3 py-1.5 text-xs rounded-full border border-border text-muted hover:text-foreground hover:border-accent/40 hover:bg-accent/5 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
