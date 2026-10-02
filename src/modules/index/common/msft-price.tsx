"use client";
import { siteConfig } from "./site-config";
import { useMsft } from "./msft-provider";

/** Shows an issuer-derived token reference midpoint, with source and quote freshness available on focus. */
export function MsftPrice() {
  const { data, failed, checkedAt } = useMsft();
  const stale = data?.generatedAt
    ? checkedAt - Date.parse(data.generatedAt) > 120000
    : false;
  const state = failed
    ? "Retrying"
    : data?.halted
      ? "Halted"
      : stale
        ? "Stale quote"
        : data?.price == null
          ? "Fetching quote"
          : "Token reference";
  const value =
    data?.price == null
      ? "—"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.price);
  const detail = `Robinhood MSFT token reference: bid/ask midpoint × corporate-action multiplier; not a DEX execution price. ${data?.generatedAt ? `Quote: ${data.generatedAt}.` : "Awaiting verified quote."} ${state}.`;

  return (
    <a
      className="msft-price"
      href={siteConfig.msft.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`MSFT ${value}. ${detail}`}
      title={detail}
    >
      <span className="msft-price-value">$MSFT {value}</span>
    </a>
  );
}
