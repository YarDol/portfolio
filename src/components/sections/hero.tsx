"use client";

import { useTranslations } from "next-intl";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useRef, useEffect } from "react";
import { ArrowDown } from "lucide-react";

function FloatingShapes() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-neutral-200 opacity-40"
      />

      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute left-[15%] top-[30%] h-16 w-16 rotate-45 border border-accent/20 opacity-60"
      />

      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-[20%] left-[10%] h-40 w-40 rounded-full bg-accent/5"
      />

      <motion.div
        style={{ y: y2 }}
        className="absolute right-[20%] top-[40%] grid grid-cols-3 gap-3 opacity-30"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
        ))}
      </motion.div>

      <motion.div
        style={{ y: y1 }}
        className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />
    </div>
  );
}

function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX - 160);
      mouseY.set(e.clientY - 160);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ left: springX, top: springY }}
      className="pointer-events-none fixed h-80 w-80 rounded-full bg-accent/15 blur-3xl"
    />
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export function Hero() {
  const t = useTranslations("Hero");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <MouseGlow />
      <FloatingShapes />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-6 text-center"
      >
        <motion.p
          variants={itemVariants}
          className="font-mono text-sm tracking-widest text-muted uppercase"
        >
          {t("greeting")}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl"
        >
          <span className="bg-linear-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent">
            {t("name")}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-xl text-muted sm:text-2xl"
        >
          {t("role")}
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-lg text-base text-muted/80"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-transform hover:scale-105"
          >
            {t("cta")}
          </a>
          <a
            href="#contact"
            className="rounded-full border border-neutral-300 px-8 py-3 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
          >
            {t("contact")}
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="h-5 w-5 text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
