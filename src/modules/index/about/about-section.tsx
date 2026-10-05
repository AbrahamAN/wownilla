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
      <path d="M18.9 2h3.3l-7.2 8.3L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.9L.5 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.8L6.4 3.9H4.5L17.7 20Z" />
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
                {communityIcon} Join the Tavern
              </a>
            ) : (
              <>
                <button
                  className="btn btn-dark tavern-cta"
                  disabled
                  aria-describedby="tavern-community-status"
                >
                  {communityIcon} Join the Tavern
                </button>
                <p
                  id="tavern-community-status"
                  className="tavern-availability font-narrow text-parch2"
                >
                  X Community link unavailable.
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
