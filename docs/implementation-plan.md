# Wownilla website implementation — 2026-10-02

## Discovery and design

Confirmed checkout: `package.json` names Wownilla; README identifies the existing Next.js 16 App Router / React 19 / Motion / Tailwind 4 migration. Yarn 4.18.1 via Corepack; lockfile present. Initial git status was clean. Routes: `src/app/page.tsx`, `layout.tsx`, `robots.ts`; composition: `src/modules/index/index-page.tsx`. No database, API/cache layer, gallery/modal, UI kit, or deployment override exists. `next.config.ts` has only dev indicator configuration. Documentation is added under `docs/` because no existing documentation directory existed.

Read repository AGENTS.md, installed Next server/client guide and React performance rules for server composition, event cleanup and transient refs. Existing CSS owns surfaces (`panel`, `tile`, `plate`), beveled `btn` variants, rarity colors, font variables and animation. Preserve these boundaries. Supplied plan authorizes the design and implementation without additional section approvals.

Real installed Chrome inspected Wownilla deployment and all four Artificial Inu reference routes. Baselines are in `docs/evidence/before-*.png`. Web text fetch failed for Wownilla, but Chrome succeeded. Production domain loaded on recheck; build equivalence is not established. Reference hierarchy informs placement only; its artwork, facts, fee rules and addresses are not reused.

## Exact path map

All paths are relative to this checkout. No inferred framework paths.

| Feature                                | Existing path / symbol                                                                             | Exact create/modify path                                                                                                               | Reusable dependencies                                | Integration point               | Status                                | Acceptance checks                                                                                                                                                    |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared launch facts and destinations   | `src/modules/index/common/site-config.ts` / siteConfig                                             | modify same                                                                                                                            | current config consumers                             | all landing verticals           | implemented checkpoint                | prelaunch default, no platform roots, unsafe URL rejection, full address validation                                                                                  |
| Navbar utilities                       | `src/modules/index/common/navigation.tsx` / Navigation                                             | modify same and `navigation.css`; create `src/modules/index/common/project-actions.tsx`                                                | nav-frame, btn, native hashes                        | Navigation desktop/mobile       | implemented checkpoint                | 390/768/1440, Escape, focus, no crowding                                                                                                                             |
| Hero proposition/status                | `src/modules/index/hero/hero-section.tsx` / HeroSection                                            | modify same and `hero.css`                                                                                                             | original logo, HeroContent, dungeon, ProjectActions  | centered hero                   | implemented checkpoint                | artwork retained, truthful Buy state, Lore/mechanics/chart links                                                                                                     |
| Shared contract control                | `src/modules/index/token/copy-contract.tsx` / CopyContract                                         | modify same; create `src/modules/index/common/contract-address.tsx` and `project.css`                                                  | tile, btn, siteConfig                                | hero / sheet / closing / footer | implemented checkpoint                | clearly labeled copyable prelaunch sentinel by explicit user override, full live-address copy after promise, rejection selectable text, live feedback, no focus jump |
| Optional queue/audio                   | `src/modules/index/intro/experience.tsx` / Experience; `login-queue.tsx` / LoginQueue              | modify same                                                                                                                            | QueueScene, shared lifecycle                         | IndexPage Experience            | implemented checkpoint                | immediate skip, hash/repeat bypass, no-JS content, opt-in audio, cleanup                                                                                             |
| Character Sheet truthful facts         | `src/modules/index/token/token-section.tsx` / TokenSection                                         | modify same                                                                                                                            | Reveal, BarFill, panel, coin-art                     | #token                          | in progress; paused                   | unapproved claims visibly marked, retain allocation artwork                                                                                                          |
| Auction House                          | no existing market panel/data client                                                               | create `src/modules/index/token/market-panel.tsx`                                                                                      | panel, siteConfig                                    | TokenSection before lore        | static placeholder complete           | stable 420/520 height, no iframe, no provider requests or fake data                                                                                                  |
| Mechanics and buying quests            | `src/modules/index/token/token-section.tsx` / TokenSection buying cards                            | create `src/modules/index/token/mechanics.tsx`; modify token-section                                                                   | tile, quest-mark, server content                     | TokenSection #mechanics         | paused for approval                   | 3 mechanics cards distinct from 4 buying quests, prelaunch/resources truthful, no fabricated fees                                                                    |
| Meme Armory                            | `public/assets/wownilla-logo.webp`; item framing in about                                          | create `src/modules/index/memes/meme-armory.tsx` and `memes.css`                                                                       | tile/panel/rarity colors, approved local media       | IndexPage between token/lore    | paused for approval                   | responsive grid, download original, lazy images, modal Escape/trap/restoration, filtering/empty/error/load-more                                                      |
| Community/closing                      | `src/modules/index/community/community-section.tsx` / CommunitySection, guild-chat.tsx / GuildChat | modify same                                                                                                                            | ProjectActions, ContractAddress, original chat/frame | #community final CTA            | destination fixes done; rest paused   | fictional chat labelled, counts unavailable, pause chat, no root links                                                                                               |
| Lore milestones                        | `src/modules/index/lore/lore-section.tsx` / LoreSection                                            | modify same                                                                                                                            | existing codex and bars                              | #lore                           | paused for approval                   | fictional milestones explicitly labelled, no asserted mint completion                                                                                                |
| Footer                                 | `src/modules/index/common/footer.tsx` / Footer                                                     | modify same                                                                                                                            | shared contract/actions                              | Footer                          | implemented checkpoint                | consistent verified destinations, original disclaimers                                                                                                               |
| Optional vault/fees/announcement/quote | no documented Wownilla inputs                                                                      | configuration in `src/modules/index/common/site-config.ts`; documentation in `docs/configuration.md`                                   | no additional subsystem needed                       | disabled until evidence         | deferred                              | no balances, fees, locks or signing invented                                                                                                                         |
| Acceptance tests and evidence          | `src/modules/index/index.spec.ts`, `experience.spec.ts`                                            | modify same; create `src/modules/index/token/config.spec.ts`, `src/modules/index/memes/memes.spec.ts`; evidence under `docs/evidence/` | installed Playwright Chrome                          | project scripts                 | checkpoint verified; full task paused | lint/type/build/test, screenshots, keyboard/zoom/reduced motion/no JS                                                                                                |

