"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function TransitionFade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}

