# BANDCAMP COVER ASSET LOG — 2026-10-20 (PROTOTYPE)

Release artwork for `/bandcamp`, one file per Bandcamp release id. No generative processing, no upscaling: resize (sharp, fit cover) and WebP q82 only.

Two sources, chosen per release:
- **Owner file (720px):** the owner’s own high-res cover, used only where a side-by-side check against the cover Bandcamp shows confirmed it is the same artwork (`_records/bandcamp-prototype-2026-10-20/evidence/cover-match-sheet.png`, scores in `cover-match.mjs`). Lebanese Samurai’s local files are a different version (no Arabic title) and were not used.
- **Bandcamp (350px):** the cover image the official artist page https://djlethalskillz.bandcamp.com/ displays for that release (read 2026-10-20, one request each), kept at its native 350px.

| File | Release | Source | Size | SHA-256 (12) |
|---|---|---|---|---|
| `2676536824.webp` | ABOVE THE CLOUDS | Bandcamp artist page cover | 350×350, 24258 B | `72e7894f8831` |
| `2128095758.webp` | Karmageddon | Owner file: `C:/Knowledge/01_DJ_LETHAL_SKILLZ/KNOWLEDGE_SYSTEM/DJLS_AI_NATIVE_ARCHIVE/09_MEDIA/covers/karmageddon.jpg` | 720×720, 147350 B | `450df6cc8bfc` |
| `2247857933.webp` | New World Disorder | Owner file: `C:/Knowledge/01_DJ_LETHAL_SKILLZ/KNOWLEDGE_SYSTEM/DJLS_AI_NATIVE_ARCHIVE/09_MEDIA/covers/newworlddisorder.jpg` | 720×720, 50084 B | `133b392558ca` |
| `394386661.webp` | Iqa3 Mokhtalef (Beat Tape) | Owner file: `C:/Knowledge/01_DJ_LETHAL_SKILLZ/KNOWLEDGE_SYSTEM/DJLS_AI_NATIVE_ARCHIVE/09_MEDIA/covers/iqa3mokhtalef.jpg` | 720×720, 50576 B | `32d9bf816305` |
| `1588576850.webp` | Contemplation | Bandcamp artist page cover | 350×350, 6984 B | `5d30d7911893` |
| `2624525731.webp` | I.Elevate | Bandcamp artist page cover | 350×350, 7272 B | `7ff2a5b77776` |
| `407096157.webp` | Information Is Power | Bandcamp artist page cover | 350×350, 20126 B | `525ee2cffb3c` |
| `2962739210.webp` | Defenders Of The Culture | Owner file: `C:/Users/djlet/Downloads/Defenders of the Culture 1.png` | 720×720, 119012 B | `d8cd7026d565` |
| `3738321098.webp` | Open Letter | Bandcamp artist page cover | 350×350, 18858 B | `0732033c108d` |
| `1104826735.webp` | Squid Gamez | Bandcamp artist page cover | 350×350, 44418 B | `15ae1cd4a12a` |
| `1535809381.webp` | Trees | Bandcamp artist page cover | 350×350, 29238 B | `b205582f1513` |
| `3385092786.webp` | Hidden Dagger | Bandcamp artist page cover | 350×350, 28414 B | `7c02ac3a26ef` |
| `4194633529.webp` | The Slicer Of Darkness | Owner file: `C:/Users/djlet/Desktop/Dusty Archives/BEIRUT_HIPHOP_REEL/03_ARCHIVE_CLIPS/_production/mv3r1/photos/slicer_cover.jpg` | 720×720, 95474 B | `5b4b80eaa8c1` |
| `2412593008.webp` | Lebanese Samurai | Bandcamp artist page cover | 350×350, 44140 B | `6fec2e9932e5` |

Tone colours in `src/lib/bandcamp.ts` are sampled from the Bandcamp cover of each release (`make-covers.mjs`).
