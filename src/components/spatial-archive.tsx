"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { FilmFacade } from "@/components/film-facade";
import type { LifeCrate } from "@/lib/life-archive";

const fullTitle = (c: LifeCrate) => (c.accent ? `${c.title} ${c.accent}` : c.title);
const meta = (c: LifeCrate) => [c.year, c.place].filter(Boolean).join(" · ");
const watch = (c: LifeCrate) => `https://www.youtube.com/watch?v=${c.youtubeId}${c.start ? `&t=${c.start}s` : ""}`;
const label = (c: LifeCrate) => `${c.label ?? "Life Crate"} ${c.number}`;

const VIEW = { yaw: -26, pitch: -14 };
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * The Life Archive as a record crate in space (approved from the Creative
 * Interaction Lab, 2026-10-19). One perspective camera and one preserve-3d
 * scene graph — crate floor, four walls, ten two-sided records — in native
 * CSS 3D: no WebGL, no library. Digging works like a record shop: records in
 * front of the selection fall forward, the selection is pulled up, the rest
 * lean back. Every record is a real button; drag, keys and buttons all work,
 * and the selected film's story is always readable beside the crate.
 *
 * All ten stories are server-rendered (crawlable, readable with JS off, where
 * they simply stack as a list); with JS only the selected one is shown.
 * Each story keeps its original #crate-NN anchor, so old links still land.
 */
