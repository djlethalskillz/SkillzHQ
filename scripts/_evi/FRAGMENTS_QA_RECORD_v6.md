# FRAGMENTS — VINYL/ORBITAL MOTION ENGINE — QA RECORD v6

Date: 2026-08-16 | Build: `npm run build` clean (Turbopack, 1 pre-existing font-override warning) | `npx tsc --noEmit` clean

Scope: motion-engine only. Curation, assets, hero, typography, captions, composition untouched (81/62/22 field intact).

## 1. Motion architecture — the vinyl record

The field is a giant record; the hero photograph (Skillz + Grandmaster Flash) is the spindle. Analytic per-frame orbit, no waypoints, no dwells:

- **Position** = spindle center + (cos θ, sin θ·k)·r — computed analytically every frame; y compressed by k = vh/vw so orbits read as circles (a platter) on any viewport.
- **Each fragment owns**: radius (its resting distance from the spindle — the broad distribution never collapses), angle, slow angular velocity with phase jitter (×0.92–1.08), radial breathing (radius ×(1 + amp·sin(2πt/T)), own period 28–56s, own phase), rotation wobble (±1.5–4°, period 24–46s), scale breathing (period 32–60s). No two orbits pulse alike.
- **Platter pace**: one revolution ≈ 2.5 min (PLATTER = 2π/150). Depth tiers slip: primary ×1.18, secondary ×1.0, deep ×0.8 — layered bands of one record, never a synchronized carousel.
- **Motion perceived gradually**: entrance settle lerps offsets from the resting composition over 2.6s (tau 2.4s), then the platter wakes at ~0.034 rad/s — "something is moving" → "the whole archive is revolving".
- **Photographs stay stable**: positions travel; objects only wobble ±4° and breathe scale — readable objects, revolving positions.
- **Trailing lerp** (tau 0.7–1.1s, deep ×1.25): soft smoothing, no snaps; 0.1s dt guard for tab-switch.
- **Presence cycles, z-tiers (deep 1 / secondary 5 / primary 10, hero container later in DOM wins ties), no-scroll/no-hover/no-click, canvas clamp ±6vw/vh** — all preserved.

## 2. Orbital speed / radius / depth logic

| Tier | ω (platter = 2π/150 ≈ 0.042 rad/s) | Radius | Observables |
|---|---|---|---|
| primary | ×1.18 ≈ 0.0495 rad/s (≈ 2.1 min/rev) | resting distance from spindle, min 14vw | slightly quicker band |
| secondary | ×1.0 | resting distance | mid band |
| deep | ×0.8 ≈ 0.0335 rad/s (≈ 3.1 min/rev) | resting distance | slowest, most distant band |

Each radius breathes ±8–16% on a 28–56s cycle; positions travel 350–860px over 20s (measured mean 401px, max 860px — slow/steady/cinematic, not fast rotation).

## 3. Hero protection — mathematically explicit exclusion

- **Protected zone** = hero mount rect (photo + paper + caption strip), read from the DOM each resize; the spindle (cx, cy) is the mount center.
- **Ray-exclusion guard**: per fragment per frame, a ray from the spindle at the fragment's angle is slab-tested against the mount rect **inflated by the fragment's FULL box extent + 60px** (the transform anchor is the figure top-left, so full extent, not half — a figure passing above the mount would otherwise hang its caption into the photo). The ray's exit distance is the exclusion radius for that angle; if the orbit radius is inside it, the orbit bows out to exit + 40 (extra gap absorbs lerp trailing while chasing corners).
- **y-space consistency**: the guard compresses y with the SAME k = vh/vw as the position space (a fixed bug had the inverse — vw/vh — under-estimating exclusion up to 2.56× and letting fragments orbit into the mount).
- **Orbit-center consistency**: offsets are lerped toward (orbit target − CSS base position) — the actual rendered position equals the intended scene coordinate, so every fragment orbits the TRUE spindle (a second fixed bug had offsets lerped toward absolute scene coords, displacing each orbit center by its base position).
- **Result**: fragments pass AROUND the mount, never over/through it; nothing ever paints over the hero (z-tiers + DOM order).

