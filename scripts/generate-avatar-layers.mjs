/**
 * Paints the avatar forge layers in a heroic fantasy-portrait style and
 * rasterizes them into `public/avatar`: realistic proportions, a warm key
 * light with a cool rim light, soft shading and a brushy grain. Every layer
 * shares the same face anchors (eyes, mouth, crown of the head) and the same
 * brush distortion, so any combination lines up on any race.
 *
 * Uses the `sharp` that Next.js installs; this script is not part of the build.
 *
 * Run: node scripts/generate-avatar-layers.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "avatar",
);

/** Shared face anchors, in a 1024 square whose x axis is centered on the face. */
const EYE_X = 80;
/** Eyes are drawn at portrait size, then enlarged around their own center. */
const EYE_SCALE = 1.3;
const EYE_Y = 438;
const MOUTH_Y = 600;

const INK = "#120a1c";
const SHADOW = "#150b26";
const WARM = "#fff1d0";
const RIM = "#9fdcff";
const GOLD = "#e0a528";
const STEEL = "#8f9bab";
const IVORY = "#efe2bd";
const AUBURN = "#a3451a";
const GREY = "#bdb9b0";
const WOOD = "#6e4322";
const CORAL = "#f2683a";
const CREAM = "#eadfae";

let uid = 0;
const nextId = () => `i${++uid}`;

/** Gradient, filter and clip definitions collected while one image is drawn. */
let defs = [];
const blurIds = new Map();
function def(make) {
  const id = nextId();
  defs.push(make(id));
  return id;
}

const channels = (color) =>
  [1, 3, 5].map((start) => Number.parseInt(color.slice(start, start + 2), 16));

/** Blends two hex colors; lights and shadows derive from one base tone. */
function mix(from, to, amount) {
  const target = channels(to);
  return `#${channels(from)
    .map((value, index) =>
      Math.round(value + (target[index] - value) * amount)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

const stopList = (stops) =>
  stops
    .map(
      ([offset, color, alpha = 1]) =>
        `<stop offset="${offset}" stop-color="${color}" stop-opacity="${alpha}"/>`,
    )
    .join("");
const linear = (x1, y1, x2, y2, stops) =>
  `url(#${def((id) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopList(stops)}</linearGradient>`)})`;
const radial = (cx, cy, r, stops) =>
  `url(#${def((id) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">${stopList(stops)}</radialGradient>`)})`;

/** Softens shapes into painted shading; one filter per radius per image. */
function blur(amount, content) {
  let id = blurIds.get(amount);
  if (!id) {
    id = def(
      (fresh) =>
        `<filter id="${fresh}" filterUnits="userSpaceOnUse" x="-580" y="-60" width="1160" height="1150"><feGaussianBlur stdDeviation="${amount}"/></filter>`,
    );
    blurIds.set(amount, id);
  }
  return `<g filter="url(#${id})">${content}</g>`;
}

const clipTo = (d, content) =>
  `<g clip-path="url(#${def((id) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`)})">${content}</g>`;

const P = (d, fill, opacity = 1) =>
  `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
const E = (cx, cy, rx, ry, fill, opacity = 1, turn = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}"${turn ? ` transform="rotate(${turn} ${cx} ${cy})"` : ""}/>`;
const S = (d, stroke, width, opacity = 1) =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;

/** Draws a right-hand shape and its mirror image across the face. */
const both = (shape) => `${shape}<g transform="scale(-1 1)">${shape}</g>`;

/**
 * Closes a path that is symmetric across the face from its right half:
 * `segments` run from `start` down the right side, as cubic (6 numbers) or
 * straight (2 numbers) pieces, and are mirrored back up the left.
 */
function symmetric([startX, startY], segments) {
  const points = [[startX, startY], ...segments.map((s) => s.slice(-2))];
  let d = `M${startX} ${startY}`;
  for (const s of segments) d += (s.length === 2 ? "L" : "C") + s.join(" ");
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    const [x, y] = points[i];
    d +=
      s.length === 2
        ? `L${-x} ${y}`
        : `C${-s[2]} ${s[3]} ${-s[0]} ${s[1]} ${-x} ${y}`;
  }
  return `${d}Z`;
}

/** Key-lit fill: warm light from the upper left falling into cool shadow. */
const lit = (color, [x1, y1, x2, y2]) =>
  linear(x1, y1, x2, y2, [
    [0, mix(color, WARM, 0.4)],
    [0.5, color],
    [1, mix(color, SHADOW, 0.6)],
  ]);

/** Cool back light hugging the right edge of a shape. */
const rimLight = (d, from, to, width = 14) =>
  clipTo(
    d,
    blur(
      3,
      S(
        d,
        linear(from, 0, to, 0, [
          [0, RIM, 0],
          [1, RIM, 0.85],
        ]),
        width,
      ),
    ),
  );

/** One painted form: lit fill, soft inner shading clipped to it, rim light. */
const form = (d, color, box, inner = "", rim = [0, 260]) =>
  P(d, lit(color, box)) +
  (inner ? clipTo(d, inner) : "") +
  (rim ? rimLight(d, rim[0], rim[1]) : "");

/** Hair, fur and beards: a form with light and dark strands brushed over it. */
const hairMass = (d, color, box, light = "", dark = "", rim = [0, 240]) =>
  form(
    d,
    color,
    box,
    (dark ? S(dark, mix(color, SHADOW, 0.6), 6, 0.45) : "") +
      (light ? blur(1, S(light, mix(color, WARM, 0.5), 5, 0.55)) : ""),
    rim,
  );

const headPath = ({ T, W, K, J, C, CW }) =>
  symmetric(
    [0, T],
    [
      [W * 0.62, T, W, T + 85, W, 375],
      [W, 440, K, 470, K, 520],
      [K, 570, J, 595, J * 0.97, 630],
      [J * 0.85, 630 + (C - 630) * 0.7, CW, C, 0, C],
    ],
  );

const bodyPath = ({ nw, sw }) =>
  symmetric(
    [0, 620],
    [
      [nw, 620],
      [nw, 735],
      [nw, 775, nw + 40, 790, nw + 110, 805],
      [sw * 0.8, 830, sw, 900, sw, 1045],
      [0, 1045],
    ],
  );

function nose(c, w, tip = 540, tint = c.base) {
  return (
    blur(
      7,
      P(
        `M${w * 0.3} 436L${w * 1.05} ${tip - 6}L${w * 0.2} ${tip + 8}Z`,
        c.deep,
        0.5,
      ),
    ) +
    blur(5, S(`M-5 440Q-10 500 -3 ${tip - 22}`, c.light, 11, 0.65)) +
    blur(
      3,
      E(0, tip - 6, w * 0.78, w * 0.56, mix(tint, c.light, 0.25), 0.95) +
        both(E(w * 0.82, tip, w * 0.34, w * 0.3, mix(tint, c.shade, 0.4), 0.9)),
    ) +
    both(E(w * 0.6, tip + 6, w * 0.3, w * 0.19, c.deep, 0.9)) +
    blur(3, E(-w * 0.22, tip - 14, w * 0.3, w * 0.18, "#ffffff", 0.55))
  );
}

