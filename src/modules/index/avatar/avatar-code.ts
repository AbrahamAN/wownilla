import {
  categories,
  RACE_CATEGORY,
  type AvatarTraits,
  type Category,
  type Item,
} from "./avatar.config";

/** Whether an item may be worn by the given race. */
export function isItemAllowed(item: Item, raceId: string | null): boolean {
  return !item.races || (raceId !== null && item.races.includes(raceId));
}

function findItem(category: Category, id: string | null | undefined) {
  return id ? category.items.find((item) => item.id === id) : undefined;
}

function resolveRace(traits: AvatarTraits): string | null {
  const race = categories.find((category) => category.id === RACE_CATEGORY);
  if (!race) return null;
  return (findItem(race, traits[RACE_CATEGORY]) ?? race.items[0])?.id ?? null;
}

/**
 * Repairs any trait map into a valid avatar: unknown or race-incompatible
 * picks fall back to "None" for optional categories and to the first allowed
 * item otherwise. Every entry point (URL, gallery, reducer) goes through this
 * so an invalid combination can never reach the canvas.
 */
export function normalizeTraits(input: AvatarTraits): AvatarTraits {
  const raceId = resolveRace(input);
  const traits: AvatarTraits = {};
  for (const category of categories) {
    const picked = findItem(category, input[category.id]);
    if (picked && isItemAllowed(picked, raceId)) {
      traits[category.id] = picked.id;
    } else if (category.optional) {
      traits[category.id] = null;
    } else {
      const fallback = category.items.find((item) =>
        isItemAllowed(item, raceId),
      );
      traits[category.id] = fallback?.id ?? null;
    }
  }
  return traits;
}

/** The avatar shown before any choice is made and after a reset. */
export function defaultTraits(): AvatarTraits {
  return normalizeTraits({});
}

/**
 * Serializes traits to one base36 character per category (`0` is "None").
 * The code is the avatar's identity in URLs and file names, so it needs no
 * database and can later be mapped to stored ids without changing format.
 */
export function encodeTraits(traits: AvatarTraits): string {
  return categories
    .map((category) => {
      const index = category.items.findIndex(
        (item) => item.id === traits[category.id],
      );
      return (index + 1).toString(36).toUpperCase();
    })
    .join("");
}

/** Rebuilds traits from a share code, or returns `null` when it is malformed. */
export function decodeTraits(
  code: string | null | undefined,
): AvatarTraits | null {
  if (!code || code.length !== categories.length) return null;
  if (!/^[0-9a-z]+$/i.test(code)) return null;
  const traits: AvatarTraits = {};
  for (const [position, category] of categories.entries()) {
    const index = Number.parseInt(code[position], 36);
    if (index > category.items.length) return null;
    traits[category.id] = index === 0 ? null : category.items[index - 1].id;
  }
  return normalizeTraits(traits);
}

/** Maps each hidden category id to the worn item that covers it. */
export function hiddenCategories(traits: AvatarTraits): Map<string, Item> {
  const hidden = new Map<string, Item>();
  for (const category of categories) {
    const item = findItem(category, traits[category.id]);
    if (!item?.hides) continue;
    for (const id of item.hides) hidden.set(id, item);
  }
  return hidden;
}

/**
 * Points a per-race item at the file drawn for the selected race, so skin
 * tones follow each body shape instead of tinting one shared silhouette.
 */
export function resolveLayer(item: Item, raceId: string | null): Item {
  if (!item.perRace || !raceId) return item;
  return { ...item, src: item.src.replace(/\.png$/, `-${raceId}.png`) };
}

/** The layers to draw, bottom to top, after applying `hides`. */
export function visibleItems(traits: AvatarTraits): Item[] {
  const hidden = hiddenCategories(traits);
  const raceId = traits[RACE_CATEGORY];
  const items: Item[] = [];
  for (const category of categories) {
    if (hidden.has(category.id)) continue;
    const item = findItem(category, traits[category.id]);
    if (item) items.push(resolveLayer(item, raceId));
  }
  return items;
}

/**
 * Rolls a random avatar. The race is drawn first and every later pick is
 * limited to items that race allows, so the result is valid by construction.
 */
export function randomTraits(random: () => number = Math.random): AvatarTraits {
  const pick = <T>(list: readonly T[]) =>
    list[Math.floor(random() * list.length)];
  const traits: AvatarTraits = {};
  const race = categories.find((category) => category.id === RACE_CATEGORY);
  const raceId = race ? (pick(race.items)?.id ?? null) : null;
  for (const category of categories) {
    if (category.id === RACE_CATEGORY) {
      traits[category.id] = raceId;
      continue;
    }
    const allowed = category.items.filter((item) =>
      isItemAllowed(item, raceId),
    );
    const skip = category.optional && random() < 0.3;
    traits[category.id] = skip ? null : (pick(allowed)?.id ?? null);
  }
  return normalizeTraits(traits);
}
