# FRAGMENTS — PRODUCTION LOCK RECORD

Date: 2026-08-16
Status: **PRODUCTION LOCKED — human visual review approved**
Commit: b8bd800 — lock: production lock Fragments living archive
Canonical implementation: `src/components/fragments.tsx` + `src/lib/fragments.ts`

## What was locked

The one-living-cinematic-scene Fragments chapter: waypoint/damped-lerp motion
engine (steady tau 7.2–13.2s, first-journey settle 1.8–2.8s), 46-figure
responsive field (21 deep / 9 secondary / 7 behind-primary / 9 front),
central Skillz + Grandmaster Flash hero with hard face protection, and the
**typographic archive field** added in the final pass — 17 archival words
(DOCUMENTED, DECADES, TURNTABLISM, HIP-HOP, SKILLZ, SESSION, VINYL, WORLD,
JAPAN, BEIRUT, DUBAI, LONDON, LEGACY, RADIO, CULTURE, ARCHIVE, SCRATCH)
layered at 8–60% opacity behind every fragment, with mono roster +
archivist labels, and a 4.2×-slower scroll drift (q·1.2vh vs q·5vh).

Shared files carrying Fragments DNA ship with this lock: `layout.tsx`
(Big_Shoulders + JetBrains_Mono imports), `globals.css` (--font-arch,
--font-arch-mono, paper palette, --color-arch-yellow),
`what-i-do.tsx` (chapter entry). `public/assets/fragments/` is the locked
asset set.

## Final production QA (2026-08-16)

| Check | Result |
|---|---|
| TypeScript (`npx tsc --noEmit`) | PASS |
| Production build (`next build`) | PASS (1 non-blocking warning: Big Shoulders fallback metrics) |
| Fragments desktop 1440×900 | PASS — REST/EARLY/ACTIVE/REORGANIZED captured |
| Fragments tablet 1024×768 | PASS — 33 figures, captured |
| Fragments mobile 390×844 | PASS — 13 figures, captured |
| Reduced motion | PASS — 46 figures, 0 transformed; typography static |
| Horizontal overflow | PASS — document scrollWidth delta 0 at all viewports |
| Console errors | PASS — 0 across all viewports |
| Failed asset requests | PASS — 0 across all viewports |
| Hero face protection | PASS — stills 0.0% face-diff across runs; GIF window max ≤2.7% single-frame transient, mean ≤1.9%, zero z-20 census events, zero sustained runs; all front figures park ≥36px from face rect with shadow+tape clearance (boxClear margin 0.62×half + 50px) |
| Continuous time-based motion | PASS — field displacement 26–33% over 15s GIF window; 46/46 transformed at rest states |
| Typography behind fragments | PASS — dressing z-0 < parallax wrapper z-10 (probed) |
| 46-fragment density | PASS — desktop 46 (21/9/7/9), tablet 33, mobile 13 |
| No internal scrolling | PASS — scene `overflow-hidden`, zero scrollable containers |

## Evidence (scripts/_evi/)

- FRAGMENTS_REST.png / EARLY / ACTIVE / REORGANIZED (t≈0/3/12/30s, 1440×900)
- FRAGMENTS_TABLET_ACTIVE.png, FRAGMENTS_MOBILE_ACTIVE.png
- FRAGMENTS_REDUCED_STATIC.png (reduced-motion composition)
- FRAGMENTS_MOTION_REVIEW.gif (15s @8fps)
- qa-census.json (per-frame z-20 face census, zero events)
- frag-face-check.py (pixel face verifier), dbg-lock-probe.mjs (console/assets/overflow/scroll/z-order/density)
- dbg-typography.mjs, dbg-drift.mjs, dbg-composition.mjs (field probes)
- dbg-shadow-probe.mjs, shadow-correlate2.py, shadow-min-margin.py (face-shadow causation)

## Notes

- Box-shadow face guard: margin 24→50px in `boxClear` — the only engine
  primitive touched this pass, to keep parked front figures' 36px-reach
  shadows and tape off the face. No motion parameters changed.
- Residual single-frame GIF transients ≤2.7% are blurred shadow falloff of a
  front figure transiting past the face corner between 8fps census samples —
  structurally impossible for a fragment box, tape, or typography to cover
  the face; visually imperceptible.
- No previously locked chapters (speaking, turntablism) were modified by this
  lock.