## Sequence

1. Config, common contract/actions, hero/nav, queue/music and global destination fixes. Validate this slice before continuing.
2. Character Sheet and Auction House fallback/provider validation.
3. Server-rendered mechanics and four prelaunch buying quests.
4. Armory using only existing approved artwork; collection remains small until real media arrives.
5. Community and lore truth labels, final CTA/footer, full validation and documentation.
6. Conditional P2 functionality remains disabled pending actual evidence.

## Unresolved inputs

User confirmed token has not launched. Robinhood Chain and LONG launchpad supplied by the user in the checkpoint revision. No confirmed chain ID, full deployed contract, approved launch announcement, token decimals, explorer, swap destination, provider pool ID, confirmed quote asset, official social invites/account proof, approved tokenomics, wallet/network/gas resources, fee mechanics, vault/custody data, milestone/count evidence or additional approved memes exist. Finish safe UI independently and document exact activation requirements.

## Human review checkpoint

User requested approval before further sections on 2026-10-02. Paused expansion into mechanics, Armory and community/lore truth-label work. The subsequent request explicitly authorizes a static prelaunch chart placeholder. `market-panel.tsx` is now server rendered, contains no iframe, fetch, price data or trading redirect, and reserves 420px mobile / 520px desktop. Future provider integration requires confirmed launch inputs and human approval.

Slice 1 implemented: shared launch/address config; reusable actions and address UI; responsive nav and centered hero; immediate skip/hash/repeat bypass; opt-in music; generic link removal in sheet/community/footer. Five targeted desktop checks passed against the running development server before the placeholder revision. Token claim labelling had begun when the approval request arrived; it remains an in-progress checkpoint. Mechanics and Armory links were withheld until their destinations are implemented. Existing fictional counts/chat/lore await their approved slice.

The original Playwright run accidentally targeted the old production build; it failed and was interrupted. Updated `playwright.config.ts` to honor an explicit development base URL and reran successfully. This is not evidence of full-suite or production-build completion.

### Checkpoint verification results

- `corepack yarn lint`: passed without warnings after replacing the provider draft with the static placeholder.
- `corepack yarn typecheck`: passed.
- `corepack yarn build`: passed, static `/` and `/robots.txt` output.
- `PLAYWRIGHT_BASE_URL=http://localhost:3001 corepack yarn test`: 23 of 24 checks passed. Remaining mobile-menu test exposed decorative Roman numerals in link accessible names; marked those spans `aria-hidden`. Targeted mobile rerun recorded separately below.
- Chrome screenshots: `checkpoint-market-390.png`, `checkpoint-market-768.png`, `checkpoint-market-1440.png`. Measured chart placeholder 420px / 520px / 520px respectively; no document horizontal overflow and no page errors in these captures.
- Hero baselines/checkpoint captures and token captures retained in `docs/evidence/`. Full visual parity is not claimed: hero utilities and chart space intentionally change layout. Keyboard/200% zoom, real configured-address clipboard scenarios, and the remaining sections' acceptance criteria still require further approved work.
- No deployment, merge, token launch, signing or financial action was performed.
- Targeted mobile rerun after accessible-name fix: all 3 `index.spec.ts` checks passed (4.3s). Lint and typecheck also passed again after that fix. Full suite was not repeated after the one-span change.

