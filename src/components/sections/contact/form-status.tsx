"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle } from "lucide-react";

type FormStatusProps = {
  success: boolean;
  error: boolean;
  successMessage: string;
  errorMessage: string;
};

export function FormStatus({
  success,
  error,
  successMessage,
  errorMessage,
}: FormStatusProps) {
  return (
    <AnimatePresence mode="wait">
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400"
        >
          <CheckCircle className="h-4 w-4 shrink-0" />
          {successMessage}
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
