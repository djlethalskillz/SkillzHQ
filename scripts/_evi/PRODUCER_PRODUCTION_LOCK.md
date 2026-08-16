# PRODUCER — PRODUCTION LOCK RECORD

Date: 2026-08-16
Status: **PRODUCTION LOCKED — human visual review approved**
Commit: d51e300 — lock: production lock Producer — approved journey video in opening's empty space
Canonical implementation: `src/components/what-i-do.tsx` (ProducerChapter) + `src/lib/site.ts` (producer data)

## What was locked (final V1 state)

The Producer chapter as approved (positioning, signature block, Build Across
Borders evidence grid, What I Build services, Book Skillz destination) **plus
the final asset insertion**: the approved journey loop video occupying the
opening/signature area's right-side empty space.

- **Video asset**: `public/assets/producer/skillzhq_journey_close_operation_lost_art_part2.mp4`
  (1920×1080, h264, 7.33s, ~9MB) — exact file copied from the approved
  deliverable, no re-encode, no rename, original character preserved.
- **Implementation** (the only code change in this lock): one `<video>`
  element, absolutely positioned inside the existing Signature container
  (`relative` added) — `right-0 top-1/2 -translate-y-1/2 w-[40%] h-auto`,
  `autoPlay muted loop playsInline`, no controls, `pointer-events-none`,
  `aria-hidden`, `preload="auto"`. No grid changes, no editorial element
  moved, no layout change. `hidden md:block` — mobile yields to the existing
  single-column layout (no empty right area exists there).
- **Geometry (measured live)**: desktop 543×306 = exact 16:9 (zero
  distortion), right-aligned, vertically centered in the opening block,
  103px clear of widest text, 60px clear of the works grid; tablet 377×212,
  inside the signature row; mobile hidden.
- **Audio**: the file carries an AAC track; playback is `muted` — never
  audible. No re-encode (standard lock-safe handling, same as other chapters).

## Final production QA (2026-08-16)

| Check | Result |
|---|---|
| TypeScript (`npx tsc --noEmit`) | PASS |
| Production build (`next build`) | PASS (1 pre-existing font-fallback warning) |
| Desktop 1440×900 | PASS — video playing, exact geometry, no overlap, no overflow |
| Tablet 1024×768 | PASS — video playing, inside signature row |
| Mobile 390×844 | PASS — video hidden, existing layout untouched |
| Console errors | PASS — 0 at all viewports |
| Page errors | PASS — 0 |
| Network | PASS — file serves 200/206; only benign ERR_ABORTED range cancels (Chrome media behavior) |
| Horizontal overflow | PASS — none at any viewport |
| Chapter navigation | PASS — Producer/Speaking/Fragments/Turntablism all render after switching; Fragments field intact (81/62/22) |
| Cross-chapter integrity | PASS — no other chapter, navigation, or design-system file modified |

## Files changed this lock

1. `public/assets/producer/skillzhq_journey_close_operation_lost_art_part2.mp4` (new)
2. `src/components/what-i-do.tsx` (ProducerChapter signature block: +`relative`, +video element — 14 lines)

## Notes

- Minor known item (not a bug): the hidden mobile video still downloads
  ~9MB per load (`preload="auto"`); gating preload is a one-line change if
  ever desired. Left as-is per lock discipline.
- No previously locked chapters (hero, speaking, turntablism, fragments)
  were modified by this lock.
- Chapter frozen: no further changes without explicit approval. Revisit only
  for genuine production bugs.
