import { siteConfig } from "../common/site-config";

/** Reserves a stable chart space until the project has a launched token and verified trading pair. */
export function MarketPanel() {
  return (
    <div id="market" className="panel mt-14 p-5 md:p-8 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="font-morpheus text-2xl md:text-3xl text-goldhi">
          The Auction House
        </h3>
        <span className="plate">Coming at launch</span>
      </div>
      <div className="market-frame tile flex flex-col items-center justify-center text-center p-6">
        <svg
          width="64"
          height="64"
          className="text-goldhi mb-5"
          aria-hidden="true"
        >
          <use href="#coin-art" />
        </svg>
        <p className="font-friz text-xl md:text-2xl text-parch">
          {siteConfig.ticker} chart coming soon
        </p>
        <p className="mt-4 max-w-md text-parch2 leading-relaxed">
          The token has not launched yet. Its chart will appear here once the
          contract, chain and trading pair are confirmed.
        </p>
        <span className="mt-6 font-narrow text-sm text-goldhi">
          Prelaunch · no trading data available
        </span>
      </div>
      <p className="mt-4 text-sm text-parch2">
        A verified market link will be available alongside the chart at launch.
      </p>
    </div>
  );
}
