/**
 * Draws the avatar forge layers as flat, glossy vector art and rasterizes them
 * into `public/avatar`. Every layer shares the same face anchors (eyes, mouth,
 * crown of the head) so any combination lines up on any race.
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
const EYE_X = 92;
const EYE_Y = 430;
const MOUTH_Y = 592;

const INK = "#1b1030";
const GOLD = "#f5b82e";
const GOLD_DARK = "#a8690f";
const STEEL = "#aeb8c4";
const STEEL_DARK = "#8792a0";
const IVORY = "#fbf1cf";
const AUBURN = "#b24e1c";
const GREY = "#cfcbc1";
const WOOD = "#8a5426";
const CORAL = "#ff7a45";
const CREAM = "#f7efc0";

let uid = 0;
const nextId = () => `i${++uid}`;

const channels = (color) =>
  [1, 3, 5].map((start) => Number.parseInt(color.slice(start, start + 2), 16));

/** Blends two hex colors; highlights and shadows derive from one base tone. */
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

/** Draws a right-hand shape and its mirror image across the face. */
const both = (shape) => `${shape}<g transform="scale(-1 1)">${shape}</g>`;

const headPath = ({ T, W, J, C }) =>
  `M0 ${T}C${W * 0.78} ${T} ${W} ${T + 95} ${W} 440C${W} 545 ${J} ${C} 0 ${C}` +
  `C${-J} ${C} ${-W} 545 ${-W} 440C${-W} ${T + 95} ${-W * 0.78} ${T} 0 ${T}Z`;

const bodyPath = ({ nw, sw }) =>
  `M${-sw} 1024C${-sw} 880 ${-sw * 0.6} 830 ${-nw} 815L${-nw} 600L${nw} 600` +
  `L${nw} 815C${sw * 0.6} 830 ${sw} 880 ${sw} 1024Z`;

function mustache(color, grow = 0) {
  return (
    `<path d="M0 538C40 516 112 522 152 582C112 574 52 590 0 562C-52 590 -112 574 -152 582C-112 522 -40 516 0 538Z" fill="${color}" stroke="${color}" stroke-width="${grow}" stroke-linejoin="round"/>` +
    `<path d="M-118 556Q-70 530 -18 546" fill="none" stroke="${mix(color, "#ffffff", 0.35)}" stroke-width="7" stroke-linecap="round" opacity=".6"/>`
  );
}

const brows = (color, width) =>
  both(
    `<path d="M30 356Q95 322 164 362" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`,
  );

/**
 * Races, in the order of the `race` category in `avatar.config.ts`. `back` is
 * drawn behind the head, `torso` over the body, `inside` clipped to the head
 * and `front` on top of it. `tones` are the three skin options.
 */
