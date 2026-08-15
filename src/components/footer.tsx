import Link from "next/link";
import { site } from "@/lib/site";

const footerLinks = [
  { href: "#what-i-do", label: "What I Do" },
  { href: "#book", label: "Book Skillz" },
  { href: "#watch-listen", label: "Watch / Listen" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-elevated">
      <div className="mx-auto w-full max-w-[1520px] px-6 py-12 md:px-10 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted">
              {site.name}
            </p>
            <p className="mt-3 font-display text-giant uppercase leading-none">
              {site.shortName}
            </p>
          </div>
          <nav
            className="flex flex-col gap-3 text-sm text-white/70 md:items-end"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#book"
              className="rounded-full bg-accent px-6 py-3 font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white"
            >
              Book Skillz
            </Link>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <a href="#landing" className="transition-colors hover:text-white">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
