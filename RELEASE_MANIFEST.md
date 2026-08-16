# SkillzHQ GitHub Production Release v1.2.1 — Mobile DJ Lethal Color Micro-Fix

## What Changed from v1.2.0

One visual change, mobile only. `src/components/header.tsx:41` — the "DJ Lethal"
header span now uses the existing site yellow token below 640px:

- `text-muted` → `text-accent sm:text-muted`
- `--color-accent: #ffe600` (globals.css:7) — the same yellow used across the
  marquee/accent elements. No new color introduced.
- `sm:text-muted` restores the v1.2.0 color at ≥640px — desktop/tablet byte-
  identical rendering to v1.2.0.
- Font (11px), tracking (0.25em), position, spacing, SKILLZ logo, hamburger
  menu, hero — untouched.

## Build / Transform

- `npm run build` clean (Next.js 16.3.0, Turbopack, static export).
- Same document-relative transform; 1 JS chunk hash changed
  (`1ol1pq9zzn5fj.js` → `2jqryovcr_r2i.js`); 0 leftovers; 4 absolute production
  URLs intact.

## Verification (browser)

| Viewport | DJ Lethal computed color | SKILLZ | Layout |
|---|---|---|---|
| 390 mobile | `rgb(255, 230, 0)` = #ffe600 accent | white, unchanged | no overflow |
| 768 tablet | `rgb(148, 148, 148)` = muted (same as v1.2.0) | white | no overflow |
| 1440 desktop | `rgb(148, 148, 148)` = muted (same as v1.2.0) | white | no overflow |

0 console errors, 0 missing assets at all viewports. Font size and letter
spacing identical (11px / 2.75px) — color is the only changed computed value.

## File Count

192 files, 89.7 MB (incl. this manifest).

## Status

## RELEASE RECORD — PRODUCTION LOCK

- **Release version:** v1.2.1
- **Site commit SHA:** `b7b3337` (deployed through GitHub Actions, run
  `31952019735` → success)
- **Deployment timestamp:** 2026-08-16 22:17 MPST (lock verification re-deploy)
- **Verification result:** PASS — 1440/1024/390 viewports: 0 console errors,
  0 HTTP failures, 0 missing assets, 0 horizontal overflow, 10/10 video loops
  playing, YouTube + Spotify embeds functional, mobile DJ Lethal visible and
  yellow (`#ffe600`), "five disciplines, one practice." present, desktop/
  tablet colors unchanged.
- **Approved changes (this release):**
  1. Mobile "DJ Lethal" header text uses existing site yellow (`--color-accent
     #ffe600`) below 640px; `sm:text-muted` preserves v1.2.0 color ≥640px.
  2. Mobile "DJ Lethal" visibility restored (v1.2.0).
  3. What I Do copy: "five disciplines, one practice." (v1.2.0).

- **Canonical state:** the deployed website at https://djlethalskillz.com is
  the canonical SkillzHQ production state.

🔒 PRODUCTION LOCKED — no further changes.