const RACES = [
  {
    // Dwarf: stocky, round ears, bulbous nose, bushy brows, braided mustache.
    tones: ["#f6cfa6", "#dc9d6f", "#8f5d3f"],
    head: { T: 235, W: 206, J: 192, C: 648 },
    body: { nw: 108, sw: 310 },
    back: (c, { W }) =>
      both(
        `<circle cx="${W + 6}" cy="455" r="42" fill="${c.base}"/><circle cx="${W + 10}" cy="455" r="20" fill="${c.sh}"/>`,
      ),
    front: (c) =>
      both(
        `<ellipse cx="128" cy="528" rx="40" ry="24" fill="#f0705a" opacity=".4"/>`,
      ) +
      brows(AUBURN, 30) +
      both(
        `<ellipse cx="150" cy="612" rx="21" ry="19" fill="${AUBURN}"/><ellipse cx="150" cy="642" rx="20" ry="18" fill="${mix(AUBURN, INK, 0.15)}"/><ellipse cx="150" cy="670" rx="19" ry="17" fill="${AUBURN}"/>` +
          `<path d="M134 698L166 698L150 742Z" fill="${AUBURN}"/><rect x="130" y="684" width="40" height="17" rx="6" fill="${GOLD}"/>`,
      ) +
      mustache(AUBURN) +
      `<ellipse cx="0" cy="506" rx="52" ry="42" fill="${mix(c.base, "#e2553a", 0.42)}"/>` +
      `<ellipse cx="-17" cy="489" rx="15" ry="9" fill="#ffffff" opacity=".45"/>`,
  },
  {
    // Orc: green, heavy jaw, pointed ears, scowling brow and tusks.
    tones: ["#a5d45f", "#72aa3c", "#3f7332"],
    head: { T: 235, W: 205, J: 205, C: 674 },
    body: { nw: 112, sw: 365 },
    back: (c, { W }) =>
      both(
        `<path d="M${W - 25} 392L${W + 108} 348Q${W + 62} 448 ${W - 25} 492Z" fill="${c.base}"/>` +
          `<path d="M${W - 5} 412L${W + 72} 386Q${W + 42} 440 ${W - 5} 468Z" fill="${c.sh}"/>`,
      ) +
      `<circle cx="${-(W + 46)}" cy="456" r="17" fill="none" stroke="${GOLD}" stroke-width="8"/>`,
    front: (c) =>
      both(
        `<path d="M28 374L172 336" fill="none" stroke="${c.deep}" stroke-width="28" stroke-linecap="round"/>`,
      ) +
      `<ellipse cx="0" cy="506" rx="44" ry="30" fill="${c.sh}" opacity=".55"/>` +
      both(`<ellipse cx="16" cy="512" rx="7" ry="11" fill="${c.deep}"/>`) +
      `<path d="M-118 646Q0 676 118 646" fill="none" stroke="${c.sh}" stroke-width="10" stroke-linecap="round" opacity=".7"/>` +
      both(
        `<path d="M72 644Q78 572 116 530Q126 592 110 644Z" fill="${IVORY}"/>` +
          `<path d="M98 644Q108 600 113 548Q124 596 110 644Z" fill="#d9c79a"/>`,
      ),
  },
  {
    // Murloc: teal fish-folk with a spined crest, side fins and a pale jaw.
    tones: ["#7fe0cb", "#2fb0a5", "#1f6f86"],
    head: { T: 238, W: 208, J: 150, C: 645 },
    body: { nw: 50, sw: 235 },
    back: (c, { W }) =>
      `<path d="M-88 300L-62 150L-24 236L4 112L36 236L70 160L92 300Z" fill="${CORAL}"/>` +
      `<path d="M-50 280L-58 190M2 280L4 160M52 280L66 196" fill="none" stroke="${mix(CORAL, INK, 0.3)}" stroke-width="6" stroke-linecap="round"/>` +
      both(
        `<path d="M${W - 24} 418L${W + 112} 336L${W + 72} 420L${W + 128} 452L${W + 72} 482L${W + 102} 548L${W - 24} 500Z" fill="${CORAL}"/>` +
          `<path d="M${W} 440L${W + 70} 400M${W} 458L${W + 80} 452M${W} 476L${W + 64} 500" fill="none" stroke="${mix(CORAL, INK, 0.3)}" stroke-width="6" stroke-linecap="round"/>`,
      ),
    torso: () =>
      `<ellipse cx="0" cy="1004" rx="120" ry="132" fill="${CREAM}"/>`,
    inside: () =>
      `<ellipse cx="0" cy="655" rx="205" ry="100" fill="${CREAM}"/>`,
    front: (c) =>
      `<circle cx="118" cy="298" r="18" fill="${c.deep}" opacity=".3"/>` +
      `<circle cx="158" cy="352" r="11" fill="${c.deep}" opacity=".3"/>` +
      `<circle cx="72" cy="272" r="9" fill="${c.deep}" opacity=".3"/>` +
      both(`<circle cx="12" cy="516" r="5" fill="${c.deep}"/>`),
  },
  {
    // Night elf: violet, long swept ears, long pale brows, cheek markings, moon.
    tones: ["#d3b3f5", "#a07fe0", "#5d4aa8"],
    head: { T: 235, W: 182, J: 78, C: 672 },
    body: { nw: 46, sw: 255 },
    back: (c, { W }) =>
      both(
        `<path d="M${W - 28} 412C${W + 60} 378 ${W + 150} 300 ${W + 208} 212C${W + 160} 380 ${W + 72} 482 ${W - 28} 506Z" fill="${c.base}"/>` +
          `<path d="M${W} 432C${W + 60} 400 ${W + 120} 340 ${W + 168} 276C${W + 130} 380 ${W + 62} 452 ${W} 478Z" fill="${c.sh}"/>`,
      ),
    front: (c, { W }) => {
      const moon = nextId();
      return (
        both(
          `<path d="M34 352Q120 326 200 340Q250 336 ${W + 105} 296Q250 362 200 360Q120 350 38 372Z" fill="#f1f6ff"/>`,
        ) +
        both(
          `<path d="M152 496Q118 548 140 612Q92 556 152 496Z" fill="${c.deep}" opacity=".8"/>` +
            `<path d="M112 504Q92 540 104 580Q72 544 112 504Z" fill="${c.deep}" opacity=".8"/>`,
        ) +
        `<path d="M-13 500L13 500L0 520Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="6" stroke-linejoin="round"/>` +
        `<clipPath id="${moon}"><path clip-rule="evenodd" d="M-60 260H60V380H-60ZM-9 316a21 21 0 1 0 42 0a21 21 0 1 0 -42 0Z"/></clipPath>` +
        `<circle cx="0" cy="322" r="26" fill="#fff3b0" clip-path="url(#${moon})"/>`
      );
    },
  },
];

