import { projectPatterns } from "../config/patterns";

type ProjectPatternProps = {
  index: number;
  gradient: string;
};

/** Standalone pattern tile — the artwork without the browser chrome. */
export function ProjectPattern({ index, gradient }: ProjectPatternProps) {
  const pattern = projectPatterns[index % projectPatterns.length];

  return (
    <div
      className={`relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br ${gradient}`}
    >
      <svg
        viewBox="0 0 380 160"
        className="h-full w-full text-accent/30"
        preserveAspectRatio="xMidYMid slice"
      >
        {pattern}
      </svg>
    </div>
  );
}
