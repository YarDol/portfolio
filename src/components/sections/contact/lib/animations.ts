export const inputClass =
  "w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted/40 outline-none";

export function fadeUp(isInView: boolean, delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: {
      duration: 0.5,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  };
}
