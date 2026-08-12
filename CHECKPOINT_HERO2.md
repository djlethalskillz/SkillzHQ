# SkillzHQ V1 — Hero 2 Checkpoint (Clean Production State)

Date: 2026-08-12
Current commit: `c9fdeeb` — "Hero 2 controlled replacement: compose master subject with SKILLZ type per Hero 2 Reference"
HEAD: `3301f44` — "add Hero 2 checkpoint/handoff note" (this note; tree clean)

## History

| Commit | Description |
| ------ | ----------- |
| `825833d` | Initial commit from Create Next App |
| `1157b71` | Checkpoint: pre-reference-lock-v1 state (CSS reconstruction hero) |
| `716cbb5` | Apply Reference Lock V1: approved hero artwork as canonical visual master |
| `c9fdeeb` | **Hero 2 controlled replacement (current)** |

Working tree: clean.

## Files changed in this checkpoint

- `src/components/hero.tsx` — rebuilt around the Hero 2 MASTER subject + giant SKILLZ type
- `src/lib/site.ts` — added `hero2Master` config key
- `public/assets/skillz-hero2-master.png` — new (4624×3468)
- `public/assets/skillz-hero2-reference.png` — new (1448×1086)

## Assets

- **Subject:** `public/assets/skillz-hero2-master.png` (source: `_Claude_References/DJ Lethal Skillz Hero 2 MASTER.png`)
- **Composition spec:** `public/assets/skillz-hero2-reference.png` (source: `_Claude_References/DJ Lethal Skillz Hero 2 Reference.png`)
- Historical artifacts preserved: `skillz-hero-approved-reference.png` (Reference Lock V1), `sky-0104.jpg` (authentic source photo), `skillz-cutout.png` (unused)

## White-background keying

The MASTER PNG is NOT actually transparent — RGB on a clean pure-white studio field (no alpha channel; verified with PIL). Per the "CSS/layout only" constraint, the white field is keyed out at render time, source untouched:

- Inline SVG filter `#hero2-white-key` in `hero.tsx`: `feColorMatrix` (luminance → alpha) + `feComponentTransfer` threshold table (`1 ... 1 0 0`) → alpha 1 below lum≈224, 0 at 255.
- Face survives: face luminance p99 = 190, only sparse glare >224 is cut.
- Verified: above-head band 100% black, zero white residue; head zone 76.8% skin / 0.4% white.

## Composition mapping (measured against Hero 2 Reference, 4:3)

- Hero frame: `aspect-[4/3]`, `max-w-[1448px]`, black field, yellow marquee below
- Subject box: width 101.9% of frame, aspect 4:3, top −7.7%, left +2.6% → head top ≈9%, head center ≈49.6% of frame (reference face: y 9–30%, x 39.5–60%)
- SKILLZ: Anton 596px desktop (clamp 41.4vw), white distressed treatment, cap band ≈ y 20–65%, spans x 2–98%, layered BEHIND the subject
- EOTO (Caveat yellow) + supporting copy bottom-left; ENTER THE HQ → bottom-right; CTA scrolls to `#what-i-do`

## QA results

- **Desktop 1440×900:** no overflow; black 62% / white 16.6% / yellow 0.5%; marquee below fold (same as Reference Lock V1)
- **Responsive 1024×768 / 390×844:** no overflow, no clipping, proportions scale; marquee on-screen on mobile (y361); mobile menu opens; CTA intact
- **Lint:** clean
- **Build:** clean, static prerender (one TS null-guard fix applied during this checkpoint)
- **Browser:** all 5 sections intact (landing, what-i-do, workshops-speaking, book, watch-listen); CTA scrolls correctly; zero console/page errors
- **Screenshots** (dev only, not committed): `qa-h2-1440/1024/390.png` were captured then removed

## Known benign warning

`REQFAIL: /assets/each-one-teach-one-hero.mp4 net::ERR_ABORTED` — browser-cancelled `preload="metadata"` probe on the Workshops video (user-initiated playback, `controls`). Not an application error. Present before this checkpoint.

## Remaining placeholders (unchanged)

- `site.bookingEmail: null` → booking CTA shows "Booking destination — coming online."
- `site.media.youtube / spotify: null` → Watch / Listen show "Available soon"

## Visual refinement areas (tomorrow — controlled pass only)

User-inspected 2026-08-12 evening: implementation substantially better than prior, but requires visual refinement. Known areas to review (do NOT redesign — refine only):

- Subject scale/head prominence vs Hero 2 Reference (head 22.7% of frame width vs ref 20.5%; subject body asymmetry differs from reference crop)
- Tonal feel: reference face zone reads darker/grittier (47.5% black) than the master render (20.2% black); master is rendered as-provided, unmodified
- SKILLZ type band and its overlap with the subject
- Copy (EOTO / supporting / ENTER THE HQ) placement and scale relative to the new subject
- Any other visual deltas the user flags against `skillz-hero2-reference.png`

Constraints that remain locked: master file untouched, face untouched, no new images, CSS/layout-only adjustments, black/white/yellow only, existing sections and behavior preserved.

## Resume from this checkpoint

```bash
cd C:\Users\djlet\Skillz-V1-Website
git checkout c9fdeeb        # or just work from master (tree is clean at this commit)
npm install                 # if node_modules missing
npm run dev                 # dev server → http://localhost:3000
```

QA commands:

```bash
npm run lint
npm run build
```

Visual QA: headless Chrome screenshot at 1440×900 (see `C:\Users\djlet\AppData\Local\Temp\skillz-qa\` for the puppeteer QA scripts used this session; `puppeteer-core` is a devDependency).

Do NOT redesign the Hero 2 composition without an explicit new directive.
