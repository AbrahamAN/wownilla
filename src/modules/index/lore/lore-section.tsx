import { ROADMAP_PHASES } from "./roadmap-data";
import { RoadmapMap } from "./roadmap-map";

/** Keeps every quest server rendered for checkpoint selection and native disclosure fallback. */
export function LoreSection() {
  return (
    <section
      id="lore"
      className="road-section bg-stone"
      aria-labelledby="road-title"
    >
      <div className="road-content">
        <header className="road-heading">
          <p className="eyebrow">THE ROAD AHEAD</p>
          <h2 id="road-title" className="font-friz text-parch">
            First, gather the party.
          </h2>
        </header>
        <RoadmapMap>
          {ROADMAP_PHASES.map((quest, index) => (
            <details
              key={quest.id}
              id={`roadmap-${quest.id}`}
              className="quest-panel"
              data-quest={quest.id}
              open={index === 0}
            >
              <summary className="font-friz text-parch">
                {quest.numeral} — {quest.title}
              </summary>
              <div className="quest-body">
                <h3
                  id={`roadmap-${quest.id}-title`}
                  className="font-friz text-goldhi"
                >
                  {quest.numeral} — {quest.title}
                </h3>
                <p className="quest-description text-parch">
                  {quest.description}
                </p>
                <ul className="quest-checklist text-parch2">
                  {quest.items.map((item) => (
                    <li key={item.text}>
                      {item.text}
                      {item.evaluation && (
                        <span className="quest-evaluation font-narrow">
                          Under evaluation
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {quest.qualification && (
                  <p className="quest-qualification text-parch2">
                    {quest.qualification}
                  </p>
                )}
              </div>
            </details>
          ))}
        </RoadmapMap>
      </div>
    </section>
  );
}
