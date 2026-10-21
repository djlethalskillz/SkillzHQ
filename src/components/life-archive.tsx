import Link from "next/link";
import { site } from "@/lib/site";
import { CRATES } from "@/lib/life-archive";
import { Reveal } from "@/components/reveal";
import { ArchiveRecord } from "@/components/archive-record";
import { SpatialArchive } from "@/components/spatial-archive";
import { Inscription } from "@/components/arabic-inscription";

/** المعرفة قوة with its English caption: the Arabic is never shown without it. */
function KnowledgeNote({ className }: { className: string }) {
  return (
    <figure className={className}>
      <Inscription phrase="knowledge" className="la-note-art" />
      <figcaption className="mt-2 font-arch-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
        <span lang="ar" dir="rtl" className="font-sans text-[12px] normal-case tracking-normal">
          المعرفة قوة
        </span>{" "}
        · Knowledge is power
      </figcaption>
    </figure>
  );
}

export function LifeArchive() {
  return (
    <div className="la-identity overflow-x-clip">
      <div className="mx-auto w-full max-w-[1520px] px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
        {/* Masthead: the archive is a record you are about to play. */}
        <header className="grid items-center gap-12 pb-12 md:grid-cols-12 md:pb-20">
          <Reveal className="md:col-span-7">
            <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">The Archive</p>
            <h1 className="mt-5 font-display text-[clamp(4rem,13vw,12.5rem)] uppercase leading-[0.82]">
              Life
              <br />
              Archive
            </h1>
            <p className="mt-8 max-w-[44ch] text-base leading-relaxed text-white/75 md:text-lg">
              Films from the life and work of DJ Lethal Skillz, kept here by hand.
            </p>
            <p className="mt-6 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              {CRATES.length} films · newest first
            </p>
          </Reveal>
          <div className="relative md:col-span-5">
            <ArchiveRecord className="mx-auto w-[min(78vw,460px)]">
              <div className="record-label">
                <div className="record-spin flex h-full w-full flex-col items-center justify-center rounded-full">
                  <span className="font-arch-mono text-[clamp(7px,0.9vw,10px)] uppercase tracking-[0.3em]">SkillzHQ</span>
                  <span className="mt-1 font-display text-[clamp(1.1rem,2.6vw,2.2rem)] uppercase leading-none">Life Archive</span>
                  <span className="mt-1 font-arch-mono text-[clamp(7px,0.9vw,10px)] uppercase tracking-[0.3em]">
                    {CRATES[CRATES.length - 1].number} — {CRATES[0].number}
                  </span>
                </div>
              </div>
            </ArchiveRecord>
          </div>
        </header>

        {/* The crate: dig through the films in space, read the one you pull. */}
        <section aria-label="Flip through the crate" className="la-rule relative pt-8 md:pt-10">
          {/* The name in Arabic stands on the crate rule, its tall strokes
              tucked behind the record; the caption beside it carries the words. */}
          <Inscription phrase="name" className="la-name" />
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-arch-mono text-[11px] uppercase tracking-[0.3em] md:mb-8">
            <p className="text-white/50">Flip through the crate</p>
            <p className="text-white/60">
              <span lang="ar" dir="rtl" className="font-sans text-[13px] normal-case tracking-normal">
                مهارات قاتلة
              </span>{" "}
              · Lethal Skillz
            </p>
          </div>
          <KnowledgeNote className="la-note la-note--field" />
          <SpatialArchive crates={CRATES} />
        </section>

        <Reveal>
          <div className="la-rule relative mt-16 flex flex-col gap-6 pt-10 md:mt-24 md:flex-row md:items-center md:justify-between md:pt-12">
            {/* Phones: the knowledge note closes the page instead of sitting by the crate. */}
            <KnowledgeNote className="la-note la-note--close" />
            <a
              href={site.media.youtube!.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-accent"
            >
              More films on {site.media.youtube!.label} ↗
            </a>
            {/* The other half of the archive: people, places and moments live in Fragments on the HQ. */}
            <Link
              href="/#what-i-do"
              className="inline-flex min-h-11 items-center font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-accent"
            >
              People, places, moments: Fragments →
            </Link>
            <Link
              href="/#landing"
              className="inline-flex min-h-11 items-center gap-3 font-display text-2xl uppercase text-white transition-colors hover:text-accent"
            >
              <span aria-hidden="true">←</span> Back to the HQ
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
