# FRAGMENTS QA RECORD — v4 ONE LIVING CINEMATIC SCENE + LIVING ARCHIVE DNA TRANSPLANT

Date: 2026-08-15
Status: TECHNICAL QA PASSED — AWAITING HUMAN VISUAL REVIEW (no production lock)

## What was verified

Viewport 1440×900 (desktop, full field):

- Fragment count: 16 visible simultaneously, all mostly-visible at both t=12 and t=30
- Field span: 90% of viewport width × 78% height (t=12); 84% × 90% (t=30) — the archive fills the field, never a band or column
- Motion: 16/16 fragments displaced between t=12 and t=30; max displacement 263px (cut-killer, one-nation, beirut-streets cross the field), smaller fragments moved 10–110px — independent speeds confirmed
- Presence cycle: UFO badge opacity 0.024 at rest → 0.721 at t=12 (the document that surfaces late) — fade-out/return behaviour verified
- Captions: 12 mount captions found (16 fragments minus 4 flyers, which carry no caption per Living Archive DNA); zero clipped captions at both instants; zero captions overlapping the hero
- Hero: photo 400×400 px, dead centre (x 520 on 1440), caption printed on the mount
- No horizontal overflow, no console errors, no failed requests

Viewport 1024×768 (tablet, reduced density):

- Fragment count: 11 (5 atmosphere fragments excluded per tablet flag)
- Hero 400×400, centred
- No horizontal overflow, no console errors, no failed requests

Viewport 390×844 (mobile, one scene):

- Fragment count: 7 (qbert, tony-touch trio, keith-shocklee, jazzy-jeff, one-nation, beirut-streets, ufo-badge)
- Hero 218×218, centred (x 86 on 390)
- No horizontal overflow, no console errors, no failed requests
- Same scene — no vertical gallery, no swipe

prefers-reduced-motion (1440×900):

- 16 fragments, zero transform styles, static intentional composition (hero centre + field at rest positions, all captions visible)
- No console errors

## Living Archive DNA — verified rendered (DOM + computed styles)

| DNA element | Evidence |
| --- | --- |
| Polaroid (instant) mount | bg #F3F1EC, p-[7px] pb-[34px], deep double shadow; caption printed on mount |
| Flyer | clip-path polygon(0% 1%, 98% 0%, 100% 97%, 3% 100%), bg #242424, NO caption element |
| Pass | bg #E4E0D4, 10px punch hole, caption bottom margin |
| Jcard | bg #EFECE4, aspect 6.7/4.7, photo floats 36%, divider at 38% |
| Captions | JetBrains Mono 9px, rgba(20,20,20,0.72), uppercase, em-dash "name — context" |
| Tape | 56×20px rgba(230,220,190,0.55) on qbert (−6°), one-nation (+5°), ufo-badge (−8°) |
| Arch words | Big Shoulders: DOCUMENTED 274px white/85, DECADES 202px arch-yellow/70, SESSION 56px white/20 vertical, VINYL 79px white/15 |
| Grain + vignette | .grain overlay opacity 0.14, radial vignette transparent 42% → rgba(0,0,0,0.42) |
| Light leaks | warm radial top-left rgba(217,164,4,0.07), cool bottom-right rgba(120,150,217,0.05) |
| Arch meta line | "Selected from the Skillz archive", JetBrains Mono, bottom-right |
| Hero | Polaroid mount 400×400, caption "WITH GRANDMASTER FLASH" on the white strip |

## Screenshots (focused scene captures, viewport-clipped — not full-page)

| State | File |
| --- | --- |
| FRAGMENTS REST (t=0) | scripts/_evi/frag-v4-rest.png |
| FRAGMENTS EARLY MOTION (t=3) | scripts/_evi/frag-v4-early-motion.png |
| FRAGMENTS ACTIVE FIELD (t=12) | scripts/_evi/frag-v4-active-field.png |
| FRAGMENTS MID REORGANISATION (t=30) | scripts/_evi/frag-v4-mid-reorganisation.png |
| FRAGMENTS LATE FIELD (t=55) | scripts/_evi/frag-v4-late-field.png |
| TABLET ACTIVE FIELD (t=12) | scripts/_evi/frag-v4-tablet-active-field.png |
| MOBILE ACTIVE FIELD (t=12) | scripts/_evi/frag-v4-mobile-active-field.png |
| REDUCED MOTION STATIC | scripts/_evi/frag-v4-reduced-motion-static.png |
| MOTION GIF (t 0→10s, 720px, 6fps) | scripts/_evi/frag-v4-motion.gif |

## Deterministic capture

The engine reads `window.__FRAG_TIME__` when set (QA-only hook). Screenshots were
taken at frozen scene-times, so REST/EARLY/ACTIVE/MID/LATE are exactly reproducible.

## Evidence files

- scripts/_evi/FRAGMENTS_QA_RECORD_v4.json — per-viewport report data
- scripts/_evi/frag-v4-composition.jsonl — geometric probe (rects, captions, spans, displacement)
- scripts/frag-dna-probe.mjs — Living Archive DNA render probe (DOM + computed styles)

## Known limitations

- Visual quality (faces, caption legibility at 9px, aesthetic balance) requires human eyes; this record proves structure and behaviour, not taste
- GIF is 6fps/720px by design — a preview of the motion, not the frame-accurate experience
- Presence fade-out is smooth by construction; the LATE FIELD (t=55) state captures the sparser archive after several fragments have receded
- Font override metrics missing for `Big Shoulders` in this Next build — fallback font not generated (build warning only, rendering unaffected)
