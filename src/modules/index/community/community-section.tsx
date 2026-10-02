import { ProjectActions } from "@/modules/index/common/project-actions";
import { ContractAddress } from "@/modules/index/common/contract-address";
import { Reveal, Counter } from "@/modules/common/reveal";
import { GuildChat } from "./guild-chat";

/** Preserves the original community section while isolating its interactive controls. */
export function CommunitySection() {
  return (
    <section
      id="community"
      className="bg-leather relative py-24 md:py-32 px-4 overflow-hidden border-t border-leather"
    >
      <div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(184,134,50,0.12), transparent 60%)",
        }}
      ></div>
      <div className="relative max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
        <Reveal tag="div" className="reveal text-center lg:text-left">
          <div className="eyebrow lg:justify-start lg:before:hidden">
            {"Community"}
          </div>
          <h2 className="title-gold mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            {"The Guild is Recruiting"}
          </h2>
          <p className="mt-5 max-w-lg mx-auto lg:mx-0 text-base md:text-lg leading-relaxed text-parch/85">
            {
              "\n          All classes. All levels. All degens. No DKP, no gear check, no mandatory raid nights — just bring memes and good vibes. Healers especially welcome.\n        "
            }
          </p>
          <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-2 font-friz uppercase text-[10px] tracking-[0.2em]">
            <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-horde/80 bg-horde/20 px-2.5 py-1 text-parch">
              <span className="w-1.5 h-1.5 bg-horde ring-1 ring-[#C44] rotate-45"></span>
              {"Horde welcome"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-alliance/80 bg-alliance/20 px-2.5 py-1 text-parch">
              <span className="w-1.5 h-1.5 bg-alliance ring-1 ring-[#58C] rotate-45"></span>
              {"Alliance tolerated"}
            </span>
          </div>
          <div className="mt-8">
            <ProjectActions />
            <p className="mt-3 text-parch2 text-sm">
              Official guild invites have not been confirmed. Explore the guild
              lore while the gates are prepared.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
            <div className="tile p-4 text-center">
              <div className="font-friz text-2xl md:text-3xl text-goldhi">
                <Counter value={4269} />
              </div>
              <div className="mt-1 font-narrow text-[12px] uppercase tracking-wide text-parch2">
                {"Guild members"}
              </div>
            </div>
            <div className="tile p-4 text-center">
              <div className="font-friz text-2xl md:text-3xl text-goldhi">
                <Counter value={69420} />
              </div>
              <div className="mt-1 font-narrow text-[12px] uppercase tracking-wide text-parch2">
                {"Memes forged"}
              </div>
            </div>
            <div className="tile p-4 text-center">
              <div className="font-friz text-2xl md:text-3xl text-goldhi">
                {"1"}
              </div>
              <div className="mt-1 font-narrow text-[12px] uppercase tracking-wide text-parch2">
                {"Braincell shared"}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal
          tag="div"
          className="reveal panel overflow-hidden"
          style={{ transitionDelay: ".1s" }}
        >
          <div className="flex items-center gap-1 px-2 border-b border-leather font-friz text-[12px]">
            <span className="px-3 py-2 text-parch2">{"General"}</span>
            <span className="px-3 py-2 text-goldhi border-b-2 border-gold">
              {"Guild"}
            </span>
            <span className="px-3 py-2 text-parch2">{"Trade"}</span>
            <span className="ml-auto hidden min-[420px]:flex items-center gap-1.5 pr-2 font-narrow text-[12px] text-parch2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6DBE5E] animate-pulse"></span>
              {"<WOWNILLA> · 312 online"}
            </span>
          </div>
          <GuildChat />
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 tile px-3 py-2.5 font-narrow text-[14px] text-parch2">
              <span className="c-guild">{"Guild:"}</span>
              {" type /join to become a legend…\n          "}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal
        tag="div"
        className="reveal relative max-w-3xl mx-auto mt-24 text-center"
      >
        <svg className="mx-auto w-[200px] h-[14px]" aria-hidden="true">
          <use href="#ornament"></use>
        </svg>
        <h3 className="title-gold mt-6 text-4xl md:text-5xl leading-tight">
          {"Need or Greed? "}
          <span className="text-parch">{"Both."}</span>
        </h3>
        <p className="mt-3 text-parch2">
          {"The loot roll is open. Your seat in the raid is waiting."}
        </p>
        <div className="mt-7">
          <ProjectActions />
        </div>
        <div className="mt-6">
          <ContractAddress />
        </div>
      </Reveal>
    </section>
  );
}
