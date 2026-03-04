"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import Image from "next/image";

export function VideoCircle() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ scale: 1.015 }}
      onClick={toggle}
      className="relative h-72 w-72 cursor-pointer sm:h-80 sm:w-80"
    >
      <div className="absolute inset-0 z-10 rounded-full overflow-hidden">
        <Image
          src="https://framerusercontent.com/images/pwAUoVA1C9O1e6lJkYG30tHbY.gif"
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="absolute inset-7 overflow-hidden rounded-full sm:inset-7">
        <video
          ref={videoRef}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full object-cover"
          playsInline
          preload="metadata"
        >
          <source src="/introducing.mp4" type="video/mp4" />
        </video>

        <motion.div
          animate={{ opacity: playing ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center-safe bg-black/20"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm">
            <Play className="ml-0.5 h-4 w-4 fill-neutral-900 text-neutral-900" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
