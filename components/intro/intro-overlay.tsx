"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { NAMASTE_PATH, NAMASTE_VIEWBOX } from "./namaste-path";

const DRAW_DURATION_S = 2.2;
const HOLD_AFTER_DRAW_MS = 400;
const FADE_DURATION_S = 0.6;

export function IntroOverlay() {
  const [stage, setStage] = useState<"drawing" | "fading" | "done">(
    "drawing",
  );
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const drawMs = DRAW_DURATION_S * 1000;
    const fadeTimer = setTimeout(
      () => setStage("fading"),
      drawMs + HOLD_AFTER_DRAW_MS,
    );
    const doneTimer = setTimeout(
      () => setStage("done"),
      drawMs + HOLD_AFTER_DRAW_MS + FADE_DURATION_S * 1000,
    );

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [reducedMotion]);

  if (reducedMotion || stage === "done") return null;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "fading" ? 0 : 1 }}
      transition={{ duration: FADE_DURATION_S, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{ pointerEvents: stage === "fading" ? "none" : "auto" }}
    >
      <svg
        viewBox={NAMASTE_VIEWBOX}
        className="h-40 w-auto sm:h-56"
        fill="none"
      >
        <motion.path
          d={NAMASTE_PATH}
          stroke="#000000"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: DRAW_DURATION_S, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}
