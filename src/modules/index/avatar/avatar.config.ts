/**
 * One selectable layer. `src` and `thumb` are same-origin so the compositing
 * canvas is never tainted and can always be exported.
 */
export interface Item {
  id: string;
  label: string;
  src: string;
  thumb: string;
  /** Category ids this item covers, so they are skipped while it is worn. */
  hides?: readonly string[];
  /** Race item ids this item fits. Omitted means every race. */
  races?: readonly string[];
  /**
   * The artwork follows the body, so each race has its own file named
   * `<number>-<race id>.png` and `src` is only the pattern it derives from.
   */
  perRace?: boolean;
}

/** A layer slot in the fixed stacking order, drawn from lowest `z` upward. */
export interface Category {
  id: string;
  label: string;
  z: number;
  /** Optional categories offer a "None" choice. */
  optional: boolean;
  items: readonly Item[];
}

/** Selected item id per category id, or `null` for "None". */
export type AvatarTraits = Record<string, string | null>;

/** A curated starting point shown in the gallery. */
export interface GalleryEntry {
  id: string;
  name: string;
  traits: AvatarTraits;
}

interface ItemSeed {
  label: string;
  hides?: readonly string[];
  races?: readonly string[];
  perRace?: boolean;
}

/**
 * Derives ids and asset paths from the item's position so adding an option
 * only needs a new seed here and two files under `public/avatar`.
 */
function category(
  id: string,
  label: string,
  optional: boolean,
  seeds: readonly ItemSeed[],
): Omit<Category, "z"> {
  return {
    id,
    label,
    optional,
    items: seeds.map((seed, index) => {
      const number = String(index + 1).padStart(2, "0");
      return {
        ...seed,
        id: `${id}_${number}`,
        src: `/avatar/layers/${id}/${number}.png`,
        thumb: `/avatar/thumbs/${id}/${number}.png`,
      };
    }),
  };
}

/** Category whose selection gates race-specific items. */
export const RACE_CATEGORY = "race";

const BEARDED = ["race_01", "race_02"];

/**
 * Every avatar layer, listed bottom to top. The array position is both the
 * draw order and the character position in the share code, so append new
 * categories and items rather than reordering them. Each category holds at
 * most 35 items because a selection is stored as one base36 character.
 */
export const categories: readonly Category[] = [
  category("background", "Background", false, [
    { label: "Hearth Brown" },
    { label: "Midnight Blue" },
    { label: "Ember Red" },
    { label: "Moss Green" },
    { label: "Twilight Purple" },
    { label: "Sun Gold" },
  ]),
  category("aura", "Aura", true, [
    { label: "Gold Glow" },
    { label: "Arcane Violet" },
    { label: "Frost Blue" },
  ]),
  category(RACE_CATEGORY, "Race", false, [
    { label: "Dwarf" },
    { label: "Orc" },
    { label: "Fish-folk" },
    { label: "Moon Elf" },
  ]),
  category("skin", "Skin", false, [
    { label: "Pale", perRace: true },
    { label: "Tan", perRace: true },
    { label: "Deep", perRace: true },
  ]),
  category("armor", "Armor", true, [
    { label: "Leather Vest" },
    { label: "Plate Cuirass" },
    { label: "Mage Robe" },
    { label: "Guild Tee" },
    { label: "Hoodie" },
  ]),
  category("necklace", "Neck", true, [
    { label: "Gold Chain" },
    { label: "Pauldrons" },
    { label: "Scarf" },
  ]),
  category("mouth", "Mouth", false, [
    { label: "Smirk" },
    { label: "Grin" },
    { label: "Frown" },
    { label: "Gritted" },
  ]),
  category("beard", "Beard", true, [
    { label: "Braided", races: BEARDED },
    { label: "Mutton Chops", races: BEARDED },
    { label: "Long Grey", races: ["race_01"] },
  ]),
  category("eyes", "Eyes", false, [
    { label: "Smug" },
    { label: "Fierce" },
    { label: "Wide" },
    { label: "Moonlit" },
    { label: "Laser" },
    { label: "Pixel Shades" },
  ]),
  category("hair", "Hair", true, [
    { label: "Short" },
    { label: "Long" },
    { label: "Mohawk" },
    { label: "Topknot" },
  ]),
  category("headgear", "Headgear", true, [
    { label: "Iron Helm", hides: ["hair"] },
    { label: "Wool Cap", hides: ["hair"] },
    { label: "Crown" },
  ]),
  category("smoke", "Smoke", true, [
    { label: "Cigar" },
    { label: "Pipe" },
    { label: "Clay Pipe" },
  ]),
  category("held", "Held Item", true, [
    { label: "Mug" },
    { label: "Torch" },
    { label: "Axe" },
  ]),
  category("frame", "Rarity", true, [
    { label: "Uncommon" },
    { label: "Rare" },
    { label: "Epic" },
    { label: "Legendary" },
  ]),
].map((entry, z) => ({ ...entry, z }));

