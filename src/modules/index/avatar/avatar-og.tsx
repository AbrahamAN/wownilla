import { ImageResponse } from "next/og";
import { siteConfig } from "../common/site-config";
import {
  decodeTraits,
  defaultTraits,
  encodeTraits,
  visibleItems,
} from "./avatar-code";

const WIDTH = 1200;
const HEIGHT = 630;
const PORTRAIT = 510;

/**
 * Composes the share card for one avatar code on the server, using the same
 * layer resolution as the browser canvas. X cannot receive an uploaded image
 * through its intent, so the card image is how the avatar reaches the post.
 * Layers are fetched from `origin`, which must be this deployment.
 */
export function renderAvatarCard(
  code: string | null,
  origin: string,
): ImageResponse {
  const traits = decodeTraits(code) ?? defaultTraits();
  const layers = visibleItems(traits);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 60,
          padding: 60,
          background: "linear-gradient(135deg, #1a120b, #0b0a08)",
          color: "#e8d7a8",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: PORTRAIT,
            height: PORTRAIT,
            border: "3px solid #b88632",
            backgroundColor: "#1a120b",
          }}
        >
          {layers.map((layer) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={layer.id}
              alt=""
              src={`${origin}${layer.src}`}
              width={PORTRAIT - 6}
              height={PORTRAIT - 6}
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 30, letterSpacing: 8, color: "#b88632" }}>
            WOWOW
          </div>
          <div style={{ marginTop: 18, fontSize: 68, lineHeight: 1.1 }}>
            {`My ${siteConfig.project} avatar`}
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#a99a78" }}>
            {`#${encodeTraits(traits)}`}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=31536000",
      },
    },
  );
}
