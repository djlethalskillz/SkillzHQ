import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { BandcampReleases } from "@/components/bandcamp-releases";
import { BANDCAMP_URL, RELEASES } from "@/lib/bandcamp";
import s from "./bandcamp.module.css";

/**
 * PROTOTYPE (local, 2026-10-20): the music on the artist's official Bandcamp,
 * led by the release artwork — the deck (one record, large) over the crate
 * (every cover). Copy marked DRAFT is new and awaits the owner's wording.
 */
export function BandcampCatalogue() {
  return (
    <div className={`${s.page} overflow-x-clip`}>
      <div className="mx-auto w-full max-w-[1520px] px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-36">
        <header className="flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between md:pb-10">
          <Reveal>
            <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-[#f2a33a]">
              The Catalogue · djlethalskillz.bandcamp.com
            </p>
            <h1 className="mt-4 font-display text-[clamp(3.5rem,11vw,10rem)] uppercase leading-[0.82] text-[#f1e6cf]">
              Bandcamp
            </h1>
          </Reveal>
          {/* DRAFT copy */}
          <p className="max-w-[38ch] text-base leading-relaxed text-[#f1e6cf]/75 md:pb-3 md:text-right">
            Albums and tracks by DJ Lethal Skillz, as released on Bandcamp. Listen here; buy and download on Bandcamp,
            where available.
          </p>
        </header>

        <BandcampReleases releases={RELEASES} />

        <Reveal>
          <a
            href={BANDCAMP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-16 flex flex-col gap-4 rounded-sm bg-[#c4561f] px-6 py-10 text-black transition-colors hover:bg-[#f2a33a] md:mt-24 md:flex-row md:items-end md:justify-between md:px-10 md:py-14"
          >
            <span className="flex flex-col gap-3">
              <span className="font-arch-mono text-[11px] uppercase tracking-[0.3em]">The full catalogue</span>
              <span className="font-display text-giant uppercase leading-[0.9]">Open Bandcamp</span>
            </span>
            <span className="font-arch-mono text-[11px] uppercase tracking-[0.3em]">
              djlethalskillz.bandcamp.com · opens in a new tab ↗
            </span>
          </a>
        </Reveal>
        {/* DRAFT copy */}
        <p className="mt-6 max-w-[60ch] text-xs leading-relaxed text-[#f1e6cf]/55">
          This catalogue is kept by hand. Prices, downloads and purchases are handled by Bandcamp; players load only when
          you press Listen here.
        </p>

        {/* The footer's next stop already leads on to the Life Archive. */}
        <div className="mt-10 flex md:mt-12 md:justify-end">
          <Link
            href="/#landing"
            className="inline-flex min-h-11 items-center gap-3 font-display text-2xl uppercase text-[#f1e6cf] transition-colors hover:text-[#f2a33a]"
          >
            <span aria-hidden="true">←</span> Back to the HQ
          </Link>
        </div>
      </div>
    </div>
  );
}
