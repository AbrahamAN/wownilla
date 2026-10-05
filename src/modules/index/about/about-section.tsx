import Image from "next/image";
import { projectDestinations } from "@/modules/index/common/site-config";
import { TavernAtmosphere } from "./tavern-atmosphere";

/** Presents the Tavern invitation while preserving the original About section's incoming anchor. */
export function AboutSection() {
  const community = projectDestinations().community;
  const communityIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.44 3.34 2.77 10.54c-1.27.5-1.26 1.2-.23 1.51l4.79 1.49 1.84 5.65c.23.63.12.88.79.88.52 0 .75-.24 1.04-.52l2.33-2.26 4.85 3.58c.89.49 1.53.24 1.75-.83l3.16-14.89c.32-1.3-.49-1.89-1.65-1.81ZM8.08 13.2l10.79-6.81c.54-.33 1.04-.15.63.21l-8.69 7.84-.34 3.66-2.39-4.9Z" />
    </svg>
  );

  return (
    <section
      id="tavern"
      className="tavern-section"
      aria-labelledby="tavern-title"
    >
      <span id="about" className="tavern-legacy-anchor" aria-hidden="true" />
      <div className="tavern-layout">
        <div className="tavern-copy">
          <p className="eyebrow">THE TAVERN</p>
          <h2 id="tavern-title" className="tavern-title font-friz text-parch">
            Someone saved you a seat.
          </h2>
          <p className="tavern-description text-parch">
            The tank is late. The healer has opinions. Someone brought a friend
            who thinks Vanilla is a flavor.
          </p>
          <p className="tavern-welcome text-parch">You’ll fit right in.</p>
          <div className="tavern-invitation">
            {community ? (
              <a
                className="btn btn-dark tavern-cta"
                href={community}
                target="_blank"
                rel="noopener noreferrer"
              >
                {communityIcon} Join Telegram
              </a>
            ) : (
              <>
                <button
                  className="btn btn-dark tavern-cta"
                  disabled
                  aria-describedby="tavern-community-status"
                >
                  {communityIcon} Join Telegram
                </button>
                <p
                  id="tavern-community-status"
                  className="tavern-availability font-narrow text-parch2"
                >
                  Telegram community link unavailable.
                </p>
              </>
            )}
          </div>
        </div>
        <div className="tavern-scene" aria-hidden="true">
          <Image
            src="/assets/tavern-innkeepers.png"
            alt=""
            width={1122}
            height={1402}
            sizes="(min-width: 1024px) 760px, 100vw"
            className="tavern-artwork"
          />
          <TavernAtmosphere />
        </div>
      </div>
    </section>
  );
}
