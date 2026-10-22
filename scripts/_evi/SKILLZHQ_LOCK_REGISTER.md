# SKILLZHQ — LOCK REGISTER (per chapter)

Status: **APPROVED by the owner 2026-10-22** (FINISH brief §2). In force from that date.
Supersedes: the v1.2.1 whole-site lock (`RELEASE_MANIFEST.md` on `archive-deploy-artifacts` @ `fe056b2`, site `b7b3337`, 2026-08-16), which is **RETIRED** (owner, 2026-10-21; see "Retired" at the end).
Baseline: the 2026-10-22 autopilot release (`release/2026-10-22-autopilot`, on top of `3b7d8a6`; rollback target `3b7d8a6`). Hashes are taken at its code-final commit `49af940`; the release's last commit changes only this register and its hash lists. Earlier baselines (`0d32e39`, `35eabb5`) keep their hash lists alongside for comparison.

This register restates each chapter's own lock record against the current code. It does not replace those records (`CHECKPOINT_*.md`, `HERO2_VISUAL_LOCK_SPEC.md`, `scripts/_evi/*_PRODUCTION_LOCK.md`); where they disagree, the chapter's record plus any amendment below wins. Lock dates: Hero 2026-08-13, DJ and Architecture 2026-08-14, Turntablism and Speaking 2026-08-15, Producer, Fragments, Book Skillz and Watch/Listen 2026-08-16.

- **Hashes:** SHA-256 of each file's content at the baseline commit, read from git objects, not a working tree. Full list: `scripts/_evi/lock-hashes-49af940.csv`; asset-folder aggregates: `scripts/_evi/lock-hashes-49af940-folders.csv`. A folder's aggregate is the SHA-256 of its sorted `<sha256>  <path>` lines (one per file, newline-terminated), so adding, removing or changing any file in it changes the aggregate.
- **How to check:** `node scripts/_evi/lock-hashes.mjs . <commit> <out.csv>`, then diff against the CSVs.
- **How to change a locked chapter:** a genuine production bug (BUG), or a written owner amendment added to the table below (what, why, date, files, what it overrides). Then re-issue the hashes from the shipped commit.

## Owner lock amendments (recorded 2026-10-22, decided by the owner 2026-10-21)

Source: the owner's brief "SKILLZHQ — COMBINED RELEASE: LANE A + LANE B", §1. Each amendment was **approved by the owner**. A1–A7 shipped in `0d32e39` (2026-10-22) and are the live state.

