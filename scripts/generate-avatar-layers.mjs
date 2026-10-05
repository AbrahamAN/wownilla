/**
 * Draws the avatar forge layers as memecoin-style profile pictures and
 * rasterizes them into `public/avatar`: flat cel colors, one shadow tone and
 * thick ink outlines with a hand-drawn wobble. Every layer shares the same
 * skull and face anchors (eyes, mouth, crown of the head), so any combination
 * lines up on any race.
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
const EYE_X = 104;
const EYE_Y = 452;
const MOUTH_Y = 664;

const INK = "#170f14";
const LINE = 13;
const SHADE = "#2b1245";
const LIGHT = "#fff6d8";
const WHITE = "#fffdf2";
const GOLD = "#f5c531";
const GOLD_DARK = "#c98a12";
const STEEL = "#9aa6b8";
const IRON = "#5d6b82";
const IVORY = "#f6ecc9";
const BONE = "#c9b27a";
const WOOD = "#9a6234";
const LEATHER = "#8a4f2a";
const RED = "#e2363f";
const AUBURN = "#d2601f";
const GREY = "#d6d3dc";
const CORAL = "#ff7a52";
const CREAM = "#f6efc4";
const SMOKE = "#f4f0e8";

let uid = 0;
/** Clip and filter definitions collected while one image is drawn. */
let defs = [];
function def(make) {
  const id = `i${++uid}`;
  defs.push(make(id));
  return id;
}

const channels = (color) =>
  [1, 3, 5].map((start) => Number.parseInt(color.slice(start, start + 2), 16));

/** Blends two hex colors; shadows and lights derive from one base tone. */
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
const shadeOf = (color, amount = 0.3) => mix(color, SHADE, amount);
const lightOf = (color, amount = 0.4) => mix(color, LIGHT, amount);

const fill = (d, color, opacity = 1) =>
  `<path d="${d}" fill="${color}"${opacity < 1 ? ` opacity="${opacity}"` : ""}/>`;
const ink = (d, width = LINE, color = INK) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const dash = (d, width, color, pattern) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="${pattern}"/>`;
const box = (x, y, width, height, color = INK) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}"/>`;
const clipTo = (d, content) =>
  `<g clip-path="url(#${def((id) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`)})">${content}</g>`;
const turn = (degrees, x, y, content) =>
  `<g transform="rotate(${degrees} ${x} ${y})">${content}</g>`;
/** Soft glow behind lasers and moonlit eyes; the only blur in the set. */
const glow = (amount, content) =>
  `<g filter="url(#${def((id) => `<filter id="${id}" filterUnits="userSpaceOnUse" x="-600" y="-80" width="1200" height="1200"><feGaussianBlur stdDeviation="${amount}"/></filter>`)})">${content}</g>`;

/** An ellipse as a path, so it can be clipped, mirrored and cel shaded. */
const oval = (cx, cy, rx, ry = rx) =>
  `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;

const star = (x, y, r) =>
  `M ${x} ${y - r} L ${x + r * 0.28} ${y - r * 0.28} L ${x + r} ${y} L ${x + r * 0.28} ${y + r * 0.28} L ${x} ${y + r} L ${x - r * 0.28} ${y + r * 0.28} L ${x - r} ${y} L ${x - r * 0.28} ${y - r * 0.28} Z`;

/** Flips a path across the face. Paths here keep every number space separated. */
function mirror(d) {
  return d.replace(/([MLCQAHV])([^MLCQAHVZ]*)/g, (_, command, args) => {
    const n = args.trim().split(/\s+/).filter(Boolean).map(Number);
    if (command === "A") {
      for (let i = 0; i < n.length; i += 7) {
        n[i + 2] = -n[i + 2];
        n[i + 4] = n[i + 4] ? 0 : 1;
        n[i + 5] = -n[i + 5];
      }
    } else if (command !== "V") {
      for (let i = 0; i < n.length; i += command === "H" ? 1 : 2) n[i] = -n[i];
    }
    return `${command} ${n.join(" ")} `;
  });
}
const flip = (d, side) => (side > 0 ? d : mirror(d));

/**
 * Draws a right-hand path and its mirror. The mirror is a new path rather
 * than a flipped group, so the light stays on the same side of both.
 */
const pair = (d, draw) => draw(d, 1) + draw(mirror(d), -1);

/**
 * Closes a path that is symmetric across the face from its right half:
 * `segments` run from `start` down the right side, as cubic (6 numbers) or
 * straight (2 numbers) pieces, and are mirrored back up the left.
 */
function symmetric([startX, startY], segments) {
  const points = [[startX, startY], ...segments.map((s) => s.slice(-2))];
  let d = `M ${startX} ${startY}`;
  for (const s of segments)
    d += ` ${s.length === 2 ? "L" : "C"} ${s.join(" ")}`;
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    const [x, y] = points[i];
    d +=
      s.length === 2
        ? ` L ${-x} ${y}`
        : ` C ${-s[2]} ${s[3]} ${-s[0]} ${s[1]} ${-x} ${y}`;
  }
  return `${d} Z`;
}

/**
 * One cel-shaded form: the shape in its shadow tone, the base tone slid toward
 * the light so a crescent of shadow is left on the far edge, then the outline.
 * `inner` is extra detail clipped to the shape.
 */
function cel(d, color, options = {}) {
  const {
    by = [-16, -12],
    inner = "",
    width = LINE,
    shade = shadeOf(color),
  } = options;
  return (
    fill(d, shade) +
    clipTo(
      d,
      `<path d="${d}" fill="${color}" transform="translate(${by[0]} ${by[1]})"/>${inner}`,
    ) +
    (width ? ink(d, width) : "")
  );
}

/** Overlapping blobs outlined as one cloud: smoke, foam, fur. */
const cloud = (blobs, color) =>
  blobs
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r + LINE / 2}" fill="${INK}"/>`,
    )
    .join("") +
  blobs
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r - LINE / 2}" fill="${color}"/>`,
    )
    .join("");

/** A band with an ink edge on both sides: chains, stems, trims, hafts. */
const cord = (d, width, color) => ink(d, width + 14) + ink(d, width, color);

/**
 * Every race keeps the same cranium (`top`, `W`) so hair and headgear fit,
 * and differs from the cheeks down.
 */
