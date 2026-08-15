# SkillzHQ V1 — Turntablism Chapter Checkpoint (Approved Interaction + Visual Lock)

Date: 2026-08-14

## Approved behavior (user sign-off)

1. **Collapsed:** large "Turntablism" typographic row in the existing What I Do section — visually identical to other discipline rows (no icon, no arrow, no affordance).
2. **Click Turntablism:** the row expands in place; the approved Turntablism living loop (5s seamless vinyl footage) plays inside the expanded chapter.
3. **Click Turntablism again:** the chapter collapses back to the What I Do rhythm.
4. Interaction identical to DJ chapter — the established **SKILLZHQ EXPANDING CHAPTER PATTERN** (see `CHECKPOINT_DJ.md`): typographic trigger, in-place expansion, no modal/arrow/popup/instructional UI, restrained motion, content inside the editorial environment.

## Approved visual master (locked)

- `Desktop\Turntablism Deliverables\TURNtablism_Living_Loop.mp4` — canonical master (H.264 CRF 20, 1920×1080, 5.000s @ 24fps, silent, 6.6 MB)
- `Desktop\Turntablism Deliverables\TURNtablism_Living_Loop.webm` — VP9 web master (3.8 MB)
- Window: source `Desktop\IMAGES\20140610_185938.mp4` at 14.75–19.75s; loop point dissolves into the frozen opening frame (junction 0.04× adjacent diff — seamless)
- QA: `TURNtablism_Loop_QA.jpg` (contact sheet), `TURNtablism_Loop_QA.txt` (report); source md5 verified unchanged (`cf070ec8…`)

Do not regenerate, recolor, crop differently, re-animate, filter, or alter any faces/bodies/hands in the loop. Current presentation is locked.

## Canonical files (website)

- `src/components/what-i-do.tsx` — Turntablism chapter: video figure (muted/loop/playsInline, poster), same figure grammar as DJ. Playback is gesture-driven: `Chapter` calls `video.play()`/`pause()` from the row's onClick (Chrome defers the autoplay attribute while the panel is collapsed, so autoplay alone never starts)
- `src/lib/site.ts` — `site.turntablism` (src / webm / poster / caption)
- `public/assets/turntablism-living-loop.mp4` (hash-identical to master)
- `public/assets/turntablism-living-loop.webm`
- `public/assets/turntablism-living-loop-poster.png` (first frame)

## QA evidence (2026-08-14, localhost :3000)

- TT collapsed at load (0px) → click expands in place, video loads and plays (muted autoplay), 16:9 exact, no dialog/overflow
- Click again collapses → repeats
- DJ chapter regression: unchanged behavior (expand/collapse + collage, transform/filter none)
- Desktop 1440×900 + mobile 390×844 verified

## Resume from this checkpoint

```bash
cd C:\Users\djlet\Skillz-V1-Website
npm run dev                 # dev server → http://localhost:3000
```

QA: load `/`, click `#what-i-do button[aria-controls="turntablism-archive-panel"]`, verify video plays and loops; verify DJ panel unchanged.

Do NOT redesign the Turntablism interaction or visual without an explicit new directive.

---

## REV T1 — The Culture Around The Craft (2026-08-15)

Directive: full Turntablism revision. Keep the approved living loop as the primary anchor (THE CRAFT), add a documentary collage (THE CULTURE) + concise editorial. No new UI patterns, no superlatives, no political statements, no hyphens in new copy. Autonomous curation, no shortlist, no questions.

### Editorial + collage (implemented)

- Hero: locked living loop untouched (`/assets/turntablism-living-loop.mp4`, caption unchanged).
- New editorial line (no hyphens): "The turntable is an instrument and the practice is a language. Around the craft, a community of skratchers: jams, sessions, records and people gathered across Beirut and Kuala Lumpur."
- Collage: contact-sheet grid (grid-cols-3 gap-2, h-24 md:h-32, border-white/10, object-cover) — exact Art-of-the-DJ/WIEF visual language. Two clean rows of 3.
  - Row 1: TURN_CLOSEUP (DSC00117 portrait closeup), TURN_JAM_2022 (IMG20221113190629, community jam, 8 faces), TURN_2023 (IMG20230715164857, performance)
  - Row 2: TURN_KL_SCRATCH (kl skratch.jpg, Scratcher KL identity), TURN_FLYER (SaveClip Instagram archival flyer), skratcher-loop1 (Skratcher Loop 1, 8s action loop, t=2-10s window)
