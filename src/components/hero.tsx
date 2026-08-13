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
 * Hero — Hero 2 controlled reconstruction.
 *
 * Composition target: DJ Lethal Skillz Hero 2 Reference.png (1448×1086, 4:3).
 * Frame = aspect 4:3 poster, black field, marquee strip below.
 *
 * Subject: skillz-hero2-master.png (4624×3468, white studio field) — canonical
 *  approved MASTER, source untouched.
 *  - white field keyed out in CSS via feColorMatrix/feComponentTransfer
 *    threshold (luminance → alpha; alpha 1 below lum≈239, 0 at pure white 255).
 *  - box: width 95.8% of frame, aspect 4:3, top -0.5%, left +1.3%
 *    → head top ≈ 15% (ref ≈ 16%), head center ≈ 45.5% (ref ≈ 45%),
 *    body bottom ≈ 92% (ref ≈ 94%). Tone via brightness only (no contrast).
 *
 * SKILLZ: Anton display, one continuous word behind the subject,
 *  cap band ≈ y 17–63% (reference white type band y 17–63%, x 9.4–91.2%).
 *
 * Copy: EOTO (Caveat, yellow) + supporting lines bottom-left,
 *  ENTER THE HQ → bottom-right (existing approved placement).
 */
export function Hero() {
  return (
    <section
      id="landing"
      aria-label="DJ Lethal Skillz — Each One Teach One"
      className="relative overflow-hidden bg-black scroll-mt-20"
    >
      {/* CSS white-key filter for the master subject */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <filter id="hero2-white-key">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.299 0.587 0.114 0 0"
          />
          <feComponentTransfer>
            {/* Sharp threshold: alpha 1 below lum ≈ 239, 0 at pure white 255 —
                drop concentrated in the studio field only, subject highlights stay opaque */}
            <feFuncA type="table" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="relative mx-auto w-full max-w-[1448px] aspect-[4/3] overflow-hidden">
        {/* SKILLZ — one continuous giant word, behind the subject.
            Reference: gray-white distressed letters, band y 17–63%, x 9.4–91.2%
            (measured: word ink x 9.4–91.2, Z fully visible, subject in front). */}
        <h1
          aria-label="Skillz"
          className="pointer-events-none absolute inset-0 z-10 font-display uppercase leading-[0.82] tracking-[-0.01em]"
        >
          <span
            aria-hidden
            className="texture-text absolute left-[8.4%] top-[16%] w-[83.5%] text-[clamp(7rem,51.3vw,46.1rem)]"
          >
            Skillz
          </span>
        </h1>

        {/* DJ LETHAL — white DJ + yellow LETHAL, top-left (ref x 10–32%, y 9.6–15.7%) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[10%] top-[9.5%] z-30 flex items-baseline gap-[0.3em] font-display text-[clamp(1.9rem,5.3vw,5.3rem)] uppercase leading-none"
        >
          <span className="text-white">DJ</span>
          <span className="tracking-[0.05em] text-accent">LETHAL</span>
        </div>

        {/* Yellow bar — top-right (ref x 89–98%, y 1.5–5.4%) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[2%] top-[1.5%] z-30 h-[4%] w-[9%] bg-accent"
        />

        {/* Subject — Hero 2 MASTER, white field keyed out in CSS.
            Box: head top ≈ 15% (ref ≈ 16%), head width ≈ 21.3% (ref 20.5%),
            head center x ≈ 45.5% (ref ≈ 45%), body bottom ≈ 92% (ref ≈ 94%).
            Face untouched; tone via brightness only (no contrast). */}
        <div
          className="pointer-events-none absolute left-[1.3%] top-[-0.5%] z-20 aspect-[4/3] w-[95.8%] overflow-hidden"
          aria-hidden="true"
        >
          {site.hero2Master ? (
            <Image
              src={site.hero2Master}
              alt=""
              priority
              fill
              sizes="(max-width: 1448px) 96vw, 1390px"
              className="object-cover"
              style={{ filter: "url(#hero2-white-key) brightness(0.85)" }}
            />
          ) : null}
        </div>

        {/* Editorial copy — bottom-left, ref EOTO y 68.6–78.5% + supporting values y 82.7–90% */}
        <div className="absolute bottom-[9.15%] left-[6%] z-30 md:left-[8%]">
          <p className="font-hand text-[clamp(2.25rem,5.3vw,5.3rem)] leading-[0.75] text-accent">
            Each One <span className="block">Teach One</span>
          </p>
          <div className="mt-4 space-y-1 text-[11px] uppercase tracking-[0.3em] text-white md:mt-[36px] md:space-y-0 md:font-display md:text-[22px] md:leading-[1.4] md:tracking-normal">
            <p>
              {values[0]} {values[1]}
            </p>
            <p>
              {values[2]} {values[3]}
            </p>
            <p>{values[4]}</p>
          </div>
        </div>

        {/* CTA — bottom-right, ref text y 83.6–85.3%, text x 77.2–87.5%, thin arrow x 88.8–91.2% */}
        <Link
          href="#what-i-do"
          className="group absolute bottom-[14.5%] right-[8.8%] z-30 text-base uppercase leading-none tracking-[0.12em] text-white transition-colors hover:text-accent md:text-lg"
        >
          Enter the HQ
          <svg
            aria-hidden
            viewBox="0 0 33 12"
            className="ml-[1em] inline-block h-[0.67em] w-[1.83em] text-accent transition-transform group-hover:translate-x-1"
          >
            <path
              d="M1 6h24 M25 1l7 5-7 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </Link>

        <div className="sr-only">
          <h1>SKILLZ</h1>
          <p>DJ LETHAL</p>
          <p>Each One Teach One</p>
          <p>Culture. Education. Turntablism. Legacy. Worldwide.</p>
          <p>Enter the HQ.</p>
        </div>

        {/* Yellow marquee strip — bottom edge inside the frame (ref y 94.8–98.9%) */}
        <div
          className="absolute bottom-0 left-0 right-0 z-50 overflow-hidden bg-accent py-2.5 max-sm:py-1"
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
                    className="flex items-center gap-8 pr-8 font-display text-xl uppercase tracking-wider text-black max-sm:text-xs"
                  >
                    {item}
                    <span className="text-black/50">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="grain pointer-events-none absolute inset-0 z-40 opacity-[0.12] mix-blend-overlay"
        aria-hidden="true"
      />
    </section>
  );
}
