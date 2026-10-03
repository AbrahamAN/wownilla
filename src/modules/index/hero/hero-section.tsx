import Image from "next/image";
import { CopyContract } from "@/modules/index/token/copy-contract";
import { PlatformMark } from "@/modules/index/common/platform-mark";
import { ExternalArrow } from "@/modules/index/common/external-arrow";
import {
  isUsableAddress,
  projectDestinations,
  safeProjectUrl,
  siteConfig,
} from "@/modules/index/common/site-config";
import { HeroBackground, HeroContent, Achievement } from "./hero";

/** Presents the guild invitation while keeping unverified trading and community actions unavailable. */
export function HeroSection() {
  const destinations = projectDestinations();
  const address = isUsableAddress(siteConfig.token)
    ? siteConfig.token.value
    : "";
  const network = safeProjectUrl(siteConfig.resources.network, [
    "robinhood.com",
  ]);
  const launchpad = safeProjectUrl(
    siteConfig.launchpad.url,
    ["app.long.xyz"],
    true,
  );
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
                  loading="eager"
                  className="hero-logo w-[min(94vw,640px)] lg:w-[700px] h-auto select-none"
                  draggable="false"
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="hero-details">
            <h1 className="hero-punchline title-gold mt-6 anim-up d3">
              <span className="block text-parch">The onchain </span>
              <span className="block">vanilla guild.</span>
            </h1>
            <p className="hero-proposition anim-up d3 mt-4 max-w-xl text-sm md:text-base leading-relaxed text-parch/85 [text-shadow:0_2px_8px_#000]">
              $NILLA on Robinhood Chain, launched through LONG. Both factions
              welcome. Someone tell the healer.
            </p>
            <div className="hero-actions anim-up d4">
              {destinations.buy ? (
                <a
                  className="btn btn-gold"
                  href={destinations.buy}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy $NILLA <ExternalArrow />
                </a>
              ) : (
                <button
                  className="btn btn-gold"
                  disabled
                  aria-describedby="hero-destination-status"
                >
                  Buy $NILLA <ExternalArrow />
                </button>
              )}
              {destinations.community ? (
                <a
                  className="btn btn-dark hero-community"
                  href={destinations.community}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join the Tavern
                </a>
              ) : (
                <button
                  className="btn btn-dark hero-community"
                  disabled
                  aria-describedby="hero-destination-status"
                >
                  Join the Tavern
                </button>
              )}
            </div>
            {!destinations.buy || !destinations.community ? (
              <p
                id="hero-destination-status"
                className="hero-availability font-narrow text-parch2"
              >
                {!destinations.buy ? "Purchase link unavailable." : ""}{" "}
                {!destinations.community ? "X Community link unavailable." : ""}
              </p>
            ) : null}
          </div>
          <div className="hero-contract anim-up d4">
            <div className="hero-contract-strip tile">
              <span className="font-narrow text-goldhi">$NILLA</span>
              <code
                className="contract-value text-parch"
                title={address || undefined}
                aria-label={
                  address ? `$NILLA contract address: ${address}` : undefined
                }
              >
                {address
                  ? `${address.slice(0, 6)}…${address.slice(-4)}`
                  : "Contract unavailable"}
              </code>
              <CopyContract
                address={address}
                label="$NILLA contract address"
                successMessage="Copied!"
                showLabel
              />
            </div>
          </div>
          <div className="hero-badges anim-up d5">
            <div className="launch-details">
              {network ? (
                <a
                  className="nav-link"
                  href={network}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlatformMark platform="robinhood" /> Robinhood Chain{" "}
                  <ExternalArrow />
                </a>
              ) : (
                <span>Robinhood Chain</span>
              )}
              {launchpad ? (
                <a
                  className="nav-link"
                  href={launchpad}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LONG launchpad"
                >
                  <PlatformMark platform="long" />
                  <ExternalArrow />
                </a>
              ) : (
                <span>LONG</span>
              )}
            </div>
            <p className="hero-disclaimer font-narrow text-parch2">
              Not financial advice. Just a really good meme.
            </p>
          </div>
        </div>
      </HeroContent>

      <Achievement />
      {/* Section 2 will take ownership of this destination when it is implemented. */}
      <span id="why" className="hero-why-anchor" aria-hidden="true" />
      <a
        href="#why"
        className="scroll-hint flex absolute z-20 bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-1 font-friz uppercase text-[10px] tracking-[0.3em] text-parch2 hover:text-goldhi transition-colors anim-up d5"
      >
        Begin Your Quest
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
