"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type {
  ComponentProps,
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  CloudBand,
  CloudVeil,
  LandLayer,
  LockGlyph,
  OceanLayer,
  PinArt,
  ReliefLayer,
  RouteLayer,
  ShadowLayer,
} from "@/modules/index/lore/roadmap-art";
import {
  ROADMAP_PHASES,
  STATUS_LABEL,
} from "@/modules/index/lore/roadmap-data";
import type { RoadmapPhase } from "@/modules/index/lore/roadmap-data";

const subscribe = () => () => {};

/** Widest the tooltip grows, and the gap it keeps from the stage edges. */
const PANEL_WIDTH = 320;
const PANEL_GUTTER = 8;
/** Viewport room a marker needs above it before the tooltip flips below. */
const PANEL_CLEARANCE = 340;
/** Share of the stage that must be visible before the clouds part. */
const REVEAL_RATIO = 0.25;
/** Largest cursor-driven lean of the world, in degrees. */
const LEAN_X = 5;
const LEAN_Y = 8;

/** Sparks rising from the active marker as [x offset px, delay s]. */
const SPARKS = [
  [-9, 0],
  [7, 0.7],
  [-3, 1.4],
  [11, 2.1],
  [-12, 2.8],
] as const;

/** Where the open tooltip sits, in pixels relative to the stage. */
interface OpenPanel {
  id: string;
  left: number;
  top: number;
  width: number;
  /** Horizontal offset of the pointer notch inside the panel. */
  notch: number;
  below: boolean;
}

/**
 * Projects a marker's on-screen box into stage coordinates and clamps the
 * tooltip inside the stage, which itself never exceeds the viewport.
 */
function measurePanel(
  stage: HTMLElement,
  marker: HTMLElement,
  id: string,
): OpenPanel {
  const bounds = stage.getBoundingClientRect();
  const pin = marker.getBoundingClientRect();
  const width = Math.min(PANEL_WIDTH, bounds.width - PANEL_GUTTER * 2);
  const center = pin.left + pin.width / 2 - bounds.left;
  const left = Math.min(
    Math.max(center - width / 2, PANEL_GUTTER),
    bounds.width - width - PANEL_GUTTER,
  );
  const below = pin.top < PANEL_CLEARANCE;
  return {
    id,
    left,
    width,
    notch: Math.min(Math.max(center - left, 20), width - 20),
    below,
    top: (below ? pin.bottom : pin.top) - bounds.top,
  };
}

/**
 * Interactive roadmap world. It owns the browser-only behavior of the lore
 * section: cursor parallax, marker selection and tooltip placement. The copy
 * stays server rendered in the ledger beneath it.
 */
