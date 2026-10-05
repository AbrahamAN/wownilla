import { projectDestinations } from "@/modules/index/common/site-config";
import { WhyAtmosphere } from "./why-atmosphere";
import { WhyMemories } from "./why-memories";

/** Gives the reunion story a readable server-rendered home before the Tavern invitation. */
export function WhySection() {
  const community = projectDestinations().community;

  return (
    <section id="why" className="why-section" aria-labelledby="why-title">
      <WhyMemories />
      <WhyAtmosphere />
      <div className="why-reading-column">
        <h2 id="why-title" className="why-title font-friz">
          <span className="block text-parch">The loot changed.</span>{" "}
          <span className="block text-goldhi">The party didn’t.</span>
        </h2>
        <p className="why-subheading text-parch2">
          For everyone who logged out of Vanilla but never really left.
        </p>
        <div className="why-story text-parch">
          <p>
            You remember the voice chat more than the loot. The terrible pulls.
            The late nights. The guy who said “five minutes” and disappeared for
            a decade.
          </p>
          <p>
            Wownilla exists to bring that particular kind of chaos back
            together. Players from everywhere, sharing memes, finding people to
            play with, and making new stories worth retelling.
          </p>
          <p>
            We have jobs now. Some of us even have sleep schedules. But get the
            right people in the same chat and suddenly “one more run” sounds
            reasonable again.
          </p>
        </div>
        <div className="why-invitation">
          {community ? (
            <a
              className="btn btn-dark why-cta"
              href={community}
              target="_blank"
              rel="noopener noreferrer"
            >
              Find Your Party
            </a>
          ) : (
            <>
              <button
                className="btn btn-dark why-cta"
                disabled
                aria-describedby="why-community-status"
              >
                Find Your Party
              </button>
              <p
                id="why-community-status"
                className="why-availability font-narrow text-parch2"
              >
                X Community link unavailable.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
