import type { Metadata } from "next";
import { ViewTransition } from "react";
import { BandcampCatalogue } from "@/components/bandcamp-catalogue";

// DRAFT description — new copy awaiting the owner's wording.
const description =
  "Albums and tracks by DJ Lethal Skillz on Bandcamp — listen here, buy and download on Bandcamp where available.";

export const metadata: Metadata = {
  title: "Bandcamp · DJ Lethal Skillz",
  description,
  alternates: {
    canonical: "https://djlethalskillz.com/bandcamp",
  },
  openGraph: {
    title: "Bandcamp · DJ Lethal Skillz",
    description,
    url: "https://djlethalskillz.com/bandcamp",
    siteName: "DJ Lethal Skillz",
    type: "website",
    images: [
      {
        url: "https://djlethalskillz.com/assets/og/og-bandcamp.jpg",
        width: 1200,
        height: 630,
        alt: "Bandcamp catalogue of DJ Lethal Skillz, with the album Above the Clouds on the deck",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bandcamp · DJ Lethal Skillz",
    description,
    images: ["https://djlethalskillz.com/assets/og/og-bandcamp.jpg"],
  },
};

export default function BandcampPage() {
  return (
    <ViewTransition enter="doc-cut-in" exit="doc-cut-out" default="none">
      <div>
        <BandcampCatalogue />
      </div>
    </ViewTransition>
  );
}
