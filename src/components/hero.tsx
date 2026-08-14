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
 * Hero 2 — North Star reconstruction.
 *
 * The approved 1448×1086 reference is treated as the composition authority.
 * Visual artwork is kept as independent layers so the static poster can later
 * receive pointer/parallax/depth treatment without flattening the scene.
 */
export function Hero() {
  return (
    <section
      id="landing"
      aria-label="DJ Lethal Skillz — Each One Teach One"
      className="relative overflow-hidden bg-black scroll-mt-20"
    >
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[1448px] overflow-hidden bg-black md:w-[min(100%,calc(100svh*4/3))] md:max-w-none">
        {/* Archival photographic atmosphere — independently movable layer. */}
        <Image
          src="/assets/hero2-archival-layer.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1448px) 100vw, 1448px"
          className="pointer-events-none z-0 object-cover"
          aria-hidden="true"
        />

        {/* Exact reference-derived SKILLZ artwork layer. */}
        <Image
          src="/assets/hero2-skillz-layer.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1448px) 100vw, 1448px"
          className="pointer-events-none z-10 object-cover"
          aria-hidden="true"
        />

        {/* Canonical MASTER subject — source untouched, white studio field keyed at render time. */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
          <filter id="hero2-white-key-final">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.299 0.587 0.114 0 0"
              result="luminanceAlpha"
            />
            <feComponentTransfer in="luminanceAlpha" result="keyAlpha">
              <feFuncA type="table" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 0.9 0.6 0.3 0.1 0" />
            </feComponentTransfer>
            {/* Flatten RGB to a constant so the matte can be eroded on its own —
                erosion below only ever touches this alpha mask, never SourceGraphic's colors. */}
            <feColorMatrix
              in="keyAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="maskOnly"
            />
            {/* Choke the matte ~1px so anti-aliased edge pixels from the white studio
                backdrop don't survive as a bright rim against the black frame. */}
            <feMorphology in="maskOnly" operator="erode" radius="1" result="erodedMask" />
            {/* Recombine: original untouched photo RGB, masked by the eroded alpha only. */}
            <feComposite in="SourceGraphic" in2="erodedMask" operator="in" />
          </filter>
        </svg>

        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
          <Image
            src={site.hero2Master ?? "/assets/skillz-hero2-master.png"}
            alt=""
            fill
            priority
            sizes="(max-width: 1448px) 100vw, 1448px"
            className="object-cover"
            style={{ filter: "url(#hero2-white-key-final)" }}
          />
        </div>

        {/* Exact reference-derived DJ LETHAL artwork layer. */}
        <Image
          src="/assets/hero2-dj-lethal-layer.png"
          alt="DJ Lethal"
          fill
          priority
          sizes="(max-width: 1448px) 100vw, 1448px"
          className="pointer-events-none z-30 object-cover"
        />

        {/* Exact reference-derived EOTO artwork layer.
            Shifted left with the supporting-copy block below so its text clears the jacket. */}
        <div className="pointer-events-none absolute inset-0 z-30" style={{ transform: "translateX(-3%)" }}>
          <Image
            src="/assets/hero2-eoto-layer.png"
            alt="Each One Teach One"
            fill
            priority
            sizes="(max-width: 1448px) 100vw, 1448px"
            className="object-cover"
          />
        </div>

        {/* Exact reference-derived supporting copy layer.
            Note: this locked asset bakes in only 2 of the reference's 3 copy lines
            ("Culture. Education." / "Turntablism. Legacy.") — "Worldwide." is absent
            from the PNG's pixel data. Restored below as a live text line, matched to
            the reference's measured position or reference lines 1–2 (left 9.2%, top 88.4%). */}
        <div
          className="pointer-events-none absolute inset-0 z-40"
          style={{ transform: "translateX(-3%)" }}
          aria-hidden="true"
        >
          <Image
            src="/assets/hero2-supporting-copy-layer.png"
            alt=""
            fill
            sizes="(max-width: 1448px) 100vw, 1448px"
            className="object-cover"
          />
          <p className="pointer-events-none absolute left-[9.2%] top-[88.4%] font-body text-[clamp(0.65rem,1.4vw,1rem)] uppercase leading-none tracking-[0.25em] text-white">
            {values[4]}
          </p>
        </div>

        {/* Exact reference-derived CTA artwork, with a transparent live link over the same geometry. */}
        <Image
          src="/assets/hero2-cta-layer.png"
          alt=""
          fill
          sizes="(max-width: 1448px) 100vw, 1448px"
          className="pointer-events-none z-40 object-cover"
          aria-hidden="true"
        />
        <Link
          href="#what-i-do"
          aria-label="Enter the HQ"
          className="absolute bottom-[7.8%] right-[7.2%] z-[45] h-[8%] w-[17%] rounded-sm focus-visible:outline-2 focus-visible:outline-accent"
        >
          <span className="sr-only">Enter the HQ</span>
        </Link>

        <div className="sr-only">
          <h1>SKILLZ</h1>
          <p>DJ LETHAL</p>
          <p>Each One Teach One</p>
          <p>Culture. Education. Turntablism. Legacy. Worldwide.</p>
          <p>Enter the HQ.</p>
        </div>

        {/* Marquee — kept inside the artwork frame, matching the North Star bottom edge. */}
        <div
          className="absolute bottom-0 left-0 right-0 z-50 flex items-center overflow-hidden bg-accent h-[4.15%]"
          aria-hidden="true"
        >
          <div className="animate-marquee flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {marqueeItems.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center gap-[2.2vw] pr-[2.2vw] font-display text-[clamp(0.7rem,1.45vw,1.3rem)] uppercase tracking-wide text-black"
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

      <div className="grain pointer-events-none absolute inset-0 z-[60] opacity-[0.08] mix-blend-overlay" aria-hidden="true" />
    </section>
  );
}
