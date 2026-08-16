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
      className={`font-arch-mono font-medium text-[10.5px] uppercase leading-[1.25] tracking-[0.02em] text-[rgba(22,20,18,0.85)] ${className}`}
    >
      {text}
    </figcaption>
  );
}

/** Polaroid: the photo keeps its SOURCE aspect (no crop — people, artwork
 * and flyer layouts stay intact); the paper mount adapts to the image. */
function InstantMount({ f, item }: { f: FieldFragment; item: MountItem }) {
  return (
    <div className={`relative bg-paper p-[7px] pb-[34px] ${DEEP_SHADOW}`}>
      <img src={item.media} alt={item.alt} loading="eager" className="w-full" />
      <MountCaption
        f={f}
        name={item.name}
        context={item.context}
        className="absolute left-[9px] right-[9px] bottom-[10px] text-center"
      />
    </div>
  );
}

/** Flyer: clipped corners, no caption — flyers carry their own typography.
 * Source aspect preserved. */
function FlyerMount({ f, item }: { f: FieldFragment; item: MountItem }) {
  return (
    <div
      className={`bg-[#242424] shadow-[0_10px_26px_rgba(0,0,0,0.5)] [clip-path:polygon(0%_1%,98%_0%,100%_97%,3%_100%)] ${DEEP_SHADOW}`}
    >
      <img src={item.media} alt={item.alt} loading="eager" className="w-full" />
    </div>
  );
}

/** Pass: credential card, punch hole, caption in the bottom margin. */
function PassMount({ f, item }: { f: FieldFragment; item: MountItem }) {
  return (
    <div className={`relative bg-paper-warm p-[10px] pb-[26px] text-center shadow-[0_8px_20px_rgba(0,0,0,0.5)]`}>
      <div className="mx-auto mb-2 h-[10px] w-[10px] rounded-full bg-[#0A0A0A]" />
      <img src={item.media} alt={item.alt} loading="eager" className="w-full" />
      <MountCaption
        f={f}
        name={item.name}
        context={item.context}
        className="absolute left-[8px] right-[8px] bottom-[8px] text-center"
      />
    </div>
  );
}

/** Jcard: photo floats left, caption sits in the card's own off-white space.
 * Card height follows the photo (source aspect, no crop). */
