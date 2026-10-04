import { siteConfig } from "./site-config";
import { LaunchDetails } from "./launch-details";
import { ContractAddress } from "./contract-address";
import { ProjectActions } from "./project-actions";
/** Renders the original guild links and project disclaimer. */
export function Footer() {
  return (
    <footer className="bg-stone px-4 pt-14 pb-16 border-t border-bronze">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
        <div>
          <a href="#top" className="inline-flex items-center gap-2">
            <svg
              width="24"
              height="24"
              className="text-goldhi"
              aria-hidden="true"
            >
              <use href="#logo-w"></use>
            </svg>
            <span className="logo-type text-[26px]">{"WOWNILLA"}</span>
          </a>
          <p className="mt-3 max-w-sm font-narrow text-sm leading-relaxed text-parch2">
            {`${siteConfig.ticker} is a meme coin with no intrinsic value or expectation of financial return. Not financial advice. Just a really good meme.`}
          </p>
        </div>
        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-friz uppercase text-[12px] tracking-[0.18em]"
          aria-label="Footer"
        >
          <a href="#tavern" className="nav-link">
            {"Tavern"}
          </a>
          <a href="#token" className="nav-link">
            {"Auction House"}
          </a>
          <a href="#lore" className="nav-link">
            {"Road Ahead"}
          </a>
          <a href="#community" className="nav-link">
            {"Community"}
          </a>
        </nav>
      </div>
      <div className="max-w-3xl mx-auto mt-8">
        <ProjectActions />
        <div className="mt-4">
          <LaunchDetails />
        </div>
        <div className="mt-6">
          <ContractAddress />
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-leather flex flex-col md:flex-row justify-between gap-2 font-narrow text-[12px] text-parch2/80 text-center md:text-left">
        <span>{"© 2026 WOWNILLA. Forged by the guild."}</span>
        <span>
          {
            "Fan-made parody. Not affiliated with, endorsed by, or connected to Blizzard Entertainment."
          }
        </span>
      </div>
    </footer>
  );
}
