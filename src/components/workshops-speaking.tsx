import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const workshops = [
  { name: "Turntablism", note: "Technique · Practice · Performance" },
  { name: "DJ culture", note: "History · Craft · The club" },
  { name: "Hip-Hop culture", note: "Foundations · Knowledge · Respect" },
  { name: "Creative practice", note: "Process · Discipline · Voice" },
];

const speaking = [
  { name: "Music", note: "The culture · The industry" },
  { name: "Culture", note: "Hip-hop · Heritage · Future" },
  { name: "Technology", note: "Tools · Innovation" },
  { name: "Web3 / creator economy", note: "Ownership · Independence" },
  { name: "Creative entrepreneurship", note: "Building · Staying true" },
];

export function WorkshopsSpeaking() {
  return (
    <section
      id="workshops-speaking"
      className="mx-auto w-full max-w-[1520px] px-6 py-24 scroll-mt-20 md:px-10 md:py-40"
    >
      <SectionHeader
        index="03"
        title="Workshops / Speaking"
        note="Two worlds — hands-on culture and ideas for the room."
      />
      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col gap-10 bg-accent p-8 text-black md:p-12">
            <div>
              <h3 className="font-display text-large uppercase leading-none">
                Workshops
              </h3>
              <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-black/60">
                Book as workshop · talk · session
              </p>
              <ul className="mt-10 flex flex-col md:mt-14">
                {workshops.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-baseline justify-between gap-6 border-t border-black/25 py-5 last:border-b md:py-6"
                  >
                    <span className="font-display text-large uppercase leading-none">
                      {item.name}
                    </span>
                    <span className="text-right text-xs text-black/70">
                      {item.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto">
              <video
                src={site.workshopsVideo.src}
                poster={site.workshopsVideo.poster}
                controls
                preload="metadata"
                playsInline
                aria-label={site.workshopsVideo.alt}
                className="aspect-[9/16] w-full object-cover"
              />
              <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-black/60">
                Each One Teach One — film
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120} className="md:mt-28">
          <div className="flex h-full flex-col bg-elevated p-8 md:p-12">
            <h3 className="font-display text-large uppercase leading-none">
              Speaking
            </h3>
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/60">
              Book as workshop · talk · session
            </p>
            <ul className="mt-10 flex flex-col md:mt-14">
              {speaking.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-6 border-t border-white/25 py-5 last:border-b md:py-6"
                >
                  <span className="font-display text-large uppercase leading-none">
                    {item.name}
                  </span>
                  <span className="text-right text-xs text-white/70">
                    {item.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
