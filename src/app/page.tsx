import { Hero } from "@/components/hero";
import { WhatIDo } from "@/components/what-i-do";
import { Booking } from "@/components/booking";
import { WatchListen } from "@/components/watch-listen";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatIDo />
      <Booking />
      <WatchListen />
    </>
  );
}
