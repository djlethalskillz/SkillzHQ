import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { VinylPlayer } from "@/components/vinyl-player";

const footerLinks = [
  { href: "#what-i-do", label: "What I Do" },
  { href: "#book", label: "Book Skillz" },
  { href: "#watch-listen", label: "Watch / Listen" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/djlethalskillz/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/djlethalskillz",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/djlethalskillz961/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
      </svg>
    ),
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/7F3kgeoTzXbi5JLPylw4qW",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.8.8 0 0 1-1 0c-2.8-1.7-6.3-2.1-10.5-1.2a.8.8 0 1 1-.3-1.5c4.6-1 8.5-.6 11.6 1.3a.7.7 0 0 1 .2 1.1zm1.5-3.3a1 1 0 0 1-1.4.2c-3.2-2-8-2.5-11.8-1.4a1 1 0 1 1-.6-1.9c4.3-1.3 9.6-.7 13.3 1.7a1 1 0 0 1 .2 1.4zm.1-3.4C15.3 8.6 8.7 8.4 5 9.7a1.2 1.2 0 1 1-.7-2.3C8.4 5.9 15.7 6.1 20 8.7a1.2 1.2 0 1 1-1.3 2z" />
      </svg>
    ),
  },
  {
    label: "Apple Music",
    href: "https://music.apple.com/au/artist/dj-lethal-skillz/301489359",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.7 12.9c0-2.4 1.9-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.2-2.9.9-3.6.9-.7 0-1.8-.9-3-.9-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.4 1.2 0 1.6-.8 3-.8 1.4 0 1.7.8 3 .8 1.2 0 2-1.2 2.8-2.3.9-1.3 1.2-2.5 1.3-2.6 0 0-2.4-1-2.4-3.5zM14.5 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.1-.5 2.8-1.5z" />
      </svg>
    ),
  },
  {
    label: "Tidal",
    href: "https://tidal.com/artist/4004977/u",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 4.2 8.1 8.1 12 12l3.9-3.9zM8.1 8.1 4.2 12l3.9 3.9L12 12zM15.9 8.1 12 12l3.9 3.9L19.8 12zM12 12l-3.9 3.9 3.9 3.9 3.9-3.9z" />
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://medium.com/@djlethalskillz",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <ellipse cx="4.8" cy="11.6" rx="3.8" ry="5.8" />
        <ellipse cx="14.9" cy="11.6" rx="3.8" ry="5.8" />
        <ellipse cx="20.9" cy="11.6" rx="2.9" ry="4.5" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-elevated">
      <div className="mx-auto w-full max-w-[1520px] px-6 py-12 md:px-10 md:py-16">
        <VinylPlayer />
        <Reveal>
          <section aria-label="Follow Skillz" className="pb-14 md:pb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted">
              Stay Connected
            </p>
            <h2 className="mt-3 font-display text-large uppercase leading-none">
              Follow Skillz
            </h2>
            <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-8 md:mt-12">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (opens in new tab)`}
                    className="group flex w-16 flex-col items-center gap-2"
                  >
                    <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-accent/35 text-accent transition-colors group-hover:border-accent group-hover:text-accent">
                      <span className="flex h-[20px] w-[20px] items-center justify-center [&_svg]:h-full [&_svg]:w-full">
                        {social.icon}
                      </span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-white">
                      {social.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
        <div className="flex flex-col gap-10 border-t border-white/10 pt-12 md:flex-row md:items-end md:justify-between md:pt-16">
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
