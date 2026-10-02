"use client";
import { CopyContract } from "../token/copy-contract";
import { useMsft } from "./msft-provider";
import { siteConfig } from "./site-config";

/** Enables MSFT copy only after the official registry deployment passes validation. */
export function MsftContract() {
  const { data, failed } = useMsft();
  return (
    <div className="msft-contract text-left w-full">
      <div className="contract-row tile p-3 flex flex-wrap items-center gap-3">
        <span className="contract-placeholder-tag font-narrow text-xs text-parch2">
          MSFT
        </span>
        <code
          className="contract-value flex-1 min-w-0 text-sm text-parch"
          title={data?.address}
        >
          {data?.address ??
            (failed
              ? "MSFT verification pending — retrying"
              : "Fetching MSFT contract…")}
        </code>
        <CopyContract
          address={data?.address ?? ""}
          label="MSFT token contract"
        />
      </div>
      {data ? (
        <a
          href={siteConfig.msft.explorerUrl}
          className="nav-link inline-block mt-2 text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify MSFT on explorer ↗
        </a>
      ) : null}
    </div>
  );
}