| # | What | Why (owner) | Files | Overrides |
|---|---|---|---|---|
| A1 | Fallback booking address shown on `/book` and in the booking form's error message ("…please try again, or email bookings@djlethalskillz.com.") | Owner confirmed the `bookings@` mailbox works (2026-10-21). Gives visitors a route when delivery fails | `src/components/booking.tsx` (error message), `src/app/book/page.tsx`, `src/lib/epk.ts` | **L7** "no email in UI"; finding G-01 HOLD |
| A2 | `/book` EPK-style page around the unchanged `<Booking />`, including the credentials (Perform/Teach/Speak) columns, the TEACH column and the Receipts strip, verbatim from the EPK with page citations | Owner adopts Lane B `f02b9ad` | `src/app/book/page.tsx`, `src/lib/epk.ts` | Doctrine conflict G-02 ("People before logos / never sell"); B-03 |
| A3 | Booking CTAs → `/book`: header button, header menu "03 Book Skillz", footer nav + button, booking-film CTA | Owner adopts Lane B `2982c61`; the rest extend it so every site-wide Book link matches | `src/components/header.tsx`, `src/components/footer.tsx`, `src/components/booking-film.tsx` | **L7** primary booking path (the form stays at `/#book` too) |
| A4 | Film pages `/life-archive/01`–`10`, one `VideoObject` each; the `/life-archive` ItemList lists them by URL | Owner adopts Lane B `54b1e76` and Lane A `6aaca7b` | `src/app/life-archive/[number]/*`, `src/lib/life-archive.ts`, `src/app/life-archive/page.tsx`, `src/components/spatial-archive.tsx`, `src/components/life-archive.tsx` | None (Life Archive is open) |
| A5 | Archive → Fragments link at the archive close | Owner adopts Lane A `5c3dd52` | `src/components/life-archive.tsx` | None (archive side only; Fragments L6 untouched) |
| A6 | Booking form error message text changed (part of A1) | As A1 | `src/components/booking.tsx` | **L7** copy |
| A7 | Generated sitemap (`src/app/sitemap.ts`) replaces `public/sitemap.xml` | Owner adopts Lane B `733bb91`; generated to avoid hand-kept dates | `src/app/sitemap.ts` | None |
| A8 | The two in-chapter "Book Skillz" buttons (Speaking and Producer) go to `/book` instead of `#book` | Owner decision 2026-10-22 (FINISH brief §3a): every Book link on the site leads to the same page | `src/components/what-i-do.tsx` (href and `next/link` only) | L4 Speaking, L5 Producer (chapter CTA target) |
| A9 | `fetchPriority="high"` on the Hero vinyl-logo backdrop `<img>` (the mobile LCP element). `src`, `srcSet` (512w/1024w) and `sizes` unchanged; no visual change | Owner decision 2026-10-22 (FINISH brief §3b; finding D-03) | `src/components/hero.tsx` (one attribute) | L1 Hero (composition untouched; loading hint only) |
| A10 | Internal files moved out of `public/` (no longer served) into `archive/` with the same relative path: `assets/sky-0104.jpg` (11 MB, unused hero source photo), `assets/{bandcamp,producer,speaking}/ASSET_LOG.md`, `assets/speaking/SPEAKING_LOOP_QA.txt`. `site.heroBackground` (never read) set to `null` so it no longer points at a served path. Nothing deleted | Owner decision 2026-10-22 (FINISH brief §3d; SEO F07, finding D-05) | `archive/assets/**`, `src/lib/site.ts`, `src/lib/bandcamp.ts` (comment), `docs/MAINTAINING.md` | L1 Hero (historical artifact `sky-0104.jpg`, preserved per `CHECKPOINT_HERO2.md:49`, now unserved); L4 Speaking and L5 Producer asset folders (records only) |
| A11 | The home canonical moves from the root layout's metadata to the home page's own metadata, so the 404 page no longer inherits a canonical pointing at `/`. Head metadata only; home's rendered canonical is unchanged | Owner decision 2026-10-22 (AUTOPILOT brief §A5; finding E-06) | `src/app/layout.tsx` (metadata `alternates` removed), `src/app/page.tsx` (`metadata` export added) | Shared DNA `layout.tsx` and `page.tsx` (no font, shell or chapter-order change) |
| A12 | "Download EPK" links (header and `/book`) point to a web copy of the EPK, `public/assets/DJ_LETHAL_SKILLZ_EPK-web.pdf` (1,453,666 bytes; images re-encoded at 200 dpi, pages/text/vectors untouched); the `/book` label reads "PDF, 1.4 MB". The original PDF stays in the repo, unchanged | Owner decision 2026-10-22 (AUTOPILOT brief §A3; finding G-05) | `public/assets/DJ_LETHAL_SKILLZ_EPK-web.pdf` (new), `src/lib/epk.ts` (`EPK_PDF`), `src/app/book/page.tsx` (label), `src/components/header.tsx`, `scripts/epk-web-copy.py` | **L7** `/book` (link target and size label only) |
| A13 | Per-route share images (1200×630 JPEG) for home, `/book` and `/bandcamp` in `public/assets/og/`, rendered from the built site itself (reduced motion, site menu hidden): home = the Hero 2 composition, `/book` = its title block, `/bandcamp` = its title and the first record on the deck. No new media. Film pages keep their own stills; `/life-archive` and the 404 keep the site default | Owner decision 2026-10-22 (AUTOPILOT brief §A4; finding E-04) | `public/assets/og/*.jpg` (new), `src/app/page.tsx`, `src/app/book/page.tsx`, `src/app/bandcamp/page.tsx` (head metadata only) | L1 Hero (its image reused as a share card, unchanged on the page); **L7** `/book` (head metadata only) |

