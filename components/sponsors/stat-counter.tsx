"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

const DURATION_MS = 1800;

function useCountUp(target: number) {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;

        const startTime = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - startTime) / DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, reducedMotion]);

  return { value: reducedMotion ? target : value, ref };
}

export function StatCounter({
  target,
  prefix = "",
  suffix = "",
  label,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const { value, ref } = useCountUp(target);

  return (
    <div ref={ref} className="border-l-2 border-border pl-6 text-left sm:pl-8">
      <p className="font-heading text-5xl font-bold text-foreground tabular-nums sm:text-6xl">
        {prefix && (
          <span className="mr-1 align-[0.2em] text-[0.55em]">{prefix}</span>
        )}
        {value.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}