const MUSTACHE = symmetric(
  [0, 560],
  [
    [46, 536, 122, 544, 168, 622],
    [116, 612, 56, 630, 0, 600],
  ],
);
const mustache = (color) =>
  hairMass(
    MUSTACHE,
    color,
    [-160, 540, 160, 620],
    "M-136 596Q-80 560 -12 572M14 572Q80 560 138 598",
    "M-120 604Q-70 580 -8 584M10 584Q70 580 122 606",
    [40, 160],
  );

const BROW = "M22 396Q76 356 164 384Q174 400 160 412Q88 388 26 418Z";
const brows = (color) =>
  both(
    P(BROW, lit(color, [20, 370, 160, 430])) +
      S("M40 396Q88 372 152 392", mix(color, WARM, 0.45), 4, 0.6),
  );

/**
 * Races, in the order of the `race` category in `avatar.config.ts`. `back` is
 * drawn behind the head, `torso` and `face` are shading clipped to the body
 * and head, and `front` sits on top. `tones` are the three skin options.
 */
const RACES = [
  {
    // Dwarf: broad face, bulbous nose, bushy brows and a braided mustache.
    tones: ["#e2b08a", "#c4875c", "#7d4d33"],
    head: { T: 228, W: 182, K: 188, J: 158, C: 664, CW: 86 },
    body: { nw: 128, sw: 430 },
    back: (c, { K }) =>
      both(
        P(
          `M${K - 8} 440C${K + 40} 420 ${K + 52} 470 ${K + 40} 510C${K + 30} 540 ${K + 5} 540 ${K - 8} 520Z`,
          lit(c.base, [K, 420, K + 60, 540]),
        ) + blur(4, E(K + 18, 482, 11, 24, c.deep, 0.65)),
      ),
    face: () => blur(12, both(E(118, 532, 42, 24, "#d2452c", 0.3))),
    front: (c) =>
      nose(c, 44, 540, mix(c.base, "#d2452c", 0.3)) +
      brows(AUBURN) +
      both(
        [628, 662, 694]
          .map((y, index) =>
            E(
              156,
              y,
              20,
              19,
              index % 2
                ? mix(AUBURN, SHADOW, 0.3)
                : lit(AUBURN, [136, y - 20, 176, y + 20]),
            ),
          )
          .join("") +
          P("M142 726L170 726L156 774Z", mix(AUBURN, SHADOW, 0.2)) +
          `<rect x="137" y="710" width="38" height="17" rx="5" fill="${lit(GOLD, [137, 708, 175, 730])}"/>`,
      ) +
      mustache(AUBURN),
  },
  {
    // Orc: green, massive jaw, pointed ears, heavy brow ridge and tusks.
    tones: ["#8fb04a", "#5f8a35", "#3a5c2c"],
    head: { T: 215, W: 176, K: 192, J: 188, C: 700, CW: 112 },
    body: { nw: 152, sw: 480 },
    back: (c, { K }) =>
      both(
        P(
          `M${K - 12} 425L${K + 118} 352Q${K + 70} 470 ${K - 8} 525Z`,
          lit(c.base, [K - 10, 350, K + 120, 520]),
        ) +
          P(
            `M${K + 4} 444L${K + 80} 396Q${K + 48} 462 ${K + 4} 498Z`,
            c.deep,
            0.6,
          ) +
          S(`M${K - 6} 428L${K + 114} 356`, c.light, 5, 0.5),
      ) +
      `<circle cx="${-(K + 46)}" cy="486" r="18" fill="none" stroke="${lit(GOLD, [-K - 70, 466, -K - 26, 506])}" stroke-width="8"/>`,
    face: (c) =>
      blur(10, E(0, 656, 96, 26, c.light, 0.35)) +
      blur(8, both(E(84, 398, 70, 16, c.light, 0.35, -8))),
    front: (c) =>
      nose(c, 40, 532) +
      both(P("M14 408Q74 368 174 376L178 404Q88 392 20 430Z", c.deep, 0.9)) +
      S(
        "M-152 352L-120 414M-112 500L-100 548",
        mix(c.base, "#f0c8b8", 0.55),
        6,
        0.6,
      ) +
      S("M-74 640Q0 664 74 640", c.deep, 8, 0.5) +
      both(
        P(
          "M50 630Q46 566 84 518Q104 574 92 634Z",
          linear(46, 520, 104, 630, [
            [0, "#fffbe8"],
            [0.6, IVORY],
            [1, "#a8935c"],
          ]),
        ) + S("M84 530Q96 580 90 628", "#8a7748", 5, 0.5),
      ),
  },
  {
    // Murloc: teal fish-folk with a spined crest, side fins and bulging eyes.
    tones: ["#5fc9b0", "#2a9a8f", "#1c5f73"],
    head: { T: 228, W: 196, K: 206, J: 150, C: 652, CW: 70 },
    body: { nw: 58, sw: 240 },
    lips: false,
    back: (c, { K }) => {
      const crest = "M-92 306L-64 140L-26 240L4 96L38 240L72 152L96 306Z";
      const fin = `M${K - 24} 418L${K + 116} 330L${K + 76} 420L${K + 132} 452L${K + 76} 484L${K + 106} 554L${K - 24} 500Z`;
      return (
        form(
          crest,
          CORAL,
          [-90, 100, 100, 300],
          S(
            "M-50 290L-60 180M2 290L4 140M54 290L68 190",
            mix(CORAL, SHADOW, 0.5),
            6,
            0.6,
          ),
          [0, 100],
        ) +
        both(
          form(
            fin,
            CORAL,
            [K, 330, K + 130, 550],
            S(
              `M${K} 440L${K + 76} 398M${K} 458L${K + 90} 452M${K} 476L${K + 70} 506`,
              mix(CORAL, SHADOW, 0.5),
              6,
              0.6,
            ),
            [K, K + 130],
          ),
        )
      );
    },
    torso: () => blur(6, E(0, 1010, 122, 140, CREAM, 0.95)),
    face: (c) =>
      blur(5, E(0, 672, 220, 108, CREAM, 0.95)) +
      blur(
        6,
        E(118, 292, 20, 18, c.deep, 0.4) +
          E(160, 350, 12, 11, c.deep, 0.4) +
          E(70, 268, 10, 9, c.deep, 0.4),
      ),
    front: (c) =>
      both(
        `<circle cx="${EYE_X}" cy="${EYE_Y}" r="64" fill="${radial(
          EYE_X - 14,
          EYE_Y - 18,
          80,
          [
            [0, c.light],
            [0.6, c.base],
            [1, c.shade],
          ],
        )}"/>` +
          S(
            `M${EYE_X - 52} ${EYE_Y + 38}Q${EYE_X} ${EYE_Y + 78} ${EYE_X + 52} ${EYE_Y + 38}`,
            c.deep,
            7,
            0.45,
          ),
      ) + both(E(12, 540, 5, 9, c.deep, 0.9)),
  },
  {
    // Night elf: violet, long swept ears, long pale brows, cheek markings, moon.
    tones: ["#c9a3e8", "#9670cf", "#5a4599"],
    head: { T: 210, W: 160, K: 158, J: 118, C: 700, CW: 34 },
    body: { nw: 64, sw: 300 },
    back: (c, { K }) =>
      both(
        P(
          `M${K - 18} 432C${K + 70} 400 ${K + 170} 330 ${K + 262} 236C${K + 190} 400 ${K + 90} 500 ${K - 12} 524Z`,
          lit(c.base, [K, 240, K + 200, 520]),
        ) +
          P(
            `M${K + 4} 452C${K + 70} 422 ${K + 140} 366 ${K + 206} 300C${K + 150} 400 ${K + 76} 470 ${K + 4} 498Z`,
            c.deep,
            0.6,
          ) +
          S(
            `M${K - 6} 434C${K + 70} 402 ${K + 168} 334 ${K + 256} 244`,
            c.light,
            5,
            0.6,
          ),
      ),
    front: (c, { K }) => {
      const moon = def(
        (id) =>
          `<clipPath id="${id}"><path clip-rule="evenodd" d="M-60 250H60V370H-60ZM-8 306a20 20 0 1 0 40 0a20 20 0 1 0 -40 0Z"/></clipPath>`,
      );
      return (
        nose(c, 22) +
        both(
          P(
            `M22 398Q84 370 156 382Q236 370 ${K + 150} 310Q244 392 156 400Q84 392 26 414Z`,
            linear(20, 390, K + 150, 320, [
              [0, "#ffffff"],
              [1, "#b9c8f5"],
            ]),
          ),
        ) +
        both(
          P("M150 478Q112 540 136 620Q84 556 150 478Z", c.deep, 0.75) +
            P("M108 486Q84 530 98 586Q62 540 108 486Z", c.deep, 0.75),
        ) +
        blur(
          8,
          `<circle cx="0" cy="312" r="30" fill="#fff3b0" opacity=".5"/>`,
        ) +
        `<circle cx="0" cy="312" r="25" fill="#fff6c8" clip-path="url(#${moon})"/>`
      );
    },
  },
];