Amendments A8–A10 were approved by the owner on 2026-10-22 for the follow-up release (FINISH brief §3) and shipped in `80a7b4d` (2026-10-22). A11 onward: AUTOPILOT brief (2026-10-22), shipped with `release/2026-10-22-autopilot`.

## Allowed-change classes (used below)

| Class | Meaning |
|---|---|
| **BUG** | A genuine production bug fix, smallest possible diff, with a release record |
| **AMEND** | Any other change needs a written owner lock amendment first (date, scope, files) |
| **CSS** | CSS/layout-only adjustments are allowed (L1 only, per `CHECKPOINT_HERO2.md:125`) |
| **CONTENT** | Additive content following a documented procedure (e.g. MAINTAINING.md "Add a Life Archive film") |
| **OPEN** | Not locked; normal review and QA |
| **CONFIG** | Configuration that must mirror the live service settings; changes only to match what the owner has set in the service dashboard |

## Locked chapters

| # | Chapter | Files (SHA-256 at `49af940`) | Assets (folder aggregate) | Allowed changes |
|---|---|---|---|---|
| L1 | **Hero 2** (`#landing`) | `src/components/hero.tsx` `3bae04b6033e9bca2f36e9f70cf739ec0c3ee87b4cbb5b575bec9fd9478274cc` | `public/assets/` top level (57 files incl. the EPK and its web copy: `hero2-*`, `skillz-vinyl-logo-backdrop-*`, OG image, logos) `b0a9856aad0b5bee5fa95ec0849e055b95060287f7143269e7305fa20abe9c50` | BUG, CSS. AMEND for composition, layers, text or assets. Amended: A9 (`fetchPriority` on the backdrop) |
| L2 | **DJ** chapter + expanding-chapter pattern | `src/components/what-i-do.tsx` `a4d1ee268bdac6cc5a1a9a7a3ef4be7f91fcac03851cbe9285e5467955fe077b` (shared with L3–L6 entry); `src/lib/site.ts` `518842fd2544f33bde55a8eb33c68652ddf8a33822aacba40e7355c5f7237c86` (`djArchive`) | `public/assets/cells/` `ccdeb930a3a6bf3d2a2b8d16a3c243be1a891e5a1c80b01801e360a5ed9110c6` | BUG; AMEND |
| L3 | **Turntablism** | `what-i-do.tsx`, `site.ts` (as above) | `public/assets/turntablism/` `1c2c975c744180ac41994d51dcf8f9cdaeb49db91762152b440a95c51c792401` | BUG only (`CHECKPOINT_TURNTABLISM.md:238`); AMEND |
| L4 | **Speaking** | `what-i-do.tsx`, `site.ts` (as above) | `public/assets/speaking/` `966829716da1661a09e18fb6ba90df9cd5db1fdaa2b0095659d986ed987d3944` | BUG only (`CHECKPOINT_SPEAKING.md:326-327`) plus the explicit prohibitions at `:173`; AMEND |
| L5 | **Producer** | `what-i-do.tsx`, `site.ts` (as above) | `public/assets/producer/` `ce9f1fda918f17a6f5b739603b3612d75e092abfefeea9eeba34004d59e6cc33` | BUG only (`PRODUCER_PRODUCTION_LOCK.md:60-61`); AMEND |
| L6 | **Fragments** | `src/components/fragments.tsx` `c036383fc75cc16def2ad17c7285ba606d4766d7970abeca167881119711d799`; `src/lib/fragments.ts` `37486e98c074f8abb278bfd05193b1561556a1f73ad089e81065db4dc8dfd826` | `public/assets/fragments/` `6f1277232af969ea4f3d6a92226042b444732a1516085805ef5234c7911c7809` | No visual, motion, typography, distribution, asset or layout change (`FRAGMENTS_PRODUCTION_LOCK.md:82-84`); BUG; AMEND |
| L7 | **Book Skillz** + enquiry delivery | `src/components/booking.tsx` `c48f4a3418049781ad8d76b133ef01b130785e752d3d66fc8633c08cdfaa9d60`; `site.ts` (`bookingBriefs`, `enquiryEndpoint`); `workers/enquiry.js` `dc3700f3ce812ec72c95689e7c95e4d37c0657123c2e8340628b2247749c6aa4`; `wrangler.toml` `47088284882e6a7e66e0ef37ab39ce897cf1017099392ff756039ec7b282e475`; **after A2: `src/app/book/page.tsx`, `src/lib/epk.ts`** | — | UI, UX, copy, accordion, structure: AMEND (`BOOKSKILLZ_PRODUCTION_LOCK.md:75-76`). Worker code: BUG. **`wrangler.toml`: CONFIG** (observability, vars and routes mirror the Cloudflare dashboard; first used by `08e843b`). **Amended 2026-10-21 by the owner: A1, A2, A3, A6** (fallback email on `/book` + form error; `/book` page; CTAs → `/book`; error copy). `/book` EPK copy: change only when the EPK changes |
| L8 | **Watch / Listen** | `src/components/watch-listen.tsx` `bed9427ba6a49b4e3af50f642bf0df5417a3ce4a8311c6cd12d3e4322777c475`; `src/components/spotify-facade.tsx` `17e2b214f34b869c6c3e47bea396b03cbb4b63d9c229f8bcebcc620feb387146` | — | No UI, UX, copy or structure change (`WATCHLISTEN_PRODUCTION_LOCK.md:63-64`); BUG; AMEND |
| L11 | **Anthem + Follow Skillz** | `src/components/vinyl-player.tsx` `3f1b976966c14759a2ec4ffbddd7cad980dad4da0ceaede51f6f810e4d823400`; `src/lib/anthem-audio.tsx` `428c7afec4ac7c05dc04d7fb87262142e7f27166f12fd769b58025521e09af6b`; footer socials in `src/components/footer.tsx` `34818e95d16ae3d98936fcb013c90fe84ca6bfde16051759867d254ccd4eaa08` | — | BUG + AMEND (approved with this register 2026-10-22; the lock evidence is commit `b710714` "feat: lock Anthem and Follow Skillz experience", 2026-08-27; this row is its lock record) |

