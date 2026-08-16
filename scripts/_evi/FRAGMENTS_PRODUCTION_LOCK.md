# FRAGMENTS — PRODUCTION LOCK RECORD

Date: 2026-08-16
Status: **PRODUCTION LOCKED — human visual review approved**
Commit: (recorded by the follow-up docs commit)
Canonical implementation: `src/components/fragments.tsx` + `src/lib/fragments.ts`

## What was locked (final V1 state)

The one-living-cinematic-scene Fragments chapter: **81-figure territory field**
(62 tablet / 22 mobile) — every fragment owns a scattered base position
(deterministic wall scatter: full canvas, corners/edges populated, hero
breathing room empty, no piles) and circulates a small local orbit around it
(5–12% scene width, periods 55–115s × tier, unique phase/radius/speed/direction
per fragment, 1-in-5 reverse, ±30% breathing). No shared center — no visible
rings, no co-rotation.

- **Hero protection** — Skillz + Grandmaster Flash central mount; ray-exit
  guard in the orbit's own normalized coordinate space (fixed during QA:
  previous mixed-space version under-tested on portrait viewports), full
  box-extent inflation +60px, bow +40px trail, hard face protection.
- **Natural-aspect mounts** — Instant/Flyer/Pass/Jcard render photos at
  intrinsic ratio (w-full), no crop: people, artwork, flyer info intact.
- **Caption typography** — JetBrains Mono (site archive-mono, same family as
  the hero caption): 10.5px, weight 500, tracking 0.02em,
  rgba(22,20,18,0.85), leading 1.25 — printed onto the white border, hero
  caption `WITH GRANDMASTER FLASH` untouched.
- **Editorial captions** — date-stripped, timeless/person/event/place/role
  only. Zero dates in visible caption copy.
- **Depth tiers** — primary/secondary/deep with tier omega slip, background
  typography field (17 archival words + mono roster/archivist labels), paper
  palette, yellow accent, tape, grain — unchanged.
- **Reduced motion** — static composition contract untouched (0 transformed).
- **Responsive** — desktop 81 / tablet 62 / mobile 22, same philosophy.

Shared files carrying Fragments DNA ship with this lock: `layout.tsx`
(Big_Shoulders + JetBrains_Mono imports), `globals.css` (--font-arch,
--font-arch-mono, paper palette, --color-arch-yellow), `what-i-do.tsx`
(chapter entry). `public/assets/fragments/` is the locked asset set.

## Final production QA (2026-08-16, after micro-typography pass)

| Check | Result |
|---|---|
| TypeScript (`npx tsc --noEmit`) | PASS |
| Production build (`next build`) | PASS (1 pre-existing font-fallback warning) |
| Fragments desktop 1440×900 | PASS — 81 figures, quadrants 18/17/17/18, 0 mount overlaps |
| Fragments tablet 1024×768 | PASS — 62 figures, captured |
| Fragments mobile 390×844 | PASS — 22 figures, quadrants 3/3/3/5, 0 face overlaps z≥20 |
| Reduced motion | PASS — 0 transformed figures; typography static |
| Horizontal overflow | PASS — 0 at all viewports |
| Console errors | PASS — 0 across all viewports |
| Failed asset requests | PASS — 0 across all viewports |
| Broken images | PASS — 0 across all viewports |
| Hydration errors | PASS — 0 across all viewports |
| Hero mount protection (live 30s) | PASS — 0 overlaps; mount region pixel-diff 0.00 across all 9 motion-proof intervals |
| Distribution (live 30s) | PASS — radius spread 24–62% of scene, angular max 19 « pile threshold 30, 41/81 outer band |
| Motion proof (10 stills, 2s apart) | PASS — 81/81 moved, mean 144px, field diff continuous per interval |
| Readability (pair-overlap, 5 samples) | PASS — ~2% pairs, same-layer buried 1–4 (<5), all rotating |
| Caption census (40 frames) | PASS — qa-census.json 0 violations every frame |
| Motion review | PASS — FRAGMENTS_MOTION_REVIEW.gif (15s @8fps) |

## Evidence (scripts/_evi/ — preserved)

- FRAGMENTS_REST / EARLY / ACTIVE / REORGANIZED.png (t≈0/3/12/30s, 1440×900)
- FRAGMENTS_MOTION_REVIEW.gif (15s @8fps), FRAGMENTS_TABLET_ACTIVE.png,
  FRAGMENTS_MOBILE_ACTIVE.png, FRAGMENTS_REDUCED_STATIC.png
- qa-census.json (0 violations), motion-proof-00..09.png (2s apart, 20s span)
- FRAGMENTS_QA_RECORD_v8.md (full pass record incl. micro-typography addendum)
- scatter-positions.py (deterministic wall scatter generator + verification),
  fragments-distribution-probe.mjs, fragments-tech-probe.mjs,
  dbg-pair-overlap.mjs, dbg-caption-probe.mjs

## Notes

- Guard coordinate-space fix was the only engine change found during final
  QA: the ray-exit exclusion ran in mixed units (y·k vs y/k); conservative on
  desktop, it under-tested on portrait viewports where k>1 (one transient
  mobile graze observed and fixed). Desktop distribution unchanged after fix.
- No previously locked chapters (speaking, turntablism, hero, producer) were
  modified by this lock.
- Chapter is frozen: no further visual, motion, typography, distribution,
  asset, or layout changes without explicit approval. Revisit only for
  genuine production bugs.
