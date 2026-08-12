import { Reveal } from "@/components/reveal";

type SectionHeaderProps = {
  index: string;
  title: string;
  note?: string;
};

/** Editorial numbered section heading. */
export function SectionHeader({ index, title, note }: SectionHeaderProps) {
  return (
    <Reveal>
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
          <span className="text-sm tracking-widest text-muted">{index}</span>
          <h2 className="font-display text-giant uppercase leading-none">
            {title}
          </h2>
        </div>
        {note ? (
          <p className="max-w-64 text-sm leading-relaxed text-muted">{note}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
