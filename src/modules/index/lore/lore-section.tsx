import { Reveal, BarFill } from "@/modules/common/reveal";

/** Preserves the original lore section while isolating its interactive controls. */
export function LoreSection() {
  return (
    <section
      id="lore"
      className="bg-stone relative py-24 md:py-32 px-4 overflow-hidden"
    >
      <div className="relative max-w-5xl mx-auto">
        <Reveal tag="div" className="reveal text-center">
          <div className="eyebrow">{"Lore"}</div>
          <h2 className="title-gold mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            {"The Codex of WOWNILLA"}
          </h2>
        </Reveal>
        <Reveal
          tag="div"
          className="reveal codex mt-12 px-5 py-10 md:px-14 md:py-14"
        >
          <p className="dropcap max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-parch">
            {
              "\n          When the servers were young and the grind was eternal, a golden coin dropped from a dragon nobody could kill. Legends say it is still in someone's bags… unsold. This codex records the chapters of its return.\n        "
            }
          </p>
          <svg className="mx-auto mt-8 w-[220px] h-[14px]" aria-hidden="true">
            <use href="#ornament"></use>
          </svg>
          <div className="mt-8 grid md:grid-cols-2">
            <div className="md:pr-10">
              <article>
                <div className="flex items-center justify-between gap-3 font-friz uppercase text-[11px] tracking-[0.22em]">
                  <span className="text-gold">{"Chapter I"}</span>
                  <span className="text-goldhi">{"✓ Completed"}</span>
                </div>
                <h3 className="mt-2 font-morpheus text-2xl md:text-3xl text-goldhi [text-shadow:0_2px_0_#000]">
                  {"The Spawning"}
                </h3>
                <p className="mt-2 text-parch/85">
                  {
                    "A coin is minted. A sigil is drawn. A guild is born in a voice channel at 3am."
                  }
                </p>
                <ul className="mt-4 space-y-1.5 font-narrow text-[15px]">
                  <li className="flex justify-between">
                    <span className="text-parch">{"Mint the coin"}</span>
                    <span className="text-goldhi">{"1/1"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-parch">{"Write a whitepaper"}</span>
                    <span className="text-parch2">{"skipped"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-parch">
                      {"Build a ridiculously premium website"}
                    </span>
                    <span className="text-goldhi">{"1/1"}</span>
                  </li>
                </ul>
                <p className="mt-4 font-narrow text-sm text-parch2">
                  {"Reward: "}
                  <span className="text-goldhi">
                    {"[Title: Day One Degen]"}
                  </span>
                </p>
              </article>
              <svg
                className="my-8 mx-auto w-[160px] h-[12px] opacity-70"
                aria-hidden="true"
              >
                <use href="#ornament"></use>
              </svg>
              <article>
                <div className="flex items-center justify-between gap-3 font-friz uppercase text-[11px] tracking-[0.22em]">
                  <span className="text-gold">{"Chapter II"}</span>
                  <span className="inline-flex items-center gap-1.5 text-parch">
                    <span className="w-1.5 h-1.5 rotate-45 bg-horde ring-1 ring-goldhi animate-pulse"></span>
                    {"In progress"}
                  </span>
                </div>
                <h3 className="mt-2 font-morpheus text-2xl md:text-3xl text-goldhi [text-shadow:0_2px_0_#000]">
                  {"The Gathering"}
                </h3>
                <p className="mt-2 text-parch/85">
                  {
                    "Rally the guild. Spread the word across every tavern on the internet."
                  }
                </p>
                <div className="mt-4 space-y-3 font-narrow text-[15px]">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-parch">
                        {"Recruit guild members"}
                      </span>
                      <span className="text-goldhi">{"4,269 / 10,000"}</span>
                    </div>
                    <div className="bar-track mt-1.5 h-2.5 overflow-hidden">
                      <BarFill
                        width="42.7%"
                        background="linear-gradient(180deg,#E2C46A,#B88632 60%,#8E6524)"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-parch">{"Forge memes"}</span>
                      <span className="text-goldhi">{"69,420 / ∞"}</span>
                    </div>
                    <div className="bar-track mt-1.5 h-2.5 overflow-hidden">
                      <BarFill
                        width="64%"
                        background="linear-gradient(180deg,#B33A3A,#8B2020 60%,#5E1414)"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-4 font-narrow text-sm text-parch2">
                  {"Reward: "}
                  <span style={{ color: "var(--epic)" }}>
                    {"[Guild Tabard of WOWNILLA]"}
                  </span>
                </p>
              </article>
            </div>

            <div className="md:pl-10 md:border-l border-bronze/70 mt-10 md:mt-0 pt-10 md:pt-0 border-t md:border-t-0">
              <article className="opacity-80">
                <div className="flex items-center justify-between gap-3 font-friz uppercase text-[11px] tracking-[0.22em]">
                  <span className="text-gold">{"Chapter III"}</span>
                  <span className="text-parch2">{"Locked"}</span>
                </div>
                <h3 className="mt-2 font-morpheus text-2xl md:text-3xl text-parch [text-shadow:0_2px_0_#000]">
                  {"The Great Raid"}
                </h3>
                <p className="mt-2 text-parch2">
                  {
                    "Forty heroes. One boss. The legendary FUD Dragon awaits in its lair."
                  }
                </p>
                <ul className="mt-4 space-y-1.5 font-narrow text-[15px] text-parch2">
                  <li className="flex justify-between">
                    <span>{"Reach 10,000 holders"}</span>
                    <span>{"0/1"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{"Defeat the FUD Dragon"}</span>
                    <span>{"0/1"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{"Don't stand in the fire"}</span>
                    <span>{"0/1"}</span>
                  </li>
                </ul>
                <p className="mt-4 font-narrow text-sm text-parch2">
                  {"Reward: "}
                  <span style={{ color: "var(--legendary)" }}>
                    {"[Mount: Golden Moon Wyvern]"}
                  </span>
                </p>
              </article>
              <svg
                className="my-8 mx-auto w-[160px] h-[12px] opacity-70"
                aria-hidden="true"
              >
                <use href="#ornament"></use>
              </svg>
              <article className="opacity-80">
                <div className="flex items-center justify-between gap-3 font-friz uppercase text-[11px] tracking-[0.22em]">
                  <span className="text-gold">{"Chapter IV"}</span>
                  <span className="text-parch2">{"Locked"}</span>
                </div>
                <h3 className="mt-2 font-morpheus text-2xl md:text-3xl text-parch [text-shadow:0_2px_0_#000]">
                  {"Endgame"}
                </h3>
                <p className="mt-2 text-parch2">
                  {
                    "Nobody knows what lies beyond. Some say it's a moon. Some say it's just more grinding."
                  }
                </p>
                <ul className="mt-4 space-y-1.5 font-narrow text-[15px] text-parch2">
                  <li className="flex justify-between">
                    <span>{"Ding! Reach level 60"}</span>
                    <span>{"0/1"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{"???"}</span>
                    <span>{"0/1"}</span>
                  </li>
                </ul>
                <p className="mt-4 font-narrow text-sm text-parch2">
                  {"Reward: "}
                  <span className="text-goldhi">
                    {"Eternal Glory (non-transferable)"}
                  </span>
                </p>
              </article>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
