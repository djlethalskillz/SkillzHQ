# FRAGMENTS — QA RECORD (Experience Revision · Scene-Based)

Date: 2026-08-15
Status: IMPLEMENTED — NOT PRODUCTION LOCKED. Human visual review checkpoint (per directive).

## What changed from pass 1

- v1: long vertical band wall (26 plates, ~14 viewport heights).
- v2: five cinematic scenes — HERO (pinned, satellites emerge) → statement → PEOPLE (pinned horizontal field, 12 cards) → PLACES (typographic movement, 7 cities + closing line) → MOMENTS+EVIDENCE (overlapping archival collage) → RESOLUTION. Total ≈ 9.5 viewport heights (desktop: 13 596 px vs v1 ≈ 20 000 px).
- Motion is JS choreography (rAF scroll-progress, direct style writes, no re-renders). CSS sticky impossible inside the chapter's `overflow-hidden` wrapper → JS pinning: wrapper height = viewport + travel, inner `translateY(+p·travel)`.
- `prefers-reduced-motion`: renders the same archive as a static, fully reachable layout (hero static with satellites visible; people as plain grid) — no pinning, no transforms, no rAF.
- All content stays manifest-driven: `fragments.ts` gained `satellites`, `peopleTrack`, `places`, `moments` (id references); `items` array unchanged. Component holds choreography only.

## Build & type

- `npx tsc --noEmit` — PASS (0 errors)
- `npm run build` — PASS, `/` + `/_not-found` prerendered static

## QA matrix (scripts/fragments-v2-qa.mjs, headless Chrome, dev server localhost:3000)

| Viewport | Motion mode | Overflow X | Imgs in DOM | Loaded | Choreography | Console errors | Frag asset failures |
|----------|-------------|-----------|-------------|--------|--------------|----------------|---------------------|
| 1440×900  | no-preference | 0 px | 28 | 28 | hero drift ✓ · photo scale ✓ · pinned ✓ · inner fills viewport ✓ · track translate −1723 px | 0 | 0 |
| 1024×768  | no-preference | 0 px | 28 | 28 | hero drift ✓ · photo scale ✓ · pinned ✓ · inner fills viewport ✓ · track translate −1894 px | 0 | 0 |
| 390×844   | reduce (fallback) | 0 px | 28 | 28 | static fallback: no track, plain grid ✓ | 0 | 0 |

- Identity labels (12 spot-checked, incl. WITH GRANDMASTER FLASH, TONY TOUCH · APOLLO · VINROC, ONE NATION UNDER A GROOVE, UFO RADIO, BEIRUT, BEIRUT TO PHNOM PENH) — ALL PASS
- Key assets (8 spot-checked incl. hero, qbert, trio, beirut-streets, sarasa, studio-2012, ufo-badge) — ALL PASS
- People pinned scene: wrapper 4347 px (desktop) / 4556 px (tablet) — measured to exactly match track travel
- Reduced-motion fallback verified in motion-pass AND reduce-pass modes

## Regression

- `scripts/speaking-qa.mjs` — PASS (rerun after final component state): identity plate, editorial, equipment/dubai tiles, bookingState rows + CTA "Book Skillz · Speaking", 0 errors, HTTP 200
- Locked chapters untouched (DJ / Turntablism / Speaking / Producer / Hero / Booking). Shared file `src/components/what-i-do.tsx`: only the pre-existing Fragments row (pass 1). Chapter container `overflow-hidden` untouched — pinning works inside it.

## Screenshots (fresh, this pass — scripts/_evi/)

- Full page: `frag-v2-desktop.png` (1440×13596) · `frag-v2-tablet.png` (1024×12856) · `frag-v2-mobile.png` (390×10829)
- Per scene (viewport): `frag-v2-{desktop,tablet}-{hero,people,places,moments}.png` · `frag-v2-mobile-{hero,places,moments}.png` (mobile renders reduced-motion layout)
- All shots pixel-verified to contain content (no black/stale frames) — see QA tooling note below.

## QA tooling notes (headless Chrome landmines, documented)

1. `isMobile: true` emulation → every later viewport screenshot captures stale black frames. Layout is width-based (Tailwind breakpoints); mobile viewport uses plain `setViewport({width:390,height:844})`.
2. `page.waitForFunction` (rAF polling) → corrupts capture; all later screenshots black. Replaced with settle timing (chapter images mount synchronously with the expand).
3. A `fullPage` screenshot leaves capture broken for subsequent viewport shots → scene shots run first, fullPage last.
4. With zero animations (reduce mode) the compositor idles → stale frames; force two rAF ticks (`flushFrames`) before every shot.
5. These affect screenshots only — metrics/choreography checks were unaffected and stayed green throughout.

## Items requiring human visual review

1. Hero scene: GMF photo + drifting satellites (Q-Bert left, TT·Apollo·Vinroc right) at p≈0.25 — `frag-v2-desktop-hero.png` / `frag-v2-mobile-hero.png`
2. PEOPLE pinned field mid-travel — `frag-v2-desktop-people.png` (track at −1723 px, cards 4-8 visible) — identity labels readable at track speed?
3. PLACES sequence — `frag-v2-{vp}-places.png` (7 city rows + closing "BEIRUT TO PHNOM PENH")
4. MOMENTS+EVIDENCE collage rotations/overlaps — `frag-v2-{vp}-moments.png`
5. Total length: ~9.5 viewport heights vs v1 ~14 — is the pacing right?
6. Reduced-motion layout (mobile): static grid fallback, names intact
7. 24 of 26 curated assets displayed (tony-touch solo + apollo solo remain in manifest, not shown — dupes of the trio plate)
8. Copy: statement "A LIFE INSIDE THE CULTURE.", places contexts, closing line