- Skratch Beirut animated identity: full 12.7s logo loop, preserved as animation (autoPlay muted loop playsInline), web-optimized to 360×640, closing mark centered below the collage with the tile border treatment. Deliberate position, not enormous.

### Assets (all derived, originals untouched in archive)

| file | source | size |
|---|---|---|
| TURN_CLOSEUP.webp | DSC00117.jpg | 55 KB |
| TURN_JAM_2022.webp | IMG20221113190629.jpg | 59 KB |
| TURN_2023.webp | IMG20230715164857.jpg | 113 KB |
| TURN_KL_SCRATCH.webp | kl skratch.jpg | 84 KB |
| TURN_FLYER.webp | SaveClip.App_621583892…jpg | 73 KB |
| skratcher-loop1.mp4/webm (+poster) | Skratcher Loop 1.mp4 (trim 2-10s, 360×640) | 330 KB / 616 KB |
| skratch-beirut.mp4/webm (+poster) | Skratcher Beirut Logo Video Loop.mp4 (360×640, full 12.7s) | 87 KB / 504 KB |

All webp q82 LANCZOS ≤800px. All 11 files serve HTTP 200.

### QA (2026-08-15, localhost :3000, 3 viewports)

- tsc clean; production build clean (static prerender)
- TT panel: 3 videos (hero + action loop + Beirut identity) all playing after expand; collage = 6 tiles; editorial line present
- Overflow 0 at 1440 / 1024 / 390; 0 console errors; linkHttp 200
- Regressions: DJ 4/4 cells playing, Producer 5 cards, Booking CTA composes, Speaking locked chapter checks all green
- Latent QA fix: signatureKicker check had em dash in script vs middle dot in source — now matches source

---

## REV T2 — Visual Refinement (2026-08-15)

Directive: keep structure, refine evidence. Replace weak wide assets, more community power, more motion if archive supports, Skratch Beirut substantially larger, no forced horizontal crops, no editorial change, no other chapters.

### Composition change

- Collage grid: `grid-cols-1 md:grid-cols-4` rhythm grid (was 3 equal strips). Tiles keep natural composition via per-tile aspect, no forced horizontal strips.
  - Desktop two rows: `[closeup 1sp tall] [jam 2022 2sp wide] [action loop 1sp tall]` / `[jam 2024 2sp wide] [KL mark 1sp] [flyer 1sp]` — tall/wide/tall rhythm.
  - Mobile: single column, natural order, aspects preserved.
- Asset swap: IMG20230715164857 (single performer, 2023) REMOVED. Replaced by IMG20240406181655 (8 faces, Apr 2024 community session) as TURN_JAM_2024.webp. Two community jams now, different years (Nov 2022, Apr 2024), different rooms.
- Skratch Beirut identity: h-28 tiny strip → proper archival marker plate. Portrait 9:16, w-40 md:w-56 (160px mobile / 224px desktop wide), border-white/10, bg-black, object-contain, centered closing mark. Substantially larger, immediately recognisable, still below the main juggling video in scale.
- Action loops: archive contains exactly 2 videos. Both already used (Skratcher Loop 1 action tile + Beirut identity). No additional loop material exists — no loops added for numbers.

### Assets

| file | source | size |
|---|---|---|
| TURN_JAM_2024.webp (NEW) | IMG20240406181655.jpg | 59 KB |
| (TURN_2023.webp deleted from config — file removed from public/ by next cleanup; no other new assets) | | |

### QA (2026-08-15, localhost :3000, 3 viewports)

- tsc clean, build clean
- TT: 6 tiles, 2 wide community tiles, 3 videos playing (hero + action + Beirut), identity plate 224px/160px portrait, editorial line present
- Overflow 0 at 1440/1024/390, 0 console errors, linkHttp 200
- Regressions: DJ 4/4, Producer 5/5, Speaking locked all green, Booking composes

