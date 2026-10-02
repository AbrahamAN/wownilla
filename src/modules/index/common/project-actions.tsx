import { siteConfig } from "./site-config";
import { ExternalArrow } from "./external-arrow";
import { SocialLinks } from "./social-links";

/** Repeats trade placeholders and social utilities consistently while the token awaits launch. */
export function ProjectActions({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`project-actions flex flex-wrap items-center justify-center gap-3${compact ? " compact-actions" : ""}`}
    >
      <SocialLinks />
      <button
        type="button"
        className="btn btn-gold trade-action trade-placeholder px-6 py-3 text-xs"
        disabled
        title="Coming at launch"
      >
        Buy {siteConfig.ticker} <ExternalArrow />
      </button>
    </div>
  );
}
