import { Hero } from "@/components/hero";
import { WhatIDo } from "@/components/what-i-do";
import { WorkshopsSpeaking } from "@/components/workshops-speaking";
import { Booking } from "@/components/booking";
import { WatchListen } from "@/components/watch-listen";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatIDo />
      <WorkshopsSpeaking />
      <Booking />
      <WatchListen />
    </>
  );
}