/** Example avatars for the gallery. Unlisted categories fall back to defaults. */
export const gallery: readonly GalleryEntry[] = [
  {
    id: "brewmaster",
    name: "Brewmaster",
    traits: {
      background: "background_01",
      race: "race_01",
      skin: "skin_02",
      armor: "armor_01",
      mouth: "mouth_02",
      beard: "beard_01",
      eyes: "eyes_01",
      hair: "hair_01",
      held: "held_01",
      frame: "frame_01",
    },
  },
  {
    id: "warchief",
    name: "Warchief",
    traits: {
      background: "background_03",
      race: "race_02",
      skin: "skin_02",
      necklace: "necklace_02",
      mouth: "mouth_01",
      eyes: "eyes_01",
      hair: "hair_03",
      held: "held_03",
    },
  },
  {
    id: "tidecaller",
    name: "Tidecaller",
    traits: {
      background: "background_05",
      aura: "aura_03",
      race: "race_03",
      skin: "skin_01",
      armor: "armor_03",
      mouth: "mouth_02",
      eyes: "eyes_03",
      held: "held_02",
      frame: "frame_02",
    },
  },
  {
    id: "ironguard",
    name: "Ironguard",
    traits: {
      background: "background_04",
      race: "race_01",
      skin: "skin_01",
      armor: "armor_02",
      necklace: "necklace_02",
      mouth: "mouth_03",
      beard: "beard_03",
      eyes: "eyes_02",
      headgear: "headgear_01",
      held: "held_03",
      frame: "frame_03",
    },
  },
  {
    id: "night-smoker",
    name: "Night Smoker",
    traits: {
      background: "background_02",
      race: "race_02",
      skin: "skin_01",
      armor: "armor_05",
      necklace: "necklace_01",
      mouth: "mouth_01",
      eyes: "eyes_06",
      hair: "hair_04",
      smoke: "smoke_01",
    },
  },
  {
    id: "reef-king",
    name: "Reef King",
    traits: {
      background: "background_03",
      aura: "aura_01",
      race: "race_03",
      skin: "skin_02",
      armor: "armor_02",
      necklace: "necklace_01",
      mouth: "mouth_04",
      eyes: "eyes_05",
      headgear: "headgear_03",
      frame: "frame_04",
    },
  },
  {
    id: "moon-priestess",
    name: "Moon Priestess",
    traits: {
      background: "background_02",
      aura: "aura_02",
      race: "race_04",
      skin: "skin_01",
      armor: "armor_03",
      necklace: "necklace_01",
      mouth: "mouth_01",
      eyes: "eyes_04",
      hair: "hair_02",
      held: "held_02",
      frame: "frame_02",
    },
  },
  {
    id: "sentinel",
    name: "Sentinel",
    traits: {
      background: "background_06",
      race: "race_04",
      skin: "skin_03",
      armor: "armor_04",
      necklace: "necklace_03",
      mouth: "mouth_03",
      eyes: "eyes_02",
      headgear: "headgear_02",
      smoke: "smoke_03",
    },
  },
];
