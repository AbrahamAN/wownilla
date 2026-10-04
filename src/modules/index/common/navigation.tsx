"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { MsftPrice } from "./msft-price";
import { ProjectActions } from "./project-actions";

const sections = ["tavern", "token", "lore", "community"];

/** Keeps navigation state local while retaining native, shareable section links. */
export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const root = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    let current = "";
    for (const id of sections) {
      const element = document.getElementById(id);
      if (
        element &&
        element.getBoundingClientRect().top <= window.innerHeight * 0.4
      )
        current = id;
    }
    setActive(current);
  });
  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("menuBtn")?.focus({ preventScroll: true });
      }
    };
    const resize = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    if (open) {
      document.addEventListener("click", outside);
      document.addEventListener("keydown", escape);
      window.addEventListener("resize", resize);
    }
    return () => {
      document.removeEventListener("click", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  return (
    <header
      ref={root}
      id="siteHeader"
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5 anim-down pointer-events-none"
    >
      <div className="relative pointer-events-auto w-full xl:w-auto max-w-[520px] xl:max-w-none">
        <nav
          id="navpill"
          className={`nav-frame flex items-center justify-between xl:justify-start gap-2 xl:gap-5 md:gap-5 px-4 md:px-6 py-2.5${scrolled ? " scrolled" : ""}`}
          aria-label="Primary"
        >
          <a
            href="#top"
            className="flex items-center gap-2"
            aria-label="WOWNILLA — back to top"
            onClick={() => setOpen(false)}
          >
            <svg
              width="22"
              height="22"
              className="text-goldhi"
              aria-hidden="true"
            >
              <use href="#logo-w" />
            </svg>
            <span className="logo-type text-[15px] sm:text-[19px]">
              WOWNILLA
            </span>
          </a>
          <MsftPrice />
          <ul className="hidden xl:flex items-center gap-5 font-friz uppercase text-[13px] tracking-[0.18em]">
            {sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  data-nav={id}
                  className={`nav-link${active === id ? " is-active" : ""}`}
                  aria-current={active === id ? "location" : undefined}
                >
                  {id[0].toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5">
            <div className="hidden xl:block">
              <ProjectActions compact />
            </div>
            <button
              id="menuBtn"
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              className="xl:hidden -mr-1 grid place-items-center w-10 h-10 rounded-[3px] text-goldhi hover:bg-bronze/30 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobileMenu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path
                  d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                />
              </svg>
            </button>
          </div>
        </nav>
        <div
          id="mobileMenu"
          className={`nav-frame xl:hidden absolute left-0 right-0 mt-2 p-2 font-friz uppercase tracking-[0.18em] text-[13px]${open ? " open" : ""}`}
          aria-hidden={!open}
          inert={!open}
        >
          {sections.map((id, index) => (
            <a
              key={id}
              href={`#${id}`}
              data-nav={id}
              onClick={() => setOpen(false)}
              className={`m-link flex items-center justify-between rounded-[2px] px-4 py-3.5${active === id ? " is-active" : ""}`}
              aria-current={active === id ? "location" : undefined}
            >
              {id[0].toUpperCase() + id.slice(1)}
              <span className="text-[10px] text-gold" aria-hidden="true">
                {["I", "II", "III", "IV"][index]}
              </span>
            </a>
          ))}
          <div className="border-t border-bronze mt-2 pt-3">
            <ProjectActions compact />
          </div>
        </div>
      </div>
    </header>
  );
}

/** Updates the XP fill outside React's render loop; only level changes update text. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(
    scrollYProgress,
    (progress) => `${progress * 100}%`,
  );
  const [level, setLevel] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (progress) =>
    setLevel(1 + Math.floor(progress * 59)),
  );
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex justify-end px-3 pb-1">
        <span
          id="xp-label"
          className="rounded-[2px] border border-bronze bg-[#0B0A08]/90 px-2 py-0.5 font-narrow text-[11px] font-bold tracking-[0.12em] text-goldhi"
        >
          {level >= 60 ? "LVL 60 · DING!" : `LVL ${level}`}
        </span>
      </div>
      <div id="xp" className="h-[8px] w-full">
        <motion.div id="xp-fill" className="h-full" style={{ width }} />
      </div>
    </div>
  );
}
