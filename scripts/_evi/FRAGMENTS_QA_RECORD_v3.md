# FRAGMENTS — QA RECORD (V3 · Cinematic Choreography)

Date: 2026-08-15
Status: IMPLEMENTED — NOT PRODUCTION LOCKED. Human visual review checkpoint (per directive).

## What changed from v2

- v2: HERO was a static centre photograph with two satellites emerging from the edges.
- v3: the HERO is the centre of gravity — the GMF photograph anchors a field of **nine archive fragments** (photographs, flyers, documents, people) that shuffle around it as the scene travels. Scroll is the director: **SCENE 01 "the archive comes alive"** (fragments drift laterally/vertically/diagonally, rotate ±2–5°, scale slightly, fade in/out at different speeds) then the chapter **resolves into the existing structured system** (PEOPLE track → PLACES rows → MOMENTS+EVIDENCE collage → RESOLUTION). No carousel, no sphere, no WebGL — CSS transforms + opacity + scroll progress on rAF.
- Every fragment carries its own path in the manifest (`heroField`, 9 entries): drift distance/direction (desktop ×1 / mobile ×0.5 lateral, ×1.25 vertical), resting + drifting rotation, scale, relative speed 0.6–1.35 ("rhythm before symmetry"), and enter/exit fade windows — some almost disappear (rob-swift opacity 0.5) then re-emerge; the UFO badge surfaces late (fadeIn 0.35) then recedes. one-nation crosses **behind** the hero (z-0 vs photo z-10); stussy/ufo overlap corners ahead (z-20) without obscuring the figure.
- Identity labels move with their photographs (qbert, tt·apollo·vinroc, keith-shocklee, jazzy-jeff, rob-swift).
- Motion: single rAF-throttled pose writer, direct style writes, zero re-renders. Hero grows 1 → 1.06 as it establishes, then holds — the anchor.
- `prefers-reduced-motion`: the archive as a clean static layout — same field at rest positions, all fragments fully visible, no transforms, no rAF.

## Build & type

- `npx tsc --noEmit` — PASS (0 errors)
- `npm run build` — PASS, `/` + `/_not-found` prerendered static

## QA matrix (scripts/fragments-v3-qa.mjs, headless Chrome, dev server localhost:3000)

| Viewport | Motion | Overflow X | Imgs | Loaded | Hero choreography | People pinned | Console | Frag assets |
|----------|--------|-----------|------|--------|-------------------|---------------|---------|-------------|
| 1440×900  | no-preference | 0 px | 35 | 35 | pinned ✓ · inner fills ✓ · frag0 drifted @mid (translate3d ~45px/−20px, desktop-full scale) ✓ · photo scale 1.06 ✓ · z-order one-nation behind (z-0) ✓ · ufo opacity 0 at rest → 0.9 mid ✓ | pinned ✓ · wrap 4347 px · track −1723 px | 0 | 0 |
| 1024×768  | no-preference | 0 px | 35 | 35 | same ✓ (track −1894 px) | 0 | 0 |
| 390×844   | no-preference | 0 px | 35 | 35 | same ✓ (mobile pos/drift scales) · ufo gating ✓ | pinned ✓ · track −1707 px | 0 | 0 |
| 390×844   | reduce | 0 px | 35 | 35 | static fallback: no track ✓ · 9 fragments, no transforms ✓ | — | 0 | 0 |

- Identity labels (14 spot-checked, incl. WITH GRANDMASTER FLASH, DJ Q-BERT, TONY TOUCH · APOLLO · VINROC, ROB SWIFT, KEITH SHOCKLEE, DJ JAZZY JEFF, BEIRUT TO PHNOM PENH) — ALL PASS
- Key assets (8 spot-checked) — ALL PASS
- imgCount 35 = hero 1 + field 9 + people track 12 + places 7 + moments 6 — matches manifest exactly

## Screenshots (scripts/_evi/, all pixel-verified non-black)

