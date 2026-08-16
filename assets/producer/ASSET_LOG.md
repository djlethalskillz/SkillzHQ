# PRODUCER ASSET LOG — 2026-08-14

All assets derived from verified archive sources. Originals NOT modified. Conversions deterministic (ffmpeg crop/scale/format only — no generative processing, no AI upscaling).

| Output | Source | Output dims | Format | Optimization decision |
|---|---|---|---|---|
| `karmageddon.webp` | `Obsidian/Skillz_Knowledge_System/SkillzHQ_Evidence_Pack/09_MEDIA/covers/karmageddon.jpg` (3000×3000, 1.2MB, dossier-ref `[[karmageddon.jpg]]` = Karmageddon album art) | 1200×1200 | WebP (210KB) | Downscaled 3000→1200 (2.5×), WebP lossy q≈80. Album artwork square. |
| `mgcity.webp` | `.../covers/mgcity.jpg` (2048×2048, dossier-ref `[[mgcity.jpg]]` = Most Gritty City Remix art) | 1200×1200 | WebP (244KB) | Downscaled 2048→1200, WebP. Square record art. |
| `theunited.webp` | `.../covers/theunited.jpg` (1275×1880 portrait, dossier-ref `[[theunited.jpg]]` = The United remix art) | 949×1400 | WebP (102KB) | Source format not directly viewable (converted), resized height 1880→1400, WebP. Portrait documentary object. |
| `anghami-cypher-group.jpg` | `Skillz HQ (Site)/Website Assets/The Anghami Cypher.mp4` (112MB, 477s, 1920×1080) — 9 frames @15/71/155/183/239/295/351/407/462s, 3×3 xstack contact sheet (8px gutters, lanczos, scale 1200 wide) | 1200×680 | JPEG (180KB) | Real footage only, unlabeled — no fabricated faces, no AI imagery. Frame extraction deterministic. Replaces `anghami-poster.jpg` (single-rapper still @120s, removed). |
| `30arabmcs.webp` | `Skillz HQ (Site)/_Claude_References/30arabmcs.jpg` (604×582, user-provided official artwork) | 604×582 | WebP (30KB) | No upscale (native resolution under card max width). Source original preserved in `_Claude_References/`. |

Verification note: image identity rests on vault dossier embed references (`[[filename]]`) + filename/catalog cross-match; visual check pending browser QA screenshot. 30 Arab MC's card previously typographic (no artwork file existed in archive) — official artwork supplied by user 2026-08-14. Full 26-name contributor list archived in `02_MASTER_CATALOG/00_INDEX/DJLS_Master_Catalog_Intelligence_v1.md.txt` line 448 (recoverable, not dumped on card). Anghami lineup verified via Arab News 2018-06-15 article + vault note: Shiboba · Omar Offendum · Bu Kolthoum · Meryem Saci · Narcy · Lowkey · Edd Abbas · Deeb · Muqata'a.
