# FRAGMENTS — FINAL CURATION + FIELD RECOMPOSITION — QA RECORD v5

Date: 2026-08-16 | Build: `npm run build` clean (Turbopack, 1 pre-existing font-override warning) | tsc clean

## 1. Assets added (15)
| New file | Source (Website Assets) | Category | Size | Label (policy) |
|---|---|---|---|---|
| fragments-cur-poland.jpg | EXTRA/In Poland with the 961 Underground Family.jpg | B UNIQUE | 720×540 | "961 UNDERGROUND FAMILY" (crew from filename) |
| fragments-cur-961.jpg | EXTRA/961UnderGround.jpg | C UNIQUE | 3000² → downscaled 1400² | unlabeled (graffiti) |
| fragments-cur-record-shop.jpg | EXTRA/Record Shop KL.jpg | B UNIQUE | 600×449 | "RECORD SHOP · KL" (place from filename) |
| fragments-cur-vibe-lebanon.jpg | EXTRA/Vibe Lebanon (Old Online Radio Station and DJ Workshop).jpg | C UNIQUE | 453×604 | "VIBE LEBANON — Old Online Radio Station" |
| fragments-cur-video-shoot.jpg | EXTRA/Video Shoot (KL 2 Beirut).jpg | C UNIQUE | 600×400 | "VIDEO SHOOT · KL 2 BEIRUT" |
| fragments-cur-redbull-crowd.jpg | Events/10400827_..._1128_n.jpg | B UNIQUE | 604×416 | unlabeled (event not verified) |
| fragments-cur-performance.jpg | Events/655591395_..._n.jpg | C UNIQUE | 960×640 | unlabeled |
| fragments-cur-interview.jpg | Events/646149115_..._n.jpg | C SIMILAR* | 2048×1363 | unlabeled |
| fragments-cur-secondary-a.jpg | EXTRA/507976310_..._n.jpg | C UNIQUE | 640×479 | unlabeled |
| fragments-cur-secondary-b.jpg | Events/651170777_..._n.jpg | C UNIQUE | 720×479 | unlabeled |
| fragments-cur-flyer-ace.jpg | Flyers/New folder/ACE (Zouk, Kuala Lumpur).jpg | A UNIQUE | 850×850 | unlabeled (ACE unverified) |
| fragments-cur-flyer-3styles.jpg | Flyers/New folder/Redbull 3Styles (Lebanon, Judge).jpg | A UNIQUE | 1191×1684 | unlabeled |
| fragments-cur-flyer-karmageddon.jpg | Flyers/New folder/637810171_..._n.jpg | A UNIQUE | 852×348 wide banner | unlabeled, aspect override 852/348 |
| fragments-cur-flyer-klpac.jpg | Flyers/New folder/645279694_..._n.jpg | B UNIQUE | 680×960 | unlabeled |
| fragments-cur-flyer-workshop.jpg | Flyers/New folder/638546357_..._n.jpg | B UNIQUE | 821×1200 | unlabeled |

\* 646149115 flagged SIMILAR in pool — nearest pair is FB_IMG_1492575898573 @ d=17 (not added, not rendered). Against the rendered set: **d=19**. Above near-dup threshold (14). User explicitly requested the interview/media moment.

## 2. Requested but rejected (numbers mapped to CSV/content — user descriptions authoritative)
| User request | Resolution |
|---|---|
| #52 Dragon Temple | **Already rendered** as fragments-deep-dragon-temple.jpg (curation marked IN FRAGMENTS). Not re-added — §8 no-duplicates rule. |
| #35 Straight Outta Apex | **Already rendered** as fragments-deep-straight-apex.jpg (IN FRAGMENTS). Not re-added. |
| #18 "Record Shop KL" | CSV rank #18 = 556782957 flyer; named file Record Shop KL.jpg added instead (unambiguous name wins). |
| #33 "In Poland" | CSV rank #33 = 506749214 anon FB file; named file added instead. |
| Secondary #60/#74/#81/#89 | SIMILAR cluster — skipped; only UNIQUE #46/#51 added (redundancy policy). |
| F03 Redbul Breaking, F05 One Nation, F07 Cambodia Performing, F21/F22 | IN FRAGMENTS / near-dup — rejected. |