export function SpatialArchive({ crates }: { crates: LifeCrate[] }) {
  const [sel, setSel] = useState(0);
  const [view, setView] = useState(VIEW);
  const records = useRef<(HTMLButtonElement | null)[]>([]);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number; moved: boolean } | null>(null);
  const dragged = useRef(false);

  const select = useCallback(
    (i: number, focus = false) => {
      const next = clamp(i, 0, crates.length - 1);
      setSel(next);
      // Keep the place shareable without adding history entries.
      window.history.replaceState(null, "", `#crate-${crates[next].number}`);
      if (focus) requestAnimationFrame(() => records.current[next]?.focus({ preventScroll: true }));
    },
    [crates]
  );

  // The URL hash is the external source: a #crate-NN link (old or new)
  // selects that film and brings the crate into view.
  useEffect(() => {
    const fromHash = () => {
      const m = /^#crate-(\d+)$/.exec(window.location.hash);
      const i = m ? crates.findIndex((c) => c.number === m[1]) : -1;
      if (i < 0) return;
      setSel(i);
      sceneRef.current?.scrollIntoView({ block: "start" });
    };
    const raf = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [crates]);

  function onRecordKey(e: KeyboardEvent<HTMLButtonElement>) {
    const keys: Record<string, number> = {
      ArrowRight: sel + 1,
      ArrowDown: sel + 1,
      ArrowLeft: sel - 1,
      ArrowUp: sel - 1,
      Home: 0,
      End: crates.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    drag.current = { x: e.clientX, y: e.clientY, yaw: view.yaw, pitch: view.pitch, moved: false };
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 6) return; // a tap stays a tap
    if (!d.moved) e.currentTarget.setPointerCapture(e.pointerId);
    d.moved = true;
    setView({ yaw: clamp(d.yaw + dx * 0.3, -65, 65), pitch: clamp(d.pitch - dy * 0.2, -42, -4) });
  }
  function onPointerUp() {
    dragged.current = !!drag.current?.moved;
    drag.current = null;
  }
  // A drag that ends over a record must not also count as choosing it.
  function onRecordClick(i: number) {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    if (i === sel) headings.current[i]?.focus();
    else select(i);
  }

  const current = crates[sel];

  return (
    <div className="sa grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div
          ref={sceneRef}
          className="sa-scene scroll-mt-24 select-none"
          style={{ ["--yaw" as string]: `${view.yaw}deg`, ["--pitch" as string]: `${view.pitch}deg` } as CSSProperties}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="sa-crate" role="group" aria-label={`Record crate, ${crates.length} films, newest at the front`}>
            <div className="sa-face sa-floor" aria-hidden="true" />
            <div className="sa-face sa-wall-back" aria-hidden="true" />
            <div className="sa-face sa-wall-left" aria-hidden="true" />
            <div className="sa-face sa-wall-right" aria-hidden="true" />
            {crates.map((c, i) => {
              const state = i < sel ? "fallen" : i === sel ? "pulled" : "standing";
              const style = {
                ["--i" as string]: i,
                ["--tilt" as string]: state === "fallen" ? "-38deg" : state === "pulled" ? "0deg" : "6deg",
                ["--lift" as string]: state === "pulled" ? "calc(var(--s) * -0.42)" : "0px",
              } as CSSProperties;
              return (
                <button
                  key={c.number}
                  id={`record-${c.number}`}
                  ref={(el) => {
                    records.current[i] = el;
                  }}
                  type="button"
                  tabIndex={i === sel ? 0 : -1}
                  aria-current={i === sel ? "true" : undefined}
                  aria-label={`${label(c)}: ${fullTitle(c)}${i === sel ? ", selected. Press Enter to read its story" : ""}`}
                  className="sa-record"
                  style={style}
                  onClick={() => onRecordClick(i)}
                  onKeyDown={onRecordKey}
                >
                  <span className="sa-sleeve-front" aria-hidden="true">
                    {/* Only the records near the selection are seen face-on;
                        the rest show their paper edge, so their stills wait. */}
                    {Math.abs(i - sel) <= 2 ? (
                      <img
                        src={`/assets/life-archive/${c.youtubeId}-640.webp`}
                        alt=""
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        draggable={false}
                        className="aspect-video w-full bg-black object-cover"
                      />
                    ) : (
                      <span className="block aspect-video w-full bg-[#1a1a1a]" />
                    )}
                    <span className="mt-auto flex items-end justify-between gap-2 font-arch-mono text-[clamp(7px,0.9vw,10px)] uppercase leading-tight tracking-[0.14em] text-black/75">
                      <span>{c.label ?? "Life Crate"}</span>
                      <span className="font-display text-[clamp(1.4rem,3vw,2.6rem)] leading-none tracking-normal text-black">{c.number}</span>
                    </span>
                  </span>
                  <span className="sa-sleeve-back flex items-end p-[8%]" aria-hidden="true">
                    <span className="font-display text-[clamp(1.4rem,3vw,2.6rem)] leading-none text-white/80">{c.number}</span>
                  </span>
                </button>
              );
            })}
            <div className="sa-face sa-wall-front" aria-hidden="true">
              <span className="sa-stencil font-arch-mono text-[clamp(8px,1vw,11px)] uppercase">SkillzHQ · Life Archive</span>
            </div>
          </div>
        </div>

        <div className="sa-controls mt-6 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => select(sel - 1, true)} disabled={sel === 0} className="sa-btn">
            <span aria-hidden="true">←</span> Previous record
          </button>
          <button type="button" onClick={() => select(sel + 1, true)} disabled={sel === crates.length - 1} className="sa-btn">
            Next record <span aria-hidden="true">→</span>
          </button>
          <span className="mx-1 hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
          {/* Turning only changes the viewing angle (touch can drag); phones
              keep the essential controls close to the story. */}
          <span className="hidden flex-wrap gap-2 sm:flex">
            <button type="button" onClick={() => setView((v) => ({ ...v, yaw: clamp(v.yaw - 20, -65, 65) }))} className="sa-btn">
              Turn left
            </button>
            <button type="button" onClick={() => setView((v) => ({ ...v, yaw: clamp(v.yaw + 20, -65, 65) }))} className="sa-btn">
              Turn right
            </button>
            <button type="button" onClick={() => setView(VIEW)} className="sa-btn">
              Reset view
            </button>
          </span>
        </div>
        <p className="sa-controls mt-4 font-arch-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-white/60">
          Tap or use the arrow keys to flip records · drag to turn the crate
        </p>

        {/* Index: the same ten records as a plain row of numbers. */}
        <nav aria-label="Films in the archive" className="sa-controls mt-8 border-t border-white/10 pt-6">
          <ol className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
            {crates.map((c, i) => (
              <li key={c.number}>
                <button
                  type="button"
                  onClick={() => select(i, true)}
                  aria-label={`${label(c)}: ${fullTitle(c)}`}
                  aria-current={i === sel ? "true" : undefined}
                  className={`flex min-h-11 w-full items-center justify-center border font-display text-lg transition-colors ${
                    i === sel ? "border-accent bg-accent text-black" : "border-white/15 text-white/80 hover:border-white/50"
                  }`}
                >
                  {c.number}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* The stories. With JS only the selected one shows; without, all ten. */}
      <div className="lg:col-span-5">
        <p className="sr-only" aria-live="polite">
          {label(current)} selected: {fullTitle(current)}
        </p>
        {crates.map((c, i) => (
          <article
            key={c.number}
            id={`crate-${c.number}`}
            aria-labelledby={`crate-${c.number}-title`}
            className={`sa-story scroll-mt-24 ${i === sel ? "is-selected" : ""}`}
          >
            <FilmFacade
              youtubeId={c.youtubeId}
              title={fullTitle(c)}
              start={c.start}
              still={`/assets/life-archive/${c.youtubeId}.webp`}
              stillSmall={`/assets/life-archive/${c.youtubeId}-640.webp`}
              priority={i === 0}
            />
            <p className="mt-6 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              {label(c)}
              {meta(c) ? <span className="text-white/60"> · {meta(c)}</span> : null}
            </p>
            <h2
              id={`crate-${c.number}-title`}
              ref={(el) => {
                headings.current[i] = el;
              }}
              tabIndex={-1}
              className="mt-4 font-display text-[clamp(1.8rem,3vw,3rem)] uppercase leading-[0.94] focus:outline-none focus-visible:outline-2 focus-visible:outline-accent"
            >
              {c.title} {c.accent ? <span className="text-accent">{c.accent}</span> : null}
            </h2>
            {c.note ? <p className="mt-5 text-base leading-relaxed text-white/75 md:text-[17px]">{c.note}</p> : null}
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
              <a
                href={watch(c)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex min-h-11 items-center gap-2 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-accent"
              >
                Watch on YouTube <span aria-hidden="true">↗</span>
              </a>
              <Link
                href={`/life-archive/${c.number}`}
                className="relative inline-flex min-h-11 items-center gap-2 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-accent"
              >
                Open the film page <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                onClick={() => records.current[i]?.focus()}
                className="sa-controls inline-flex min-h-11 items-center gap-2 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-accent"
              >
                <span aria-hidden="true">↑</span> Back to the crate
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
