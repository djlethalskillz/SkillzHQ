import type { Metadata } from "next";
import { ViewTransition } from "react";
import { LifeArchive } from "@/components/life-archive";
import { CRATES } from "@/lib/life-archive";

const SITE = "https://djlethalskillz.com";

// The films as a summary list: each entry points at the film's own page, which
// carries the one VideoObject for that film (single source, no duplicates).
const FILMS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Life Archive · DJ Lethal Skillz",
  url: `${SITE}/life-archive`,
  itemListOrder: "https://schema.org/ItemListOrderDescending",
  numberOfItems: CRATES.length,
  itemListElement: CRATES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE}/life-archive/${c.number}`,
  })),
};

export const metadata: Metadata = {
  title: "Life Archive · DJ Lethal Skillz",
  description:
    "The Life Archive: films from the life and work of DJ Lethal Skillz — Music Video Archive Vol. 2, AL JISR, Music Video Archive Vol. 1, Why Does Hip Hop Mention Beirut? Volume 2, I Grew Up in Beirut, Lebanese DJ History From My View, A Rap Show Hired Me, PhonoSapien, 961 Underground, Safeit bi 3akss el Seir. Newest first.",
  alternates: {
    canonical: "https://djlethalskillz.com/life-archive",
  },
  openGraph: {
    title: "Life Archive · DJ Lethal Skillz",
    description:
      "The Life Archive: films from the life and work of DJ Lethal Skillz — Music Video Archive Vol. 2, AL JISR, Music Video Archive Vol. 1, Why Does Hip Hop Mention Beirut? Volume 2, I Grew Up in Beirut, Lebanese DJ History From My View, A Rap Show Hired Me, PhonoSapien, 961 Underground, Safeit bi 3akss el Seir. Newest first.",
    url: "https://djlethalskillz.com/life-archive",
    siteName: "DJ Lethal Skillz",
    type: "website",
    images: [
      {
        url: "https://djlethalskillz.com/assets/djlethalskillz-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DJ Lethal Skillz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Archive · DJ Lethal Skillz",
    description:
      "The Life Archive: films from the life and work of DJ Lethal Skillz — Music Video Archive Vol. 2, AL JISR, Music Video Archive Vol. 1, Why Does Hip Hop Mention Beirut? Volume 2, I Grew Up in Beirut, Lebanese DJ History From My View, A Rap Show Hired Me, PhonoSapien, 961 Underground, Safeit bi 3akss el Seir. Newest first.",
    images: ["https://djlethalskillz.com/assets/djlethalskillz-og-image.jpg"],
  },
};

export default function LifeArchivePage() {
  return (
    <ViewTransition enter="doc-cut-in" exit="doc-cut-out" default="none">
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FILMS_JSONLD) }} />
        <LifeArchive />
      </div>
    </ViewTransition>
  );
}
