# Wownilla

## Design Reference

Visit https://wownilla.vercel.app/#token in a real browser before UI changes,
throughout implementation, and during final verification. Compare matching
viewport sizes, scroll positions, and animation states. Preserve the original
artwork, typography, colors, spacing, content, and interactions. Keep baseline
screenshots before any deployment replaces this reference. Report access failures
explicitly rather than claiming visual parity.

## Development

- Organize by page, then vertical under `src/modules/index`: `intro` owns login and audio;
  `hero` owns the dungeon and hero presentation; `about`, `token`, `lore`, and
  `community` own their sections and interactions. Keep changes in their owner.
- Each new page gets a sibling module such as `src/modules/<page>/`, with its own
  verticals. `index/common` owns landing-wide navigation, footer, and configuration.
- `src/modules/common` owns only page-independent artwork, motion primitives,
  and particles. Promote code there only when it has concrete cross-page use or
  no page owner. Keep imports explicit;
  `src/app` composes module entry components without a barrel export layer.
- Colocate browser tests with their owning page or vertical. Journeys spanning
  landing verticals belong in `src/modules/index/*.spec.ts`.

- Use the Yarn version pinned in `package.json` through Corepack. Commit `yarn.lock`.
- Run `corepack yarn dev`; validate with `corepack yarn lint`, `corepack yarn typecheck`,
  `corepack yarn build`, and `corepack yarn test` (Playwright uses installed Chrome).
- Use the available `vercel-react-best-practices` skill for React/Next.js work.
  Consult the relevant individual rules during implementation and review.
- Keep static sections server rendered. Put browser behavior in focused client
  components, and use motion values or refs for animation-frame updates.
- `src/modules/index/common/site-config.ts` owns public links, contract text, audio, and optional video.
  An empty video URL intentionally uses the original Canvas 2D dungeon.
- Queue and audio share the `Experience` lifecycle. Clean up observers, listeners,
  timers, and animation frames on unmount and under React Strict Mode.
- Preserve keyboard entry, autoplay rejection handling, reduced motion, hidden-tab
  pausing, and readable server content when JavaScript is unavailable.
- Add JSDoc to exported functions, classes, interfaces, types, and non-obvious
  helpers. Explain their purpose and why the boundary exists.
- Prefer inference, narrowing, and explicit type guards over `as` casts.
- Extract utilities and standalone types only for concrete reuse or clearer boundaries.
- Use `gh` for GitHub operations. Publishing is separate from local verification.

## Verification

Check desktop and mobile screenshots against the live reference, especially direct
`#token` entry, the intro queue, navigation, typography, and card sizing. Test media
failure, clipboard outcomes, keyboard access, and reduced motion. Confirm that the
canvas is nonblank and moving, `/robots.txt` allows `/`, and no hydration errors occur.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
