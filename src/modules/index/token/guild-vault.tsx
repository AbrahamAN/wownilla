import { ExternalArrow } from "../common/external-arrow";
import { safeProjectUrl, siteConfig } from "../common/site-config";

/** Explains LONG's general vault mechanics without asserting Wownilla-specific deployment or rewards. */
export function GuildVault() {
  const documentation = safeProjectUrl(siteConfig.vault.documentation, [
    "x.com",
  ]);
  return (
    <section id="vault" className="vault-section" aria-labelledby="vault-title">
      <div className="vault-layout">
        <div className="vault-copy">
          <p className="eyebrow">THE GUILD VAULT</p>
          <h2 id="vault-title" className="font-friz text-parch">
            The loot doesn’t sit idle.
          </h2>
          <p className="text-parch2">
            LONG’s community vaults collect stock tokens and put them to work in
            trading pools. Fees earned flow back into the vault and can be
            reinvested.
          </p>
        </div>
        <div className="vault-panel">
          <svg
            className="vault-chest"
            viewBox="0 0 320 190"
            width="320"
            height="190"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="vault-wood"
                x1="160"
                y1="50"
                x2="160"
                y2="170"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5b3c23" />
                <stop offset="1" stopColor="#21170e" />
              </linearGradient>
              <linearGradient
                id="vault-metal"
                x1="160"
                y1="65"
                x2="160"
                y2="160"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#c19a4a" />
                <stop offset="1" stopColor="#69512c" />
              </linearGradient>
            </defs>
            <ellipse
              cx="161"
              cy="165"
              rx="111"
              ry="14"
              fill="#050403"
              opacity=".5"
            />
            <g stroke="#a58748" strokeWidth="1.5">
              <path d="m226 71 32 8-7 40-32-8z" fill="#41351f" />
              <path d="m237 86 13 3m-15 5 11 3m-13 5 7 2" stroke="#c3af77" />
              <ellipse cx="233" cy="135" rx="21" ry="7" fill="#7b5c29" />
              <ellipse cx="242" cy="147" rx="21" ry="7" fill="#947337" />
              <ellipse cx="70" cy="149" rx="19" ry="6" fill="#947337" />
              <ellipse cx="79" cy="142" rx="19" ry="6" fill="#b08b40" />
            </g>
            <path
              d="M79 96c0-28 32-45 81-45s81 17 81 45v7H79z"
              fill="url(#vault-wood)"
              stroke="#9f7a3b"
              strokeWidth="2"
            />
            <path
              d="M79 99h162v52c0 8-9 13-19 13H98c-10 0-19-5-19-13z"
              fill="url(#vault-wood)"
              stroke="#9f7a3b"
              strokeWidth="2"
            />
            <path
              d="M83 121h154M83 144h154M92 80h137"
              stroke="#171009"
              strokeWidth="2"
            />
            <path
              d="M101 64h12v98h-12zm106 0h12v98h-12z"
              fill="url(#vault-metal)"
              stroke="#aa8745"
            />
            <path d="M79 98h162v9H79z" fill="url(#vault-metal)" />
            <rect
              x="149"
              y="92"
              width="23"
              height="31"
              rx="3"
              fill="url(#vault-metal)"
              stroke="#c9a758"
            />
            <circle cx="160.5" cy="106" r="3" fill="#24180c" />
            <path d="M160.5 108v7" stroke="#24180c" strokeWidth="3" />
            <g fill="#d1b46e">
              <circle cx="107" cy="88" r="2" />
              <circle cx="213" cy="88" r="2" />
              <circle cx="107" cy="144" r="2" />
              <circle cx="213" cy="144" r="2" />
            </g>
          </svg>
          <ol className="vault-mechanics">
            {[
              "Stock tokens collected",
              "Put into trading pools",
              "Fees return to the vault",
            ].map((mechanic, index) => (
              <li key={mechanic}>
                <span className="vault-step font-narrow" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="text-parch">{mechanic}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="vault-action">
          {documentation ? (
            <a
              className="btn btn-dark vault-cta"
              href={documentation}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More on LONG <ExternalArrow />
            </a>
          ) : (
            <button className="btn btn-dark vault-cta" disabled>
              Learn More on LONG <ExternalArrow />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
