"use client";

import { useEffect, useRef } from "react";
import { Particles } from "@/modules/common/particles";

/** Keeps hearth light and embers local to the painted scene and pauses them when unseen. */
export function TavernAtmosphere() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    const update = () => {
      element.dataset.running = String(visible && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div
      ref={root}
      className="tavern-atmosphere"
      data-running="false"
      aria-hidden="true"
    >
      <div className="tavern-firelight" />
      <Particles />
    </div>
  );
}
