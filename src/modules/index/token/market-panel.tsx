import { MsftContract } from "../common/msft-contract";
import { ExternalArrow } from "../common/external-arrow";
import {
  isUsableAddress,
  projectDestinations,
  siteConfig,
} from "../common/site-config";
import { CopyContract } from "./copy-contract";

/** Keeps trading controls and contract details truthful while verified market configuration is absent. */
export function MarketPanel() {
  const destinations = projectDestinations();
  const address = isUsableAddress(siteConfig.token)
    ? siteConfig.token.value
    : "";
  return (
    <div
      id="market"
      className="panel auction-panel"
      role="region"
      aria-label="The Auction House trading panel"
    >
      <div className="auction-controls">
        <div className="auction-actions">
          {destinations.buy ? (
            <a
              className="btn btn-gold"
              href={destinations.buy}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy $NILLA <ExternalArrow />
            </a>
          ) : (
            <button
              className="btn btn-gold"
              disabled
              aria-describedby="auction-trading-status"
            >
              Buy $NILLA <ExternalArrow />
            </button>
          )}
          {destinations.chart ? (
            <a
              className="btn btn-dark"
              href={destinations.chart}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Chart <ExternalArrow />
            </a>
          ) : (
            <button
              className="btn btn-dark"
              disabled
              aria-describedby="auction-trading-status"
            >
              View Chart <ExternalArrow />
            </button>
          )}
          {(!destinations.buy || !destinations.chart) && (
            <p
              id="auction-trading-status"
              className="auction-availability font-narrow text-parch2"
            >
              Trading links unavailable.
            </p>
          )}
        </div>
        <div className="auction-contract">
          <p className="auction-contract-label font-narrow text-goldhi">
            Contract Address <span className="text-parch2">$NILLA</span>
          </p>
          <div className="auction-contract-row">
            <code className="contract-value text-parch">
              {address || "Contract unavailable"}
            </code>
            {address ? (
              <CopyContract
                address={address}
                label="$NILLA contract"
                showLabel
                copyLabel="Copy Contract"
                successMessage="Copied!"
              />
            ) : (
              <button
                className="btn btn-dark"
                disabled
                aria-label="Copy Contract"
              >
                Copy Contract
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="market-frame tile">
        <svg width="64" height="64" className="text-goldhi" aria-hidden="true">
          <use href="#coin-art" />
        </svg>
        <p className="font-friz text-parch">$NILLA chart unavailable</p>
        <p className="text-parch2">A verified chart is not available yet.</p>
      </div>
      <dl className="auction-pair-details font-narrow">
        <div>
          <dt>Network</dt>
          <dd>{siteConfig.chain.name}</dd>
        </div>
        <div>
          <dt>Pair</dt>
          <dd>Unavailable</dd>
        </div>
      </dl>
      <div className="auction-msft">
        <MsftContract />
      </div>
      <p className="auction-attribution font-narrow text-parch2">
        Wownilla is independent of Microsoft and Robinhood.
      </p>
    </div>
  );
}
