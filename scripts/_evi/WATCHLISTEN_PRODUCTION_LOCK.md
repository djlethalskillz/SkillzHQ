# WATCH / LISTEN — PRODUCTION LOCK RECORD

Date: 2026-08-16
Status: **PRODUCTION LOCKED — human visual review approved**
Commit: 9ea1056 — lock: production lock Watch / Listen — YouTube performance embed + Spotify artist embed
Canonical implementation: `src/components/watch-listen.tsx` + `src/lib/site.ts`

## What was locked (final V1 state)

The final media chapter: two elevated panels (bg-elevated #141414, font-display
titles, mono labels, yellow CTA pills) replacing the previous "Available soon"
placeholders.

- **WATCH — real YouTube performance embed** (official channel pick):
  - Video: `SQRaL2YMKSI` — "DJ Lethal Skillz Unleashes Exclusive Originals in
    this Dynamic DJ Set" (`https://youtu.be/SQRaL2YMKSI`), official Skillz
    channel, owner verified, playable.
  - Embed: `https://www.youtube-nocookie.com/embed/SQRaL2YMKSI` — YouTube's
    official privacy-enhanced embed domain. Native controls, `loading="lazy"`,
    `aspect-video` (16:9), no autoplay, no forced audio, no custom player, no
    media framework.
  - Structure: `YOUTUBE · PERFORMANCE FOOTAGE` mono sub-label, `WATCH`
    font-display heading, 16:9 iframe, yellow `OPEN YOUTUBE` pill CTA linking
    to `https://www.youtube.com/@djlethalskillz` (new tab, noopener).
- **LISTEN — official Spotify artist embed** (unchanged from approval):
  - `https://open.spotify.com/embed/artist/7F3kgeoTzXbi5JLPylw4qW` (theme 0
    dark), 352px, `loading="lazy"`, no autoplay.
  - `SPOTIFY · MUSIC` sub-label, `LISTEN` heading, yellow `OPEN SPOTIFY` pill
    to `https://open.spotify.com/artist/7F3kgeoTzXbi5JLPylw4qW`.
- Section header: index 04, "Watch / Listen", note "Performance footage and
  music." — unchanged.

## Final production QA (2026-08-16)

| Check | Result |
|---|---|
| TypeScript (`npx tsc --noEmit`) | PASS |
| Production build (`next build`) | PASS (1 pre-existing font-fallback warning) |
| Live destination check | YouTube video page OK (owner Dj Lethal Skillz, playable); Spotify artist page OK (DJ Lethal Skillz); both embeds HTTP 200 |
| Probe (desktop 1440 / tablet 1024 / mobile 390) | 42/42 — Watch CTA exact href/target/rel; section copy intact; YouTube embed src exact; iframe lazy-loaded; 16:9 ratio 1.78 at all widths (572×322 / 364×205 / 278×156); Spotify embed src + lazy asserted unchanged; 0 console/page errors; 0 horizontal overflow; `#watch-listen` nav link intact; no "Available soon" text |
| Screenshots (human review) | WATCHLISTEN_DESKTOP / WATCHLISTEN_TABLET / WATCHLISTEN_MOBILE |
| Locked-chapter audit | No locked chapter modified (diff limited to `watch-listen.tsx` + `site.ts`) |

## Files changed this lock

1. `src/lib/site.ts` — `media.youtube` / `media.spotify` filled (were `null`):
   channel `https://www.youtube.com/@djlethalskillz`, artist
   `https://open.spotify.com/artist/7F3kgeoTzXbi5JLPylw4qW`
2. `src/components/watch-listen.tsx` — placeholder branch removed; Watch panel
   = YouTube embed + channel CTA; Listen panel = Spotify artist embed + CTA

## Notes

- YouTube has no channel-level embed; Watch uses the best supported approach
  (official video embed + channel CTA) per the approved design.
- Embeds are third-party iframes only: lazy-loaded, no autoplay, no surprise
  audio, no audio engine. Optional user-controlled music experience remains a
  possible future pass.
- QA evidence preserved in `scripts/_evi/` (dbg-watchlisten-probe.mjs,
  dbg-watchlisten-live.mjs, dbg-watchlisten-shots.mjs, screenshot set).
- No previously locked chapters (hero, speaking, turntablism, producer,
  fragments, book skillz) were modified by this lock.
- Chapter is frozen: no further UI, UX, copy, or structural changes without
  explicit approval. Revisit only for genuine production bugs.
