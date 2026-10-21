import type { Metadata } from "next";
import { ViewTransition } from "react";
import { LifeArchive } from "@/components/life-archive";
import { CRATES } from "@/lib/life-archive";

const SITE = "https://djlethalskillz.com";

// The films as structured data: one VideoObject per crate, newest first, built
// from the same CRATES list the page renders. VERIFY: uploadDate (required for
// video rich results) is not in the source data and is deliberately left out.
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
    item: {
      "@type": "VideoObject",
      name: c.accent ? `${c.title} ${c.accent.replace(/^·\s*/, "")}` : c.title,
      ...(c.note ? { description: c.note } : {}),
      thumbnailUrl: `${SITE}/assets/life-archive/${c.youtubeId}.webp`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${c.youtubeId}`,
      url: `${SITE}/life-archive#crate-${c.number}`,
      author: { "@id": `${SITE}/#person` },
    },
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
