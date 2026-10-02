import { MarketPanel } from "./market-panel";
import { siteConfig } from "@/modules/index/common/site-config";
import { Reveal } from "@/modules/common/reveal";

/** Explains the prelaunch project in three server-rendered steps before the market and buying guide. */
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
          <div className="eyebrow">The guild handbook</div>
          <h2 className="title-gold mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            How it works
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-parch2">
            Three things to know before the gates open.
          </p>
          <p className="mt-5 font-narrow text-xs tracking-[0.18em] uppercase text-gold">
            01 · Pair / 02 · Vault / 03 · Guild
          </p>
        </Reveal>
        <div className="how-it-works-grid mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              number: "01",
              label: "Pair",
              status: "Planned",
              title: "Paired with tokenized $MSFT",
              description: `${siteConfig.ticker}'s planned pair is Robinhood's tokenized $MSFT on ${siteConfig.chain.name}. From software to the cloud, the guild rides alongside the tools that power the digital world.`,
              artwork: "coin-art",
            },
            {
              number: "02",
              label: "Vault",
              status: "Planned",
              title: "Trading fees feed the vault",
              description: `Trading fees are planned to flow into the ${siteConfig.launchpad.name} community vault—the guild's shared war chest. The Auction House brings activity back to the community.`,
              artwork: "swords",
            },
            {
              number: "03",
              label: "Guild",
              status: "Planned",
              title: "Guild driven",
              description: `${siteConfig.ticker} holders are the guild. Its members will fully guide the direction of this community token, shaping its ideas, culture and next chapter. The guild sets the course.`,
              artwork: "logo-w",
            },
          ].map((step) => (
            <Reveal
              tag="article"
              key={step.number}
              className="reveal panel how-it-works-card p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="how-it-works-number font-morpheus text-goldhi"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <span className="plate">{step.status}</span>
              </div>
              <p className="mt-4 font-narrow text-xs uppercase tracking-[0.18em] text-gold">
                {step.label}
              </p>
              <h3 className="mt-3 font-friz text-2xl leading-snug text-parch">
                {step.title}
              </h3>
              <p className="mt-4 font-narrow text-lg leading-relaxed text-parch2">
                {step.description}
              </p>
              <div className="how-it-works-art mt-auto pt-8" aria-hidden="true">
                <svg
                  viewBox={
                    step.artwork === "coin-art" ? "0 0 200 200" : "0 0 24 24"
                  }
                  className="text-goldhi"
                >
                  <use href={`#${step.artwork}`} />
                </svg>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 max-w-3xl mx-auto text-center text-sm leading-relaxed text-parch2">
          Prelaunch design. The deployed pair, fee routing and community
          decision rules await verification. Wownilla is independent of
          Microsoft and Robinhood.
        </p>

        <MarketPanel />
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
                {`The ${siteConfig.ticker} launch is planned on ${siteConfig.launchpad.name}. The verified token destination will be posted when the gates open.`}
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
