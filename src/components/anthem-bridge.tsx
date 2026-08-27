"use client";

import { useAnthem } from "@/lib/anthem-audio";

/** The HQ's own record, sitting on the deck just inside the door.
 *  Physical state only — spin, needle, pressed edge. No transport chrome. */
export function AnthemBridge() {
  const { playing, toggle } = useAnthem();

  return (
    <section aria-label="The Anthem" className="border-b border-white/10">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Stop The Anthem" : "Play The Anthem"}
        className="deck group mx-auto flex w-full max-w-[1520px] cursor-pointer flex-col items-start gap-10 px-6 py-16 text-left md:flex-row md:items-center md:gap-16 md:px-10 md:py-20"
      >
        <span className="block -rotate-[1.5deg] transition-transform duration-300 hover:rotate-0 active:translate-y-px">
          <span aria-hidden="true" className="deck-plate">
            <span className="deck-platter" />
            <svg className="deck-arm" viewBox="0 0 60 60" aria-hidden="true">
              <path
                d="M9 44 C16 40, 20 34, 22 30 C24 26, 28 25, 28 29 C28 31, 26 33, 24 34"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <rect
                x="22"
                y="31"
                width="6"
                height="4"
                rx="0.5"
                fill="rgba(255,255,255,0.55)"
              />
              <rect
                x="24.5"
                y="34.5"
                width="1.2"
                height="2"
                fill="rgba(255,255,255,0.35)"
              />
            </svg>
            <span className="deck-rest" />
            <span className="deck-pitch" />
            <span className="deck-sticker" />
          </span>
        </span>

        <span className="max-w-[440px]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted transition-colors duration-200 ease-[var(--ease-out-soft)] group-hover:text-accent group-focus-visible:text-accent">
            DJ Lethal Skillz
          </p>
          <span
            role="heading"
            aria-level={2}
            className="mt-3 block font-display text-large uppercase leading-none transition-colors duration-200 ease-[var(--ease-out-soft)] group-hover:text-accent group-focus-visible:text-accent"
          >
            The Anthem
          </span>
          <p
            aria-live="polite"
            className={`mt-5 font-arch-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
              playing ? "text-accent" : "text-muted"
            }`}
          >
            {playing ? "Now playing" : "Turn the sound on"}
          </p>
          <p className="mt-2 font-arch-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            33 rpm · 117 seconds
          </p>
        </span>
      </button>
    </section>
  );
}
