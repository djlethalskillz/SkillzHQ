import Image from "next/image";
import Link from "next/link";

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

/**
 * Hero — visual-lock implementation of SKILLZ_HERO_APPROVED_REFERENCE.png.
 *
 * The supplied approved artwork is the composition master. It is rendered
 * as the visual surface so the approved face, typography, texture, crop,
 * color and editorial relationships are preserved exactly.
 *
 * Semantic copy and an invisible CTA hotspot remain in the DOM so the
 * composition is accessible and "Enter the HQ" remains an actual link.
 */
export function Hero() {
  return (
    <section
      id="landing"
      aria-label="DJ Lethal Skillz — Each One Teach One"
      className="relative overflow-hidden bg-black scroll-mt-20"
    >
      <div className="relative mx-auto w-full max-w-[1276px] aspect-[1276/1233]">
        <Image
          src="/assets/skillz-hero-approved-reference.png"
          alt="DJ Lethal Skillz — Each One Teach One"
          fill
          priority
          sizes="(max-width: 1276px) 100vw, 1276px"
          className="object-contain"
        />

        <Link
          href="#what-i-do"
          aria-label="Enter the Skillz HQ"
          className="absolute bottom-[14.8%] right-[4%] h-[7%] w-[23%] rounded-sm focus-visible:bg-accent/20"
        />

        <div className="sr-only">
          <h1>SKILLZ</h1>
          <p>DJ LETHAL</p>
          <p>Each One Teach One</p>
          <p>Culture. Education. Turntablism. Legacy. Worldwide.</p>
          <p>Enter the HQ.</p>
        </div>
      </div>

      <div
        className="relative z-10 overflow-hidden border-t border-black bg-accent py-4"
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
