import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const disciplines = [
  { name: "DJ", note: "Club sets · Private events · Reading the room" },
  { name: "Turntablism", note: "Scratch routines · Live performance craft" },
  { name: "Events", note: "Dance floors · Launches · Nightlife" },
  { name: "Festivals", note: "Stage sets · Festival slots" },
  { name: "Culture", note: "Hip-hop culture · Legacy · Community" },
  { name: "Producer", note: "Beats · Tracks · Releases" },
];

export function WhatIDo() {
  return (
    <section id="what-i-do" className="mx-auto w-full max-w-[1520px] px-6 py-24 scroll-mt-20 md:px-10 md:py-40">
      <SectionHeader
        index="02"
        title="What I Do"
        note="What you can book — six disciplines, one practice."
      />
      <ul className="mt-12 md:mt-16">
        {disciplines.map((item, i) => (
          <li key={item.name} className="border-t border-white/10 last:border-b">
            <Reveal delay={i * 60}>
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
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
