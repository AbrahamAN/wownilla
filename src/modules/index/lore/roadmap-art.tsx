import type { CSSProperties } from "react";
import {
  ROADMAP_PHASES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "@/modules/index/lore/roadmap-data";
import type { RoadmapStatus } from "@/modules/index/lore/roadmap-data";

/*
 * Original cartography for the roadmap world. Every shape is drawn here, so no
 * third-party map art is involved. Layers are separate SVGs because the map
 * client component stacks them at different depths for the 3D effect.
 */

const VIEW_BOX = `0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`;

/** Continents and islands, shared by the shadow, shallows and land layers. */
const LANDMASSES = [
  "M90 330C80 270 120 215 185 200C230 160 300 170 330 215C380 230 410 280 395 340C420 390 400 450 350 480C330 530 270 565 215 545C170 560 120 520 125 470C85 440 70 380 90 330Z",
  "M370 120C395 85 460 80 500 105C545 110 570 150 545 185C560 220 520 250 480 240C440 265 390 245 385 205C355 185 350 145 370 120Z",
  "M560 340C580 290 650 280 700 300C760 290 830 320 840 380C880 420 860 490 800 510C770 560 690 570 640 540C590 545 545 500 565 455C530 420 535 370 560 340Z",
  "M775 95C800 65 860 62 895 90C925 110 920 160 885 180C850 205 800 195 782 160C765 140 762 112 775 95Z",
  "M60 500C85 485 115 495 112 520C105 545 70 550 58 530Z",
  "M610 150C640 135 675 150 668 180C655 205 620 202 606 182Z",
  "M920 470C945 455 975 470 968 498C955 520 925 515 915 495Z",
] as const;

/** Muted green regions that break up the ochre land. */
const MEADOWS = [
  { cx: 290, cy: 330, rx: 62, ry: 44, rotate: -14 },
  { cx: 185, cy: 470, rx: 50, ry: 28, rotate: 8 },
  { cx: 500, cy: 150, rx: 32, ry: 20, rotate: -10 },
  { cx: 735, cy: 470, rx: 56, ry: 32, rotate: 6 },
  { cx: 832, cy: 168, rx: 26, ry: 14, rotate: 0 },
] as const;

/** Mountain peaks as [x, y, scale]; hand-placed so they avoid the markers. */
const PEAKS = [
  [150, 300, 1.2],
  [178, 288, 1],
  [132, 322, 0.85],
  [322, 262, 1.1],
  [348, 278, 0.8],
  [205, 478, 0.9],
  [230, 490, 0.7],
  [418, 140, 1],
  [524, 172, 0.9],
  [622, 332, 1.2],
  [646, 320, 0.85],
  [792, 424, 1],
  [762, 474, 0.8],
  [612, 502, 0.9],
  [818, 112, 1],
  [878, 142, 0.8],
] as const;

const TREES = [
  [262, 346],
  [276, 358],
  [304, 340],
  [318, 322],
  [178, 462],
  [196, 476],
  [708, 466],
  [726, 484],
  [752, 460],
  [492, 160],
] as const;

/** Sea sheet: pigment wash, wave marks, graticule and the cartouche border. */
export function OceanLayer() {
  return (
    <svg viewBox={VIEW_BOX} className="rm-svg" aria-hidden="true">
      <defs>
        <radialGradient id="rm-sea" cx="50%" cy="48%" r="75%">
          <stop offset="0" stopColor="#5f7f80" />
          <stop offset="0.6" stopColor="#47625f" />
          <stop offset="1" stopColor="#2c403d" />
        </radialGradient>
        <pattern
          id="rm-waves"
          width="46"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M4 14q7-8 14 0t14 0"
            fill="none"
            stroke="#a9c4bd"
            strokeOpacity="0.22"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width={WORLD_WIDTH} height={WORLD_HEIGHT} fill="url(#rm-sea)" />
      <rect width={WORLD_WIDTH} height={WORLD_HEIGHT} fill="url(#rm-waves)" />
      <g
        fill="none"
        stroke="#d8c48a"
        strokeOpacity="0.14"
        strokeDasharray="3 9"
      >
        {[125, 250, 375, 500].map((y) => (
          <path key={`h${y}`} d={`M0 ${y}H${WORLD_WIDTH}`} />
        ))}
        {[200, 400, 600, 800].map((x) => (
          <path key={`v${x}`} d={`M${x} 0V${WORLD_HEIGHT}`} />
        ))}
      </g>
      <rect
        x="10"
        y="10"
        width={WORLD_WIDTH - 20}
        height={WORLD_HEIGHT - 20}
        fill="none"
        stroke="#3a2718"
        strokeWidth="5"
      />
      <rect
        x="18"
        y="18"
        width={WORLD_WIDTH - 36}
        height={WORLD_HEIGHT - 36}
        fill="none"
        stroke="#d4af37"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <CompassRose x={908} y={558} />
    </svg>
  );
}

/** Eight-point compass drawn in the lower corner of the sheet. */
function CompassRose({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity="0.85">
      <circle r="38" fill="#1a120b" fillOpacity="0.45" stroke="#d4af37" />
      <circle r="30" fill="none" stroke="#b88632" strokeOpacity="0.5" />
      <path d="M0-34L7-7L34 0L7 7L0 34L-7 7L-34 0L-7-7Z" fill="#d4af37" />
      <path d="M0-34L7-7L0 0Z" fill="#f6e6a8" />
      <path
        d="M0-22L5 0L0 22L-5 0Z"
        transform="rotate(45)"
        fill="#8e6524"
        opacity="0.9"
      />
      <text
        y="-42"
        textAnchor="middle"
        fontSize="13"
        fill="#e8d7a8"
        fontFamily="serif"
      >
        N
      </text>
    </g>
  );
}

/** Blurred dark copy of the land, stacked beneath it to fake cast depth. */
export function ShadowLayer() {
  return (
    <svg viewBox={VIEW_BOX} className="rm-svg rm-shadow" aria-hidden="true">
      {LANDMASSES.map((d) => (
        <path key={d} d={d} fill="#0b0a08" fillOpacity="0.7" />
      ))}
    </svg>
  );
}

/** Continents with shallows, parchment-gold fill and olive meadows. */
export function LandLayer() {
  return (
    <svg viewBox={VIEW_BOX} className="rm-svg" aria-hidden="true">
      <defs>
        <linearGradient id="rm-land" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#e4c780" />
          <stop offset="0.5" stopColor="#c99a45" />
          <stop offset="1" stopColor="#8e6524" />
        </linearGradient>
        <radialGradient id="rm-meadow">
          <stop offset="0" stopColor="#7d7d45" stopOpacity="0.9" />
          <stop offset="1" stopColor="#6a6a3a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {LANDMASSES.map((d) => (
        <path
          key={`s${d}`}
          d={d}
          fill="none"
          stroke="#9fc2b6"
          strokeOpacity="0.32"
          strokeWidth="16"
          strokeLinejoin="round"
        />
      ))}
      {LANDMASSES.map((d) => (
        <path
          key={d}
          d={d}
          fill="url(#rm-land)"
          stroke="#3a2718"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      ))}
      {MEADOWS.map(({ cx, cy, rx, ry, rotate }) => (
        <ellipse
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          transform={`rotate(${rotate} ${cx} ${cy})`}
          fill="url(#rm-meadow)"
        />
      ))}
    </svg>
  );
}

