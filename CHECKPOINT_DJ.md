# SkillzHQ V1 — DJ Chapter Checkpoint (Approved Interaction Lock)

Date: 2026-08-14

## Approved behavior (user sign-off)

1. **Collapsed:** large "DJ" typographic row in the existing What I Do section — visually identical to the other discipline rows (no icon, no arrow, no affordance of any kind).
2. **Click DJ:** the DJ row expands in place; the approved DJ archive collage appears inside the expanded chapter.
3. **Click DJ again:** the chapter collapses back to the original What I Do rhythm.
4. The DJ typography itself is the interaction trigger. The visual expansion is the feedback.

User has reviewed localhost and explicitly approved this interaction. Do not change it further.

## Canonical interaction pattern — SKILLZHQ EXPANDING CHAPTER PATTERN

Definition (established by DJ, to be reused for remaining What I Do disciplines without redesign):

1. Discipline appears as a large typographic row.
2. User clicks the discipline.
3. The row/chapter expands in place.
4. Editorial/archive content is revealed.
5. No modal layer is created.
6. No generic accordion icon is used.
7. User clicks the same discipline again.
8. Chapter collapses back into the What I Do rhythm.
9. Motion is restrained and cinematic.
10. Content remains inside the page's editorial environment.

Implementation mechanics (locked):

- Toggle: full-row `<button>` with `aria-expanded` / `aria-controls`, `onClick={() => setOpen(v => !v)}`
- Motion: `grid-template-rows 0fr → 1fr` on a `grid` wrapper, `transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,.61,.36,1)]`, inner `overflow-hidden` div
- `motion-reduce:transition-none` honored
- No JS height measurement, no scroll locking, no focus trap, no body class changes

## Rejected UI (explicit)

- modal, lightbox, popup, X close button
- yellow arrow, chevron, plus/minus, hamburger indicator
- instructional UI, "click here" affordance, tooltip, generic accordion indicator
- anything that makes the interface explain itself

## Canonical files

- `src/components/what-i-do.tsx` — chapter interaction + DJ archive figure (living collage: PNG base layer + 4 absolutely-positioned `<video>` cells at panel geometry; gesture handler plays/pauses ALL videos in panel)
- `src/lib/site.ts` — `site.djArchive` (src / alt / caption / `cells[]` with master-coord panel geometry)
- `public/assets/dj-lethal-skillz-collage.png` — deployed copy of the APPROVED ITERATION-2 MASTER (md5 `6dbd55214d91859b88deb320cc590ffc`; the narrow RMW06954 panel is replaced by the subject-aligned `Live on Radio (AFORADIO)` crop — user approved 2026-08-14). Static base layer only — videos are NEVER flattened into it.
- `public/assets/cells/{craft,room,warm,history}.{webm,mp4}` — approved living cell loops (byte-identical to `Desktop\DJ Living Collage Deliverables\cells\`, hashes verified)
- `_Claude_References/dj-lethal-skillz-collage.png` — reference copy (superseded iteration-1 rendering; fallback only)
- Original canonical visual master (preserved fallback, immutable): `Desktop\DJ Collage Deliverables\DJ IMAGES GOLLAGE.png` (1920×1080) — iteration-1 composition, never overwritten
- Approved iteration-2 master (external deliverable): `Desktop\DJ Living Collage Deliverables\DJ_LIVING_COLLAGE_ITERATION_2_MASTER.png` (md5 `6dbd55214d91859b88deb320cc590ffc`, hash-identical to deployed)

## Living cell geometry (master coords, 1920×1080)

| cell | panel | loop | asset |
|------|-------|------|-------|
| craft | 360×414 @ (1020,148) | 6s ping-pong | craft.webm/mp4 (540×620, 24fps) |
| room | 520×260 @ (40,608) | 8s ping-pong | room.webm/mp4 (780×390, 24fps) |
| warm | 240×260 @ (580,608) | 8.08s ping-pong | warm.webm/mp4 (360×390, 24fps) |
| history | 200×260 @ (1180,608) | 7.08s ping-pong | history.webm/mp4 (300×390, 24fps) |

Rendering: overlay box locks 16:9 (`maxWidth: min(100%, calc(78vh * 16 / 9))`, `aspectRatio: 16/9`); each video positioned by % of box = panel geometry; `objectFit: fill` (asset AR matches panel AR; craft 0.16% off, subpixel-invisible). Videos: muted, loop, playsInline, autoPlay, no controls, `aria-hidden`. Playback driven from the DJ click gesture (all videos in panel); collapse pauses all.

## DJ visual master rules (locked)

Do not regenerate, edit, recolor, crop differently, animate the photographs, replace, filter, or modify any faces/bodies/people in the approved collage. Current presentation (iteration-2 master) is locked. Do not re-render, re-crop, or swap panels without an explicit new directive.

## QA evidence (2026-08-14, localhost :3000)

Static integration (earlier): desktop 1440×900 expand/collapse 3 cycles pass, mobile 390×844 contained 342×192, overflowX 0, no dialog/transform/filter.

Living collage integration (approved 2026-08-14, user directive "STATIC COLLAGE + 4 SUBTLE LIVING VIDEO CELLS + 5 STATIC IMAGE CELLS"):

- 1440×900: box 1248×702; 4 video rects align to panel geometry (dx/dy/dw/dh ≤ 0.01px); all 4 play webm (paused:false, readyState 4, no controls, muted, loop, playsInline); motion proof — screenshots 1s apart: 160,421 changed px, 95.3% of video area, **0 px changed outside video rects** (5 static panels + AFORADIO + typography perfectly static); collapse pauses all 4 (`paused:[t,t,t,t]`), reopen resumes all; overflowX 0; console zero errors (HMR only)
- 1024×768: box 944×531 (height-constrained case), alignment ≤ 0.01px, all 4 playing, overflowX 0
- 390×844: box 342×192, alignment ≤ 0.003px, all 4 playing, overflowX 0; mobile motion sample: 12,048 changed px inside video rects, 0 outside box (228 px edge bleed from downscale, invisible)
- Turntablism regression: expands, video plays (paused:false, readyState 4, turntablism-living-loop.mp4)
- Evidence screenshots: `Desktop\DJ Living Collage Deliverables\qa\dj_living_t0.png`, `dj_living_t1.png`, `dj_living_mob_t0.png`, `dj_living_mob_t1.png`, `DJ_LIVING_COLLAGE_LIVE_DESKTOP.png`
- Asset: `GET /assets/cells/{craft,room,warm,history}.webm` 200; source hashes verified byte-identical to approved Deliverables\cells\

## Resume from this checkpoint

```bash
cd C:\Users\djlet\Skillz-V1-Website
npm run dev                 # dev server → http://localhost:3000
```

QA: load `/`, click `#what-i-do button[aria-controls="dj-archive-panel"]`, verify expand/collapse, verify `#dj-archive-panel img` has no transform/filter.

Do NOT redesign the DJ interaction or collage without an explicit new directive.
