# SkillzHQ — Hero 2 Visual Lock Specification

## North Star

Canonical visual reference:

`public/assets/dj-lethal-skillz-hero2-reference.png`

Dimensions: **1448 × 1086 (4:3)**.

`public/assets/skillz-hero2-reference.png` is pixel-identical to the canonical reference.

## Canonical subject

`public/assets/skillz-hero2-master.png`

Dimensions: **4624 × 3468**.

The source image is not edited or destructively cropped. At the reference composition it maps essentially 1:1 to the 4:3 frame and is white-keyed at render time.

## Layer order

1. Black canvas
2. Archival photographic atmosphere
3. SKILLZ reference-derived texture layer
4. Canonical MASTER subject
5. DJ LETHAL reference-derived layer
6. Each One Teach One reference-derived layer
7. Supporting copy reference-derived layer
8. CTA reference-derived artwork + live transparent anchor
9. Yellow marquee
10. Global grain

## Why reference-derived artwork layers are used

The supplied North Star contains specific distressed typography, handwritten treatment, and editorial positioning that CSS reconstruction repeatedly failed to reproduce visually. These are extracted as **independent transparent layers**, not flattened into a single hero image. This preserves the ability to add future parallax, pointer-follow, tilt, depth, and other interaction to individual layers.

## Desktop composition

The composition is locked to the reference's 4:3 artwork ratio. The existing site header overlays the top of the Hero artwork so the landing scene retains the same vertical coordinate system as the North Star.

Do not independently resize or reposition SKILLZ, DJ LETHAL, the MASTER, EOTO, or CTA without an explicit visual-lock review.

## Future interaction

Static composition comes first. Once visually approved, layers may receive:

- subtle pointer parallax
- subject tilt
- typography depth
- independent depth movement
- pointer-reactive micro-motion

Do not add these effects until the static composition is locked.
