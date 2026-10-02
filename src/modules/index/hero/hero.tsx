"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useEntered } from "@/modules/index/intro/experience";
import { Particles } from "@/modules/common/particles";
import { siteConfig } from "@/modules/index/common/site-config";

const Dungeon = dynamic(() => import("./dungeon"), { ssr: false });

/** Preserves the hero backdrop while isolating video failures and canvas rendering. */
export function HeroBackground() {
  const entered = useEntered();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (value) =>
    reduced ? 0 : Math.min(value, ref.current?.offsetHeight || 1000) * 0.18,
  );
  const scale = useTransform(scrollY, (value) =>
    reduced
      ? 1
      : 1 + Math.min(1, value / (ref.current?.offsetHeight || 1000)) * 0.06,
  );
  useEffect(() => {
    const element = video.current;
    if (!element || reduced) return;
    let disposed = false;
    void element.play().catch(() => {
      if (!disposed) setFailed(true);
    });
    const visibility = () => {
      if (document.hidden) element.pause();
      else
        void element.play().catch(() => {
          if (!disposed) setFailed(true);
        });
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      element.pause();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reduced]);
  return (
    <motion.div
      ref={ref}
      id="heroBg"
      className="absolute inset-0 z-0 w-full h-full will-change-transform"
      style={{ y, scale }}
      aria-hidden="true"
    >
      <div className="hero-media absolute inset-0">
        <Dungeon running={entered && !(playing && !failed)} />
        {siteConfig.heroVideo && !reduced && !failed ? (
          <video
            ref={video}
            id="heroVideo"
            className={`absolute inset-0 w-full h-full object-cover${playing ? " ready" : ""}`}
            src={siteConfig.heroVideo}
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setPlaying(true)}
            onError={() => setFailed(true)}
          />
        ) : null}
      </div>
      <div className="rays" />
      <div className="fog" style={{ top: "55%", height: "26%" }} />
      <div
        className="fog"
        style={{
          top: "68%",
          height: "30%",
          animationDuration: "70s",
          animationDirection: "alternate-reverse",
        }}
      />
      <Particles />
      <div className="absolute inset-0 bg-[#0B0A08]/35" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(11,10,8,0) 30%, rgba(11,10,8,0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 38% at 50% 44%, rgba(11,10,8,0.6), rgba(11,10,8,0) 72%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B0A08]/80 to-transparent" />
      <div className="grain absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0B0A08]" />
    </motion.div>
  );
}

/** Drives hero parallax with motion values instead of per-frame React state. */
export function HeroContent({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, (value) =>
    Math.max(
      0,
      1 - (value / (ref.current?.parentElement?.offsetHeight || 1000)) * 1.4,
    ),
  );
  const y = useTransform(scrollY, (value) =>
    reduced
      ? 0
      : -Math.min(
          1,
          value / (ref.current?.parentElement?.offsetHeight || 1000),
        ) * 60,
  );
  return (
    <motion.main
      ref={ref}
      id="heroContent"
      className="relative z-10 flex flex-col items-center text-center pt-[104px] md:pt-[128px] px-4 will-change-transform"
      style={{ opacity, y }}
    >
      {children}
    </motion.main>
  );
}

/** Announces the original achievement after entry, with timers scoped to its mount. */
export function Achievement() {
  const entered = useEntered();
  const [phase, setPhase] = useState("");
  useEffect(() => {
    if (!entered) return;
    const show = setTimeout(() => setPhase("show"), 2600);
    const hide = setTimeout(() => setPhase("hide"), 9100);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [entered]);
  return (
    <div
      id="achievement"
      className={`toast ${phase} hidden md:flex absolute z-20 left-6 lg:left-10 bottom-24 items-center gap-3 rounded-[3px] pl-2 pr-5 py-2 bg-[#0B0A08]/92 border border-gold shadow-[inset_0_0_0_1px_#000,0_10px_30px_rgba(0,0,0,0.6)]`}
      role="status"
    >
      <div className="relative grid place-items-center w-11 h-11 item-icon">
        <svg width="22" height="22" className="text-goldhi" aria-hidden="true">
          <use href="#logo-w" />
        </svg>
      </div>
      <div className="text-left">
        <div className="font-friz text-[10px] tracking-[0.2em] text-gold uppercase">
          Achievement Unlocked
        </div>
        <div className="font-friz text-sm text-parch">
          Entered the Dungeon of WOWNILLA
        </div>
      </div>
      <div className="ml-2 grid place-items-center w-8 h-8 rounded-full border border-gold font-narrow text-[12px] font-bold text-goldhi">
        10
      </div>
    </div>
  );
}
