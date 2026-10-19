import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { FilmFacade } from "@/components/film-facade";
import { SpotifyFacade } from "@/components/spotify-facade";

const SPOTIFY_EMBED =
  "https://open.spotify.com/embed/artist/7F3kgeoTzXbi5JLPylw4qW?utm_source=skillzhq&theme=0";

/** Official channel pick: DJ Lethal Skillz — Dynamic DJ Set (turntablism set). */
const YOUTUBE_VIDEO = "SQRaL2YMKSI";

function WatchPanel() {
  const link = site.media.youtube!;
  return (
    <Reveal className="h-full">
      <div data-media="watch" className="media-panel flex h-full flex-col bg-elevated p-8 md:p-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
            YouTube · Performance footage
          </p>
          <h3 className="mt-6 font-display text-large uppercase leading-none transition-colors hover:text-accent">
            Watch
          </h3>
        </div>
        {/* DEMO: on-demand player (audit CT-08). The still is this video's
            own YouTube cover (hq 480×360 — no higher resolution was fetched). */}
        <div className="mt-8 shrink-0">
          <FilmFacade
            youtubeId={YOUTUBE_VIDEO}
            title="DJ Lethal Skillz Freestyle Scratch"
            still="/assets/life-archive/SQRaL2YMKSI.webp"
          />
        </div>
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
      <div data-media="listen" className="media-panel flex h-full flex-col bg-elevated p-8 md:p-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
            Spotify · Music
          </p>
          <h3 className="mt-6 font-display text-large uppercase leading-none transition-colors hover:text-accent">
            Listen
          </h3>
        </div>
        <SpotifyFacade embed={SPOTIFY_EMBED} href={link.url} />
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
      <div className="media-index mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
        <WatchPanel />
        <ListenPanel />
      </div>
    </section>
  );
}
