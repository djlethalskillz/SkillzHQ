# FRAGMENTS — QA RECORD (Implementation Pass 1)

Date: 2026-08-15
Status: IMPLEMENTED — NOT PRODUCTION LOCKED. Awaiting human visual review.

## Build & type

- `npx tsc --noEmit` — PASS (0 errors)
- `npm run build` — PASS, `/` + `/_not-found` prerendered static

## QA matrix (scripts/fragments-qa.mjs, headless Chrome, dev server localhost:3000)

| Viewport | Horizontal overflow | Images in chapter | Loaded after scroll | Console errors | Fragments asset failures |
|----------|--------------------|--------------------|--------------------|----------------|--------------------------|
| 1440×900  | 0 px               | 26                 | 26                 | 0              | 0                        |
| 1024×768  | 0 px               | 26                 | 26                 | 0              | 0                        |
| 390×844   | 0 px               | 26                 | 26                 | 0              | 0                        |

- Identity labels rendered (10 spot-checked): WITH GRANDMASTER FLASH, DJ Q-BERT, TONY TOUCH · APOLLO · VINROC, JAPAN DMC CHAMPIONS, KEITH SHOCKLEE, GRAND MASTER SUESIDE, DJ CUT KILLER, ONE NATION UNDER A GROOVE, RED BULL 3STYLE, UFO RADIO — ALL PASS
- Key assets confirmed present: hero, qbert, tt-apollo-vinroc, one-nation, ufo-badge — PASS
- Lazy loading verified: 26/26 load when scrolled into view

## Regression

- `scripts/speaking-qa.mjs` — PASS: speaking chapter state intact, bookingState rows intact, CTA "Book Skillz · Speaking", 0 errors, HTTP 200
- Existing chapters untouched: zero edits to DJ / Turntablism / Speaking / Producer / Hero / Booking source. Only shared file touched: `src/components/what-i-do.tsx` (import + one new discipline row)

## Screenshots (full page, expanded chapter)

- `scripts/_evi/frag-qa-desktop.png` (1440×900)
- `scripts/_evi/frag-qa-tablet.png` (1024×768)
- `scripts/_evi/frag-qa-mobile.png` (390×844)

## Notes / limitations

1. Hero caption is "WITH GRANDMASTER FLASH" only — no date/venue (none exists in evidence). No placeholder shown, per directive.
2. UFO badge displays as "UFO RADIO · Badge" — the 1993 reading withheld pending user sign-off (FRAGMENTS_FACTUAL_VERIFICATION_v1.md Q11).
3. Two heavy originals shipped byte-identical: `fragments-studio-2012.jpg` (1.8 MB, 3264×2448) and `fragments-ufo-badge.png` (2.9 MB, 1477×1065). No downscaling performed (archival honesty). Flag for possible size review later.
4. No motion added beyond the existing chapter-expand grammar (deliberate; editorial purpose only).
5. Header navigation unchanged — Fragments is the 5th row inside What I Do (site pattern).
6. Images use object-cover plates (system convention); faces near frame edges may crop — flagged for visual review.

## Items requiring human visual review

1. Hero plate: kicker "THE ARCHIVE" + "WITH GRANDMASTER FLASH" at display scale, center-aligned
2. Museum label typography (white display names, muted context) on PEOPLE band
3. Band rhythm: spans/spacing of PEOPLE (17), PLACES (2), MOMENTS (5), EVIDENCE (1)
4. Mobile: 2-column PEOPLE plates + labels at 390px
5. object-cover crops on portrait plates (rob-swift, primecuts, breaking, one-nation)
6. Overall archival character vs the four locked chapters (must feel related, distinct)
7. Copy: editorial statement "A LIFE INSIDE THE CULTURE." + closing line "SELECTED FROM THE SKILLZ ARCHIVE"
