# SkillzHQ GitHub Production Release v1.1.0 — GH Pages Path-Compatible

## What Changed from v1.0.0

Deploy-time document-relative path transform. Same files, same content, same build —
**no source changes, no rebuild required** when the custom domain attaches.

| v1.0.0 | v1.1.0 |
|---|---|
| `/assets/...` (root-absolute) | `assets/...` (document-relative) |
| `/_next/...` | `_next/...` |
| `/favicon.ico` | `favicon.ico` |
| Works only at domain root | Works at BOTH `/SkillzHQ/` AND root |

Transform script: `v1.0.0/make-gh-pages-release.mjs` (rewrites quoted path strings
only — 357 refs across index.html, 404.html, _not-found.html, 4 JS chunks).

## Why Relative (not basePath)

- `basePath: "/SkillzHQ/"` bakes the project path into the artifact — when the
  custom domain attaches, GitHub Pages serves the repo at the apex root and every
  `/SkillzHQ/...` URL 404s. Requires a rebuild.
- Relative paths resolve against the document at any depth: `/SkillzHQ/assets/x`
  under the project URL, `/assets/x` at the apex root. **One artifact, both paths,
  no second build.**
- Safety verified by static audit of `out/`:
  - All asset refs are quoted string literals resolved against the document base
    (`import.meta.url` uses: 0; chunk loader resolves via `currentScript` src)
  - CSS contains zero `url()` asset refs; fonts already chunk-relative
  - Chunk-path invariant in the RSC loader checks the RESOLVED URL (`"/_next/"` substring still present after resolution) — unaffected

## Unchanged (deliberately)

- Absolute production URLs in JSON-LD / Open Graph / Twitter (`https://djlethalskillz.com/...`) — 4 occurrences verified intact; quote-boundary matching excluded them
- `robots.txt`, `sitemap.xml` — absolute production URLs, correct for SEO
- Booking form POST to `/api/enquiry` — absolute, by design: the Cloudflare Worker
  lives on `djlethalskillz.com` only. Form is functional on the custom domain;
  under `djlethalskillz.github.io/SkillzHQ/` it 404s (no worker there) and the form
  shows its error state. Inherent to a backend endpoint, not a path issue.
- `.txt` RSC flight artifacts — inert, never fetched (verified in browser test)
- Inert `next.svg`/`vercel.svg`/etc. placeholders auto-copied by Next

## Verification (browser, both mounts)

Full headless-Chrome suite run at `http://localhost:3998/` (root) AND
`http://localhost:3998/SkillzHQ/` (project path), 1440/1024/390 viewports:

- All 128 assets resolve HTTP 200 at BOTH mounts (0 404s, 0 console errors)
- 10/10 video loops playing; 82 fragments; YouTube `SQRaL2YMKSI` + Spotify embeds
- Navigation, accordion, overflow — pass at both mounts

## Known Edge Case

A 404 at a deep path (`/SkillzHQ/some/nested/missing`) serves `404.html` from that
depth — relative refs would resolve one level deeper and 404. The site has no deep
URLs; only manually-typed garbage paths hit this. Cosmetic, documented, not fixed.

## Source / Lineage

- Source: `C:\Users\djlet\SkillzHQ-GitHub-Release-v1.0.0` (pristine root-absolute export, preserved untouched)
- Origin: exact copy of verified `out/` from `C:\Users\djlet\Skillz-V1-Website` (Next.js 16.3.0 static export, 2026-08-16)
- File count: 178 (177 site files + this manifest); 89.7 MB; 128 assets, all referenced, 0 unused, 0 missing

## Deployment Target

`https://djlethalskillz.github.io/SkillzHQ/` now and `https://djlethalskillz.com/`
later — same artifact, no rebuild.

## Status

PRE-PUSH / NOT YET DEPLOYED — ready for GitHub Pages when you choose.
