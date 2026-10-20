"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useAnthem } from "@/lib/anthem-audio";
import { coverSrc, embedUrl, releaseUrl, type BandcampRelease } from "@/lib/bandcamp";
import s from "./bandcamp.module.css";

/** A Bandcamp title with an Arabic tail ("Hidden Dagger - الخنجر المخفي") is split so
 *  the Arabic carries its own language and direction, as on the Life Archive. */
function Title({ text }: { text: string }) {
  const m = text.match(/^(.*) - ([؀-ۿ\s]+)$/);
  if (!m) return <>{text}</>;
  return (
    <>
      {m[1]} -{" "}
      <span lang="ar" dir="rtl" className="font-sans normal-case tracking-normal">
        {m[2]}
      </span>
    </>
  );
}

const meta = (r: BandcampRelease) => `${r.kind === "album" ? "Album" : "Track"}${r.year ? ` · ${r.year}` : ""}`;

/**
 * The deck and the crate. The deck shows one release large — its sleeve, the record
 * pulled out with the cover as its label, and Bandcamp's own player on request.
 * The crate below is every release by its cover; picking one puts it on the deck.
 * Nothing from Bandcamp loads until a visitor presses Listen here. One player at a
 * time: changing records unloads it, opening it stops The Anthem, and starting The
 * Anthem unloads it (it is cross-origin, so unloading is the only way to stop it).
 * Below 640px the slim player is used: the standard one crowds its artwork there.
 */
