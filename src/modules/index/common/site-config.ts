/** Evidence-bearing deployed address details remain separate from the copyable prelaunch sentinel. */
export interface ProjectAddress {
  value: string;
  verified: boolean;
  format: "evm" | "solana" | "unconfigured";
  explorerUrl: string;
}

/** Public launch facts are deliberately separate from legacy, unapproved project claims. */
export interface ProjectConfig {
  project: string;
  ticker: string;
  contractPlaceholder: string;
  launchStatus: "prelaunch" | "live";
  launchpad: { name: string; url: string };
  chain: { id: string; name: string; providerNetwork: string };
  token: ProjectAddress & { decimals: number | null };
  quote: ProjectAddress;
  msft: {
    symbol: string;
    address: string;
    registryUrl: string;
    priceUrl: string;
    sourceUrl: string;
    explorerUrl: string;
  };
  market: {
    provider: "geckoterminal";
    pairId: string;
    verified: boolean;
    chartUrl: string;
  };
  links: {
    x: string;
    community: string;
    telegram: string;
    discord: string;
    buy: string;
  };
  resources: { wallet: string; network: string; gas: string };
  approvedTokenomics: string;
  vault: { enabled: boolean; address: ProjectAddress; documentation: string };
  feeMechanics: string;
  announcement: string;
  heroVideo: string;
  heroMusic: string;
  musicVolume: number;
  memes: MemeAsset[];
}

/** Owned local originals and optional static posters are the Armory's only media source. */
export interface MemeAsset {
  id: string;
  title: string;
  alt: string;
  kind: "image" | "gif";
  src: string;
  poster?: string;
}

/** Public defaults require project evidence before any trading or official-social redirect. */
export const siteConfig: ProjectConfig = {
  project: "Wownilla",
  ticker: "$NILLA",
  contractPlaceholder: "NILLA-CONTRACT-COMING-SOON",
  launchStatus: "prelaunch",
  launchpad: { name: "LONG", url: "https://app.long.xyz/" },
  chain: { id: "4663", name: "Robinhood Chain", providerNetwork: "" },
  token: {
    value: "",
    verified: false,
    format: "unconfigured",
    explorerUrl: "",
    decimals: null,
  },
  quote: {
    value: "",
    verified: false,
    format: "unconfigured",
    explorerUrl: "",
  },
  msft: {
    symbol: "MSFT",
    address: "0xe93237C50D904957Cf27E7B1133b510C669c2e74",
    registryUrl: "https://api.robinhood.com/rhj/assets",
    priceUrl: "https://api.robinhood.com/rhj/prices/MSFT",
    sourceUrl: "https://docs.robinhood.com/chain/stock-token-apis/",
    explorerUrl:
      "https://robinhoodchain.blockscout.com/token/0xe93237C50D904957Cf27E7B1133b510C669c2e74",
  },
  market: {
    provider: "geckoterminal",
    pairId: "",
    verified: false,
    chartUrl: "",
  },
  links: {
    x: "https://x.com/Wownillaa",
    community: "",
    telegram: "",
    discord: "",
    buy: "",
  },
  resources: {
    wallet: "",
    network: "https://robinhood.com/us/en/crypto/chain/",
    gas: "",
  },
  approvedTokenomics: "",
  vault: {
    enabled: false,
    address: {
      value: "",
      verified: false,
      format: "unconfigured",
      explorerUrl: "",
    },
    documentation: "https://x.com/longdotxyz/status/2105813946125148650",
  },
  feeMechanics: "",
  announcement: "",
  heroVideo: "",
  heroMusic: "/assets/hero-theme.webm",
  musicVolume: 0.35,
  memes: [
    {
      id: "guild-sigil",
      title: "The Wownilla Guild Sigil",
      alt: "Ornate golden Wownilla wordmark with the foaming wooden mug coin logo",
      kind: "image",
      src: "/assets/wownilla-logo-mug.webp",
    },
  ],
};

/** Rejects insecure links and generic roots; explicitly authorized informational homepages may opt in. */
export function safeProjectUrl(
  value: string,
  hosts?: string[],
  allowRoot = false,
) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      (!allowRoot && url.pathname === "/")
    )
      return undefined;
    if (hosts && !hosts.includes(url.hostname)) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

/** Address validation is network-format aware; provider pool IDs use a separate opaque field. */
export function isUsableAddress(address: ProjectAddress) {
  if (!address.verified) return false;
  if (address.format === "evm")
    return (
      /^0x[0-9a-fA-F]{40}$/.test(address.value) &&
      !/^0x0{40}$/.test(address.value)
    );
  if (address.format === "solana")
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address.value);
  return false;
}

/** Derives a single set of safe public actions for navbar, hero, sheet and closing CTA. */
export function projectDestinations(config: ProjectConfig = siteConfig) {
  const chart = safeProjectUrl(config.market.chartUrl, [
    "www.geckoterminal.com",
    "geckoterminal.com",
  ]);
  return {
    chart:
      config.launchStatus === "live" &&
      isUsableAddress(config.token) &&
      isUsableAddress(config.quote) &&
      config.market.verified &&
      config.market.pairId &&
      config.chain.providerNetwork &&
      chart &&
      new URL(chart).pathname ===
        `/${encodeURIComponent(config.chain.providerNetwork)}/pools/${encodeURIComponent(config.market.pairId)}`
        ? chart
        : undefined,
    buy:
      config.launchStatus === "live" &&
      config.chain.id &&
      config.chain.name &&
      isUsableAddress(config.token)
        ? safeProjectUrl(config.links.buy, ["app.long.xyz"])
        : undefined,
    community: /^https:\/\/x\.com\/i\/communities\/\d+\/?$/.test(
      config.links.community,
    )
      ? safeProjectUrl(config.links.community, ["x.com"])
      : undefined,
    x: safeProjectUrl(config.links.x, ["x.com"]),
    discord: safeProjectUrl(config.links.discord, [
      "discord.gg",
      "discord.com",
    ]),
    telegram: safeProjectUrl(config.links.telegram, ["t.me"]),
  };
}
