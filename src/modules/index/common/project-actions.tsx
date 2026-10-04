import { projectDestinations, siteConfig } from "./site-config";
import { ExternalArrow } from "./external-arrow";
import { SocialLinks } from "./social-links";

/** Keeps navigation trade actions aligned with the same verified destinations used by page sections. */
export function ProjectActions({ compact = false }: { compact?: boolean }) {
  const buy = projectDestinations().buy;
  return (
    <div
      className={`project-actions flex flex-wrap items-center justify-center gap-3${compact ? " compact-actions" : ""}`}
    >
      <SocialLinks />
      {buy ? (
        <a
          className="btn btn-gold trade-action"
          href={buy}
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy {siteConfig.ticker} <ExternalArrow />
        </a>
      ) : (
        <button
          type="button"
          className="btn btn-gold trade-action trade-placeholder px-6 py-3 text-xs"
          disabled
          title="Purchase link unavailable"
        >
          Buy {siteConfig.ticker} <ExternalArrow />
        </button>
      )}
    </div>
  );
}
