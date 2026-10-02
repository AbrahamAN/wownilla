"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEntered } from "../intro/experience";

const messages = [
  { faction: "horde", text: "Forged for the Horde" },
  { faction: "neutral", text: "One guild. Every faction." },
  { faction: "alliance", text: "For the Alliance" },
  { faction: "horde", text: "Strength and honor" },
  { faction: "neutral", text: "Memes know no borders" },
  { faction: "alliance", text: "Stand with the Alliance" },
];

/** Rotates flavorful faction messages without changing the original logo artwork or forcing motion. */
export function FactionBadge() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const entered = useEntered();
  const message = messages[index];
  useEffect(() => {
    if (!entered || paused || reduced) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const visibility = () => {
      clearInterval(timer);
      if (!document.hidden) {
        timer = setInterval(
          () => setIndex((previous) => (previous + 1) % messages.length),
          6000,
        );
      }
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [entered, paused, reduced]);
  const stopped = paused || Boolean(reduced);
  return (
    <div
      className="faction-badge mb-6 anim-up d1"
      data-faction={message.faction}
      role="group"
      aria-label="Faction messages"
    >
      <button
        type="button"
        className="faction-sigil"
        aria-label="Next faction message"
        onClick={() => setIndex((previous) => (previous + 1) % messages.length)}
        title="Next faction message"
      >
        <svg width="15" height="15" aria-hidden="true">
          <use href="#logo-w" />
        </svg>
      </button>
      <span className="faction-message">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={index}
            className="faction-message-text"
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.18, ease: "easeOut" }}
          >
            {message.text}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        className="faction-pause"
        disabled={Boolean(reduced)}
        aria-label={
          reduced
            ? "Faction messages paused for reduced motion"
            : stopped
              ? "Resume faction messages"
              : "Pause faction messages"
        }
        aria-pressed={stopped}
        onClick={() => setPaused((previous) => !previous)}
        title={stopped ? "Messages paused" : "Pause messages"}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d={stopped ? "M5 3v10l8-5-8-5Z" : "M4 3h3v10H4V3Zm5 0h3v10H9V3Z"}
          />
        </svg>
      </button>
    </div>
  );
}
