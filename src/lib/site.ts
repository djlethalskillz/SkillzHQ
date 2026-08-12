/**
 * Site-wide content and asset configuration.
 *
 * Everything that will be replaced with real Skillz assets lives here:
 * hero photography, booking destination, streaming/video links.
 * Set values to null (or empty) until real destinations are supplied.
 */

export type MediaLink = { label: string; url: string } | null;

export const site = {
  name: "DJ Lethal Skillz",
  shortName: "SKILLZ",
  role: "DJ · TURNTABLIST · PRODUCER",

  /** Hero background photograph — the approved SKY_0104 source image. */
  heroBackground: "/assets/sky-0104.jpg" as string | null,

  /** Foreground figure — transparent cutout of Skillz, layered over the type. */
  heroImage: {
    src: "/assets/skillz-cutout.png" as string | null,
    alt: "DJ Lethal Skillz",
  },

  /** Each One Teach One video — documentary/workshop material. */
  workshopsVideo: {
    src: "/assets/each-one-teach-one-hero.mp4",
    poster: "/assets/each-one-teach-one-poster.png",
    alt: "Each One Teach One — Skillz teaching turntablism",
  },

  /** Booking destination. Set to an email to enable mailto booking links. */
  bookingEmail: null as string | null,

  media: {
    /** YouTube channel or performance playlist. */
    youtube: null as MediaLink,
    /** Spotify artist or release link. */
    spotify: null as MediaLink,
  },
};

export const bookingCategories = [
  "DJ / EVENT",
  "FESTIVAL",
  "WORKSHOP",
  "SPEAKING",
  "CULTURAL / CREATIVE",
] as const;
