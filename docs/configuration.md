# Launch configuration checkpoint

Public configuration lives in `src/modules/index/common/site-config.ts`. It is imported by the server sections and focused client controls. It contains no secrets.

## Confirmed for this implementation

- This checkout is Wownilla, with the existing Wownilla branding and the user-confirmed $NILLA ticker and local logo artwork.
- The user confirmed the token has not launched. `launchStatus` remains `prelaunch`.
- The user specified LONG as the planned launchpad (`https://app.long.xyz/`) and Robinhood Chain as the network (`https://robinhood.com/us/en/crypto/chain/`). These are public informational links, not token-specific trading destinations. Robinhood Chain mainnet ID 4663 is now verified from official network documentation and the MSFT asset registry; the NILLA provider network/pair remains unconfigured. LONG was blocked by Cloudflare in installed Chrome during the recheck; its web text fetch succeeded. Robinhood Chain loaded in Chrome.
- Auction House is an intentional static placeholder, with no provider requests, iframe or generated prices. Actual embedding is future work requiring human approval and verified pair metadata.
- Original music and Canvas dungeon are retained. Music defaults off.
- `public/assets/wownilla-logo.webp` is the only image original in the checkout. It is listed as reusable brand artwork; no meme collection is invented.

## Unresolved project inputs

| Input                         | Current state / required evidence                                                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token address and decimals    | Empty; require deployed full address, chain and authoritative project confirmation.                                                                                                            |
| Chain ID/name                 | Robinhood Chain mainnet 4663 verified from official docs; NILLA deployment and provider network ID require confirmation.                                                                       |
| Explorer URL                  | Empty; configure HTTPS token-specific explorer page after deployment; verify it resolves to the full address on the intended chain.                                                            |
| Launch status                 | Prelaunch; switch only after a confirmed launch announcement.                                                                                                                                  |
| Buy destination               | Empty; configure the exact NILLA token destination on LONG at launch. LONG is now included in the expected venue allowlist; its homepage is an informational launchpad link only.              |
| Provider and pair ID          | GeckoTerminal selected as future provider, no pool configured. Pool IDs are opaque; future embed must verify network and both token identities from provider metadata.                         |
| Quote token                   | Empty, no underlying badge or paired-asset claim.                                                                                                                                              |
| X account                     | Historical source used `https://x.com/Wownillaa`; official ownership is unverified, so it is not enabled.                                                                                      |
| Discord and Telegram          | No exact invites supplied. Platform-root URLs are removed.                                                                                                                                     |
| Tokenomics                    | Historical 1B supply, 0%/0% transfer tax, liquidity burn, zero team bag and 90/7/3 allocation claims remain explicitly unconfirmed. Need approved documentation and separate onchain evidence. |
| Wallet/network/gas resources  | Empty; no network-specific instructions approved yet.                                                                                                                                          |
| Fees, vault, custody/holdings | No documented inputs; disabled. DEX/creator fees must not be inferred from transfer tax.                                                                                                       |
| Counts and milestones         | No verification evidence. Existing community/lore cleanup is paused for human approval; those sections still contain original roleplay numbers and milestone labels.                           |
| Additional memes              | Need approved owned originals, titles/alt text and GIF static posters where available. Armory implementation is paused.                                                                        |

`ProjectAddress.verified` is an editorial evidence gate, not proof of onchain truth. It must only be set after an actual review. EVM addresses must be full nonzero 40-hex strings; Solana uses a preliminary base58 format check. Neither check proves deployment or legitimacy. Unconfigured/unsupported address formats remain disabled until appropriate validation exists.

`safeProjectUrl` accepts HTTPS destinations without credentials, custom ports or root-only paths. Social and buy URLs additionally use expected host allowlists. Missing or rejected social inputs render branded icon placeholders. The pointless Join the Horde action is removed. Prelaunch Buy placeholders display Buy $NILLA and an external arrow, with no redirect. The only root-page exception is explicitly opted-in for the LONG informational homepage and restricted to its expected hostname. Buy stays disabled unless the configured launch, chain, address and venue pass the gates. No financial transactions, wallet connection or publishing are implemented.

## Human review

