import Image from "next/image";
import { HeroBackground, HeroContent, Achievement } from "./hero";

/** Preserves the original top section while isolating its interactive controls. */
export function HeroSection() {
  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-ink"
    >
      <HeroBackground />
      <div className="cine-top absolute inset-x-0 top-0 h-1/2 bg-[#050403] z-30 pointer-events-none"></div>
      <div className="cine-bot absolute inset-x-0 bottom-0 h-1/2 bg-[#050403] z-30 pointer-events-none"></div>

      <HeroContent>
        <div className="mb-6 anim-up d1">
          <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-[3px] border border-bronze bg-[#0B0A08]/75 px-3 sm:px-4 py-2 font-friz uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[11px] text-parch shadow-[inset_0_1px_0_rgba(212,175,55,0.15),0_6px_16px_rgba(0,0,0,0.5)]">
            <span className="flex items-center justify-center bg-horde w-5 h-5 rounded-[2px] ring-1 ring-gold/70 shadow-[0_0_10px_rgba(139,32,32,0.6)]">
              <svg
                width="12"
                height="12"
                className="text-goldhi"
                aria-hidden="true"
              >
                <use href="#logo-w"></use>
              </svg>
            </span>
            {"\n          Forged for the Horde\n        "}
          </span>
        </div>
        <div className="relative flex justify-center w-full">
          <div
            className="coin-glow pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[110%] max-w-[900px] aspect-[2/1] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(212,175,55,0.28) 0%, rgba(184,134,50,0.1) 45%, rgba(184,134,50,0) 70%)",
              filter: "blur(14px)",
            }}
            aria-hidden="true"
          ></div>
          <h1 className="anim-up d2 w-full flex justify-center">
            <span className="sr-only">
              {"Welcome to the world of WOWNILLA"}
            </span>
            <Image
              src="/assets/wownilla-logo.webp"
              alt=""
              width={1433}
              height={563}
              decoding="async"
              fetchPriority="high"
              className="hero-logo w-[min(94vw,640px)] lg:w-[700px] h-auto select-none"
              draggable="false"
              unoptimized
            />
          </h1>
        </div>
        <p className="anim-up d3 mt-5 max-w-2xl text-sm md:text-lg leading-relaxed text-parch/85 [text-shadow:0_2px_8px_#000]">
          {
            "\n        Forget boring coins. WOWNILLA is a community-powered meme forged in the chaos of Azeroth. No quests, no raids, no spreadsheets — just vibes, memes, and the eternal grind.\n      "
          }
        </p>
        <div className="anim-up d4 mt-8 flex flex-col items-center">
          <div className="flex flex-col min-[400px]:flex-row items-stretch min-[400px]:items-center justify-center gap-3 w-full max-w-[320px] min-[400px]:max-w-none">
            <a
              href="#community"
              className="btn btn-gold inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 text-[13px]"
            >
              <svg
                width="14"
                height="14"
                className="text-ink2"
                aria-hidden="true"
              >
                <use href="#logo-w"></use>
              </svg>
              {"\n            Join the Horde\n          "}
            </a>
            <a
              href="#lore"
              className="btn btn-dark inline-flex items-center justify-center px-7 sm:px-9 py-3.5 text-[13px]"
            >
              {"Read the Lore"}
            </a>
          </div>
          <p className="anim-up d5 font-narrow text-[11px] sm:text-xs text-parch2 mt-4 tracking-wide">
            {"Not financial advice. Just a really good meme."}
          </p>
        </div>
      </HeroContent>

      <Achievement />
      <a
        href="#about"
        className="scroll-hint hidden md:flex absolute z-20 bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-1 font-friz uppercase text-[10px] tracking-[0.3em] text-parch2 hover:text-goldhi transition-colors anim-up d5"
      >
        {"\n      Begin your quest\n      "}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="animate-bounce"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      </a>
    </section>
  );
}
