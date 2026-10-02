import { Reveal } from "@/modules/common/reveal";

/** Preserves the original about section while isolating its interactive controls. */
export function AboutSection() {
  return (
    <section id="about" className="bg-stone relative py-24 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal
          tag="div"
          className="reveal panel max-w-4xl mx-auto px-5 pt-10 pb-8 md:px-12 md:pt-12 md:pb-10 text-center"
        >
          <div className="absolute left-1/2 -top-[26px] -translate-x-1/2">
            <span className="plate">{"Character Info"}</span>
          </div>
          <div className="eyebrow">{"About"}</div>
          <h2 className="title-gold mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            {"\n          Born in the "}
            <span className="text-parch">{"vanilla"}</span>
            {" days. Raised by the memes.\n        "}
          </h2>
          <svg className="mx-auto mt-5 w-[200px] h-[14px]" aria-hidden="true">
            <use href="#ornament"></use>
          </svg>
          <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-parch/85">
            {
              "\n          WOWNILLA started as a joke in guild chat at 3am, right after a forty-person wipe. Someone typed "
            }
            <span className="text-goldhi">
              {"“what if the gold was real?”"}
            </span>
            {
              " Nobody laughed. So we forged it. No roadmap wizards, no VC dragons — just a guild of degenerates who never stopped grinding.\n        "
            }
          </p>
        </Reveal>

        <div className="mt-14 md:mt-16 grid gap-6 md:grid-cols-3">
          <Reveal
            tag="article"
            className="reveal tooltip-card p-5 text-left font-narrow"
            style={{ "--rarity": "var(--legendary)" }}
          >
            <div className="flex items-start gap-4">
              <div className="item-icon shrink-0 grid place-items-center w-14 h-14">
                <svg width="40" height="40" aria-hidden="true">
                  <use href="#coin-art"></use>
                </svg>
              </div>
              <div>
                <h3
                  className="font-friz text-[16px]"
                  style={{ color: "var(--legendary)" }}
                >
                  {"[WOWNILLA Coin]"}
                </h3>
                <p className="text-[13px] text-parch">{"Binds when HODLed"}</p>
                <p className="text-[13px] text-parch">{"Unique-Equipped"}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-[13px] text-parch">
              <span>{"Trinket"}</span>
              <span>{"Legendary"}</span>
            </div>
            <ul className="mt-2 space-y-0.5 text-[14px] text-parch">
              <li>{"+69 Vibes"}</li>
              <li>{"+420 Community"}</li>
              <li>{"+1 Braincell (shared)"}</li>
            </ul>
            <p
              className="mt-3 text-[14px]"
              style={{ color: "var(--uncommon)" }}
            >
              {"Equip: Increases your meme critical strike chance by 100%."}
            </p>
            <p className="mt-3 text-[14px] text-goldhi">
              {
                "“Minted in the chaos of Azeroth. Worth exactly one (1) good laugh.”"
              }
            </p>
          </Reveal>
          <Reveal
            tag="article"
            className="reveal tooltip-card p-5 text-left font-narrow"
            style={{ "--rarity": "var(--epic)", transitionDelay: ".08s" }}
          >
            <div className="flex items-start gap-4">
              <div className="item-icon shrink-0 grid place-items-center w-14 h-14">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8"
                    stroke="#E8D7A8"
                    strokeWidth="1.5"
                  ></path>
                  <path
                    d="M6 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z M8 8v10a2 2 0 1 1-4 0"
                    stroke="#E8D7A8"
                    strokeWidth="1.5"
                  ></path>
                  <path
                    d="M11 9h5M11 12h5M11 15h3"
                    stroke="#B88632"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
              <div>
                <h3
                  className="font-friz text-[16px]"
                  style={{ color: "var(--epic)" }}
                >
                  {"[Scroll of Infinite Memes]"}
                </h3>
                <p className="text-[13px] text-parch">{"Binds when shared"}</p>
                <p className="text-[13px] text-parch">{"Stacks to ∞"}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-[13px] text-parch">
              <span>{"Consumable"}</span>
              <span>{"Epic"}</span>
            </div>
            <ul className="mt-2 space-y-0.5 text-[14px] text-parch">
              <li>{"+100 Engagement"}</li>
              <li>{"+50 Ratio Resistance"}</li>
            </ul>
            <p
              className="mt-3 text-[14px]"
              style={{ color: "var(--uncommon)" }}
            >
              {"Use: Summons a fresh meme into guild chat. (0 sec cooldown)"}
            </p>
            <p className="mt-3 text-[14px] text-goldhi">
              {"“The ink never dries. Neither do the jokes.”"}
            </p>
          </Reveal>
          <Reveal
            tag="article"
            className="reveal tooltip-card p-5 text-left font-narrow"
            style={{ "--rarity": "var(--rare)", transitionDelay: ".16s" }}
          >
            <div className="flex items-start gap-4">
              <div className="item-icon shrink-0 grid place-items-center w-14 h-14">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3h6M10 3v5L5.5 16.5A3 3 0 0 0 8.2 21h7.6a3 3 0 0 0 2.7-4.5L14 8V3"
                    stroke="#E8D7A8"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M7 15h10l1.2 2.2A2 2 0 0 1 16.4 20H7.6a2 2 0 0 1-1.8-2.8z"
                    fill="#3F7BCB"
                    opacity="0.85"
                  ></path>
                  <circle cx="10" cy="17" r="0.9" fill="#fff"></circle>
                  <circle cx="13.5" cy="18" r="0.6" fill="#fff"></circle>
                </svg>
              </div>
              <div>
                <h3
                  className="font-friz text-[16px]"
                  style={{ color: "var(--rare)" }}
                >
                  {"[Potion of Diamond Paws]"}
                </h3>
                <p className="text-[13px] text-parch">{"Requires Level 1"}</p>
                <p className="text-[13px] text-parch">
                  {"Flavor: Vanilla (obviously)"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-[13px] text-parch">
              <span>{"Potion"}</span>
              <span>{"Rare"}</span>
            </div>
            <ul className="mt-2 space-y-0.5 text-[14px] text-parch">
              <li>{"+200 Patience"}</li>
              <li>{"+15 Stamina (to not check charts)"}</li>
            </ul>
            <p
              className="mt-3 text-[14px]"
              style={{ color: "var(--uncommon)" }}
            >
              {"Use: Grants immunity to FUD for 24 hrs."}
            </p>
            <p className="mt-3 text-[14px] text-goldhi">
              {"“Side effects may include telling strangers about WOWNILLA.”"}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