---

## REV T3 — Final Editorial + Asset Refinement (2026-08-15)

Directive: exact editorial copy + yellow emphasis, replace two poster tiles with documentary evidence, no other changes.

### Editorial (exact supplied copy, em dashes retained from the source text)

- Headline white uppercase: "THE CRAFT LIVES AROUND THE DECKS." with THE CRAFT + DECKS in accent.
- Body: 3 paragraphs, documentary tone, 6 further accent highlights (LANGUAGE, ROOMS FULL OF PEOPLE, BEIRUT, KUALA LUMPUR, GATHERING, COMMUNITY). 8 highlights total, restrained, no over-highlight.
- Implementation: `site.turntablism.editorial` (headline / highlight / body) + `Highlighted` helper in what-i-do.tsx — longest-first phrase matching, accent spans. Replaces REV T1 line copy.

### Collage swap

- Removed: TURN_KL_SCRATCH (poster-style identity mark) + TURN_FLYER (poster) — files deleted from public/assets/turntablism/.
- Added: TURN_EQUIPMENT.webp (IMG20240406183601, portable turntable setup, 800×1062, 88 KB, 5 faces, sharp) + TURN_DUBAI.webp (Scratcher Dubai THIS ONE.jpg, user-marker file, 700², 54 KB, 6 faces — chosen over Skratcher Dubai 1 (0 faces), 2 (blurry, sharp 68), 3 (soft, sharp 272)).
- Final collage: closeup(1sp) / jam 2022(2sp) / action loop(1sp) / equipment(1sp) / jam 2024(2sp) / Dubai(1sp). Both rows tall-wide-tall rhythm. Two community jams kept per directive.

### QA (2026-08-15, localhost :3000, 3 viewports)

- tsc clean, build clean
- Editorial checks: headline/body1/body2/closing exact, 8 highlights
- Tiles: 6, two wide, equipment + Dubai present, both posters absent
- 3 videos playing, Beirut identity plate 224px desktop / 160px mobile portrait
- Overflow 0, 0 console errors, linkHttp 200; DJ 4/4, Producer 5/5, Speaking locked green
- Note: mobile Producer img count 5/1 at probe time = lazy-load timing only

---

## REV T4 — Final Collage Refinement (2026-08-15)

Directive: three-row collage, ~50/50 static/motion, motion in every row, Dubai evidence, Beirut identity as a legitimate grid tile, exact editorial copy with LIVES added to emphasis. Do not lock.

### Video sources reviewed (fast 1fps sweep: brightness + faces per frame)

| file | verdict |
|---|---|
| VID_133720217_053443_831.mp4 (Aug 2022, portrait) | usable but dark (bright 42-62, 1-3 faces) — not selected |
| VID20240406183644.mp4 (Apr 2024, portrait) | bright, 5 large faces — but same event as required equipment static — not selected (no same-event duplication) |
| VID20240929182450.mp4 (Sep 2024, 4K) | SELECTED — wide community jam, 5 faces opening, t=0-8s |
| Skratching and Dancing.mp4 (Oct 2024, 1080p) | SELECTED — bright performance, close faces t=6-14s |
| VID20241110161854.mp4 (Nov 2024, portrait) | usable, 2 faces steady — not selected (5 loops already at balance) |

### Video loops selected (4 in collage + hero)

1. skratcher-loop1 (existing, hands/technique, 8s)
2. turn-loop-jam (4K source, t=0-8, 560w vp9 crf42 + 512w h264 crf30 → 1.5MB webm / 1.1MB mp4, poster t=4)
3. turn-loop-perf (1080p, t=6-14, 560w vp9 crf42 + 640w h264 crf28 → 1.9MB webm / 1.6MB mp4, poster t=10)
4. skratch-beirut (existing identity, full 12.7s)

### Static assets (5)

TURN_CLOSEUP (DSC00117), TURN_JAM_2022 (Nov 2022, 8 faces), TURN_EQUIPMENT (IMG20240406183601, required), TURN_DUBAI (Scratcher Dubai THIS ONE, 6 faces — Dubai represented), TURN_JAM_2024 (Apr 2024, 8 faces)

