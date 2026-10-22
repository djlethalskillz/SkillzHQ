import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Booking } from "@/components/booking";
import { Reveal } from "@/components/reveal";
import {
  BOOKINGS_EMAIL,
  EPK_PDF,
  EPK_RECEIPTS,
  EPK_RECEIPTS_HEADING,
  EPK_SERVICES,
  EPK_TAGLINE,
} from "@/lib/epk";

// Built from the EPK's own lines: its closing heading plus its tagline.
const description = `Book DJ Lethal Skillz: ${EPK_TAGLINE[0]}. ${EPK_TAGLINE[1]}.`;

export const metadata: Metadata = {
  title: "Book · DJ Lethal Skillz",
  description,
  alternates: {
    canonical: "https://djlethalskillz.com/book",
  },
  openGraph: {
    title: "Book · DJ Lethal Skillz",
    description,
    url: "https://djlethalskillz.com/book",
    siteName: "DJ Lethal Skillz",
    type: "website",
    images: [
      {
        url: "https://djlethalskillz.com/assets/og/og-book.jpg",
        width: 1200,
        height: 630,
        alt: "Book DJ Lethal Skillz. DJ · Turntablist · Producer. Beirut · Kuala Lumpur · Worldwide.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book · DJ Lethal Skillz",
    description,
    images: ["https://djlethalskillz.com/assets/og/og-book.jpg"],
  },
};

/** The three columns step down like a beat, not a grid of equals. */
const STEP = ["", "md:mt-16", "md:mt-32"];

/**
 * The booking path as an EPK page (owner lock amendment, 2026-10-21).
 * Everything above the form is the EPK's own wording, verbatim and cited by
 * page in src/lib/epk.ts; the form is the site's existing <Booking />.
 */
export default function BookPage() {
  return (
    <ViewTransition enter="doc-cut-in" exit="doc-cut-out" default="none">
      <div className="overflow-x-clip">
        <div className="mx-auto w-full max-w-[1520px] px-6 pb-20 pt-28 md:px-10 md:pb-32 md:pt-36">
          <header className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-8">
              <p className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">{EPK_TAGLINE[0]}</p>
              <h1 className="mt-5 font-display text-[clamp(3rem,11vw,10rem)] uppercase leading-[0.86]">
                <span className="block">Book</span>{" "}
                <span className="block lg:pl-[12%]">DJ Lethal</span>{" "}
                <span className="block">Skillz</span>
              </h1>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-4 lg:pb-4">
              <p className="font-arch-mono text-[11px] uppercase leading-relaxed tracking-[0.25em] text-white">
                {EPK_TAGLINE[1]}
              </p>
              <a
                href="#book"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
              >
                Book Skillz <span aria-hidden="true">↓</span>
              </a>
            </Reveal>
          </header>

          <section aria-labelledby="book-services" className="mt-16 border-t border-white/10 pt-8 md:mt-24">
            <h2 id="book-services" className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              {EPK_SERVICES.map((s) => s.name).join(" · ")}
            </h2>
            <ol className="mt-10 grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
              {EPK_SERVICES.map((s, i) => (
                <li key={s.name} className={STEP[i]}>
                  <Reveal delay={i * 80}>
                    <span className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">{s.n}</span>
                    <h3 className="mt-2 font-display text-[clamp(2.75rem,5vw,4.5rem)] uppercase leading-[0.9]">{s.name}</h3>
                    <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-white/80">{s.lead}</p>
                    <ul className="mt-6 border-t border-white/15">
                      {s.lines.map((line) => (
                        <li key={line} className="border-b border-white/10 py-3 text-sm leading-relaxed text-white/70">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="book-receipts"
            className="mt-20 grid gap-10 border-t border-white/10 pt-8 md:mt-32 lg:grid-cols-12 lg:gap-12"
          >
            <Reveal className="lg:col-span-4">
              <h2 id="book-receipts" className="font-display text-giant uppercase leading-[0.9]">
                Receipts
              </h2>
              <p className="mt-4 max-w-[32ch] font-arch-mono text-[11px] uppercase leading-relaxed tracking-[0.25em] text-white/60">
                {EPK_RECEIPTS_HEADING}
              </p>
            </Reveal>
            <ol className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
              {EPK_RECEIPTS.map((r) => (
                <li key={r.n} className="border-t border-white/15 py-5">
                  <span className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">{r.n}</span>
                  <p className="mt-2 font-display text-xl uppercase leading-tight">{r.item}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{r.caption}</p>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="book-direct"
            className="mt-20 grid gap-6 border-t border-white/10 pt-8 md:mt-32 lg:grid-cols-12 lg:gap-12"
          >
            <h2
              id="book-direct"
              className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/50 lg:col-span-3"
            >
              Direct contact
            </h2>
            <div className="min-w-0 lg:col-span-9">
              <a
                href={`mailto:${BOOKINGS_EMAIL}`}
                className="inline-block font-display text-[clamp(1.25rem,5.5vw,5rem)] leading-none text-white transition-colors [overflow-wrap:anywhere] hover:text-accent"
              >
                {BOOKINGS_EMAIL}
              </a>
              {/* The mailbox is the fallback when the form fails (owner-approved copy, 2026-10-21). */}
              <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-white/60">
                If the form below doesn&apos;t go through, email directly.
              </p>
              <a
                href={EPK_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-11 items-center gap-2 font-arch-mono text-[11px] uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-accent"
              >
                Download EPK (PDF, 1.4 MB) <span aria-hidden="true">↓</span>
              </a>
            </div>
          </section>
        </div>

        <Booking />
      </div>
    </ViewTransition>
  );
}