function JcardMount({ f, item }: { f: FieldFragment; item: MountItem }) {
  return (
    <div className={`relative bg-paper-card p-[6px] shadow-[0_8px_18px_rgba(0,0,0,0.5)]`}>
      <div className="absolute bottom-0 top-0 left-[38%] w-px bg-black/15" />
      <img
        src={item.media}
        alt={item.alt}
        loading="eager"
        className="float-left w-[36%]"
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
   * THE ENGINE — vinyl orbit, the motion DNA re-tuned for the record metaphor.
   *
   * The field is a giant record. The hero photograph (Skillz + Grandmaster
   * Flash) is the spindle — a mathematically excluded zone, not a crossing
   * point. Every fragment OWNS A TERRITORY — its base position on the wall,
   * scattered full-canvas (corners, edges, open mid-field; nothing inside
   * the hero's breathing room) — and circulates locally around it like a
   * paper slowly drifting around its pin:
   *
   *   - loop radius drawn per-id from 5-12% of scene width (bigger prints
   *     tighter — they are the anchors of the composition); no two
   *     fragments share radius, starting angle, phase, period or direction,
   *     so nothing travels as a group and no ring ever forms;
   *   - local loop period 55-115 s, depth tiers slipping against each other
   *     (primary ×1.18, secondary ×1.0, deep ×0.8) with a 1-in-5 reverse
   *     direction — asynchronous, hypnotic, never a carousel;
   *   - each loop breathes ±30% on its own 45-95 s cycle — organic, no two
   *     orbits pulse alike;
   *   - HERO PROTECTION: a ray test from the hero mount rect (photo + paper
   *     + caption, inflated by the fragment's own box + shadow margin)
   *     returns the exclusion radius for the loop point's angle. A loop
   *     that dips toward the hero is bowed outward — fragments pass AROUND
   *     the photograph, never over it;
   *   - z-tiers are fixed at mount: deep 1, secondary 5, primary 10 (the
   *     hero container sits later in the DOM and wins every tie) — nothing
   *     ever paints over the hero;
   *   - the photographs stay stable: a slow ±few-degree wobble around the
   *     resting angle and subtle scale breathing — readable objects whose
   *     positions circulate;
   *   - presence cycles (fade out / return) and the entrance settle are
   *     unchanged; poses are OFFSETS from the element's % base position, so
   *     resize keeps fragments glued to the scene.
   */
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();

    interface Pose {
      x: number;
      y: number;
      rot: number;
      s: number;
      theta: number;
      radius: number;
      omega: number;
      breatheAmp: number;
      breatheT: number;
      breathePhase: number;
      wobbleAmp: number;
      wobbleT: number;
      wobblePhase: number;
      sAmp: number;
      sT: number;
      sPhase: number;
      tau: number;
      firstUntil: number;
    }
    const pose = new Map<string, Pose>();

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    // The spindle: the hero MOUNT (photo + paper + caption strip), in scene
    // coordinates. Everything orbits this box; nothing may cross it.
    let zone = { cx: 0, cy: 0, x0: 0, y0: 0, x1: 0, y1: 0 };
    const readZone = () => {
      const h = document.querySelector<HTMLElement>('[data-qa="fragments-hero-photo"]');
      const scene = parallaxRef.current;
      if (!h || !scene) return;
      const r = h.parentElement!.getBoundingClientRect(); // the whole mount
      const s = scene.getBoundingClientRect();
      zone = {
        cx: r.x - s.x + r.width / 2,
        cy: r.y - s.y + r.height / 2,
        x0: r.x - s.x,
        y0: r.y - s.y,
        x1: r.x - s.x + r.width,
        y1: r.y - s.y + r.height,
      };
    };
    readZone();

    // Orbit space is normalised as (x, y/k): with k = vh/vw the position
    // formula ay = cy + sin·r·k makes every loop a circle on screen — a
    // platter — on any viewport instead of a flat ellipse. The guard works
    // in the SAME space, or its distance tests drift on portrait viewports
    // (k > 1) and the hero protection leaks.
    // A ray from the mount centre at `theta` — where does it leave the
    // protected mount rect (inflated by the fragment box + shadow margin)?
    // That is the exclusion radius for this angle. 0 when the ray points
    // clear of the box.
    const rayExit = (theta: number, hw: number, hh: number, vw_: number, vh_: number) => {
      const k = vh_ / vw_;
      const x0 = zone.x0 - hw;
      const y0 = (zone.y0 - hh) / k;
      const x1 = zone.x1 + hw;
      const y1 = (zone.y1 + hh) / k;
      const dx = Math.cos(theta);
      const dy = Math.sin(theta);
      let tmax = Infinity;
      let hits = true;
      for (const [o, d, lo, hi] of [
        [zone.cx, dx, x0, x1],
        [zone.cy / k, dy, y0, y1],
      ] as [number, number, number, number][]) {
        if (Math.abs(d) < 1e-9) {
          if (o < lo || o > hi) {
            hits = false;
            break;
          }
        } else {
          let ta = (lo - o) / d;
          let tb = (hi - o) / d;
          if (ta > tb) {
            const t = ta;
            ta = tb;
            tb = t;
          }
          tmax = Math.min(tmax, tb);
          if (tb < 0 || ta > tmax) {
            hits = false;
            break;
          }
        }
      }
      // tmax < 0 → the ray points away from the box entirely.
      return hits && tmax > 0 ? tmax : 0;
    };

    // Platter pace: one revolution ≈ 2.5 min. Depth tiers slip: primary
    // slightly quicker, deep archive slowest — layered bands of one record.
    const TIER_OMEGA: Record<string, number> = { primary: 1.18, secondary: 1.0, deep: 0.8 };
    const PLATTER = (2 * Math.PI) / 150;

    // SPREAD — the archive is a field of individual territories, not rings
    // of shared distance. Base positions are scattered full-canvas (corners,
    // edges, open mid-field) with the hero's breathing room empty; each
    // fragment now circulates LOCALLY around its own territory with a small
    // loop radius (5-12% of scene width, per-id hash — no two fragments
    // share radius, so no ring can form and nothing travels as a group).
    // Bigger prints loop tighter — they are the anchors of the wall.
    const hash01 = (id: string) => {
      let h = 0;
      for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      return h / 4294967295;
    };
    const loopRadius = (id: string, sw: number, w: number) => {
      const size = Math.min(1, Math.max(0, (w - 4) / 8));
      const base = (0.05 + 0.07 * hash01(id + ":lr")) * sw;
      return base * (1 - size * 0.25); // larger print -> tighter loop
    };

    const tick = () => {
      const now = performance.now();
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.1) dt = 0.1; // tab-switch guard
      const vw_ = window.innerWidth;
      const vh_ = window.innerHeight;
      const k = vh_ / vw_;
      // Base positions resolve against the SCENE, not the viewport — the
      // scene is inset from the viewport (and scrolls), so per-frame rect is
      // the only reliable origin for both the orbit offsets and the guard.
      const sceneEl = parallaxRef.current;
      const s = sceneEl ? sceneEl.getBoundingClientRect() : { width: vw_, height: vh_ };
      fragEls.current.forEach((el, id) => {
        const f = fieldById.get(id);
        if (!f) return;
        // CSS base position, in the same scene-relative space as `zone`.
        const bx = (f.pos.left / 100) * s.width;
        const by = (f.pos.top / 100) * s.height;
        let p = pose.get(id);
        if (!p) {
          // Mount pose: offsets 0 — the first frames are exactly the resting
          // composition, then the field wakes.
          const tier = f.layer === "deep" ? 1 : f.layer === "secondary" ? 5 : 10;
          el.style.zIndex = String(tier);
          p = {
            x: 0,
            y: 0,
            rot: f.rot,
            s: 1,
            theta: hash01(id + ":th") * Math.PI * 2,
            radius: loopRadius(id, s.width, f.w),
            omega:
              ((2 * Math.PI) / rnd(55, 115)) *
              (TIER_OMEGA[f.layer ?? "primary"] ?? 1) *
              rnd(0.92, 1.08) *
              (hash01(id + ":dir") < 1 / 5 ? -1 : 1),
            breatheAmp: rnd(0.2, 0.3),
            breatheT: rnd(45, 95),
            breathePhase: rnd(0, Math.PI * 2),
            wobbleAmp:
              rnd(1.5, 4) *
              (hash01(id + ":wob") < 0.5 ? -1 : 1) *
              (hash01(id + ":flat") < 1 / 7 ? 0.35 : 1),
            wobbleT: rnd(24, 46),
            wobblePhase: rnd(0, Math.PI * 2),
            sAmp: (f.scaleAmp ?? 0.06) || 0.06,
            sT: rnd(32, 60),
            sPhase: rnd(0, Math.PI * 2),
            tau: rnd(0.7, 1.1) * (f.layer === "deep" ? 1.25 : 1),
            firstUntil: now + 2600,
          };
          pose.set(id, p);
        }
        // The local loop: angle advances around the territory, radius
        // breathes; then the hero guard.
        p.theta += p.omega * dt;
        const th = p.theta;
        const breathe =
          1 +
          p.breatheAmp *
            Math.sin((2 * Math.PI * now) / 1000 / p.breatheT + p.breathePhase);
        const r = p.radius * breathe;
        let ax = bx + Math.cos(th) * r;
        let ay = by + Math.sin(th) * r * k;
        // Exclusion: if the loop point dips into the protected mount rect,
        // bow it outward along the ray from the mount centre. The transform
        // anchor is the figure's TOP-LEFT, so the rect is inflated by the
        // figure's FULL extent (not half) — otherwise a figure passing above
        // the mount hangs its caption into the photo. +40: the bow target
        // also trails via the lerp — extra gap so the box (and its caption)
        // never grazes the mount edge while chasing corners.
        const hw = el.offsetWidth + 60;
        const hh = el.offsetHeight + 60;
        const thm = Math.atan2((ay - zone.cy) / k, ax - zone.cx);
        const exit = rayExit(thm, hw, hh, vw_, vh_);
        if (Math.hypot(ax - zone.cx, (ay - zone.cy) / k) < exit) {
          ax = zone.cx + Math.cos(thm) * (exit + 40);
          ay = zone.cy + Math.sin(thm) * (exit + 40) * k;
        }
        // Canvas: graze the edges, never park far offscreen.

        ax = Math.max(-0.06 * vw_, Math.min(1.06 * vw_, ax));
        ay = Math.max(-0.06 * vh_, Math.min(1.06 * vh_, ay));
        // Fragments trail the orbit with a soft lerp — no snaps. The entrance
        // settle lerps slower so the wake-up motion reads clearly.
        const tau = now < p.firstUntil ? 2.4 : p.tau;
        const st = 1 - Math.exp(-dt / tau);
        p.x += (ax - bx - p.x) * st;
        p.y += (ay - by - p.y) * st;
        // The photographs stay stable: slow wobble around the resting angle,
        // subtle scale breathing — readable objects, revolving positions.
        const rotTarget =
          f.rot +
          p.wobbleAmp *
            Math.sin((2 * Math.PI * now) / 1000 / p.wobbleT + p.wobblePhase);
        p.rot += (rotTarget - p.rot) * st * 0.5;
        const sTarget = 1 + p.sAmp * Math.sin((2 * Math.PI * now) / 1000 / p.sT + p.sPhase);
        p.s += (sTarget - p.s) * st * 0.4;
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
    window.addEventListener("resize", readZone);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", readZone);
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