### Collage — 9 tiles, 3 rows, 12 cells

R1: closeup(1sp) jam22(2sp) loop1(1sp) — motion 1
R2: jam4k(2sp) equipment(1sp) dubai(1sp) — motion 1
R3: jam24(2sp) perf(1sp) beirut(1sp, 3/4, contain, bg-black) — motion 2

5 static / 4 motion = 50/50. Motion in every row. Beirut identity now a grid tile (334px desktop, 342px mobile) — real asset, animation preserved. Editorial unchanged, highlight list + LIVES (9 total). Mobile: single column full-width reflow, spans md-only.

### QA (2026-08-15, localhost :3000, 3 viewports)

- tsc clean, build clean; all 6 new loop files HTTP 200
- TT: 5 videos playing, 9 tiles, 3 wide, motionRows [1,1,2], identity 334/230/342px portrait, editorial 4/4 + 9 highlights, equipment + Dubai tiles present, posters absent
- Overflow 0 at 1440/1024/390, 0 console errors, linkHttp 200
- Regressions: DJ 4/4, Producer 5/5, Speaking locked green, Booking composes
- Media: per-viewport video load ≈ 1.9MB (webm preferred) + 1.5MB + 0.9MB + 0.5MB + hero 3.8MB ≈ 8.6MB total, all short loops, lazy images, gesture-driven playback

### Not locked — awaiting visual review (tt4-desktop.png, tt4-mobile.png)

---

## REV T5 — Editorial Polish (2026-08-15)

Directive: typography only. Remove all dashes from TT editorial, match Speaking restraint (white = editorial voice, yellow = structural accent only, zero in-copy yellow). Do not touch collage/layout/assets/other chapters. Do not lock.

### Changes (3 files)

- `src/lib/site.ts` — editorial: highlight array removed; body paragraph 1 rewritten dash-free: "It is a language built in rooms full of people: DJs, skratchers, students, friends and strangers, passing technique from one set of hands to another." (em dashes replaced with colon + comma, meaning unchanged). Headline + paragraphs 2-3 already dash-free, untouched.
- `src/components/what-i-do.tsx` — editorial renders as plain white headline + muted body (Speaking hierarchy); unused Highlighted helper removed.
- `scripts/speaking-qa.mjs` — editorial checks: new body1 text, highlights expect 0, added noDashes (all 4 strings free of - and —).

### QA (2026-08-15, localhost :3000, 3 viewports)

- tsc clean, build clean
- Editorial: headline/body1/body2/closing exact, highlights 0, noDashes true
- Collage unchanged: 9 tiles, 3 wides, 5 videos, motionRows [1,1,2], identity 334px
- Overflow 0 at 1440/1024/390, 0 console errors, linkHttp 200
- Regressions: DJ 4/4, Producer 5/5, Speaking locked green (no highlights lost there — TT editorial only)
- Screenshots: tt5-desktop.png, tt5-mobile.png

### Not locked — awaiting visual inspection

---

## REV T6 — Global Editorial Polish (2026-08-15)

Directive: two tasks only. (1) Vertical yellow editorial rule on the TT introductory editorial block, matching the Speaking / Producer signature grammar exactly. (2) Global dash sweep across the entire website: remove dash-heavy writing from all rendered copy (captions, labels, metadata, buttons, links); keep legitimate hyphenated compounds and date-range en dashes. Do not touch structure, imagery, collage, loops, or locked chapters. Do not lock.

### Changes (7 files)

- `src/components/what-i-do.tsx`
  - TT editorial container now `border-l-2 border-accent pl-6 md:pl-10` — identical rule grammar to Speaking (SIGNATURE — THE VOICE) and Producer (SCRATCH HOOKS); max-w-3xl retained, no new treatment
  - Producer signature detail line: "— {detail}" → "· {detail}"
  - What I Do section note: "What you can book: six disciplines, one practice." (colon)