/** One race in one skin tone: lit body and head plus the race's own features. */
function figure(race, tone) {
  const base = race.tones[tone];
  const c = {
    base,
    light: mix(base, WARM, 0.42),
    shade: mix(base, SHADOW, 0.45),
    deep: mix(base, SHADOW, 0.78),
  };
  const h = race.head;
  const { nw, sw } = race.body;
  const head = headPath(h);
  return (
    (race.back?.(c, h) ?? "") +
    form(
      bodyPath(race.body),
      c.base,
      [-sw, 640, sw, 1040],
      blur(22, E(0, h.C + 30, nw + 70, 92, c.deep, 0.85)) +
        blur(
          14,
          both(
            S(
              `M${nw * 0.5} 802Q${nw + 60} 814 ${sw * 0.6} 852`,
              c.light,
              14,
              0.4,
            ),
          ),
        ) +
        blur(18, E(0, 965, nw * 0.5, 110, c.deep, 0.35)) +
        (race.torso?.(c) ?? ""),
      [nw * 0.4, sw],
    ) +
    P(head, lit(c.base, [-h.K, h.T, h.K, h.C])) +
    clipTo(
      head,
      blur(
        18,
        both(E(EYE_X, EYE_Y - 2, 62, 34, c.deep, 0.6)) +
          E(0, 556, 46, 14, c.deep, 0.45) +
          E(0, MOUTH_Y + 40, 52, 12, c.deep, 0.35) +
          both(E(h.K - 52, 585, 30, 70, c.deep, 0.4, 14)) +
          E(h.K + 20, 470, 84, 290, c.deep, 0.65) +
          E(-h.K - 34, 500, 56, 250, c.deep, 0.3),
      ) +
        blur(
          6,
          both(
            P(
              `M${EYE_X - 58} 420Q${EYE_X} 388 ${EYE_X + 70} 408L${EYE_X + 64} 446Q${EYE_X} 424 ${EYE_X - 52} 446Z`,
              c.deep,
              0.5,
            ) + S("M46 562Q72 592 62 634", c.deep, 7, 0.35),
          ),
        ) +
        blur(
          14,
          E(-46, h.T + 92, 96, 54, c.light, 0.75) +
            E(-116, 506, 42, 19, c.light, 0.75) +
            E(104, 506, 30, 14, c.light, 0.4) +
            E(-6, h.C - 30, 32, 13, c.light, 0.4),
        ) +
        (race.lips === false
          ? ""
          : blur(
              4,
              E(0, MOUTH_Y + 2, 46, 15, mix(c.base, "#8a2438", 0.5), 0.5),
            )) +
        (race.face?.(c, h) ?? ""),
    ) +
    rimLight(head, 20, h.K) +
    race.front(c, h)
  );
}

/** Neutral bust behind single-item thumbnails, so small parts stay readable. */
const silhouette = (color) =>
  P(bodyPath({ nw: 110, sw: 400 }), color) +
  P(headPath({ T: 222, W: 178, K: 186, J: 160, C: 680, CW: 70 }), color);

/** Deterministic scatter for embers and sparkles, so reruns are identical. */
function scatter(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/** Moody backdrop: a glow behind the head, drifting haze, embers, vignette. */
function background({ deep, mid, glow }, seed) {
  const next = scatter(seed);
  let embers = "";
  for (let ember = 0; ember < 46; ember++) {
    const x = next() * 1024 - 512;
    const y = next() * 1024;
    embers += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.5 + next() * 3.5).toFixed(1)}" fill="${mix(glow, "#ffffff", 0.5)}" opacity="${(0.25 + next() * 0.6).toFixed(2)}"/>`;
  }
  return (
    `<rect x="-512" y="0" width="1024" height="1024" fill="${radial(
      0,
      400,
      780,
      [
        [0, glow],
        [0.42, mid],
        [1, deep],
      ],
    )}"/>` +
    blur(
      50,
      E(-270, 300, 230, 150, glow, 0.4) +
        E(310, 650, 270, 170, mid, 0.7) +
        E(0, 1000, 540, 170, deep, 0.85),
    ) +
    blur(
      20,
      P("M-512 0L-250 0L120 1024L-180 1024Z", glow, 0.12) +
        P("M-120 0L10 0L420 1024L260 1024Z", glow, 0.08),
    ) +
    blur(1, embers) +
    `<rect x="-512" y="0" width="1024" height="1024" fill="${radial(
      0,
      470,
      760,
      [
        [0.5, "#000000", 0],
        [1, "#000000", 0.5],
      ],
    )}"/>`
  );
}

function aura(color) {
  const next = scatter(channels(color)[0] + 7);
  let rays = "";
  for (let ray = 0; ray < 14; ray++) {
    const angle = (ray / 14) * Math.PI * 2;
    const point = (offset, reach) =>
      `${Math.cos(angle + offset) * reach} ${440 + Math.sin(angle + offset) * reach}`;
    rays += P(`M0 440L${point(-0.07, 720)}L${point(0.07, 720)}Z`, color, 0.3);
  }
  let sparks = "";
  for (let spark = 0; spark < 16; spark++) {
    const angle = next() * Math.PI * 2;
    const reach = 250 + next() * 220;
    const x = Math.cos(angle) * reach;
    const y = 440 + Math.sin(angle) * reach;
    const r = 6 + next() * 9;
    sparks += P(
      `M${x} ${y - r}L${x + r * 0.25} ${y - r * 0.25}L${x + r} ${y}L${x + r * 0.25} ${y + r * 0.25}L${x} ${y + r}L${x - r * 0.25} ${y + r * 0.25}L${x - r} ${y}L${x - r * 0.25} ${y - r * 0.25}Z`,
      "#ffffff",
      0.85,
    );
  }
  return (
    blur(8, rays) +
    `<circle cx="0" cy="440" r="470" fill="${radial(0, 440, 470, [
      [0, mix(color, "#ffffff", 0.5), 0.95],
      [0.5, color, 0.5],
      [1, color, 0],
    ])}"/>` +
    blur(1, sparks)
  );
}

