import Link from "next/link";
import { site } from "@/lib/site";
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

export type LifeCrate = {
  /** Crate designation — the entry number, oldest to newest. */
  number: string;
  /** Label shown before the number; defaults to "Life Crate". */
  label?: string;
  /** Official title, verbatim — white portion. */
  title: string;
  /** Editorial accent tail of the title (yellow), e.g. "| DJ Lethal Skillz". */
  accent?: string;
  youtubeId: string;
  /** Optional embed start offset in seconds (from the source URL). */
  start?: number;
  /** Year — shown as metadata only when it appears in the source material. */
  year?: string;
  /** Place — shown as metadata only when it appears in the source material. */
  place?: string;
  /** Short editorial text — supplied per crate, none yet. */
  note?: string;
};

/**
 * The Life Archive — newest first. Manually maintained: future crates are
 * added by hand at the top of this list. No CMS, no database.
 * Editorial notes are first-person archive copy, used verbatim.
 * DEMO: data identical to production b226695; presentation only changed.
 * Each film's still is its own YouTube cover, stored locally at
 * /assets/life-archive/<youtubeId>.webp (see the asset register).
 */
export const CRATES: LifeCrate[] = [
  {
    number: "10",
    label: "Music Video Archive",
    title: "DJ LETHAL SKILLZ MUSIC VIDEO ARCHIVE",
    accent: "· VOL. 2",
    youtubeId: "9oT5hj4XVXA",
    note: "The crate gets deeper. Volume 2 moves through records, collaborations and images from Lebanon to Malaysia, Indonesia, Detroit, Turkey, Austria and Egypt. Some of these records were released. Some lived in the archive. This isn't a greatest hits reel. It's a document of the work, the people around it, and the places it travelled through.",
  },
  {
    number: "09",
    title: "AL JISR | الجسر - A Short Documentary Film",
    accent: "· Big Hass × DJ Lethal Skillz",
    youtubeId: "nmNOF_aVE2I",
    note: "A short documentary film about a bridge built through music. A story about hip-hop, culture, connection, and the relationship between artists and scenes across Beirut, Dubai, and beyond.",
  },
  {
    number: "08",
    label: "Music Video Archive",
    title: "DJ Lethal Skillz - Music Video Archive",
    accent: "· Vol. 1",
    youtubeId: "OD4WStbsP6k",
    note: "For a long time, I was told I was crazy. I left the corporate world to make music. At the time, none of it looked like an archive. It was just life. This first volume brings together fragments from that journey: different years, different places, different people, connected through the music and the work. This is Volume 1. And I'm still digging.",
  },
  {
    number: "07",
    title: "Why Does Hip Hop Mention Beirut? |",
    accent: "Volume 2 (2007–2018)",
    youtubeId: "sDNSaki3DMY",
    year: "2007–2018",
    note: "Beirut has appeared in hip hop records across the world for decades. Volume 2 continues the archive with 14 documented references from 2007 to 2018, tracing how Beirut appeared in the work of artists from different countries, scenes and generations. This is an ongoing documentary archive, not a definitive list.",
  },
  {
    number: "06",
    title: "I Grew Up in Beirut.",
    accent: "Hip Hop Kept Saying Its Name.",
    youtubeId: "3Ev_4wHD1Rw",
    note: "As a kid I listened to American hip hop and French rap, and every now and then a record would say my city's name. Usually it meant war. Digging through the crates, I kept finding Beirut and Lebanon in records I already owned. The film puts 45 of those mentions, from 1991 to 2009, in chronological order, each one played from the record itself. This is the Beirut episode.",
  },
  {
    number: "05",
    title: "Lebanese DJ History, From My View:",
    accent: "Turntablism Before the Internet",
    youtubeId: "fqUqwGuvFEc",
    note: "There was a whole DJ culture in Lebanon that most people never saw: pirate radio, cassettes, VHS, underground battles, records with their labels covered so no one could see what was being played. I grew up in Beirut during the war and learned turntablism from tapes, with no tutorials and no internet. This is my own view of that history, not the complete one.",
  },
  {
    number: "04",
    title: "A Rap Show Hired Me. I Wasn't the Rapper. |",
    accent: "Lebanon 2015",
    youtubeId: "tVs4qlzzU00",
    year: "2015",
    place: "Lebanon",
    note: "In 2015, the Malaysian TV production Hip Hoppin' Asia: The Saga Continues came to Lebanon to explore hip hop culture, and I was hired as its Location Manager. Years later, I went back through the original episode and cut this LifeCrate edit: not the full episode, but my personal archival look at that chapter.",
  },
  {
    number: "03",
    title: "PhonoSapien: The Monk of the Third World",
    accent: "| DJ Lethal Skillz",
    youtubeId: "hgnKf271RoY",
    start: 1,
    note: "PhonoSapien was another side of DJ Lethal Skillz, taking the story beyond hip hop and turntablism into visual art, spirituality, martial arts and the world of Dragon Temple. This chapter traces that strange creative path from Beirut to Malaysia, and the collaboration with Atomsk that helped bring the vision to life.",
  },
  {
    number: "02",
    title: "961 Underground: Before It Had a Name,",
    accent: "There Was Beirut",
    youtubeId: "xUCS6ZBpfHo",
    note: "Before 961 Underground had a name, a generation of DJs, MCs, writers, breakers and graffiti artists were already building an underground culture in Beirut. This chapter looks back at that scene from my perspective, and at the people, records, places and connections that eventually became part of 961 Underground.",
  },
  {
    number: "01",
    title: "Safeit bi 3akss el Seir |",
    accent: "Beirut, 1998",
    youtubeId: "Cqz5Vmz0Lm8",
    year: "1998",
    place: "Beirut",
    note: "In 1998, I put my turntables in the middle of a Beirut intersection for a music video by Aks'es Seir. Shot on a small video camera with borrowed clothes, old DMC gear and a yellow Mustang, the footage later became something more than a music video: a document of Beirut and an early Lebanese hip hop scene.",
  },
];

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