/** One race in one skin tone: body, shaded head and the race's own features. */
function figure(race, tone) {
  const base = race.tones[tone];
  const c = {
    base,
    hi: mix(base, "#ffffff", 0.4),
    sh: mix(base, INK, 0.26),
    deep: mix(base, INK, 0.58),
  };
  const head = headPath(race.head);
  const clip = nextId();
  const { nw, sw } = race.body;
  const chin = race.head.C + 46;
  return (
    (race.back?.(c, race.head) ?? "") +
    `<path d="${bodyPath(race.body)}" fill="${c.base}"/>` +
    `<rect x="${-nw}" y="600" width="${nw * 2}" height="${chin - 600}" fill="${c.sh}"/>` +
    `<ellipse cx="0" cy="${chin}" rx="${nw}" ry="30" fill="${c.sh}"/>` +
    `<ellipse cx="${-sw * 0.55}" cy="912" rx="${sw * 0.2}" ry="20" transform="rotate(-18 ${-sw * 0.55} 912)" fill="${c.hi}" opacity=".5"/>` +
    (race.torso?.(c) ?? "") +
    `<clipPath id="${clip}"><path d="${head}"/></clipPath>` +
    `<path d="${head}" fill="${c.sh}"/>` +
    `<g clip-path="url(#${clip})"><path d="${head}" transform="translate(-24 -18)" fill="${c.base}"/>${race.inside?.(c) ?? ""}</g>` +
    `<ellipse cx="${-race.head.W * 0.5}" cy="322" rx="60" ry="27" transform="rotate(-32 ${-race.head.W * 0.5} 322)" fill="${c.hi}" opacity=".6"/>` +
    `<circle cx="${-race.head.W * 0.2}" cy="276" r="10" fill="${c.hi}" opacity=".6"/>` +
    race.front(c, race.head)
  );
}

/** Neutral bust behind single-item thumbnails, so small parts stay readable. */
const silhouette = (color) =>
  `<path d="${bodyPath({ nw: 66, sw: 290 })}" fill="${color}"/>` +
  `<path d="${headPath({ T: 235, W: 200, J: 165, C: 652 })}" fill="${color}"/>`;

const background = (color) =>
  `<rect x="-512" y="0" width="1024" height="1024" fill="${color}"/>`;

function aura(color) {
  const id = nextId();
  let rays = "";
  for (let ray = 0; ray < 12; ray++) {
    const angle = (ray / 12) * Math.PI * 2;
    const point = (offset) =>
      `${Math.cos(angle + offset) * 760} ${470 + Math.sin(angle + offset) * 760}`;
    rays += `<path d="M0 470L${point(-0.09)}L${point(0.09)}Z" fill="${color}" opacity=".22"/>`;
  }
  return (
    `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity=".95"/><stop offset=".55" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>` +
    rays +
    `<circle cx="0" cy="470" r="480" fill="url(#${id})"/>`
  );
}

const ARMOR_BASE =
  "M-392 1024C-392 880 -262 818 -102 792Q0 852 102 792C262 818 392 880 392 1024Z";
/** Same shoulders with a V opening down to `depth`, showing the chest. */
const armorNotched = (depth) =>
  `M-392 1024C-392 880 -262 818 -102 792L0 ${depth}L102 792C262 818 392 880 392 1024Z`;
