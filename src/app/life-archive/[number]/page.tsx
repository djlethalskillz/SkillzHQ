import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { CRATES, type LifeCrate } from "@/lib/life-archive";
import { FilmFacade } from "@/components/film-facade";
import { Reveal } from "@/components/reveal";
import { VerifyMarker } from "@/components/verify-marker";
import s from "./film.module.css";

/**
 * PREVIEW (Lane B): one static page per film in the Life Archive, built only
 * from the CRATES data and each film's local still. Unknown facts are shown
 * as [VERIFY: …] markers, never filled in.
 */

const ORIGIN = "https://djlethalskillz.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return CRATES.map((c) => ({ number: c.number }));
}

const fullTitle = (c: LifeCrate) => (c.accent ? `${c.title} ${c.accent}` : c.title);
const crateLabel = (c: LifeCrate) => `${c.label ?? "Life Crate"} ${c.number}`;
const still = (c: LifeCrate, small = false) => `/assets/life-archive/${c.youtubeId}${small ? "-640" : ""}.webp`;
const watch = (c: LifeCrate) => `https://www.youtube.com/watch?v=${c.youtubeId}${c.start ? `&t=${c.start}s` : ""}`;

/** First ~155 characters of the note, cut on a word. */
function summary(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:–-]+$/, "")}…`;
}

export async function generateMetadata({ params }: PageProps<"/life-archive/[number]">): Promise<Metadata> {
  const { number } = await params;
  const c = CRATES.find((x) => x.number === number);
  if (!c) return {};
  const title = `${fullTitle(c)} · Life Archive · DJ Lethal Skillz`;
  const description = summary(c.note ?? fullTitle(c));
  const url = `${ORIGIN}/life-archive/${c.number}`;
  const image = `${ORIGIN}${still(c)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "DJ Lethal Skillz",
      type: "video.other",
      images: [{ url: image, alt: fullTitle(c) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Uneven on purpose: the related records step down the page like a beat. */
const RHYTHM = ["md:col-span-5", "md:col-span-4 md:mt-12", "md:col-span-3 md:mt-6"];

export default async function FilmPage({ params }: PageProps<"/life-archive/[number]">) {
  const { number } = await params;
  const i = CRATES.findIndex((c) => c.number === number);
  if (i < 0) notFound();
  const c = CRATES[i];
  const newer = CRATES[i - 1];
  const older = CRATES[i + 1];
  const meta = [c.year, c.place].filter(Boolean).join(" · ");
  const missing = [!c.year && "year", !c.place && "place", "credits", "upload date"].filter(Boolean).join(" · ");
  const url = `${ORIGIN}/life-archive/${c.number}`;

  // Same series = an explicit shared label (e.g. Music Video Archive Vol. 1 ↔ Vol. 2).
  const related: { kind: string; crate: LifeCrate }[] = [
    ...(c.label
      ? CRATES.filter((o) => o !== c && o.label === c.label && o !== newer && o !== older).map((crate) => ({
          kind: "Same series",
          crate,
        }))
      : []),
    ...(newer ? [{ kind: "Previous record", crate: newer }] : []),
    ...(older ? [{ kind: "Next record", crate: older }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: fullTitle(c),
    description: c.note ?? fullTitle(c),
    thumbnailUrl: `${ORIGIN}${still(c)}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${c.youtubeId}`,
    url,
    author: { "@id": `${ORIGIN}/#person` },
    // uploadDate is omitted until an approved value exists (OPEN-QUESTIONS.md)
  };

  return (
    <ViewTransition enter="doc-cut-in" exit="doc-cut-out" default="none">
      <div className="overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <article
          aria-labelledby="film-title"
          className="mx-auto w-full max-w-[1520px] px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-36"
        >
          <Reveal>
            <Link
              href={`/life-archive#crate-${c.number}`}
              className="inline-flex min-h-11 items-center gap-2 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-accent"
            >
              <span aria-hidden="true">←</span> Life Archive
            </Link>
            <p className="mt-8 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              {crateLabel(c)}
              {meta ? <span className="text-white/60"> · {meta}</span> : null}
            </p>
            <h1
              id="film-title"
              className="mt-4 max-w-[20ch] text-balance break-words font-display text-[clamp(2.4rem,6vw,6rem)] uppercase leading-[0.9]"
            >
              {c.title} {c.accent ? <span className="text-accent">{c.accent}</span> : null}
            </h1>
          </Reveal>

          <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-8">
              <div className={s.frame}>
                <div className={s.gate}>
                  <FilmFacade
                    youtubeId={c.youtubeId}
                    title={fullTitle(c)}
                    start={c.start}
                    still={still(c)}
                    stillSmall={still(c, true)}
                    priority
                  />
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-4 lg:self-end">
              {c.note ? <p className="text-base leading-relaxed text-white/80 md:text-[17px]">{c.note}</p> : null}
              <a
                href={watch(c)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-accent"
              >
                Watch on YouTube <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <section
            aria-labelledby="film-provenance"
            className={`${s.pace} mt-16 grid gap-6 border-t border-white/10 pt-8 md:mt-24 lg:grid-cols-12 lg:gap-12`}
          >
            <h2
              id="film-provenance"
              className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/50 lg:col-span-3"
            >
              Provenance
            </h2>
            <div className="min-w-0 lg:col-span-6 lg:col-start-5">
              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 font-arch-mono text-[11px] uppercase tracking-[0.2em] sm:gap-x-10">
                <dt className="text-white/50">Record</dt>
                <dd className="text-white/85">{crateLabel(c)}</dd>
                {c.year ? (
                  <>
                    <dt className="text-white/50">Year</dt>
                    <dd className="text-white/85">{c.year}</dd>
                  </>
                ) : null}
                {c.place ? (
                  <>
                    <dt className="text-white/50">Place</dt>
                    <dd className="text-white/85">{c.place}</dd>
                  </>
                ) : null}
                <dt className="text-white/50">Source</dt>
                <dd className="break-words text-white/85">YouTube · {c.youtubeId}</dd>
                <dt className="text-white/50">Captions</dt>
                <dd>
                  <VerifyMarker>captions on YouTube?</VerifyMarker>
                </dd>
              </dl>
              <p className="mt-6">
                <VerifyMarker>{missing}</VerifyMarker>
              </p>
            </div>
          </section>

          <nav aria-labelledby="film-related" className={`${s.pace} mt-16 border-t border-white/10 pt-8 md:mt-24`}>
            <h2 id="film-related" className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              More from the crate
            </h2>
            <ul className="mt-8 grid gap-10 md:grid-cols-12 md:gap-8">
              {related.map(({ kind, crate }, n) => (
                <li key={crate.number} className={RHYTHM[n] ?? "md:col-span-4"}>
                  <Link href={`/life-archive/${crate.number}`} className="group block">
                    <img
                      src={still(crate, true)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-video w-full bg-black object-cover opacity-85 transition-opacity group-hover:opacity-100"
                    />
                    <span className="mt-4 block font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                      {kind} <span className="text-white/60">· {crateLabel(crate)}</span>
                    </span>
                    <span className="mt-2 block break-words font-display text-2xl uppercase leading-[0.95] transition-colors group-hover:text-accent">
                      {fullTitle(crate)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-16 border-t border-white/10 pt-8 md:mt-24">
            <Link
              href={`/life-archive#crate-${c.number}`}
              className="inline-flex min-h-11 items-center gap-3 font-display text-2xl uppercase text-white transition-colors hover:text-accent"
            >
              <span aria-hidden="true">←</span> Back to the crate
            </Link>
          </div>
        </article>
      </div>
    </ViewTransition>
  );
}
