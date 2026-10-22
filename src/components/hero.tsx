"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    /** DEMO: set after the first hero mount so the opening plays once per visit. */
    __skzOpened?: boolean;
  }
}
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
 * Native anchor navigation only — no preventDefault, no smooth scroll. A click
 * on a fragment link whose hash is ALREADY the current URL hash is a no-op in
 * every browser (same-document navigation to the same fragment), so a second
 * click after the first navigation — or after a reload that restored the hash —
 * silently does nothing. Re-trigger the same instant jump in that case; the
 * browser handles every other case natively. scroll-margin on the section is
 * honored, so the landing is identical to a native jump.
 */
const enterHQ = (e: React.MouseEvent<HTMLAnchorElement>) => {
  const href = e.currentTarget.getAttribute("href");
  if (href && window.location.hash === href) {
    document.querySelector(href)?.scrollIntoView({ behavior: "auto", block: "start" });
  }
};

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
  const skillzRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // DEMO: the needle-drop opening plays on the first mount of a visit only
  // (server HTML includes it, so first paint and hydration agree; a client
  // navigation back to the HQ skips it).
  const [showOpening] = useState(() => typeof window === "undefined" || !window.__skzOpened);
  useEffect(() => {
    window.__skzOpened = true;
  }, []);

  // Pass 4 scroll depth, extended for the demo:
  //  - pointer depth (fine pointers only): background layers drift a few px
  //    against the pointer, the portrait moves as ONE rigid print (never
  //    warped), identity type (DJ LETHAL, EOTO, copy, CTA) never moves;
  //  - documentary cut on exit: the frame dims toward black as it leaves.
  // Transform/opacity only, one rAF, passive listeners, off under reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const arch = archRef.current;
    const master = masterRef.current;
    const backdrop = backdropRef.current;
    const skillz = skillzRef.current;
    const frame = frameRef.current;
    const section = sectionRef.current;
    if (!arch || !master || !backdrop || !frame || !skillz || !section) return;
    const RATES = { arch: 0.015, master: 0.025 }; // bg slowest, midground slightly more
    const DEPTH = { backdrop: 16, arch: 11, skillz: 5, master: 3 }; // px at full pointer offset
    let raf = 0;
    let tx = 0;
    let ty = 0; // pointer target (-1..1)
    let px = 0;
    let py = 0; // eased pointer
    const update = () => {
      raf = 0;
      const r = frame.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / r.height)); // 0 at rest, 1 fully exited
      const m = desktop.matches ? 1 : 0.5; // mobile: half the movement
      const yArch = RATES.arch * r.height * p * m;
      const yMaster = RATES.master * r.height * p * m;
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      const d = (k: keyof typeof DEPTH) => `${(-px * DEPTH[k]).toFixed(2)}px, ${(-py * DEPTH[k]).toFixed(2)}px`;
      arch.style.transform = `translate3d(0, ${yArch}px, 0) translate(${d("arch")})`;
      master.style.transform = `translate3d(0, ${yMaster}px, 0) translate(${d("master")})`;
      backdrop.style.transform = `translate3d(0, ${yArch}px, 0) translate(${d("backdrop")}) scale(1.05)`;
      skillz.style.transform = `translate(${d("skillz")})`;
      section.style.setProperty("--cut", (p * 0.75).toFixed(3));
      if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) raf = requestAnimationFrame(update);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onPointer = (e: PointerEvent) => {
      if (!fine.matches) return;
      const r = frame.getBoundingClientRect();
      if (r.bottom < 0) return;
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="landing"
      aria-label="DJ Lethal Skillz · Each One Teach One"
      className={`relative flex min-h-[60svh] items-center overflow-hidden bg-black scroll-mt-20 md:min-h-0 ${
        showOpening ? "has-opening" : ""
      }`}
    >
      {showOpening ? (
        <div className="opening" aria-hidden="true">
          <span className="opening-label font-arch-mono text-[11px] uppercase tracking-[0.4em] text-white/80">
            SkillzHQ
          </span>
          <span className="opening-needle" />
          <span className="opening-label font-arch-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            Digital Headquarters
          </span>
        </div>
      ) : null}
      <div className="hero-cut" aria-hidden="true" />
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
          style={{ ["--hero-from" as string]: "0.35", ["--hero-delay" as string]: "0s", ["--hero-dur" as string]: "0.7s" }}
          aria-hidden="true"
          decoding="async"
        />

        {/* Exact reference-derived SKILLZ artwork layer. Wrapped so pointer
            depth can move it without fighting the entrance keyframes. */}
        <div ref={skillzRef} className="pointer-events-none absolute inset-0 z-10">
          <img
            src="/assets/hero2-skillz-layer-opt.webp"
            srcSet="/assets/hero2-skillz-layer-724.webp 724w, /assets/hero2-skillz-layer-opt.webp 1448w"
            sizes="(max-width: 1448px) 100vw, 1448px"
            alt=""
            className="hero-reveal absolute inset-0 h-full w-full object-cover"
            style={{ ["--hero-rise" as string]: "-8px", ["--hero-delay" as string]: "0.3s", ["--hero-dur" as string]: "0.55s" }}
            aria-hidden="true"
            decoding="async"
          />
        </div>

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
          style={{ ["--hero-delay" as string]: "0.1s", ["--hero-dur" as string]: "0.45s" }}
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
          style={{ ["--hero-rise" as string]: "6px", ["--hero-delay" as string]: "0.42s", ["--hero-dur" as string]: "0.42s" }}
        />

        {/* Exact reference-derived EOTO artwork layer.
            Shifted left with the supporting-copy block below so its text clears the jacket. */}
        <div
          className="hero-reveal-shift-eoto pointer-events-none absolute inset-0 z-30"
          style={{ transform: "translateX(-3%)", ["--hero-delay" as string]: "0.48s", ["--hero-dur" as string]: "0.4s" }}
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
          style={{ transform: "translateX(-3%)", ["--hero-delay" as string]: "0.62s", ["--hero-dur" as string]: "0.4s" }}
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
          {/* DEMO fix (audit CT-05): on mobile the live two-line tagline above
              overlapped this line by 8–10 px; it now sits lower below md.
              Desktop position unchanged (raster lockup). */}
          <p className="pointer-events-none absolute left-[9.2%] top-[92.6%] md:top-[88.4%] font-body text-[clamp(0.65rem,1.4vw,1rem)] uppercase leading-none tracking-[0.25em] text-white">
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
          style={{ ["--hero-delay" as string]: "0.7s", ["--hero-dur" as string]: "0.4s" }}
          aria-hidden="true"
        />
        {/* Desktop: boxed link over the raster text (Pass-2 approved geometry) — the
            interaction language (underline reveal + press dim) sits on the baked type. */}
        <Link
          href="#what-i-do"
          aria-label="Enter the HQ"
          onClick={enterHQ}
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
          onClick={enterHQ}
          className="group absolute left-[77.2%] top-[83.1%] z-[45] -m-3 inline-flex rounded-sm p-3 before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-accent md:hidden"
        >
          <span
            className="hero-fade inline-flex items-center gap-[0.7em] font-display text-[clamp(0.875rem,2.35vw,1.35rem)] uppercase leading-none tracking-[0.06em] text-white"
            style={{ ["--hero-delay" as string]: "0.7s", ["--hero-dur" as string]: "0.4s" }}
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
          <h1>DJ LETHAL SKILLZ</h1>
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
        fetchPriority="high"
      />

      <div
        className="hero-fade absolute bottom-0 left-0 right-0 z-50 flex items-center overflow-hidden bg-accent h-[4.15%]"
        style={{ ["--hero-delay" as string]: "0.72s", ["--hero-dur" as string]: "0.35s" }}
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
