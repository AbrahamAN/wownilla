import { siteConfig } from "@/modules/index/common/site-config";
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
            {
              "\n          $WOWN is a meme coin with no intrinsic value or expectation of financial return. Not financial advice. Just a really good meme.\n        "
            }
          </p>
        </div>
        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-friz uppercase text-[12px] tracking-[0.18em]"
          aria-label="Footer"
        >
          <a href="#about" className="nav-link">
            {"About"}
          </a>
          <a href="#token" className="nav-link">
            {"Token"}
          </a>
          <a href="#lore" className="nav-link">
            {"Lore"}
          </a>
          <a href="#community" className="nav-link">
            {"Community"}
          </a>
          <span className="hidden md:inline text-bronze">{"◆"}</span>
          <a
            href={siteConfig.links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            {"X"}
          </a>
          <a
            href={siteConfig.links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            {"Telegram"}
          </a>
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            {"Discord"}
          </a>
        </nav>
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
