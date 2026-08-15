"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { fragments, type FieldFragment } from "@/lib/fragments";

/**
 * FRAGMENTS — ONE LIVING CINEMATIC SCENE.
 *
 * This is NOT a scrolling photo gallery. Skillz + Grandmaster Flash are the
 * gravitational centre of a single viewport; smaller archival fragments move
 * continuously around them — drifting, crossing, overlapping, entering and
 * exiting, regrouping, disappearing and returning. The visitor WATCHES the
 * archive move. Scrolling only enters/exits the scene and sways the field
 * subtly; it is never required to discover anything.
 *
 * Visual DNA transplanted from the original Living Archive build:
 *   - physical evidence objects, not cards: Polaroids (instant), clipped
 *     flyers, credential passes with punch holes, CD jcards;
 *   - captions printed dark-on-white directly onto the object's own mount
 *     (JetBrains Mono 9px) — no separate plates, no labels floating in space;
 *   - masking tape, film grain, edge vignette, warm/cool light leaks;
 *   - giant Big Shoulders archival words cropped at the scene edges;
 *   - warm paper palette (#F3F1EC / #e4e0d4 / #efece4) + aged brass yellow.
 *
 * The engine is TIME-driven (approved v4): one rAF loop, per-fragment
 * periods/phases (non-common-multiple, the field never repeats), direct style
 * writes, zero React state per frame. prefers-reduced-motion renders the same
 * field as an intentional static composition.
 *
 * All content comes from the manifest (src/lib/fragments.ts). The component
 * owns choreography and the physical-object rendering only.
 */

const byId: Map<string, (typeof fragments.items)[number]> = new Map(
  fragments.items.map((i) => [i.id, i]),
);
const fieldById: Map<string, FieldFragment> = new Map(
  fragments.field.map((f) => [f.id, f]),
);

declare global {
  interface Window {
    /** QA-only deterministic scene-time override (seconds). */
    __FRAG_TIME__?: number;
  }
}

const mqCache = new Map<string, MediaQueryList>();
const mq = (query: string) => {
  let m = mqCache.get(query);
  if (!m) {
    m = window.matchMedia(query);
    mqCache.set(query, m);
  }
  return m;
};

/** Hydration-safe media query via useSyncExternalStore — no setState in effect. */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      mq(query).addEventListener("change", onChange);
      return () => mq(query).removeEventListener("change", onChange);
    },
    () => mq(query).matches,
    () => false,
  );
}

function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

function BandKicker({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p
      className={`text-[11px] uppercase tracking-[0.3em] text-accent ${className}`}
    >
      {children}
    </p>
  );
}

/* ── PHYSICAL OBJECTS — the old build's evidence vocabulary ───────────── */

const DEEP_SHADOW =
  "shadow-[0_10px_26px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.4)]";

/** Media for a field figure — gallery item when one exists, otherwise the
 *  archive layer's own inline media (deep/secondary prints have no gallery
 *  entry and no caption). */
type MountItem = { media: string; alt: string; name?: string; context?: string };

/** Caption printed directly on the mount's own white surface — no plate.
 *  Suppressed on deep/secondary prints (too small to read — the archive
 *  table hides its labels in the clutter, like real paper). */
function MountCaption({
  f,
  name,
  context,
  className = "",
}: {
  f: FieldFragment;
  name?: string;
  context?: string;
  className?: string;
}) {
  if (f.label === false) return null;
  const text = context ? `${name} — ${context}` : name;
  return (
    <figcaption
      className={`font-arch-mono text-[9px] uppercase leading-[1.3] tracking-[0.03em] text-[rgba(20,20,20,0.72)] ${className}`}
    >
      {text}
    </figcaption>
  );
}

/** Polaroid: photo 4/5 in a warm white mount with the caption in the margin. */
function InstantMount({ f, item }: { f: FieldFragment; item: MountItem }) {
  return (
    <div className={`relative bg-paper p-[7px] pb-[34px] ${DEEP_SHADOW}`}>
      <img
        src={item.media}
        alt={item.alt}
        loading="eager"
        className="aspect-[4/5] w-full object-cover"
      />
      <MountCaption
        f={f}
        name={item.name}
        context={item.context}
        className="absolute left-[9px] right-[9px] bottom-[10px] text-center"
      />
    </div>
  );
}

