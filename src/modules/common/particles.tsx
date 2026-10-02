"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";
import type { CSSProperties } from "react";

const subscribe = () => () => {};

/** Uses deterministic particle positions so renders remain pure and hydration stays stable. */
export function Particles({ queue = false }: { queue?: boolean }) {
  const reduced = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!mounted || reduced) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {Array.from({ length: queue ? 18 : 26 }, (_, index) => {
        const fraction = ((index * 7919 + 104729) % 997) / 997;
        const magic = index % 4 === 0;
        const style: CSSProperties & {
          "--dx": string;
          "--dy": string;
          "--o": number;
        } = {
          left: `${queue ? (index % 2 ? 84 : 8) + fraction * 8 : fraction * 100}%`,
          top: `${queue ? 78 + fraction * 10 : 20 + ((index * 37) % 75)}%`,
          width: queue
            ? undefined
            : magic
              ? 2 + fraction * 2
              : 1 + fraction * 1.8,
          height: queue
            ? undefined
            : magic
              ? 2 + fraction * 2
              : 1 + fraction * 1.8,
          "--dx": `${fraction * 120 - 60}px`,
          "--dy": `${-40 - fraction * 120}px`,
          "--o": magic ? 0.9 : 0.25 + fraction * 0.35,
          animationDuration: `${queue ? 2.5 + fraction * 3 : 9 + fraction * 12}s`,
          animationDelay: `${-fraction * (queue ? 4 : 20)}s`,
        };
        return (
          <span
            key={index}
            className={
              queue
                ? "q-ember"
                : `dust${magic ? " magic" : ""}${index >= 14 ? " hidden sm:block" : ""}`
            }
            style={style}
          />
        );
      })}
    </div>
  );
}
