"use client";

import { Bot, X } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  onClose: () => void;
}

export function ChatHeader({ title, subtitle, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center size-9 rounded-full bg-accent/10">
          <Bot className="size-4.5 text-accent" />
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 ring-2 ring-card" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">
            {title}
          </p>
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="flex items-center justify-center size-8 rounded-lg text-muted hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
        aria-label={title}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
