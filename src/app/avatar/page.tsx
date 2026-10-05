import type { Metadata } from "next";
import { headers } from "next/headers";
import { decodeTraits, encodeTraits } from "@/modules/index/avatar/avatar-code";
import { AvatarRedirect } from "@/modules/index/avatar/avatar-redirect";

interface AvatarPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Returns the canonical code for a valid `?c=`, or `null` otherwise. */
async function readCode({ searchParams }: AvatarPageProps) {
  const { c } = await searchParams;
  const traits = decodeTraits(typeof c === "string" ? c : null);
  return traits ? encodeTraits(traits) : null;
}

/**
 * Points the share card at the composed avatar. The origin comes from the
 * request because the project does not pin a canonical deployment URL.
 */
export async function generateMetadata(
  props: AvatarPageProps,
): Promise<Metadata> {
  const code = await readCode(props);
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host) return {};
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const image = new URL(`${protocol}://${host}/api/og`);
  if (code) image.searchParams.set("c", code);
  const title = "My Wownilla avatar";
  const images = [{ url: image.toString(), width: 1200, height: 630 }];
  return {
    title,
    openGraph: { title, images },
    twitter: { card: "summary_large_image", title, images },
  };
}

/** Shareable avatar URL: carries the card metadata, then opens the forge. */
export default async function AvatarPage(props: AvatarPageProps) {
  const code = await readCode(props);
  return <AvatarRedirect href={code ? `/?c=${code}#avatar` : "/#avatar"} />;
}
