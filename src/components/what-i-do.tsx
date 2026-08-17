"use client";

import { useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { FragmentsChapter } from "@/components/fragments";
import { site } from "@/lib/site";

/**
 * SKILLZHQ EXPANDING CHAPTER PATTERN — established by DJ (see CHECKPOINT_DJ.md).
 * A discipline row is its own trigger: click expands the chapter in place,
 * click again collapses. No icons, no affordances, no modal.
 */
function Chapter({
  name,
  note,
  panelId,
  staggered = false,
  children,
}: {
  name: string;
  note: string;
  panelId?: string;
  staggered?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  // Below-the-fold perf: don't mount (and thus don't fetch) this chapter's
  // media until the visitor opens it the first time. Once opened, stays
  // mounted permanently — closing/reopening after that is unchanged from
  // today (same elements, same play()/pause(), instant resume).
  const hasOpenedRef = useRef(false);
  if (open) hasOpenedRef.current = true;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          // Drive playback from the user gesture: Chrome defers the autoplay
          // attribute while the panel is collapsed, so it never starts on its own.
          const videos = panelRef.current?.querySelectorAll("video");
          if (!videos) return;
          videos.forEach((v) => (next ? void v.play() : v.pause()));
        }}
        aria-expanded={open}
        aria-controls={panelId}
        className={`group flex w-full cursor-pointer flex-col gap-2 py-8 text-left transition-colors md:flex-row md:items-baseline md:gap-6 md:py-10 ${
          staggered ? "md:pl-[10%]" : ""
        }`}
      >
        <span className="font-display text-giant uppercase leading-none transition-colors group-hover:text-accent md:min-w-0">
          {name}
        </span>
        <span className="text-sm leading-relaxed text-muted transition-colors group-hover:text-white/80 md:ml-auto md:text-right">
          {note}
        </span>
      </button>
      <div
        id={panelId}
        ref={panelRef}
        className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">{hasOpenedRef.current ? children : null}</div>
      </div>
    </>
  );
}

type Discipline = {
  name: string;
  note: string;
  panelId?: string;
  staggered?: boolean;
  chapter?: ReactNode;
};

const disciplines: Discipline[] = [
  {
    name: "DJ",
    note: "Clubs · Festivals · Private Events · Gigs",
    panelId: "dj-archive-panel",
    chapter: (
      <figure className="flex flex-col items-center gap-4 border-t border-white/10 py-10 md:py-14">
        {/* Living collage: approved PNG master underneath, 4 video cells overlaid at
            exact panel geometry. Box locks 16:9 so percentage positions always map
            to the master coordinates (1920×1080). */}
        <div
          className="relative w-full"
          style={{
            maxWidth: "min(100%, calc(78vh * 16 / 9))",
            aspectRatio: "16 / 9",
          }}
        >
          <img
            src={site.djArchive.src}
            alt={site.djArchive.alt}
            className="absolute inset-0 h-full w-full object-contain"
          />
          {site.djArchive.cells.map((cell) => (
            <video
              key={cell.id}
              className="absolute"
              style={{
                left: `${(cell.x / 1920) * 100}%`,
                top: `${(cell.y / 1080) * 100}%`,
                width: `${(cell.w / 1920) * 100}%`,
                height: `${(cell.h / 1080) * 100}%`,
                objectFit: "fill",
              }}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            >
              <source src={cell.webm} type="video/webm" />
              <source src={cell.mp4} type="video/mp4" />
            </video>
          ))}
        </div>
        <figcaption className="text-[11px] uppercase tracking-[0.2em] text-muted">
          {site.djArchive.caption}
        </figcaption>
      </figure>
    ),
  },
  {
    name: "Turntablism",
    note: "Performance · Scratch Craft · Workshops",
    panelId: "turntablism-archive-panel",
    staggered: true,
    chapter: (
      <div className="border-t border-white/10 py-10 md:py-14">
        {/* THE CRAFT — approved living loop stays the primary anchor */}
        <figure className="flex flex-col items-center gap-4">
          <video
            className="max-h-[78vh] w-auto max-w-full object-contain"
            src={site.turntablism.src}
            poster={site.turntablism.poster}
            autoPlay
            muted
            loop
            playsInline
          />
          <figcaption className="text-[11px] uppercase tracking-[0.2em] text-muted">
            {site.turntablism.caption}
          </figcaption>
        </figure>

        {/* THE CULTURE — editorial + contact-sheet collage from the skratch community */}
        <div className="mt-14 max-w-3xl border-l-2 border-accent pl-6 md:mt-20 md:pl-10">
          <p className="font-display text-2xl uppercase leading-tight text-white md:text-4xl">
            {site.turntablism.editorial.headline}
          </p>
          <div className="mt-6 space-y-4">
            {site.turntablism.editorial.body.map((p) => (
              <p key={p} className="text-sm leading-relaxed text-muted md:text-base">
                {p}
              </p>
            ))}
          </div>
        </div>
        {/* REV T4: three-row documentary collage — static + motion balanced,
            tiles keep their natural composition, no forced strips. */}
        <div className="mt-10 grid w-full grid-cols-1 gap-2 md:grid-cols-4">
          {site.turntablism.collage.map((t) =>
            t.type === "loop" ? (
              <video
                key={t.media}
                className={`${t.span ?? ""} ${t.aspect ?? "aspect-[4/5]"} w-full border border-white/10 ${
                  t.contain ? "bg-black object-contain" : "object-cover"
                }`}
                poster={t.poster}
                autoPlay
                muted
                loop
                playsInline
                aria-label={t.alt}
              >
                <source src={t.webm} type="video/webm" />
                <source src={t.media} type="video/mp4" />
              </video>
            ) : (
              <img
                key={t.media}
                src={t.media}
                alt={t.alt}
                loading="lazy"
                className={`${t.span ?? ""} ${t.aspect ?? "aspect-[4/5]"} w-full border border-white/10 object-cover`}
              />
            ),
          )}
        </div>
      </div>
    ),
  },
  {
    name: "Speaking",
    note: "Talks · Panels · Keynotes · Conversations",
    panelId: "speaking-archive-panel",
    chapter: <SpeakingChapter />,
  },
  {
    name: "Producer",
    note: "Beats · Scratch Hooks · Mixing & Mastering · Collaboration",
    panelId: "producer-archive-panel",
    staggered: true,
    chapter: <ProducerChapter />,
  },
  {
    name: "Fragments",
    note: "The Archive · People · Places · Moments",
    panelId: "fragments-archive-panel",
    chapter: <FragmentsChapter />,
  },
];

