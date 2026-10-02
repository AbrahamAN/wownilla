import { MsftContract } from "./msft-contract";
import { CopyContract } from "@/modules/index/token/copy-contract";
import { isUsableAddress, safeProjectUrl, siteConfig } from "./site-config";
import type { ProjectAddress } from "./site-config";

/** Shows complete verified addresses or an explicitly copyable prelaunch sentinel, never a fake contract. */
export function ContractAddress({
  address = siteConfig.token,
  label = "Contract",
}: {
  address?: ProjectAddress;
  label?: string;
}) {
  const usable = isUsableAddress(address);
  const explorer = usable ? safeProjectUrl(address.explorerUrl) : undefined;
  return (
    <div className="token-contracts">
      <div className="contract-address text-left w-full">
        {label !== "Contract" ? (
          <div className="font-friz text-xs text-goldhi mb-2">{label}</div>
        ) : null}
        <div className="contract-row tile p-3 flex flex-wrap items-center gap-3">
          <span className="contract-placeholder-tag font-narrow text-xs text-parch2">
            Token Contract
          </span>
          <code
            className="contract-value flex-1 min-w-0 text-sm text-parch"
            title={usable ? address.value : siteConfig.contractPlaceholder}
          >
            {usable ? address.value : siteConfig.contractPlaceholder}
          </code>
          <CopyContract
            address={usable ? address.value : siteConfig.contractPlaceholder}
            label={usable ? `${label} address` : "token contract placeholder"}
            placeholder={!usable}
          />
        </div>
        {explorer ? (
          <a
            href={explorer}
            className="nav-link inline-block mt-2 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Verify {label} on explorer ↗
          </a>
        ) : null}
      </div>
      <MsftContract />
    </div>
  );
}