const ARMOR = symmetric(
  [0, 838],
  [
    [70, 838, 130, 812, 172, 772],
    [260, 790, 400, 830, 446, 880],
    [486, 920, 496, 980, 496, 1045],
    [0, 1045],
  ],
);
/** Same shoulders with a V opening down to `depth`, showing the chest. */
const armorNotched = (depth) =>
  symmetric(
    [0, depth],
    [
      [172, 772],
      [260, 790, 400, 830, 446, 880],
      [486, 920, 496, 980, 496, 1045],
      [0, 1045],
    ],
  );
const ARMOR_BOX = [-460, 770, 480, 1045];
const folds = (color) =>
  blur(
    10,
    S(
      "M-300 880Q-250 960 -270 1040M-140 900Q-120 980 -150 1040M180 900Q150 980 190 1040M330 880Q290 960 320 1040",
      mix(color, SHADOW, 0.7),
      16,
      0.5,
    ),
  ) +
  blur(
    8,
    S(
      "M-360 870Q-320 940 -340 1040M-210 880Q-190 950 -210 1030",
      mix(color, WARM, 0.4),
      10,
      0.35,
    ),
  );

const armor = [
  // Leather vest with a fur collar
  () => {
    const vest = armorNotched(950);
    return (
      form(
        vest,
        "#6b4424",
        ARMOR_BOX,
        folds("#6b4424") +
          S("M-262 852L-222 1040M262 852L222 1040", "#2e1a0c", 7, 0.7) +
          `<path d="M-262 852L-222 1040M262 852L222 1040" fill="none" stroke="#c9a06a" stroke-width="3" stroke-dasharray="10 14"/>`,
        [150, 500],
      ) +
      S("M172 772L0 950L-172 772", lit("#a9793f", [-172, 770, 172, 950]), 18) +
      both(
        blur(
          2,
          S(
            "M176 778Q230 760 300 800M190 800Q250 790 330 830M150 800Q130 850 90 880",
            "#d8c3a0",
            16,
            0.9,
          ),
        ) +
          S(
            "M186 776Q236 762 296 798M196 802Q250 794 322 830",
            "#fff4dc",
            5,
            0.6,
          ),
      )
    );
  },
  // Plate cuirass
  () =>
    form(
      ARMOR,
      STEEL,
      ARMOR_BOX,
      blur(
        14,
        E(-240, 880, 120, 40, "#ffffff", 0.5, -18) +
          E(220, 980, 200, 90, SHADOW, 0.55),
      ) +
        S("M0 850L0 1045", mix(STEEL, SHADOW, 0.6), 10, 0.8) +
        S("M-6 850L-6 1045", "#e6edf5", 4, 0.5) +
        S(
          "M-380 900Q-200 960 0 930Q200 960 380 900",
          mix(STEEL, SHADOW, 0.6),
          8,
          0.6,
        ),
      [150, 500],
    ) +
    form(
      "M-176 776Q0 884 176 776L162 742Q0 838 -162 742Z",
      "#b9c4d2",
      [-176, 740, 176, 880],
      "",
      [40, 180],
    ) +
    S("M-176 776Q0 884 176 776", lit(GOLD, [-176, 780, 176, 880]), 9) +
    form(
      "M0 900L44 950L0 1010L-44 950Z",
      GOLD,
      [-44, 900, 44, 1010],
      "",
      [0, 44],
    ) +
    both(
      [
        [300, 950],
        [215, 892],
        [390, 930],
      ]
        .map(
          ([x, y]) =>
            `<circle cx="${x}" cy="${y}" r="10" fill="${radial(
              x - 3,
              y - 3,
              12,
              [
                [0, "#fff3c0"],
                [1, "#8a5c10"],
              ],
            )}"/>`,
        )
        .join(""),
    ),
  // Mage robe
  () => {
    const robe = armorNotched(905);
    return (
      both(
        form(
          "M150 800L226 660L262 812Z",
          "#3a1f78",
          [150, 660, 262, 812],
          "",
          [150, 262],
        ),
      ) +
      form(robe, "#4a2a96", ARMOR_BOX, folds("#4a2a96"), [150, 500]) +
      S(
        "M172 772L0 905L-172 772M0 905L0 1045",
        lit(GOLD, [-172, 770, 172, 1040]),
        18,
      ) +
      S("M172 772L0 905L-172 772M0 905L0 1045", "#fff0b0", 4, 0.6) +
      both(
        P(
          "M250 900L262 928L290 938L262 948L250 976L238 948L210 938L238 928Z",
          lit(GOLD, [210, 900, 290, 976]),
        ),
      ) +
      blur(10, `<circle cx="0" cy="905" r="34" fill="#7fe9ff" opacity=".7"/>`) +
      `<circle cx="0" cy="905" r="20" fill="${radial(-5, 899, 22, [
        [0, "#ffffff"],
        [0.5, "#7fe9ff"],
        [1, "#1c6fb0"],
      ])}" stroke="${GOLD}" stroke-width="5"/>`
    );
  },
  // Guild tee
  () =>
    form(ARMOR, "#22212b", ARMOR_BOX, folds("#22212b"), [150, 500]) +
    S("M-172 772Q-70 838 0 838Q70 838 172 772", "#3d3b4a", 16),
];

const necklace = [
  // Gold chain
  () =>
    S("M-124 800Q0 996 124 800", "#6e440a", 16) +
    `<path d="M-124 800Q0 996 124 800" fill="none" stroke="${lit(GOLD, [-124, 800, 124, 990])}" stroke-width="11" stroke-dasharray="17 8" stroke-linecap="round"/>` +
    `<circle cx="0" cy="902" r="25" fill="${radial(-7, 894, 28, [
      [0, "#fff3c0"],
      [0.5, GOLD],
      [1, "#6e440a"],
    ])}" stroke="#6e440a" stroke-width="5"/>`,
  // Spiked pauldrons with a glowing gem
  () => {
    const plate =
      "M178 905C170 800 290 730 440 770C500 800 512 900 500 1045L210 1045Z";
    return both(
      [
        "M196 836L214 728L262 800Z",
        "M278 778L314 660L352 770Z",
        "M380 768L436 668L452 790Z",
      ]
        .map((spike) =>
          P(
            spike,
            linear(190, 660, 460, 800, [
              [0, "#f4f7fb"],
              [1, "#5d6878"],
            ]),
          ),
        )
        .join("") +
        form(
          plate,
          STEEL,
          [170, 730, 510, 1045],
          blur(
            12,
            E(280, 800, 90, 26, "#ffffff", 0.55, -18) +
              E(440, 980, 110, 120, SHADOW, 0.5),
          ) +
            S(
              "M206 950C240 860 340 826 492 860",
              mix(STEEL, SHADOW, 0.6),
              9,
              0.7,
            ) +
            S(
              "M212 1010C250 930 350 900 496 930",
              mix(STEEL, SHADOW, 0.6),
              9,
              0.7,
            ),
          [330, 520],
        ) +
        S(plate, lit(GOLD, [170, 730, 510, 1045]), 10) +
        blur(
          10,
          `<circle cx="330" cy="880" r="32" fill="#ff5a2a" opacity=".7"/>`,
        ) +
        `<circle cx="330" cy="880" r="20" fill="${radial(324, 873, 22, [
          [0, "#fff0c0"],
          [0.5, "#ff5a2a"],
          [1, "#6e1408"],
        ])}" stroke="${GOLD}" stroke-width="5"/>`,
    );
  },
  // Scarf
  () => {
    const wrap = "M-178 742Q0 800 178 742L186 838Q0 900 -186 838Z";
    const tail = "M40 852L132 838L156 1010L122 992L104 1020L78 996L54 1018Z";
    return (
      form(
        tail,
        "#8e1f1a",
        [40, 838, 156, 1020],
        blur(6, S("M80 860L96 1000", SHADOW, 12, 0.4)),
        [60, 160],
      ) +
      form(
        wrap,
        "#b3271f",
        [-186, 742, 186, 900],
        blur(
          8,
          S(
            "M-120 770Q-90 830 -120 880M20 792Q40 840 20 890M110 772Q130 830 110 870",
            SHADOW,
            14,
            0.45,
          ),
        ),
        [40, 190],
      ) +
      S("M-182 790Q0 852 182 790", "#e8cf9a", 9, 0.85)
    );
  },
];

