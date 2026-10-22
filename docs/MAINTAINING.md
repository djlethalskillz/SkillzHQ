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
5. Record the still and its source in an asset register (the one cited in `src/lib/life-archive.ts` does not exist yet — create `public/assets/life-archive/ASSET_LOG.md`, or keep it outside `public/` so it isn't served).
6. Build (`npm run build`), check `/life-archive` and `/life-archive/<number>` at 375 and 1440 px, flip to the new record with the keyboard, play the film from both pages.

## Release checklist
- `npm run build`, `npx tsc --noEmit`, `npx eslint src` — 0 errors.
- No horizontal overflow at 320 / 375 / 768 / 1440.
- Keyboard: skip link first, every stop visibly focused. Reduced motion: nothing animates.
- Every site-wide Book Skillz link reaches `/book`; the form submits there and at `/#book`; the Anthem player still plays; films start only on request.
- `out/sitemap.xml` lists every route (it is generated; nothing to edit).
- The built HTML contains no `[VERIFY` or `DRAFT` text.
- Write a release record (commit, files, checks, rollback target) next to the lock records.
- After deploy: confirm the Pages deployment SHA and re-run the OPTIONS check above.