const shoulderShine = (color) =>
  `<ellipse cx="-250" cy="872" rx="72" ry="18" transform="rotate(-20 -250 872)" fill="${color}" opacity=".7"/>`;

const armor = [
  // Leather vest
  `<path d="${armorNotched(950)}" fill="#8b5a2b"/>` +
    `<path d="M-102 792L0 950L102 792" fill="none" stroke="#c98d4a" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="M-250 852L-212 1024M250 852L212 1024" fill="none" stroke="#5e3a18" stroke-width="8" stroke-dasharray="14 12"/>` +
    shoulderShine("#b07a42"),
  // Plate cuirass
  `<path d="${ARMOR_BASE}" fill="${STEEL}"/>` +
    `<path d="M120 800C262 818 392 880 392 1024L250 1024C270 920 220 850 120 800Z" fill="${STEEL_DARK}"/>` +
    `<path d="M0 846L0 1024" fill="none" stroke="${STEEL_DARK}" stroke-width="10"/>` +
    `<path d="M-130 800Q0 880 130 800L120 770Q0 838 -120 770Z" fill="#d7dee6" stroke="${GOLD}" stroke-width="8" stroke-linejoin="round"/>` +
    both(
      `<circle cx="300" cy="940" r="11" fill="${GOLD}"/><circle cx="205" cy="890" r="9" fill="${GOLD}"/>`,
    ) +
    shoulderShine("#e6ebf0"),
  // Mage robe
  both(`<path d="M68 815L140 695L158 828Z" fill="#54309c"/>`) +
    `<path d="${armorNotched(900)}" fill="#6a3fc2"/>` +
    `<path d="M-102 792L0 900L102 792M0 900L0 1024" fill="none" stroke="${GOLD}" stroke-width="18" stroke-linejoin="round" stroke-linecap="round"/>` +
    both(
      `<path d="M190 900L200 922L222 930L200 938L190 960L180 938L158 930L180 922Z" fill="${GOLD}"/>`,
    ) +
    shoulderShine("#8f66de"),
  // Guild tee
  `<path d="${ARMOR_BASE}" fill="#1d1d24"/>` +
    `<path d="M-102 792Q0 852 102 792" fill="none" stroke="#3a3a47" stroke-width="16" stroke-linecap="round"/>` +
    shoulderShine("#3a3a47"),
];

const necklace = [
  // Gold chain
  `<path d="M-94 805Q0 965 94 805" fill="none" stroke="${GOLD_DARK}" stroke-width="15" stroke-linecap="round"/>` +
    `<path d="M-94 805Q0 965 94 805" fill="none" stroke="#f7c23c" stroke-width="11" stroke-dasharray="18 8" stroke-linecap="round"/>` +
    `<circle cx="0" cy="892" r="22" fill="${GOLD}" stroke="${GOLD_DARK}" stroke-width="6"/>`,
  // Pauldrons
  both(
    `<path d="M190 835L205 745L245 805Z" fill="#e6ebf0"/><path d="M262 790L290 695L322 778Z" fill="#e6ebf0"/><path d="M345 778L385 700L400 792Z" fill="#e6ebf0"/>` +
      `<path d="M172 905C182 792 302 742 422 802C452 880 444 960 424 1024L192 1024Z" fill="${STEEL}" stroke="${GOLD}" stroke-width="10" stroke-linejoin="round"/>` +
      `<path d="M205 935C240 852 330 822 420 852" fill="none" stroke="${STEEL_DARK}" stroke-width="10" stroke-linecap="round"/>` +
      `<ellipse cx="270" cy="822" rx="50" ry="13" transform="rotate(-22 270 822)" fill="#e6ebf0" opacity=".8"/>`,
  ),
  // Scarf
  `<path d="M40 850L120 838L140 990L110 975L92 1000L70 978L48 998Z" fill="#b82e25"/>` +
    `<path d="M-135 765Q0 810 135 765L140 838Q0 890 -140 838Z" fill="#d63a2f"/>` +
    `<path d="M-137 802Q0 850 137 802" fill="none" stroke="#f3d9a0" stroke-width="12"/>` +
    `<path d="M46 930L136 918" fill="none" stroke="#f3d9a0" stroke-width="12"/>`,
];