## Shared DNA (a change here is a change to every locked chapter)

| File | SHA-256 at `49af940` | Allowed changes |
|---|---|---|
| `src/app/globals.css` | `e11a24739bfca2cb3435e5198d45748ba302dc1b0c3afdc570ee2794d7225bda` | Existing rules: AMEND. New, scoped rules for OPEN pages: OPEN, reviewed for leakage. Switzer font (C-01): AMEND |
| `src/app/layout.tsx` | `85b52de2f1fd52cada7500e5452717fff61d8f3084900101390b4b4a14c946e4` | Fonts and shell (header, footer, grain, progress): AMEND. **JSON-LD metadata: OPEN** (owner decision 2026-10-21: E-02 is outside the font lock) |
| `src/components/reveal.tsx` | `edb8cfeb614b1c5b513d927fafaa89d0362defd07ab35c2ea34eedad09e8cb5f` | AMEND |
| `src/components/film-facade.tsx` | `4d2b73c98b3eca655db8de04adec7135d6610e0ddb578d162da806b1bae9f94e` | AMEND (used by L8, the booking film and the archive) |
| `src/components/section-header.tsx` | `6b19e3e0410f9f4e9dc5957fcea6a85c052bde39611f62af2c07ab17ca329142` | AMEND (every chapter slate) |
| `src/lib/site.ts` | `518842fd2544f33bde55a8eb33c68652ddf8a33822aacba40e7355c5f7237c86` | Per key: the owning chapter's class applies. Keys used only by OPEN pages: OPEN |
| `src/app/page.tsx` | `01c7dd43774c1b687aaff6f216745593d5090459d6dfe762219a8f5473f9bec0` | Chapter order (L9 IA directive): AMEND |

