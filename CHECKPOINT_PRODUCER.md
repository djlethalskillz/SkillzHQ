# SkillzHQ V1 — Producer Chapter Checkpoint (Approved Interaction + Content Lock)

Date: 2026-08-14

## Approved behavior (user sign-off)

1. **Collapsed:** large "Producer" typographic row in the existing What I Do section — identical to other discipline rows (no icon, no arrow, no affordance).
2. **Click Producer:** the row expands in place; the Producer chapter (records/archive/credits editorial, stills only) renders inside the expanded chapter.
3. **Click Producer again:** the chapter collapses back to the What I Do rhythm.
4. Interaction identical to DJ/Turntablism — the established **SKILLZHQ EXPANDING CHAPTER PATTERN** (see `CHECKPOINT_DJ.md`).
5. **Book Skillz — Producer:** Producer category in the booking section reveals 4 service rows (Beats / Scratch Hooks / Mixing & Mastering / Collaboration); CTA composes `Book Skillz — Producer — {service}`; bookingEmail is null so the CTA honestly reports "Booking destination — coming online." — no fake delivery.

## Locked editorial structure (user directive 2026-08-14, evidence in PRODUCER_INTELLIGENCE_BRIEF_v1.md)

POSITIONING → SIGNATURE (Scratch Hooks) → BUILD ACROSS BORDERS (5 evidence cards) → WHAT I BUILD (4 services) → BOOK SKILLZ. Not a discography — 5 high-density evidence objects only. No superlatives, no comparisons to other producers, documentary before marketing.

## Locked content (claims verified against vault + external sources)

1. **The United (2011)** — Role: "Remixer — DJ Lethal Skillz". Disney / Touchstone Pictures Arabic film commission, contracted work-for-hire. NO legal names anywhere (Hussein Mao Atwi never displayed). Composer: Omar Fadel. Features (stage names only, Wikipedia-verified): Omar Offendum · Deeb · Salah Edin. Film unreleased (Touchstone's first Arabic-language film).
2. **Karmageddon (2012)** — executive production, 17 tracks; released physically 2012, digitally 2022. Roster: Shadia Mansour · Omar Offendum · Narcy · Boikutt · Arabian Knightz.
3. **Anghami Cypher (2018)** — platform-commissioned (Anghami funded + distributed; Arab News 2018-06-15), curated by Big Hass, produced by Sandhill, 9 MCs (Shiboba · Omar Offendum · Bu Kolthoum · Meryem Saci · Narcy · Lowkey · Edd Abbas · Deeb · Muqata'a), scratching by DJ Lethal Skillz. Wording scrubbed of unverified "first" claim: "a platform-commissioned hip-hop cypher"; "nine MCs across the region" (cities count unverified).
4. **30 Arab MC's On One Track (2022)** — release 2022-09-17, ISRC QZNWT2247970, 26 named contributors (vault list at `02_MASTER_CATALOG/00_INDEX/DJLS_Master_Catalog_Intelligence_v1.md.txt` line 448). NEVER 2008 (earlier research discrepancy — preserved in evidence layer only). Card shows 8 strongest names + "+ 18 more contributors"; full 26-name list stays in the archive, not on the card. Official user-supplied artwork `30arabmcs.webp`.
5. **Most Gritty City (2025)** — production + scratches remix, US ↔ Arab-world bridge: Honest Resistance with Marv Won and One Be Lo (Detroit ↔ Cairo).

## Signature / services (honest framing)

Scratch Hooks = real service (custom scratches and turntable compositions); capability + signature practice described, NO unverified commercial client history. Verified scratch-hook trail: Squid Gamez 2021 (co-production, Def Ill Austria) · Defenders of the Culture 2025 · The Re-Awakening W.M.D. Tunisia · Anghami Cypher 2018 · Most Gritty City 2025.

## Canonical files (website)

- `src/components/what-i-do.tsx` — `ProducerChapter` (positioning, signature block, Build Across Borders grid md:grid-cols-12 spans 7/5/5/4/3 — Rhythm Before Symmetry, What I Build, Book Skillz CTA; stills only, lazy loading)
- `src/lib/site.ts` — `site.producer` (positioning / signature / works ×5 / services ×4), `producerServices` booking constant
- `src/components/booking.tsx` — Producer service rows (radio-dot grammar, aria-pressed) + honest CTA state
- `public/assets/producer/` — ASSET_LOG.md, theunited.webp, karmageddon.webp, anghami-cypher-group.jpg (contact sheet of 9 real frames from the actual cypher video, 1200×680, unlabeled — no fabricated faces), 30arabmcs.webp (user-supplied official artwork), mgcity.webp

All assets: deterministic conversions only (crop/scale/frame-extraction/compositing) — no generative processing, no AI upscaling, no face/body alteration.

## QA evidence (2026-08-14, localhost :3000, agent-browser CDP)

- Typecheck exit 0; `npm run build` clean (Next 16.3 Turbopack, static prerender)
- 1440×900: overflow 0, 5/5 images loaded (naturalWidth>0), expand/collapse cycle clean
- 1024×768: overflow 0, panel 2336px, 4/4 (pre-pass) → 5/5 images
- 390×844: overflow 0, panel 4187px, 5/5 images, max image width 294px contained
- Booking: service select → CTA "Book Skillz — Producer — Scratch Hooks"; CTA click → "Booking destination — coming online." (aria-live)
- Content sweep: no legal names, no 2008, no superlatives, no "first hip-hop cypher", no "nine cities", no "Salah Eddin" (correct = Salah Edin), no "Rayess Bek" (correct = Rayess Beik)
- Regressions: DJ 4/4 living cells playing (advancing currentTime), Turntablism living loop playing (currentTime 4.6), Hero 2 cutout loaded, console clean (DevTools/HMR only)
- Locked assets byte-identical: dj collage master md5 `6dbd55214d91859b88deb320cc590ffc` (matches CHECKPOINT_DJ.md), turntablism mp4 `b3cc1021…` + webm `355757ee…` (match Desktop deliverables)
- No duplicate cards (Anghami Cypher ×2 / Most Gritty City ×2 = signature trail cross-references)
- Screenshots: Desktop/producer-v2-1440.png, producer-v2-390.png

## Remaining non-blocking gaps

- Scratch Hooks commercial client history not claimable (archive thin) — capability framing locked as-is
- Full 26-name 30 Arab MC's contributor list on the card would be a credits wall — archive holds the complete list
- Booking destination (bookingEmail) still null — set in `site.ts` when a real destination exists

Do not add cards, do not dump catalog, do not reintroduce legal names or the 2008 date, do not regenerate the contact sheet from generated imagery. Current presentation is locked.
