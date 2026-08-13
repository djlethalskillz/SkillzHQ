SKILLZHQ — HERO 2 TAKEOVER PATCH

Purpose:
Replace the current Hero 2 CSS reconstruction with the supplied Hero 2 visual master.

Files to copy into the project root:
  src/components/hero.tsx
  src/lib/site.ts
  public/assets/dj-lethal-skillz-hero2-reference.png

The source reference is preserved unchanged. The implementation renders the approved
1448x1086 reference as the responsive 4:3 visual surface, keeping the exact composition:
DJ LETHAL / SKILLZ / subject overlap / Each One Teach One / supporting copy / CTA / marquee.

No other sections are changed by this patch.

After applying:
  npm run lint
  npm run build
  npm run dev

Then inspect http://localhost:3000 at 1440x900, 1024x768 and 390x844.

Important:
Do not ask an AI agent to redesign/reconstruct this hero. This is now an asset/composition lock.
Future work should treat Hero 2 as production-locked unless a genuine bug is found.
