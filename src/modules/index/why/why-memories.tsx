"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/modules/index/common/site-config";
import { useEntered } from "@/modules/index/intro/experience";

/** Loops the supplied dungeon memories behind the server-rendered story without loading unseen video. */
export function WhyMemories() {
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef(() => {});
  const entered = useEntered();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const videos = Array.from(element.querySelectorAll("video"));
    const memories = Array.from(
      element.querySelectorAll<HTMLElement>(".why-memory"),
    );
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let wanted = !motion.matches;
    let visible = false;
    let disposed = false;
    let heartbeat: ReturnType<typeof setInterval> | undefined;

    const canPlay = () => entered && wanted && visible && !document.hidden;
    /** Picks a fresh memory each beat, excluding the previous one so the reveal always changes. */
    const beat = () => {
      const candidates = memories.filter(
        (memory) => memory.dataset.active !== "true",
      );
      const selected =
        candidates[Math.floor(Math.random() * candidates.length)];
      if (!selected) return;
      for (const memory of memories)
        memory.dataset.active = String(memory === selected);
    };
    /** Runs one timer for the CSS pulse only while visible media is playing; reduced motion keeps still posters. */
    const syncHeartbeat = () => {
      const running =
        canPlay() &&
        !motion.matches &&
        videos.some((video) => !video.paused && !video.error);
      element.dataset.running = String(running);
      if (running && heartbeat === undefined) {
        element.dataset.beating = "true";
        beat();
        heartbeat = setInterval(beat, 2400);
      } else if (!running) {
        clearInterval(heartbeat);
        heartbeat = undefined;
        if (motion.matches) element.dataset.beating = "false";
      }
    };
    const syncControl = () => {
      if (!disposed) {
        setPlaying(videos.some((video) => !video.paused && !video.error));
        syncHeartbeat();
      }
    };
    /** Loads sources only when needed and leaves gesture-based retry available after autoplay rejection. */
    const update = () => {
      for (const video of videos) {
        if (!canPlay()) {
          video.pause();
          continue;
        }
        if (video.error) continue;
        if (!video.hasAttribute("src") && video.dataset.src)
          video.src = video.dataset.src;
        void video.play().catch(syncControl);
      }
      syncControl();
    };
    /** Guards late media events so pending play promises cannot restart a hidden or unmounted background. */
    const onPlaying = (event: Event) => {
      const video = event.currentTarget;
      if (!(video instanceof HTMLVideoElement)) return;
      if (disposed || !canPlay()) {
        video.pause();
        return;
      }
      video.dataset.ready = "true";
      syncControl();
    };
    const onError = (event: Event) => {
      if (event.currentTarget instanceof HTMLVideoElement)
        event.currentTarget.hidden = true;
      syncControl();
    };
    const onMotion = () => {
      wanted = !motion.matches;
      update();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio > 0;
        update();
      },
      { threshold: 0.01 },
    );
    toggle.current = () => {
      wanted = !videos.some((video) => !video.paused && !video.error);
      update();
    };
    for (const video of videos) {
      video.addEventListener("playing", onPlaying);
      video.addEventListener("pause", syncControl);
      video.addEventListener("error", onError);
    }
    observer.observe(element.closest("section") || element);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", onMotion);
    setReady(true);

    return () => {
      disposed = true;
      clearInterval(heartbeat);
      element.dataset.running = "false";
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", onMotion);
      toggle.current = () => {};
      for (const video of videos) {
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("pause", syncControl);
        video.removeEventListener("error", onError);
        video.pause();
      }
    };
  }, [entered]);

  return (
    <>
      <div
        ref={root}
        className="why-memories"
        aria-hidden="true"
        data-beating="false"
        data-running="false"
      >
        {siteConfig.whyMemories.map((memory) => (
          <div
            key={memory.id}
            className="why-memory"
            style={{ backgroundImage: `url("${memory.poster}")` }}
          >
            <video
              data-src={memory.src}
              poster={memory.poster}
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
            />
          </div>
        ))}
      </div>
      <button
        className="why-memories-control font-narrow"
        type="button"
        hidden={!ready}
        aria-label={playing ? "Pause memories" : "Play memories"}
        onClick={() => toggle.current()}
      >
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          {playing ? (
            <path fill="currentColor" d="M4 3h3v10H4zm5 0h3v10H9z" />
          ) : (
            <path fill="currentColor" d="M5 2l9 6-9 6z" />
          )}
        </svg>
        <span>{playing ? "Pause memories" : "Play memories"}</span>
      </button>
    </>
  );
}
