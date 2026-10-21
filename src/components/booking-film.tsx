"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { useAnthem } from "@/lib/anthem-audio";

/**
 * Booking film announcement — the campaign lives here and only here.
 * Swap this object (or remove <BookingFilm /> from page.tsx) when the
 * Nov — Dec 2026 run is over. No date logic on purpose.
 */
const BOOKING_FILM = {
  youtubeId: "4OoHG8r1bDU",
  title: "DJ Lethal Skillz booking film",
  marker: "Nov — Dec 2026",
  secondTier: ["Beirut & the Middle East", "Nov — Dec 2026"],
  copy: "Back in the region for the first time in two years. Booking club and festival sets, turntablism workshops and talks across Beirut and the Middle East.",
  services: ["Perform", "Teach", "Speak"],
  cta: { label: "Book Skillz", href: "/book" },
  // The booking address printed in the EPK (DJ_LETHAL_SKILLZ_EPK.pdf, p.2) —
  // the fallback when the enquiry form can't deliver (owner confirmed 2026-10-21).
  email: "bookings@djlethalskillz.com",
};

/**
 * Poster -> player. The poster is the film's own YouTube cover, stored locally
 * like every Life Archive still, so nothing loads from YouTube until the visitor
 * presses play; then the privacy-enhanced player mounts and the HQ's Anthem
 * stops so two soundtracks never overlap.
 */
function Film() {
  const { youtubeId, title } = BOOKING_FILM;
  const { playing, toggle } = useAnthem();
  const [state, setState] = useState<"poster" | "flick" | "player">("poster");
  const poster = `/assets/booking-film/${youtubeId}.jpg`;

  function play() {
    if (playing) toggle();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("player");
      return;
    }
    setState("flick");
    window.setTimeout(() => setState("player"), 420);
  }

  if (state === "player") {
    return (
      <div className="relative aspect-video w-full bg-black">
        <iframe
          ref={(el) => el?.focus()}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0`}
          title={`${title}: Beirut & the Middle East, Nov — Dec 2026 (YouTube)`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={play}
      aria-label={`Play the ${title}`}
      className="group/film relative block aspect-video w-full cursor-pointer overflow-hidden bg-black"
    >
      <img
        src={poster}
        alt=""
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/film:scale-[1.015] ${
          state === "flick" ? "projector-flick" : ""
        }`}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-3 flex items-center gap-3 rounded-full bg-black/75 p-1.5 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:py-2 sm:pl-2 sm:pr-5 transition-colors group-hover/film:bg-accent group-focus-visible/film:bg-accent md:bottom-6 md:left-6"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-black transition-colors group-hover/film:bg-black group-hover/film:text-accent group-focus-visible/film:bg-black group-focus-visible/film:text-accent">
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M2 1.2 10.2 7 2 12.8Z" fill="currentColor" />
          </svg>
        </span>
        <span className="hidden font-arch-mono text-[11px] uppercase tracking-[0.25em] text-white transition-colors sm:inline group-hover/film:text-black group-focus-visible/film:text-black">
          Play film
        </span>
      </span>
    </button>
  );
}

/** Between the hero and What I Do: the film is the evidence, the type is the moment. */
export function BookingFilm() {
  const { marker, secondTier, copy, services, cta, email } = BOOKING_FILM;

  return (
    <section
      id="booking-film"
      aria-labelledby="booking-film-heading"
      className="mx-auto w-full max-w-[1520px] px-6 pb-16 pt-24 scroll-mt-20 md:px-10 md:pb-24 md:pt-40"
    >
      <Reveal>
        <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">{marker}</p>
        <h2
          id="booking-film-heading"
          className="mt-5 font-display text-[clamp(3rem,calc(8.5vw+1.875rem),11rem)] uppercase leading-[0.92]"
        >
          <span className="block">Beirut.</span>{" "}
          <span className="block lg:pl-[10%]">
            <span className="block lg:inline">I’m coming</span> <span className="block lg:inline">home.</span>
          </span>
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-9">
          <Film />
        </Reveal>

        <Reveal delay={100} className="lg:col-span-3 lg:self-end">
          <p className="font-arch-mono text-[11px] uppercase leading-relaxed tracking-[0.25em] text-white">
            {secondTier.map((part, i) => (
              <span key={part}>
                <span className="whitespace-nowrap">
                  {part}
                  {i < secondTier.length - 1 ? " ·" : ""}
                </span>{" "}
              </span>
            ))}
          </p>
          <p className="mt-5 max-w-[44ch] text-pretty text-sm leading-relaxed text-muted md:text-base">{copy}</p>
          <p className="mt-6 font-display text-2xl uppercase leading-none text-white/80">
            {services.join(" · ")}
          </p>
          <a
            href={cta.href}
            className="mt-8 inline-block rounded-full bg-accent px-8 py-4 font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
          >
            {cta.label}
          </a>
          <p className="mt-5 font-arch-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
            Or email{" "}
            <a
              href={`mailto:${email}`}
              className="normal-case tracking-normal text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-accent"
            >
              {email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