/** Mountains and tree clumps that stand above the land plane. */
export function ReliefLayer() {
  return (
    <svg viewBox={VIEW_BOX} className="rm-svg rm-relief" aria-hidden="true">
      {PEAKS.map(([x, y, s]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-17 11L0-22L17 11Z" fill="#3a2718" fillOpacity="0.5" />
          <path
            d="M-15 9L0-20L2 9Z"
            fill="#ecd08a"
            stroke="#3a2718"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M0-20L15 9L2 9Z"
            fill="#7a5223"
            stroke="#3a2718"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M-5-8L0-20L5-8L1-11Z" fill="#fff4cf" fillOpacity="0.85" />
        </g>
      ))}
      {TREES.map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <ellipse cy="5" rx="7" ry="2.5" fill="#000" fillOpacity="0.35" />
          <path
            d="M0-11L7 3H-7Z"
            fill="#5b6034"
            stroke="#2f2a16"
            strokeWidth="1.2"
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Exploration route through every phase in order. It is derived from the phase
 * positions, so moving a marker in the data file moves the road with it.
 */
function routePath() {
  let path = "";
  let previous: { x: number; y: number } | undefined;
  for (const { position } of ROADMAP_PHASES) {
    const x = Math.round((position.x / 100) * WORLD_WIDTH);
    const y = Math.round((position.y / 100) * WORLD_HEIGHT);
    if (previous) {
      const middle = Math.round((previous.x + x) / 2);
      path += `C${middle} ${previous.y} ${middle} ${y} ${x} ${y}`;
    } else {
      path = `M${x} ${y}`;
    }
    previous = { x, y };
  }
  return path;
}

const ROUTE = routePath();

/** Golden road linking the markers, with a glint that travels along it. */
export function RouteLayer() {
  return (
    <svg viewBox={VIEW_BOX} className="rm-svg" aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        <path d={ROUTE} stroke="#1a120b" strokeOpacity="0.55" strokeWidth="9" />
        <path
          d={ROUTE}
          stroke="#f6e6a8"
          strokeOpacity="0.16"
          strokeWidth="14"
        />
        <path
          d={ROUTE}
          stroke="#e8c55a"
          strokeWidth="3.4"
          strokeDasharray="1 13"
        />
        <path
          className="rm-glint"
          d={ROUTE}
          pathLength="100"
          stroke="#fff4cf"
          strokeWidth="4"
          strokeDasharray="3 97"
        />
      </g>
    </svg>
  );
}

/** Padlock glyph shared by sealed markers and their tooltips. */
export function LockGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="3" y="7" width="10" height="7.5" rx="1.4" fill="currentColor" />
      <circle cx="8" cy="10.4" r="1.2" fill="#0b0a08" />
    </svg>
  );
}

/**
 * Map pin for one phase. Colors come from CSS variables on the marker, so the
 * same drawing serves the lit and the sealed state.
 */
export function PinArt({ status }: { status: RoadmapStatus }) {
  return (
    <svg viewBox="0 0 44 58" className="rm-pin" aria-hidden="true">
      <ellipse cx="22" cy="55" rx="9" ry="2.6" fill="#000" fillOpacity="0.45" />
      <path
        className="rm-pin-body"
        d="M22 54C22 54 5 33 5 20a17 17 0 0 1 34 0c0 13-17 34-17 34Z"
      />
      <path
        className="rm-pin-light"
        d="M22 5.5A14.5 14.5 0 0 0 7.5 20c0 5 2.6 11 5.8 16.6C10.5 29 11 12 22 5.5Z"
      />
      <circle className="rm-pin-core" cx="22" cy="20" r="10.5" />
      {status === "in-progress" ? (
        <path
          className="rm-pin-glyph"
          d="M22 11.5l2.4 6.1 6.1 2.4-6.1 2.4L22 28.5l-2.4-6.1-6.1-2.4 6.1-2.4Z"
        />
      ) : (
        <g className="rm-pin-glyph" transform="translate(14.5 12)">
          <path
            d="M4.7 6.6V4.7a2.8 2.8 0 0 1 5.6 0v1.9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect x="2.8" y="6.6" width="9.4" height="7" rx="1.3" />
        </g>
      )}
    </svg>
  );
}

/** Depth bands for clouds: back sits under the world, front floats above it. */
export type CloudLayer = "back" | "mid" | "front";

interface Cloud {
  layer: CloudLayer;
  /** Position and width as percentages of the map. */
  x: number;
  y: number;
  width: number;
  opacity: number;
  /** Seconds for one drift; the sign of `drift` sets the direction. */
  duration: number;
  drift: number;
  delay: number;
}

const CLOUDS: readonly Cloud[] = [
  {
    layer: "back",
    x: -14,
    y: 6,
    width: 34,
    opacity: 0.8,
    duration: 90,
    drift: 12,
    delay: -20,
  },
  {
    layer: "back",
    x: 70,
    y: -8,
    width: 40,
    opacity: 0.75,
    duration: 110,
    drift: -14,
    delay: -55,
  },
  {
    layer: "back",
    x: -10,
    y: 70,
    width: 38,
    opacity: 0.8,
    duration: 100,
    drift: -10,
    delay: -35,
  },
  {
    layer: "back",
    x: 78,
    y: 74,
    width: 36,
    opacity: 0.75,
    duration: 95,
    drift: 12,
    delay: -70,
  },
  {
    layer: "mid",
    x: 2,
    y: -4,
    width: 26,
    opacity: 0.6,
    duration: 70,
    drift: 20,
    delay: -10,
  },
  {
    layer: "mid",
    x: 56,
    y: 40,
    width: 22,
    opacity: 0.45,
    duration: 80,
    drift: -18,
    delay: -40,
  },
  {
    layer: "mid",
    x: 30,
    y: 84,
    width: 28,
    opacity: 0.55,
    duration: 75,
    drift: 16,
    delay: -25,
  },
  {
    layer: "mid",
    x: 88,
    y: 46,
    width: 22,
    opacity: 0.5,
    duration: 85,
    drift: -16,
    delay: -60,
  },
  {
    layer: "front",
    x: -12,
    y: 36,
    width: 30,
    opacity: 0.42,
    duration: 60,
    drift: 28,
    delay: -15,
  },
  {
    layer: "front",
    x: 84,
    y: 82,
    width: 32,
    opacity: 0.4,
    duration: 65,
    drift: -26,
    delay: -45,
  },
  {
    layer: "front",
    x: 44,
    y: -12,
    width: 26,
    opacity: 0.35,
    duration: 72,
    drift: 24,
    delay: -30,
  },
];

/**
 * Soft cream puffs for one depth band. They are plain gradients rather than
 * filtered SVG, which keeps many drifting clouds cheap to composite.
 */
export function CloudBand({ layer }: { layer: CloudLayer }) {
  return (
    <>
      {CLOUDS.filter((cloud) => cloud.layer === layer).map((cloud) => {
        const style: CSSProperties & {
          "--drift": string;
          "--o": number;
        } = {
          left: `${cloud.x}%`,
          top: `${cloud.y}%`,
          width: `${cloud.width}%`,
          "--drift": `${cloud.drift}%`,
          "--o": cloud.opacity,
          animationDuration: `${cloud.duration}s`,
          animationDelay: `${cloud.delay}s`,
        };
        return (
          <span
            key={`${cloud.x}-${cloud.y}`}
            className="rm-cloud"
            style={style}
          />
        );
      })}
    </>
  );
}

/**
 * Puffs of the cloud bank that hides the world before it is revealed, as
 * [x %, y %, width %, exit x %, exit y %, delay s]. Left puffs leave left and
 * right puffs leave right, so the bank parts down the middle.
 */
const VEIL = [
  [-12, -6, 62, -90, -20, 0.1],
  [44, -10, 66, 90, -24, 0],
  [-18, 22, 70, -110, 0, 0.25],
  [42, 18, 74, 110, -4, 0.15],
  [14, 6, 60, -60, -50, 0.35],
  [-14, 50, 66, -100, 22, 0.3],
  [46, 48, 68, 100, 26, 0.2],
  [18, 38, 64, 70, 40, 0.45],
  [-6, 72, 60, -80, 50, 0.4],
  [48, 74, 62, 80, 54, 0.5],
] as const;

/** Cloud bank that covers the map and parts when the section is entered. */
export function CloudVeil() {
  return (
    <div className="rm-veil" aria-hidden="true">
      {VEIL.map(([x, y, width, dx, dy, delay]) => {
        const style: CSSProperties & { "--dx": string; "--dy": string } = {
          left: `${x}%`,
          top: `${y}%`,
          width: `${width}%`,
          "--dx": `${dx}%`,
          "--dy": `${dy}%`,
          animationDelay: `${delay}s`,
        };
        return (
          <span key={`${x}-${y}`} className="rm-veil-puff" style={style} />
        );
      })}
    </div>
  );
}
