import { ViewTransition } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { BookingFilm } from "@/components/booking-film";
import { WhatIDo } from "@/components/what-i-do";
import { Booking } from "@/components/booking";
import { WatchListen } from "@/components/watch-listen";

const title = "DJ Lethal Skillz · DJ · Turntablist · Producer";
const description =
  "DJ Lethal Skillz: commercial DJ, turntablist and producer. Available for bookings, festivals, workshops, speaking and creative collaborations.";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://djlethalskillz.com/",
  },
  // The home page's own share image (the Hero, rendered from the site). A page's openGraph replaces the
  // layout's as a whole, so the layout's other fields are repeated here.
  openGraph: {
    title,
    description,
    url: "https://djlethalskillz.com/",
    siteName: "DJ Lethal Skillz",
    type: "website",
    images: [
      {
        url: "https://djlethalskillz.com/assets/og/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "DJ Lethal Skillz in front of the SKILLZ wordmark and a turntable: Each One Teach One. Culture, education, turntablism, legacy, worldwide.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://djlethalskillz.com/assets/og/og-home.jpg"],
  },
};

export default function Home() {
  return (
    // DEMO: route changes cut like a documentary (old page drops to black,
    // new page rises). Header stays anchored; disabled under reduced motion.
    <ViewTransition enter="doc-cut-in" exit="doc-cut-out" default="none">
      <div>
        <Hero />
        <BookingFilm />
        <WhatIDo />
        <Booking />
        <WatchListen />
      </div>
    </ViewTransition>
  );
}