/**
 * SPEAKING — voice / documentary / podcast editorial chapter.
 * REV 8: stage loop video removed — documentary evidence cards carry the
 * chapter. No unverified event claims.
 */
function SpeakingChapter() {
  const { speaking } = site;

  return (
    <div className="border-t border-white/10 py-10 md:py-14">
      {/* POSITIONING */}
      {/* REV 8: stage loop video removed — the documentary evidence below is
          the stronger content. Chapter transitions straight into positioning. */}
      <p className="mt-14 max-w-3xl font-display text-2xl uppercase leading-tight md:mt-20 md:text-4xl">
        {speaking.positioning}
      </p>

      {/* SIGNATURE — THE VOICE */}
      <div className="mt-14 grid gap-10 border-l-2 border-accent pl-6 md:mt-20 md:pl-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
            Signature · The Voice
          </p>
          <h3 className="mt-3 font-display text-large uppercase leading-none">
            {speaking.signature.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {speaking.signature.line}
          </p>
          <p className="mt-6 text-sm text-white/80">
            {speaking.signature.primary.url ? (
              <a
                href={speaking.signature.primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors decoration-accent/60 underline-offset-4 hover:text-accent hover:underline"
              >
                {speaking.signature.primary.name}
              </a>
            ) : (
              speaking.signature.primary.name
            )}
            <span className="text-muted">
              {", "}
              {speaking.signature.primary.detail} ·{" "}
              {speaking.signature.primary.year}
            </span>
          </p>
          {speaking.signature.trail.length > 0 ? (
            <ul className="mt-4 space-y-1.5">
              {speaking.signature.trail.map((item) => (
                <li key={item} className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* CREATED MOMENTS — documented moments, WHERE + WHY + CONTRIBUTED */}
      <div className="mt-14 md:mt-20">
        <div className="flex items-baseline gap-4 border-b border-white/10 pb-4 md:gap-8">
          <span className="text-sm tracking-widest text-muted">01</span>
          <h3 className="font-display text-large uppercase leading-none">
            Created Moments
          </h3>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          {speaking.evidence.map((item) => (
            <article
              key={item.id}
              className={`flex flex-col gap-5 bg-elevated p-6 md:p-8 ${item.span ?? ""}`}
            >
              {item.type === "document" ? (
                <div className="flex flex-col items-start gap-5 border border-white/10 bg-black/30 p-6 md:p-8">
                  <div className="flex flex-wrap items-start gap-5">
                    {item.media ? (
                      <img
                        src={item.media}
                        alt={item.alt}
                        loading="lazy"
                        className="w-[240px] max-w-full border border-white/10"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-muted">
                      {item.document.org}
                    </span>
                    <span className="font-display text-3xl uppercase leading-none">
                      {item.document.edition}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
                      {item.document.line}
                    </span>
                  </div>
                  {item.fragments ? (
                    <div className="grid w-full grid-cols-3 gap-2">
                      {item.fragments.map((f) => (
                        <img
                          key={f.media}
                          src={f.media}
                          alt={f.alt}
                          loading="lazy"
                          className="h-24 w-full border border-white/10 object-cover md:h-32"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : item.stack ? (
                <div className="flex flex-col gap-5 md:flex-row">
                  <img
                    src={item.media}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full max-h-[300px] flex-1 object-cover"
                  />
                  <div className="flex flex-col gap-3 md:w-[240px]">
                    {item.stack.map((s) => (
                      <img
                        key={s.media}
                        src={s.media}
                        alt={s.alt}
                        loading="lazy"
                        className="w-full max-h-[160px] border border-white/10 object-cover"
                      />
                    ))}
                  </div>
                </div>
              ) : item.media ? (
                <>
                  <img
                    src={item.media}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full max-h-[300px] object-cover"
                  />
                  {item.collage ? (
                    <div className="grid grid-cols-3 gap-2">
                      {item.collage.map((c, i) => (
                        <img
                          key={c.media}
                          src={c.media}
                          alt={c.alt}
                          loading="lazy"
                          className={`h-24 w-full border border-white/10 object-cover ${
                            i === 0 ? "col-span-2" : ""
                          }`}
                        />
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
                  {item.tag}
                </p>
                <p className="text-[11px] tracking-[0.2em] text-muted">
                  {item.year ? `${item.year} · ` : ""}
                  {item.place}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-display text-2xl uppercase leading-none md:text-3xl">
                  {item.title}
                </h4>
                <p className="text-sm text-white/80">{item.role}</p>
                <p className="text-sm leading-relaxed text-muted">{item.why}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* DOCUMENTED — academic record, cautious by design */}
      <div className="mt-14 border-t border-white/10 pt-10 md:mt-20 md:pt-14">
        <div className="flex items-baseline gap-4 pb-4 md:gap-8">
          <span className="text-sm tracking-widest text-muted">02</span>
          <h3 className="font-display text-large uppercase leading-none">
            Documented
          </h3>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <img
              src={speaking.documented.media}
              alt={speaking.documented.alt}
              loading="lazy"
              className="w-full max-w-xs border border-white/10"
            />
          </div>
          <div className="flex flex-col gap-3 md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
              {speaking.documented.author} · {speaking.documented.publisher},{" "}
              {speaking.documented.year}
            </p>
            <h4 className="font-display text-2xl uppercase leading-none md:text-3xl">
              {speaking.documented.title}
            </h4>
            <p className="text-sm italic text-white/80">
              {speaking.documented.subtitle}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {speaking.documented.line}
            </p>
          </div>
        </div>
      </div>

      {/* WHAT I TALK ABOUT — canonical topic list */}
      <div className="mt-14 md:mt-20">
        <div className="flex items-baseline gap-4 border-b border-white/10 pb-4 md:gap-8">
          <span className="text-sm tracking-widest text-muted">03</span>
          <h3 className="font-display text-large uppercase leading-none">
            What I Talk About
          </h3>
        </div>
        <ul className="mt-4 grid md:grid-cols-2">
          {speaking.topics.map((topic) => (
            <li
              key={topic.name}
              className="flex flex-col gap-1 border-b border-white/10 py-5 md:border-r md:last:border-r-0"
            >
              <span className="font-display text-2xl uppercase leading-none transition-colors hover:text-accent">
                {topic.name}
              </span>
              <span className="text-sm text-muted">{topic.line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* BOOK SKILLZ — same destination as every discipline */}
      <div className="mt-14 flex md:mt-20">
        <a
          href="#book"
          className="rounded-full bg-accent px-8 py-4 font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
        >
          Book Skillz
        </a>
      </div>
    </div>
  );
}

/**
 * PRODUCER — records / archive / credits editorial chapter.
 * Deliberately NOT a collage (DJ owns that) and NOT a loop (Turntablism owns that):
 * record artwork, documentary objects, credits and cross-border stories.
 * Kept lightweight: stills only (WebP/JPG), lazy loaded, no video layers.
 */
function ProducerChapter() {
  const { producer } = site;

  return (
    <div className="border-t border-white/10 py-10 md:py-14">
      {/* POSITIONING */}
      <p className="max-w-3xl font-display text-2xl uppercase leading-tight md:text-4xl">
        {producer.positioning}
      </p>

      {/* SIGNATURE — SCRATCH HOOKS */}
      <div className="relative mt-14 grid gap-10 border-l-2 border-accent pl-6 md:mt-20 md:pl-10">
        {/* Approved journey loop — the opening's right-side empty space. No
            audio track ever plays (muted), no controls, no overlay. */}
        <video
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 hidden w-[40%] -translate-y-1/2 md:block"
          src="/assets/producer/skillzhq_journey_close_operation_lost_art_part2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
            Signature
          </p>
          <h3 className="mt-3 font-display text-large uppercase leading-none">
            {producer.signature.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {producer.signature.line}
          </p>
          <p className="mt-6 text-sm text-white/80">
            {producer.signature.primary.name}
            <span className="text-muted">
              {" "}
              · {producer.signature.primary.detail} ·{" "}
              {producer.signature.primary.year}
            </span>
          </p>
          <ul className="mt-4 space-y-1.5">
            {producer.signature.trail.map((item) => (
              <li key={item} className="text-[11px] uppercase tracking-[0.2em] text-muted">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BUILD ACROSS BORDERS — the five core evidence objects, editorial rhythm */}
      <div className="mt-14 md:mt-20">
        <div className="flex items-baseline gap-4 border-b border-white/10 pb-4 md:gap-8">
          <span className="text-sm tracking-widest text-muted">01</span>
          <h3 className="font-display text-large uppercase leading-none">
            Build Across Borders
          </h3>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          {producer.works.map((work) => (
            <article
              key={work.id}
              className={`flex flex-col gap-5 bg-elevated p-6 md:p-8 ${work.span ?? ""}`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
                  {work.tag}
                </p>
                <p className="text-[11px] tracking-[0.2em] text-muted">
                  {work.year}
                </p>
              </div>

              {work.media ? (
                <img
                  src={work.media}
                  alt={work.alt}
                  loading="lazy"
                  className={`w-full object-cover ${
                    work.id === "theunited"
                      ? "max-h-[420px] md:max-h-[520px]"
                      : "max-h-[280px]"
                  }`}
                />
              ) : null}

              <div className="flex flex-col gap-2">
                <h4 className="font-display text-2xl uppercase leading-none md:text-3xl">
                  {work.title}
                </h4>
                <p className="text-sm text-white/80">{work.role}</p>
                <p className="text-sm leading-relaxed text-muted">
                  {work.story}
                </p>
                {work.credits ? (
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                    {work.credits}
                  </p>
                ) : null}
                {work.watchUrl ? (
                  <a
                    href={work.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 self-start rounded-full border border-white/20 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent hover:text-accent"
                  >
                    Watch the cypher
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* WHAT I BUILD — four services, compact */}
      <div className="mt-14 md:mt-20">
        <div className="flex items-baseline gap-4 border-b border-white/10 pb-4 md:gap-8">
          <span className="text-sm tracking-widest text-muted">02</span>
          <h3 className="font-display text-large uppercase leading-none">
            What I Build
          </h3>
        </div>
        <ul className="mt-4 grid md:grid-cols-2">
          {producer.services.map((service) => (
            <li
              key={service.name}
              className="flex flex-col gap-1 border-b border-white/10 py-5 md:border-r md:last:border-r-0"
            >
              <span className="font-display text-2xl uppercase leading-none transition-colors hover:text-accent">
                {service.name}
              </span>
              <span className="text-sm text-muted">{service.line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* BOOK SKILLZ — same destination as every discipline */}
      <div className="mt-14 flex md:mt-20">
        <a
          href="#book"
          className="rounded-full bg-accent px-8 py-4 font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
        >
          Book Skillz
        </a>
      </div>
    </div>
  );
}

export function WhatIDo() {
  return (
    <section id="what-i-do" className="mx-auto w-full max-w-[1520px] px-6 py-24 scroll-mt-20 md:px-10 md:py-40">
      <SectionHeader
        index="02"
        title="What I Do"
        note="What you can book: five disciplines, one practice."
      />
      <ul className="mt-12 md:mt-16">
        {disciplines.map((item, i) => (
          <li key={item.name} className="border-t border-white/10 last:border-b">
            <Reveal delay={i * 60}>
              {item.chapter ? (
                <Chapter
                  name={item.name}
                  note={item.note}
                  panelId={item.panelId}
                  staggered={item.staggered}
                >
                  {item.chapter}
                </Chapter>
              ) : (
                <div
                  className={`group flex flex-col gap-2 py-8 transition-colors md:flex-row md:items-baseline md:gap-6 md:py-10 ${
                    i % 2 === 1 ? "md:pl-[10%]" : ""
                  }`}
                >
                  <span className="font-display text-giant uppercase leading-none transition-colors group-hover:text-accent md:min-w-0">
                    {item.name}
                  </span>
                  <p className="text-sm leading-relaxed text-muted transition-colors group-hover:text-white/80 md:ml-auto md:text-right">
                    {item.note}
                  </p>
                </div>
              )}
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
