# Maintaining SkillzHQ

Short, practical notes for the owner and for AI assistants working on this site. Lock records and approvals always win over this file.

## Before changing anything
- Production locks: start with the per-chapter lock register `scripts/_evi/SKILLZHQ_LOCK_REGISTER.md` (approved 2026-10-22: files, SHA-256, allowed changes, owner amendments). It restates the chapter records `scripts/_evi/*PRODUCTION_LOCK*.md`, `CHECKPOINT_*.md` and `HERO2_VISUAL_LOCK_SPEC.md`. The v1.2.1 whole-site lock is retired. Locked chapters (Hero, What I Do chapters, Fragments, Book Skillz + enquiry worker, Watch/Listen) change only for a genuine production bug or an owner-approved lock amendment.
- Book Skillz amendment (owner, 2026-10-21): the booking path is `/book`, an EPK-style page around the unchanged `<Booking />` form. Site-wide Book links go there; the form also stays on the HQ at `/#book`. The fallback address appears on `/book` and in the form's error message only.
- `/book` copy comes from the EPK, verbatim, in `src/lib/epk.ts`, with each line's EPK page cited in a comment. Change it only when the EPK changes; never add a line that the EPK doesn't print.
- No placeholders on the live site: unknown facts are left out (UI and structured data), never shown as `[VERIFY]`, `DRAFT` or empty fields.
- Shared files reach into locked chapters: `src/app/globals.css`, `src/app/layout.tsx` (fonts), `src/components/reveal.tsx`, `film-facade.tsx`. A change there is a change to every locked chapter.
- Any push to `main` or `master` deploys the site (`.github/workflows/deploy.yml`). The enquiry/newsletter Worker deploys separately with Wrangler (`wrangler.toml`).

## Hosting dependency (read before touching DNS)
- `/api/enquiry` (Book Skillz form) and `/api/frequency` (newsletter) are Cloudflare Worker routes. They only run while the apex `djlethalskillz.com` is **Proxied** in Cloudflare.
- GitHub Pages can only renew its certificate while the apex points **directly** at GitHub (DNS-only).
- These two pull against each other. Until the Worker has its own hostname, any DNS-only window takes both forms offline. Check after any DNS change:
  - `curl -s -o /dev/null -w "%{http_code}" -X OPTIONS https://djlethalskillz.com/api/enquiry` → `204` (Worker) — anything else means the form is down.

## Add a Life Archive film
1. Store the film's own YouTube cover as `public/assets/life-archive/<youtubeId>.webp` (1280 wide) and `<youtubeId>-640.webp`. Deterministic resize/encode only; keep the original.
2. Add an entry at the top of `CRATES` in `src/lib/life-archive.ts`: next `number` (two digits), the official title verbatim (`title` + `accent`), `youtubeId`, `start` only if the source URL has one, `year`/`place` **only** when they appear in the source material, `note` only as owner-approved first-person copy.
3. That one entry also builds the film's own page `/life-archive/<number>` (title, description from the note, canonical, Open Graph image = the still, one `VideoObject`), adds it to the `/life-archive` ItemList and to `sitemap.xml` (generated at build by `src/app/sitemap.ts`, lastmod = build date). Nothing else to edit for those.
4. Update the page description in `src/app/life-archive/page.tsx` (it lists the titles by hand).
5. Record the still and its source in an asset register. The one cited in `src/lib/life-archive.ts` does not exist yet: create `archive/assets/life-archive/ASSET_LOG.md` (see "Asset records" below).
6. Build (`npm run build`), check `/life-archive` and `/life-archive/<number>` at 375 and 1440 px, flip to the new record with the keyboard, play the film from both pages.

## Asset records
- Everything in `public/` is deployed and publicly downloadable. Asset logs, QA notes and source originals that no page uses live under `archive/`, which is not served, with the same relative path they would have under `public/` (e.g. `archive/assets/speaking/ASSET_LOG.md`).
- Moved there on 2026-10-22 (lock amendment A10): `assets/{bandcamp,producer,speaking}/ASSET_LOG.md`, `assets/speaking/SPEAKING_LOOP_QA.txt` and the unused 11 MB hero source photo `assets/sky-0104.jpg`. Nothing was deleted.