const mouthLine = (d) =>
  S(d, "#1a0810", 8, 0.8) + blur(4, E(0, MOUTH_Y + 22, 30, 8, "#ffffff", 0.22));

const mouth = [
  // Smile
  () => mouthLine(`M-50 ${MOUTH_Y - 6}Q0 ${MOUTH_Y + 18} 50 ${MOUTH_Y - 6}`),
  // Shout
  () => {
    const open = `M-44 ${MOUTH_Y - 10}Q0 ${MOUTH_Y - 24} 44 ${MOUTH_Y - 10}Q32 ${MOUTH_Y + 44} 0 ${MOUTH_Y + 46}Q-32 ${MOUTH_Y + 44} -44 ${MOUTH_Y - 10}Z`;
    return (
      P(open, "#1c0509") +
      clipTo(
        open,
        `<rect x="-34" y="${MOUTH_Y - 22}" width="68" height="16" rx="4" fill="#f3ead8"/>` +
          blur(2, E(0, MOUTH_Y + 36, 26, 16, "#c2434a", 0.95)),
      ) +
      S(open, "#1a0810", 5, 0.8)
    );
  },
  // Frown
  () => mouthLine(`M-46 ${MOUTH_Y + 12}Q0 ${MOUTH_Y - 12} 46 ${MOUTH_Y + 12}`),
];

const BEARD_BOX = [-230, 460, 230, 900];
const beard = [
  // Braided: a chin curtain that leaves the mouth, mustache and tusks showing.
  () => {
    const curtain = symmetric(
      [0, 656],
      [
        [60, 656, 120, 655, 150, 620],
        [176, 580, 168, 500, 168, 470],
        [208, 462],
        [232, 560, 222, 700, 130, 800],
        [80, 845, 30, 850, 0, 850],
      ],
    );
    return (
      both(
        [862, 896, 928]
          .map((y, index) =>
            E(
              52,
              y,
              26,
              21,
              index % 2
                ? mix(AUBURN, SHADOW, 0.35)
                : lit(AUBURN, [26, y - 22, 78, y + 22]),
            ),
          )
          .join("") +
          P("M34 962L70 962L52 1016Z", mix(AUBURN, SHADOW, 0.25)) +
          `<rect x="29" y="944" width="46" height="20" rx="6" fill="${lit(GOLD, [29, 942, 75, 966])}"/>`,
      ) +
      hairMass(
        curtain,
        AUBURN,
        BEARD_BOX,
        "M-196 500Q-206 640 -130 760M-170 600Q-150 720 -70 800M-60 690Q-30 780 0 830M150 660Q120 760 60 820",
        "M-150 640Q-110 740 -40 820M40 700Q30 780 10 836M186 520Q200 640 150 740M110 680Q90 760 40 824",
      )
    );
  },
  // Mutton chops
  () =>
    both(
      hairMass(
        "M208 462C228 560 216 660 150 700C124 670 140 620 150 590C172 548 170 500 168 470Z",
        AUBURN,
        [150, 460, 226, 700],
        "M196 490Q204 580 166 660",
        "M182 500Q186 580 156 640",
        [150, 226],
      ),
    ),
  // Long grey: covers the dwarf's own brows and mustache with grey ones.
  () => {
    const long =
      symmetric(
        [0, 562],
        [
          [70, 564, 150, 556, 168, 470],
          [208, 462],
          [244, 610, 200, 830, 0, 985],
        ],
      ) + `M-56 ${MOUTH_Y + 6}a56 30 0 1 0 112 0a56 30 0 1 0 -112 0Z`;
    const grown = (d) =>
      `<path d="${d}" fill="${GREY}" stroke="${GREY}" stroke-width="10" stroke-linejoin="round"/>`;
    return (
      `<path fill-rule="evenodd" d="${long}" fill="${lit(GREY, BEARD_BOX)}"/>` +
      S(
        "M-196 500Q-214 660 -110 820M-150 640Q-120 780 -30 900M-40 700Q-20 820 0 960M60 690Q40 820 10 950",
        "#f4f1ea",
        5,
        0.6,
      ) +
      S(
        "M150 640Q130 780 40 900M186 520Q206 660 130 800M100 690Q80 800 30 900",
        mix(GREY, SHADOW, 0.6),
        6,
        0.45,
      ) +
      both(grown(BROW)) +
      brows(GREY) +
      grown(MUSTACHE) +
      mustache(GREY)
    );
  },
];

const almond = (top, bottom) =>
  `M${EYE_X - 40} ${EYE_Y + 5}Q${EYE_X - 4} ${EYE_Y - top} ${EYE_X + 44} ${EYE_Y - 9}Q${EYE_X + 8} ${EYE_Y + bottom} ${EYE_X - 40} ${EYE_Y + 5}Z`;

/**
 * A pair of eyes. `iris` with `pupil: false` fills the whole eye with light,
 * and `glow` adds the halo that magical races wear.
 */