const headPath = ({ top = 190, W = 226, cheek, J, jawY, CW, CY, C }) =>
  symmetric(
    [0, top],
    [
      [W * 0.66, top, W, top + 80, W, 380],
      [W, 440, cheek, 480, cheek, 530],
      [cheek, 580, J, 600, J, jawY],
      [J, jawY + 70, CW + 64, CY - 4, CW, CY],
      [CW * 0.6, C, CW * 0.3, C, 0, C],
    ],
  );

const bodyPath = ({ nw, sw }) =>
  symmetric(
    [0, 690],
    [
      [nw, 690],
      [nw, 762],
      [nw + 34, 792, nw + 96, 800, nw + 150, 816],
      [sw * 0.86, 846, sw, 912, sw, 1090],
      [0, 1090],
    ],
  );

const MUSTACHE = symmetric(
  [0, 592],
  [
    [40, 580, 116, 578, 180, 636],
    [204, 664, 206, 704, 176, 718],
    [140, 714, 124, 652, 92, 644],
    [60, 638, 30, 642, 0, 642],
  ],
);
const mustache = (color) =>
  cel(MUSTACHE, color, {
    by: [-8, -10],
    inner: ink(
      "M -156 668 Q -100 612 -22 616 M 22 616 Q 100 612 156 668",
      7,
      shadeOf(color, 0.45),
    ),
  });

const BUSHY_BROW =
  "M 18 432 Q 40 366 138 352 Q 208 356 226 398 Q 190 388 160 400 Q 128 388 100 404 Q 70 396 34 446 Z";
const bushyBrows = (color) =>
  pair(BUSHY_BROW, (d) => cel(d, color, { by: [-6, -10] }));

const ORC_EAR = "M 212 404 L 408 314 Q 378 448 236 532 Z";
const ELF_EAR =
  "M 210 418 C 300 398 396 326 470 214 C 436 396 334 500 224 530 Z";
const FIN =
  "M 216 404 L 392 318 L 356 420 L 412 450 L 356 484 L 384 556 L 226 510 Z";

/**
 * Races, in the order of the `race` category in `avatar.config.ts`. `back` is
 * drawn behind the head, `torso` and `face` are detail clipped to the body and
 * head, and `front` sits on top. `tones` are the three skin options.
 */
const RACES = [
  {
    // Dwarf: round face, rosy cheeks, bulb nose, bushy brows and a mustache.
    tones: ["#f5c9a4", "#dc9d70", "#935f41"],
    head: { cheek: 246, J: 250, jawY: 630, CW: 120, CY: 752, C: 770 },
    body: { nw: 150, sw: 430 },
    back: (c) =>
      pair(
        "M 222 426 C 286 396 314 462 296 516 C 282 556 244 558 226 536 Z",
        (d, side) =>
          cel(d, c.base, {
            shade: c.shade,
            inner: ink(
              flip("M 250 454 C 278 448 286 488 268 514", side),
              8,
              c.deep,
            ),
          }),
      ),
    face: (c) =>
      pair(oval(156, 566, 46, 28), (d) =>
        fill(d, mix(c.base, RED, 0.42), 0.75),
      ),
    front: (c) =>
      mustache(AUBURN) +
      cel(oval(0, 536, 58, 48), mix(c.base, RED, 0.3), {
        by: [-10, -8],
        width: 11,
        inner: fill(oval(-22, 514, 14, 9), LIGHT, 0.75),
      }) +
      bushyBrows(AUBURN),
  },
  {
    // Orc: massive jaw, swept ears, heavy brow slabs, tusks and a scar.
    tones: ["#a8d957", "#72b53c", "#3f8a4b"],
    head: { cheek: 238, J: 264, jawY: 650, CW: 150, CY: 782, C: 798 },
    body: { nw: 168, sw: 456 },
    back: (c) =>
      pair(ORC_EAR, (d, side) =>
        cel(d, c.base, {
          shade: c.shade,
          inner: fill(
            flip("M 244 430 L 362 374 Q 338 448 250 496 Z", side),
            c.deep,
          ),
        }),
      ) + cord(oval(-322, 452, 24), 10, GOLD),
    face: (c) =>
      pair(
        "M 8 450 L 18 388 Q 120 338 212 362 Q 226 384 208 402 Q 118 388 8 450 Z",
        (d) =>
          cel(d, mix(c.base, c.shade, 0.6), { by: [-6, -12], shade: c.deep }),
      ),
    front: (c) =>
      ink("M -46 524 Q -62 584 -22 590 Q 0 598 22 590 Q 62 584 46 524", 11) +
      pair(oval(22, 566, 9, 13), (d) => fill(d, INK)) +
      ink("M -24 532 Q -30 546 -24 556", 8, c.light) +
      pair(
        "M 98 686 C 88 610 112 550 156 506 C 164 560 178 630 166 686 Z",
        (d, side) =>
          cel(d, IVORY, { by: [-12, -4], shade: BONE }) +
          ink(flip("M 84 692 Q 132 712 180 692", side), 10),
      ) +
      ink(
        "M -196 296 L -164 352 M -202 322 L -176 312 M -186 344 L -160 334",
        7,
      ) +
      ink("M -56 744 Q 0 762 56 744", 9),
  },
  {
    // Fish-folk: pale jaw, crest spines, side fins and frog-like eye mounds.
    tones: ["#77e0c4", "#35b3a8", "#2c7699"],
    head: { cheek: 256, J: 238, jawY: 636, CW: 96, CY: 744, C: 760 },
    body: { nw: 92, sw: 320 },
    back: () =>
      cel(
        "M -96 300 L -70 158 L -32 232 L 2 84 L 40 232 L 76 166 L 100 300 Z",
        CORAL,
        {
          by: [-10, -4],
          inner: ink(
            "M -50 290 L -62 208 M 2 290 L 2 150 M 54 290 L 68 214",
            7,
            shadeOf(CORAL, 0.45),
          ),
        },
      ) +
      pair(FIN, (d, side) =>
        cel(d, CORAL, {
          by: [-10, -8],
          inner: ink(
            flip(
              "M 236 440 L 350 400 M 240 458 L 368 452 M 236 478 L 346 510",
              side,
            ),
            7,
            shadeOf(CORAL, 0.45),
          ),
        }),
      ),
    torso: () => fill(oval(0, 1030, 150, 190), CREAM),
    face: (c) =>
      fill(oval(0, 736, 270, 144), CREAM) +
      fill(oval(176, 288, 20, 16), c.deep, 0.45) +
      fill(oval(130, 250, 12, 10), c.deep, 0.45) +
      fill(oval(-170, 330, 14, 11), c.deep, 0.45),
    front: (c) =>
      pair(oval(EYE_X, EYE_Y - 4, 84), (d) =>
        cel(d, lightOf(c.base, 0.22), { by: [-8, -8], shade: c.shade }),
      ) + pair(oval(14, 574, 6, 10), (d) => fill(d, INK)),
  },
  {
    // Moon elf: violet, long swept ears and brows, cheek marks and a crescent.
    tones: ["#d6b3f5", "#a67ee6", "#6b55b5"],
    head: { cheek: 226, J: 198, jawY: 630, CW: 62, CY: 772, C: 792 },
    body: { nw: 100, sw: 366 },
    back: (c) =>
      pair(ELF_EAR, (d, side) =>
        cel(d, c.base, {
          shade: c.shade,
          inner: fill(
            flip(
              "M 240 446 C 300 430 372 374 420 306 C 390 400 320 466 244 494 Z",
              side,
            ),
            c.deep,
          ),
        }),
      ),
    face: (c) =>
      pair("M 196 510 Q 150 586 176 690 Q 96 596 196 510 Z", (d) =>
        fill(d, mix(c.base, "#3a1a70", 0.62)),
      ) +
      cel("M 6 262 A 34 34 0 1 0 6 330 A 46 46 0 0 1 6 262 Z", "#fff3a8", {
        by: [-4, -4],
        width: 8,
        shade: GOLD,
      }),
    front: () =>
      ink("M -8 520 Q -22 572 2 580 Q 18 580 22 566", 10) +
      pair(
        "M 22 408 Q 100 372 196 386 Q 276 374 336 310 Q 306 404 200 414 Q 100 400 28 428 Z",
        (d) => cel(d, "#f6f4ff", { by: [-6, -8], shade: "#b9b4e8", width: 10 }),
      ),
  },
];