## EPK PDF
- `public/assets/DJ_LETHAL_SKILLZ_EPK.pdf` is the original (5.4 MB) and is never edited. Visitors download the web copy `DJ_LETHAL_SKILLZ_EPK-web.pdf` (1.4 MB), linked from the header and `/book` (`EPK_PDF` in `src/lib/epk.ts`).
- When the EPK changes: replace the original, then rebuild the copy with `python scripts/epk-web-copy.py public/assets/DJ_LETHAL_SKILLZ_EPK.pdf public/assets/DJ_LETHAL_SKILLZ_EPK-web.pdf` (needs `pip install pymupdf pillow`), compare the pages side by side, and update the size in the `/book` "Download EPK" label.

## Share images (Open Graph)
- Home, `/book` and `/bandcamp` have their own 1200×630 share images in `public/assets/og/`, set in each page's `metadata` (`openGraph.images` and `twitter.images`). Film pages use their own still; `/life-archive` and the 404 use the site default `assets/djlethalskillz-og-image.jpg` from `src/app/layout.tsx`.
- They are screenshots of the built pages at 1200×630 with reduced motion and the site menu hidden, so they only ever show the site's own photos and type. If one of those page openings changes, re-shoot it the same way and keep the file name.
- A page's `openGraph` replaces the layout's as a whole: when you set an image on a page, repeat its title, description, url, siteName and type there.

## Fonts
- Body text uses the system sans-serif stack. `globals.css` declares Switzer first, but its remote `@import` is dropped from the built CSS, so Switzer only shows where a visitor has it installed (finding C-01).
- Switzer is not self-hosted on purpose: its licence (ITF Free Font License 2.0, §02) forbids making the font files available through a repository or publicly accessible server other than for your own site, and this GitHub repository is public. Revisit only if the repository becomes private or the fonts are added at build time outside the repository.

## Development and dependencies
- `npm run dev` listens on `127.0.0.1` only. To test from a phone on the same network, run `npx next dev --hostname 0.0.0.0` deliberately and stop it afterwards.
- `next` and `eslint-config-next` are pinned to the same exact version (16.3.8 since 2026-10-22). Bump them together, then run the full release checklist.
- `npm audit` still reports high advisories in ESLint's own dependencies (`eslint-config-next` → `fast-glob`/`micromatch`/`braces`). They are development-only and never shipped; the only offered fix is a breaking downgrade, so they are accepted until `eslint-config-next` updates them.

## Visual safety net: `npm run qa` (local only)
- `npm run qa` builds the site, serves `out/` on `localhost:4100` (`qa/serve.mjs`; `/api/*` answers 503, so nothing reaches the live forms) and runs Playwright in the installed Google Chrome, desktop (1280) and mobile (375):
  - `qa/locked-chapters.spec.ts`: a screenshot baseline for every locked chapter in the lock register: Hero, the chapter list, DJ, Turntablism, Speaking, Producer and Fragments (each opened), Book Skillz on the HQ, `/book`, Watch/Listen, and the footer (Anthem + Follow). Reduced motion, CSS animations off, videos and iframes masked.
  - `qa/axe.spec.ts`: axe-core (WCAG 2.0/2.1 A + AA) on every route, zero violations allowed.
- A failing screenshot means a locked chapter looks different. Open `test-results/` (expected, actual and diff images). If the change is an owner-approved amendment, re-baseline with `npm run qa:update` and commit the new images in `qa/locked-chapters.spec.ts-snapshots/` with the amendment; otherwise fix the change.
- Baselines are per platform (`-win32`) and were made on Windows with Chrome. On another OS or a very different Chrome version, re-baseline first on an unchanged build.
- It is not part of the deploy workflow on purpose: run it before every release.

## Release checklist
- `npm run build`, `npx tsc --noEmit`, `npx eslint src` — 0 errors.
- No horizontal overflow at 320 / 375 / 768 / 1440.
- Keyboard: skip link first, every stop visibly focused. Reduced motion: nothing animates.
- Every site-wide Book Skillz link reaches `/book`; the form submits there and at `/#book`; the Anthem player still plays; films start only on request.
- `out/sitemap.xml` lists every route (it is generated; nothing to edit).
- The built HTML contains no `[VERIFY` or `DRAFT` text.
- Write a release record (commit, files, checks, rollback target) next to the lock records.
- After deploy: confirm the Pages deployment SHA and re-run the OPTIONS check above.
