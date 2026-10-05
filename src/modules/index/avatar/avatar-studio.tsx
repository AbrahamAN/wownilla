"use client";

import { useEffect, useReducer } from "react";
import { decodeTraits, encodeTraits } from "./avatar-code";
import { AvatarGallery } from "./avatar-gallery";
import { AvatarGenerator } from "./avatar-generator";
import { avatarReducer, createAvatarState } from "./avatar-state";

/**
 * Owns the avatar state shared by the gallery and the generator, and mirrors
 * it to the `c` query parameter so any avatar can be reloaded or shared.
 */
export function AvatarStudio() {
  const [state, dispatch] = useReducer(
    avatarReducer,
    undefined,
    createAvatarState,
  );
  const code = encodeTraits(state.traits);

  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("c");
    const traits = decodeTraits(shared);
    if (traits) dispatch({ type: "hydrate", traits });
  }, []);

  useEffect(() => {
    if (!state.dirty) return;
    const url = new URL(window.location.href);
    url.searchParams.set("c", code);
    window.history.replaceState(window.history.state, "", url);
  }, [code, state.dirty]);

  return (
    <div className="avatar-studio">
      <AvatarGallery
        onPick={(traits) => dispatch({ type: "replace", traits })}
      />
      <AvatarGenerator
        traits={state.traits}
        code={code}
        canUndo={state.past.length > 0}
        dispatch={dispatch}
      />
    </div>
  );
}
