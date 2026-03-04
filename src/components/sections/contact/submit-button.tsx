"use client";

import { motion } from "motion/react";
import { Send } from "lucide-react";

type SubmitButtonProps = {
  isPending: boolean;
  sendLabel: string;
  sendingLabel: string;
};

export function SubmitButton({
  isPending,
  sendLabel,
  sendingLabel,
}: SubmitButtonProps) {
  return (
    <div className="pt-1">
      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 rounded-xl bg-foreground px-7 py-3 text-sm font-medium text-background transition-opacity disabled:opacity-50 hover:opacity-85"
      >
        {isPending ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-block h-4 w-4 rounded-full border-2 border-background/30 border-t-background"
            />
            {sendingLabel}
          </>
        ) : (
          <>
            {sendLabel}
            <Send className="h-3.5 w-3.5" />
          </>
        )}
      </motion.button>
    </div>
  );
}
