import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* GitHub Pages: static export (deployed via actions/deploy-pages). */
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
