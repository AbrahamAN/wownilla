# Wownilla

The original Wownilla landing page, migrated to Next.js App Router and React 19.
Static sections render on the server; Motion and React manage the interactive
intro, navigation, music, chat, and scroll effects. The dungeon retains its Canvas
2D renderer.

## Run

Use Node.js 20.9 or newer and Corepack. The project pins Yarn 4.18.1.

```sh
corepack yarn install --immutable
corepack yarn dev
```

Open http://localhost:3000. Production: `corepack yarn build`, then
`corepack yarn start`. Standard Next.js deployment works on Vercel or a Node server.

## Configure

Code is organized by page, then vertical:

```text
src/app/                     Next.js routes and metadata
src/modules/index/           Main landing page
  intro/                     Login queue and audio
  hero/                      Hero and dungeon renderer
  about/                     About section
  token/                     Token sheet and clipboard control
  lore/                      Lore section
  community/                 Community section and guild chat
  common/                    Landing-wide navigation, footer, configuration
src/modules/common/          Page-independent artwork and motion primitives
```

New pages get their own sibling under `src/modules`. Browser tests live with
their owning page or vertical; `src/app` only composes page modules.

Edit `src/modules/index/common/site-config.ts` for social links, contract text, media URLs, and music
volume. Existing contract and social placeholders are preserved. Place media in
`public/assets`. Set `heroVideo` to a public URL to replace the canvas when playback
succeeds; leave it empty for the dungeon. Music starts on the first allowed browser
gesture and mute lasts for the current visit.

`src/app/robots.ts` serves a public, allow-all `/robots.txt`. Metadata lives in the
root layout. No canonical domain or sitemap is assumed.

## Verify

```sh
corepack yarn lint
corepack yarn typecheck
corepack yarn build
corepack yarn test
```

Browser tests use locally installed Google Chrome and start a production server
on port 4173. Keep that port free when running the suite. Compare UI changes with
https://wownilla.vercel.app/#token at matching desktop and mobile sizes.
