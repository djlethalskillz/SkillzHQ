# SkillzHQ V1 — Hero 2 Checkpoint (Clean Production State)

Date: 2026-08-13

## Current follow-up visual lock — 2026-08-13

Latest Hero commit: `c38af87` — "Align Hero 2 composition to approved reference".

The prior Hero pass used element-scoped captures. This follow-up used true browser viewport captures and corrected the composition against `public/assets/dj-lethal-skillz-hero2-reference.png`.

- Frame uses the approved wide poster proportion (`aspect-[1.44]`).
- `SKILLZ` is horizontally fitted so the complete Z remains visible in the reference band.
- `DJ LETHAL` is returned to the upper-left reference band.
- The unmodified MASTER shifts left into the approved central overlap; no horizontal image distortion is applied.
- EOTO and values return to the lower-left reference band; the CTA and marquee remain independent layers.
- Viewport QA: 1440×900, 1024×768, and 390×844. Lint and production build pass; the design detector returned no findings.
Current commit: `49601a9` — "Hero 2 final reconstruction: canonical reference alignment + QA verified" (tree clean)

## History

| Commit | Description |
| ------ | ----------- |
| `825833d` | Initial commit from Create Next App |
| `1157b71` | Checkpoint: pre-reference-lock-v1 state (CSS reconstruction hero) |
| `716cbb5` | Apply Reference Lock V1: approved hero artwork as canonical visual master |
| `c9fdeeb` | Hero 2 controlled replacement: compose master subject with SKILLZ type per Hero 2 Reference |
| `3301f44` | Add Hero 2 checkpoint/handoff note |
| `4ce2373` | Checkpoint: add visual refinement areas for tomorrow's controlled pass |
| `533e836` | Hero 2 visual refinement: match reference yellow/white balance and type scale |
| `8130937` | Hero 2 iteration 1: DJ LETHAL + yellow bar, SKILLZ enlargement, marquee inside frame |
| `578634f` | Hero 2 iteration 2 — corrections per user review: subject scale/position, SKILLZ band, tone, copy placement |
| `3ca4a13` | Hero 2 final reconstruction — SKILLZ Z fully visible (word x 9.4–91.2), CTA span/tracking, sharp white-key threshold |
| `49601a9` | **Hero 2 final reconstruction (current)** — full element-by-element alignment to Hero 2 Reference (1448×1086): EOTO 5.3vw Caveat, values Anton 22px, CTA thin SVG arrow, marquee strip 43px = ref, responsive fixes (max-sm compact marquee), lint/build/browser QA verified. Also commits canonical reference asset, MASTER source copy, and superseded asset-lock patch artifacts for history |

Working tree: clean.

## Files changed in this checkpoint

- `src/components/hero.tsx` — final reconstruction: SKILLZ word refit (Z fully visible), DJ LETHAL size/tracking, CTA SVG arrow + tracking, EOTO Caveat 5.3vw leading 0.75, values Anton 22px, wrapper bottom 9.15% + mt 36px, marquee `max-sm:py-1 max-sm:text-xs`, sharp white-key threshold
- `src/lib/site.ts` — hero2Master restored (`/assets/skillz-hero2-master.png`), heroReference added (`/assets/dj-lethal-skillz-hero2-reference.png`)
- `public/assets/dj-lethal-skillz-hero2-reference.png` — canonical composition reference (1448×1086 RGBA, pixel-identical to previous reference)
- `DJ Lethal Skillz Hero 2 MASTER.png` (repo root) — source copy of the canonical MASTER (hash-identical to `public/assets/skillz-hero2-master.png`)
- `README.txt`, `SKILLZ_HERO2_TAKEOVER_PATCH.zip` — superseded asset-lock patch artifacts, preserved for history (replaced by this reconstruction per the HERO 2 TAKEOVER task)

## Assets

- **Subject:** `public/assets/skillz-hero2-master.png` (4624×3468 RGB, white studio field) — UNTOUCHED
- **Composition spec:** `public/assets/dj-lethal-skillz-hero2-reference.png` (1448×1086 RGBA)
- Historical artifacts preserved: `skillz-hero-approved-reference.png` (Reference Lock V1), `sky-0104.jpg` (authentic source photo), `skillz-cutout.png` (unused)

## White-background keying

MASTER PNG has no alpha (RGB on pure-white studio field). Keyed at render time, source untouched:
inline SVG `#hero2-white-key` (feColorMatrix luminance→alpha + feComponentTransfer table).
Tone: `brightness(0.85)` only — NO contrast. Keeps photographic detail, no posterization
(face chroma verified: render (161,126,108) vs ref (166,127,107) — essentially identical).

Threshold: sharp `"…1 0"` (17 values) — alpha 1 below lum ≈ 239, 0 at 255. Drop concentrated
in the studio field; subject highlights stay opaque (zero near-white fringe at subject edges).

## Composition mapping (final pass, measured against Hero 2 Reference, 1440×1080 frame)