export function BandcampReleases({ releases }: { releases: BandcampRelease[] }) {
  const [current, setCurrent] = useState(releases[0].id);
  const [player, setPlayer] = useState<{ slim: boolean } | null>(null);
  const { playing, toggle } = useAnthem();
  const playerRef = useRef<HTMLIFrameElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const r = releases.find((x) => x.id === current) ?? releases[0];
  const index = releases.indexOf(r);

  // The Anthem started: unload the player (state adjusted during render, not in an effect).
  const [wasPlaying, setWasPlaying] = useState(playing);
  if (playing !== wasPlaying) {
    setWasPlaying(playing);
    if (playing) setPlayer(null);
  }

  // Move focus into the player once, when it opens — not on every re-render.
  useEffect(() => {
    if (player) playerRef.current?.focus();
  }, [player]);

  const pick = (id: number) => {
    setCurrent(id);
    setPlayer(null);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stageRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    titleRef.current?.focus({ preventScroll: true });
  };

  const href = releaseUrl(r);

  return (
    <>
      {/* The deck */}
      <section
        ref={stageRef}
        aria-labelledby="bc-deck-title"
        className={`${s.stage} scroll-mt-20`}
        style={{ "--tone": r.tone } as CSSProperties}
      >
        <div className="grid items-center gap-10 py-12 md:grid-cols-12 md:gap-12 md:py-16">
          <div className="md:col-span-7">
            <div className={`${s.composition} ${player ? s.spinning : ""}`}>
              <div className={s.sleeve}>
                <Image src={coverSrc(r)} width={r.cover} height={r.cover} alt={`Cover of ${r.title}`} priority />
                <span aria-hidden="true" className={s.sleeveEdge} />
              </div>
              {/* Keyed by release: a new record slides out each time. */}
              <div key={r.id} aria-hidden="true" className={s.disc}>
                <div className={s.discLabel}>
                  <Image src={coverSrc(r)} width={r.cover} height={r.cover} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 md:col-span-5">
            <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-[#f2a33a]">
              On the deck · {String(index + 1).padStart(2, "0")} / {String(releases.length).padStart(2, "0")}
            </p>
            <p className="mt-4 font-arch-mono text-[10px] uppercase tracking-[0.25em] text-[#f1e6cf]/60">{meta(r)}</p>
            <h2
              id="bc-deck-title"
              ref={titleRef}
              tabIndex={-1}
              className="mt-2 break-words font-display text-[clamp(2.2rem,5vw,4.5rem)] uppercase leading-[0.9] text-[#f1e6cf] outline-none"
            >
              <Title text={r.title} />
            </h2>
            {r.credit ? <p className="mt-3 text-sm text-[#f1e6cf]/70">{r.credit}</p> : null}

            {player ? (
              <iframe
                id="bc-player"
                ref={playerRef}
                src={embedUrl(r, player.slim)}
                title={`${r.title} — Bandcamp player`}
                loading="lazy"
                className={`mt-6 block w-full max-w-[560px] border-0 bg-black ${player.slim ? "h-[42px]" : "h-[120px]"}`}
              />
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {r.embeddable ? (
                <button
                  type="button"
                  aria-expanded={!!player}
                  aria-controls={player ? "bc-player" : undefined}
                  onClick={() => {
                    if (player) return setPlayer(null);
                    if (playing) toggle();
                    setPlayer({ slim: !window.matchMedia("(min-width: 640px)").matches });
                  }}
                  className="inline-flex min-h-11 items-center gap-3 rounded-full bg-[#f2a33a] py-2 pl-2 pr-6 font-arch-mono text-[11px] uppercase tracking-[0.25em] text-black transition-colors hover:bg-[#f1e6cf]"
                >
                  <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[#f2a33a]">
                    {player ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                        <path d="M1 1h8v8H1z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="10" height="12" viewBox="0 0 12 14" aria-hidden="true">
                        <path d="M2 1.2 10.2 7 2 12.8Z" fill="currentColor" />
                      </svg>
                    )}
                  </span>
                  {player ? "Close player" : "Listen here"}
                </button>
              ) : (
                <p className="font-arch-mono text-[10px] uppercase tracking-[0.25em] text-[#f1e6cf]/60">
                  No playable tracks on Bandcamp
                </p>
              )}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${r.title} on Bandcamp (opens in new tab)`}
                className="inline-flex min-h-11 items-center font-arch-mono text-[11px] uppercase tracking-[0.25em] text-[#f1e6cf]/80 transition-colors hover:text-[#f2a33a]"
              >
                Open on Bandcamp ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The crate */}
      <section aria-labelledby="bc-crate" className="pt-14 md:pt-20">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="bc-crate" className="font-display text-large uppercase leading-none text-[#f1e6cf]">
            The crate
          </h2>
          <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-[#f1e6cf]/55">
            {releases.length} releases · in Bandcamp&apos;s order · pick one
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {releases.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                aria-pressed={x.id === current}
                onClick={() => pick(x.id)}
                className={`${s.card} group pt-[14%]`}
              >
                <span className={s.cardArt}>
                  <Image src={coverSrc(x)} width={x.cover} height={x.cover} alt="" sizes="(min-width: 1280px) 190px, (min-width: 640px) 30vw, 45vw" />
                </span>
                <span className="mt-4 block font-arch-mono text-[10px] uppercase tracking-[0.22em] text-[#f1e6cf]/55">
                  {meta(x)}
                  {x.id === current ? <span className="text-[#f2a33a]"> · on the deck</span> : null}
                </span>
                <span className="mt-1.5 line-clamp-2 break-words font-display text-lg uppercase leading-[1.05] text-[#f1e6cf] transition-colors group-hover:text-[#f2a33a]">
                  <Title text={x.title} />
                </span>
              </button>
            </li>
          ))}
        </ul>
        {/* Without JS the crate can't change the deck: every release is still one link away. */}
        <noscript>
          <ul className="mt-10 grid gap-2 sm:grid-cols-2">
            {releases.map((x) => (
              <li key={x.id}>
                <a href={releaseUrl(x)} className="font-arch-mono text-[11px] uppercase tracking-[0.2em] text-[#f1e6cf]/80 underline">
                  {x.title} on Bandcamp ↗
                </a>
              </li>
            ))}
          </ul>
        </noscript>
      </section>
    </>
  );
}