/** Flyer: clipped corners, no caption — flyers carry their own typography. */
function FlyerMount({ f, item }: { f: FieldFragment; item: MountItem }) {
  return (
    <div
      className={`bg-[#242424] shadow-[0_10px_26px_rgba(0,0,0,0.5)] [clip-path:polygon(0%_1%,98%_0%,100%_97%,3%_100%)] ${DEEP_SHADOW}`}
    >
      <img
        src={item.media}
        alt={item.alt}
        loading="eager"
        className="aspect-[3/4] w-full object-cover"
      />
    </div>
  );
}

/** Pass: credential card, punch hole, caption in the bottom margin. */
function PassMount({ f, item }: { f: FieldFragment; item: MountItem }) {
  return (
    <div className={`relative bg-paper-warm p-[10px] pb-[26px] text-center shadow-[0_8px_20px_rgba(0,0,0,0.5)]`}>
      <div className="mx-auto mb-2 h-[10px] w-[10px] rounded-full bg-[#0A0A0A]" />
      <img
        src={item.media}
        alt={item.alt}
        loading="eager"
        className="aspect-[3/4] w-full object-cover"
      />
      <MountCaption
        f={f}
        name={item.name}
        context={item.context}
        className="absolute left-[8px] right-[8px] bottom-[8px] text-center"
      />
    </div>
  );
}

/** Jcard: photo floats left, caption sits in the card's own off-white space. */
function JcardMount({ f, item }: { f: FieldFragment; item: MountItem }) {
  return (
    <div
      className={`relative aspect-[6.7/4.7] bg-paper-card p-[6px] shadow-[0_8px_18px_rgba(0,0,0,0.5)]`}
    >
      <div className="absolute bottom-0 top-0 left-[38%] w-px bg-black/15" />
      <img
        src={item.media}
        alt={item.alt}
        loading="eager"
        className="float-left h-full w-[36%] object-cover"
      />
      <MountCaption
        f={f}
        name={item.name}
        context={item.context}
        className="absolute right-[6px] top-1/2 left-[40%] -translate-y-1/2 text-left"
      />
    </div>
  );
}

const MOUNT: Record<FieldFragment["variant"], typeof InstantMount> = {
  instant: InstantMount,
  flyer: FlyerMount,
  pass: PassMount,
  jcard: JcardMount,
};

/* ── THE SCENE — one centre, one field, one continuous archive ───────── */