/** One race in one skin tone: body, head and the race's own features. */
function figure(race, tone) {
  const base = race.tones[tone];
  const c = {
    base,
    shade: shadeOf(base),
    deep: shadeOf(base, 0.55),
    light: lightOf(base),
  };
  const { nw } = race.body;
  return (
    (race.back?.(c) ?? "") +
    cel(bodyPath(race.body), c.base, {
      shade: c.shade,
      inner:
        (race.torso?.(c) ?? "") +
        fill(oval(0, race.head.C + 2, nw + 96, 60), c.shade),
    }) +
    cel(headPath(race.head), c.base, {
      by: [-30, -22],
      shade: c.shade,
      inner:
        turn(-24, -104, 276, fill(oval(-104, 276, 74, 30), c.light, 0.9)) +
        (race.face?.(c) ?? ""),
    }) +
    race.front(c)
  );
}

/** Neutral bust behind single-item thumbnails, so small parts stay readable. */
const silhouette = (color) =>
  fill(bodyPath({ nw: 150, sw: 430 }), color) +
  fill(
    headPath({ cheek: 244, J: 250, jawY: 640, CW: 120, CY: 764, C: 782 }),
    color,
  );

/** Flat backdrop with a sunburst one shade darker, like a trading card. */
function background(color) {
  const dark = mix(color, "#1a0b2e", 0.2);
  let rays = "";
  for (let ray = 0; ray < 10; ray++) {
    const point = (step) => {
      const angle = (step / 20) * Math.PI * 2;
      return `${Math.cos(angle) * 900} ${470 + Math.sin(angle) * 900}`;
    };
    rays += `M 0 470 L ${point(ray * 2)} L ${point(ray * 2 + 1)} Z `;
  }
  return box(-600, -80, 1200, 1200, color) + fill(rays, dark, 0.55);
}

/** Spiky sun behind the head. */
function aura(color) {
  let rays = "";
  for (let ray = 0; ray < 16; ray++) {
    const angle = (ray / 16) * Math.PI * 2;
    const point = (offset, reach) =>
      `${Math.cos(angle + offset) * reach} ${470 + Math.sin(angle + offset) * reach}`;
    rays += `M ${point(-0.13, 250)} L ${point(0, ray % 2 ? 470 : 420)} L ${point(0.13, 250)} Z `;
  }
  return (
    ink(rays, 12) +
    fill(rays, color) +
    ink(oval(0, 470, 300), 12) +
    fill(oval(0, 470, 300), lightOf(color, 0.45))
  );
}

/** Shoulders shared by every armor, wider than the widest body. */
const ARMOR_SIDES = [
  [272, 794, 404, 834, 458, 886],
  [498, 928, 560, 990, 560, 1090],
  [0, 1090],
];
const ARMOR = symmetric(
  [0, 850],
  [[80, 850, 150, 826, 184, 780], ...ARMOR_SIDES],
);
/** Same shoulders with a V opening down to `depth`, showing the chest. */
const armorNotched = (depth) =>
  symmetric([0, depth], [[184, 780], ...ARMOR_SIDES]);
const NECKLINE = "M -184 780 C -150 826 -80 850 0 850 C 80 850 150 826 184 780";
const seams = (color) =>
  ink(
    "M -330 900 Q -262 1000 -280 1090 M 330 900 Q 262 1000 280 1090",
    9,
    shadeOf(color, 0.5),
  );

