# BOOK SKILLZ — PRODUCTION LOCK RECORD

Date: 2026-08-16
Status: **PRODUCTION LOCKED — human visual review approved**
Commit: 7087986 — lock: production lock Book Skillz — SELECT A BRIEF accordion + worker enquiry delivery
Canonical implementation: `src/components/booking.tsx` + `src/lib/site.ts` + `workers/enquiry.js` + `wrangler.toml`

## What was locked (final V1 state)

The BOOK SKILLZ / COLLABORATE flow, borrowed from the approved
`SkillzHQ_Collaborate_RC2_ProductionFreeze.html` reference and adapted to the
current SkillzHQ design language (yellow band, font-display titles, mono labels,
inverted active row).

- **SELECT A BRIEF — true accordion**: 7 briefs (Performance, Workshop /
  Masterclass, Speaking, Creative Collaboration, Commission, Media / Press,
  Other) with reference-exact names/headings/taglines/helpers; one brief open at
  a time; switching collapses the previous row while the new one expands;
  520 ms collapse then body cleared (typed content resets on close — reference
  behavior); numbered 01–07 with rotating + toggle; tagline swaps per brief and
  restores to the default on close.
- **Contextual conversation**: "Tell me about your {Brief}." heading per brief.
- **Shared live form**: Name, Email, Organization — optional, Details, Submit —
  one form instance hosted by the open row only. Native required/email
  validation; submit disabled while sending ("Sending…").
- **Delivery**: `POST {category, name, email, organization, details}` to the
  same-origin endpoint `site.enquiryEndpoint` (`/api/enquiry`) → Cloudflare
  Worker → Resend → `ENQUIRY_DESTINATION` (env secret). Subject
  `Let's Collaborate · {Brief}`; body Category/Name/Email/Organization/Details;
  reply-to = visitor email. **The destination email address appears nowhere in
  the client bundle, React source, or UI** (verified against the built output:
  0 hits).
- **States**: sending → "— received / Enquiry sent — I'll be in touch." on
  success (form replaced); "Something went wrong — please try again." on
  failure (form retained for retry). No technical details ever shown.
- **Approved UX preserved**: accordion behavior, headings, taglines, fields,
  visual treatment, animation (grid-template-rows, cubic-bezier(.22,.61,.36,1)),
  responsive, validation, accessibility (aria-expanded/controls, aria-live,
  motion-reduce), reduced-motion contract — all unchanged from approval.

## Final production QA (2026-08-16)

| Check | Result |
|---|---|
| TypeScript (`npx tsc --noEmit`) | PASS |
| Production build (`next build`) | PASS (1 pre-existing font-fallback warning) |
| Accordion probe (desktop 1440 + mobile 390) | 70/70 — 7 briefs exact names/order, numbered, no form before open, contextual heading + tagline per brief, exactly one open, mid-collapse form present then cleared, tagline restored, switch keeps one open, failed delivery → retry message + form retained, required validation blocks submit, 0 console/page errors, 0 horizontal overflow |
| Worker unit tests (mocked Resend) | 24/24 — exact payload (to=secret destination, reply_to=visitor, subject, body fields), Bearer auth, category/field validation 400, Resend 401→502 generic, missing secret→501, GET→405, OPTIONS→204, destination never leaked in any response |
| Frontend flow vs stub endpoint | 13/13 — real browser POST with exact payload, category = open brief (Speaking, Commission verified), optional org → empty string, success UI, 502 → human retry (no technical detail), retry succeeds, "Sending…" + disabled in-flight, 0 console errors |
| Bundle exposure audit | PASS — `djlethalskillz@gmail.com`: 0 hits in `.next/`, 0 in `src/`/`public/`; `mailto:` 0 in bundle; only `/api/enquiry` path present (expected) |
| Screenshots (human review) | BOOK_ACCORDION_CLOSED / BOOK_BRIEF_OPEN_FORM / BOOK_BRIEF_OPEN_FILLED / BOOK_MOBILE_OPEN / BOOK_ENQUIRY_SUCCESS / BOOK_ENQUIRY_FAILURE / BOOK_MOBILE_ENQUIRY |

## Files changed this lock

1. `src/components/booking.tsx` — accordion rework + fetch delivery (replaces the
   previous category-list + mailto CTA implementation)
2. `src/lib/site.ts` — `bookingEmail`/`bookingCategories`/`producerServices`/
   `speakingServices` → `enquiryEndpoint` + `bookingBriefs`
3. `workers/enquiry.js` (new) — delivery worker (validation, Resend call, generic
   errors, reply-to, secrets only)
4. `wrangler.toml` (new) — worker route `djlethalskillz.com/api/enquiry` + vars

## Notes

- **Deployment intentionally deferred to launch** (per approval): Resend account
  + sender-domain verification and Cloudflare `wrangler deploy` + secrets
  (`RESEND_API_KEY`, `ENQUIRY_DESTINATION`) are manual steps owned by the
  operator. Until the worker is deployed, local/dev submits show the honest
  "Something went wrong — please try again." state. Full steps:
  `scripts/_evi/BOOKSKILLZ_DELIVERY_SETUP.md`.
- QA evidence preserved in `scripts/_evi/` (dbg-book-probe.mjs,
  dbg-enquiry-worker-test.mjs, dbg-enquiry-flow.mjs, screenshot set).
- No previously locked chapters (hero, speaking, turntablism, producer,
  fragments) were modified by this lock.
- Chapter is frozen: no further UI, UX, copy, accordion, or structural changes
  without explicit approval. Revisit only for genuine production bugs.
