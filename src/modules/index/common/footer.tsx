import Image from "next/image";
import { CopyContract } from "../token/copy-contract";
import {
  isUsableAddress,
  projectDestinations,
  siteConfig,
} from "./site-config";

/** Keeps guild destinations and contract controls consistent while preserving the legal attribution. */
export function Footer() {
  const destinations = projectDestinations();
  const address = isUsableAddress(siteConfig.token)
    ? siteConfig.token.value
    : "";
  return (
    <footer className="site-footer bg-stone">
      <div className="footer-content">
        <div className="footer-brand">
          <a href="#top" aria-label="Wownilla — back to top">
            <Image
              src="/assets/wownilla-logo-mug.webp"
              alt="Wownilla"
              width={1433}
              height={563}
              sizes="180px"
              className="footer-logo"
            />
          </a>
          <p className="font-narrow text-parch2">{`${siteConfig.ticker} is a meme coin with no intrinsic value or expectation of financial return. Not financial advice. Just a really good meme.`}</p>
        </div>
        <div className="footer-links">
          <nav aria-label="Footer" className="font-friz">
            {[
              { href: "#why", label: "Why Wownilla" },
              { href: "#tavern", label: "Tavern" },
              { href: "#token", label: "Auction House" },
              { href: "#vault", label: "Guild Vault" },
              { href: "#lore", label: "Road Ahead" },
              { href: "#community", label: "One Slot Open" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="footer-community">
            {destinations.community ? (
              <a
                className="btn btn-dark"
                href={destinations.community}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Telegram
              </a>
            ) : (
              <button
                className="btn btn-dark"
                disabled
                title="Telegram community link unavailable"
              >
                Telegram community unavailable
              </button>
            )}
          </div>
          <div className="footer-contract tile">
            <span className="font-narrow text-goldhi">$NILLA</span>
            <code
              className="contract-value text-parch2"
              title={address || undefined}
              aria-label={
                address
                  ? `$NILLA contract address: ${address}`
                  : "$NILLA contract unavailable"
              }
            >
              {address
                ? `${address.slice(0, 8)}…${address.slice(-6)}`
                : "Contract unavailable"}
            </code>
            {address ? (
              <CopyContract
                address={address}
                label="$NILLA contract"
                showLabel
                successMessage="Copied!"
              />
            ) : (
              <button
                className="btn btn-dark"
                disabled
                aria-label="Copy $NILLA contract"
              >
                Copy
              </button>
            )}
          </div>
        </div>
        <div className="footer-attribution font-narrow text-parch2">
          <span>© 2026 WOWNILLA. Forged by the guild.</span>
          <span>
            Fan-made parody. Not affiliated with, endorsed by, or connected to
            Blizzard Entertainment.
          </span>
        </div>
      </div>
    </footer>
  );
}
