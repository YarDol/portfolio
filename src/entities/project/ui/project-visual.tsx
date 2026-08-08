import { projectPatterns } from "../config/patterns";

type ProjectVisualProps = {
  index: number;
  gradient: string;
  tall?: boolean;
};

/** Faux browser window with a generated pattern, used as project artwork. */
export function ProjectVisual({
  index,
  gradient,
  tall = false,
}: ProjectVisualProps) {
  const pattern = projectPatterns[index % projectPatterns.length];

  return (
    <div
      className={`absolute inset-x-3 bottom-0 top-3 flex flex-col overflow-hidden border border-border/50 shadow-sm ${tall ? "inset-x-5 top-5" : ""}`}
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b border-border/50 bg-card/80 px-3 py-2 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <div className="ml-2 h-2.5 w-28 rounded-sm bg-border/70" />
      </div>

      <div
        className={`relative flex flex-1 items-center justify-center overflow-hidden bg-linear-to-br ${gradient}`}
      >
        <svg
          viewBox="0 0 380 160"
          className="h-full w-full text-accent/30"
          preserveAspectRatio="xMidYMid slice"
        >
          {pattern}
        </svg>
      </div>
    </div>
  );
}
