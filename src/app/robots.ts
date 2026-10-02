import type { MetadataRoute } from "next";

/** Exposes the public landing page to crawlers through Next's metadata route. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