const armor = [
  // Leather vest, open over the chest, with a fur collar
  () =>
    cel(armorNotched(1016), LEATHER, {
      by: [-20, -14],
      inner:
        dash(
          "M -214 800 L -24 1040 M 214 800 L 24 1040",
          7,
          "#f1d9a8",
          "16 14",
        ) + seams(LEATHER),
    }) +
    cloud(
      [-1, 1].flatMap((side) => [
        [side * 172, 806, 36],
        [side * 224, 798, 40],
        [side * 280, 810, 38],
        [side * 334, 830, 34],
        [side * 380, 856, 28],
      ]),
      "#f4ead0",
    ),
  // Plate cuirass with a gold collar and a ruby
  () =>
    cel(ARMOR, STEEL, {
      by: [-22, -16],
      inner: ink("M 0 870 L 0 1090", 9, shadeOf(STEEL, 0.5)) + seams(STEEL),
    }) +
    cel(
      symmetric(
        [0, 850],
        [
          [80, 850, 150, 826, 184, 780],
          [220, 786, 250, 796, 270, 806],
          [220, 874, 110, 912, 0, 912],
        ],
      ),
      GOLD,
      { by: [-8, -10], shade: GOLD_DARK },
    ) +
    cel("M 0 922 L 34 966 L 0 1012 L -34 966 Z", RED, { by: [-8, -8] }),
  // Mage robe with a gold trim and stars
  () => {
    const color = "#3b55cf";
    return (
      cel(ARMOR, color, {
        by: [-22, -16],
        inner:
          seams(color) +
          cord("M -210 790 L 0 1016 L 210 790", 28, GOLD) +
          fill(
            star(-306, 960, 34) + star(318, 930, 26) + star(250, 1010, 18),
            GOLD,
          ),
      }) + cel(oval(0, 1016, 26), "#7fe6ff", { by: [-6, -6], width: 10 })
    );
  },
  // Guild tee with a ringer collar
  () =>
    cel(ARMOR, "#f3eee2", {
      by: [-22, -16],
      inner: seams("#f3eee2"),
    }) +
    cord(NECKLINE, 20, RED) +
    cord("M -50 928 L -25 1006 L 0 950 L 25 1006 L 50 928", 14, RED),
  // Degen hoodie
  () => {
    const color = "#7b4be0";
    return (
      cel(ARMOR, color, {
        by: [-22, -16],
        inner: seams(color) + ink("M 0 860 L 0 1090", 9, shadeOf(color, 0.5)),
      }) +
      pair(
        "M 40 866 C 96 852 170 822 196 770 C 252 782 270 820 246 850 C 190 892 110 906 44 906 Z",
        (d) =>
          cel(d, lightOf(color, 0.18), {
            by: [-8, -10],
            shade: shadeOf(color),
          }),
      ) +
      pair("M 52 900 L 44 996", (d) => cord(d, 9, SMOKE))
    );
  },
];

const necklace = [
  // Gold chain with a coin
  () => {
    const loop = "M -176 800 C -150 900 -70 946 0 948 C 70 946 150 900 176 800";
    return (
      cord(loop, 16, GOLD) +
      dash(loop, 16, INK, "5 23") +
      cel(oval(0, 972, 50), GOLD, { by: [-8, -8], shade: GOLD_DARK }) +
      ink(oval(0, 972, 36), 6, GOLD_DARK) +
      ink("M -22 954 L -11 992 L 0 966 L 11 992 L 22 954", 9)
    );
  },
  // Spiked pauldrons
  () =>
    pair(
      "M 214 838 C 262 762 430 752 492 846 C 520 900 560 980 560 1090 L 236 1090 C 204 1000 192 900 214 838 Z",
      (d, side) =>
        [
          "M 262 800 L 286 690 L 326 776 Z",
          "M 350 772 L 392 664 L 418 780 Z",
          "M 438 800 L 496 716 L 494 832 Z",
        ]
          .map((spike) =>
            cel(flip(spike, side), IVORY, { by: [-8, -4], shade: BONE }),
          )
          .join("") +
        cel(d, IRON, {
          by: [-18, -16],
          inner: ink(
            flip("M 236 880 C 290 812 420 810 478 884", side),
            16,
            GOLD,
          ),
        }),
    ),
  // Striped scarf
  () => {
    const wrap =
      "M -206 776 C -130 836 130 836 206 776 L 222 852 C 130 918 -130 918 -222 852 Z";
    return (
      cel("M -172 876 L -70 896 L -92 1070 L -196 1052 Z", RED, {
        by: [-8, -8],
        inner: ink("M -190 956 L -76 978 M -196 1016 L -82 1038", 16, CREAM),
      }) +
      cel(wrap, RED, {
        by: [-10, -12],
        inner: ink("M -216 812 C -130 876 130 876 216 812", 16, CREAM),
      })
    );
  },
];

const mouth = [
  // Smirk
  () =>
    ink(
      `M -74 ${MOUTH_Y + 2} Q -20 ${MOUTH_Y + 30} 40 ${MOUTH_Y + 8} Q 64 ${MOUTH_Y - 2} 74 ${MOUTH_Y - 26}`,
    ) + ink(`M 60 ${MOUTH_Y - 36} Q 84 ${MOUTH_Y - 30} 86 ${MOUTH_Y - 10}`, 8),
  // Grin
  () => {
    const open = `M -86 ${MOUTH_Y - 18} Q 0 ${MOUTH_Y + 4} 86 ${MOUTH_Y - 18} Q 84 ${MOUTH_Y + 56} 0 ${MOUTH_Y + 60} Q -84 ${MOUTH_Y + 56} -86 ${MOUTH_Y - 18} Z`;
    return (
      fill(open, "#5b1226") +
      clipTo(
        open,
        fill(oval(8, MOUTH_Y + 62, 46, 26), "#ef6f7c") +
          fill(
            `M -90 ${MOUTH_Y - 24} Q 0 ${MOUTH_Y} 90 ${MOUTH_Y - 24} L 84 ${MOUTH_Y + 8} Q 0 ${MOUTH_Y + 30} -84 ${MOUTH_Y + 8} Z`,
            WHITE,
          ) +
          ink(
            `M -84 ${MOUTH_Y + 8} Q 0 ${MOUTH_Y + 30} 84 ${MOUTH_Y + 8} M -44 ${MOUTH_Y - 14} L -42 ${MOUTH_Y + 22} M 0 ${MOUTH_Y - 6} L 0 ${MOUTH_Y + 28} M 44 ${MOUTH_Y - 14} L 42 ${MOUTH_Y + 22}`,
            6,
          ),
      ) +
      ink(open, 12)
    );
  },
  // Frown
  () =>
    ink(`M -72 ${MOUTH_Y + 26} Q 0 ${MOUTH_Y - 22} 72 ${MOUTH_Y + 26}`) +
    ink(`M -30 ${MOUTH_Y + 44} Q 0 ${MOUTH_Y + 54} 30 ${MOUTH_Y + 44}`, 8),
  // Gritted teeth
  () => {
    const open = `M -84 ${MOUTH_Y - 16} L 84 ${MOUTH_Y - 16} Q 92 ${MOUTH_Y + 14} 84 ${MOUTH_Y + 40} L -84 ${MOUTH_Y + 40} Q -92 ${MOUTH_Y + 14} -84 ${MOUTH_Y - 16} Z`;
    return (
      fill(open, WHITE) +
      ink(
        `M -86 ${MOUTH_Y + 12} L 86 ${MOUTH_Y + 12} M -42 ${MOUTH_Y - 16} L -42 ${MOUTH_Y + 40} M 0 ${MOUTH_Y - 16} L 0 ${MOUTH_Y + 40} M 42 ${MOUTH_Y - 16} L 42 ${MOUTH_Y + 40}`,
        6,
      ) +
      ink(open, 12)
    );
  },
];