function eyePair({
  top = 30,
  bottom = 24,
  sclera = "#efe6d8",
  iris,
  irisR = 16,
  pupil = true,
  glow,
  extra = "",
}) {
  const shape = almond(top, bottom);
  const right =
    (glow ? blur(10, E(EYE_X, EYE_Y, 46, 26, glow, 0.6)) : "") +
    P(almond(top + 7, bottom + 5), INK) +
    P(shape, sclera) +
    clipTo(
      shape,
      `<circle cx="${EYE_X}" cy="${EYE_Y}" r="${irisR}" fill="${radial(
        EYE_X - 4,
        EYE_Y - 6,
        irisR,
        [
          [0, mix(iris, "#ffffff", 0.6)],
          [0.6, iris],
          [1, mix(iris, INK, 0.6)],
        ],
      )}"/>` +
        (pupil
          ? `<circle cx="${EYE_X}" cy="${EYE_Y}" r="${irisR * 0.42}" fill="${INK}"/>`
          : "") +
        blur(
          3,
          P(
            `M${EYE_X - 46} ${EYE_Y - 46}H${EYE_X + 50}V${EYE_Y - top * 0.42}H${EYE_X - 46}Z`,
            INK,
            glow ? 0.2 : 0.5,
          ),
        ),
    ) +
    S(
      `M${EYE_X - 40} ${EYE_Y + 5}Q${EYE_X - 4} ${EYE_Y - top} ${EYE_X + 44} ${EYE_Y - 9}`,
      INK,
      7,
    ) +
    extra;
  const scaled = `<g transform="translate(${EYE_X} ${EYE_Y}) scale(${EYE_SCALE}) translate(${-EYE_X} ${-EYE_Y})">${right}</g>`;
  return (
    both(scaled) +
    [-EYE_X, EYE_X]
      .map(
        (x) =>
          `<circle cx="${x - 8}" cy="${EYE_Y - 9}" r="4.5" fill="#ffffff" opacity=".9"/>`,
      )
      .join("")
  );
}

const eyes = [
  // Calm
  () => eyePair({ iris: "#c98a2a" }),
  // Fierce
  () =>
    eyePair({
      top: 18,
      bottom: 22,
      sclera: "#3a0906",
      iris: "#ff5a1f",
      irisR: 15,
      glow: "#ff3a12",
      extra: P(
        `M${EYE_X - 46} ${EYE_Y - 4}L${EYE_X + 52} ${EYE_Y - 36}L${EYE_X + 52} ${EYE_Y - 20}L${EYE_X - 38} ${EYE_Y + 6}Z`,
        INK,
        0.85,
      ),
    }),
  // Wide
  () => eyePair({ top: 42, bottom: 32, iris: "#f2c23a", irisR: 20 }),
  // Moonlit: pupil-less glowing eyes with trailing light.
  () =>
    eyePair({
      sclera: "#e8fbff",
      iris: "#8fe9ff",
      irisR: 44,
      pupil: false,
      glow: "#5fd4ff",
      extra: blur(
        5,
        S(`M${EYE_X + 40} ${EYE_Y - 14}q48 -26 74 -86`, "#bff4ff", 9, 0.7),
      ),
    }),
];

const HAIR_DARK = "#2e1c12";
const HAIR_BLONDE = "#d9a82a";
const HAIR_RED = "#c22a1c";
const CAP = symmetric(
  [0, 172],
  [
    [130, 172, 215, 250, 208, 440],
    [190, 400, 196, 330, 150, 292],
    [100, 262, 50, 300, 0, 268],
  ],
);

const hair = [
  // Short
  () =>
    hairMass(
      CAP,
      HAIR_DARK,
      [-210, 172, 210, 440],
      "M-170 330Q-150 230 -40 200M-110 280Q-70 220 20 210M-190 400Q-196 320 -160 270",
      "M40 270Q90 250 150 290M90 210Q170 250 196 380M-20 240Q30 220 90 240",
    ),
  // Long
  () => {
    const lock =
      "M150 290C200 300 222 360 226 440C240 600 250 720 232 820C200 850 160 840 150 800C176 680 186 540 182 420C180 360 170 320 150 290Z";
    return (
      both(
        hairMass(
          lock,
          mix(HAIR_BLONDE, SHADOW, 0.15),
          [150, 290, 250, 840],
          "M196 340Q216 520 206 700M176 400Q200 600 176 800",
          "M214 420Q236 600 218 800M188 480Q206 640 190 780",
          [170, 250],
        ),
      ) +
      hairMass(
        CAP,
        HAIR_BLONDE,
        [-210, 172, 210, 440],
        "M-170 330Q-150 230 -40 200M-110 280Q-70 220 20 210M-190 400Q-196 320 -160 270",
        "M40 270Q90 250 150 290M90 210Q170 250 196 380M-20 240Q30 220 90 240",
      )
    );
  },
  // Mohawk
  () =>
    hairMass(
      "M-44 330C-60 240 -50 170 -30 60C-10 120 0 90 12 30C30 110 40 140 52 80C66 180 62 260 44 330Q0 300 -44 330Z",
      HAIR_RED,
      [-60, 30, 66, 330],
      "M-30 300Q-40 200 -26 110M-4 300Q-8 180 10 80M24 300Q30 200 46 130",
      "M-16 310Q-22 200 -10 130M12 310Q14 200 28 120M38 310Q46 240 52 160",
      [0, 66],
    ),
];

const headgear = [
  // Iron helm with horns and a nose guard
  () => {
    const dome = symmetric(
      [0, 150],
      [
        [140, 150, 232, 220, 226, 386],
        [20, 380],
        [15, 500],
        [15, 520, 6, 528, 0, 528],
      ],
    );
    const horn = "M196 300C300 300 350 220 338 90C300 190 250 226 190 232Z";
    return (
      both(
        form(
          horn,
          IVORY,
          [190, 90, 350, 300],
          S(
            "M214 250Q270 250 300 200M236 286Q300 270 330 200",
            "#8a7748",
            6,
            0.5,
          ),
          [250, 350],
        ),
      ) +
      form(
        dome,
        STEEL,
        [-230, 150, 230, 520],
        blur(
          16,
          E(-120, 230, 70, 34, "#ffffff", 0.6, -28) +
            E(170, 300, 70, 130, SHADOW, 0.55),
        ) +
          S("M0 152L0 380", mix(STEEL, SHADOW, 0.6), 22, 0.7) +
          S("M-5 152L-5 380", "#e6edf5", 5, 0.6),
      ) +
      form(
        "M-228 346Q0 328 228 346L226 388Q0 370 -226 388Z",
        GOLD,
        [-228, 330, 228, 390],
        "",
        [40, 230],
      ) +
      both(
        [70, 150]
          .map(
            (x) =>
              `<circle cx="${x}" cy="${362 - x * 0.03}" r="8" fill="${radial(
                x - 2,
                359,
                9,
                [
                  [0, "#fff3c0"],
                  [1, "#6e440a"],
                ],
              )}"/>`,
          )
          .join(""),
      )
    );
  },
  // Wool cap
  () => {
    const cap = symmetric(
      [0, 140],
      [
        [130, 140, 225, 200, 214, 332],
        [0, 332],
      ],
    );
    return (
      `<circle cx="0" cy="134" r="40" fill="${radial(-12, 120, 48, [
        [0, "#fffaf0"],
        [0.6, "#e6dcc8"],
        [1, "#8f8672"],
      ])}"/>` +
      form(
        cap,
        "#96261c",
        [-216, 140, 216, 332],
        S(
          "M-150 190Q-170 260 -168 330M-80 160Q-96 240 -92 330M0 150L0 330M80 160Q96 240 92 330M150 190Q170 260 168 330",
          SHADOW,
          7,
          0.3,
        ),
      ) +
      form(
        "M-228 290Q0 268 228 290L226 364Q0 342 -226 364Z",
        "#b83a2c",
        [-228, 270, 228, 364],
        S(
          "M-180 290L-180 358M-120 284L-120 352M-60 280L-60 348M0 278L0 346M60 280L60 348M120 284L120 352M180 290L180 358",
          SHADOW,
          7,
          0.35,
        ),
        [40, 230],
      )
    );
  },
  // Crown
  () => {
    const crown =
      "M-150 262L-168 120L-96 196L-50 92L0 190L50 92L96 196L168 120L150 262Q0 240 -150 262Z";
    const gem = (x, y, r, color) =>
      blur(
        6,
        `<circle cx="${x}" cy="${y}" r="${r + 8}" fill="${color}" opacity=".6"/>`,
      ) +
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${radial(
        x - r * 0.3,
        y - r * 0.3,
        r,
        [
          [0, "#ffffff"],
          [0.5, color],
          [1, mix(color, INK, 0.6)],
        ],
      )}"/>`;
    return (
      form(
        crown,
        GOLD,
        [-168, 92, 168, 262],
        blur(8, E(-90, 180, 50, 16, "#fff6c8", 0.7, -30)),
        [0, 170],
      ) +
      form(
        "M-152 226Q0 204 152 226L150 266Q0 244 -150 266Z",
        "#b8801a",
        [-152, 204, 152, 266],
        "",
        [40, 152],
      ) +
      gem(0, 236, 13, "#e02a2a") +
      gem(-84, 242, 10, "#2f7dff") +
      gem(84, 242, 10, "#2f7dff")
    );
  },
];

