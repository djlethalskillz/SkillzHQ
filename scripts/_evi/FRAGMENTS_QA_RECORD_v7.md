# FRAGMENTS — DISTRIBUTION REFINEMENT PASS — QA RECORD v7

Date: 2026-08-16 | Build: `npm run build` clean (1 pre-existing font warning) | `npx tsc --noEmit` clean

Scope: motion distribution only. Engine, protection, tiers, assets, hero, typography, reduced-motion untouched. **No assets added or changed. No locked chapters touched.**

## 1. What changed (one file, one system)

`src/components/fragments.tsx` — the orbit-radius assignment in the engine pose init.

**Problem found:** orbit radius was `max(hypot(base position from spindle), 0.14 × scene width)` — the resting composition was placed for the static field (edges + corners), so spindle-distances bunched into a few rings. Fragments on the same ring shared radius, angle velocity, and phase → they travelled together as visible blocks: `stack → stack → stack → orbital movement`.

**Fix — the ladder:**
- Each fragment now draws a resting radius from an **even stride across [0.20, 0.45] × scene width**, ordered by a deterministic id-hash. The stride step (0.25/n) with sub-stride jitter (×0.7 step) means **no two fragments share a radius** — nothing travels as a group.
- The ladder starts at 0.20: below that the hero-exclusion rect (inflated by each box) dominates the orbit, and a lower ladder would be crushed against the guard into a pile.
- **Biases** (subtle, order-preserving): larger prints lean inward (−0.05 — the few big voices circulate closest to the spindle = inner orbit), deep-layer prints lean outward (+0.04).
- **Sync broken per fragment** (same deterministic hash): starting angle jitter ±0.25 rad, 1-in-6 reverse direction, wobble sign ±, 1-in-7 near-flat wobble — each object circulates alone.
- Engine, guard, breathing, tiers, lerp, entrance, reduced-motion, clamp: **unchanged**.

## 2. QA results

| Check | Result |
|---|---|
| `tsc --noEmit` | clean |
| `npm run build` | clean (static prerender) |
| Hero-mount census (41 GIF frames) | **0 of 41 frames with hits** |
| Distribution probe rest | quadrants 19/22/21/18 (desktop), mount overlaps [] |
| Distribution probe live 30s | mount overlaps [], reach 709px (corner 815px), 33/81 in outer 8% band |
| Radius spread (live) | 25.3%–52.1% of scene width — field covers near-hero to near-corner |
| Angular spread (live, 45° bins) | 11 8 8 8 17 13 10 6 — no piles (a pile = 30+ in one bin) |
| DOM motion proof (20s) | 81/81 moved, mean 374px, max 744px |
| Pixel motion proof (10 stills, 2s apart) | field diff 77.1–82.2 per interval; **mount region 0.00 every interval** |
| Tech probe (desktop/tablet/mobile) | 0 console errors / 0 failed requests / 0 page errors / 0 hydration / 0 broken images / no horizontal overflow; 81/62/22 all transformed+moved; z20 (over-hero) = 0 |
| Reduced motion | 0 transformed figures (FRAGMENTS_REDUCED_STATIC.png) |
| Readability (pair-overlap probe) | ~50–60 same-layer pairs of ~1200 possible (5%) at mean 32–41% box depth, 5–16 momentarily >60% box-covered, all rotating (no static piles); ~40 cross-layer overlaps = intended depth system |

## 3. The field now reads as

- **Inner orbit** — the few large prints (25–30% of scene width), circulating closest to the hero, bowed around the mount by the guard.
- **Mid orbit** — most of the archive (30–40%), the populous band.
- **Outer / deep field** — smaller quieter prints reaching the corners (max 52% vs corner 60%); occasional edge grazing by design.

Three layers coexisting: background typography (untouched) → archive field → hero anchor.

## 4. Artifacts (scripts/_evi/, regenerated from the refined build)

- FRAGMENTS_REST / EARLY / ACTIVE / REORGANIZED.png (t=0/3/12/30s)
- FRAGMENTS_MOTION_REVIEW.gif (15s, 8fps, 121 frames)
- FRAGMENTS_TABLET_ACTIVE.png, FRAGMENTS_MOBILE_ACTIVE.png
- FRAGMENTS_REDUCED_STATIC.png (0 transformed)
- qa-census.json (0 violations), motion-proof-00..09.png (2s apart, 20s span)
- New: dbg-pair-overlap.mjs (readability probe)

## 5. Files changed this pass

- `src/components/fragments.tsx` — ladder radius assignment + per-fragment phase/direction/wobble hash jitter.
- `scripts/fragments-distribution-probe.mjs` — added radius histogram + angular histogram (cluster evidence).

## 6. Remaining subjective concerns (for human eyes — vision unavailable)

1. Same-layer momentary overlaps (5–16 pairs >60% box-covered at any instant) — all rotating, cross-layer ones are the intended depth system; box-level metric overstates visual overlap (mount margins, captions). Watch the GIF for actual readability.
2. The bow still nudges inner prints around the hero at diagonal arcs — reads as circulation, but confirm no "wall" feel.
3. Deep-field corner reach: max 52% of scene width vs 60% corner — the field deliberately breathes inside the canvas; check the corners aren't too empty on your screen.
4. `distribution_reference.jpg` was NOT found in the repo — pass followed your textual spec. Re-drop the image if you want the composition compared against it directly.