const mouth = [
  // Smile
  `<path d="M-46 ${MOUTH_Y - 6}Q0 ${MOUTH_Y + 34} 46 ${MOUTH_Y - 6}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`,
  // Shout
  `<ellipse cx="0" cy="${MOUTH_Y + 6}" rx="40" ry="32" fill="#3a0f1e"/>` +
    `<rect x="-22" y="${MOUTH_Y - 22}" width="44" height="12" rx="4" fill="#ffffff"/>` +
    `<ellipse cx="0" cy="${MOUTH_Y + 23}" rx="22" ry="11" fill="#ff6b6b"/>`,
  // Frown
  `<path d="M-40 ${MOUTH_Y + 16}Q0 ${MOUTH_Y - 14} 40 ${MOUTH_Y + 16}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`,
];

const beardShine = (color) =>
  `<path d="M-196 520Q-205 640 -150 720" fill="none" stroke="${mix(color, "#ffffff", 0.3)}" stroke-width="10" stroke-linecap="round" opacity=".6"/>`;

const beard = [
  // Braided: a chin curtain that leaves the mouth, mustache and tusks showing.
  both(
    `<ellipse cx="62" cy="826" rx="30" ry="24" fill="${AUBURN}"/><ellipse cx="62" cy="862" rx="27" ry="22" fill="${mix(AUBURN, INK, 0.15)}"/>` +
      `<path d="M40 900L84 900L62 962Z" fill="${AUBURN}"/><rect x="36" y="880" width="52" height="22" rx="8" fill="${GOLD}"/>`,
  ) +
    `<path d="M-215 440C-240 560 -215 720 -120 790Q0 842 120 790C215 720 240 560 215 440L178 455C185 560 140 636 0 636C-140 636 -185 560 -178 455Z" fill="${AUBURN}"/>` +
    beardShine(AUBURN),
  // Mutton chops
  both(
    `<path d="M214 432C226 540 214 632 150 664C122 640 136 590 150 560C174 520 180 470 178 440Z" fill="${AUBURN}"/>` +
      `<path d="M200 470Q206 560 172 624" fill="none" stroke="${mix(AUBURN, INK, 0.2)}" stroke-width="8" stroke-linecap="round"/>`,
  ),
  // Long grey: covers the dwarf's own brows and mustache with grey ones.
  `<path fill-rule="evenodd" d="M-215 440C-250 600 -200 800 0 944C200 800 250 600 215 440L178 455C180 520 140 548 0 552C-140 548 -180 520 -178 455ZM-62 598a62 40 0 1 0 124 0a62 40 0 1 0 -124 0Z" fill="${GREY}"/>` +
    `<path d="M-60 700Q0 760 0 900M60 700Q0 760 0 900" fill="none" stroke="${mix(GREY, INK, 0.18)}" stroke-width="8" stroke-linecap="round"/>` +
    beardShine(GREY) +
    brows(GREY, 36) +
    mustache(GREY, 8),
];

/** One eye at `x`: dark ring, iris, then whatever pupil the style adds. */
const eyeball = (x, radius, iris) =>
  `<circle cx="${x}" cy="${EYE_Y}" r="${radius}" fill="${INK}"/>` +
  `<circle cx="${x}" cy="${EYE_Y}" r="${radius - 12}" fill="${iris}"/>`;

/** A dark eyelid clipped to the eye; `outer`/`inner` are how far each end drops. */
function eyelid(x, side, outer, inner) {
  const id = nextId();
  const left = x - 62;
  const right = x + 62;
  const top = EYE_Y - 62;
  const [dropLeft, dropRight] = side < 0 ? [outer, inner] : [inner, outer];
  return (
    `<clipPath id="${id}"><circle cx="${x}" cy="${EYE_Y}" r="62"/></clipPath>` +
    `<path d="M${left} ${top}L${right} ${top}L${right} ${top + dropRight}L${left} ${top + dropLeft}Z" fill="${INK}" clip-path="url(#${id})"/>`
  );
}

const eyePair = (draw) => draw(-EYE_X, -1) + draw(EYE_X, 1);

