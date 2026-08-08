/** Small caps gutter label ("Who", "Past", "Now") with a hover underline. */
export function HeroIndexLabel({ children }: { children: string }) {
  return (
    <span className="group relative inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/60 pt-0.5 cursor-default select-none w-fit">
      {children}

      <span className="absolute bottom-0 left-0 h-px w-full bg-foreground/20" />

      <span className="absolute bottom-0 left-0 h-px w-0 bg-foreground/65 transition-all duration-300 group-hover:w-full" />
    </span>
  );
}
