"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A pressed record whose groove sheen follows the pointer like a light
 * source over a real disc. CSS only (conic-gradient angle in a custom
 * property) — a WebGL version was considered and rejected: this achieves
 * the same analog read at 0 kB, works without a GPU context, and degrades
 * to a static sheen. Fine pointers only; reduced motion = static.
 */
export function ArchiveRecord({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let angle = 200;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--sheen", `${angle.toFixed(1)}deg`);
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`record ${className}`} aria-hidden="true">
      {/* Grooves are radially symmetric, so only the label shows the spin;
          the sheen stays fixed like light falling on the disc. */}
      <div className="record-sheen" />
      {children}
    </div>
  );
}