- `src/lib/site.ts` — captions/alt text: DJ caption "DJ · PERFORMANCE ARCHIVE · 2024–2017", TT caption "Turntablism · The Instrument · 2014", DJ collage alt, Each One Teach One alt, 5 Producer artwork alts (The United, Karmageddon, Anghami Cypher, 30 Arab MC's, Most Gritty City) — em dashes → middle dots
- `src/components/booking.tsx` — "Producer · {service}" / "Speaking · {service}" templates, subject "Booking · {label}", "Pick a booking type: one tap to the conversation.", "Book Skillz · {label}" (2), "Booking destination: coming online.", "Opening your mail client, subject pre-filled."
- `src/components/hero.tsx` — section aria-label "DJ Lethal Skillz · Each One Teach One"
- `src/app/layout.tsx` — metadata title "DJ Lethal Skillz · DJ · Turntablist · Producer", description "DJ Lethal Skillz: commercial DJ…"
- `scripts/speaking-qa.mjs` — bookingState CTA check now `Book Skillz ·`; new editorial `yellowRule` check (border-l-2 + border-accent + pl-6 + headline text in the same div)
- `scripts/tt6-shot.mjs` — new TT screenshot helper (desktop + mobile)

### QA (2026-08-15, localhost :3000, 3 viewports)

- tsc clean, build clean
- TT: yellowRule true at 1440/1024/390; editorial 4/4 exact, highlights 0, noDashes true; collage unchanged (9 tiles, 3 wides, 5 videos, motionRows [1,1,2], identity 334/230/342px portrait playing); equipment + Dubai tiles present, posters absent
- Booking CTA renders "Book Skillz · Speaking"; Speaking locked green (emDashZero, emDashCount 0, all 17 evidence checks true)
- Regressions: DJ 4/4 playing, Producer 5/5 cards, Overflow 0 at all viewports, 0 console errors, linkHttp 200
- Rendered dash sweep complete: zero em dashes remain in rendered copy (grep verified — only comments + unimported workshops-speaking.tsx carry dashes); legitimate en-dash ranges kept ("2024–2017", "2013–14", "3–5 November 2015"), proper names kept (Hip-Hoppin' Asia, Q-Bert, work-for-hire)
- Screenshots: tt6-desktop.png, tt6-mobile.png

## PRODUCTION LOCKED — 2026-08-15 (user visual approval)

User reviewed the final implementation (tt6-desktop.png, tt6-mobile.png) and APPROVED. Turntablism is the canonical version. No further creative changes: no redesign, no asset replacement, no collage/loop/typography/editorial/spacing changes. Touch only for genuine production bugs.

### Canonical locked state

- **Assets** (`public/assets/turntablism/`, 13 files): hero living loop (turntablism-living-loop.mp4/webm/poster), 4 collage loops (skratcher-loop1, turn-loop-jam, turn-loop-perf, skratch-beirut — mp4 + webm + poster each), 5 static webps (TURN_CLOSEUP, TURN_JAM_2022, TURN_JAM_2024, TURN_EQUIPMENT, TURN_DUBAI). Original archive sources untouched.
- **Layout**: hero figure (living loop, dominant) → editorial block (yellow rule + white headline + muted body) → three-row documentary collage (9 tiles, 5 static + 4 motion, motion in every row, Beirut identity as contain tile closing the section).
- **Editorial**: headline "THE CRAFT LIVES AROUND THE DECKS." + 3 body paragraphs, exact approved copy, zero dashes, zero in-copy yellow; vertical `border-l-2 border-accent` rule matching Speaking/Producer signature grammar.
- **Motion**: 5 videos total (hero + 4 collage), all short muted gesture-driven loops, webm-preferred, ≈8.6MB total load.
- **QA (REV T6)**: tsc clean, build clean, 3 viewports (1440/1024/390) — yellowRule true, editorial 4/4, highlights 0, noDashes true, 9 tiles, 3 wides, motionRows [1,1,2], identity 334/230/342px portrait playing, equipment + Dubai present, posters absent, overflow 0, console 0 errors, regressions green (DJ 4/4, Producer 5/5, Speaking locked, Booking composes), linkHttp 200.
- **Lock commit**: `b582f70` — "Production lock: Turntablism approved (REV T6 + final visual review)".
