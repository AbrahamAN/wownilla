"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { createDungeon } from "./dungeon-renderer";

/** Adapts the canvas renderer to viewport, tab visibility, and React mount lifetimes. */
export default function Dungeon({ running }: { running: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const renderer = createDungeon(element, Boolean(reduced));
    let visible = true;
    const sync = () => {
      if (running && visible && !document.hidden) renderer.start();
      else renderer.stop();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      renderer.dispose();
    };
  }, [running, reduced]);
  return (
    <canvas
      ref={canvas}
      id="dungeon"
      className="absolute inset-0 w-full h-full"
    />
  );
}
