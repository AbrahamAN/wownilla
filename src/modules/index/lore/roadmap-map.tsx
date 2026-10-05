"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type {
  ReactNode,
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  CloudBand,
  CloudVeil,
  LandLayer,
  OceanLayer,
  PinArt,
  ReliefLayer,
  RouteLayer,
  ShadowLayer,
} from "@/modules/index/lore/roadmap-art";
import { ROADMAP_PHASES } from "@/modules/index/lore/roadmap-data";
import type { RoadmapPhase } from "@/modules/index/lore/roadmap-data";

import { RoadmapQuestOverlay } from "./roadmap-quest-overlay";

const subscribe = () => () => {};

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

/** Previews quests beside the cursor and opens accessible dialogs without growing the map. */
export function RoadmapMap({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const updateHidden = () => setHidden(document.hidden);
    updateHidden();
    document.addEventListener("visibilitychange", updateHidden);
    return () => {
      document.removeEventListener("visibilitychange", updateHidden);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const followAnchor = () => {
      const quest = ROADMAP_PHASES.find(
        (item) => location.hash === `#roadmap-${item.id}`,
      );
      if (!quest) return;
      setModal(true);
      setSelected(quest.id);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => stageRef.current?.scrollIntoView());
    };
    followAnchor();
    window.addEventListener("hashchange", followAnchor);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", followAnchor);
    };
  }, []);

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

  const entrance = mounted && !reduced ? (seen ? " rm-seen" : " rm-pre") : "";

  return (
    <div
      className="roadmap-quests"
      data-enhanced={mounted}
      data-selected={selected}
    >
      <div
        ref={stageRef}
        className={`rm-stage${entrance}${mounted && (!onScreen || hidden) ? " rm-idle" : ""}`}
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
                  selected={selected === phase.id}
                  onPreview={(event) => {
                    if (modal || event.pointerType !== "mouse") return;
                    cursorX.set(event.clientX);
                    cursorY.set(event.clientY);
                    setSelected(phase.id);
                  }}
                  onLeave={() => {
                    if (!modal) setSelected(null);
                  }}
                  onSelect={() => {
                    setModal(true);
                    setSelected(phase.id);
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
      </div>
      {mounted ? (
        <p className="quest-prompt font-narrow text-parch2">
          Hover or select a checkpoint to view its quest.
        </p>
      ) : null}
      {!mounted ? <div className="quest-details">{children}</div> : null}
      {mounted && selected ? (
        <RoadmapQuestOverlay
          questId={selected}
          modal={modal}
          cursorX={cursorX}
          cursorY={cursorY}
          onDismiss={() => {
            setSelected(null);
            setModal(false);
          }}
        >
          {children}
        </RoadmapQuestOverlay>
      ) : null}
    </div>
  );
}

/** A numbered waypoint selects its quest without implying progress or completion. */
function Marker({
  phase,
  index,
  final,
  selected,
  onSelect,
  onPreview,
  onLeave,
}: {
  phase: RoadmapPhase;
  index: number;
  final: boolean;
  selected: boolean;
  onSelect: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  onPreview: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onLeave: () => void;
}) {
  const style: CSSProperties & { "--x": string; "--y": string; "--i": number } =
    {
      "--x": `${phase.position.x}%`,
      "--y": `${phase.position.y}%`,
      "--i": index,
    };
  return (
    <>
      <span
        className="rm-beacon"
        data-selected={selected}
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
        data-selected={selected}
        data-final={final || undefined}
        style={style}
        aria-label={`${phase.numeral} — ${phase.title}`}
        aria-controls={`roadmap-${phase.id}`}
        aria-pressed={selected}
        aria-haspopup="dialog"
        aria-expanded={selected}
        onPointerEnter={onPreview}
        onPointerMove={onPreview}
        onPointerLeave={onLeave}
        onClick={onSelect}
      >
        <span className="rm-marker-tag">{phase.mark}</span>
        <PinArt />
        {selected
          ? SPARKS.map(([x, delay]) => (
              <span
                key={delay}
                className="rm-spark"
                aria-hidden="true"
                style={{ marginLeft: x, animationDelay: `${delay}s` }}
              />
            ))
          : null}
      </button>
    </>
  );
}