function FragmentsScene() {
  const { hero, field } = fragments;
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const isTablet = useMediaQuery("(min-width: 768px)") && !isDesktop;
  const parallaxRef = useRef<HTMLDivElement>(null);
  const dressingRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLImageElement>(null);
  const fragEls = useRef(new Map<string, HTMLElement>());
  const [entered, setEntered] = useState(false);

  // Density: desktop full field, tablet reduced, mobile few fragments.
  const visible =
    isDesktop
      ? field
      : isTablet
        ? field.filter((f) => f.tablet !== false)
        : field.filter((f) => f.mobile);

  // One quiet entrance settle — then the archive carries all motion.
  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  /**
   * THE ENGINE — waypoint travel, adapted from the original Living Archive's
   * motion DNA (living_archive_v1_17_FINAL.html). The old build assigned each
   * object a fresh absolute waypoint and let a 1.8s cubic-bezier transition
   * carry it there. Here the same waypoint model runs inside the rAF loop as a
   * damped lerp (frame-rate independent, same accel/decel shape):
   *
   *   - every fragment owns a CURRENT pose and a TARGET waypoint; each frame
   *     the pose is pulled toward the target with exponential smoothing;
   *   - on arrival (or after a short random dwell) a NEW waypoint is picked
   *     from the fragment's trajectory bias — randomisation shapes
   *     trajectories, never individual frames, so nothing jitters;
   *   - CROSSING: ~22% of journeys target points on lines near the centre —
   *     the fragment travels ACROSS the scene, passing the hero (front-tier
   *     waypoints are pushed off the photo's face zone);
   *   - DRIFT: angle walks, radius breathes around the home orbit,
   *     occasionally (8%) the fragment exits the field edge;
   *   - depth: on ~22% of journeys a PRIMARY fragment flips between behind
   *     (z-10) and in front (z-20) of the hero — the old build's z-counter
   *     behaviour. Secondary (z-5) and deep (z-1) archive layers never flip:
   *     they fill the table beneath the curated selection;
   *   - rotation target rides along each journey; presence cycles unchanged.
   *
   * Poses are OFFSETS from the element's % base position (the transform
   * composes on top of left/top), so resize keeps fragments glued to the
   * scene. No oscillation around a base point: fragments accumulate travel.
   */
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();

    interface Pose {
      x: number; y: number; rot: number; s: number;
      tx: number; ty: number; tr: number; ts: number;
      tau: number; dwell: number; sincePick: number;
      angle: number; radius: number; tier: number;
      first: boolean;
    }
    const pose = new Map<string, Pose>();

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    // Gaussian-ish via two uniforms — enough spread without ever jittering.
    const gauss = (a: number, b: number) => rnd(a, b) * 0.5 + rnd(a, b) * 0.5;
    // Layer z-tiers: deep archive 1 < secondary 5 < primary-behind 10 (ties
    // with the hero, which wins on DOM order) < primary-front 20.
    const layerTier = (f: FieldFragment) =>
      f.layer === "deep" ? 1 : f.layer === "secondary" ? 5 : f.above ? 20 : 10;

    // The photo's FACE ZONE — central 60% of the hero photo, in scene
    // coordinates (the engine's waypoints are viewport-space with the scene
    // flushed to the top, so scene-relative == engine-space). Fragments may
    // graze the mount edges (scrapbook look) but never park over the faces.
    let face = { cx: 0, cy: 0, hw: 0, hh: 0 };
    const readFace = () => {
      const h = document.querySelector<HTMLElement>('[data-qa="fragments-hero-photo"]');
      const scene = parallaxRef.current;
      if (!h || !scene) return;
      const r = h.getBoundingClientRect();
      const s = scene.getBoundingClientRect();
      face = {
        cx: r.x - s.x + r.width / 2,
        cy: r.y - s.y + r.height / 2,
        hw: r.width * 0.3,
        hh: r.height * 0.3,
      };
    };
    readFace();
    // Is the fragment's real box (layout size, scale margin, padding) clear
    // of the face zone? Half-extents (0.62x covers rotation inflation up to
    // ~45deg, +50 also keeps a parked front figure's box-shadow — blur 26 +
    // offset 10 ≈ 36px reach — and its tape (10px above the box) off the face).
    const boxClear = (ax: number, ay: number, el: HTMLElement) => {
      const hw = el.offsetWidth * 0.62 + 50;
      const hh = el.offsetHeight * 0.62 + 50;
      return (
        ax + hw < face.cx - face.hw ||
        ax - hw > face.cx + face.hw ||
        ay + hh < face.cy - face.hh ||
        ay - hh > face.cy + face.hh
      );
    };
    // Does the straight travel path (exponential lerp = straight segment in
    // offset space) from (x0,y0) to (x1,y1) bring the fragment's BOX over
    // the face zone? The face rect is inflated by the box half-extents, so
    // the test is on the centre line — the swept band of the box. Slab test
    // — returns [tEnter, tExit] along the segment when the box would touch
    // the face, null when it stays clear (or touches at a single point).
    const segOverlap = (
      x0: number, y0: number, x1: number, y1: number, hw: number, hh: number,
    ) => {
      let tmin = 0;
      let tmax = 1;
      const axes = [
        { d: x1 - x0, o: x0, lo: face.cx - face.hw - hw, hi: face.cx + face.hw + hw },
        { d: y1 - y0, o: y0, lo: face.cy - face.hh - hh, hi: face.cy + face.hh + hh },
      ];
      for (const { d, o, lo, hi } of axes) {
        if (Math.abs(d) < 1e-9) {
          if (o < lo || o > hi) return null; // parallel, outside
        } else {
          let ta = (lo - o) / d;
          let tb = (hi - o) / d;
          if (ta > tb) {
            const t = ta;
            ta = tb;
            tb = t;
          }
          tmin = Math.max(tmin, ta);
          tmax = Math.min(tmax, tb);
          if (tmin > tmax) return null;
        }
      }
      return [tmin, tmax];
    };

    const pickTarget = (
      f: FieldFragment, p: Pose, vw_: number, vh_: number, tier: number, el: HTMLElement,
    ) => {
      const cx = vw_ / 2;
      const cy = vh_ / 2;
      const first = p.first;
      // The fragment's home distance from the centre (its resting place).
      const home =
        Math.hypot((f.pos.left / 100) * vw_ - cx, (f.pos.top / 100) * vh_ - cy) || vw_ * 0.3;
      const maxR = Math.min(vw_, vh_) * 0.46;
      let angle: number;
      let radius: number;
      if (first) {
        // First journey: a local settle — the archive wakes from its resting
        // composition within ~2s of mount (no long dead start before the
        // first travel; the live browser sees motion immediately).
        angle = p.angle + rnd(-0.25, 0.25);
        radius = Math.max(0.12 * maxR, home * rnd(0.55, 1.45));
      } else if (Math.random() < 0.22) {
        // CROSSING journey: travels ACROSS the scene past the hero. In FRONT
        // (z-20) the waypoint keeps outside the hero's silhouette so Skillz +
        // Grandmaster Flash stay legible; BEHIND (z-0) it can pass right
        // under them — hidden by the opaque mount, the classic "disappears
        // behind the hero, emerges on the other side" moment.
        angle = p.angle + (Math.random() < 0.5 ? -1 : 1) * rnd(0.15, 0.6);
        radius =
          tier === 20
            ? rnd(0.42, 0.68) * maxR
            : rnd(0.05, 0.4) * maxR;
      } else {
        // DRIFT: keep the general region but roam — angle walks, radius
        // breathes around the home orbit; rarely the fragment leaves the
        // field edge. Radius floor keeps drifts off the hero.
        angle = p.angle + rnd(-0.9, 0.9);
        radius = Math.max(
          0.38 * maxR,
          Math.min(1.06 * maxR, home * rnd(0.75, 1.3) + gauss(-0.12, 0.12) * maxR),
        );
        if (Math.random() < 0.08) radius *= 1.35; // slip into the margin
      }
      // Absolute waypoint, converted to offset from base by the caller.
      let ax = cx + Math.cos(angle) * radius;
      let ay = cy + Math.sin(angle) * radius * (vh_ / vw_);
      const bx = (f.pos.left / 100) * vw_;
      const by = (f.pos.top / 100) * vh_;
      // HERO LEGIBILITY: a front-tier waypoint must keep the fragment's box
      // off the face zone AND the travel path must not cross it (exponential
      // lerp moves along the straight segment — a slow pass over the faces
      // would be exactly the occlusion we forbid). Behind-tier waypoints
      // pass freely — hidden by the mount. First push the waypoint out along
      // its angle until the box clears (1.6*maxR cap: vertical waypoints
      // need ~1.3*maxR to clear the face since y is compressed by vh/vw —
      // the old 12-iteration bound left a blind spot above/below the hero).
      if (tier === 20 && face.hw > 0) {
        let guard = 0;
        while (!boxClear(ax, ay, el) && guard < 24 && radius < 1.6 * maxR) {
          radius *= 1.08;
          ax = cx + Math.cos(angle) * radius;
          ay = cy + Math.sin(angle) * radius * (vh_ / vw_);
          guard++;
        }
        // Path guard: if the segment from the fragment's current position to
        // the waypoint would enter the face, clamp the waypoint to stop just
        // short of the near edge (box margin) — pushing radius out along the
        // same angle can never fix a chord that runs through the centre.
        // Fragments already inside the zone (ov[0] <= 0) are exiting — their
        // path leaves it, and the caller gives them a fast settle.
        const px0 = bx + p.x;
        const py0 = by + p.y;
        const hw = el.offsetWidth * 0.62 + 24;
        const hh = el.offsetHeight * 0.62 + 24;
        const md = Math.hypot(hw, hh);
        const clampAt = (x0: number, y0: number, x1: number, y1: number, ov: number[]) => {
          const dx = x1 - x0;
          const dy = y1 - y0;
          const len = Math.hypot(dx, dy) || 1;
          let t = ov[0] - md / len;
          for (let i = 0; i < 8 && t > 0.03 && !boxClear(x0 + dx * t, y0 + dy * t, el); i++) {
            t *= 0.85; // oblique graze — pull back toward the start
          }
          return t > 0.03 ? [x0 + dx * t, y0 + dy * t] : null;
        };
        const ov = segOverlap(px0, py0, ax, ay, hw, hh);
        if (ov && ov[0] > 0) {
          // ANY segment entering the face is clamped or rejected — including
          // entries right at the start (a fragment parked at the face edge by
          // an earlier clamp must not get a slow transit through the zone).
          const c = clampAt(px0, py0, ax, ay, ov);
          if (c) {
            ax = c[0];
            ay = c[1];
          } else {
            // Degenerate clamp (start parked at the edge): resample drift
            // waypoints until the travel path avoids the face. The drift band
            // only guarantees a radius floor, not face clearance for large
            // boxes, so each sample re-runs the box push-out too.
            let ov2: number[] | null = ov;
            let tried = 0;
            do {
              angle = p.angle + rnd(-0.9, 0.9);
              radius = Math.max(
                0.38 * maxR,
                Math.min(1.06 * maxR, home * rnd(0.75, 1.3) + gauss(-0.12, 0.12) * maxR),
              );
              ax = cx + Math.cos(angle) * radius;
              ay = cy + Math.sin(angle) * radius * (vh_ / vw_);
              let g2 = 0;
              while (!boxClear(ax, ay, el) && g2 < 24 && radius < 1.6 * maxR) {
                radius *= 1.08;
                ax = cx + Math.cos(angle) * radius;
                ay = cy + Math.sin(angle) * radius * (vh_ / vw_);
                g2++;
              }
              ov2 = segOverlap(px0, py0, ax, ay, hw, hh);
              tried++;
            } while (ov2 && ov2[0] > 0 && tried < 8);
            const c2 = ov2 && ov2[0] > 0 ? clampAt(px0, py0, ax, ay, ov2) : null;
            if (c2) {
              ax = c2[0];
              ay = c2[1];
            }
          }
        }
      }
      const tr = f.rot + (first ? rnd(-2, 2) : rnd(-7, 7));
      // First journeys settle fast so the wake-up motion is visible; steady
      // travel uses the approved slow pace (7.2–13.2s, ~20% slower than the
      // original 6–11s).
      const tau = first ? rnd(1.8, 2.8) : rnd(7.2, 13.2);
      const dwell = first ? 0 : Math.random() < 0.25 ? rnd(1.2, 4) : 0;
      return { tx: ax - bx, ty: ay - by, tr, ts: 1, tau, dwell, angle, radius, tier };
    };

    const tick = () => {
      const now = performance.now();
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.1) dt = 0.1; // tab-switch guard
      const vw_ = window.innerWidth;
      const vh_ = window.innerHeight;
      fragEls.current.forEach((el, id) => {
        const f = fieldById.get(id);
        if (!f) return;
        const bx = (f.pos.left / 100) * vw_;
        const by = (f.pos.top / 100) * vh_;
        let p = pose.get(id);
        if (!p) {
          // Initial pose: offset 0 (the resting composition) — the first
          // frames are exactly the current static layout ("rest" state).
          const cx = vw_ / 2;
          const cy = vh_ / 2;
          const home =
            Math.hypot(bx - cx, by - cy) || vw_ * 0.3;
          p = {
            x: 0, y: 0, rot: f.rot, s: 1,
            tx: 0, ty: 0, tr: f.rot, ts: 1,
            tau: rnd(7.2, 13.2), dwell: 0, sincePick: 0,
            angle: Math.atan2(by - cy, bx - cx),
            radius: home,
            tier: layerTier(f),
            first: true,
          };
          pose.set(id, p);
        }
        p.sincePick += dt;
        // Arrival: pick a new waypoint (immediately, or after a short dwell).
        const arrived = Math.hypot(p.tx - p.x, p.ty - p.y) < vw_ * 0.012;
        if ((arrived && p.dwell === 0) || p.sincePick > p.tau + p.dwell + 4) {
          // Depth flip first: ~22% of journeys swap tier — a PRIMARY fragment
          // crosses in front of / behind the hero mid-field. Secondary and
          // deep archive layers hold their tier forever.
          let tier = p.tier;
          if ((f.layer ?? "primary") === "primary" && Math.random() < 0.22) {
            const flipped = tier === 20 ? 10 : 20;
            // A behind-parked primary flipping to FRONT would paint over the
            // faces while exiting — hold the flip until the box is off the
            // face zone (the exit would cross it, fast-exit or not).
            if (!(flipped === 20 && face.hw > 0 && !boxClear(bx + p.x, by + p.y, el))) {
              tier = flipped;
            }
          }
          const np = pickTarget(f, p, vw_, vh_, tier, el);
          p.first = false;
          // Flipped to front while parked under the face: fast exit so the
          // hero clears in ~2s instead of a slow drift out.
          if (tier === 20 && face.hw > 0 && !boxClear(bx + p.x, by + p.y, el)) {
            np.tau = rnd(1.2, 2.2);
          }
          Object.assign(p, np, { sincePick: 0, tier });
          el.style.zIndex = String(tier);
        }
        // Exponential smoothing — continuous interpolation, no stepping.
        const k = 1 - Math.exp(-dt / p.tau);
        p.x += (p.tx - p.x) * k;
        p.y += (p.ty - p.y) * k;
        p.rot += (p.tr - p.rot) * k * 0.7;
        p.s += (p.ts - p.s) * k * 0.4;
        let op = 1;
        if (f.presence) {
          const pu = 2 * Math.PI * (now / 1000 / f.presence.period + f.presence.phase);
          op = f.presence.min + (1 - f.presence.min) * 0.5 * (1 + Math.cos(pu));
        }
        el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${p.rot.toFixed(2)}deg) scale(${p.s.toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", readFace);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", readFace);
    };
  }, [reduced]);

  // Subtle scroll influence: the whole field sways gently as the chapter
  // passes through — motion is never scroll-dependent, only flavoured by it.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      const el = parallaxRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p =
        (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
      const q = Math.max(-0.35, Math.min(0.35, p));
      el.style.transform = `translate3d(0, ${(q * 5).toFixed(2)}vh, 0)`;
      // the typographic field drifts far more slowly — it is the room, not
      // the papers on it
      const dr = dressingRef.current;
      if (dr) dr.style.transform = `translate3d(0, ${(q * 1.2).toFixed(2)}vh, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <div
      data-qa="fragments-scene"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* SCENE DRESSING — the archival room, static behind the motion */}
      <div ref={dressingRef} className="pointer-events-none absolute inset-0 z-0">
        {/* light leaks — warm top-left, cool bottom-right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 15% 12%, rgba(217,164,4,0.07) 0%, transparent 42%), radial-gradient(ellipse at 85% 80%, rgba(120,150,217,0.05) 0%, transparent 38%)",
          }}
        />
        {/* edge darkening — the table falls away from the centre */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(10,10,10,0.28) 0%, rgba(10,10,10,0.78) 68%, rgba(10,10,10,0.94) 100%)",
          }}
        />
        {/* THE TYPOGRAPHIC ARCHIVE — an irregular field of archival words,
            cropped by the scene, layered in opacity, mostly beneath the
            photographs. Not a grid: a document table in low light. */}
        <span className="font-arch absolute -top-[3vh] -left-[6vw] whitespace-nowrap text-[clamp(120px,19vw,340px)] leading-[0.78] tracking-[-0.015em] text-white/60">
          DOCUMENTED
        </span>
        <span className="font-arch absolute top-[22vh] left-[3vw] whitespace-nowrap text-[clamp(30px,5vw,90px)] leading-[0.78] tracking-[-0.015em] text-white/30">
          SKILLZ
        </span>
        <span className="font-arch absolute top-[8vh] right-[26vw] hidden whitespace-nowrap text-[clamp(14px,2.2vw,40px)] leading-[0.78] tracking-[-0.015em] text-white/10 md:block">
          LEGACY
        </span>
        <span className="font-arch absolute top-[18vh] right-[8vw] whitespace-nowrap text-[clamp(20px,3.5vw,64px)] leading-[0.78] tracking-[-0.015em] text-white/10">
          DUBAI
        </span>
        <span className="font-arch absolute top-[30vh] -right-[3vw] whitespace-nowrap text-[clamp(26px,5vw,90px)] leading-[0.78] tracking-[-0.015em] text-white/18">
          JAPAN
        </span>
        <span className="font-arch absolute top-[38vh] -left-[2vw] whitespace-nowrap text-[clamp(22px,4.5vw,80px)] leading-[0.78] tracking-[-0.015em] text-white/12">
          BEIRUT
        </span>
        <span className="font-arch absolute top-[12vh] left-[16vw] hidden whitespace-nowrap text-[clamp(16px,3vw,54px)] leading-[0.78] tracking-[-0.015em] text-white/10 md:block">
          LONDON
        </span>
        <span className="font-arch absolute top-[6vh] right-[4vw] hidden text-[clamp(30px,4vw,56px)] leading-[0.78] tracking-[-0.015em] text-white/20 [writing-mode:vertical-rl] md:block">
          SESSION
        </span>
        <span className="font-arch absolute -top-[4vh] -right-[5vw] whitespace-nowrap text-[clamp(46px,8vw,140px)] leading-[0.78] tracking-[-0.015em] text-white/25">
          HIP-HOP
        </span>
        <span className="font-arch absolute top-[62vh] -right-[8vw] text-right text-[clamp(90px,14vw,260px)] leading-[0.78] tracking-[-0.015em] text-arch-yellow/55">
          DECADES
        </span>
        <span className="font-arch absolute bottom-[26vh] left-[20vw] hidden whitespace-nowrap text-[clamp(12px,2.5vw,44px)] leading-[0.78] tracking-[-0.015em] text-white/9 md:block">
          RADIO
        </span>
        <span className="font-arch absolute bottom-[4vh] left-[42vw] hidden whitespace-nowrap text-[clamp(30px,5.5vw,84px)] leading-[0.78] tracking-[-0.015em] text-white/15 md:block">
          VINYL
        </span>
        <span className="font-arch absolute bottom-[18vh] right-[24vw] whitespace-nowrap text-[clamp(20px,4vw,72px)] leading-[0.78] tracking-[-0.015em] text-white/20">
          WORLD
        </span>
        <span className="font-arch absolute bottom-[6vh] left-[1vw] hidden text-[clamp(20px,3vw,48px)] leading-[0.78] tracking-[-0.015em] text-white/12 [writing-mode:vertical-rl] md:block">
          CULTURE
        </span>
        <span className="font-arch absolute top-[33vh] left-[33vw] whitespace-nowrap text-[clamp(34px,6.5vw,120px)] leading-[0.78] tracking-[-0.015em] text-white/8">
          ARCHIVE
        </span>
        {/* internal crop windows — a horizontal band of TURNTABLISM, a
            vertical slit of SCRATCH */}
        <span className="absolute -bottom-[1vh] left-[6vw] h-[7vh] w-[58vw] overflow-hidden">
          <span className="font-arch absolute -top-[3vh] left-0 whitespace-nowrap text-[clamp(70px,11vw,200px)] leading-[0.78] tracking-[-0.015em] text-white/35">
            TURNTABLISM
          </span>
        </span>
        <span className="absolute bottom-[14vh] left-[8vw] hidden h-[16vw] w-[7vw] overflow-hidden md:block">
          <span className="font-arch absolute -left-[2vw] top-0 whitespace-nowrap text-[clamp(30px,5.5vw,84px)] leading-[0.78] tracking-[-0.015em] text-white/14">
            SCRATCH
          </span>
        </span>
        {/* meta lines — the archivist's labels, above the field */}
        <span className="font-arch-mono absolute bottom-[5vh] left-[5vw] z-30 hidden text-[10px] uppercase tracking-[0.18em] text-white/30 md:block">
          Beirut · Dubai · Japan · London · France · USA
        </span>
        <span className="font-arch-mono absolute bottom-[5vh] right-[5.5vw] z-30 text-xs uppercase tracking-[0.18em] text-white/40">
          Selected from the Skillz archive
        </span>
      </div>

      <div
        ref={parallaxRef}
        className={`absolute inset-0 z-10 ${reduced ? "" : "will-change-transform"}`}
      >
        {/* THE FIELD — small archival objects moving around the centre */}
        <div
          data-qa="fragments-field"
          className={`absolute inset-0 pointer-events-none ${
            reduced
              ? ""
              : `${entered ? "opacity-100" : "opacity-0"} transition-opacity duration-[1200ms] ease-out`
          }`}
        >
          {visible.map((f) => {
            const item = byId.get(f.id);
            if (!item && !f.media) return null;
            const mountItem: MountItem =
              item ?? { media: f.media!, alt: f.alt ?? "" };
            const Mount = MOUNT[f.variant];
            return (
              <figure
                key={f.id}
                ref={(el) => {
                  if (el) fragEls.current.set(f.id, el);
                  else fragEls.current.delete(f.id);
                }}
                data-qa={`frag-${f.id}`}
                style={{
                  left: `${f.pos.left}%`,
                  top: `${f.pos.top}%`,
                  width: `${f.w}vw`,
                }}
                className={`absolute ${
                  f.layer === "secondary"
                    ? "z-[5]"
                    : f.layer === "deep"
                      ? "z-[1]"
                      : f.above
                        ? "z-20"
                        : "z-10"
                } ${reduced ? "" : "will-change-transform"}`}
              >
                {f.tape ? (
                  <span
                    className={`absolute -top-[10px] left-1/2 z-10 h-[20px] w-[56px] bg-[rgba(230,220,190,0.55)] shadow-[0_1px_3px_rgba(0,0,0,0.3)]`}
                    style={{ transform: `rotate(${f.tapeRot ?? -6}deg) translateX(-50%)` }}
                  />
                ) : null}
                <Mount f={f} item={mountItem} />
              </figure>
            );
          })}
        </div>

        {/* THE CENTRE — Skillz + Grandmaster Flash, calm and anchored,
            on its own Polaroid mount */}
        <div
          data-qa="fragments-hero"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        >
          <div
            className={`relative bg-paper p-[10px] pb-[38px] ${DEEP_SHADOW} ${
              reduced
                ? ""
                : `${entered ? "scale-100 opacity-100" : "scale-[0.985] opacity-0"} transition-[transform,opacity] duration-[1600ms] ease-out`
            }`}
          >
            <img
              ref={heroRef}
              data-qa="fragments-hero-photo"
              src={hero.media}
              alt={hero.alt}
              loading="eager"
              className="aspect-square w-full max-w-[min(56vw,320px)] object-contain md:max-w-[min(40vw,400px)]"
            />
            <figcaption className="font-arch-mono absolute right-[10px] bottom-[12px] left-[10px] text-center text-[10px] uppercase leading-[1.3] tracking-[0.03em] text-[rgba(20,20,20,0.72)] md:text-[11px]">
              {hero.name}
            </figcaption>
          </div>
          <BandKicker className="mt-4 text-center md:mt-5">The Archive</BandKicker>
        </div>
      </div>

      {/* FILM GRAIN + VIGNETTE — the archive is a photograph too */}
      <div className="grain pointer-events-none absolute inset-0 z-40 opacity-[0.14]" />
      <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </div>
  );
}

/* ── CHAPTER ──────────────────────────────────────────────────────────── */

export function FragmentsChapter() {
  const { statement } = fragments;

  return (
    <div className="border-t border-white/10 py-10 md:py-14">
      <FragmentsScene />

      {/* EDITORIAL STATEMENT — documentary voice, yellow rule grammar */}
      <div className="mx-auto mt-14 max-w-3xl border-l-2 border-accent pl-6 md:mt-20 md:pl-10">
        <p className="font-display text-2xl uppercase leading-tight text-white md:text-4xl">
          {statement.headline}
        </p>
        <div className="mt-6 space-y-4">
          {statement.body.map((p) => (
            <p key={p} className="text-sm leading-relaxed text-muted md:text-base">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-14 border-t border-white/10 pt-10 md:mt-20 md:pt-14">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted">
          Selected from the Skillz archive
        </p>
      </div>
    </div>
  );
}
