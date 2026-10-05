"use client";

import { useEffect, useRef, useState } from "react";
import { createAvatarRenderer } from "./avatar-canvas";
import { normalizeTraits, visibleItems } from "./avatar-code";
import {
  categories,
  gallery,
  RACE_CATEGORY,
  type AvatarTraits,
  type GalleryEntry,
} from "./avatar.config";

const PREVIEW_COUNT = 8;
const CARD_SIZE = 256;

function raceLabel(traits: AvatarTraits): string {
  const race = categories.find((category) => category.id === RACE_CATEGORY);
  const item = race?.items.find((entry) => entry.id === traits[RACE_CATEGORY]);
  return item?.label ?? "";
}

/**
 * One example avatar, composed from the same layers as the generator so the
 * gallery can never drift from the artwork.
 */
function GalleryCard({
  entry,
  onPick,
}: {
  entry: GalleryEntry;
  onPick: (traits: AvatarTraits) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const traits = normalizeTraits(entry.traits);
  const race = raceLabel(traits);

  useEffect(() => {
    if (!canvas.current) return;
    const renderer = createAvatarRenderer(canvas.current);
    void renderer.render(visibleItems(normalizeTraits(entry.traits)));
    return () => renderer.dispose();
  }, [entry]);

  return (
    <li>
      <button
        type="button"
        className="avatar-card"
        onClick={() => onPick(traits)}
        aria-label={`Use ${entry.name}, ${race}, as base`}
      >
        <canvas ref={canvas} width={CARD_SIZE} height={CARD_SIZE} aria-hidden />
        <span className="avatar-card-caption font-narrow">
          <strong>{entry.name}</strong>
          <span>{race}</span>
        </span>
      </button>
    </li>
  );
}

/** Retro window of example avatars; picking one loads it into the generator. */
export function AvatarGallery({
  onPick,
}: {
  onPick: (traits: AvatarTraits) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const entries = expanded ? gallery : gallery.slice(0, PREVIEW_COUNT);

  return (
    <div className="avatar-window avatar-gallery">
      <div className="avatar-titlebar font-narrow">
        <span>WOWOW.EXE</span>
        <span className="avatar-titlebar-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="avatar-window-body">
        <p className="avatar-label font-narrow">Guild Roster</p>
        <h3 className="font-friz text-parch">Pick a face. Make it yours.</h3>
        <p className="avatar-copy text-parch2">
          Start from one of these, then swap every layer in the forge.
        </p>
        <ul className="avatar-grid">
          {entries.map((entry) => (
            <GalleryCard key={entry.id} entry={entry} onPick={onPick} />
          ))}
        </ul>
        {gallery.length > PREVIEW_COUNT && (
          <button
            type="button"
            className="btn btn-dark avatar-more"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show fewer" : "View all"}
          </button>
        )}
      </div>
    </div>
  );
}
