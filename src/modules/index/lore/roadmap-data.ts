/** Whether a roadmap phase is the active one or still sealed. */
export type RoadmapStatus = "in-progress" | "locked";

/**
 * One stop on the roadmap map. `position` is a percentage of the map's width
 * and height so markers and the route stay anchored while the world scales.
 */
export interface RoadmapPhase {
  id: string;
  /** Short numeral shown on the marker itself, where the full label will not fit. */
  mark: string;
  numeral: string;
  title: string;
  status: RoadmapStatus;
  description: string;
  position: { x: number; y: number };
}

/** Player-facing label for each status, shared by the legend and tooltips. */
export const STATUS_LABEL: Record<RoadmapStatus, string> = {
  "in-progress": "In progress",
  locked: "Locked",
};

/** Intrinsic map size; the SVG layers and the route share this coordinate space. */
export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 625;

/**
 * Single source of truth for roadmap copy and marker placement. Descriptions
 * are thematic placeholders, so edit them here without touching the map.
 */
export const ROADMAP_PHASES: readonly RoadmapPhase[] = [
  {
    id: "awakening",
    mark: "I",
    numeral: "Phase I",
    title: "The Awakening",
    status: "in-progress",
    description:
      "A coin is minted, a sigil is drawn, and the guild gathers around the first campfire. Every legend needs a spawn point.",
    position: { x: 25.5, y: 63.2 },
  },
  {
    id: "expansion",
    mark: "II",
    numeral: "Phase II",
    title: "The Expansion",
    status: "locked",
    description:
      "Word travels along the trade roads and new banners rise in distant taverns as the guild grows past its first borders.",
    position: { x: 46, y: 27.2 },
  },
  {
    id: "ascension",
    mark: "III",
    numeral: "Phase III",
    title: "The Ascension",
    status: "locked",
    description:
      "Beyond the mountain passes a greater trial waits. Only a united guild will climb to the rarest heights.",
    position: { x: 70, y: 60.8 },
  },
  {
    id: "eternal-realm",
    mark: "IV",
    numeral: "Phase IV",
    title: "The Eternal Realm",
    status: "locked",
    description:
      "A distant shore half hidden in mist. Nobody has returned to say what waits there.",
    position: { x: 85, y: 22.4 },
  },
];
