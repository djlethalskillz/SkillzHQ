# FRAGMENTS — FINAL COMPOSITION CORRECTION — QA RECORD v8

Date: 2026-08-16 | `npx tsc --noEmit` clean | `npm run build` clean (static prerender, 1 pre-existing font warning)

Scope: visual distribution (territory scatter), cropping (natural aspect), captions (date strip), one engine fix discovered during QA (hero-guard coordinate space), and the micro-typography pass (caption refinement). Design language, tiers, assets, hero, reduced-motion contract: **untouched**. No assets added or changed. No locked chapters touched.

## 1a. Micro-typography pass (addendum — same day, after composition approval)

**Font decision: KEPT.** JetBrains Mono (`font-arch-mono`, next/font, weights 400+500) — the site's established archive/museum mono: same family as the hero caption (`WITH GRANDMASTER FLASH` — untouched) and the scene corner marks. No new font, no external dependency.

One edit in `MountCaption` (feeds Instant/Pass/Jcard mounts; hero caption untouched):

| Property | Before | After |
|---|---|---|
| Size | `text-[10px] md:text-[9px]` | `text-[10.5px]` (desktop +16.7% — the "too small" fix; mobile +5% — the long-context captions already wrap on tiny mobile photos, a bigger bump adds lines) |
| Weight | 400 | 500 (`font-medium` — one step, supported by loaded weights) |
| Tracking | `0.03em` | `0.02em` (less mechanical; mono's natural width keeps the archive breathing) |
| Color | `rgba(20,20,20,0.72)` | `rgba(22,20,18,0.85)` (slightly warmer near-black, more presence, still integrated with the paper) |
| Leading | 1.3 | 1.25 (keeps 2–3-line labels compact in the strip) |
| Position | centered bottom strip | unchanged (bottom offsets already give breathing room; nothing touches the photo) |

**Editorial cleanup:** re-audited all 27 captions — zero dates anywhere in visible caption copy (only asset ids/filenames carry digits, e.g. `studio-2012`). No rewrite of the dataset needed.

**QA — caption probe (desktop/tablet/mobile):** computed size/weight/tracking/color confirmed at all viewports; short captions (DJ JAZZY JEFF, DJ NU-MARK, BEIRUT — STREET PERFORMANCE) render 1–2 lines clean; no dates in any rendered caption; reduced-motion still 0 transformed. Long combined name+context captions (DJ Q-BERT — DMC…, TONY TOUCH · APOLLO · VINROC —…) wrap 3–6 lines desktop — **pre-existing line counts from the approved composition** (the biggest wraps live on mobile, where photos are ~30 px; unchanged from the approved state). "STUDIO SESSION" flags in the probe are a measurement artifact — the jcard's float parent collapses to padding height while the absolutely-positioned caption sits centered beside the photo as designed.

## 1. What changed

### `src/lib/fragments.ts` — manifest
- **All 81 field positions rewritten** by `scripts/_evi/scatter-positions.py` (deterministic, idempotent — same layout on rerun): full-canvas wall distribution, corners/edges populated, hero breathing room empty.
  - Result: x range 3–97, y range 3–94; 3×3 cell counts [11,8,14,7,0,8,11,7,15] — corners populated, center cell 0 (the hero's room).
  - Placement order: **mobile-first** — all 22 `mobile:true` entries placed first (biggest first) so they own the 4 edge bands and are legal in BOTH viewports; desktop-only prints scatter after (zone-weighted 1.1 corners / 0.8 edges / 0.0 center, floor+fracs exact counts).
  - Verification at generation: no box edge inside hero exclusion, no mobile:true entry fails the mobile-legal check, min edge gaps 0.8–1.3% (no piles — the 0.8/0.81/0.83 gaps are adjacent staggered smalls, overlapping edges organically, never stacked).
- **Captions date-stripped**: `context: "DMC World Championship · Dubai 2007 · Judge"` → `"… · Dubai · Judge"`; the `context: "May 4, 2012"` line removed. All captions now timeless/contextual/archival. (The `studio-2012` id/filename is asset identity, not a caption; the `alt` on qbert keeps its factual date for screen readers — not visible copy.)

### `src/components/fragments.tsx` — engine
- **Territory model replaces ring/ladder motion.** Each fragment circulates a small local loop around its own scattered base position — `loopRadius = (0.05 + 0.07·hash)·sceneW · (1 − size·0.25)` (larger print → tighter loop; loops 5–12% of scene width). No shared center, no co-rotation, no visible rings.
- **Per-fragment uniqueness** (deterministic id hash): angle phase, loop radius, period 55–115 s (× tier factor: primary 1.18 / secondary 1.0 / deep 0.8), ±8% jitter, 1-in-5 reverse direction, breathing amplitude 0.2–0.3 on period 45–95 s, wobble amplitude/sign/phase.
- **Hero guard** — fixed during QA: the ray-exit exclusion test ran in a mixed coordinate space (`y·k` vs `y/k`). On desktop (k<1) that error was conservative and invisible; on mobile (k>1) the guard under-tested and a fragment's loop could graze the mount edge mid-swing (observed once: jazzy-jeff). The guard now works entirely in the orbit's own normalized space `(x, y/k)` — angle, exit distance, and box-center distance all in the same units; push-back converts back to screen px. Verified: mobile z≥20 overlaps now 0, desktop distribution unchanged.
- Mounts (Instant/Flyer/Pass/Jcard): `w-full` images render at intrinsic ratio — no forced aspect, no `object-cover` cropping. Mount adapts to the photo; people/artwork/flyer info never cropped. Zero JS, zero reflow.

## 2. QA results

| Check | Result |
|---|---|
| `tsc --noEmit` | clean |
| `npm run build` | clean |
| Distribution probe — desktop REST | quadrants 18/17/17/18; mount overlaps [] |
| Distribution probe — desktop LIVE 30 s | mount overlaps []; max center reach 844 px (corner 815); 41/81 in outer 8% band; radius spread 24.3–62.1% of scene width (histogram 30–35%:21, 40–45%:13, 35–40%:17, 45–50%:10 … — full field, no ring spike); angular bins 10 7 5 14 19 8 7 11 — max 19 « pile threshold 30 |
| Distribution probe — mobile REST | quadrants 3/3/3/5; **face overlaps z≥20: []** (guard fix — was [jazzy-jeff] pre-fix) |
| Tech probe (desktop/tablet/mobile) | 0 console/page/hydration errors, 0 failed requests, 0 broken images, no horizontal overflow; 81/62/22 all transformed + moved; z20 = 0 everywhere; heroLoaded |
| Fresh QA census (40 frames) | qa-census.json: `[[],…]` — **0 violations every frame** |
| Pixel motion proof (10 stills, 2 s apart) | field diff 8 059–8 576 samples per interval (continuous, distributed); **mount region 0 changed samples in all 9 intervals** — hero untouched by motion |
| DOM motion proof (20 s) | 81/81 moved, mean 144 px, max 308 px (frag-d-qbert2) |
| Pair-overlap probe (5 samples, 2 s apart) | 81 figs, ~52–63 overlapping pairs of 3240 (~2%), same-layer buried >60%: 1–4 per sample (target <5), same-layer mean depth 30–37% — light staggered overlap, all rotating, no static piles |
| Reduced motion | FRAGMENTS_REDUCED_STATIC.png — 0 transformed figures (contract untouched) |

## 3. The field now reads as

Dozens of individual archival moments: big prints anchor the edges and corners, mid prints hold the open field, small deep prints texture the gaps — each circulating its own slow loop at its own pace, 1-in-5 backwards, breathing. No shared center means no rings; the hero's breathing room stays empty through the whole motion cycle (pixel-proofed). Overlap is staggered and organic — two neighbours' edges touching, never a pile.

## 4. Artifacts (scripts/_evi/, regenerated from this build)

- FRAGMENTS_REST / EARLY / ACTIVE / REORGANIZED.png (t=0/3/12/30 s)
- FRAGMENTS_MOTION_REVIEW.gif (15 s, 8 fps, 121 frames)
- FRAGMENTS_TABLET_ACTIVE.png, FRAGMENTS_MOBILE_ACTIVE.png
- FRAGMENTS_REDUCED_STATIC.png (0 transformed)
- qa-census.json (0 violations), motion-proof-00..09.png (2 s apart, 20 s span)
- dbg-pair-overlap.mjs + run output in §2

## 5. Files changed this pass

- `src/lib/fragments.ts` — 81 scattered positions, caption date strip.
- `src/components/fragments.tsx` — territory circulation engine, natural-aspect mounts, hero-guard coordinate-space fix.
- `scripts/_evi/scatter-positions.py` — deterministic wall-scatter (mobile-first, zone-weighted, verify section).

## 6. For human eyes (vision unavailable — please look)

1. Watch `FRAGMENTS_MOTION_REVIEW.gif` or live localhost:3000 (Fragments tab): does every fragment read as its own object drifting alone — not travelling in a group?
2. Corners/edges: populated as intended; confirm the field doesn't feel empty in the lower-left quadrant (BL had 7 desktop vs 18 TL — corner weights were even, but mobile bigs took the top bands first).
3. Overlap rhythm: staggered edges OK? Any two fragments visually stuck together for >2 s?
4. Mobile 390 px: 22 fragments, hero dominant — confirm the balance reads right on a phone.
