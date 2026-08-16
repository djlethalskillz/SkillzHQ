import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const SPOTIFY_EMBED =
  "https://open.spotify.com/embed/artist/7F3kgeoTzXbi5JLPylw4qW?utm_source=skillzhq&theme=0";

/** Official channel pick: DJ Lethal Skillz — Dynamic DJ Set (turntablism set). */
const YOUTUBE_VIDEO = "SQRaL2YMKSI";
const YOUTUBE_EMBED = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO}`;

function WatchPanel() {
  const link = site.media.youtube!;
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col bg-elevated p-8 md:p-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
            YouTube · Performance footage
          </p>
          <h3 className="mt-6 font-display text-giant uppercase leading-none transition-colors hover:text-accent">
            Watch
          </h3>
        </div>
        <iframe
          src={YOUTUBE_EMBED}
          title="DJ Lethal Skillz Freestyle Scratch — YouTube"
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
          className="mt-8 aspect-video w-full shrink-0 border-0 bg-black"
        />
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 self-start rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
        >
          Open {link.label}
        </a>
      </div>
    </Reveal>
  );
}

function ListenPanel() {
  const link = site.media.spotify!;
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col bg-elevated p-8 md:p-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
            Spotify · Music
          </p>
          <h3 className="mt-6 font-display text-giant uppercase leading-none transition-colors hover:text-accent">
            Listen
          </h3>
        </div>
        <iframe
          src={SPOTIFY_EMBED}
          title="Skillz on Spotify — artist profile"
          loading="lazy"
          allow="encrypted-media; clipboard-write; fullscreen"
          className="mt-8 h-[352px] w-full shrink-0 border-0 bg-black"
        />
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 self-start rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
        >
          Open {link.label}
        </a>
      </div>
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
        index="04"
        title="Watch / Listen"
        note="Performance footage and music."
      />
      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
        <WatchPanel />
        <ListenPanel />
      </div>
    </section>
  );
}
