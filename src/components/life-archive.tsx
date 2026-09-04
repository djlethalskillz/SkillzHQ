import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";

type LifeCrate = {
  /** Crate designation — the entry number, oldest to newest. */
  number: string;
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
 */
const CRATES: LifeCrate[] = [
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

function CrateEmbed({ crate, title }: { crate: LifeCrate; title: string }) {
  const start = crate.start ? `?start=${crate.start}` : "";
  const src = `https://www.youtube-nocookie.com/embed/${crate.youtubeId}${start}`;
  return (
    <iframe
      src={src}
      title={`${title} — YouTube`}
      loading="lazy"
      allow="encrypted-media; fullscreen; picture-in-picture"
      className="aspect-video w-full border-0 bg-black"
    />
  );
}

function Crate({ crate, index, latest }: { crate: LifeCrate; index: number; latest: boolean }) {
  const meta = [crate.year, crate.place].filter(Boolean).join(" · ");
  const watchHref = `https://www.youtube.com/watch?v=${crate.youtubeId}${
    crate.start ? `&t=${crate.start}s` : ""
  }`;
  // Full approved title (white base + yellow accent tail), also used for the
  // iframe's accessible name.
  const fullTitle = crate.accent ? `${crate.title} ${crate.accent}` : crate.title;
  return (
    <Reveal delay={index * 60}>
      <article className="border-t border-white/10 py-16 md:py-24">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            Life Crate {crate.number}
          </p>
          <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            {meta ? (
              <>
                {meta}
                <span aria-hidden="true"> · </span>
              </>
            ) : null}
            <a
              href={watchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 transition-colors hover:text-accent"
            >
              Watch on YouTube
            </a>
          </p>
        </div>
        <h2
          className={`mt-6 font-display uppercase leading-[0.95] md:mt-8 ${
            latest ? "text-giant" : "text-large"
          }`}
        >
          {crate.title}
          {crate.accent ? (
            <>
              {" "}
              <span className="text-accent">{crate.accent}</span>
            </>
          ) : null}
        </h2>
        {crate.note ? (
          <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted md:mt-6">
            {crate.note}
          </p>
        ) : null}
        <div className="mt-10 md:mt-14">
          <CrateEmbed crate={crate} title={fullTitle} />
        </div>
      </article>
    </Reveal>
  );
}

export function LifeArchive() {
  return (
    <div className="mx-auto w-full max-w-[1520px] px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
      {/* Masthead — header sits absolutely over the page, so the archive
          opens below it with the same vertical scale as a hero. */}
      <Reveal>
        <header className="border-b border-white/10 pb-10 md:pb-14">
          <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            The Archive
          </p>
          <h1 className="mt-5 font-display text-giant uppercase leading-none">
            Life Archive
          </h1>
          <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-muted md:mt-8 md:text-base">
            Films from the life and work of DJ Lethal Skillz, kept here by
            hand.
          </p>
        </header>
      </Reveal>

      {/* Newest entry first. */}
      {CRATES.map((crate, i) => (
        <Crate key={crate.number} crate={crate} index={i} latest={i === 0} />
      ))}

      <Reveal>
        <div className="border-t border-white/10 pt-10 md:pt-12">
          <a
            href={site.media.youtube!.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-accent"
          >
            More films on {site.media.youtube!.label}
          </a>
        </div>
      </Reveal>
    </div>
  );
}
