"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { siteConfig } from "@/modules/index/common/site-config";
import { LoginQueue } from "./login-queue";

const Entered = createContext(false);
const subscribe = () => () => {};

/** Lets hero effects follow the shared login lifecycle without subscribing to audio state. */
export function useEntered() {
  return useContext(Entered);
}

/** Coordinates the intro and music while leaving the page content server rendered. */
export function Experience({
  children,
  scene,
}: {
  children: ReactNode;
  scene: ReactNode;
}) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [entered, setEntered] = useState(false);
  const [transition, setTransition] = useState<"idle" | "entering" | "gone">(
    "idle",
  );
  const [removed, setRemoved] = useState(false);
  const [wanted, setWanted] = useState(true);
  const [available, setAvailable] = useState(Boolean(siteConfig.heroMusic));
  const wantedRef = useRef(true);
  const audio = useRef<HTMLAudioElement>(null);
  const controls = useRef({
    play: () => {},
    stop: () => {},
    blocked: true,
    failed: false,
  });
  const leaving = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduced = useReducedMotion();

  const enter = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    setTransition("entering");
    timers.current.push(
      setTimeout(
        () => {
          setEntered(true);
          setTransition("gone");
          document.documentElement.classList.remove("queued");
          const target = document.getElementById(location.hash.slice(1));
          target?.scrollIntoView({ behavior: "instant" });
          document
            .getElementById("siteHeader")
            ?.querySelector("a")
            ?.focus({ preventScroll: true });
          timers.current.push(setTimeout(() => setRemoved(true), 800));
        },
        reduced ? 150 : 1050,
      ),
    );
  }, [reduced]);

  useEffect(() => {
    const currentTimers = timers.current;
    document.documentElement.classList.add("queued");
    return () => {
      currentTimers.forEach(clearTimeout);
      document.documentElement.classList.remove("queued");
    };
  }, []);

  useEffect(() => {
    const element = audio.current;
    if (!element || !siteConfig.heroMusic) return;
    let disposed = false,
      frame = 0,
      hiddenPause = false,
      generation = 0;
    const fade = (target: number, duration: number, done?: () => void) => {
      cancelAnimationFrame(frame);
      const from = element.volume,
        start = performance.now();
      const step = (now: number) => {
        if (disposed) return;
        const progress = Math.min(1, (now - start) / duration);
        element.volume = Math.max(
          0,
          Math.min(1, from + (target - from) * progress),
        );
        if (progress < 1) frame = requestAnimationFrame(step);
        else done?.();
      };
      frame = requestAnimationFrame(step);
    };
    const fail = () => {
      controls.current.failed = true;
      controls.current.blocked = false;
      setAvailable(false);
    };
    const play = () => {
      const request = ++generation;
      cancelAnimationFrame(frame);
      element.volume = 0;
      void element
        .play()
        .then(() => {
          if (disposed || request !== generation) return;
          controls.current.blocked = false;
          if (!wantedRef.current || document.hidden) {
            element.pause();
            return;
          }
          fade(siteConfig.musicVolume, 1800);
        })
        .catch((error) => {
          if (disposed || request !== generation) return;
          if (element.error) fail();
          else if (
            error instanceof DOMException &&
            error.name === "NotAllowedError"
          )
            controls.current.blocked = true;
          else if (!(
            error instanceof DOMException && error.name === "AbortError"
          ))
            fail();
        });
    };
    controls.current.play = play;
    controls.current.stop = () => {
      generation++;
      fade(0, 500, () => element.pause());
    };
    const unlock = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("#musicBtn"))
        return;
      if (wantedRef.current && element.paused && !controls.current.failed)
        play();
    };
    const visibility = () => {
      if (document.hidden) {
        hiddenPause = !element.paused;
        generation++;
        cancelAnimationFrame(frame);
        element.pause();
      } else if (hiddenPause) {
        hiddenPause = false;
        if (wantedRef.current) play();
      }
    };
    element.addEventListener("error", fail);
    // Preloaded media can fail before hydration attaches its error listener.
    if (element.error)
      queueMicrotask(() => {
        if (!disposed) fail();
      });
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    document.addEventListener("visibilitychange", visibility);
    play();
    return () => {
      disposed = true;
      generation++;
      cancelAnimationFrame(frame);
      element.pause();
      element.removeEventListener("error", fail);
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  function toggleMusic() {
    wantedRef.current = !wantedRef.current;
    setWanted(wantedRef.current);
    if (wantedRef.current) controls.current.play();
    else controls.current.stop();
  }

  return (
    <Entered value={entered}>
      <div inert={mounted && !entered}>{children}</div>
      {mounted && !removed ? (
        <LoginQueue
          scene={scene}
          transition={transition}
          enter={enter}
          needsGesture={() =>
            wantedRef.current &&
            !controls.current.failed &&
            controls.current.blocked
          }
        />
      ) : null}
      <audio
        ref={audio}
        id="heroMusic"
        src={siteConfig.heroMusic || undefined}
        preload="auto"
        loop
      />
      {available ? (
        <button
          id="musicBtn"
          type="button"
          onClick={toggleMusic}
          className="music-btn fixed z-[110] left-3 bottom-5 md:left-5 md:bottom-6 flex items-center gap-2 rounded-[3px] pl-2 pr-3 py-2"
          aria-pressed={wanted}
          aria-label={wanted ? "Mute music" : "Play music"}
        >
          <span className="music-icon grid place-items-center w-7 h-7 rounded-full">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 4V5L7 9H3z" />
              <path
                d={
                  wanted
                    ? "M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                    : "M16 9l6 6M22 9l-6 6"
                }
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="eq" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span
            id="musicLabel"
            className="font-friz uppercase text-[10px] tracking-[0.2em]"
          >
            Music {wanted ? "on" : "off"}
          </span>
        </button>
      ) : null}
    </Entered>
  );
}
