import type { Easing, FadeUp } from "../model/types";

const EASE: Easing = [0.25, 0.46, 0.45, 0.94];

/** Section-scoped stagger: elements stay hidden until the section is in view. */
export function createFadeUp(isInView: boolean): FadeUp {
  return (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.5, delay, ease: EASE },
  });
}