## Authorized checkpoint revisions — 2026-10-02

Latest user feedback authorizes the changes below only. Other sections remain paused for human approval.

| Feature                                           | Actual existing path/symbol                                       | Exact create/modify path                                                                                                                                                                         | Reusable dependencies                                       | Integration point                                      | Status                | Acceptance checks                                                                                                            |
| ------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| NILLA ticker, LONG launchpad, Robinhood Chain     | `src/modules/index/common/site-config.ts` / siteConfig            | modify same, `src/modules/index/hero/hero-section.tsx`, `src/modules/index/token/token-section.tsx`, `src/modules/index/common/footer.tsx`; create `src/modules/index/common/launch-details.tsx` | existing config, native links, font and color tokens        | all ticker consumers; hero/sheet/footer launch details | implemented; verified | no $WOWN remains; prelaunch preserved; chain ID/contract not invented; LONG root allowed only as information                 |
| Remove Join and unavailable text; external arrows | `src/modules/index/common/project-actions.tsx` / ProjectActions   | modify same and `project.css`; create `src/modules/index/common/external-arrow.tsx`                                                                                                              | btn-gold, nav-link                                          | nav/hero/sheet/community/footer shared actions         | implemented; verified | no Join the Horde or unavailable labels; disabled Buy $NILLA placeholder includes arrow; chart placeholder retained          |
| Branded social logos                              | ProjectActions has text X; original artwork has no social symbols | create `src/modules/index/common/social-links.tsx`; modify ProjectActions                                                                                                                        | currentColor SVG, gold/bronze tokens, beveled button        | every shared action group                              | implemented; verified | recognizable X/Telegram/Discord icons, accessible names, no fabricated invites, focus feedback                               |
| Rotating faction badge                            | `src/modules/index/hero/hero-section.tsx` static Forged badge     | create `src/modules/index/hero/faction-badge.tsx`; modify hero-section.tsx and hero.css                                                                                                          | logo-w, existing faction colors, Motion reduced-motion hook | original hero badge position                           | implemented; verified | Horde/neutral/Alliance messages and sigil colors; 6s rotation; pause/next controls; hidden-tab/reduced-motion pause; cleanup |
| Regression checks                                 | index.spec.ts, token/config.spec.ts, experience.spec.ts           | modify first two; create `src/modules/index/hero/faction-badge.spec.ts`                                                                                                                          | existing Playwright/Chrome                                  | same page tests                                        | verified              | render 390/768/1440/zoom, no overflow, external links/placeholder gating, badge controls and motion preferences              |

Chrome rechecked live Wownilla #token and saved `reference-review-1440.png` before these edits. Robinhood Chain page loaded. LONG app showed a Cloudflare challenge in Chrome, although the web text fetch succeeded. LONG in-app behavior cannot be claimed verified. The user's URLs and stated launch platform/network are project configuration inputs, not evidence of a deployed token.

### Revised checkpoint verification

- `corepack yarn test` against the production build: **34 passed**, desktop and mobile (21.1s). Includes ticker/action gating, social SVG placeholders, configured informational URLs, faction rotation, pause/manual-next, hidden tab and reduced motion, existing queue/audio/canvas/no-JS/robots checks.
- The preliminary development run overlapped compilation/build and timed out on three older journey tests (31 passed). Queue skip test now freezes the intro clock so auto-completion cannot race its click. The subsequent complete production run passed.
- Build, lint and typecheck passed during implementation; final rerun follows the small sigil contrast adjustment.
- Before/after evidence: `checkpoint-before-feedback-1440.png`, `revised-hero-390.png`, `revised-hero-768.png`, `revised-hero-1440.png`, `revised-alliance-390.png`, `revised-menu-390.png`, `revised-token-390.png`, `revised-token-768.png`, `revised-token-1440.png`.
- The Wownilla reference was revisited in installed Chrome before editing and during final verification. Updated hero controls are intentional differences; artwork and established styles are retained.
- LONG is an informational launchpad link only; prelaunch Buy controls remain placeholders. No official social invites, token contract or chain ID were fabricated. Remaining sections remain paused for human review.
- Final `corepack yarn lint`, `corepack yarn typecheck`, and `corepack yarn build`: passed after the contrast refinement. `git diff --check` passed.
- Rendered at 390/768/1440px: no document horizontal overflow or page errors. A 720×500 viewport also passed the reflow check (equivalent available CSS space for a 1440px display at 200%; actual browser zoom was not exercised).

