"use client";

import { motion, useReducedMotion } from "motion/react";

export function RiverLine({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 800 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <motion.path
        d="M-10,100 C90,20 150,180 250,100 C350,20 410,180 510,100 C610,20 670,180 770,100 L810,100"
        stroke="var(--rapids-teal)"
        strokeWidth={3}
        strokeLinecap="round"
        initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 1.8, ease: "easeInOut" }
        }
      />
    </svg>
  );
}
