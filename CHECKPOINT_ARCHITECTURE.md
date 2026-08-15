# SkillzHQ V1 — Architecture Checkpoint (Canonical Structure)

Date: 2026-08-14

## Canonical information architecture (approved user directive)

```
HERO (01)                     — untouched, locked (CHECKPOINT_HERO2.md)
WHAT I DO (02)                — BOOKABLE DISCIPLINES ONLY
  DJ                          — Clubs · Festivals · Private Events · Gigs (locked, CHECKPOINT_DJ.md)
  TURNtablism                 — Performance · Scratch Craft · Workshops (locked, CHECKPOINT_TURNTABLISM.md)
  SPEAKING                    — Talks · Panels · Keynotes · Conversations (locked, CHECKPOINT_SPEAKING.md)
  PRODUCER                    — Beats · Scratch Hooks · Mixing & Mastering · Collaboration (Phase 1 slot)
BOOK SKILLZ (03)              — category picker → inquiry (same expanding grammar, no backend yet)
WATCH / LISTEN (04)           — media archive destination (YouTube/Spotify panels, links pending)
CULTURE                       — separate documentary/credibility layer, NOT a booking discipline (not built)
```

## Reclassification (nothing deleted)

- **EVENTS / FESTIVALS** — no longer top-level What I Do rows; contexts within DJ (`Clubs · Festivals · Private Events · Gigs`). Source material: `Website Assets\Events\` untouched.
- **WORKSHOPS** — application/service within TURNtablism (`Performance · Scratch Craft · Workshops`); also a booking category (`Turntablism / Workshop`).
- **CULTURE** — documentary/credibility layer (legacy, hip-hop, community, Each One Teach One); separated from booking. Not built this pass.
- **Old yellow/black Workshops/Speaking taxonomy** — no longer rendered as a competing What I Do taxonomy. Source material preserved:
  - `src/components/workshops-speaking.tsx` — kept on disk, unimported (archive: workshops list, speaking topics, Each One Teach One film reference)
  - `public/assets/each-one-teach-one-hero.mp4` / `-poster.png` — untouched; `site.workshopsVideo` config retained

## Files modified

- `src/components/what-i-do.tsx` — discipline list → DJ / Turntablism / Speaking / Producer; new canonical descriptors; DJ + Turntablism chapters untouched
- `src/components/booking.tsx` — BOOK SKILLZ row becomes the expanding trigger (same 0fr→1fr grammar); category set → DJ / Turntablism / Workshop / Speaking / Producer; existing selection + mailto/coming-online CTA retained; index 04→03
- `src/app/page.tsx` — WorkshopsSpeaking section removed from render
- `src/components/watch-listen.tsx` — index 05→04
- `src/components/header.tsx` / `footer.tsx` — nav links updated (Workshops/Speaking link removed; footer gains Book Skillz)
- `src/lib/site.ts` — `bookingCategories` → 4 canonical categories

## Files intentionally NOT modified

- `CHECKPOINT_DJ.md`, `CHECKPOINT_TURNTABLISM.md`, `CHECKPOINT_HERO2.md` — locked-chapter docs intact
- All locked visual assets (hashes verified before/after, unchanged):
  - `dj-lethal-skillz-collage.png` `6dbd55214d91859b88deb320cc590ffc`
  - `cells/{craft,room,warm,history}.{webm,mp4}` (8 files, hashes as deployed 2026-08-14)
  - `turntablism-living-loop.mp4` `b3cc102132574be5ea7c556ff56d585c` / `.webm` `355757ee5ef4bf552ad02aff553d8fd6` / poster `df734f32cb1df2847d6f1f6d0b9ff87a`
  - `skillz-hero2-master.png` `4a0389d5004aa828d17f6f90372f70e9`, `skillz-cutout.png`, `sky-0104.jpg`
  - `each-one-teach-one-hero.mp4` / `-poster.png` (archived material)
- No Git initialized (project non-Git by policy; checkpoint docs are the convention)

## QA evidence (2026-08-14, localhost :3000)

- Architecture: What I Do renders exactly 4 rows — DJ, Turntablism, Speaking, Producer (verified DOM + text); no Events/Festivals/Workshops/Culture rows; nav = What I Do / Watch Listen / Book Skillz
- 1440×900: DJ expand → 4 living cells playing; motion proof (1s apart screenshots) 163,564 changed px all inside video rects, 0 elsewhere; served master md5 `6dbd55214d91859b88deb320cc590ffc`; collapse pauses all 4, single-click reopen resumes; Turntablism expand plays (`turntablism-living-loop.mp4`), collapse pauses; Book Skillz expands to DJ / Turntablism / Workshop / Speaking / Producer; overflowX 0
- 1024×768: 4 rows, DJ expand → all 4 playing (2s settle), booking expands, overflowX 0
- 390×844: 4 rows, DJ expand → all 4 playing, booking expands, overflowX 0
- Typecheck `npx tsc --noEmit` clean; `npm run build` clean (static prerender); console zero errors
- Note: playback settles within ~2s of the expand click (play() resolution + 700ms grid transition); sampling sooner can read paused — deterministic cycle verified: collapse → paused, click → playing

## Future scope (NOT built — per directive)

- Speaking chapter content (from evidence, later)
- Producer Phase 1 content (mine Claude/Obsidian + Music HQ archive later; no discography dump)
- Culture documentary layer
- Watch / Listen full media library (destinations exist: `site.media.youtube` / `site.media.spotify`, null until supplied)
- Booking inquiry forms per category (DJ / Turntablism-Workshop / Speaking / Producer field sets defined in directive); no email/backend infra; `bookingEmail` remains null → "coming online" state