## Authorized hero refinement — 2026-10-02

The latest user review requests the following changes to the current checkpoint; the remaining sections still require human approval.

| Feature                        | Actual existing path/symbol                                                               | Exact create/modify path                                                                                                             | Reusable dependencies                                                | Integration point       | Status                | Acceptance checks                                                                                                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero hierarchy and proposition | `src/modules/index/hero/hero-section.tsx` / HeroSection                                   | modify same and `hero.css`                                                                                                           | logo asset, HeroContent, existing fonts/color tokens                 | #top                    | implemented; verified | logo then contract, visible punchline h1, concise truthful launch copy, no hero Lore link or redundant contract title                                 |
| Copyable prelaunch placeholder | `common/contract-address.tsx` / ContractAddress; `token/copy-contract.tsx` / CopyContract | modify same and `common/site-config.ts`, `project.css`; create `src/modules/index/token/copy-contract.spec.ts`; modify index.spec.ts | current clipboard lifecycle, role=status, shared control             | hero/sheet/footer       | implemented; verified | unmistakable non-address placeholder, exact clipboard payload, no success before resolution, rejection/selectable text, no explorer or buy activation |
| LONG/Robinhood marks           | `src/modules/index/common/launch-details.tsx` / LaunchDetails                             | modify same; create `src/modules/index/common/platform-mark.tsx`; modify project.css                                                 | screenshot reference, external arrow, existing gold/parchment tokens | all launch detail links | implemented; verified | recognizable LONG wordmark and Robinhood feather, decorative SVG hidden from accessible names, no lime restyling                                      |
| Faction enter/exit motion      | `src/modules/index/hero/faction-badge.tsx` / FactionBadge                                 | modify same and hero.css; modify faction-badge.spec.ts                                                                               | already-installed Motion AnimatePresence/motion, reduced-motion hook | hero badge              | implemented; verified | fade/up entry and exit, stable box, pause/next retained, reduced-motion instant text, hidden-tab timer cleanup                                        |

Explicit override: earlier missing-contract gating is revised per the user's request. Copy is enabled for a clearly marked non-address sentinel (`NILLA-CONTRACT-COMING-SOON`), not for an invented or malformed contract. This remains separate from `token.value` and cannot enable Buy or explorer links. Feedback must say that a placeholder was copied. Live configured addresses retain full-address copy behavior.

Robinhood feather mark source: Simple Icons Robinhood SVG (`https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/robinhood.svg`, CC0 collection). LONG wordmark is a small code-native rendering guided by the supplied screenshot. Both use Wownilla colors. No borrowed protocol copy or economic mechanics are implemented.

### Hero refinement evidence

- The clipboard test first failed on the expected missing Placeholder label, confirming the baseline before implementation.
- Focused development check: **22 passed** across desktop/mobile (15.6s), including placeholder exact value, clipboard promise timing/rejection/focus, layout order, platform marks, and faction motion/reduced-motion/visibility behavior.
- Screenshots: `docs/evidence/hero-refinement-390.png`, `hero-refinement-768.png`, `hero-refinement-1440.png`; 390/768/1440 widths measured without horizontal overflow. Mobile hero is 923px tall and can scroll normally; controls remain accessible.
- Old missing-contract-copy-disabled notes above are historical checkpoints, superseded by the explicit user override in this section. Trading and explorer gating still require real address evidence.

- Final lint, typecheck and production build passed. The first complete 42-test run had 41 passes and one test-clock setup failure (“Cannot fast-forward to the past”), unrelated to app behavior. The queue test now installs a fixed clock and pauses at a later fixed time instead of racing wall-clock timestamps; full rerun is recorded below.
- Final reference visit succeeded in installed Chrome. Additional evidence: `hero-refinement-neutral-390.png` and `hero-refinement-token-390.png`.
- Full production rerun: **42 passed** (21.6s), desktop and mobile. Final lint/typecheck passed again; build and diff whitespace checks passed. Clipboard feedback reset retains focus and does not move the user into another control. No deployment or later-section implementation was performed.