Directive captures:
1. hero at rest — `frag-v3-desktop-hero-rest.png` (p=0: field at rest positions, clean composition)
2. hero early-scroll — `frag-v3-desktop-hero-early.png` (p≈0.15: first breath, hero growing)
3. hero mid-scroll — `frag-v3-desktop-hero-mid.png` (p≈0.5: fragments drifting, ufo surfaced)
4. fragment transition — `frag-v3-desktop-fragment-transition.png` (p≈0.78: cross/reorganise, some fading)
5. PEOPLE transition — `frag-v3-desktop-people.png` (track mid-travel, labels readable)
6. desktop full — `frag-v3-desktop.png` (1440×14766)
7. tablet — `frag-v3-tablet.png` (1024×13854) + `frag-v3-tablet-hero-mid.png`
8. mobile (motion) — `frag-v3-mobile.png` (390×12348) + `frag-v3-mobile-hero-mid.png`
9. reduced-motion mobile — `frag-v3-mobile-reduced.png` (390×10829) + `frag-v3-mobile-reduced-hero.png`

## Regression

- `scripts/speaking-qa.mjs` — PASS (desktop/tablet/mobile, 0 errors, speaking CTA "Book Skillz · Speaking", booking rows intact)
- Locked chapters untouched. Shared file `src/components/what-i-do.tsx`: only the pre-existing Fragments row (pass 1, +7 lines). Chapter container `overflow-hidden` untouched — JS pinning works inside it.

## QA tooling notes (v3 additions to the v2 landmine list)

All five v2 landmines carried over (no isMobile, no waitForFunction, scene shots before fullPage, flushFrames, settle ≥800ms). Two new ones:

6. **Stale black frame on a fresh page's first screenshot in reduce mode** (compositor idles — nothing animates). FlushFrames alone is not sufficient, and plain retakes keep re-reading the stale frame (nondeterministic — one run healed, the next did not). Deterministic fix: viewport screenshots capture via `clip` (rasterizes on demand — 2/2 in probes vs ~50% for full-viewport captures). All shots still size-check (black ≈ 4KB, real 100KB+) with a 1px viewport-nudge retry as a backstop.
7. `prefers-reduced-motion` must be emulated per-viewport BEFORE `goto` — it was already; headless Chrome defaults to reduce, so the motion passes pin it to `no-preference`.
8. **Stale first-render closure bug found by QA** (not a screenshot issue): `useScrollChoreography` keeps its first `apply()` closure, and `pose` captures `isMd` — on desktop, the initial hydration value (false) made fragments pose at mobile drift scale (×0.5). Fixed by rebinding through a ref (`poseRef`). QA asserts drift scale per viewport (`driftScale: desktop-full` / `mobile-half`) so a regression is caught by numbers, not by eye.

## Items requiring human visual review

1. Hero rest composition — is the resting field balanced around the centre photo? (`frag-v3-desktop-hero-rest.png`)
2. Mid-scroll drift — rhythm, not unison: do the speeds/rotations read as a physical archive shuffling, or as noise? (`frag-v3-desktop-hero-mid.png`)
3. Fragment transition (p≈0.78) — some fragments should be receding; is one-nation's pass behind the hero legible? (`frag-v3-desktop-fragment-transition.png`)
4. Does the UFO badge surface late without feeling gimmicky? (fadeIn 0.35)
5. Mobile vertical/diagonal drift at half lateral scale — restrained enough? (`frag-v3-mobile-hero-mid.png`)
6. Reduced-motion layout — the static field at rest, all 9 fragments + labels visible (`frag-v3-mobile-reduced-hero.png`)
7. Total chapter length: 14 766 px desktop (~16.4 viewports incl. pinned hero travel 180vh) — pacing vs v2's ~9.5.
8. Labels readable at track speed in PEOPLE transition shot (`frag-v3-desktop-people.png`).