const eyes = [
  // Calm
  eyePair(
    (x, side) =>
      eyeball(x, 62, "#ffd23f") +
      `<circle cx="${x}" cy="${EYE_Y + 6}" r="26" fill="${INK}"/>` +
      `<circle cx="${x - 10}" cy="${EYE_Y - 2}" r="8" fill="#ffffff"/>` +
      eyelid(x, side, 44, 44),
  ),
  // Fierce
  eyePair(
    (x, side) =>
      eyeball(x, 62, "#ff6a2b") +
      `<ellipse cx="${x}" cy="${EYE_Y + 6}" rx="10" ry="30" fill="${INK}"/>` +
      `<circle cx="${x - 14}" cy="${EYE_Y + 2}" r="6" fill="#ffffff"/>` +
      eyelid(x, side, 16, 54),
  ),
  // Wide
  eyePair(
    (x) =>
      eyeball(x, 66, "#ffd23f") +
      `<circle cx="${x}" cy="${EYE_Y}" r="34" fill="${INK}"/>` +
      `<circle cx="${x - 13}" cy="${EYE_Y - 14}" r="11" fill="#ffffff"/>` +
      `<circle cx="${x + 13}" cy="${EYE_Y + 13}" r="5" fill="#ffffff"/>`,
  ),
  // Moonlit: pupil-less glowing eyes.
  `<defs><radialGradient id="moonlit"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#b6f3ff"/><stop offset="1" stop-color="#4fd0ff"/></radialGradient></defs>` +
    eyePair(
      (x) =>
        `<circle cx="${x}" cy="${EYE_Y}" r="80" fill="#8fe9ff" opacity=".3"/>` +
        `<circle cx="${x}" cy="${EYE_Y}" r="62" fill="#2a3f9e"/>` +
        `<circle cx="${x}" cy="${EYE_Y}" r="50" fill="url(#moonlit)"/>`,
    ),
];

const HAIR_DARK = "#3b2314";
const HAIR_BLONDE = "#f2c230";
const HAIR_RED = "#e03a2a";
const hairShine = (color) =>
  `<path d="M-150 262Q-80 212 10 212" fill="none" stroke="${mix(color, "#ffffff", 0.35)}" stroke-width="12" stroke-linecap="round" opacity=".7"/>`;

const hair = [
  // Short
  `<path d="M-222 420C-238 250 -120 182 0 182C120 182 238 250 222 420C204 372 192 330 150 304C84 282 22 322 -38 300C-100 282 -182 320 -222 420Z" fill="${HAIR_DARK}"/>` +
    hairShine(HAIR_DARK),
  // Long
  both(
    `<path d="M150 300C200 300 238 330 246 420C258 560 262 680 250 760C236 792 190 792 176 772C196 660 204 520 196 400Z" fill="${mix(HAIR_BLONDE, INK, 0.14)}"/>`,
  ) +
    `<path d="M-236 430C-250 250 -120 180 0 180C120 180 250 250 236 430C212 372 196 328 150 300C84 280 22 322 -38 298C-100 280 -196 328 -236 430Z" fill="${HAIR_BLONDE}"/>` +
    hairShine(HAIR_BLONDE),
  // Mohawk
  `<path d="M-48 330L-58 215L-30 240L-22 130L4 215L26 120L40 235L62 205L48 330Q0 300 -48 330Z" fill="${HAIR_RED}"/>` +
    `<path d="M-34 300L-38 240M-8 296L-10 180M22 296L26 176" fill="none" stroke="${mix(HAIR_RED, "#ffffff", 0.3)}" stroke-width="8" stroke-linecap="round" opacity=".7"/>`,
];