/** Inner edge shared by the full beards: open around the mouth and the tusks. */
const BEARD_TOP = [
  [70, 746, 150, 734, 180, 664],
  [188, 600, 188, 530, 198, 468],
  [246, 468],
  [266, 540, 288, 600, 284, 684],
];
const strands = (color, d) => ink(d, 7, shadeOf(color, 0.45));

const beard = [
  // Braided: full, with two beaded braids
  () => {
    const mass = symmetric(
      [0, 742],
      [
        ...BEARD_TOP,
        [280, 790, 204, 868, 124, 892],
        [84, 904, 42, 912, 0, 912],
      ],
    );
    const braid = (x) =>
      [0, 1, 2]
        .map((step) =>
          cel(oval(x, 918 + step * 36, 27 - step * 3, 22 - step * 2), AUBURN, {
            by: [-6, -6],
          }),
        )
        .join("") +
      cel(oval(x, 1022, 15), GOLD, { by: [-4, -4], shade: GOLD_DARK });
    return (
      braid(-80) +
      braid(80) +
      cel(mass, AUBURN, {
        by: [-18, -12],
        inner: strands(
          AUBURN,
          "M -232 560 Q -238 700 -150 824 M 232 560 Q 238 700 150 824 M -96 790 Q -64 850 -76 900 M 96 790 Q 64 850 76 900 M 0 780 L 0 900",
        ),
      })
    );
  },
  // Mutton chops
  () =>
    pair(
      "M 198 464 L 246 464 C 274 540 306 624 290 706 C 276 770 204 782 178 728 C 192 664 186 562 198 464 Z",
      (d, side) =>
        cel(d, AUBURN, {
          by: [-10, -10],
          inner: strands(
            AUBURN,
            flip(
              "M 228 520 Q 262 620 240 730 M 204 600 Q 222 680 204 740",
              side,
            ),
          ),
        }),
    ),
  // Long grey, with matching mustache and brows
  () =>
    cel(
      symmetric(
        [0, 742],
        [
          ...BEARD_TOP,
          [296, 810, 210, 950, 70, 1034],
          [40, 1050, 16, 1056, 0, 1056],
        ],
      ),
      GREY,
      {
        by: [-18, -12],
        inner: strands(
          GREY,
          "M -232 560 Q -244 720 -150 880 M 232 560 Q 244 720 150 880 M -90 790 Q -50 900 -60 1010 M 90 790 Q 50 900 60 1010 M 0 780 L 0 1030",
        ),
      },
    ) +
    mustache(GREY) +
    bushyBrows(GREY),
];

const eyes = [
  // Smug: half-lidded side-eye
  () =>
    [-1, 1]
      .map((side) => {
        const x = side * EYE_X;
        const shape = `M ${x - 62} ${EYE_Y - 8} L ${x + 62} ${EYE_Y - 8} Q ${x + 66} ${EYE_Y + 54} ${x} ${EYE_Y + 56} Q ${x - 66} ${EYE_Y + 54} ${x - 62} ${EYE_Y - 8} Z`;
        return (
          fill(shape, WHITE) +
          clipTo(
            shape,
            box(x - 70, EYE_Y - 12, 140, 20, "#c8bfdc") +
              fill(oval(x + 24, EYE_Y + 18, 25), INK) +
              fill(oval(x + 15, EYE_Y + 10, 8), "#ffffff"),
          ) +
          ink(shape, 11) +
          ink(`M ${x - 72} ${EYE_Y - 8} L ${x + 72} ${EYE_Y - 8}`, 18)
        );
      })
      .join(""),
  // Fierce: slanted lids over yellow irises
  () =>
    pair(
      `M ${EYE_X - 62} ${EYE_Y + 16} L ${EYE_X + 64} ${EYE_Y - 20} Q ${EYE_X + 72} ${EYE_Y + 40} ${EYE_X + 8} ${EYE_Y + 54} Q ${EYE_X - 50} ${EYE_Y + 56} ${EYE_X - 62} ${EYE_Y + 16} Z`,
      (d, side) => {
        const x = side * (EYE_X - 2);
        return (
          fill(d, WHITE) +
          clipTo(
            d,
            fill(oval(x, EYE_Y + 24, 27), GOLD) +
              ink(oval(x, EYE_Y + 24, 27), 6) +
              fill(oval(x, EYE_Y + 24, 12), INK) +
              fill(oval(x - 9, EYE_Y + 14, 6), "#ffffff"),
          ) +
          ink(d, 11) +
          ink(
            flip(
              `M ${EYE_X - 74} ${EYE_Y + 20} L ${EYE_X + 74} ${EYE_Y - 24}`,
              side,
            ),
            18,
          )
        );
      },
    ),
  // Wide: bloodshot and sleepless
  () =>
    [-1, 1]
      .map((side) => {
        const x = side * EYE_X;
        const y = EYE_Y + 10;
        const shape = oval(x, y, 56);
        return (
          fill(shape, WHITE) +
          clipTo(
            shape,
            ink(
              `M ${x - 56} ${y - 20} L ${x - 30} ${y - 10} L ${x - 22} ${y - 14} M ${x + 56} ${y + 18} L ${x + 30} ${y + 12} L ${x + 24} ${y + 20} M ${x - 40} ${y + 40} L ${x - 22} ${y + 24}`,
              4,
              RED,
            ),
          ) +
          fill(oval(x + 4, y + 2, 15), INK) +
          fill(oval(x - 1, y - 3, 5), "#ffffff") +
          ink(shape, 11) +
          ink(`M ${x - 44} ${y + 74} Q ${x} ${y + 88} ${x + 44} ${y + 74}`, 7)
        );
      })
      .join(""),
  // Moonlit: glowing, without pupils
  () =>
    [-1, 1]
      .map((side) => {
        const x = side * EYE_X;
        const y = EYE_Y + 16;
        const shape = `M ${x - 64} ${y} Q ${x} ${y - 52} ${x + 64} ${y} Q ${x} ${y + 44} ${x - 64} ${y} Z`;
        return (
          glow(18, fill(oval(x, y, 98, 58), "#7fe6ff", 0.85)) +
          fill(shape, "#f2ffff") +
          clipTo(shape, fill(oval(x, y + 34, 70, 30), "#a6efff")) +
          ink(shape, 11)
        );
      })
      .join(""),
  // Laser: red-hot with a lens flare
  () =>
    [-1, 1]
      .map((side) => {
        const x = side * EYE_X;
        const y = EYE_Y + 14;
        return (
          glow(22, fill(oval(x, y, 104, 58), "#ff1f1f", 0.85)) +
          fill(oval(x, y, 60, 30), "#ff2b24") +
          ink(oval(x, y, 60, 30), 10) +
          fill(oval(x, y, 38, 15), "#ffd7a8") +
          fill(oval(x, y, 22, 8), "#ffffff") +
          fill(
            `M ${x - 190} ${y} L ${x} ${y - 9} L ${x + 190} ${y} L ${x} ${y + 9} Z`,
            "#fff3e0",
            0.95,
          ) +
          fill(
            `M ${x} ${y - 78} L ${x + 6} ${y} L ${x} ${y + 78} L ${x - 6} ${y} Z`,
            "#fff3e0",
            0.9,
          )
        );
      })
      .join(""),
  // Pixel shades
  () => {
    const u = 22;
    const top = EYE_Y - 50;
    let art = box(-11 * u, top, 22 * u, u);
    for (const left of [-10 * u, u]) {
      art +=
        box(left, top + u, 9 * u, u) +
        box(left + u, top + 2 * u, 7 * u, u) +
        box(left + 2 * u, top + 3 * u, 5 * u, u) +
        [
          [1, 1],
          [2, 2],
          [3, 1],
          [4, 2],
        ]
          .map(([column, row]) =>
            box(left + column * u, top + row * u, u, u, "#ffffff"),
          )
          .join("");
    }
    return art;
  },
];