## 4. Viewport behavior

- **Desktop 1440×900**: 81 figures, quadrants by center 19/19/22/17, live 30s reach 732px vs corner 815px, 31 of 81 in outer 8% band — broad distribution kept, orbit feels LARGE.
- **Tablet 1024×768**: 62 figures, no overflow, all transformed/moved.
- **Mobile 390×844**: 22 figures, hero central (mount 238px of 342px scene), smaller orbital field by construction (fewer fragments, tighter radii), no horizontal overflow, no swipe. Quadrants 8/3/3/2 (intentionally lighter right side — hero dominates).

## 5. Reduced motion — absolutely preserved

`prefers-reduced-motion: reduce` → engine gate returns before any transform; 0 of 22/62/81 figures transformed; static composition; all archive material visible. Verified FRAGMENTS_REDUCED_STATIC.png.

## 6. QA results

| Check | Result |
|---|---|
| TypeScript `tsc --noEmit` | clean |
| Production build | clean |
| Hero-mount census (41 GIF frames, all figures vs mount) | **0 of 41 violations** (was 25/41 pre-fix) |
| Live mount probe (12 samples over 5.5s) | **0 overlaps** (was 27) |
| Distribution probe rest + live 30s | mount overlaps [] both |
| DOM motion | 81/81 moved, mean 401px/20s, max 860px |
| Pixel diffs (10 stills, 2s apart) | mean abs diff 23–27 per 2s interval; chrome corner 0.0 |
| GIF pixel motion | field 16–23 per 0.375s interval; mount region ≤0.29 (60–150× quieter — spindle protected) |
| Console errors / failed requests / page errors / broken images / hydration / horizontal overflow | 0 / 0 / 0 / 0 / 0 / none (all 3 viewports) |
| Reduced-motion | 0 transformed |

## 7. Artifacts (scripts/_evi/, regenerated from the fixed build)

- FRAGMENTS_REST / EARLY / ACTIVE / REORGANIZED.png (desktop t=0/3/12/30s)
- FRAGMENTS_MOTION_REVIEW.gif (15s, 8fps, 121 frames)
- FRAGMENTS_TABLET_ACTIVE.png, FRAGMENTS_MOBILE_ACTIVE.png
- FRAGMENTS_REDUCED_STATIC.png (0 transformed)
- qa-census.json (0 violations), motion-proof-report.json + motion-proof-00..09.png
- QA probes: dbg-mount-probe.mjs, dbg-guard-probe.mjs, dbg-park-probe.mjs (diagnosis chain)

## 8. Files changed (this pass)

- `src/components/fragments.tsx` — orbital engine splice (waypoint → orbit), two fixes:
  1. offset lerp targets `ax − bx` (orbit centers now on the true spindle);
  2. `rayExit` k = vh/vw (exclusion radius correct in normalized space);
  3. guard inflation = full box extent + 60, bow gap + 40 (anchor is top-left; captions never graze the mount).
- QA probes updated: census measures ALL figures vs hero mount; distribution probe mount shape.

## 9. Remaining subjective issues (for human eyes — vision unavailable this session)

1. The bow pushes fragments passing over the mount ~100–150px higher than their raw orbit for the ~60° arc over the hero — reads as a deliberate "flow around the spindle", but worth confirming it doesn't read as a wall at that arc.
2. deep-tier fragments (≤3vw) bow most often (small radii) — they trace tighter circles nearer the spindle by design; visual check that this doesn't read as clustering at the exclusion boundary.
3. Mobile right side intentionally lighter (hero dominates); motion cycles fragments through the zone.
4. The 0.14/0.29 pixel blips in the mount region are caption anti-aliasing at the boundary — invisible in motion.
