"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent,
} from "react";
import {
  AVATAR_SIZE,
  createAvatarRenderer,
  preloadLayers,
  type AvatarRenderer,
  type ExportSize,
} from "./avatar-canvas";
import {
  hiddenCategories,
  isItemAllowed,
  randomTraits,
  resolveLayer,
  visibleItems,
} from "./avatar-code";
import {
  avatarFileName,
  avatarShareUrl,
  canShareFiles,
  SHARE_TEXT,
  xIntentUrl,
} from "./avatar-share";
import type { AvatarAction } from "./avatar-state";
import {
  categories,
  RACE_CATEGORY,
  type AvatarTraits,
} from "./avatar.config";

const MIRROR_SIZE = 192;

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * The forge: live preview, one tab per layer category, and the export and
 * share actions. State lives in the studio; this component only renders it
 * and keeps canvas drawing outside React's render loop.
 */
export function AvatarGenerator({
  traits,
  code,
  canUndo,
  dispatch,
}: {
  traits: AvatarTraits;
  code: string;
  canUndo: boolean;
  dispatch: Dispatch<AvatarAction>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const mirror = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<AvatarRenderer | null>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(categories[0].id);
  const [status, setStatus] = useState("");

  const active =
    categories.find((category) => category.id === activeId) ?? categories[0];
  const raceId = traits[RACE_CATEGORY];
  const hidden = hiddenCategories(traits);
  const coveredBy = hidden.get(active.id);

  useEffect(() => {
    if (!canvas.current) return;
    renderer.current = createAvatarRenderer(canvas.current, mirror.current);
    return () => {
      renderer.current?.dispose();
      renderer.current = null;
    };
  }, []);

  // `code` identifies the traits, so redraw only when the avatar changes.
  useEffect(() => {
    void renderer.current?.render(visibleItems(traits));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    preloadLayers(active.items.map((item) => resolveLayer(item, raceId)));
  }, [active, raceId]);

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    const index = categories.findIndex((category) => category.id === active.id);
    let next = index + step;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = categories.length - 1;
    else if (step === 0) return;
    event.preventDefault();
    const target = categories[(next + categories.length) % categories.length];
    setActiveId(target.id);
    tabs.current
      ?.querySelector<HTMLElement>(`#avatar-tab-${target.id}`)
      ?.focus();
  }

  async function download(size: ExportSize) {
    const blob = await renderer.current?.exportPng(size);
    if (!blob) {
      setStatus("Could not export the avatar. Try again.");
      return;
    }
    saveBlob(blob, avatarFileName(code));
    setStatus(`Downloaded ${size}×${size} PNG.`);
  }

  async function share() {
    const url = avatarShareUrl(window.location.origin, code);
    if (!canShareFiles()) {
      window.open(xIntentUrl(url), "_blank", "noopener,noreferrer");
      setStatus("Opened X in a new tab.");
      return;
    }
    const blob = await renderer.current?.exportPng(AVATAR_SIZE);
    if (!blob) {
      setStatus("Could not export the avatar. Try again.");
      return;
    }
    const file = new File([blob], avatarFileName(code), { type: "image/png" });
    try {
      await navigator.share({ files: [file], text: SHARE_TEXT, url });
      setStatus("Shared.");
    } catch (error) {
      // Closing the share sheet rejects with AbortError; that is not a failure.
      const cancelled = error instanceof Error && error.name === "AbortError";
      setStatus(cancelled ? "" : "Sharing failed. Download the PNG instead.");
    }
  }

  return (
    <div id="avatar-forge" className="avatar-window avatar-generator">
      <div className="avatar-titlebar font-narrow">
        <span>FORGE.EXE</span>
        <span className="avatar-code" data-testid="avatar-code">
          #{code}
        </span>
      </div>
      <div className="avatar-window-body">
        <div className="avatar-stage">
          <canvas
            ref={canvas}
            className="avatar-canvas"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            role="img"
            aria-label="Your avatar preview"
          />
          <figure className="avatar-mirror">
            <canvas
              ref={mirror}
              width={MIRROR_SIZE}
              height={MIRROR_SIZE}
              aria-hidden
            />
            <figcaption className="font-narrow text-parch2">
              As profile picture
            </figcaption>
          </figure>
        </div>

        <div className="avatar-tools">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => dispatch({ type: "replace", traits: randomTraits() })}
          >
            Random
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => dispatch({ type: "reset" })}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-dark"
            disabled={!canUndo}
            onClick={() => dispatch({ type: "undo" })}
          >
            Undo
          </button>
        </div>

        <div
          ref={tabs}
          className="avatar-tabs font-narrow"
          role="tablist"
          aria-label="Avatar layers"
          onKeyDown={onTabKey}
        >
          {categories.map((category) => {
            const selected = category.id === active.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`avatar-tab-${category.id}`}
                aria-selected={selected}
                aria-controls="avatar-options"
                tabIndex={selected ? 0 : -1}
                className="avatar-tab"
                data-set={traits[category.id] ? "" : undefined}
                onClick={() => setActiveId(category.id)}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div
          id="avatar-options"
          role="tabpanel"
          aria-labelledby={`avatar-tab-${active.id}`}
          className="avatar-options"
        >
          {active.optional && (
            <button
              type="button"
              className="avatar-option avatar-option-none font-narrow"
              aria-pressed={traits[active.id] === null}
              onClick={() =>
                dispatch({ type: "set", category: active.id, item: null })
              }
            >
              None
            </button>
          )}
          {active.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="avatar-option"
              aria-pressed={traits[active.id] === item.id}
              disabled={!isItemAllowed(item, raceId)}
              title={item.label}
              onClick={() =>
                dispatch({ type: "set", category: active.id, item: item.id })
              }
            >
              <Image
                src={item.thumb}
                alt={item.label}
                width={128}
                height={128}
                unoptimized
              />
            </button>
          ))}
        </div>
        {coveredBy && (
          <p className="avatar-note font-narrow text-parch2">
            Hidden while wearing {coveredBy.label}.
          </p>
        )}

        <div className="avatar-actions">
          <button
            type="button"
            className="btn btn-gold"
            onClick={() => void download(1024)}
          >
            Download PNG
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => void download(400)}
          >
            400 × 400
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => void share()}
          >
            Share on X
          </button>
        </div>
        <p className="avatar-status font-narrow text-parch2" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}
