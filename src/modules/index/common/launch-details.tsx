import { safeProjectUrl, siteConfig } from "./site-config";
import { ExternalArrow } from "./external-arrow";
import { PlatformMark } from "./platform-mark";

/** Distinguishes the planned launch platform and network from an enabled token trading destination. */
export function LaunchDetails() {
  const launchpad = safeProjectUrl(
    siteConfig.launchpad.url,
    ["app.long.xyz"],
    true,
  );
  const network = safeProjectUrl(siteConfig.resources.network, [
    "robinhood.com",
  ]);
  return (
    <div className="launch-details flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-narrow">
      <span className="text-goldhi">
        {siteConfig.launchStatus === "live"
          ? "Launch announced"
          : "Prelaunch · coming soon"}
      </span>
      {network ? (
        <a
          className="nav-link inline-flex items-center gap-1"
          href={network}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PlatformMark platform="robinhood" /> {siteConfig.chain.name}{" "}
          <ExternalArrow />
        </a>
      ) : (
        <span className="text-parch2">
          {siteConfig.chain.name || "Chain coming soon"}
        </span>
      )}
      {launchpad ? (
        <a
          className="nav-link inline-flex items-center gap-1"
          href={launchpad}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PlatformMark platform="long" />{" "}
          <span className="sr-only">{siteConfig.launchpad.name} </span>launchpad{" "}
          <ExternalArrow />
        </a>
      ) : null}
    </div>
  );
}
