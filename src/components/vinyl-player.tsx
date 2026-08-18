"use client";

import { useRef, useState } from "react";

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const GROOVES = "repeating-radial-gradient(circle at center, #0b0b0b 0 2px, #1d1d1d 2px 4px)";

/** Tiny editorial vinyl player — one track, one play/pause moment. */
export function VinylPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };

  return (
    <section aria-label="Listen to The Anthem" className="py-6 md:py-7">
      <div className="flex items-center gap-4 md:gap-5">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={
            playing
              ? "Pause DJ Lethal Skillz — The Anthem"
              : "Play DJ Lethal Skillz — The Anthem"
          }
          className="relative h-[48px] w-[48px] shrink-0 rounded-full border border-accent/40 transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:h-[56px] md:w-[56px]"
        >
          <span
            aria-hidden="true"
            className={`absolute inset-0 rounded-full overflow-hidden ${playing ? "vinyl-spin" : ""}`}
          >
            <span className="absolute inset-0" style={{ background: GROOVES }} />
            <span className="absolute inset-0 rounded-full border border-accent/25" />
            <span className="absolute left-1/2 top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent">
              <span className="absolute left-1/2 top-1/2 h-[3.5px] w-[3.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
            </span>
          </span>
          <span className="absolute inset-0 z-10 flex items-center justify-center">
            {playing ? (
              <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
                <rect x="0.5" y="0.5" width="3.5" height="13" rx="1" fill="#ffe600" />
                <rect x="8" y="0.5" width="3.5" height="13" rx="1" fill="#ffe600" />
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
                <path d="M2 1.2 10.2 7 2 12.8Z" fill="#ffe600" />
              </svg>
            )}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted">Listen</p>
          <p className="mt-1 truncate font-display text-sm uppercase tracking-wide text-white md:text-base">
            DJ Lethal Skillz — The Anthem
          </p>
          <div
            className="mt-2 h-px w-full max-w-[220px] bg-white/10"
            role="progressbar"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={Math.round(time)}
          >
            <div
              className="h-px bg-accent transition-[width] duration-200"
              style={{ width: duration ? `${(time / duration) * 100}%` : "0%" }}
            />
          </div>
        </div>

        <p className="shrink-0 text-[10px] tabular-nums tracking-widest text-muted">
          {formatTime(time)} / {formatTime(duration)}
        </p>
      </div>

      <audio
        ref={audioRef}
        src="/assets/dj-lethal-skillz-the-anthem.mp3"
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </section>
  );
}