const headgear = [
  // Iron helm with horns and a nose guard
  both(
    `<path d="M200 332C290 332 332 260 322 148C292 232 250 262 196 268Z" fill="${IVORY}"/>` +
      `<path d="M262 318C300 290 322 230 322 148C312 232 282 280 240 300Z" fill="#d9c79a"/>`,
  ) +
    `<path d="M-228 350C-242 218 -130 162 0 162C130 162 242 218 228 350L26 350L22 474Q0 492 -22 474L-26 350Z" fill="${STEEL}"/>` +
    `<path d="M60 170C150 180 232 230 228 350L150 350C160 270 130 210 60 170Z" fill="${STEEL_DARK}"/>` +
    `<path d="M-230 322L230 322L228 352L-228 352Z" fill="${GOLD}"/>` +
    `<path d="M0 164L0 322" fill="none" stroke="${GOLD}" stroke-width="16"/>` +
    both(`<circle cx="120" cy="337" r="8" fill="${GOLD_DARK}"/>`) +
    `<ellipse cx="-120" cy="232" rx="56" ry="16" transform="rotate(-28 -120 232)" fill="#e6ebf0" opacity=".8"/>`,
  // Wool cap
  `<circle cx="0" cy="142" r="36" fill="#fff3d6"/>` +
    `<path d="M-215 330C-226 198 -120 150 0 150C120 150 226 198 215 330Z" fill="#c0392b"/>` +
    `<rect x="-228" y="286" width="456" height="66" rx="26" fill="#e05545"/>` +
    `<path d="M-160 296L-160 342M-80 296L-80 342M0 296L0 342M80 296L80 342M160 296L160 342" fill="none" stroke="#c0392b" stroke-width="8" stroke-linecap="round"/>` +
    `<ellipse cx="-110" cy="212" rx="50" ry="14" transform="rotate(-28 -110 212)" fill="#e05545" opacity=".9"/>`,
  // Crown
  `<path d="M-155 262L-170 130L-95 200L-50 105L0 195L50 105L95 200L170 130L155 262Z" fill="${GOLD}"/>` +
    `<rect x="-158" y="228" width="316" height="42" rx="8" fill="#e09a1a"/>` +
    `<circle cx="0" cy="249" r="13" fill="#e03a2a"/>` +
    both(`<circle cx="84" cy="249" r="11" fill="#3f8bff"/>`) +
    `<path d="M-142 200L-150 150" fill="none" stroke="#ffe08a" stroke-width="9" stroke-linecap="round"/>`,
];

const puff = (x, y) =>
  `<path d="M${x} ${y}q26 -30 0 -62q-26 -32 6 -68" fill="none" stroke="#f4f1ea" stroke-width="11" stroke-linecap="round" opacity=".75"/>`;

const smoke = [
  // Cigar
  `<g transform="rotate(8 34 ${MOUTH_Y})"><rect x="34" y="${MOUTH_Y - 12}" width="150" height="26" rx="11" fill="${WOOD}"/>` +
    `<rect x="78" y="${MOUTH_Y - 12}" width="16" height="26" fill="${GOLD}"/>` +
    `<rect x="166" y="${MOUTH_Y - 12}" width="18" height="26" rx="6" fill="#ff7a2a"/></g>` +
    puff(198, MOUTH_Y + 2),
  // Pipe
  `<path d="M34 ${MOUTH_Y + 2}Q110 ${MOUTH_Y + 8} 150 ${MOUTH_Y + 48}" fill="none" stroke="#3a2418" stroke-width="15" stroke-linecap="round"/>` +
    `<path d="M132 ${MOUTH_Y + 4}L208 ${MOUTH_Y + 4}L200 ${MOUTH_Y + 76}Q170 ${MOUTH_Y + 96} 140 ${MOUTH_Y + 76}Z" fill="#6b4226"/>` +
    `<rect x="126" y="${MOUTH_Y - 6}" width="88" height="18" rx="9" fill="#8a5a36"/>` +
    puff(170, MOUTH_Y - 20),
  // Clay pipe
  `<path d="M34 ${MOUTH_Y + 2}L206 ${MOUTH_Y + 20}" fill="none" stroke="#f0e4c4" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M196 ${MOUTH_Y - 32}L236 ${MOUTH_Y - 32}L232 ${MOUTH_Y + 30}Q216 ${MOUTH_Y + 40} 200 ${MOUTH_Y + 30}Z" fill="#f0e4c4"/>` +
    `<rect x="192" y="${MOUTH_Y - 40}" width="48" height="14" rx="7" fill="#d8c9a0"/>` +
    puff(216, MOUTH_Y - 52),
];