## Authorized desktop hero split — 2026-10-02

| Feature                 | Actual existing path/symbol                                         | Exact create/modify path    | Reusable dependencies                                                                    | Integration point | Status                | Acceptance checks                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------- | ----------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Two-column desktop hero | `src/modules/index/hero/hero-section.tsx` / HeroSection; `hero.css` | modify those same two files | existing FactionBadge, logo, ContractAddress, ProjectActions, LaunchDetails, HeroContent | #top              | implemented; verified | ≥1024px: messages/logo/contract left, punchline/copy/actions/platforms right; 390/768px keep stacked order; no overflow; contract remains immediately after logo; existing keyboard/copy checks |

This user request authorizes the desktop composition change, superseding the earlier centered single-column hero requirement at desktop sizes. Assets, components, behavior and mobile content order remain intact. Later sections remain paused for human approval.

Desktop split evidence: Chrome screenshots `docs/evidence/desktop-split-390.png`, `desktop-split-768.png`, `desktop-split-1024.png`, `desktop-split-1440.png`. Measured one column at 390/768px and two columns at 1024/1440px; no document horizontal overflow at any checked width. Matching live reference revisited before and after implementation. Lint, typecheck and production build passed. Targeted existing navigation/hero/clipboard/motion regression results follow.

- Desktop split regression check: **22 passed** (16.5s) in production, desktop/mobile (`index.spec.ts`, `token/copy-contract.spec.ts`, `hero/faction-badge.spec.ts`). `git diff --check` passed. No deployment or further sections were started.

## Authorized MSFT navbar and dual contracts — 2026-10-02

| Feature               | Actual existing path/symbol                              | Exact create/modify path                                                                                                      | Reuse                          | Integration               | Status                | Acceptance                                                                                    |
| --------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| Verified MSFT data    | `common/site-config.ts` / siteConfig                     | modify `src/modules/index/common/site-config.ts`; create `src/modules/index/common/msft-data.ts`, `src/app/api/msft/route.ts` | native fetch, Next cache       | read-only API             | implemented; verified | official registry chain/address identity; numeric quotes; source time; null/error handling    |
| Shared live lifecycle | `index-page.tsx` / IndexPage                             | create `src/modules/index/common/msft-provider.tsx`; modify `src/modules/index/index-page.tsx`                                | React context, focused clients | landing                   | implemented; verified | one 60s visible-tab polling lifecycle; abort and cleanup                                      |
| Navbar price          | `common/navigation.tsx` / Navigation                     | create `src/modules/index/common/msft-price.tsx`; modify navigation and `common/project.css`                                  | gold tokens, existing navbar   | navbar                    | implemented; verified | real indicative token price, source/time; mobile/zoom widths                                  |
| Two copy controls     | `common/contract-address.tsx`; `token/copy-contract.tsx` | modify both; create `src/modules/index/common/msft-contract.tsx`; modify project.css                                          | existing clipboard feedback    | hero/sheet/footer/closing | implemented; verified | NILLA sentinel only; fetched full MSFT address; distinct labels and explorer; denial handling |
| Regression coverage   | `index/index.spec.ts`; `token/copy-contract.spec.ts`     | create `src/modules/index/common/msft.spec.ts`; modify existing copy selectors                                                | Playwright Chrome              | browser tests             | implemented; verified | stale/error/mismatch, copy payload, hidden polling and layout                                 |

Official sources: https://docs.robinhood.com/chain/stock-token-apis/ and https://api.robinhood.com/rhj/assets. Registry returned active MSFT deployment on chain 4663 at `0xe93237C50D904957Cf27E7B1133b510C669c2e74`. No NILLA/MSFT pair, holdings, vault or affiliation is asserted. Later sections remain paused.

## Authorized compact contract controls — 2026-10-02

| Feature                    | Existing path/symbol                                                                 | Exact modify paths                                                                                                                                                                    | Reuse                                                           | Integration                | Status                | Acceptance                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Icon copy and trimmed rows | `common/contract-address.tsx`, `common/msft-contract.tsx`, `token/copy-contract.tsx` | those same files; `src/modules/index/common/project.css`; `src/modules/index/token/copy-contract.spec.ts`, `src/modules/index/index.spec.ts`, `src/modules/index/common/msft.spec.ts` | clipboard lifecycle, shared row framing, verified MSFT provider | repeated contract controls | implemented; verified | Token Contract label, icon on right, single-line ellipsis, full-value payload, full selectable rejection fallback, focus retained |

