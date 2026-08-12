import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

type PanelProps = {
  title: string;
  sub: string;
  link: typeof site.media.youtube;
};

function Panel({ title, sub, link }: PanelProps) {
  const inner = (
    <div className="flex h-full flex-col justify-between gap-16 bg-elevated p-8 md:p-12">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
          {sub}
        </p>
        <h3 className="mt-6 font-display text-giant uppercase leading-none transition-colors hover:text-accent">
          {title}
        </h3>
      </div>
      {link ? (
        <span className="self-start rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white">
          Open {link.label}
        </span>
      ) : (
        <span className="flex items-center gap-3 self-start text-xs uppercase tracking-[0.3em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Available soon
        </span>
      )}
    </div>
  );

  return (
    <Reveal className="h-full">
      {link ? (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </Reveal>
  );
}

export function WatchListen() {
  return (
    <section
      id="watch-listen"
      className="mx-auto w-full max-w-[1520px] px-6 py-24 scroll-mt-20 md:px-10 md:py-40"
    >
      <SectionHeader
        index="05"
        title="Watch / Listen"
        note="Performance footage and music."
      />
      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
        <Panel
          title="Watch"
          sub="YouTube · Performance footage"
          link={site.media.youtube}
        />
        <Panel
          title="Listen"
          sub="Spotify · Music"
          link={site.media.spotify}
        />
      </div>
    </section>
  );
}
