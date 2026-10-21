"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

// Hash targets are path-absolute ("/#…") so they also work from the
// /life-archive page, where the home sections are not on the page.
// Notes are the site's existing chapter lines (no new copy), except the
// Bandcamp prototype's note, which is DRAFT.
const chapters = [
  { n: "02", href: "/#what-i-do", label: "What I Do", note: "Five disciplines, one practice." },
  { n: "03", href: "/book", label: "Book Skillz", note: "Let's create something people will remember." },
  { n: "04", href: "/#watch-listen", label: "Watch / Listen", note: "Performance footage and music." },
  { n: "A", href: "/life-archive", label: "Life Archive", note: "Films from the life and work of DJ Lethal Skillz, kept here by hand." },
  // PROTOTYPE: note is DRAFT copy.
  { n: "B", href: "/bandcamp", label: "Bandcamp", note: "Albums and tracks, as released on Bandcamp." },
];

const EPK = "/assets/DJ_LETHAL_SKILLZ_EPK.pdf";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  // DEMO fix (audit CT-06): the menu is a real modal — focus moves inside,
  // Tab is contained, Escape closes and focus returns to the toggle.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const focusables = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
    <header
      className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex w-full max-w-[1520px] items-center justify-between px-6 py-2.5 md:px-10">
        <Link href="/#landing" className="flex items-baseline gap-3 py-1" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl uppercase leading-none">{site.shortName}</span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-accent sm:text-muted">DJ Lethal</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {chapters
            .filter((c) => c.label !== "Book Skillz")
            .map((c) => {
              const active = c.href === pathname;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-baseline gap-2 py-2 text-sm transition-colors ${
                    active ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  <span className={`font-arch-mono text-[10px] ${active ? "text-accent" : "text-white/60 group-hover:text-accent"}`}>
                    {c.n}
                  </span>
                  <span className={active ? "underline decoration-accent decoration-2 underline-offset-8" : ""}>{c.label}</span>
                </Link>
              );
            })}
          <a href={EPK} target="_blank" rel="noopener noreferrer" className="py-2 text-sm text-white/70 transition-colors hover:text-white">
            Download EPK
          </a>
          <Link
            href="/book"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
          >
            Book Skillz
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span className="h-0.5 w-7 bg-white" />
          <span className="h-0.5 w-7 bg-white" />
          <span className="h-0.5 w-5 self-end bg-accent" />
        </button>
      </div>
    </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become
          the containing block and clip this fixed, full-screen dialog. */}
      {open ? (
        <div
          id="mobile-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[80] flex flex-col overflow-hidden overflow-y-auto bg-black px-6 pb-8 pt-4 lg:hidden"
        >
          <div aria-hidden="true" className="menu-record">
            <div className="record record-spin">
              <div className="record-sheen" />
              <div className="record-label">
                <span className="font-display text-[5vw] uppercase leading-none">Skillz</span>
                <span className="mt-1 font-arch-mono text-[2.2vw] uppercase tracking-[0.2em]">HQ</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-between">
            <span className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">Tracklist</span>
            <button
              type="button"
              onClick={() => close()}
              className="flex h-11 items-center gap-2 font-arch-mono text-[11px] uppercase tracking-[0.25em] text-white"
            >
              Close <span aria-hidden="true" className="text-xl leading-none text-accent">×</span>
            </button>
          </div>

          <nav className="relative mt-8 flex flex-1 flex-col justify-center" aria-label="Mobile">
            <ol className="flex flex-col">
              {chapters.map((c) => (
                <li key={c.href} className="border-t border-white/15 last:border-b">
                  <Link
                    href={c.href}
                    onClick={() => close(false)}
                    aria-current={c.href === pathname ? "page" : undefined}
                    className="group flex items-start gap-4 py-5"
                  >
                    <span className="mt-1 w-6 font-arch-mono text-xs text-accent">{c.n}</span>
                    <span className="flex flex-col gap-1.5">
                      <span className="font-display text-[clamp(2rem,10vw,3.5rem)] uppercase leading-[0.9] transition-colors group-hover:text-accent">
                        {c.label}
                      </span>
                      <span className="max-w-[32ch] text-xs leading-relaxed text-white/55">{c.note}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="relative mt-8 flex items-center justify-between gap-4">
            <a
              href={EPK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => close(false)}
              className="py-3 font-arch-mono text-[11px] uppercase tracking-[0.25em] text-white/80"
            >
              Download EPK
            </a>
            <Link
              href="/book"
              onClick={() => close(false)}
              className="rounded-full bg-accent px-7 py-4 font-display text-xl uppercase tracking-wider text-black"
            >
              Book Skillz
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