Further section implementation requires the user's approval, per their latest instruction. The chart placeholder was separately authorized after that pause. Review the exact-path map in `docs/implementation-plan.md` for the current per-slice status.

## Authorized UI revision

The rotating hero badge cycles Horde (red), neutral (gold) and Alliance (blue) messages every six seconds. It has Pause/Resume and manual Next controls, suspends its timer while the tab is hidden, and defaults to manual changes under reduced motion. The original hero logo artwork is preserved; the small sigil in the badge changes color. Further sections still require human approval.

## Copyable contract placeholder and hero refinement

The user's latest review explicitly enables copying before deployment. `contractPlaceholder` is `NILLA-CONTRACT-COMING-SOON`. It is rendered with a visible Placeholder label, copied verbatim, and confirmed with “Copied placeholder — not a live contract.” This sentinel is not a token address and is never passed to trading, explorer or chart validation. `token.value` remains empty. Invalid/unverified real-address input still falls back to this labeled sentinel. Once a verified full address is configured, the same control copies that address and exposes the configured explorer.

The redundant visible `$NILLA token contract` heading is removed. Hero order is logo → contract row → “The onchain vanilla guild.” → proposition → actions → launch details. Hero Lore link is removed; navigation still owns Lore access. Copy says that NILLA is coming to Robinhood Chain through LONG and does not describe unconfirmed pairing, vault or fee mechanics.

Platform marks are code-native and colored to fit Wownilla. Robinhood feather source is the CC0 Simple Icons collection: `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/robinhood.svg`; LONG lettering follows the supplied screenshot. Faction text uses the existing Motion library for 180ms upward fade entry/exit, with no text transforms under reduced motion.

## Desktop composition

Per the latest user request, desktop widths of 1024px and above use two hero columns. Left: faction messages, original logo, copyable contract row. Right: punchline, proposition, actions, platform links and disclaimer. Below 1024px the existing stacked content order remains. This desktop split supersedes the original single centered hero composition and does not authorize later-section implementation.

## MSFT token reference integration (2026-10-02)

Verified directly against Robinhood's public asset registry: MSFT is an active Microsoft • Robinhood Token deployment on Robinhood Chain mainnet (4663), contract `0xe93237C50D904957Cf27E7B1133b510C669c2e74`, decimals 18. Sources: [official API documentation](https://docs.robinhood.com/chain/stock-token-apis/), [live registry](https://api.robinhood.com/rhj/assets), [network documentation](https://docs.robinhood.com/chain/add-network-to-wallet/).

`siteConfig.msft` pins the expected identity and HTTPS endpoints. `/api/msft` fetches registry and `rhj/prices/MSFT` concurrently, with 30-second Next fetch caching and an 8-second provider timeout. The browser shares one request and polls every 60 seconds while visible. Contract copy is enabled only after registry identity, active status and chain/address validation. Missing prices do not block a verified contract. Registry failure keeps copy pending; no fake MSFT address is substituted.

Navbar price is an **indicative token reference**, calculated as `(underlying bid + ask) / 2 × currentMultiplier`. It is not a DEX trade price or an assertion that NILLA is paired with MSFT. The source link's accessible description and tooltip expose the calculation and issuer-generated quote time. Quotes older than two minutes are marked stale; halt/error/empty states are explicit. No API keys, wallet connection, transactions or reference-site backend are used. Browser-test fixtures exercise failures; production data comes exclusively from Robinhood.

NILLA remains unlaunched with the copyable `NILLA-CONTRACT-COMING-SOON` sentinel. Its real address, decimals, verified trading pair and token-specific LONG destination remain unresolved. NILLA/MSFT pairing, vault holdings and fee mechanisms remain unconfirmed and disabled.

## Section 2: trading and chart activation checklist

The Auction House remains a server-rendered placeholder. Changing configuration
alone does **not** enable a chart: no embedding code exists yet. Provider selection
(`market.provider: "geckoterminal"`) records an intended candidate, not verified
Robinhood Chain support. Trading and chart readiness are separate reviews.