MSFT/compact controls evidence: official live `/rhj/assets` and `/rhj/prices/MSFT` were fetched successfully, and local `/api/msft` returned the validated full contract, calculated reference price, issuer quote time and observed time. Original and Artificial Inu references were visited in installed Chrome; Artificial Inu uses its own `/api/live`, which this implementation does not reuse. The MSFT explorer API request returned HTTP 403 in this environment; canonical identity was verified against the issuer registry instead.

Chrome screenshots: `docs/evidence/compact-contracts-390.png`, `compact-contracts-768.png`, `compact-contracts-1440.png`, `compact-contracts-zoom-200-equivalent.png`. Matching effective 200% desktop width uses a 720px viewport; this is a zoom-equivalent layout check, not a claim that browser zoom was operated. No horizontal overflow at measured widths; live data rendered and no page errors occurred. Full strings are in DOM/tooltips, trimmed visually, and copied in full. Clipboard rejection reveals an additional full selectable string.

Verification history: first development-server targeted run had 20 passes and 2 timing failures; production full suite passed all 50. After the icon revision, a test-edit mistake incorrectly expected the denial-only fallback after successful copy (48/50); the assertion was corrected to require no fallback on success. Final rerun recorded below. Lint, typecheck, production build and diff whitespace checks passed. Later sections still require human approval; no deployment occurred.

Final production rerun after the compact-control and clipboard assertion changes: **50 passed (25.4s)** across desktop/mobile. Coverage includes full-value MSFT copy, NILLA placeholder promise/rejection/focus, icon position and ellipsis, invalid registry/pair identity, stale/no-data/HTTP-error states, one shared request, hidden-tab polling suspension, queue, audio, motion, native anchors and JavaScript-free content. Final lint/typecheck/build passed; no publication or financial actions.

## Authorized copy-success icon — 2026-10-02

| Feature                    | Existing path/symbol                                       | Exact modify paths                                                                                 | Reuse                                                                        | Integration           | Status                | Acceptance                                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| In-place success checkmark | `src/modules/index/token/copy-contract.tsx` / CopyContract | same file; `src/modules/index/common/project.css`; `src/modules/index/token/copy-contract.spec.ts` | existing clipboard promise, cleanup timer, gold button, live-region feedback | all contract controls | implemented; verified | no visible success text; check only after clipboard resolves; fade back after 2s; fixed position/focus; reduced motion; errors retain selectable full address |

Copy-success verification: new assertions failed against the previous text-feedback build, then **14 passed (15.3s)** against the updated production build. The timer starts after clipboard resolution and resets the check state at 2 seconds; CSS crossfades the two icons over 180ms in the same grid cell. Reduced motion switches instantly. Success/pending text is screen-reader-only; error text and full selectable values remain visible. Focus and full-value copy are preserved. Lint, typecheck, production build and diff whitespace checks passed. Chrome screenshots `docs/evidence/copy-success-390.png` and `copy-success-1440.png` show the checkmark; browser inspection confirmed it returned to the copy icon after the timeout. Live reference rechecked before the change. Further sections remain paused; no deployment.

## Section 1 human approval and publication — 2026-10-02

The user approved Section 1 and explicitly requested commit and push to the remote. Scope includes the completed prelaunch/access checkpoint and subsequent approved hero/navbar/contract revisions, the requested chart placeholder, configuration documentation, browser tests and visual evidence. Remaining feature sections still require approval before implementation.

Pre-commit inspection found newer local navbar refinements: the MSFT price is a single-line `$MSFT` ticker and only X is displayed among social controls. These edits are preserved. Quote freshness/halt/error details remain in the source tooltip and accessible description; regression assertions now check those attributes and the X-only social controls. The first full pre-commit run had 48 passes and four stale UI expectations; corrected expectations are rerun against the production build below.

Final pre-commit verification: lint, typecheck and production build passed; **52 tests passed (39.8s)** across desktop/mobile. Latest preserved navbar layout screenshots: `docs/evidence/approved-section1-390.png` and `approved-section1-1440.png`, both without horizontal overflow. Remote `origin/main` was fetched and matched local HEAD before this commit.

## Section 2 Market + Token — authorized implementation map

Section 1 is approved at `fffd37bbe9e17bccbbdc3299ceff7dc5832bd369`. This request authorizes completing Section 2 before human review; it does not authorize later sections or publication. Existing evidence deletions are unrelated and will be preserved.

