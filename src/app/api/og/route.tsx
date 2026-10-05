import type { NextRequest } from "next/server";
import { renderAvatarCard } from "@/modules/index/avatar/avatar-og";

/** Serves the share-card image for the avatar encoded in `?c=`. */
export function GET(request: NextRequest) {
  return renderAvatarCard(
    request.nextUrl.searchParams.get("c"),
    request.nextUrl.origin,
  );
}
