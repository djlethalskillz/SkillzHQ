import { ViewTransition } from "react";
import { Hero } from "@/components/hero";
import { AnthemBridge } from "@/components/anthem-bridge";
import { WhatIDo } from "@/components/what-i-do";
import { Booking } from "@/components/booking";
import { WatchListen } from "@/components/watch-listen";

export default function Home() {
  return (
    // DEMO: route changes cut like a documentary (old page drops to black,
    // new page rises). Header stays anchored; disabled under reduced motion.
    <ViewTransition enter="doc-cut-in" exit="doc-cut-out" default="none">
      <div>
        <Hero />
        <AnthemBridge />
        <WhatIDo />
        <Booking />
        <WatchListen />
      </div>
    </ViewTransition>
  );
}
