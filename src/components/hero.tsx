"use client";

import { useEffect, useRef } from "react";
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
  const frameRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLImageElement>(null);
  const masterRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLImageElement>(null);

  // Pass 4: restrained scroll-linked depth. Pure translate3d on selected layers;
  // rates are a fraction of the frame height, offset = rate × frameH × scroll
  // progress (0 at rest, max at full exit). Rest state is offset 0, so the
  // composition is pixel-identical to the static baseline. Identity layers
  // (SKILLZ, DJ LETHAL, EOTO, support copy, CTA) never move. Transform-only:
  // no layout reads beyond one rect per frame, no re-renders, passive listener.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const arch = archRef.current;
    const master = masterRef.current;
    const backdrop = backdropRef.current;
    const frame = frameRef.current;
    if (!arch || !master || !backdrop || !frame) return;
    const RATES = { arch: 0.015, master: 0.025 }; // bg slowest, midground slightly more
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = frame.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / r.height)); // 0 at rest, 1 fully exited
      const m = desktop.matches ? 1 : 0.5; // mobile: half the movement
      const yArch = RATES.arch * r.height * p * m;
      const yMaster = RATES.master * r.height * p * m;
      arch.style.transform = `translate3d(0, ${yArch}px, 0)`;
      master.style.transform = `translate3d(0, ${yMaster}px, 0)`;
      backdrop.style.transform = `translate3d(0, ${yArch}px, 0) scale(1.05)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="landing"
      aria-label="DJ Lethal Skillz · Each One Teach One"
      className="relative flex min-h-[60svh] items-center overflow-hidden bg-black scroll-mt-20 md:min-h-0"
    >
      <div
        ref={frameRef}
        className="relative mx-auto aspect-[4/3] w-full max-w-[1448px] overflow-hidden bg-black md:w-[min(100%,calc(100svh*4/3))] md:max-w-none"
      >
        {/* Archival photographic atmosphere — independently movable layer. */}
        <img
          ref={archRef}
          src="/assets/hero2-archival-layer-opt.webp"
          srcSet="/assets/hero2-archival-layer-724.webp 724w, /assets/hero2-archival-layer-opt.webp 1448w"
          sizes="(max-width: 1448px) 100vw, 1448px"
          alt=""
          className="hero-fade hero-fade-photo pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          style={{ ["--hero-from" as any]: "0.35", ["--hero-delay" as any]: "0s", ["--hero-dur" as any]: "0.7s" }}
          aria-hidden="true"
          decoding="async"
        />

        {/* Exact reference-derived SKILLZ artwork layer. */}
        <img
          src="/assets/hero2-skillz-layer-opt.webp"
          srcSet="/assets/hero2-skillz-layer-724.webp 724w, /assets/hero2-skillz-layer-opt.webp 1448w"
          sizes="(max-width: 1448px) 100vw, 1448px"
          alt=""
          className="hero-reveal pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
          style={{ ["--hero-rise" as any]: "-8px", ["--hero-delay" as any]: "0.3s", ["--hero-dur" as any]: "0.55s" }}
          aria-hidden="true"
          decoding="async"
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

        <div
          ref={masterRef}
          className="hero-fade hero-fade-photo pointer-events-none absolute inset-0 z-20"
          style={{ ["--hero-delay" as any]: "0.1s", ["--hero-dur" as any]: "0.45s" }}
          aria-hidden="true"
        >
          <img
            src={site.hero2Master ?? "/assets/skillz-hero2-master-opt.webp"}
            srcSet="/assets/skillz-hero2-master-724.webp 724w, /assets/skillz-hero2-master-1448.webp 1448w, /assets/skillz-hero2-master-opt.webp 2896w"
            sizes="(max-width: 1448px) 100vw, 1448px"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "url(#hero2-white-key-final)" }}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* Exact reference-derived DJ LETHAL artwork layer. */}
        <Image
          src="/assets/hero2-dj-lethal-layer.webp"
          alt="DJ Lethal"
          fill
          sizes="(max-width: 1448px) 100vw, 1448px"
          className="hero-reveal pointer-events-none z-30 object-cover"
          style={{ ["--hero-rise" as any]: "6px", ["--hero-delay" as any]: "0.42s", ["--hero-dur" as any]: "0.42s" }}
        />

        {/* Exact reference-derived EOTO artwork layer.
            Shifted left with the supporting-copy block below so its text clears the jacket. */}
        <div
          className="hero-reveal-shift-eoto pointer-events-none absolute inset-0 z-30"
          style={{ transform: "translateX(-3%)", ["--hero-delay" as any]: "0.48s", ["--hero-dur" as any]: "0.4s" }}
        >
          <Image
            src="/assets/hero2-eoto-layer.webp"
            alt="Each One Teach One"
            fill
            sizes="(max-width: 1448px) 100vw, 1448px"
            className="object-cover"
          />
        </div>

        {/* Reference-derived supporting copy. Desktop keeps the baked raster pixel-exact:
            the reference's lockup is thin-stroke Anton-proportioned lettering, which no
            loaded font reproduces (Anton matches the letterforms but is 2× the stroke
            weight). Mobile swaps in live Anton type — the raster is 4px mush there, so
            the HTML version is a legibility gain with no raster identity to preserve.
            The same text stays in an sr-only line so screen readers hear it once at
            every breakpoint. */}
        <div
          className="hero-reveal-shift pointer-events-none absolute inset-0 z-40"
          style={{ transform: "translateX(-3%)", ["--hero-delay" as any]: "0.62s", ["--hero-dur" as any]: "0.4s" }}
        >
          <Image
            src="/assets/hero2-supporting-copy-layer.webp"
            alt=""
            fill
            sizes="(max-width: 1448px) 100vw, 1448px"
            className="hidden object-cover md:block"
            aria-hidden="true"
          />
          <p
            aria-hidden="true"
            className="absolute left-[9.1%] top-[82.2%] font-display text-[clamp(0.66rem,1.43vw,1.29rem)] uppercase leading-[1.29] tracking-[0.02em] text-white md:hidden"
          >
            <span className="block">Culture. Education.</span>
            <span className="block">Turntablism. Legacy.</span>
          </p>
          <p className="sr-only">Culture. Education. Turntablism. Legacy.</p>
          <p className="pointer-events-none absolute left-[9.2%] top-[88.4%] font-body text-[clamp(0.65rem,1.4vw,1rem)] uppercase leading-none tracking-[0.25em] text-white">
            {values[4]}
          </p>
        </div>

        {/* Reference-derived CTA. Desktop keeps the baked raster pixel-exact (same
            thin-stroke reason as the support copy above); the swoosh flare is baked
            into it. Mobile swaps in live Anton type at 2.4× the raster's cap height —
            legible instead of invisible. Interaction language unchanged: yellow
            underline reveal + press dim — no button shape. */}
        <Image
          src="/assets/hero2-cta-layer.webp"
          alt=""
          fill
          sizes="(max-width: 1448px) 100vw, 1448px"
          className="hero-fade pointer-events-none z-40 hidden object-cover md:block"
          style={{ ["--hero-delay" as any]: "0.7s", ["--hero-dur" as any]: "0.4s" }}
          aria-hidden="true"
        />
        {/* Desktop: boxed link over the raster text (Pass-2 approved geometry) — the
            interaction language (underline reveal + press dim) sits on the baked type. */}
        <Link
          href="#what-i-do"
          aria-label="Enter the HQ"
          className="group absolute left-[76%] right-[7%] top-[80%] bottom-[11%] z-[45] hidden rounded-sm before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-accent md:block"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[35%] left-[7.1%] right-[11.2%] h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100 group-active:opacity-60"
          />
        </Link>
        {/* Mobile: content-sized link with live Anton type — legible instead of the
            raster's 4px cap. Same interaction language. */}
        <Link
          href="#what-i-do"
          aria-label="Enter the HQ"
          className="group absolute left-[77.2%] top-[83.1%] z-[45] inline-flex rounded-sm before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-accent md:hidden"
        >
          <span
            className="hero-fade inline-flex items-center gap-[0.7em] font-display text-[clamp(0.875rem,2.35vw,1.35rem)] uppercase leading-none tracking-[0.06em] text-white"
            style={{ ["--hero-delay" as any]: "0.7s", ["--hero-dur" as any]: "0.4s" }}
          >
            <span className="relative">
              Enter the HQ
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[0.07em] left-0 right-0 h-[0.12em] origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100 group-active:opacity-60"
              />
            </span>
            <img
              src="/assets/hero2-cta-flare.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none hidden h-[0.73em] w-auto sm:block"
            />
          </span>
        </Link>

        <div className="sr-only">
          <h1>SKILLZ</h1>
          <p>DJ LETHAL</p>
          <p>Each One Teach One</p>
        </div>

        {/* Marquee — kept at the section bottom edge (frame bottom on desktop; below the frame
            on mobile, where the section grows to 60svh and the backdrop shows through). */}
      </div>

      {/* DEMO V6 ONLY — Skillz Vinyl Logo wallpaper backdrop. Sits AFTER the frame div (paints above its
          bg-black, exactly like the v1 in-frame placement) but below all z-10+ layers. object-cover keeps
          the square proportional (circle NOT distorted); scale is the MINIMUM needed to cover the section
          (object-cover alone = 1.406x; 1.05 adds a hairline margin -> ~1.476x total). Wallpaper, not close-up. */}
      <img
        ref={backdropRef}
        src="/assets/skillz-vinyl-logo-backdrop-opt.webp"
        srcSet="/assets/skillz-vinyl-logo-backdrop-512.webp 512w, /assets/skillz-vinyl-logo-backdrop-opt.webp 1024w"
        sizes="(max-width: 1448px) 100vw, 1448px"
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-50"
        style={{ transform: "scale(1.05)" }}
        aria-hidden="true"
        decoding="async"
      />

      <div
        className="hero-fade absolute bottom-0 left-0 right-0 z-50 flex items-center overflow-hidden bg-accent h-[4.15%]"
        style={{ ["--hero-delay" as any]: "0.72s", ["--hero-dur" as any]: "0.35s" }}
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

      <div className="grain pointer-events-none absolute inset-0 z-[60] opacity-[0.08] mix-blend-overlay" aria-hidden="true" />
    </section>
  );
}
