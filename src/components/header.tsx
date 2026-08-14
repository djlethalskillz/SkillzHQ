"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

const navLinks = [
  { href: "#what-i-do", label: "What I Do" },
  { href: "#workshops-speaking", label: "Workshops / Speaking" },
  { href: "#watch-listen", label: "Watch / Listen" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1520px] items-center justify-between px-6 py-2.5 md:px-10">
        <Link
          href="#landing"
          className="flex items-baseline gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl uppercase leading-none">
            {site.shortName}
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.25em] text-muted sm:inline">
            DJ Lethal
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#book"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
          >
            Book Skillz
          </Link>
        </nav>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-7 bg-white transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-7 bg-white transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-7 bg-white transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-40 flex max-h-[calc(100svh-100%)] flex-col overflow-y-auto bg-background px-6 pb-10 md:hidden"
        >
          <nav
            className="flex flex-1 flex-col justify-center gap-6"
            aria-label="Mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl uppercase leading-none transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="#book"
            onClick={() => setOpen(false)}
            className="rounded-full bg-accent px-6 py-4 text-center font-display text-2xl uppercase tracking-wider text-black transition-colors hover:bg-white"
          >
            Book Skillz
          </Link>
        </div>
      ) : null}

      <button
        ref={closeRef}
        type="button"
        className="sr-only"
        onClick={() => setOpen(false)}
        tabIndex={open ? 0 : -1}
      >
        Close menu
      </button>
    </header>
  );
}
