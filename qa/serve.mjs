// Local static server for the built site (out/), used only by `npm run qa`. GitHub-Pages-like:
// "/x" serves x.html or x/index.html, anything missing serves 404.html with status 404, and
// /api/* answers 503 so no test can ever reach the live booking or newsletter endpoints.
// usage: node qa/serve.mjs <dir> <port>
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.argv[2] || "out";
const port = Number(process.argv[3] || 4100);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".mp4": "video/mp4",
  ".webm": "video/webm", ".vtt": "text/vtt", ".xml": "application/xml", ".pdf": "application/pdf",
};

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ? p : null;

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path.startsWith("/api/")) {
    res.writeHead(503, { "content-type": "application/json" });
    return res.end('{"error":"submissions disabled in local QA"}');
  }
  const base = join(root, normalize(path).replace(/^([/\\])+/, ""));
  const file = (await isFile(base)) || (await isFile(base + ".html")) || (await isFile(join(base, "index.html")));
  if (!file) {
    res.writeHead(404, { "content-type": TYPES[".html"] });
    return res.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
  }
  res.writeHead(200, { "content-type": TYPES[extname(file).toLowerCase()] || "application/octet-stream" });
  res.end(await readFile(file));
}).listen(port, "127.0.0.1", () => console.log(`qa: serving ${root} on http://localhost:${port}`));
