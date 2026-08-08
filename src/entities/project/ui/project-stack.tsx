export function ProjectStack({ stack }: { stack: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {stack.map((tech) => (
        <span
          key={tech}
          className="bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-foreground/45"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