const HAIR_BROWN = "#5a3620";
const HAIR_BLONDE = "#f4cd52";
const HAIR_BLACK = "#2b2333";

const hair = [
  // Short, with a jagged fringe
  () =>
    cel(
      "M -226 336 C -236 206 -148 162 0 162 C 148 162 236 206 226 336 L 190 290 L 156 326 L 112 280 L 70 316 L 26 274 L -20 310 L -66 272 L -110 312 L -152 280 L -190 322 Z",
      HAIR_BROWN,
      {
        inner: strands(
          HAIR_BROWN,
          "M -120 190 Q -150 230 -150 270 M -30 172 Q -50 220 -44 264 M 60 176 Q 80 220 76 300",
        ),
      },
    ),
  // Long, parted in the middle
  () =>
    cel(
      symmetric(
        [0, 162],
        [
          [152, 162, 244, 206, 240, 330],
          [276, 480, 340, 700, 316, 880],
          [306, 944, 250, 950, 230, 896],
          [250, 760, 240, 560, 210, 384],
          [160, 300, 70, 300, 0, 248],
        ],
      ),
      HAIR_BLONDE,
      {
        shade: mix(HAIR_BLONDE, "#a8641a", 0.5),
        inner: ink(
          "M 0 166 L 0 248 M -252 500 Q -290 700 -276 890 M 252 500 Q 290 700 276 890 M -150 200 Q -190 250 -200 330 M 150 200 Q 190 250 200 330",
          7,
          mix(HAIR_BLONDE, "#a8641a", 0.6),
        ),
      },
    ),
  // Mohawk
  () =>
    cel(
      "M -60 214 L -84 108 L -44 148 L -32 24 L 4 124 L 36 40 L 52 148 L 92 100 L 60 214 Q 30 236 0 264 Q -30 236 -60 214 Z",
      RED,
      {
        by: [-12, -6],
        inner: strands(
          RED,
          "M -34 70 L -22 200 M 34 86 L 22 200 M 0 150 L 0 240",
        ),
      },
    ),
  // Topknot
  () =>
    cel(
      "M -34 110 L -58 14 L -14 66 L 4 -6 L 24 66 L 62 20 L 36 112 Z",
      HAIR_BLACK,
      {
        by: [-8, -4],
        shade: "#120d18",
      },
    ) +
    cel(oval(0, 128, 54, 46), HAIR_BLACK, { by: [-10, -8], shade: "#120d18" }) +
    cel(
      "M -220 318 C -228 212 -142 168 0 168 C 142 168 228 212 220 318 Q 110 262 0 284 Q -110 262 -220 318 Z",
      HAIR_BLACK,
      {
        shade: "#120d18",
        inner: ink(
          "M -120 200 Q -80 180 -40 178 M -150 240 Q -100 206 -30 204",
          7,
          "#5a4d6b",
        ),
      },
    ) +
    cel("M -44 160 L 44 160 L 40 186 L -40 186 Z", RED, { by: [-4, -6] }),
];

const stud = (x, y, r = 9) => fill(oval(x, y, r), GOLD) + ink(oval(x, y, r), 6);

