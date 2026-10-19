import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { FilmFacade } from "@/components/film-facade";
import { ArchiveRecord } from "@/components/archive-record";

type LifeCrate = {
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
const CRATES: LifeCrate[] = [
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

const RTL = /[֐-ࣿ]/;

/** Title assembled word by word on scroll (CSS view timeline). Strings with
 *  right-to-left script are never split, so Arabic keeps its shaping and
 *  reading order. The full title is exposed once to assistive tech. */
function TitleWords({ text, offset = 0, accent = false }: { text: string; offset?: number; accent?: boolean }) {
  const parts = text.split(" ").reduce<string[]>((acc, w) => {
    if (RTL.test(w) && acc.length && RTL.test(acc[acc.length - 1])) acc[acc.length - 1] += ` ${w}`;
    else acc.push(w);
    return acc;
  }, []);
  return (
    <>
      {parts.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={`w ${accent ? "text-accent" : ""}`}
          dir={RTL.test(w) ? "rtl" : undefined}
          style={{ ["--i" as string]: offset + i }}
        >
          {w}
          {i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function crateId(c: LifeCrate) {
  return `crate-${c.number}`;
}

function Sleeve({ crate, priority }: { crate: LifeCrate; priority?: boolean }) {
  const fullTitle = crate.accent ? `${crate.title} ${crate.accent}` : crate.title;
  const meta = [crate.year, crate.place].filter(Boolean).join(" · ");
  return (
    <div className="sleeve">
      <div aria-hidden="true" className="sleeve-disc" />
      <figure className="sleeve-face">
        <FilmFacade
          youtubeId={crate.youtubeId}
          title={fullTitle}
          start={crate.start}
          still={`/assets/life-archive/${crate.youtubeId}.webp`}
          stillSmall={`/assets/life-archive/${crate.youtubeId}-640.webp`}
          priority={priority}
        />
        <figcaption className="absolute bottom-[10px] left-[14px] right-[14px] flex items-baseline justify-between gap-4 font-arch-mono text-[10px] uppercase tracking-[0.16em] text-black/70 md:bottom-[14px]">
          <span>
            {crate.label ?? "Life Crate"} {crate.number}
          </span>
          {meta ? <span>{meta}</span> : null}
        </figcaption>
      </figure>
    </div>
  );
}

function CrateText({ crate, big }: { crate: LifeCrate; big?: boolean }) {
  const fullTitle = crate.accent ? `${crate.title} ${crate.accent}` : crate.title;
  const watchHref = `https://www.youtube.com/watch?v=${crate.youtubeId}${crate.start ? `&t=${crate.start}s` : ""}`;
  const titleWords = crate.title.split(" ").length;
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="slate-num pointer-events-none absolute -top-[0.42em] right-0 select-none text-[clamp(6rem,14vw,13rem)] md:-top-[0.5em]"
      >
        {crate.number}
      </span>
      <p className="relative font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        {crate.label ?? "Life Crate"} {crate.number}
      </p>
      <h2
        className={`relative mt-5 font-display uppercase leading-[0.92] md:mt-6 ${
          big ? "text-[clamp(2.6rem,6.4vw,6.8rem)]" : "text-[clamp(1.9rem,3.4vw,3.4rem)]"
        }`}
      >
        <span className="sr-only">{fullTitle}</span>
        <span aria-hidden="true" className="title-words">
          <TitleWords text={crate.title} />
          {crate.accent ? (
            <>
              {" "}
              <TitleWords text={crate.accent} offset={titleWords} accent />
            </>
          ) : null}
        </span>
      </h2>
      {crate.note ? (
        <p className="relative mt-6 max-w-[48ch] text-sm leading-relaxed text-white/70 md:text-[15px]">{crate.note}</p>
      ) : null}
      <a
        href={watchHref}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-6 inline-flex min-h-11 items-center gap-2 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-accent"
      >
        Watch on YouTube <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

function Crate({ crate, index }: { crate: LifeCrate; index: number }) {
  if (index === 0) {
    // The newest record leads at full scale — the crate's front sleeve.
    return (
      <article id={crateId(crate)} className="scroll-mt-24 border-t border-white/10 py-16 md:py-28">
        <Reveal>
          <div className="grid gap-14 md:grid-cols-12 md:gap-x-10 md:gap-y-16">
            <div className="md:col-span-12 md:pr-[8%]">
              <Sleeve crate={crate} priority />
            </div>
            <div className="md:col-span-10 md:col-start-2">
              <CrateText crate={crate} big />
            </div>
          </div>
        </Reveal>
      </article>
    );
  }
  // Rhythm before symmetry: sleeves alternate sides and drift off the grid.
  const flip = index % 2 === 1;
  return (
    <article id={crateId(crate)} className="scroll-mt-24 border-t border-white/10 py-16 md:py-24">
      <Reveal>
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div
            className={`md:col-span-7 ${
              flip ? "md:order-2 md:col-start-6 md:mt-16 md:pr-[6%]" : "md:pr-[8%]"
            }`}
          >
            <Sleeve crate={crate} />
          </div>
          <div className={`md:col-span-5 ${flip ? "md:order-1 md:col-start-1" : "md:pl-4"}`}>
            <CrateText crate={crate} />
          </div>
        </div>
      </Reveal>
    </article>
  );
}

export function LifeArchive() {
  return (
    <div className="overflow-x-clip">
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

        {/* Crate index: the spines, newest to oldest. Native horizontal
            scroll on small screens (no scroll hijacking). */}
        <nav aria-label="Films in the archive" className="border-t border-white/10 pt-8">
          <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/50">Flip through the crate</p>
          <ol className="-mx-6 mt-6 flex gap-2 overflow-x-auto px-6 pb-4 pt-4 md:mx-0 md:grid md:grid-cols-10 md:overflow-visible md:px-0">
            {CRATES.map((c) => (
              <li key={c.number} className="shrink-0">
                <a
                  href={`#${crateId(c)}`}
                  className="spine flex h-52 w-16 flex-col gap-3 overflow-hidden border border-white/15 bg-[#121212] px-2 py-3 text-white md:h-64 md:w-auto"
                >
                  <span className="font-display text-2xl leading-none">{c.number}</span>
                  {/* The spine carries the film's own title, read bottom-to-top
                      like a record on a shelf; clipped by the spine's height. */}
                  <span
                    aria-hidden="true"
                    className="min-h-0 flex-1 self-center overflow-hidden whitespace-nowrap font-display text-[15px] uppercase leading-none tracking-wide [writing-mode:vertical-rl] rotate-180"
                  >
                    {c.title.replace(/[|:,-]+\s*$/, "").trim()}
                  </span>
                  <span className="sr-only">{c.accent ? `${c.title} ${c.accent}` : c.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10">
          {CRATES.map((crate, i) => (
            <Crate key={crate.number} crate={crate} index={i} />
          ))}
        </div>

        <Reveal>
          <div className="flex flex-col gap-6 border-t border-white/10 pt-10 md:flex-row md:items-center md:justify-between md:pt-12">
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
