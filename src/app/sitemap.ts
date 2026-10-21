import type { MetadataRoute } from "next";
import { CRATES } from "@/lib/life-archive";

// Required with `output: "export"`: render once at build time.
export const dynamic = "force-static";

const ORIGIN = "https://djlethalskillz.com";

// Rendered once by `next build` into out/sitemap.xml (static export). Film
// pages come from the same CRATES list that builds them, so a new film is in
// the sitemap automatically. lastmod is the build date: the site deploys
// whenever it changes, so the build date is the release date.
const BUILT = new Date().toISOString().slice(0, 10);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/book",
    "/life-archive",
    ...CRATES.map((c) => `/life-archive/${c.number}`),
    "/bandcamp",
  ].map((path) => ({ url: `${ORIGIN}${path}`, lastModified: BUILT }));
}
