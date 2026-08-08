"use client";

import { motion, useAnimationControls } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CatSVG } from "./cat-svg";

const MAX_X = 56;

export function CatAnimation() {
  const xCtrl = useAnimationControls();
  const yCtrl = useAnimationControls();

  const [walking, setWalking] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [facing, setFacing] = useState<"right" | "left">("right");
  const [show, setShow] = useState(false);

  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    async function loop() {
      while (alive.current) {
        await xCtrl.start({ x: 0, transition: { duration: 0 } });
        await yCtrl.start({ y: 2, transition: { duration: 0 } });
        setFacing("right");
        setWalking(true);
        setJumping(false);
        setShow(false);
        await pause(50);
        setShow(true);

        await xCtrl.start({
          x: MAX_X,
          transition: { duration: 2.0, ease: "linear" },
        });
        if (!alive.current) break;

        setWalking(false);
        await pause(1000);
        if (!alive.current) break;

        setFacing("left");
        setWalking(true);
        await xCtrl.start({
          x: 10,
          transition: { duration: 2.0, ease: "linear" },
        });
        if (!alive.current) break;

        setWalking(false);
        await pause(1000);
        if (!alive.current) break;
      }
    }

    loop();
    return () => {
      alive.current = false;
    };
  }, [xCtrl, yCtrl]);

  return (
    <motion.div
      animate={xCtrl}
      className="pointer-events-none absolute text-foreground/60 dark:text-foreground/40"
      style={{
        bottom: 0,
        left: 0,
        opacity: show ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <motion.div animate={yCtrl}>
        <motion.div
          animate={walking ? { y: [0, -2, 0] } : { y: 0 }}
          transition={
            walking
              ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.15 }
          }
        >
          <CatSVG facing={facing} walking={walking} jumping={jumping} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