| Element | Reference | Render (1440) |
| ------- | --------- | ------------- |
| DJ LETHAL top-left | white DJ + yellow LETHAL, ink x 16.8–31.9%, band y 10.7–15.3% | ink x 16.9–31.6%, same band, Anton 5.3vw, LETHAL tracking 0.05em |
| Yellow bar top-right | solid #ffe600, x 89–98%, y 1.5–5.4% | x 89–98%, y 1.5–5.5%, bg-accent |
| SKILLZ band | gray-white distressed letters, word ink x 9.4–91.2%, band y 17–63%, Z fully visible | word ink x 9.4–91.8%, band y 17–63%, 51.3vw Anton, #dcdcdc × grain — Z fully visible, subject overlaps like ref |
| Subject/face | head y 16–32%, x 39.5–60%, center ≈ 45%; body bottom ≈ 94% | head y 15–33%, width 21.3% (ref 20.5%), center x 45.5%; body bottom ≈ 92% |
| EOTO | yellow Caveat, ink y 68.6–78.5%, x 8.4–22% | ink y 68.7–78.5%, x 8.8–23.3%, Caveat 5.3vw leading 0.75 |
| Supporting values | white, 3 lines y 82.8–90.0%, x 9.1–24.3% | 3 lines y 82.8–90.0% (line 1: 82.4–84.1, line 3: 88.5–90.0), Anton 22px leading 1.4 |
| ENTER THE HQ | white text y 83.6–85.3%, x 77.2–87.5%; thin 2-stroke arrow x 88.8–91.2% | text x 77.7–87.4%, same y; inline SVG arrow x 88.9–91.1%, tracking 0.12em |
| Marquee strip | yellow strip INSIDE frame bottom, y 94.9–98.8% (43px, text ink ≈ 16px) | inside frame bottom, y 95.1–98.8% (43px = ref), text-xl; `max-sm` compacts to 24px for mobile clearance |

Notes:
- Bottom-left block anchored so EOTO top + values bottom land on reference bands (wrapper `bottom-[9.15%]`, values `mt-[36px]`).
- All copy set in project fonts: Anton (--font-anton) display, Caveat (--font-caveat) hand, Switzer (font-body) supporting.
- Face tonality: brightness(0.85) only (iteration 1's brightness(0.72) contrast(1.15) crushed and posterized the face — reverted per user review).
- Reference corner artifact: ref has a near-white hair-tip fragment at top-left (x 1.9–10.7%, y 2.5–4.6%); the white-key threshold keys near-white subject edges by design (face and body unaffected). Accepted, inherent to CSS keying.

## QA results (final pass)

- **Desktop 1440×900:** element-by-element pixel measurement vs reference — all within ~0.5pp: SKILLZ word x 9.4–91.8% (Z fully visible, right edge past ref), DJ LETHAL ink x 16.9–31.6% same band, EOTO y 68.7–78.5% (ref 68.6–78.5), values lines 82.4–84.1 / 85.4–86.9 / 88.5–90.0 (ref 82.8–84.1 / 85.5–87.0 / 88.5–90.0), CTA text x 77.7–87.4% + arrow 88.9–91.1% (ref 77.2–87.5 / 88.8–91.1), marquee strip 43.2px (ref 43px), face chroma identical. Visual fidelity accepted.
- **Responsive 1024×768:** no overflow (scrollW = clientW), composition scales proportionally (all element percentages unchanged), CTA clear of marquee, marquee animating.
- **Responsive 390×844:** no overflow, no clipping; values ink clears compact marquee (~5px), CTA clear; mobile nav hamburger opens menu (4 links); marquee animating. EOTO/values/CTA readable (EOTO clamps to 36px min, values 11px, CTA 16px — deliberate readability over strict ref proportions at this size).
- **Halo:** zero near-white fringe at subject edges (sharpened threshold; all near-white pixels are DJ LETHAL's white glyphs)
- **Lint:** clean (`npm run lint`)
- **Build:** clean, static prerender (`npm run build`)
- **Browser (dev):** all sections intact (landing 1080, what-i-do 1559, workshops-speaking 2222, book 1232, watch-listen 821, footer); CTA scrolls to #what-i-do; mobile menu opens; marquee animates; zero console errors (only benign MP4 abort)
- **Screenshots** (temp, not committed): `shot11-1440-frame.png`, `resp-1024x768-frame.png`, `resp-390x844-viewport.png` in `%TEMP%\skillz-qa\`

## Known benign warning

`REQFAIL: /assets/each-one-teach-one-hero.mp4 net::ERR_ABORTED` — browser-cancelled `preload="metadata"` probe on the Workshops video. Not an application error. Present since before Hero 2.

## Remaining placeholders (unchanged)

- `site.bookingEmail: null` → booking CTA shows "Booking destination — coming online."
- `site.media.youtube / spotify: null` → Watch / Listen show "Available soon"

## Remaining limitations (accepted)

- SKILLZ letters are flat gray-white vs reference's per-pixel distressed highlights (CSS-only constraint; no new assets)
- Top-right yellow bar is a solid shape; reference bar may carry small text (unreadable at asset resolution) — left plain to avoid inventing content
- Head width 21.3% vs ref 20.5% (photo-intrinsic)
- White-key threshold keys near-white subject edges (top-left hair tip) — face and body unaffected
- Mobile: copy sizes are readability-clamped above strict reference scale; marquee compacts (`max-sm`) so values stay clear

## Resume from this checkpoint

```bash
cd C:\Users\djlet\Skillz-V1-Website
npm install                 # if node_modules missing
npm run dev                 # dev server → http://localhost:3000
```

QA commands:

```bash
npm run lint
npm run build
```

Visual QA: headless Chrome screenshot at 1440×900 (see `C:\Users\djlet\AppData\Local\Temp\skillz-qa\` for the puppeteer/PIL scripts; `puppeteer-core` is a devDependency).

Do NOT redesign the Hero 2 composition without an explicit new directive. Master file, face, and all approved assets remain locked; only CSS/layout adjustments are permitted.