## Open (not locked): normal review + QA

| Area | Files (SHA-256 in the CSV) | Notes |
|---|---|---|
| Life Archive | `src/app/life-archive/page.tsx`, `src/components/life-archive.tsx`, `spatial-archive.tsx`, `archive-record.tsx`; `public/assets/life-archive/` `b333e91458537af5b106e2ea474d3376c253c1aa7702f0402b540eb20227cce2` | CONTENT per MAINTAINING.md; provenance values only when sourced (the audit's YouTube provenance candidates are not approved) |
| Bandcamp (PROTOTYPE) | `src/app/bandcamp/page.tsx`, `bandcamp-catalogue.tsx`, `bandcamp-releases.tsx`, `bandcamp.module.css`, `src/lib/bandcamp.ts`; `public/assets/bandcamp/` `b90102c8cd7246cd6d992e6ee1e5b713e3185e46cc23d31656af95e89bb77491` | DRAFT wording (A-04) is an owner decision |
| Booking film (campaign) | `src/components/booking-film.tsx` `5a5038f81e16d83e38ccf40f3b85196d4a34616490efbbf5d926682a01065518` | Due to be removed after Nov–Dec 2026 (G-04) |
| Newsletter | `src/components/frequency.tsx`, `workers/frequency.js` `508bf4ee5264e75cd496a93aaec9d014da5a0866b38c0ccb8bca34fd4ca0fb48` | Shares the L7 Worker and `wrangler.toml` |
| Navigation and misc. | `header.tsx`, `next-stop.tsx`, `not-found.tsx`, `arabic-inscription.tsx`, `src/app/sitemap.ts` (generated at build), `public/robots.txt` `cbf3bf9f…` | Header change = every page |
| Unimported | `hero-figure.tsx`, `anthem-bridge.tsx`, `workshops-speaking.tsx` (kept on disk by L9) | Deleting needs owner approval |

## Change-controlled infrastructure

| File | SHA-256 at `49af940` | Rule |
|---|---|---|
| `.github/workflows/deploy.yml` | `0127d756c88a2742cffaf31dcaaaf14f9c326eb25920b6401aaaffcd0f145515` | Any push to `main`/`master` deploys. Changes need owner approval |
| `next.config.ts` | `fbccc3b492f6631e93c15f6c9afc20416c9f26af07635d3ebbb8094b5eee2c68` | `output: "export"` is what keeps the site serverless |
| `package.json` | `4291052c71213c41a288d9d8ffbad64084194dc9b014a31254fddbd54619a5b7` | Dependency bumps: build + full QA. `next` and `eslint-config-next` 16.3.8 since the 2026-10-22 follow-up release; `npm run dev` binds to 127.0.0.1 |

## Retired

- **L10, the v1.2.1 whole-site lock** (`RELEASE_MANIFEST.md` on `archive-deploy-artifacts` @ `fe056b2`, site `b7b3337`, 2026-08-16, "PRODUCTION LOCKED — no further changes"): **RETIRED** by the owner 2026-10-21; retirement approved with this register 2026-10-22. That manifest is a historical release record only; this register is the lock reference. (The manifest itself was not edited: it lives on a deploy-artifacts branch.)
- The Claude memory note `skillzhq-production-lock-v121.md`: replaced 2026-10-22 by `skillzhq-production-state.md`, which points here.
