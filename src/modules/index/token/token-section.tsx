import { MarketPanel } from "./market-panel";

/** Presents the approved trading invitation while preserving the public token anchor. */
export function TokenSection() {
  return (
    <section
      id="token"
      className="auction-section"
      aria-labelledby="auction-title"
    >
      <div className="auction-content">
        <header className="auction-heading">
          <p className="eyebrow">THE AUCTION HOUSE</p>
          <h2 id="auction-title" className="font-friz text-parch">
            You used to spend gold here.
          </h2>
          <p className="text-parch2">
            $NILLA on Robinhood Chain, launched through LONG. For players who
            remember when checking the market meant visiting the auction house.
          </p>
        </header>
        <MarketPanel />
      </div>
    </section>
  );
}
