"use client";

import { useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

type State = "idle" | "sending" | "sent" | "already" | "error";

/** Skillz Frequency signup — the same-origin POST pattern as the booking form. */
export function Frequency() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validate() {
    const input = inputRef.current;
    if (!input) return false;
    if (!input.value.trim()) {
      setMessage("Drop your email address first.");
      return false;
    }
    if (!input.validity.valid) {
      setMessage("That email doesn't look right.");
      return false;
    }
    setMessage(null);
    return true;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending" || !validate()) return;
    const email = inputRef.current?.value.trim() ?? "";
    setState("sending");
    fetch(site.frequencyEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        if (res.ok) return setState("sent");
        if (res.status === 409) return setState("already");
        throw new Error("delivery-failed");
      })
      .catch(() => setState("error"));
  }

  const done =
    state === "sent" ? (
      <>
        <p className="font-display text-large uppercase leading-none text-accent">
          You&apos;re on the frequency.
        </p>
        <p className="mt-3 font-arch-mono text-base uppercase tracking-[0.25em] text-white/80">
          Check your inbox to confirm your subscription.
        </p>
      </>
    ) : (
      <>
        <p className="font-display text-large uppercase leading-none text-accent">
          Already on the frequency.
        </p>
        <p className="mt-3 font-arch-mono text-base uppercase tracking-[0.25em] text-white/80">
          Confirmation sent to your inbox.
        </p>
      </>
    );

  return (
    <section
      id="frequency"
      aria-label="Get on the Skillz Frequency"
      className="mx-auto w-full max-w-[1520px] px-6 py-24 scroll-mt-20 md:px-10 md:py-40"
    >
      <SectionHeader
        index="05"
        title="Get On The Skillz Frequency"
        note="New music. Rare drops. Events. Workshops. Stories from the archive."
        noteClassName="max-w-md text-xl text-white/80"
        indexClassName="text-base"
      />
      <Reveal delay={100}>
        <div className="mx-auto mt-16 max-w-2xl md:mt-20">
          {state === "sent" || state === "already" ? (
            <div className="text-center">{done}</div>
          ) : (
            <>
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 md:flex-row md:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="frequency-email"
                    className="mb-1.5 block text-base uppercase tracking-[0.25em] text-white/80"
                  >
                    Email address
                  </label>
                  <input
                    ref={inputRef}
                    id="frequency-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-describedby={message ? "frequency-status" : undefined}
                    aria-invalid={message ? true : undefined}
                    className="w-full border-b border-white/30 bg-transparent px-1 pb-2 pt-1 font-arch-mono text-lg text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className={`shrink-0 rounded-full bg-accent px-10 py-4 font-display text-xl uppercase tracking-wider text-black transition-colors ${
                    state === "sending" ? "cursor-wait opacity-60" : "hover:bg-white"
                  }`}
                >
                  {state === "sending" ? "Tuning…" : "Get In →"}
                </button>
              </form>
              <p
                id="frequency-status"
                aria-live="polite"
                className="mt-4 text-center font-arch-mono text-base uppercase tracking-[0.2em] text-white/80"
              >
                {message ??
                  (state === "error"
                    ? "The signal dropped. Try again."
                    : "Occasional transmissions from Skillz. Unsubscribe anytime.")}
              </p>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}
