import Image from "next/image";
import { ContractAddress } from "@/modules/index/common/contract-address";
import { ProjectActions } from "@/modules/index/common/project-actions";
import { LaunchDetails } from "@/modules/index/common/launch-details";
import { siteConfig } from "@/modules/index/common/site-config";
import { HeroBackground, HeroContent, Achievement } from "./hero";
import { FactionBadge } from "./faction-badge";

/** Preserves the original top section while isolating its interactive controls. */
export function HeroSection() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] hero-section w-full overflow-hidden bg-ink"
    >
      <HeroBackground />
      <div className="cine-top absolute inset-x-0 top-0 h-1/2 bg-[#050403] z-30 pointer-events-none"></div>
      <div className="cine-bot absolute inset-x-0 bottom-0 h-1/2 bg-[#050403] z-30 pointer-events-none"></div>

      <HeroContent>
        <div className="hero-layout">
          <div className="hero-identity">
            <FactionBadge />
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
              <div className="hero-wordmark anim-up d2 w-full flex justify-center">
                <Image
                  src="/assets/wownilla-logo.webp"
                  alt="Wownilla"
                  width={1433}
                  height={563}
                  decoding="async"
                  fetchPriority="high"
                  className="hero-logo w-[min(94vw,640px)] lg:w-[700px] h-auto select-none"
                  draggable="false"
                  unoptimized
                />
              </div>
            </div>
            <div className="hero-contract mt-4 w-full anim-up d3">
              <ContractAddress />
            </div>
          </div>
          <div className="hero-details">
            <h1 className="hero-punchline title-gold mt-6 anim-up d3">
              <span className="block text-parch">The onchain </span>
              <span className="block">vanilla guild.</span>
            </h1>
            <p className="hero-proposition anim-up d3 mt-4 max-w-xl text-sm md:text-base leading-relaxed text-parch/85 [text-shadow:0_2px_8px_#000]">
              {`${siteConfig.ticker} is coming to Robinhood Chain through LONG. Built for the guild, shared across factions. The grind is eternal.`}
            </p>
            <div className="hero-utilities anim-up d4 mt-6 flex flex-col items-center">
              <ProjectActions />
              <div className="mt-4 mb-4">
                <LaunchDetails />
              </div>
              <p className="anim-up d5 font-narrow text-[11px] sm:text-xs text-parch2 mt-4 tracking-wide">
                {"Not financial advice. Just a really good meme."}
              </p>
            </div>
          </div>
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
