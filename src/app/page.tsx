import { ViewTransition } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { BookingFilm } from "@/components/booking-film";
import { WhatIDo } from "@/components/what-i-do";
import { Booking } from "@/components/booking";
import { WatchListen } from "@/components/watch-listen";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://djlethalskillz.com/",
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