const headgear = [
  // Iron helm with horns and a nose guard
  () =>
    pair(
      "M 178 262 C 262 262 318 196 322 56 C 388 180 352 330 214 342 Z",
      (d, side) =>
        cel(d, IVORY, {
          by: [-12, -8],
          shade: BONE,
          inner: ink(
            flip(
              "M 250 252 Q 262 290 248 326 M 296 206 Q 316 250 306 300",
              side,
            ),
            7,
            BONE,
          ),
        }),
    ) +
    cel(
      "M -240 380 C -250 206 -152 160 0 160 C 152 160 250 206 240 380 L 66 350 L 36 356 L 28 512 L -28 512 L -36 356 L -66 350 Z",
      STEEL,
      {
        by: [-22, -16],
        inner: ink(
          "M 0 164 L 0 356 M -236 330 L -66 304 L -36 310 M 236 330 L 66 304 L 36 310",
          10,
          shadeOf(STEEL, 0.5),
        ),
      },
    ) +
    [-190, -120, 120, 190].map((x) => stud(x, 340)).join(""),
  // Wool cap with a pom-pom
  () =>
    cloud(
      [
        [-24, 122, 30],
        [24, 118, 32],
        [0, 92, 30],
      ],
      WHITE,
    ) +
    cel(
      "M -236 330 C -246 196 -152 140 0 140 C 152 140 246 196 236 330 Z",
      "#d6453d",
      {
        inner: ink(
          "M -124 160 Q -146 240 -140 300 M -42 146 Q -52 230 -50 290 M 42 146 Q 52 230 50 290 M 124 160 Q 146 240 140 300",
          8,
          shadeOf("#d6453d", 0.4),
        ),
      },
    ) +
    cel("M -250 300 Q 0 262 250 300 L 246 372 Q 0 338 -246 372 Z", CREAM, {
      by: [-10, -10],
      inner: ink(
        [-200, -150, -100, -50, 0, 50, 100, 150, 200]
          .map((x) => `M ${x} 270 L ${x} 372`)
          .join(" "),
        7,
        shadeOf(CREAM, 0.35),
      ),
    }),
  // Crown
  () =>
    cel(
      "M -180 270 L -198 122 L -142 206 L -98 94 L -48 206 L 0 62 L 48 206 L 98 94 L 142 206 L 198 122 L 180 270 Q 0 308 -180 270 Z",
      GOLD,
      {
        by: [-14, -10],
        shade: GOLD_DARK,
        inner: ink("M -188 224 Q 0 262 188 224", 8, GOLD_DARK),
      },
    ) +
    [
      [-198, 118],
      [-98, 90],
      [0, 58],
      [98, 90],
      [198, 118],
    ]
      .map(([x, y]) =>
        cel(oval(x, y, 15), GOLD, { by: [-4, -4], shade: GOLD_DARK, width: 9 }),
      )
      .join("") +
    cel(oval(0, 266, 17), RED, { by: [-4, -4], width: 9 }) +
    pair(oval(98, 256, 13), (d) =>
      cel(d, "#3f8bff", { by: [-4, -4], width: 9 }),
    ),
];

const smoke = [
  // Cigar
  () =>
    turn(
      17,
      66,
      MOUTH_Y + 8,
      cel(
        `M 62 ${MOUTH_Y - 10} L 216 ${MOUTH_Y - 10} L 216 ${MOUTH_Y + 26} L 62 ${MOUTH_Y + 26} Q 50 ${MOUTH_Y + 8} 62 ${MOUTH_Y - 10} Z`,
        "#8a5a2b",
        { by: [-2, -10], width: 11 },
      ) +
        cel(
          `M 216 ${MOUTH_Y - 10} L 244 ${MOUTH_Y - 8} Q 256 ${MOUTH_Y + 8} 244 ${MOUTH_Y + 24} L 216 ${MOUTH_Y + 26} Z`,
          "#e9e4dc",
          { by: [-2, -8], width: 11 },
        ) +
        box(220, MOUTH_Y - 4, 12, 24, "#ff7a1f") +
        box(100, MOUTH_Y - 10, 22, 36, GOLD) +
        ink(
          `M 100 ${MOUTH_Y - 10} L 100 ${MOUTH_Y + 26} M 122 ${MOUTH_Y - 10} L 122 ${MOUTH_Y + 26}`,
          6,
        ),
    ) +
    cloud(
      [
        [330, 640, 34],
        [366, 618, 30],
        [352, 660, 26],
      ],
      SMOKE,
    ) +
    cloud(
      [
        [388, 548, 26],
        [416, 532, 22],
      ],
      SMOKE,
    ) +
    cloud([[404, 470, 18]], SMOKE),
  // Bent briar pipe
  () =>
    cord(
      `M 58 ${MOUTH_Y + 8} Q 140 ${MOUTH_Y + 90} 232 ${MOUTH_Y + 62}`,
      16,
      "#3a2a22",
    ) +
    cel(
      `M 194 ${MOUTH_Y + 4} L 280 ${MOUTH_Y + 4} L 272 ${MOUTH_Y + 84} Q 237 ${MOUTH_Y + 112} 202 ${MOUTH_Y + 84} Z`,
      WOOD,
      { by: [-8, -8] },
    ) +
    cel(oval(237, MOUTH_Y + 4, 46, 13), "#ff7a1f", { by: [0, 0], width: 10 }) +
    cloud(
      [
        [262, 600, 30],
        [296, 582, 26],
        [282, 622, 22],
      ],
      SMOKE,
    ) +
    cloud(
      [
        [318, 512, 22],
        [342, 498, 18],
      ],
      SMOKE,
    ) +
    cloud([[330, 440, 15]], SMOKE),
  // Long clay pipe
  () =>
    cord(`M 58 ${MOUTH_Y + 8} L 312 ${MOUTH_Y + 44}`, 12, "#f1ece0") +
    cel(
      `M 290 ${MOUTH_Y - 16} L 346 ${MOUTH_Y - 16} L 340 ${MOUTH_Y + 50} Q 318 ${MOUTH_Y + 66} 296 ${MOUTH_Y + 50} Z`,
      "#f1ece0",
      { by: [-6, -6] },
    ) +
    cloud(
      [
        [336, 588, 26],
        [364, 572, 22],
      ],
      SMOKE,
    ) +
    cloud([[376, 506, 18]], SMOKE) +
    cloud([[366, 446, 13]], SMOKE),
];