| Feature                  | Actual checkout path / symbol                                | Exact modify/create path                                                                                                                 | Reuse and intended change                                                                                                                                                                           | Checks                                                                                                      |
| ------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Character Sheet          | `src/modules/index/token/token-section.tsx` / `TokenSection` | modify same and `src/modules/index/token/token.css`                                                                                      | Keep coin, Reveal, BarFill, ContractAddress, LaunchDetails and ProjectActions. Present identity first; retain historical claims and allocation artwork in a native, clearly unconfirmed disclosure. | Keyboard disclosure, no-JS readability, responsive typography, no fabricated tokenomics                     |
| Auction House            | `src/modules/index/token/market-panel.tsx` / `MarketPanel`   | modify same and `src/modules/index/token/token.css`                                                                                      | Keep the existing 420/520px frame and coin art. Explain deployment, pair and provider prerequisites without adding data, embeds or external market links.                                           | Native #market entry, fixed dimensions, no provider requests/iframe                                         |
| Activation documentation | `docs/configuration.md`                                      | modify same                                                                                                                              | Map exact config fields and evidence required for trading and a separately approved future chart implementation; opaque pool IDs, both token identities, support and fallback requirements.         | Cross-check against actual siteConfig fields; no implied automatic embed activation                         |
| Acceptance and evidence  | `src/modules/index/token/config.spec.ts`                     | create `src/modules/index/token/market-token.spec.ts`; new screenshots `docs/evidence/market-token-*.png`, `docs/evidence/auction-*.png` | Installed Chrome, reuse current Playwright setup; preserve approved Section 1 checks.                                                                                                               | 390/768/1440, keyboard, effective 200% zoom, reduced motion, no JS/overflow, lint/typecheck/build/full test |

Implementation sequence: capture reference/local baseline → acceptance checks → refine existing server sections and owned CSS → document activation inputs → production validation → request Section 2 approval. Mechanics/buying cards remain untouched for the next approval gate. The user subsequently requested stopping evidence generation and will verify visuals manually; further screenshot comparison and visual review are delegated to the user.

### Section 2 review checkpoint

Implemented identity-first Character Sheet and native unconfirmed-tokenomics
disclosure; retained coin/allocation artwork and existing shared contracts/actions.
Auction House retains the 420/520px static frame and now explains deployment,
pair and provider prerequisites. No market data, embeds or trading destinations
were added. Exact activation fields and evidence are in `docs/configuration.md`.
Approved Section 1 code and the four buying quests were not changed.

Installed Chrome successfully visited the live reference at 390/768/1440 before
edits. That deployment has the original Character Sheet and no `#market` element;
there is no matching Auction House reference panel. Baseline images captured before
the user's stop request remain in the working tree. At the user's request, no
further screenshot generation or final visual comparison was performed. Manual
visual review, including actual browser zoom, remains pending with the user.

Verification: `corepack yarn lint`, `corepack yarn typecheck`,
`corepack yarn build` and `git diff --check` passed. Final production
`corepack yarn test`: **58 passed (29.6s)** across desktop/mobile. Added checks cover
keyboard disclosure/focus, no-JavaScript activation, native market entry, reduced
motion, 390/768/1440 plus effective 720px width, no horizontal overflow, stable chart
height and zero chart-provider requests/iframes. The 720px check tests the layout
width equivalent of 200% zoom at 1440px; it does not operate browser zoom.
The initial full run passed 56/58; two no-JavaScript click-stability timeouts were
resolved by using native keyboard activation in the test. A concurrent targeted
retry lost its production server when the suite ended; the final full rerun was
sequential and passed.

Remaining inputs: verified NILLA deployment/decimals/explorer, launch announcement,
token-specific trade destination, provider network/embed support, exact opaque pool
ID and both base/quote identities, approved tokenomics with evidence. Live chart
integration remains disabled and requires a separate implementation approval.
No commit, push, merge or deployment. Await Section 2 approval before mechanics
and buying-guide work.

## Approved Character Sheet replacement — How it works

The user approved replacing the whole Character Sheet with a three-card explanation inspired by Artificial Inu's numbered layout. Approval is for identity → trading → community using confirmed prelaunch facts; no MSFT pairing, vault funding, burns or locks were confirmed. Keep the Auction House and existing buying guide below; do not add a second mechanics section. The approved hero remains untouched. Screenshots and visual comparison remain manual per the user's instruction.

