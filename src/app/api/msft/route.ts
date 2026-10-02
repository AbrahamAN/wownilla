import { normalizeMsft } from "@/modules/index/common/msft-data";
import { siteConfig } from "@/modules/index/common/site-config";

/** Proxies fixed official read-only endpoints, keeping provider validation in the landing module. */
export async function GET() {
  try {
    const results = await Promise.allSettled(
      [siteConfig.msft.registryUrl, siteConfig.msft.priceUrl].map(
        async (url) => {
          const response = await fetch(url, {
            next: { revalidate: 30 },
            signal: AbortSignal.timeout(8000),
          });
          if (!response.ok) throw new Error("Provider request failed");
          const data: unknown = await response.json();
          return data;
        },
      ),
    );
    const registry = results[0];
    const prices = results[1];
    if (registry.status !== "fulfilled")
      throw new Error("Registry request failed");
    return Response.json(
      normalizeMsft(
        registry.value,
        prices.status === "fulfilled" ? prices.value : null,
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "MSFT data could not be verified. Retry shortly." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
