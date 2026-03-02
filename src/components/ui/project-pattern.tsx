import { patterns } from "./project-patterns";

export function ProjectPattern({
  index,
  gradient,
}: {
  index: number;
  gradient: string;
}) {
  const pattern = patterns[index % patterns.length];

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
