"use client";

import { useState, type FormEvent } from "react";
import { bookingBriefs, site } from "@/lib/site";
import { Reveal } from "@/components/reveal";

type Brief = (typeof bookingBriefs)[number];

const DEFAULT_TAGLINE = "Let's create something people will remember.";
const COLLAPSE_MS = 520; // matches the row collapse transition duration

/** The one live form — mounted inside whichever brief is open (shared, not duplicated). */
function BriefForm({ brief }: { brief: Brief }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const data = new FormData(e.currentTarget);
    setState("sending");
    fetch(site.enquiryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: brief.name,
        name: data.get("name"),
        email: data.get("email"),
        organization: data.get("organization"),
        details: data.get("details"),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("delivery-failed");
        setState("sent");
      })
      .catch(() => setState("error"));
  }

  return (
    <>
      <div className="my-6 border-t border-white/25 md:my-7" />
      <p className="font-display text-2xl uppercase leading-tight md:text-3xl">
        Tell me about your {brief.heading}.
      </p>

      {state === "sent" ? (
        <div className="mt-6">
          <p className="font-display text-2xl uppercase tracking-wide text-accent">
            — received
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60">
            Enquiry sent — I&apos;ll be in touch.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-5 md:mt-8">
          <div>
            <label
              htmlFor="book-name"
              className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-white/60"
            >
              Name
            </label>
            <input
              id="book-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full border-b border-white/30 bg-transparent px-1 pb-2 pt-1 font-arch-mono text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="book-email"
              className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-white/60"
            >
              Email
            </label>
            <input
              id="book-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border-b border-white/30 bg-transparent px-1 pb-2 pt-1 font-arch-mono text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="book-org"
              className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-white/60"
            >
              Organization — optional
            </label>
            <input
              id="book-org"
              name="organization"
              type="text"
              autoComplete="organization"
              className="w-full border-b border-white/30 bg-transparent px-1 pb-2 pt-1 font-arch-mono text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent"
              placeholder="Club · festival · brand · venue"
            />
          </div>
          <div>
            <label
              htmlFor="book-details"
              className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-white/60"
            >
              Details
            </label>
            <textarea
              id="book-details"
              name="details"
              rows={2}
              required
              className="w-full resize-y border-b border-white/30 bg-transparent px-1 pb-2 pt-1 font-arch-mono text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent"
              placeholder="Dates, venue, idea — anything that helps."
            />
          </div>
          <div className="flex flex-col items-start gap-3 pt-2">
            <button
              type="submit"
              disabled={state === "sending"}
              className={`rounded-full bg-white px-10 py-4 font-display text-xl uppercase tracking-wider text-black transition-colors ${
                state === "sending"
                  ? "cursor-wait opacity-60"
                  : "hover:bg-accent"
              }`}
            >
              {state === "sending" ? "Sending…" : "Submit"}
            </button>
            <p aria-live="polite" className="text-xs uppercase tracking-[0.2em] text-white/70">
              {state === "error"
                ? "Something went wrong — please try again."
                : "No spam. This goes straight to the team."}
            </p>
          </div>
        </form>
      )}
    </>
  );
}

export function Booking() {
  const [open, setOpen] = useState(false); // section panel
  const [openIndex, setOpenIndex] = useState<number | null>(null); // expanded row
  const [formIndex, setFormIndex] = useState<number | null>(null); // row hosting the live form
  const [closingIndex, setClosingIndex] = useState<number | null>(null); // old form until collapse ends

  function toggle(i: number) {
    if (openIndex === i) {
      // Closing the open row: collapse, then clear its body after the transition.
      const closing = i;
      setOpenIndex(null);
      setClosingIndex(closing);
      window.setTimeout(() => {
        setClosingIndex((c) => (c === closing ? null : c));
        setFormIndex((f) => (f === closing ? null : f));
      }, COLLAPSE_MS);
      return;
    }
    const previous = openIndex;
    if (previous !== null) {
      setOpenIndex(null);
      setClosingIndex(previous);
      window.setTimeout(
        () => setClosingIndex((c) => (c === previous ? null : c)),
        COLLAPSE_MS
      );
    }
    setFormIndex(i);
    setOpenIndex(i);
  }

  const tagline =
    openIndex === null ? DEFAULT_TAGLINE : bookingBriefs[openIndex].tagline;

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
              Let&apos;s collaborate: pick a brief, one tap to the conversation.
            </span>
          </button>
        </Reveal>

        <Reveal delay={100}>
          <div
            id="book-skillz-panel"
            className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
            style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              {/* LET'S COLLABORATE — the same invitation grammar as the reference. */}
              <div className="mt-8 md:mt-12">
                <p className="font-display text-large uppercase leading-none">
                  Let&apos;s Collaborate
                </p>
                <p
                  aria-live="polite"
                  className="mt-3 font-arch-mono text-sm italic text-black/70"
                >
                  {tagline}
                </p>
                <div className="my-6 border-t border-black/25 md:my-7" />
                <p className="text-[11px] uppercase tracking-[0.25em] text-black/60">
                  Select A Brief
                </p>
              </div>

              {/* True accordion: one brief open at a time, shared form, collapse-then-clear. */}
              <ul className="mt-2">
                {bookingBriefs.map((brief, i) => {
                  const expanded = openIndex === i;
                  const hostsForm = formIndex === i || closingIndex === i;
                  return (
                    <li key={brief.name} className="border-b border-black/25">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`book-brief-body-${i}`}
                        onClick={() => toggle(i)}
                        className={`flex w-full items-center justify-between gap-6 px-2 py-5 text-left transition-colors md:py-6 ${
                          expanded ? "bg-black text-white" : "hover:bg-black/5"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-4 md:gap-6">
                          <span
                            className={`font-arch-mono text-xs ${
                              expanded ? "text-accent" : "text-black/40"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex min-w-0 flex-col gap-1">
                            <span className="font-display text-2xl uppercase leading-none md:text-3xl">
                              {brief.name}
                            </span>
                            <span
                              className={`truncate font-arch-mono text-[11px] italic tracking-wide ${
                                expanded ? "text-white/60" : "text-black/50"
                              }`}
                            >
                              {brief.helper}
                            </span>
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`font-arch-mono text-xl transition-[transform,color] duration-300 ease-out ${
                            expanded
                              ? "rotate-45 text-accent"
                              : "text-black/40"
                          }`}
                        >
                          +
                        </span>
                      </button>
                      <div
                        id={`book-brief-body-${i}`}
                        className="grid transition-[grid-template-rows] duration-[520ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
                        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                      >
                        <div
                          className={`overflow-hidden bg-black px-2 pb-8 text-white md:px-4 ${
                            !expanded ? "pointer-events-none" : ""
                          }`}
                          aria-hidden={hostsForm && !expanded}
                        >
                          {hostsForm ? <BriefForm brief={brief} /> : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