export function RoadmapMap() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerKind = useRef("");
  const [panel, setPanel] = useState<OpenPanel | null>(null);
  const reduced = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  // The reveal arms once a quarter of the stage shows and resets only after
  // the stage has fully left, so the clouds part again on every visit without
  // flickering while the map sits at the viewport edge.
  const [seen, setSeen] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setOnScreen(entry.isIntersecting);
        if (!entry.isIntersecting) setSeen(false);
        else if (entry.intersectionRatio >= REVEAL_RATIO) setSeen(true);
      },
      { threshold: [0, REVEAL_RATIO] },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const leanX = useMotionValue(0);
  const leanY = useMotionValue(0);
  const rotateX = useSpring(leanX, { stiffness: 60, damping: 16 });
  const rotateY = useSpring(leanY, { stiffness: 60, damping: 16 });

  const open = panel !== null;
  useEffect(() => {
    if (!open) return;
    const dismiss = () => setPanel(null);
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(".rm-marker"))
        return;
      dismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  const show = (id: string, marker: HTMLElement) => {
    const stage = stageRef.current;
    if (stage) setPanel(measurePanel(stage, marker, id));
  };
  const hide = (id: string) =>
    setPanel((current) => (current?.id === id ? null : current));

  const onStageMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    leanY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * LEAN_Y);
    leanX.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -LEAN_X);
  };
  const onStageLeave = () => {
    leanX.set(0);
    leanY.set(0);
  };

  const active = panel
    ? ROADMAP_PHASES.find((phase) => phase.id === panel.id)
    : undefined;
  const entrance = mounted && !reduced ? (seen ? " rm-seen" : " rm-pre") : "";

  return (
    <div
      ref={stageRef}
      className={`rm-stage${entrance}${mounted && !onScreen ? " rm-idle" : ""}${open ? " rm-open" : ""}`}
      onPointerMove={onStageMove}
      onPointerLeave={onStageLeave}
    >
      <motion.div className="rm-tilt" style={{ rotateX, rotateY }}>
        <div className="rm-float">
          <div className="rm-world">
            <span className="rm-ground" aria-hidden="true" />
            <div className="rm-layer rm-clouds-back" aria-hidden="true">
              <CloudBand layer="back" />
            </div>
            <span className="rm-layer rm-slab" aria-hidden="true" />
            <div className="rm-layer rm-sea">
              <OceanLayer />
            </div>
            <div className="rm-layer rm-cast">
              <ShadowLayer />
            </div>
            <div className="rm-layer rm-land">
              <LandLayer />
            </div>
            <div className="rm-layer rm-route">
              <RouteLayer />
            </div>
            <div className="rm-layer rm-peaks">
              <ReliefLayer />
            </div>
            <span className="rm-layer rm-sheen" aria-hidden="true" />
            <div className="rm-layer rm-clouds-mid" aria-hidden="true">
              <CloudBand layer="mid" />
            </div>
            {ROADMAP_PHASES.map((phase, index) => (
              <Marker
                key={phase.id}
                phase={phase}
                index={index}
                final={index === ROADMAP_PHASES.length - 1}
                expanded={panel?.id === phase.id}
                onPointerDown={(event) => {
                  pointerKind.current = event.pointerType;
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse")
                    show(phase.id, event.currentTarget);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") hide(phase.id);
                }}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible"))
                    show(phase.id, event.currentTarget);
                }}
                onBlur={() => hide(phase.id)}
                onClick={(event) => {
                  const kind = pointerKind.current;
                  pointerKind.current = "";
                  // A mouse already opened the panel by hovering, so only
                  // touch, pen and keyboard activation toggle it shut.
                  if (kind !== "mouse" && panel?.id === phase.id)
                    setPanel(null);
                  else show(phase.id, event.currentTarget);
                }}
              />
            ))}
            <div className="rm-layer rm-clouds-front" aria-hidden="true">
              <CloudBand layer="front" />
            </div>
          </div>
        </div>
      </motion.div>
      <span className="rm-fog" aria-hidden="true" />
      <CloudVeil />
      <AnimatePresence>
        {panel && active ? (
          <PhasePanel
            key={active.id}
            phase={active}
            panel={panel}
            instant={Boolean(reduced)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type MarkerHandlers = Pick<
  ComponentProps<"button">,
  | "onPointerDown"
  | "onPointerEnter"
  | "onPointerLeave"
  | "onFocus"
  | "onBlur"
  | "onClick"
>;

/**
 * One waypoint: a ground beacon lying on the map plus an upright pin button.
 * Sealed phases stay explorable but expose no action beyond reading.
 */
function Marker({
  phase,
  index,
  final,
  expanded,
  ...handlers
}: {
  phase: RoadmapPhase;
  index: number;
  final: boolean;
  expanded: boolean;
} & MarkerHandlers) {
  const style: CSSProperties & { "--x": string; "--y": string; "--i": number } =
    {
      "--x": `${phase.position.x}%`,
      "--y": `${phase.position.y}%`,
      "--i": index,
    };
  const lit = phase.status === "in-progress";
  return (
    <>
      <span
        className="rm-beacon"
        data-status={phase.status}
        data-final={final || undefined}
        style={style}
        aria-hidden="true"
      >
        <i />
        <i />
      </span>
      <button
        type="button"
        className="rm-marker"
        data-status={phase.status}
        data-final={final || undefined}
        style={style}
        aria-label={`${phase.numeral}: ${phase.title} — ${STATUS_LABEL[phase.status]}`}
        aria-describedby={`roadmap-${phase.id}`}
        aria-expanded={expanded}
        {...handlers}
      >
        <span className="rm-marker-tag">{phase.mark}</span>
        <PinArt status={phase.status} />
        {lit
          ? SPARKS.map(([x, delay]) => (
              <span
                key={delay}
                className="rm-spark"
                style={{ marginLeft: x, animationDelay: `${delay}s` }}
              />
            ))
          : null}
      </button>
    </>
  );
}

/** Floating tooltip for the selected phase; it never intercepts pointer input. */
function PhasePanel({
  phase,
  panel,
  instant,
}: {
  phase: RoadmapPhase;
  panel: OpenPanel;
  instant: boolean;
}) {
  const lit = phase.status === "in-progress";
  const style: CSSProperties & { "--notch": string } = {
    left: panel.left,
    top: panel.top,
    width: panel.width,
    "--notch": `${panel.notch}px`,
  };
  return (
    <div
      className="rm-panel-anchor"
      data-side={panel.below ? "below" : "above"}
      style={style}
    >
      <motion.div
        role="tooltip"
        className="rm-panel"
        data-status={phase.status}
        initial={{ opacity: 0, y: panel.below ? -10 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: panel.below ? -6 : 6 }}
        transition={{ duration: instant ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-friz uppercase text-[11px] tracking-[0.22em] text-gold">
            {phase.numeral}
          </span>
          <span className="rm-status" data-status={phase.status}>
            {lit ? (
              <span className="rm-status-dot" aria-hidden="true" />
            ) : (
              <LockGlyph className="w-3 h-3" />
            )}
            {STATUS_LABEL[phase.status]}
          </span>
        </div>
        <p className="mt-2 font-morpheus text-2xl leading-tight [text-shadow:0_2px_0_#000] rm-panel-title">
          {phase.title}
        </p>
        <svg className="mt-3 w-[140px] h-[10px] opacity-70" aria-hidden="true">
          <use href="#ornament"></use>
        </svg>
        <p className="mt-3 font-narrow text-[15px] leading-snug text-parch/90">
          {phase.description}
        </p>
      </motion.div>
    </div>
  );
}