| Feature                     | Actual path / symbol                                                      | Exact modify path | Implementation and verification                                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Three numbered explanations | `src/modules/index/token/token-section.tsx` / `TokenSection`              | same file         | Replace sheet/card/stat/allocation block with a How it works heading and three framed `Reveal` articles. Reuse coin/quest artwork, font and rarity colors; desktop three columns/mobile stack; preserve `#token`. |
| Owned styling               | `src/modules/index/token/token.css`                                       | same file         | Remove unused sheet/disclosure rules, add readable card/artwork sizing; preserve market frame sizing.                                                                                                             |
| Section acceptance          | `src/modules/index/token/market-token.spec.ts`                            | same file         | Replace disclosure tests with three explanations, pending mechanics, no-JS and responsive checks.                                                                                                                 |
| Existing journey assertions | `src/modules/index/index.spec.ts`, `src/modules/index/experience.spec.ts` | same files        | Update section heading and verify shared contract copy remains in the approved hero; retain navigation/prelaunch destination checks.                                                                              |
| Current documentation       | `docs/configuration.md`                                                   | same file         | Supersede historical disclosure description: speculative sheet values leave this UI. Exact chart/trading prerequisites remain.                                                                                    |

Sequence: write failing acceptance assertions → replace current sheet without additional features → production checks → human review. No publishing.

Replacement verification: lint, typecheck, production build and diff whitespace
checks passed; final production suite **58 passed (36.3s)** across desktop/mobile.
New explanation assertions failed against the former sheet before implementation.
One development assertion then caught LONG missing from the trading card; its
planned launchpad copy was added before the successful production run. Checks cover
three cards, pending mechanics, removed speculative figures, server/no-JS content,
one-column layout at 390/720/768 and three columns at 1440, no document horizontal
overflow, stable chart dimensions, native anchors and existing hero/clipboard/motion
regressions. No new screenshots or final visual parity claim. Manual review remains
at `http://localhost:3001/#token`. Token-specific deployment/pair/provider evidence
and confirmed utility/fee/community rules remain outstanding. No commit, push,
merge or deployment; awaiting review before further section changes.

## User-specified How it works mechanics revision

The user now supplies the intended three pillars: Robinhood tokenized MSFT pairing,
trading fees to the LONG community vault, and community direction fully guided by
NILLA holders. This supersedes the earlier absence of project intent; it does not
verify a deployed pair, fee routing or implemented governance.

| Feature               | Actual symbol / exact modify path                           | Reuse and scope                                                                                                                                                             | Checks                                                                                                       |
| --------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Pillar copy           | `TokenSection`, `src/modules/index/token/token-section.tsx` | Same three cards/artwork/layout; change headings, labels and paragraphs, mark all as planned and identify tokenized MSFT explicitly. Add brief prelaunch verification note. | Three intended pillars; no equity/affiliation/returns claims; no fabricated fee rate or voting/custody rules |
| Assertions            | `src/modules/index/token/market-token.spec.ts`              | Update existing copy expectations for the newly supplied intent.                                                                                                            | Planned status, pair/vault/guild wording, no-JS and existing responsive checks                               |
| Evidence requirements | `docs/configuration.md`                                     | Record user-specified plans separately from deployed verification; actual trade/chart/vault flags remain disabled.                                                          | Exact remaining fee-routing, vault and governance evidence; no config gates enabled                          |

Screenshots remain manual. No changes to hero, MSFT API, trading configuration,
market placeholder, buying guide, or other sections; no publication authorized.

Mechanics-copy verification: lint, typecheck, production build and diff whitespace
checks passed. The changed-pillar assertion first failed against the previous copy.
Production `corepack yarn test`: **57/58 passed (31.9s)**; all new section checks
passed on desktop/mobile. The unchanged mobile faction-animation test failed on
exact floating-point height equality (43.99999237060547 vs 44px). An isolated
`corepack yarn test --last-failed` rerun **passed (1 test, 5.1s)** without code changes.
No claim of a fully passing single 58-test run for this revision. Manual visual
review remains with the user; no screenshots, commits or deployment.

## Section 2 approval and requested publication

The user approved the final pair/vault/guild cards and requested commit and push.
Fresh pre-commit lint, typecheck and production build passed; full production test
suite **58 passed (28.5s)** in a single run, including the previously intermittent
animation assertion. `origin/main` was checked through GitHub CLI and matched
`fffd37bbe9e17bccbbdc3299ceff7dc5832bd369` before the commit.
Commit scope: the final How it works replacement, Auction House readiness copy,
owned styling, colocated checks/journey assertions and configuration/implementation
documentation. Pre-existing screenshot deletions and new local baseline screenshots
are excluded. No separate deployment command is authorized or performed.