const puff = (x, y) =>
  blur(
    6,
    S(
      `M${x} ${y}q28 -32 0 -66q-28 -34 8 -74q30 -30 4 -64`,
      "#efece4",
      16,
      0.55,
    ),
  ) + blur(3, S(`M${x} ${y}q28 -32 0 -66q-28 -34 8 -74`, "#ffffff", 6, 0.4));
const ember = (x, y) =>
  blur(8, `<circle cx="${x}" cy="${y}" r="18" fill="#ff7a2a" opacity=".8"/>`) +
  `<circle cx="${x}" cy="${y}" r="8" fill="#ffd27a"/>`;
const MOUTH_CORNER = MOUTH_Y + 4;

const smoke = [
  // Cigar
  () =>
    `<g transform="rotate(8 34 ${MOUTH_CORNER})"><rect x="34" y="${MOUTH_CORNER - 13}" width="150" height="26" rx="11" fill="${linear(
      0,
      MOUTH_CORNER - 13,
      0,
      MOUTH_CORNER + 13,
      [
        [0, "#a06a36"],
        [1, "#3e2210"],
      ],
    )}"/>` +
    `<rect x="78" y="${MOUTH_CORNER - 13}" width="16" height="26" fill="${GOLD}"/>` +
    `<rect x="170" y="${MOUTH_CORNER - 13}" width="14" height="26" rx="5" fill="#9a9488"/></g>` +
    ember(186, MOUTH_CORNER + 21) +
    puff(198, MOUTH_CORNER + 2),
  // Pipe
  () =>
    S(
      `M34 ${MOUTH_CORNER}Q110 ${MOUTH_CORNER + 6} 150 ${MOUTH_CORNER + 46}`,
      "#24140a",
      15,
    ) +
    form(
      `M132 ${MOUTH_CORNER + 2}L208 ${MOUTH_CORNER + 2}L200 ${MOUTH_CORNER + 74}Q170 ${MOUTH_CORNER + 94} 140 ${MOUTH_CORNER + 74}Z`,
      "#5a3418",
      [132, MOUTH_CORNER, 208, MOUTH_CORNER + 94],
      "",
      [150, 210],
    ) +
    `<rect x="126" y="${MOUTH_CORNER - 8}" width="88" height="18" rx="9" fill="${lit("#8a5a36", [126, MOUTH_CORNER - 8, 214, MOUTH_CORNER + 10])}"/>` +
    ember(170, MOUTH_CORNER - 6) +
    puff(170, MOUTH_CORNER - 24),
  // Clay pipe
  () =>
    S(`M34 ${MOUTH_CORNER}L206 ${MOUTH_CORNER + 18}`, "#d9cba6", 10) +
    form(
      `M196 ${MOUTH_CORNER - 34}L236 ${MOUTH_CORNER - 34}L232 ${MOUTH_CORNER + 28}Q216 ${MOUTH_CORNER + 38} 200 ${MOUTH_CORNER + 28}Z`,
      "#e6d9b6",
      [196, MOUTH_CORNER - 34, 236, MOUTH_CORNER + 38],
      "",
      [200, 238],
    ) +
    ember(216, MOUTH_CORNER - 36) +
    puff(216, MOUTH_CORNER - 54),
];

const held = [
  // Tankard
  () => {
    const body = "M266 770L424 770L416 978Q345 992 274 978Z";
    return (
      S(
        "M420 806Q494 806 494 868Q494 930 418 934",
        lit("#7d8794", [420, 800, 500, 940]),
        24,
      ) +
      form(
        body,
        WOOD,
        [266, 770, 424, 990],
        S("M306 772L310 984M346 772L346 988M386 772L382 984", SHADOW, 6, 0.4),
        [330, 430],
      ) +
      S(
        "M268 812Q345 826 422 812M272 934Q345 948 418 934",
        lit("#aab4c0", [266, 800, 424, 950]),
        18,
      ) +
      blur(
        2,
        [
          [290, 766, 30],
          [338, 748, 38],
          [388, 764, 33],
          [422, 778, 22],
        ]
          .map(
            ([x, y, r]) =>
              `<circle cx="${x}" cy="${y}" r="${r}" fill="${radial(
                x - 8,
                y - 10,
                r * 1.2,
                [
                  [0, "#ffffff"],
                  [1, "#d9c9a0"],
                ],
              )}"/>`,
          )
          .join("") +
          `<rect x="372" y="772" width="26" height="60" rx="13" fill="#f3e9d0"/>`,
      )
    );
  },
  // Torch
  () =>
    blur(
      40,
      `<circle cx="348" cy="560" r="170" fill="#ff7a1f" opacity=".55"/>`,
    ) +
    form(
      "M328 700L368 700L364 1045L332 1045Z",
      WOOD,
      [328, 700, 368, 1045],
      "",
      [340, 370],
    ) +
    form(
      "M310 640L386 640L380 720L316 720Z",
      "#3a2a22",
      [310, 640, 386, 720],
      S("M312 664L384 664M314 692L382 692", "#9a8a6a", 5, 0.6),
      [350, 388],
    ) +
    blur(
      3,
      P(
        "M348 440C426 546 430 606 404 652Q348 694 292 652C268 606 296 574 316 540C328 580 340 560 348 440Z",
        linear(0, 440, 0, 690, [
          [0, "#ffd23f"],
          [0.5, "#ff7a1f"],
          [1, "#c22a0c"],
        ]),
      ),
    ) +
    blur(
      2,
      P(
        "M348 548C388 606 384 640 370 658Q348 676 326 658C312 636 328 606 348 548Z",
        linear(0, 548, 0, 676, [
          [0, "#ffffff"],
          [1, "#ffd23f"],
        ]),
      ),
    ),
  // Axe
  () => {
    const blade = "M370 556C470 532 512 626 498 736C456 690 414 676 370 680Z";
    return (
      form(
        "M336 540L370 540L368 1045L338 1045Z",
        WOOD,
        [336, 540, 370, 1045],
        "",
        [346, 372],
      ) +
      form(
        "M336 578L274 614L336 656Z",
        STEEL,
        [274, 578, 336, 656],
        "",
        false,
      ) +
      form(
        blade,
        STEEL,
        [370, 540, 510, 740],
        blur(8, E(410, 600, 50, 16, "#ffffff", 0.7, 30)) +
          S("M470 560C506 620 504 690 496 730", "#f4f8fc", 8, 0.8),
        [420, 512],
      ) +
      blur(5, S("M400 606L430 640L404 662", "#7fe9ff", 7, 0.9)) +
      `<rect x="330" y="600" width="46" height="22" fill="${lit(GOLD, [330, 600, 376, 622])}"/>`
    );
  },
];

