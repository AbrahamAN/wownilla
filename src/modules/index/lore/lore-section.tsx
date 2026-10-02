import { Reveal } from "@/modules/common/reveal";
import { LockGlyph } from "@/modules/index/lore/roadmap-art";
import {
  ROADMAP_PHASES,
  STATUS_LABEL,
} from "@/modules/index/lore/roadmap-data";
import { RoadmapMap } from "@/modules/index/lore/roadmap-map";

/**
 * Lore section as a roadmap: the interactive world map is a client island,
 * while the heading and the phase ledger stay server rendered so the journey
 * is readable without JavaScript and describes each marker to assistive tech.
 */
export function LoreSection() {
  return (
    <section
      id="lore"
      className="bg-stone relative py-24 md:py-32 px-4 overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto">
        <Reveal tag="div" className="reveal text-center">
          <div className="eyebrow">{"Lore"}</div>
          <h2 className="title-gold mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            {"The Road Ahead"}
          </h2>
          <svg className="mx-auto mt-5 w-[200px] h-[14px]" aria-hidden="true">
            <use href="#ornament"></use>
          </svg>
          <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-parch/85">
            {
              "Four waypoints chart the guild's journey across an uncharted world. Hover or tap a marker to read what each phase holds."
            }
          </p>
        </Reveal>
        <Reveal tag="div" className="reveal mt-6 md:mt-2">
          <RoadmapMap />
        </Reveal>
        <Reveal tag="div" className="reveal mt-10">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP_PHASES.map((phase) => {
              const lit = phase.status === "in-progress";
              return (
                <li
                  key={phase.id}
                  className={`tile p-4${lit ? " border-gold!" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-friz uppercase text-[11px] tracking-[0.22em] text-gold">
                      {phase.numeral}
                    </span>
                    <span className="rm-status" data-status={phase.status}>
                      {lit ? (
                        <span className="rm-status-dot" aria-hidden="true" />
                      ) : (
                        <LockGlyph className="w-3 h-3" />
                      )}
                      {STATUS_LABEL[phase.status]}
                    </span>
                  </div>
                  <h3
                    className={`mt-2 font-morpheus text-xl [text-shadow:0_2px_0_#000] ${lit ? "text-goldhi" : "text-parch"}`}
                  >
                    {phase.title}
                  </h3>
                  <p
                    id={`roadmap-${phase.id}`}
                    className={`mt-2 font-narrow text-[15px] leading-snug ${lit ? "text-parch/90" : "text-parch2"}`}
                  >
                    {phase.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
