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
 * Hero — Hero 2 controlled replacement.
 *
 * Composition target: DJ Lethal Skillz Hero 2 Reference.png (1448×1086, 4:3).
 * Frame = aspect 4:3 poster, black field, marquee strip below.
 *
 * Subject: skillz-hero2-master.png (4624×3468, white studio field).
 *  - white field keyed out in CSS via feColorMatrix/feComponentTransfer
 *    threshold (luminance → alpha; alpha 1 below lum≈224, 0 at 255).
 *    Source file untouched. Face untouched.
 *  - box: width 101.9% of frame, aspect 4:3, top -7.7%, left +2.6%
 *    → head top ≈ 9% of frame, head center ≈ 50%, body bottom ≈ 89%
 *    (reference: face y 9–30% / x 39.5–60%, subject bottom ≈ 94%).
 *
 * SKILLZ: Anton display, one continuous word behind the subject,
 *  cap band ≈ y 20–59% (reference white type band y 18–65%, x 5–85%).
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
            <feFuncA type="table" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="relative mx-auto w-full max-w-[1448px] aspect-[4/3] overflow-hidden">
        {/* SKILLZ — one continuous giant word, behind the subject.
            Reference: gray-white distressed letters, band y 17–64%, x 10–88%. */}
        <h1
          aria-label="Skillz"
          className="pointer-events-none absolute inset-0 z-10 font-display uppercase leading-[0.82] tracking-[-0.01em]"
        >
          <span
            aria-hidden
            className="texture-text absolute left-[10%] top-[15%] w-[78%] text-[clamp(7rem,48vw,43.25rem)]"
          >
            Skillz
          </span>
        </h1>

        {/* DJ LETHAL — white DJ + yellow LETHAL, top-left (ref x 10–32%, y 9.6–15.7%) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[10%] top-[9.5%] z-30 flex items-baseline gap-[0.3em] font-display text-[clamp(2rem,6.5vw,6.5rem)] uppercase leading-none"
        >
          <span className="text-white">DJ</span>
          <span className="text-accent">LETHAL</span>
        </div>

        {/* Yellow bar — top-right (ref x 89–98%, y 1.5–5.4%) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[2%] top-[1.5%] z-30 h-[4%] w-[9%] bg-accent"
        />

        {/* Subject — Hero 2 MASTER, white field keyed out in CSS.
            Box: w 101.9% of frame, aspect 4:3, top -7.7% (head top ≈ 9%),
            left +2.6% → head center ≈ 50% of frame (ref face center ~49.7%).
            Head width ≈ 22.7% vs ref 20.5% (photo-intrinsic difference). */}
        <div
          className="pointer-events-none absolute left-[2.6%] top-[-7.7%] z-20 aspect-[4/3] w-[101.9%] overflow-hidden"
          aria-hidden="true"
        >
          {site.hero2Master ? (
            <Image
              src={site.hero2Master}
              alt=""
              priority
              fill
              sizes="(max-width: 1448px) 102vw, 1480px"
              className="object-cover"
              style={{ filter: "url(#hero2-white-key) brightness(0.72) contrast(1.15)" }}
            />
          ) : null}
        </div>

        {/* Editorial copy — bottom-left, approved placement */}
        <div className="absolute bottom-[9%] left-[4%] z-30 md:left-[6%]">
          <p className="font-hand text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] text-accent">
            Each One <span className="block">Teach One</span>
          </p>
          <div className="mt-4 space-y-1 text-[11px] uppercase tracking-[0.3em] text-white/70 md:text-xs">
            <p>
              {values[0]} {values[1]}
            </p>
            <p>
              {values[2]} {values[3]}
            </p>
            <p>{values[4]}</p>
          </div>
        </div>

        {/* CTA — bottom-right, ref text y 83.6–85.3%, arrow x 88.8–91.2% */}
        <Link
          href="#what-i-do"
          className="group absolute bottom-[14%] right-[8%] z-30 text-base uppercase tracking-[0.4em] text-white/85 transition-colors hover:text-white md:text-lg"
        >
          Enter the HQ
          <span className="ml-2 inline-block text-accent transition-transform group-hover:translate-x-1">
            →
          </span>
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
        className="absolute bottom-0 left-0 right-0 z-50 overflow-hidden bg-accent py-2.5"
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
                  className="flex items-center gap-8 pr-8 font-display text-xl uppercase tracking-wider text-black"
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
