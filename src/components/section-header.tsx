import { Reveal } from "@/components/reveal";

type SectionHeaderProps = {
  index: string;
  title: string;
  note?: string;
  noteClassName?: string;
  indexClassName?: string;
  /** Dark ink variant for the yellow Book Skillz band. */
  ink?: boolean;
};

/**
 * DEMO: chapter header as a film slate — a giant outlined chapter numeral
 * behind the title, a rule that draws in, the editorial note as the slate's
 * caption. The numeral is decorative (aria-hidden); the h2 carries meaning.
 */
export function SectionHeader({ index, title, note, noteClassName, indexClassName, ink }: SectionHeaderProps) {
  return (
    <Reveal>
      <div className="relative pt-4 md:pt-8">
        <span
          aria-hidden="true"
          className={`slate-num pointer-events-none absolute -top-[0.18em] left-[-0.04em] select-none text-[clamp(7rem,21vw,19rem)] ${
            ink ? "slate-num--ink" : ""
          } ${indexClassName ?? ""}`}
        >
          {index}
        </span>
        <div className="relative flex flex-col gap-5 pb-6 pt-[clamp(3.2rem,9vw,8rem)] md:flex-row md:items-end md:justify-between md:pb-8">
          <div className="flex flex-col gap-3">
            <span
              className={`font-arch-mono text-[11px] uppercase tracking-[0.3em] ${
                ink ? "text-black/60" : "text-accent"
              }`}
            >
              Chapter {index}
            </span>
            <h2 className="font-display text-giant uppercase leading-[0.9]">{title}</h2>
          </div>
          {note ? (
            <p
              className={`max-w-72 text-sm leading-relaxed ${ink ? "text-black/70" : "text-muted"} ${
                noteClassName ?? ""
              }`}
            >
              {note}
            </p>
          ) : null}
        </div>
        <div
          aria-hidden="true"
          className={`slate-rule h-px w-full ${ink ? "bg-black/30" : "bg-white/20"}`}
        />
      </div>
    </Reveal>
  );
}
