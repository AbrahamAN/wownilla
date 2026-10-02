import { siteConfig } from "@/modules/index/common/site-config";
import { Reveal, BarFill } from "@/modules/common/reveal";
import { CopyContract } from "./copy-contract";

/** Preserves the original token section while isolating its interactive controls. */
export function TokenSection() {
  return (
    <section
      id="token"
      className="bg-leather relative py-24 md:py-32 px-4 overflow-hidden border-y border-leather"
    >
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.08), transparent 60%)",
        }}
      ></div>
      <div className="relative max-w-6xl mx-auto">
        <Reveal tag="div" className="reveal text-center">
          <div className="eyebrow">{"Token"}</div>
          <h2 className="title-gold mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            {"The Character Sheet"}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-parch2">
            {"Stats rolled by the community. Min-maxed for maximum memes."}
          </p>
        </Reveal>
        <Reveal
          tag="div"
          className="reveal mt-14 grid gap-6 lg:grid-cols-[1fr_1.35fr] items-stretch"
        >
          <div className="panel p-6 md:p-8 flex flex-col items-center justify-center text-center overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 38%, rgba(212,175,55,0.2), transparent 55%)",
              }}
            ></div>
            <div className="coin-stage relative w-44 h-44 md:w-52 md:h-52">
              <svg className="coin absolute inset-0 w-full h-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.7)]">
                <use href="#coin-art"></use>
              </svg>
            </div>
            <div className="relative mt-6 font-morpheus text-3xl text-goldhi [text-shadow:0_2px_0_#000]">
              {"$WOWN"}
            </div>
            <div className="relative mt-1 font-narrow text-sm text-parch2 tracking-wide">
              {"Item Level 9000 · "}
              <span style={{ color: "var(--legendary)" }}>{"Legendary"}</span>
            </div>
            <div className="relative mt-6 w-full max-w-sm">
              <div className="font-friz text-[11px] tracking-[0.22em] uppercase text-gold mb-2 text-left">
                {"Contract"}
              </div>
              <div className="flex items-center gap-2 tile px-3 py-2">
                <code
                  id="contract"
                  className="flex-1 truncate text-left font-narrow text-sm text-parch"
                >
                  {siteConfig.contract}
                </code>
                <CopyContract />
              </div>
              <a
                href={siteConfig.links.buy}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold mt-3 flex items-center justify-center gap-2 px-6 py-3 text-[12px]"
              >
                <svg
                  width="14"
                  height="14"
                  className="text-ink2"
                  aria-hidden="true"
                >
                  <use href="#logo-w"></use>
                </svg>
                {"\n              Buy at the Auction House\n            "}
              </a>
            </div>
          </div>

          <div className="panel p-5 md:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="tile p-4">
                <div className="font-narrow text-[11px] tracking-[0.16em] uppercase text-parch2">
                  {"Ticker"}
                </div>
                <div className="mt-1 font-friz text-xl text-goldhi">
                  {"$WOWN"}
                </div>
              </div>
              <div className="tile p-4">
                <div className="font-narrow text-[11px] tracking-[0.16em] uppercase text-parch2">
                  {"Supply"}
                </div>
                <div className="mt-1 font-friz text-xl text-goldhi">
                  {"1,000,000,000"}
                </div>
              </div>
              <div className="tile p-4">
                <div className="font-narrow text-[11px] tracking-[0.16em] uppercase text-parch2">
                  {"Tax"}
                </div>
                <div className="mt-1 font-friz text-xl text-goldhi">
                  {"0% / 0%"}
                </div>
              </div>
              <div className="tile p-4">
                <div className="font-narrow text-[11px] tracking-[0.16em] uppercase text-parch2">
                  {"Liquidity"}
                </div>
                <div className="mt-1 font-friz text-xl text-parch">
                  {"Burned in lava"}
                </div>
              </div>
              <div className="tile p-4">
                <div className="font-narrow text-[11px] tracking-[0.16em] uppercase text-parch2">
                  {"Chain"}
                </div>
                <div className="mt-1 font-friz text-xl text-parch">{"TBA"}</div>
              </div>
              <div className="tile p-4">
                <div className="font-narrow text-[11px] tracking-[0.16em] uppercase text-parch2">
                  {"Team bag"}
                </div>
                <div className="mt-1 font-friz text-xl text-goldhi">
                  {"0 "}
                  <span className="font-narrow text-xs text-parch2">
                    {"(we're broke)"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="font-friz text-xs tracking-[0.22em] uppercase text-gold">
                {"Loot Distribution"}
              </div>
              <div className="mt-4 space-y-4 font-narrow">
                <div>
                  <div className="flex justify-between text-[15px]">
                    <span className="text-parch">
                      {"Community & Liquidity"}
                    </span>
                    <span className="text-goldhi font-bold">{"90%"}</span>
                  </div>
                  <div className="bar-track mt-1.5 h-3.5 overflow-hidden">
                    <BarFill
                      width="90%"
                      background="linear-gradient(180deg,#E2C46A,#B88632 60%,#8E6524)"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[15px]">
                    <span className="text-parch">
                      {"Guild Bank (marketing)"}
                    </span>
                    <span className="text-goldhi font-bold">{"7%"}</span>
                  </div>
                  <div className="bar-track mt-1.5 h-3.5 overflow-hidden">
                    <BarFill
                      width="7%"
                      background="linear-gradient(180deg,#B33A3A,#8B2020 60%,#5E1414)"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[15px]">
                    <span className="text-parch">{"Raid Loot (airdrops)"}</span>
                    <span className="text-goldhi font-bold">{"3%"}</span>
                  </div>
                  <div className="bar-track mt-1.5 h-3.5 overflow-hidden">
                    <BarFill
                      width="3%"
                      background="linear-gradient(180deg,#3B6CC0,#2455A4 60%,#173A74)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-16">
          <Reveal
            tag="h3"
            className="reveal text-center font-friz uppercase tracking-[0.2em] text-xl md:text-2xl text-parch"
          >
            {"How to join the "}
            <span className="text-goldhi">{"Raid"}</span>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal tag="div" className="reveal tile tile-hover p-5">
              <div className="flex items-center gap-2">
                <svg width="22" height="22">
                  <use href="#quest-mark"></use>
                </svg>
                <span className="font-friz text-[11px] tracking-[0.2em] uppercase text-gold">
                  {"Quest 1"}
                </span>
              </div>
              <h4 className="mt-3 font-friz text-lg text-goldhi">
                {"Craft a wallet"}
              </h4>
              <p className="mt-1 font-narrow text-[15px] text-parch2">
                {
                  "Every hero needs bags. Download a wallet and guard your seed phrase like epic loot."
                }
              </p>
            </Reveal>
            <Reveal
              tag="div"
              className="reveal tile tile-hover p-5"
              style={{ transitionDelay: ".06s" }}
            >
              <div className="flex items-center gap-2">
                <svg width="22" height="22">
                  <use href="#quest-mark"></use>
                </svg>
                <span className="font-friz text-[11px] tracking-[0.2em] uppercase text-gold">
                  {"Quest 2"}
                </span>
              </div>
              <h4 className="mt-3 font-friz text-lg text-goldhi">
                {"Farm some gold"}
              </h4>
              <p className="mt-1 font-narrow text-[15px] text-parch2">
                {
                  "Load your wallet with the native coin of the chain. No boar-killing required."
                }
              </p>
            </Reveal>
            <Reveal
              tag="div"
              className="reveal tile tile-hover p-5"
              style={{ transitionDelay: ".12s" }}
            >
              <div className="flex items-center gap-2">
                <svg width="22" height="22">
                  <use href="#quest-mark"></use>
                </svg>
                <span className="font-friz text-[11px] tracking-[0.2em] uppercase text-gold">
                  {"Quest 3"}
                </span>
              </div>
              <h4 className="mt-3 font-friz text-lg text-goldhi">
                {"Visit the Auction House"}
              </h4>
              <p className="mt-1 font-narrow text-[15px] text-parch2">
                {
                  "Head to a DEX, paste the contract and swap for $WOWN. Undercut nobody."
                }
              </p>
            </Reveal>
            <Reveal
              tag="div"
              className="reveal tile tile-hover p-5"
              style={{ transitionDelay: ".18s" }}
            >
              <div className="flex items-center gap-2">
                <svg width="22" height="22">
                  <use href="#quest-mark"></use>
                </svg>
                <span className="font-friz text-[11px] tracking-[0.2em] uppercase text-gold">
                  {"Quest 4"}
                </span>
              </div>
              <h4 className="mt-3 font-friz text-lg text-goldhi">
                {"Equip & /flex"}
              </h4>
              <p className="mt-1 font-narrow text-[15px] text-parch2">
                {
                  "Welcome to the guild. Post a meme in chat to claim your title: "
                }
                <span className="text-goldhi">{"<Early Degen>"}</span>
                {"."}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
