"use client";

import { useRef, useState } from "react";

type FilmFacadeProps = {
  youtubeId: string;
  /** Accessible film title (used for the play label and the iframe title). */
  title: string;
  /** Local still (the film's own YouTube cover, see the asset register). */
  still: string;
  stillSmall?: string;
  start?: number;
  /** Load the still eagerly (first film on a page). */
  priority?: boolean;
};

/**
 * DEMO: on-demand film player (audit CT-08).
 * Server HTML = a real link to the film on YouTube wrapping its still, so the
 * film is reachable with JS off or embeds blocked. With JS, activating it runs
 * a short projector flicker over the still, then mounts the privacy-enhanced
 * player in place and moves focus into it. Nothing from YouTube loads until
 * the visitor asks for it.
 */
export function FilmFacade({ youtubeId, title, still, stillSmall, start, priority }: FilmFacadeProps) {
  const [state, setState] = useState<"poster" | "flick" | "player">("poster");
  const [broken, setBroken] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const watchHref = `https://www.youtube.com/watch?v=${youtubeId}${start ? `&t=${start}s` : ""}`;
  const embed = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1${start ? `&start=${start}` : ""}`;

  function play(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let new-tab gestures through
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
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
          ref={(el) => {
            frameRef.current = el;
            el?.focus();
          }}
          src={embed}
          title={`${title} — YouTube`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <a
      href={watchHref}
      onClick={play}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Play film: ${title}`}
      className="group/film relative block aspect-video w-full overflow-hidden bg-black"
    >
      {broken ? (
        <span className="absolute inset-0 flex items-end bg-[#111] p-6">
          <span className="font-display text-2xl uppercase leading-none text-white/80">{title}</span>
        </span>
      ) : (
        <img
          src={still}
          srcSet={stillSmall ? `${stillSmall} 640w, ${still} 1280w` : undefined}
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setBroken(true)}
          className={`absolute inset-0 h-full w-full object-contain transition-transform duration-700 ease-out group-hover/film:scale-[1.015] ${
            state === "flick" ? "projector-flick" : ""
          }`}
        />
      )}
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-black/75 py-2 pl-2 pr-5 backdrop-blur-sm transition-colors group-hover/film:bg-accent group-focus-visible/film:bg-accent md:bottom-6 md:left-6"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-black transition-colors group-hover/film:bg-black group-hover/film:text-accent">
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M2 1.2 10.2 7 2 12.8Z" fill="currentColor" />
          </svg>
        </span>
        <span className="font-arch-mono text-[11px] uppercase tracking-[0.25em] text-white transition-colors group-hover/film:text-black">
          Play film
        </span>
      </span>
    </a>
  );
}
