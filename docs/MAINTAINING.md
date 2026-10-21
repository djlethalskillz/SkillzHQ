# Maintaining SkillzHQ

Short, practical notes for the owner and for AI assistants working on this site. Lock records and approvals always win over this file.

## Before changing anything
- Production locks: `scripts/_evi/*PRODUCTION_LOCK*.md`, `CHECKPOINT_*.md`, `HERO2_VISUAL_LOCK_SPEC.md`. Locked chapters (Hero, What I Do chapters, Fragments, Book Skillz + enquiry worker, Watch/Listen) change only for a genuine production bug or an owner-approved lock amendment.
- Shared files reach into locked chapters: `src/app/globals.css`, `src/app/layout.tsx` (fonts), `src/components/reveal.tsx`, `film-facade.tsx`. A change there is a change to every locked chapter.
- Any push to `main` or `master` deploys the site (`.github/workflows/deploy.yml`). The enquiry/newsletter Worker deploys separately with Wrangler (`wrangler.toml`).

## Hosting dependency (read before touching DNS)
- `/api/enquiry` (Book Skillz form) and `/api/frequency` (newsletter) are Cloudflare Worker routes. They only run while the apex `djlethalskillz.com` is **Proxied** in Cloudflare.
- GitHub Pages can only renew its certificate while the apex points **directly** at GitHub (DNS-only).
- These two pull against each other. Until the Worker has its own hostname, any DNS-only window takes both forms offline. Check after any DNS change:
  - `curl -s -o /dev/null -w "%{http_code}" -X OPTIONS https://djlethalskillz.com/api/enquiry` → `204` (Worker) — anything else means the form is down.

## Add a Life Archive film
1. Store the film's own YouTube cover as `public/assets/life-archive/<youtubeId>.webp` (1280 wide) and `<youtubeId>-640.webp`. Deterministic resize/encode only; keep the original.
2. Add an entry at the top of `CRATES` in `src/components/life-archive.tsx`: next `number`, the official title verbatim (`title` + `accent`), `youtubeId`, `start` only if the source URL has one, `year`/`place` **only** when they appear in the source material, `note` only as owner-approved first-person copy.
3. Update the page description in `src/app/life-archive/page.tsx` (it lists the titles by hand).
4. Update `public/sitemap.xml` (`/life-archive` lastmod).
5. Record the still and its source in an asset register (the one cited at `life-archive.tsx:49` does not exist yet — create `public/assets/life-archive/ASSET_LOG.md`, or keep it outside `public/` so it isn't served).
6. Build (`npm run build`), check `/life-archive` at 375 and 1440 px, flip to the new record with the keyboard, play the film.

## Release checklist
- `npm run build`, `npx tsc --noEmit`, `npx eslint src` — 0 errors.
- No horizontal overflow at 320 / 375 / 768 / 1440.
- Keyboard: skip link first, every stop visibly focused. Reduced motion: nothing animates.
- Book Skillz CTA reaches `#book`; the Anthem player still plays; films start only on request.
- Sitemap lastmod updated for changed routes.
- Write a release record (commit, files, checks, rollback target) next to the lock records.
- After deploy: confirm the Pages deployment SHA and re-run the OPTIONS check above.
