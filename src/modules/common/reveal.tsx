"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties, ReactNode } from "react";

const Revealed = createContext(false);
const subscribe = () => () => {};

/** Animates section entrances while retaining server-rendered, no-JavaScript content. */
export function Reveal({
  tag = "div",
  children,
  className = "",
  style,
}: {
  tag?: "div" | "article" | "h3";
  children: ReactNode;
  className?: string;
  style?: CSSProperties & { "--rarity"?: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, {
    once: true,
    amount: 0.15,
    margin: "0px 0px -40px 0px",
  });
  const reduced = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const Component =
    tag === "article" ? motion.article : tag === "h3" ? motion.h3 : motion.div;
  return (
    <Revealed value={visible}>
      <Component
        ref={(element) => {
          ref.current = element;
        }}
        className={`${className}${visible ? " in" : ""}`}
        style={style}
        initial={false}
        animate={{
          opacity: visible || reduced || !mounted ? 1 : 0,
          y: visible || reduced || !mounted ? 0 : 24,
        }}
        transition={{
          duration: reduced ? 0 : 0.9,
          ease: [0.22, 1, 0.36, 1],
          delay: parseFloat(style?.transitionDelay || "0"),
        }}
      >
        {children}
      </Component>
    </Revealed>
  );
}

/** Shares typed CSS variables across the allocation and quest progress bars. */
export function BarFill({
  width,
  background,
}: {
  width: string;
  background: string;
}) {
  const visible = useContext(Revealed);
  const reduced = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return (
    <motion.div
      className="bar-fill h-full"
      style={{ background }}
      initial={false}
      animate={{ width: visible || reduced || !mounted ? width : "0%" }}
      transition={{ duration: reduced ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/** Counts a displayed guild stat once its containing reveal enters the viewport. */
export function Counter({ value }: { value: number }) {
  const visible = useContext(Revealed);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!visible || reduced) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setDisplay(Math.round(n)),
    });
    return () => controls.stop();
  }, [visible, reduced, value]);
  return <span data-count={value}>{display.toLocaleString("en-US")}</span>;
}