/** Rarity ring: a beveled metal band in the rarity color with four studs. */
function frame(color) {
  const metal = linear(-360, 150, 360, 880, [
    [0, mix(color, "#ffffff", 0.6)],
    [0.45, color],
    [1, mix(color, INK, 0.65)],
  ]);
  const studs = [
    [0, 18],
    [494, 512],
    [0, 1006],
    [-494, 512],
  ]
    .map(([x, y]) =>
      P(
        `M${x} ${y - 30}L${x + 22} ${y}L${x} ${y + 30}L${x - 22} ${y}Z`,
        radial(x - 5, y - 8, 30, [
          [0, "#ffffff"],
          [0.5, color],
          [1, mix(color, INK, 0.6)],
        ]),
      ),
    )
    .join("");
  return (
    blur(
      14,
      `<circle cx="0" cy="512" r="494" fill="none" stroke="${color}" stroke-width="30" opacity=".6"/>`,
    ) +
    `<circle cx="0" cy="512" r="494" fill="none" stroke="${metal}" stroke-width="30"/>` +
    `<circle cx="0" cy="512" r="508" fill="none" stroke="${INK}" stroke-width="4" opacity=".7"/>` +
    `<circle cx="0" cy="512" r="478" fill="none" stroke="${mix(color, "#ffffff", 0.7)}" stroke-width="4" opacity=".8"/>` +
    studs
  );
}

const BACKDROPS = [
  { deep: "#1a0d06", mid: "#5a3214", glow: "#c8782a" },
  { deep: "#050a1f", mid: "#14285e", glow: "#3f7fd6" },
  { deep: "#1c0504", mid: "#6e130c", glow: "#e0531f" },
  { deep: "#04140a", mid: "#145222", glow: "#7fe03a" },
  { deep: "#0d0520", mid: "#3a1a70", glow: "#a05cf0" },
  { deep: "#1f1203", mid: "#7a5210", glow: "#f7cf5a" },
];

/**
 * Artwork per category; counts and order must match `avatar.config.ts`.
 * Skin entries take the race because the tone follows its body.
 */
const layers = {
  background: BACKDROPS.map(
    (palette, index) => () => background(palette, index + 3),
  ),
  aura: ["#ffc93a", "#b574ff", "#6fc3ff"].map((color) => () => aura(color)),
  race: RACES.map((race) => () => figure(race, 1)),
  skin: [0, 1, 2].map((tone) => ({ perRace: (race) => figure(race, tone) })),
  armor,
  necklace,
  mouth,
  beard,
  eyes,
  hair,
  headgear,
  smoke,
  held,
  frame: ["#4fbf45", "#3f8bff", "#b05cf0", "#ff8a1f"].map(
    (color) => () => frame(color),
  ),
};

const SKIN_SWATCHES = ["#eadbc8", "#b08a66", "#5c4130"];
const FULL = "0 0 1024 1024";
const FACE = "152 130 720 720";
const TORSO = "152 304 720 720";
/** How each category's thumbnail is cropped so its artwork fills the tile. */
const thumbViews = {
  race: FACE,
  skin: FACE,
  mouth: FACE,
  beard: "152 260 720 720",
  eyes: FACE,
  hair: "152 100 720 720",
  headgear: "152 40 720 720",
  smoke: FACE,
  armor: TORSO,
  necklace: TORSO,
  held: "304 304 720 720",
};

/**
 * The brush: `paint` wobbles edges and lays streaky light and dark grain over
 * whatever is drawn; `grain` keeps edges straight for full-bleed backdrops.
 * Both are pinned to canvas coordinates, so stacked layers distort alike.
 */
const grainSteps = (source) =>
  `<feTurbulence type="fractalNoise" baseFrequency="0.05 0.02" numOctaves="3" seed="11" result="noise"/>` +
  `<feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.02  0 0 0 0 0.1  0.5 0 0 0 -0.23" result="dark"/>` +
  `<feComposite in="dark" in2="${source}" operator="in" result="darkIn"/>` +
  `<feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.85  0 0.34 0 0 -0.165" result="light"/>` +
  `<feComposite in="light" in2="${source}" operator="in" result="lightIn"/>` +
  `<feMerge><feMergeNode in="${source}"/><feMergeNode in="darkIn"/><feMergeNode in="lightIn"/></feMerge>`;
const region = `filterUnits="userSpaceOnUse" x="-20" y="-20" width="1064" height="1064" color-interpolation-filters="sRGB"`;
const BRUSHES =
  `<filter id="paint" ${region}><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="warp"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="warp" scale="6" xChannelSelector="R" yChannelSelector="G" result="shape"/>${grainSteps("shape")}</filter>` +
  `<filter id="grain" ${region}>${grainSteps("SourceGraphic")}</filter>`;

/** Runs one recipe with fresh definitions and wraps it into an SVG document. */
function render(draw, size, view = FULL, brush = "paint") {
  defs = [];
  blurIds.clear();
  const inner = draw();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${view}"><defs>${BRUSHES}${defs.join("")}</defs><g filter="url(#${brush})"><g transform="translate(512 0)">${inner}</g></g></svg>`;
}

async function write(file, svg) {
  mkdirSync(dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
}

const backdrop = () =>
  `<rect x="-512" y="0" width="1024" height="1024" fill="#1a120b"/>`;

function thumbnail(category, index, draw) {
  if (category === "background") return draw;
  if (category === "race") return () => backdrop() + draw();
  if (category === "skin")
    return () => backdrop() + silhouette(SKIN_SWATCHES[index]);
  if (category === "aura")
    return () => backdrop() + draw() + silhouette("#4a3a2a");
  return () => backdrop() + silhouette("#4a3a2a") + draw();
}

let count = 0;
for (const [category, recipes] of Object.entries(layers)) {
  const brush = category === "background" ? "grain" : "paint";
  for (const [index, recipe] of recipes.entries()) {
    const number = String(index + 1).padStart(2, "0");
    if (typeof recipe === "function") {
      await write(
        join(root, "layers", category, `${number}.png`),
        render(recipe, 1024, FULL, brush),
      );
      count += 1;
    } else {
      for (const [raceIndex, race] of RACES.entries()) {
        const raceId = `race_${String(raceIndex + 1).padStart(2, "0")}`;
        await write(
          join(root, "layers", category, `${number}-${raceId}.png`),
          render(() => recipe.perRace(race), 1024),
        );
        count += 1;
      }
    }
    await write(
      join(root, "thumbs", category, `${number}.png`),
      render(
        thumbnail(category, index, recipe),
        128,
        thumbViews[category],
        "grain",
      ),
    );
    count += 1;
  }
}
console.log(`Wrote ${count} avatar files to ${root}`);
