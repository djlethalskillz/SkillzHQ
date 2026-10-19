import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[80svh] w-full max-w-[1520px] flex-col justify-center overflow-hidden px-6 pb-20 pt-32 md:px-10">
      <span
        aria-hidden="true"
        className="slate-num pointer-events-none absolute right-[-0.05em] top-1/2 -translate-y-1/2 select-none text-[clamp(10rem,34vw,30rem)]"
      >
        404
      </span>
      <p className="relative font-arch-mono text-[11px] uppercase tracking-[0.3em] text-accent">Error 404</p>
      <h1 className="relative mt-5 max-w-[14ch] font-display text-giant uppercase leading-[0.9]">
        This record isn&apos;t in the crate.
      </h1>
      <div className="relative mt-10 flex flex-wrap gap-4">
        <Link
          href="/#landing"
          className="rounded-full bg-accent px-7 py-4 font-display text-xl uppercase tracking-wider text-black transition-colors hover:bg-white"
        >
          Back to the HQ
        </Link>
        <Link
          href="/life-archive"
          className="rounded-full border border-white/30 px-7 py-4 font-display text-xl uppercase tracking-wider text-white transition-colors hover:border-accent hover:text-accent"
        >
          Life Archive
        </Link>
      </div>
    </div>
  );
}
