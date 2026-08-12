"use client";

import { useState } from "react";
import { bookingCategories, site } from "@/lib/site";
import { Reveal } from "@/components/reveal";

export function Booking() {
  const [selected, setSelected] =
    useState<(typeof bookingCategories)[number]>(bookingCategories[0]);
  const [touched, setTouched] = useState(false);

  const email = site.bookingEmail;
  const href = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        `Booking — ${selected}`
      )}`
    : null;

  return (
    <section id="book" className="bg-accent text-black scroll-mt-20" aria-label="Book Skillz">
      <div className="mx-auto w-full max-w-[1520px] px-6 py-24 md:px-10 md:py-40">
        <Reveal>
          <div className="flex flex-col gap-4 border-b border-black/25 pb-6 md:flex-row md:items-end md:justify-between md:pb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
              <span className="text-sm tracking-widest text-black/60">
                04
              </span>
              <h2 className="font-display text-giant uppercase leading-none">
                Book Skillz
              </h2>
            </div>
            <p className="max-w-64 text-sm leading-relaxed text-black/70">
              Pick a booking type — one tap to the conversation.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ul className="mt-8 md:mt-12">
            {bookingCategories.map((category) => {
              const active = category === selected;
              return (
                <li key={category} className="border-b border-black/25">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(category)}
                    className={`flex w-full items-center justify-between gap-6 py-6 text-left transition-colors md:py-8 ${
                      active ? "bg-black text-white" : "hover:bg-black/5"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full border-2 transition-colors ${
                          active
                            ? "border-accent bg-accent"
                            : "border-black bg-transparent"
                        }`}
                      />
                      <span className="font-display text-large uppercase leading-none">
                        {category}
                      </span>
                    </span>
                    <span
                      className={`text-xs uppercase tracking-[0.25em] ${
                        active ? "text-accent" : "text-black/60"
                      }`}
                    >
                      {active ? "Selected" : "Select"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-10 flex flex-col items-start gap-4 md:mt-12">
            {href ? (
              <a
                href={href}
                className="rounded-full bg-black px-12 py-6 font-display text-2xl uppercase tracking-wider text-white transition-colors hover:bg-elevated"
              >
                Book Skillz — {selected}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setTouched(true)}
                className="rounded-full bg-black px-12 py-6 font-display text-2xl uppercase tracking-wider text-white transition-colors hover:bg-elevated"
              >
                Book Skillz — {selected}
              </button>
            )}
            <p
              aria-live="polite"
              className="text-xs uppercase tracking-[0.2em] text-black/60"
            >
              {touched && !href
                ? "Booking destination — coming online."
                : href
                  ? "Opening your mail client — subject pre-filled."
                  : "Select a category to shape your request."}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
