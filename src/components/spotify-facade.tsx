"use client";

import { useState } from "react";

/**
 * DEMO: on-demand Spotify player. Server HTML is a plain link to the artist
 * page; with JS the visitor can drop the needle and load the embed in place.
 * Nothing from Spotify loads until asked.
 */
export function SpotifyFacade({ embed, href }: { embed: string; href: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        ref={(el) => el?.focus()}
        src={embed}
        title="Skillz on Spotify — artist profile"
        allow="encrypted-media; clipboard-write; fullscreen"
        className="mt-8 h-[352px] w-full shrink-0 border-0 bg-black"
      />
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        setLoaded(true);
      }}
      aria-label="Load the Spotify player"
      className="group/sp relative mt-8 flex h-[352px] w-full shrink-0 items-center justify-center overflow-hidden bg-black"
    >
      <span aria-hidden="true" className="record absolute w-[300px] transition-transform duration-700 ease-out group-hover/sp:rotate-[30deg]">
        <span className="record-sheen" />
        <span className="record-label">
          <span className="font-display text-xl uppercase leading-none">Listen</span>
          <span className="mt-1 font-arch-mono text-[9px] uppercase tracking-[0.25em]">Spotify</span>
        </span>
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-black/80 py-2 pl-2 pr-5 transition-colors group-hover/sp:bg-accent"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-black transition-colors group-hover/sp:bg-black group-hover/sp:text-accent">
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M2 1.2 10.2 7 2 12.8Z" fill="currentColor" />
          </svg>
        </span>
        <span className="font-arch-mono text-[11px] uppercase tracking-[0.25em] text-white transition-colors group-hover/sp:text-black">
          Drop the needle
        </span>
      </span>
    </a>
  );
}
