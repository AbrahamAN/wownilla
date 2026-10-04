"use client";

import { useEffect, useRef } from "react";
import { Particles } from "@/modules/common/particles";

/** Pauses the decorative reunion embers when nobody can see them, without rerendering the story. */
export function WhyAtmosphere() {
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
      className="why-atmosphere"
      data-running="false"
      aria-hidden="true"
    >
      <Particles />
    </div>
  );
}
