import { defaultTraits, encodeTraits, normalizeTraits } from "./avatar-code";
import type { AvatarTraits } from "./avatar.config";

const HISTORY_LIMIT = 50;

/** Generator state: the current avatar plus the steps "Undo" can return to. */
export interface AvatarState {
  traits: AvatarTraits;
  past: readonly AvatarTraits[];
  /** False until the visitor edits, so an untouched avatar leaves the URL alone. */
  dirty: boolean;
}

/** Every way the avatar can change. `hydrate` restores a shared URL without history. */
export type AvatarAction =
  | { type: "set"; category: string; item: string | null }
  | { type: "replace"; traits: AvatarTraits }
  | { type: "hydrate"; traits: AvatarTraits }
  | { type: "reset" }
  | { type: "undo" };

/** Starts from the default avatar so server and client markup match. */
export function createAvatarState(): AvatarState {
  return { traits: defaultTraits(), past: [], dirty: false };
}

function commit(state: AvatarState, next: AvatarTraits): AvatarState {
  const traits = normalizeTraits(next);
  if (encodeTraits(traits) === encodeTraits(state.traits)) return state;
  return {
    traits,
    past: [...state.past, state.traits].slice(-HISTORY_LIMIT),
    dirty: true,
  };
}

/** Pure transition function; randomness is resolved by the caller. */
export function avatarReducer(
  state: AvatarState,
  action: AvatarAction,
): AvatarState {
  switch (action.type) {
    case "set":
      return commit(state, { ...state.traits, [action.category]: action.item });
    case "replace":
      return commit(state, action.traits);
    case "hydrate":
      return { ...state, traits: normalizeTraits(action.traits) };
    case "reset":
      return commit(state, defaultTraits());
    case "undo": {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return { traits: previous, past: state.past.slice(0, -1), dirty: true };
    }
  }
}
