"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Particles } from "@/modules/common/particles";

/** Models queue phases explicitly so timers and keyboard entry remain cancellable. */
export function LoginQueue({
  scene,
  transition,
  enter,
  needsGesture,
}: {
  scene: ReactNode;
  transition: string;
  enter: () => void;
  needsGesture: () => boolean;
}) {
  const reduced = useReducedMotion();
  const [position, setPosition] = useState(16422);
  const [phase, setPhase] = useState<
    "counting" | "connecting" | "success" | "ready" | "quit"
  >("counting");
  const button = useRef<HTMLButtonElement>(null);
  const quitting = useRef(false);
  const gesture = useRef(needsGesture);
  useEffect(() => {
    gesture.current = needsGesture;
  }, [needsGesture]);
  useEffect(() => {
    button.current?.focus({ preventScroll: true });
    if (transition !== "idle") return;
    let frame = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) =>
      timers.push(setTimeout(fn, ms));
    button.current?.focus({ preventScroll: true });
    const started = performance.now();
    const tick = (now: number) => {
      if (quitting.current) return;
      const progress = Math.min(1, (now - started) / (reduced ? 1200 : 3200));
      setPosition(Math.round(16422 * Math.pow(1 - progress, 2.6)));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else {
        setPhase("connecting");
        later(
          () => {
            if (quitting.current) return;
            setPhase("success");
            if (gesture.current()) {
              setPhase("ready");
              button.current?.focus({ preventScroll: true });
            } else later(enter, reduced ? 200 : 450);
          },
          reduced ? 200 : 450,
        );
      }
    };
    later(
      () => {
        frame = requestAnimationFrame(tick);
      },
      reduced ? 0 : 500,
    );
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        enter();
      }
      if (event.key === "Tab") {
        const options = [
          button.current,
          document.getElementById("qQuit"),
          document.getElementById("musicBtn"),
        ].filter((element): element is HTMLElement => element !== null);
        const index = options.findIndex(
          (element) => element === document.activeElement,
        );
        event.preventDefault();
        options[
          (index + (event.shiftKey ? options.length - 1 : 1)) % options.length
        ]?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      document.removeEventListener("keydown", keydown);
    };
  }, [enter, reduced, transition]);
  useEffect(() => {
    if (phase !== "quit") return;
    const timer = setTimeout(enter, 700);
    return () => clearTimeout(timer);
  }, [phase, enter]);
  useEffect(() => {
    if (phase !== "ready" || transition !== "idle") return;
    const timer = setInterval(() => {
      if (!gesture.current()) enter();
    }, 200);
    return () => clearInterval(timer);
  }, [phase, transition, enter]);

  const title =
    phase === "counting"
      ? "Login Servers are Full"
      : phase === "connecting"
        ? "Connecting"
        : phase === "quit"
          ? "You can’t quit the grind."
          : "Success!";
  const line =
    phase === "counting"
      ? `Position in queue: ${position.toLocaleString("en-US")}`
      : phase === "connecting"
        ? "Handshaking with the guild…"
        : phase === "ready"
          ? "Your character is ready."
          : "Summoning your character…";
  return (
    <div
      id="queue"
      className={transition === "idle" ? undefined : transition}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qTitle"
    >
      {scene}
      <Particles queue />
      <div className="q-ui absolute top-4 left-4 md:top-6 md:left-8 flex flex-col items-center select-none">
        <Image
          src="/assets/wownilla-logo-mug.webp"
          alt="WOWNILLA"
          width={1433}
          height={563}
          unoptimized
          className="w-[150px] md:w-[240px] h-auto drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]"
          draggable={false}
        />
        <span className="-mt-1 font-friz text-[10px] md:text-xs tracking-[0.45em] text-parch [text-shadow:0_1px_2px_#000]">
          • CLASSIC •
        </span>
      </div>
      <div className="q-ui absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[min(88vw,480px)]">
        <div className="q-dialog relative px-6 py-5 text-center">
          <div id="qTitle" className="q-text text-lg md:text-2xl leading-tight">
            {title}
          </div>
          <div
            id="qLine1"
            className="q-text text-lg md:text-2xl leading-tight"
            aria-live="polite"
          >
            {line}
          </div>
          <div id="qLine2" className="q-text text-lg md:text-2xl leading-tight">
            {phase === "counting"
              ? `Estimated time: ${Math.floor(position / 456) >= 1 ? Math.floor(position / 456) + " min" : "< 1 minute"}`
              : ""}
          </div>
          <button
            ref={button}
            id="qCancel"
            type="button"
            className={`q-btn mt-4 w-[70%] rounded-md py-1.5 text-sm md:text-base${phase === "ready" ? " enter-world" : ""}`}
            onClick={enter}
          >
            {phase === "ready" ? "Enter World" : "Skip intro · Enter World"}
          </button>
        </div>
      </div>
      <div className="q-ui absolute inset-x-0 bottom-0 px-4 md:px-6 pb-3 flex items-end justify-between gap-4 text-[10px] md:text-xs text-[#F2C230] font-friz [text-shadow:0_1px_2px_#000]">
        <div className="leading-tight">
          Version 0.4.20 (69420) (Release degen64)
          <br />
          Sep 29 2026
        </div>
        <div className="hidden md:block pb-0.5">
          Copyright 2026 WOWNILLA Guild. No Rights Reserved.
        </div>
        <button
          id="qQuit"
          type="button"
          className="q-btn rounded-md px-6 py-1 text-xs md:text-sm"
          onClick={() => {
            quitting.current = true;
            setPhase("quit");
          }}
        >
          Quit
        </button>
      </div>
      <div id="queueFlash" />
    </div>
  );
}
