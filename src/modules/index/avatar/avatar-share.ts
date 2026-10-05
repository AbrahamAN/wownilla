import { siteConfig } from "../common/site-config";

/** Text prefilled in the post; the image comes from the shared page's card. */
export const SHARE_TEXT = `I just forged my ${siteConfig.project} avatar. ${siteConfig.ticker}`;

/** File name for a downloaded or shared avatar. */
export function avatarFileName(code: string): string {
  return `wowow-${code}.png`;
}

/**
 * The public page for one avatar. It carries the Open Graph image, which is
 * the only way X can show the picture: its intent accepts text and a URL only.
 */
export function avatarShareUrl(origin: string, code: string): string {
  return `${origin}/avatar?c=${encodeURIComponent(code)}`;
}

/** X compose intent prefilled with the share text and the avatar page. */
export function xIntentUrl(url: string): string {
  const intent = new URL("https://x.com/intent/post");
  intent.searchParams.set("text", SHARE_TEXT);
  intent.searchParams.set("url", url);
  return intent.toString();
}

/**
 * Whether to hand the PNG itself to the system share sheet. Limited to touch
 * devices, where the sheet reaches the X app; desktop keeps the web intent.
 */
export function canShareFiles(): boolean {
  if (typeof navigator.canShare !== "function") return false;
  if (!window.matchMedia("(pointer: coarse)").matches) return false;
  const probe = new File([], "probe.png", { type: "image/png" });
  return navigator.canShare({ files: [probe] });
}