## 3. Duplicate audit (dhash 9×8, Hamming)
- New vs 38 rendered: min 18 (flyer-klpac), all others 19-26. **PASS (≥14).**
- New vs new: min 23, mean 31.3. **PASS.**
- Zero duplicates introduced.

## 4. Counts
| Viewport | Before | After | Mobile flag |
|---|---|---|---|
| Desktop 1440 | 66 | **81** | — |
| Tablet 1024 | 50 | **62** | (video-shoot, secondary-a, klpac, 9 deep excluded by tablet:false) |
| Mobile 390 | 17 | **22** | poland, 961, redbull-crowd, flyer-ace, video-shoot added |

## 5. Distribution (exploded, no ring/quadrant-halo/grid)
- REST 1440×900 quadrants by center: **19 / 19 / 20 / 17** (balanced, irregular)
- Face overlaps z≥20: **0** at rest, **0** live 30s
- Live reach: max center distance **832px** vs corner **815px** — full diagonal coverage
- Outer 8% band: 12 of 81 live
- Width range 38-156px vs hero 400px — hierarchy intact
- Mobile 390×844 quadrants: **8 / 3 / 3 / 2**, face clear, hero 131px of 342px scene

## 6. Motion verification — "static screenshot" discrepancy RESOLVED
Previous complaint: stills looked static. Evidence (pixel-diff of 10 stills, 2s apart, 20s real):
- **Every 2s interval: 35-43% of pixels changed >1%, mean abs diff 25-34** (of 0-255)
- Cumulative t0→18s: **51.4%** of pixels changed >1%
- DOM: **81/81 fragments moved live**, mean displacement 186px/20s, max 759px (22% crossing journey)
- Page chrome corner (top-left 60×60): **0.00** — static reference confirms diffs are field motion, not noise
- GIF: 121 frames, sampled interval mean diff 34.0 (min 31.8) — every interval visibly changes
- Reduced-motion: 0 transformed figures (static composition verified)
- Conclusion: engine was always live; a single still freezes one instant. No tau change made — speed already reads at 2s cadence.

## 7. Tech health (3 viewports)
| Check | 1440×900 | 1024×768 | 390×844 |
|---|---|---|---|
| Console errors / warnings | 0 | 0 | 0 |
| Failed requests | 0 | 0 | 0 |
| Page errors | 0 | 0 | 0 |
| Broken images | 0 | 0 | 0 |
| Horizontal overflow | none | none | none |
| Hydration errors | 0 | 0 | 0 |
| Figures transformed live | 81 | 62 | 22 |

## 8. Face census (15s GIF, 41 samples, z≥20 over hero face zone)
**0 of 41 frames** >1% — PASS.

## 9. Files changed
- `src/lib/fragments.ts` — +15 field entries, `aspect?: string` on FieldFragment
- `src/components/fragments.tsx` — FlyerMount uses `style.aspectRatio` (f.aspect ?? "3/4") so the wide Karmageddon banner keeps its 2.45:1 shape
- `public/assets/fragments/fragments-cur-*.jpg` — 15 new assets
- QA scripts — `scripts/_evi/dbg-motion-proof.mjs` (motion evidence)

## 10. Artifacts (scripts/_evi/)
- FRAGMENTS_REST / EARLY / ACTIVE / REORGANIZED.png (desktop t=0/3/12/30s)
- FRAGMENTS_TABLET_ACTIVE.png, FRAGMENTS_MOBILE_ACTIVE.png (reshot after final count)
- FRAGMENTS_REDUCED_STATIC.png
- FRAGMENTS_MOTION_REVIEW.gif (15s, 8fps, 121 frames)
- qa-census.json (face census log), motion-proof-report.json + motion-proof-00..09.png
- This record: FRAGMENTS_QA_RECORD_v5.md

## 11. Remaining subjective issues (for human eyes — vision unavailable this session)
1. 646149115 (interview) is d=19 to an un-added FB file — visually distinct enough, but the closest pair in the pool.
2. Mobile right side (TR 3, BR 2) intentionally lighter than left — hero dominates; motion cycles fragments through the zone.
3. 5 desktop figures overhang scene edges >50px (canvas clamp ±6%) — by design (enter/leave journeys).
4. Labels on w3-4 secondary pieces (9-10px) readable at desktop; tiny at mobile — matches established deep-tier policy.
