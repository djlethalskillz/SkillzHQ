import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const marqueeItems = [
  "Book Skillz",
  "DJ",
  "Turntablist",
  "Events",
  "Festivals",
  "Workshops",
  "Speaking",
  "Culture",
  "Producer",
];

const values = ["Culture.", "Education.", "Turntablism.", "Legacy.", "Worldwide."];

/**
 * Hero — reverse-engineered from SKILLZ_HERO_APPROVED_REFERENCE.png.
 *
 * Poster composition (1440×900):
 *  - z-0   camo chest field  — SKY_0104 zoomed, top-fade masked, BEHIND the type
 *  - z-10  SKILLZ            — one continuous giant word, distressed texture
 *  - z-15  bottom scrim      — darkens the field behind the editorial copy
 *  - z-20  head/portrait     — SKY_0104 masked to head+neck ellipse, IN FRONT of
 *          the type: middle letterforms disappear behind the portrait, the type
 *          emerges through the feathered head edges
 *  - z-30  editorial copy    — DJ LETHAL, EOTO, supporting copy, ENTER THE HQ
 *  - z-40  grain · z-50      — marquee
 *
 * Photo geometry (shared by both photo layers):
 *  - visible field    x 364-1395 / y 130-847  (ref: 25.3-96.9% / 14.4-94.1%)
 *  - face bbox        x 511-1064 / y 146-510  (ref: 35.5-73.9% / 16.2-56.7%)
 *  - face center      (787, 328)              (ref: 54.7%, 36.5%)
 *  - face ≈ 553×365px                         (ref: 38.4% × 40.5% of canvas)
 *  zoom z = 0.571 → img 2284×3426 at -602/-344 inside the panel
 *
 * SKILLZ: Anton 596px, cap bottom at y 540 (ref 60%), word spans x 20-1383.
 * Head core covers the word at x 511-1064 (I + first Ls disappear behind it).
 *
 * DESKTOP 1440×900 ONLY — tablet/mobile pass comes after visual approval.
 */
export function Hero() {
  return (
    <section
      id="landing"
      aria-label="Landing"
      className="relative flex min-h-svh flex-col overflow-hidden -mt-[77px] scroll-mt-20"
    >
      {/* Camo chest field — behind the type */}
      <div
        className="pointer-events-none absolute left-[364px] top-[130px] z-0 h-[717px] w-[1031px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0px,transparent_380px,black_480px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0px,transparent_380px,black_480px)]"
        aria-hidden="true"
      >
        {site.heroBackground ? (
          <Image
            src={site.heroBackground}
            alt=""
            priority
            aria-hidden="true"
            className="absolute left-[-602px] top-[-344px] h-[3426px] w-[2284px] max-w-none object-cover brightness-[0.9] saturate-[0.7]"
            width={2284}
            height={3426}
          />
        ) : null}
      </div>

      {/* SKILLZ — one continuous giant word, distressed white */}
      <h1
        aria-label="Skillz"
        className="pointer-events-none absolute inset-0 z-10 font-display text-[596px] uppercase leading-[0.82] tracking-[-0.01em]"
      >
        <span aria-hidden className="texture-text absolute left-[20px] top-[105px]">
          Skillz
        </span>
      </h1>

      {/* Bottom scrim — darkens the field behind the editorial copy */}
      <div
        className="absolute inset-x-0 bottom-0 z-[15] h-[38%] bg-gradient-to-t from-black/60 via-black/30 to-transparent"
        aria-hidden="true"
      />

      {/* Head / portrait — in front of the type */}
      <div
        className="pointer-events-none absolute left-[364px] top-[130px] z-20 h-[717px] w-[1031px] overflow-hidden [mask-image:radial-gradient(ellipse_461px_303px_at_423px_198px,black_60%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_461px_303px_at_423px_198px,black_60%,transparent_85%)]"
        aria-hidden="true"
      >
        {site.heroBackground ? (
          <Image
            src={site.heroBackground}
            alt=""
            priority
            aria-hidden="true"
            className="absolute left-[-602px] top-[-344px] h-[3426px] w-[2284px] max-w-none object-cover brightness-[0.9] saturate-[0.7]"
            width={2284}
            height={3426}
          />
        ) : null}
      </div>

      {/* DJ LETHAL — editorial mark, top-left, cleared below the sticky header */}
      <p className="absolute left-[40px] top-[89px] z-30 flex items-baseline gap-8 font-display text-7xl uppercase tracking-[0.18em] text-white">
        DJ
        <span className="text-accent">Lethal</span>
      </p>

      {/* Editorial block — EOTO, supporting copy, CTA */}
      <div className="absolute inset-x-0 bottom-0 z-30">
        <div className="mx-auto flex w-full max-w-[1520px] flex-col items-start justify-between gap-8 px-10 pb-[88px] md:flex-row md:items-end">
          <div>
            <p className="font-hand text-[64px] leading-[1.02] text-accent">
              Each One <span className="block">Teach One</span>
            </p>

            <div className="mt-6 space-y-1 text-[11px] uppercase tracking-[0.3em] text-white/70 md:text-xs">
              <p>
                {values[0]} {values[1]}
              </p>
              <p>
                {values[2]} {values[3]}
              </p>
              <p>{values[4]}</p>
            </div>
          </div>

          <Link
            href="#what-i-do"
            className="group mb-5 shrink-0 text-lg uppercase tracking-[0.4em] text-white/85 transition-colors hover:text-white"
          >
            Enter the HQ
            <span className="ml-2 inline-block text-accent transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      <div
        className="grain pointer-events-none absolute inset-0 z-40 opacity-[0.12] mix-blend-overlay"
        aria-hidden="true"
      />

      <div
        className="relative z-50 mt-auto overflow-hidden border-t border-black bg-accent py-4"
        aria-hidden="true"
      >
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center"
              aria-hidden={copy === 1}
            >
              {marqueeItems.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-8 pr-8 font-display text-2xl uppercase tracking-wider text-black"
                >
                  {item}
                  <span className="text-black/50">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