const held = [
  // Foaming mug
  () =>
    cel(
      "M 404 806 C 506 792 524 954 410 958 L 410 918 C 462 912 454 846 404 848 Z",
      WOOD,
      { by: [-6, -6] },
    ) +
    cel("M 236 770 L 420 770 L 410 1000 L 246 1000 Z", WOOD, {
      by: [-16, -10],
      inner: ink(
        "M 296 770 L 300 1000 M 356 770 L 352 1000",
        7,
        shadeOf(WOOD, 0.5),
      ),
    }) +
    cel("M 232 822 L 424 822 L 422 856 L 234 856 Z", STEEL, {
      by: [-6, -6],
      width: 9,
    }) +
    cel("M 240 930 L 418 930 L 416 962 L 242 962 Z", STEEL, {
      by: [-6, -6],
      width: 9,
    }) +
    cloud(
      [
        [258, 760, 34],
        [314, 742, 42],
        [374, 756, 36],
        [414, 784, 24],
        [238, 802, 22],
      ],
      "#fff8e6",
    ),
  // Torch
  () =>
    cord("M 390 660 L 380 1120", 26, WOOD) +
    cel(
      "M 392 352 C 474 446 490 560 454 624 C 432 660 348 660 328 624 C 298 560 330 510 352 468 C 364 510 380 500 392 352 Z",
      "#ff8a1f",
      {
        by: [-10, -6],
        shade: RED,
        inner: fill(
          "M 392 474 C 432 534 438 584 422 616 C 410 636 372 636 362 616 C 350 584 372 562 380 538 C 386 558 390 542 392 474 Z",
          "#ffe14a",
        ),
      },
    ) +
    cel("M 336 636 L 444 636 L 430 708 L 350 708 Z", IRON, { by: [-8, -8] }),
  // Double-bladed axe
  () => {
    const blade =
      "M 10 -30 C 50 -40 78 -84 84 -128 C 150 -70 150 70 84 128 C 78 84 50 40 10 30 Z";
    const edge = "M 84 -128 C 150 -70 150 70 84 128 C 116 60 116 -60 84 -128 Z";
    return turn(
      8,
      396,
      596,
      cord("M 396 452 L 396 1140", 26, WOOD) +
        `<g transform="translate(396 596)">` +
        pair(blade, (d, side) =>
          cel(d, STEEL, {
            by: [-10, -10],
            inner: fill(flip(edge, side), lightOf(STEEL, 0.6)),
          }),
        ) +
        cel("M -24 -44 L 24 -44 L 24 44 L -24 44 Z", IRON, { by: [-6, -6] }) +
        `</g>`,
    );
  },
];

/** Rarity ring with gold studs. */
function frame(color) {
  const ring = oval(0, 512, 486);
  let studs = "";
  for (let index = 0; index < 8; index++) {
    const angle = (index / 8) * Math.PI * 2 + Math.PI / 8;
    studs += cel(
      oval(Math.cos(angle) * 486, 512 + Math.sin(angle) * 486, 20),
      GOLD,
      { by: [-5, -5], shade: GOLD_DARK, width: 9 },
    );
  }
  return (
    cord(ring, 38, color) +
    ink(oval(0, 512, 494), 7, lightOf(color, 0.6)) +
    studs
  );
}

/**
 * Artwork per category; counts and order must match `avatar.config.ts`.
 * Skin entries take the race because the tone follows its body.
 */
const layers = {
  background: [
    "#b9713d",
    "#3f7fe0",
    "#e8553d",
    "#3fae6a",
    "#8a56e2",
    "#f2b233",
  ].map((color) => () => background(color)),
  aura: ["#ffd23a", "#c084ff", "#7fd0ff"].map((color) => () => aura(color)),
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
const FULL = [0, 0, 1024, 1024];
const FACE = [132, 110, 760, 760];
const BUST = [32, 40, 960, 960];
const HEAD = [112, 0, 800, 800];
const TORSO = [172, 344, 680, 680];
/** How each category's thumbnail is cropped so its artwork fills the tile. */
const thumbViews = {
  race: BUST,
  skin: FACE,
  mouth: [312, 472, 400, 400],
  beard: [162, 400, 700, 700],
  eyes: [232, 222, 560, 560],
  hair: HEAD,
  headgear: HEAD,
  smoke: [372, 380, 600, 600],
  armor: TORSO,
  necklace: [82, 164, 860, 860],
  held: [404, 404, 620, 620],
};

/**
 * The hand-drawn line: every outline is nudged by the same low-frequency
 * noise. It is pinned to canvas coordinates, so stacked layers bend alike.
 */
const WOBBLE = `<filter id="wobble" filterUnits="userSpaceOnUse" x="-60" y="-60" width="1144" height="1144"><feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="2" seed="7" result="warp"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>`;

/** Rendered margin, as a fraction of the image, that `write` crops away. */
const MARGIN = 1 / 32;

/**
 * Stacks recipes into one SVG document. Wobbled parts are filtered one by one
 * so they bend exactly as they do when drawn as separate layers. The extra
 * margin gives pixels at the canvas edge real neighbours to bend with.
 */
function render(parts, size, [x, y, width, height] = FULL) {
  defs = [];
  const body = parts
    .map(([draw, wobble = true]) => {
      const content = `<g transform="translate(512 0)">${draw()}</g>`;
      return wobble ? `<g filter="url(#wobble)">${content}</g>` : content;
    })
    .join("");
  const pad = width * MARGIN;
  const pixels = size * (1 + 2 * MARGIN);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pixels}" height="${pixels}" viewBox="${x - pad} ${y - pad} ${width + 2 * pad} ${height + 2 * pad}"><defs>${WOBBLE}${defs.join("")}</defs>${body}</svg>`;
}

async function write(file, svg, size) {
  mkdirSync(dirname(file), { recursive: true });
  const edge = size * MARGIN;
  await sharp(Buffer.from(svg))
    .extract({ left: edge, top: edge, width: size, height: size })
    .png({ compressionLevel: 9 })
    .toFile(file);
}

const backdrop = () => box(-600, -80, 1200, 1200, "#3d2f22");
const bust = (color) => () => silhouette(color);

function thumbnail(category, index, draw) {
  if (category === "background") return [[draw, false]];
  if (category === "race") return [[backdrop, false], [draw]];
  if (category === "skin")
    return [[backdrop, false], [bust(SKIN_SWATCHES[index])]];
  if (category === "aura")
    return [[backdrop, false], [draw], [bust("#857059")]];
  return [[backdrop, false], [bust("#857059")], [draw]];
}

let count = 0;
for (const [category, recipes] of Object.entries(layers)) {
  const wobble = category !== "background";
  for (const [index, recipe] of recipes.entries()) {
    const number = String(index + 1).padStart(2, "0");
    if (typeof recipe === "function") {
      await write(
        join(root, "layers", category, `${number}.png`),
        render([[recipe, wobble]], 1024),
        1024,
      );
      count += 1;
    } else {
      for (const [raceIndex, race] of RACES.entries()) {
        const raceId = `race_${String(raceIndex + 1).padStart(2, "0")}`;
        await write(
          join(root, "layers", category, `${number}-${raceId}.png`),
          render([[() => recipe.perRace(race)]], 1024),
          1024,
        );
        count += 1;
      }
    }
    await write(
      join(root, "thumbs", category, `${number}.png`),
      render(thumbnail(category, index, recipe), 128, thumbViews[category]),
      128,
    );
    count += 1;
  }
}
console.log(`Wrote ${count} avatar files to ${root}`);
