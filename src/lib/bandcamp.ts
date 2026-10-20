/**
 * The Bandcamp catalogue — manually maintained, not synchronised.
 *
 * Source: https://djlethalskillz.bandcamp.com/ , read once by hand on 2026-10-20.
 * Order, titles and credits are exactly as that page lists them. Each embed id
 * is the release's Bandcamp id; every one was checked by loading Bandcamp's own
 * EmbeddedPlayer and matching the title it shows (record:
 * _records/bandcamp-prototype-2026-10-20/evidence/embed-check.json).
 * Years appear only where the SkillzHQ Music Catalog records a release date.
 * Covers are the release artwork, stored at /assets/bandcamp/<id>.webp: the owner's
 * own file where it was confirmed identical to the Bandcamp cover (720px), otherwise
 * the cover Bandcamp shows on the artist page (350px, never upscaled). Provenance:
 * public/assets/bandcamp/ASSET_LOG.md. Tone is the cover's own most saturated colour.
 * A new release is added by hand at the top: its id comes from Share/Embed on
 * the release page.
 */

export const BANDCAMP_URL = "https://djlethalskillz.bandcamp.com/";

export type BandcampRelease = {
  kind: "album" | "track";
  /** Bandcamp's numeric release id, as used by its embed code. */
  id: number;
  /** Path on the artist's Bandcamp, e.g. "/album/above-the-clouds". */
  path: string;
  /** Title, verbatim from Bandcamp. */
  title: string;
  /** Artist credit as Bandcamp shows it, when it differs from DJ Lethal Skillz alone. */
  credit?: string;
  /** Year from the Music Catalog's release date — only where one is recorded. */
  year?: string;
  /** Pixel size of the square cover file at /assets/bandcamp/<id>.webp. */
  cover: 350 | 720;
  /** The cover's own accent colour, sampled from the artwork. */
  tone: string;
  /** false when Bandcamp's player reports the release is not available for embedding. */
  embeddable: boolean;
};

export const RELEASES: BandcampRelease[] = [
  { kind: "album", id: 2676536824, path: "/album/above-the-clouds", title: "ABOVE THE CLOUDS", year: "2019", cover: 350, tone: "#2371a6", embeddable: true },
  { kind: "album", id: 2128095758, path: "/album/karmageddon", title: "Karmageddon", year: "2012", cover: 720, tone: "#616463", embeddable: true },
  { kind: "album", id: 2247857933, path: "/album/new-world-disorder", title: "New World Disorder", year: "2008", cover: 720, tone: "#dd8d2b", embeddable: true },
  // Bandcamp's player answers "Sorry, this track or album is not available." and the
  // release page lists no tracks (red-team check, 2026-10-20) — link only.
  { kind: "album", id: 394386661, path: "/album/iqa3-mokhtalef-beat-tape", title: "Iqa3 Mokhtalef (Beat Tape)", credit: "DJ Lethal Skillz, Beatlalipos", cover: 720, tone: "#7f393c", embeddable: false },
  { kind: "track", id: 1588576850, path: "/track/contemplation", title: "Contemplation", credit: "DJ Lethal Skillz, A.Rob", cover: 350, tone: "#a08f74", embeddable: true },
  { kind: "track", id: 2624525731, path: "/track/i-elevate", title: "I.Elevate", credit: "DJ Lethal Skillz, King Ra, Vandal", cover: 350, tone: "#0f6690", embeddable: true },
  { kind: "track", id: 407096157, path: "/track/information-is-power", title: "Information Is Power", credit: "DJ Lethal Skillz, Unknown Mizery", cover: 350, tone: "#aa2682", embeddable: true },
  {
    kind: "track",
    id: 2962739210,
    path: "/track/defenders-of-the-culture-feat-bu-nasser-touffar-aeonsone-ghetto-queen-m-c-razor-orga",
    title: "Defenders Of The Culture (feat. Bu Nasser Touffar, Aeonsone, Ghetto Queen, M.C. Razor & ORGA)",
    cover: 720,
    tone: "#823d22",
    embeddable: true,
  },
  { kind: "track", id: 3738321098, path: "/track/open-letter", title: "Open Letter", credit: "DJ Lethal Skillz, Q Sound", cover: 350, tone: "#7a7244", embeddable: true },
  { kind: "track", id: 1104826735, path: "/track/squid-gamez", title: "Squid Gamez", credit: "DJ Lethal Skillz, Def iLL", cover: 350, tone: "#803a27", embeddable: true },
  { kind: "track", id: 1535809381, path: "/track/trees", title: "Trees", credit: "DJ Lethal Skillz, Dookiebrownflow", cover: 350, tone: "#744c23", embeddable: true },
  { kind: "track", id: 3385092786, path: "/track/hidden-dagger", title: "Hidden Dagger - الخنجر المخفي", cover: 350, tone: "#a48e6c", embeddable: true },
  { kind: "track", id: 4194633529, path: "/track/the-slicer-of-darkness", title: "The Slicer Of Darkness - قاطع الظلام", cover: 720, tone: "#77301c", embeddable: true },
  { kind: "track", id: 2412593008, path: "/track/lebanese-samurai", title: "Lebanese Samurai - الساموراي اللبناني", cover: 350, tone: "#af6b47", embeddable: true },
];

export const coverSrc = (r: BandcampRelease) => `/assets/bandcamp/${r.id}.webp`;

export const releaseUrl = (r: BandcampRelease) => new URL(r.path, BANDCAMP_URL).href;

/** Bandcamp's Share/Embed players: "Standard" (120px, small artwork, no tracklist) or "Slim" (42px). */
export const embedUrl = (r: BandcampRelease, slim = false) =>
  slim
    ? `https://bandcamp.com/EmbeddedPlayer/${r.kind}=${r.id}/size=small/bgcol=000000/linkcol=ffe600/transparent=true/`
    : `https://bandcamp.com/EmbeddedPlayer/${r.kind}=${r.id}/size=large/bgcol=000000/linkcol=ffe600/tracklist=false/artwork=small/transparent=true/`;
