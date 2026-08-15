"use client";

import { useRef, useState } from "react";
import { bookingCategories, producerServices, site, speakingServices } from "@/lib/site";
import { Reveal } from "@/components/reveal";

export function Booking() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] =
    useState<(typeof bookingCategories)[number]>(bookingCategories[0]);
  const [service, setService] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isProducer = selected === "Producer";
  const isSpeaking = selected === "Speaking";
  const serviceList = isProducer ? producerServices : isSpeaking ? speakingServices : null;
  const email = site.bookingEmail;
  const label =
    isProducer && service
      ? `Producer · ${service}`
      : isSpeaking && service
        ? `Speaking · ${service}`
        : selected;
  const subject = `Booking · ${label}`;
  const href = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : null;

  return (
    <section id="book" className="bg-accent text-black scroll-mt-20" aria-label="Book Skillz">
      <div className="mx-auto w-full max-w-[1520px] px-6 py-24 md:px-10 md:py-40">
        {/* BOOK SKILLZ row is the trigger — same expanding chapter grammar as What I Do. */}
        <Reveal>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="book-skillz-panel"
            className="flex w-full flex-col gap-4 border-b border-black/25 pb-6 text-left transition-colors hover:bg-black/5 md:flex-row md:items-end md:justify-between md:pb-8"
          >
            <span className="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
              <span className="text-sm tracking-widest text-black/60">
                03
              </span>
              <span className="font-display text-giant uppercase leading-none">
                Book Skillz
              </span>
            </span>
            <span className="max-w-64 text-sm leading-relaxed text-black/70">
              Pick a booking type: one tap to the conversation.
            </span>
          </button>
        </Reveal>

        <Reveal delay={100}>
          <div
            id="book-skillz-panel"
            ref={panelRef}
            className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
            style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <ul className="mt-8 md:mt-12">
                {bookingCategories.map((category) => {
                  const active = category === selected;
                  return (
                    <li key={category} className="border-b border-black/25">
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setSelected(category);
                          setService(null);
                        }}
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

              {/* Producer / Speaking service context — same row grammar, one level deep */}
              {serviceList ? (
                <div className="border-b border-black/25">
                  <p className="pt-6 text-[11px] uppercase tracking-[0.25em] text-black/60">
                    {isProducer ? "Producer services" : "Speaking formats"}
                  </p>
                  <ul>
                    {serviceList.map((s) => {
                      const active = service === s;
                      return (
                        <li key={s}>
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={() => setService(s)}
                            className={`flex w-full items-center justify-between gap-6 py-4 pl-8 text-left transition-colors md:pl-12 ${
                              active ? "text-accent" : "hover:bg-black/5"
                            }`}
                          >
                            <span className="flex items-center gap-4">
                              <span
                                className={`h-2.5 w-2.5 shrink-0 rounded-full border-2 transition-colors ${
                                  active
                                    ? "border-black bg-black"
                                    : "border-black bg-transparent"
                                }`}
                              />
                              <span className="text-sm font-semibold uppercase tracking-wider">
                                {s}
                              </span>
                            </span>
                            <span
                              className={`text-xs uppercase tracking-[0.25em] ${
                                active ? "text-black" : "text-black/60"
                              }`}
                            >
                              {active ? "Selected" : "Select"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="mt-10 flex flex-col items-start gap-4 md:mt-12">
                {href ? (
                  <a
                    href={href}
                    className="rounded-full bg-black px-12 py-6 font-display text-2xl uppercase tracking-wider text-white transition-colors hover:bg-elevated"
                  >
                    Book Skillz · {label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTouched(true)}
                    className="rounded-full bg-black px-12 py-6 font-display text-2xl uppercase tracking-wider text-white transition-colors hover:bg-elevated"
                  >
                    Book Skillz · {label}
                  </button>
                )}
                <p
                  aria-live="polite"
                  className="text-xs uppercase tracking-[0.2em] text-black/60"
                >
                  {touched && !href
                    ? "Booking destination: coming online."
                    : href
                      ? "Opening your mail client, subject pre-filled."
                      : serviceList && !service
                        ? isProducer
                          ? "Select a service to shape your request."
                          : "Select a format to shape your request."
                        : "Select a category to shape your request."}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
