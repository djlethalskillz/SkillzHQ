"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * DEMO: cross-chapter navigation at the end of every page — the next record
 * in the crate. From the HQ it pulls the Life Archive's newest film still;
 * from the archive it returns to the HQ. Copy is the site's existing lines.
 */
export function NextStop() {
  const pathname = usePathname();
  const toArchive = pathname !== "/life-archive";
  const href = toArchive ? "/life-archive" : "/#landing";
  // Back to the HQ shows the composed hero (the canonical hero reference), not
  // the hero's archival layer: that file is a ~96 % transparent compositing
  // layer and reads as a blank sheet on this paper card.
  const still = toArchive ? "/assets/life-archive/9oT5hj4XVXA-640.webp" : "/assets/dj-lethal-skillz-hero2-reference-724.webp";

  return (
    <Link
      href={href}
      className="group grid items-center gap-8 border-b border-white/10 py-14 md:grid-cols-12 md:py-20"
    >
      <span className="relative block md:col-span-5">
        <span className="block rotate-[-2deg] bg-[#ece8de] p-2 pb-8 shadow-[0_20px_40px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:-translate-y-1">
          <img src={still} alt="" loading="lazy" decoding="async" className="block aspect-video w-full object-cover" />
        </span>
      </span>
      <span className="flex flex-col gap-4 md:col-span-6 md:col-start-7">
        <span className="font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">
          {toArchive ? "Next in the crate" : "Back to the HQ"}
        </span>
        <span className="font-display text-giant uppercase leading-[0.9] transition-colors group-hover:text-accent">
          {toArchive ? "Life Archive" : "SkillzHQ"}
        </span>
        <span className="max-w-[44ch] text-sm leading-relaxed text-white/65">
          {toArchive
            ? "Films from the life and work of DJ Lethal Skillz, kept here by hand."
            : "DJ · Turntablist · Producer — what you can book: five disciplines, one practice."}
        </span>
        <span aria-hidden="true" className="font-display text-3xl text-accent transition-transform group-hover:translate-x-2">
          →
        </span>
      </span>
    </Link>
  );
}
