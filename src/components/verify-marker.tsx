/**
 * PREVIEW ONLY: a visible placeholder for facts the owner still has to
 * confirm. Deliberately looks unfinished (dashed, bracketed) so it can never
 * pass for real copy; remove each marker once its fact is verified.
 */
export function VerifyMarker({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span
      className={`inline-block border border-dashed border-accent/60 px-1.5 py-0.5 font-arch-mono text-[10px] uppercase leading-snug tracking-[0.18em] text-accent/90 ${className}`}
    >
      [VERIFY: {children}]
    </span>
  );
}
