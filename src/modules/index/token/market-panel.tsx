import { MsftContract } from "../common/msft-contract";
import { siteConfig } from "../common/site-config";

/** Reserves a stable chart space until the project has a launched token and verified trading pair. */
export function MarketPanel() {
  return (
    <section
      id="market"
      aria-labelledby="market-title"
      className="panel mt-14 p-5 md:p-8 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3
          id="market-title"
          className="font-morpheus text-2xl md:text-3xl text-goldhi"
        >
          The Auction House
        </h3>
        <span className="plate">Prelaunch</span>
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
          deployment, trading pair and chart provider support are verified.
        </p>
        <span className="mt-6 font-narrow text-sm text-goldhi">
          Prelaunch · no trading data available
        </span>
      </div>
      <p className="mt-5 text-parch2 leading-relaxed">
        The Auction House opens after verification. No price, volume, liquidity
        or holder figures are available here before launch.
      </p>
      <div className="token-contracts mt-5">
        <MsftContract />
      </div>
      <dl className="market-requirements mt-5 grid gap-3 sm:grid-cols-3">
        {[
          [
            "Verified deployment",
            "The full NILLA address and decimals on Robinhood Chain mainnet, with a confirmed launch.",
          ],
          [
            "Verified pair",
            "The exact pool and both token contracts, including the quote asset. A ticker alone does not identify a pair.",
          ],
          [
            "Provider support",
            "A chart provider that supports the network and verified pool. A market link will accompany the chart once enabled.",
          ],
        ].map(([title, description]) => (
          <div key={title} className="tile p-4">
            <dt className="font-friz text-sm text-goldhi">{title}</dt>
            <dd className="mt-2 font-narrow text-base text-parch2 leading-relaxed">
              {description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
