import { siteConfig } from "./site-config";

/** Only verified registry identity and bounded numeric quotes cross the public API boundary. */
export interface MsftData {
  address: string;
  price: number | null;
  generatedAt: string | null;
  observedAt: string;
  halted: boolean;
}

/** Narrows unknown provider JSON without trusting external object shapes. */
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Checks deployment identity, rather than trusting a matching ticker alone. */
function matchesDeployment(value: unknown) {
  return (
    Array.isArray(value) &&
    value.some(
      (deployment: unknown) =>
        record(deployment) &&
        deployment.chainId === Number(siteConfig.chain.id) &&
        typeof deployment.contractAddress === "string" &&
        deployment.contractAddress.toLowerCase() ===
          siteConfig.msft.address.toLowerCase(),
    )
  );
}

/** Normalizes official registry and quote responses; absent prices never become synthetic values. */
export function normalizeMsft(registry: unknown, prices: unknown): MsftData {
  const asset =
    record(registry) && Array.isArray(registry.assets)
      ? registry.assets.find(
          (item: unknown) =>
            record(item) &&
            item.tokenSymbol === siteConfig.msft.symbol &&
            matchesDeployment(item.deployments),
        )
      : undefined;
  if (!record(asset) || asset.status !== "ASSET_STATUS_ACTIVE")
    throw new Error("MSFT registry identity could not be verified");
  const quote =
    record(prices) && Array.isArray(prices.quotes)
      ? prices.quotes.find(
          (item: unknown) =>
            record(item) &&
            item.tokenSymbol === siteConfig.msft.symbol &&
            matchesDeployment(item.deployments),
        )
      : undefined;
  const data: MsftData = {
    address: siteConfig.msft.address,
    price: null,
    generatedAt: null,
    observedAt: new Date().toISOString(),
    halted: false,
  };
  if (!record(quote) || quote.currency !== "USD") return data;
  const bid = typeof quote.bid === "string" ? Number(quote.bid) : NaN;
  const ask = typeof quote.ask === "string" ? Number(quote.ask) : NaN;
  const multiplier =
    typeof asset.currentMultiplier === "string"
      ? Number(asset.currentMultiplier)
      : NaN;
  const timestamp =
    typeof quote.generatedAt === "string" ? Date.parse(quote.generatedAt) : NaN;
  const price = ((bid + ask) / 2) * multiplier;
  if (
    ![bid, ask, multiplier, price, timestamp].every(Number.isFinite) ||
    bid <= 0 ||
    ask < bid ||
    multiplier <= 0 ||
    timestamp > Date.now() + 60000
  )
    return data;
  data.price = price;
  data.generatedAt = new Date(timestamp).toISOString();
  data.halted = quote.isTradingHalt === true;
  return data;
}

/** Validates the same-origin API response before enabling price or clipboard UI. */
export function isMsftData(value: unknown): value is MsftData {
  return (
    record(value) &&
    value.address === siteConfig.msft.address &&
    (value.price === null ||
      (typeof value.price === "number" &&
        Number.isFinite(value.price) &&
        value.price > 0)) &&
    (value.generatedAt === null ||
      (typeof value.generatedAt === "string" &&
        Number.isFinite(Date.parse(value.generatedAt)))) &&
    typeof value.observedAt === "string" &&
    Number.isFinite(Date.parse(value.observedAt)) &&
    typeof value.halted === "boolean"
  );
}