| Required input      | Exact config field(s)                                                                  | Evidence required before activation                                                                                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Confirmed launch    | `launchStatus`                                                                         | Authoritative dated launch announcement, then `live`                                                                                                                                                       |
| NILLA deployment    | `token.value`, `token.format`, `token.verified`, `token.decimals`, `token.explorerUrl` | Full deployed address, contract code, decimals and token-specific explorer on mainnet 4663; project confirmation                                                                                           |
| Intended network    | `chain.id`, `chain.name`                                                               | Robinhood Chain mainnet 4663; verify the NILLA deployment is on this chain                                                                                                                                 |
| Trading destination | `links.buy`                                                                            | Exact NILLA destination on the confirmed venue; validate network and token identity, never a platform homepage                                                                                             |
| Provider support    | `market.provider`, `chain.providerNetwork`                                             | Current provider documentation and live metadata must confirm mainnet 4663 support, its exact provider network identifier and embed support                                                                |
| Pair identity       | `market.pairId`, `market.verified`                                                     | Exact opaque pool ID from provider metadata, network, venue and both base/quote contract identities; verify NILLA is actually in the pool and record orientation                                           |
| Quote asset         | `quote.value`, `quote.format`, `quote.verified`, `quote.explorerUrl`                   | Full quote contract and authoritative identity on the same chain; do not infer MSFT pairing from the navbar reference                                                                                      |
| Chart and pair URLs | Future provider integration, not yet fields                                            | Canonical HTTPS embed and external pair-page URLs derived using documented provider rules, verified against the same metadata; preserve/encode opaque IDs without address validation or case normalization |

Before an approved future embed is enabled, record the source URLs, reviewed date,
network mapping, token contracts/decimals, pool metadata and reviewer decision.
A `verified` flag is an editorial record, not an onchain proof. Any unsupported
network, mismatched identity or missing input must keep the placeholder in place.

The future embed must preserve the existing 420px mobile / 520px desktop frame,
load lazily, have an accessible title identifying NILLA and the verified pair,
and expose the verified external pair link. Define a readable unavailable/error
fallback without fabricated prices, handle provider failure, and clean up any
added observers, listeners, requests and timers. Human approval is required before
implementing this live integration.

The former Character Sheet is now **How it works**: three numbered explanations
of the planned MSFT pair, LONG community vault and holder-led guild. Original speculative
supply, transfer-tax, liquidity, team and allocation figures have been removed
from this UI. The user now specifies a planned Robinhood tokenized MSFT pair, trading fees
flowing to the LONG community vault, and community direction fully guided by
NILLA holders. These are approved project intentions, not verified deployed
mechanics. Burns, locks, returns and holder rewards are not supplied or asserted. This replaces the earlier tokenomics disclosure design. The existing
buying guide remains separate and unchanged pending its own review.

The user superseded automatic screenshot generation and visual verification with
manual review during Section 2. Newly captured baseline images are retained; no
further screenshots are generated. Final visual parity, browser zoom and artwork
review belong to that manual review.

## User-specified pair, vault and guild plans

The How it works cards now explain **pair → vault → guild**. The MSFT naming uses
Robinhood's [official Stock Token documentation](https://docs.robinhood.com/chain/stock-token-apis/).
The intended pairing does not establish Microsoft affiliation, direct equity
ownership by NILLA holders, redemption rights or guaranteed price tracking.

The existing MSFT reference contract is identified separately in `siteConfig.msft`.
Do not populate/verify `quote` or `market` solely from the user's planned pairing:
actual provider metadata must prove that the NILLA pool contains this exact MSFT
contract on mainnet 4663. Trading and chart activation gates remain unchanged.

For LONG fee routing, still obtain the exact vault address and chain, fee source,
rate and routed share, collection asset, routing contracts/transactions,
LONG/project documentation and custody/access rules. No percentages, automatic
returns, burning, locking, balances or withdrawal rights are inferred. `vault.enabled`
remains false; no live vault UI or transaction feature is implemented.

For guild direction, still document holder eligibility, proposal/decision process,
voting or consensus rules if any, and how decisions are executed. The statement
that holders fully guide the community is user-specified intent; it does not assert
that an onchain DAO, treasury-control mechanism or voting application exists.
