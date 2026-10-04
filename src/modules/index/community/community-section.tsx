import { ExternalArrow } from "../common/external-arrow";
import { projectDestinations } from "../common/site-config";

/** Closes the guild invitation without simulated activity or unverified trading redirects. */
export function CommunitySection() {
  const destinations = projectDestinations();
  return (
    <section
      id="community"
      className="closing-section"
      aria-labelledby="closing-title"
    >
      <span id="chat" className="closing-legacy-anchor" aria-hidden="true" />
      <div className="closing-content">
        <h2 id="closing-title" className="font-friz text-parch">
          ONE SLOT OPEN.
        </h2>
        <p className="closing-description text-parch2">
          <span>Your old guildmates might be here.</span>
          <span>Your next ones could be.</span>
        </p>
        <div className="closing-actions">
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
              aria-describedby="closing-availability"
            >
              Buy $NILLA <ExternalArrow />
            </button>
          )}
          {destinations.community ? (
            <a
              className="btn btn-dark"
              href={destinations.community}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the Tavern
            </a>
          ) : (
            <button
              className="btn btn-dark"
              disabled
              aria-describedby="closing-availability"
            >
              Join the Tavern
            </button>
          )}
        </div>
        <p className="closing-microcopy text-parch">
          No gear check. Bring your worst memes.
        </p>
        {(!destinations.buy || !destinations.community) && (
          <p
            id="closing-availability"
            className="closing-availability font-narrow text-parch2"
          >
            {!destinations.buy && "Purchase link unavailable."}
            {!destinations.buy && !destinations.community && " "}
            {!destinations.community && "X Community link unavailable."}
          </p>
        )}
      </div>
    </section>
  );
}
