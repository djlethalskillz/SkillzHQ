# SkillzHQ GitHub Production Release v1.2.0 — Post-Launch Mobile Correction

## What Changed from v1.1.0

Two surgical mobile fixes, source-level, no redesign (approved 2026-08-16):

1. **Mobile header wordmark** — `src/components/header.tsx:41`: removed `hidden`
   from the "DJ Lethal" span (`hidden sm:inline` → `sm:inline`). The wordmark
   was `display:none` below 640px; it now shows at every width. Desktop
   composition unchanged (`sm:inline` already applied ≥640px).
2. **What I Do copy** — `src/components/what-i-do.tsx:634`: SectionHeader note
   corrected from "six disciplines, one practice." to
   "five disciplines, one practice." — matches the actual `disciplines` array
   (DJ, Turntablism, Speaking, Producer, Fragments).

No other source changes. Reveal behavior, Producer video (intentionally hidden
below `md`), and all other chapters untouched.

## Build / Transform

- `npm run build` (Next.js 16.3.0, Turbopack, `output: "export"`) — clean,
  TypeScript passed, same single `Font` fallback warning as v1.1.0.
- Same deploy-time document-relative transform as v1.1.0, applied to the fresh
  `out/`: 357 quoted root-absolute refs rewritten across index.html, 404.html,
  _not-found.html and 4 JS chunks (chunk hashes changed per build — file
  discovery is dynamic). 0 leftovers, 4 absolute production URLs intact.

## Verification (browser, both mounts)

Dual-mount suite at `/` and `/SkillzHQ/`, 1440/1024/390 viewports, plus mobile
iPhone-UA pass at 390x844:

- "DJ Lethal" computed `display:block` in mobile header at 390px
- Section note reads "five disciplines, one practice."
- 10/10 videos playing, YouTube + Spotify embeds present, 0 broken anchors
- 0 console errors, 0 HTTP failures at any mount/viewport
- No real horizontal overflow (scrollWidth == innerWidth; the earlier
  `overflow:true` signal is a harness false positive shared with v1.1.0 —
  marquee/absolute overlays are overflow-hidden-contained by design)
- Touch: tapping the DJ row opens its panel (305.9px, 4 video cells playing)

## File Count

192 files, 89.7 MB (incl. this manifest). 128 assets, all referenced.

## Deployment Target

`https://djlethalskillz.com/` via GitHub Actions (existing pipeline, no workflow
change). Same artifact serves `https://djlethalskillz.github.io/SkillzHQ/`.

## Status

READY TO DEPLOY.
