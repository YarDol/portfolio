"use client";

import type { UIMessage } from "@ai-sdk/react";
import { Download, Mail, Sparkles } from "lucide-react";

export type ToolPart = UIMessage["parts"][number] & {
  toolCallId: string;
  state: string;
  output?: Record<string, unknown>;
};

interface ChatToolPartProps {
  part: ToolPart;
  downloadLabel: string;
  lookingUpLabel: string;
}

export function ChatToolPart({ part, downloadLabel, lookingUpLabel }: ChatToolPartProps) {
  if (part.state === "output-available") {
    const output = (part.output ?? {}) as Record<string, string>;

    if (part.type === "tool-downloadCV" && output.url) {
      return (
        <a
          href={output.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
        >
          <Download className="size-3.5" />
          {downloadLabel}
        </a>
      );
    }

    if (part.type === "tool-getContact" && output.email) {
      return (
        <div className="flex flex-col gap-1 mt-1">
          <a
            href={`mailto:${output.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors w-fit"
          >
            <Mail className="size-3.5" />
            {output.email}
          </a>
        </div>
      );
    }

    return null;
  }

  if (part.state === "call" || part.state === "input-streaming") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Sparkles className="size-3 animate-pulse" />
        {lookingUpLabel}
      </span>
    );
  }

  return null;
}