const held = [
  // Mug
  `<path d="M418 800Q492 800 492 866Q492 932 418 932" fill="none" stroke="#b9772a" stroke-width="24"/>` +
    `<rect x="270" y="770" width="150" height="200" rx="16" fill="#f2a93b"/>` +
    `<rect x="270" y="800" width="150" height="16" fill="#b9772a"/><rect x="270" y="922" width="150" height="16" fill="#b9772a"/>` +
    `<rect x="292" y="834" width="18" height="72" rx="9" fill="#ffd98a"/>` +
    `<circle cx="290" cy="768" r="30" fill="#fff7e6"/><circle cx="336" cy="752" r="36" fill="#fff7e6"/><circle cx="386" cy="766" r="32" fill="#fff7e6"/><circle cx="420" cy="778" r="22" fill="#fff7e6"/>` +
    `<rect x="372" y="772" width="26" height="58" rx="13" fill="#fff7e6"/>`,
  // Torch
  `<rect x="328" y="700" width="40" height="340" rx="8" fill="${WOOD}"/>` +
    `<rect x="312" y="640" width="72" height="78" rx="12" fill="#3a2418"/>` +
    `<path d="M348 470C420 560 420 610 400 650Q348 690 296 650C276 610 300 580 318 548C330 580 340 560 348 470Z" fill="#ff7a2a"/>` +
    `<path d="M348 560C385 610 380 640 368 656Q348 672 328 656C316 636 330 610 348 560Z" fill="#ffd23f"/>`,
  // Axe
  `<rect x="336" y="540" width="34" height="500" rx="8" fill="${WOOD}"/>` +
    `<path d="M336 580L280 612L336 650Z" fill="#c9d2dc"/>` +
    `<path d="M370 560C460 540 500 620 488 720C450 680 410 668 370 672Z" fill="#c9d2dc"/>` +
    `<path d="M430 580C470 600 490 660 488 720C460 690 440 680 430 676Z" fill="#9aa5b2"/>` +
    `<rect x="330" y="602" width="46" height="20" fill="${GOLD}"/>`,
];

const frame = (color) =>
  `<circle cx="0" cy="512" r="496" fill="none" stroke="${color}" stroke-width="32"/>` +
  `<circle cx="0" cy="512" r="474" fill="none" stroke="${mix(color, "#ffffff", 0.45)}" stroke-width="6"/>`;

/**
 * Artwork per category; counts and order must match `avatar.config.ts`.
 * Skin entries are functions of the race because the tone follows its body.
 */
const layers = {
  background: [
    "#a8642c",
    "#233a9c",
    "#e3261f",
    "#4caf3d",
    "#7b3fd1",
    "#f2b233",
  ].map(background),
  aura: ["#ffd23f", "#b574ff", "#6fc3ff"].map(aura),
  race: RACES.map((race) => figure(race, 1)),
  skin: [0, 1, 2].map((tone) => (race) => figure(race, tone)),
  armor,
  necklace,
  mouth,
  beard,
  eyes,
  hair,
  headgear,
  smoke,
  held,
  frame: ["#5fd04f", "#3f8bff", "#b05cf0", "#ff8a1f"].map(frame),
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
  beard: "152 230 720 720",
  eyes: FACE,
  hair: "152 100 720 720",
  headgear: "152 60 720 720",
  smoke: FACE,
  armor: TORSO,
  necklace: TORSO,
  held: "304 304 720 720",
};

const document = (inner, size, view = FULL) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${view}"><g transform="translate(512 0)">${inner}</g></svg>`;

async function write(file, svg) {
  mkdirSync(dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
}

function thumbnail(category, index, art) {
  const backdrop = background("#1a120b");
  if (category === "background") return art;
  if (category === "race") return backdrop + art;
  if (category === "skin") return backdrop + silhouette(SKIN_SWATCHES[index]);
  if (category === "aura") return backdrop + art + silhouette("#4a3a2a");
  return backdrop + silhouette("#4a3a2a") + art;
}

let count = 0;
for (const [category, recipes] of Object.entries(layers)) {
  for (const [index, recipe] of recipes.entries()) {
    const number = String(index + 1).padStart(2, "0");
    const perRace = typeof recipe === "function";
    if (perRace) {
      for (const [raceIndex, race] of RACES.entries()) {
        const raceId = `race_${String(raceIndex + 1).padStart(2, "0")}`;
        await write(
          join(root, "layers", category, `${number}-${raceId}.png`),
          document(recipe(race), 1024),
        );
        count += 1;
      }
    } else {
      await write(
        join(root, "layers", category, `${number}.png`),
        document(recipe, 1024),
      );
      count += 1;
    }
    await write(
      join(root, "thumbs", category, `${number}.png`),
      document(
        thumbnail(category, index, perRace ? "" : recipe),
        128,
        thumbViews[category],
      ),
    );
    count += 1;
  }
}
console.log(`Wrote ${count} avatar files to ${root}`);
