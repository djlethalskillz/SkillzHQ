// lock-hashes.mjs — SHA-256 of every file tracked at a commit, read from git objects (not the
// working tree), plus one aggregate digest per public/assets/<folder> (sha256 over the sorted
// "<sha256>  <path>\n" lines of that folder). Read-only.
// usage: node lock-hashes.mjs <repo> <commit> <outCsv>
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";

const [repo, commit, outCsv] = process.argv.slice(2);
const git = (args, opts = {}) => execFileSync("git", ["-C", repo, ...args], { maxBuffer: 1 << 30, ...opts });
const files = git(["ls-tree", "-r", "--name-only", commit]).toString().trim().split("\n");
const rows = [];
for (const f of files) {
  if (!/^(src|workers|public|\.github)\/|^(wrangler\.toml|next\.config\.ts|package\.json|package-lock\.json)$/.test(f)) continue;
  const buf = git(["show", `${commit}:${f}`]);
  rows.push({ path: f, sha256: createHash("sha256").update(buf).digest("hex"), bytes: buf.length });
}
const folders = {};
for (const r of rows) {
  const m = r.path.match(/^public\/assets\/([^/]+)\//);
  const key = m ? `public/assets/${m[1]}/` : r.path.startsWith("public/assets/") ? "public/assets/ (top level)" : null;
  if (key) (folders[key] ||= []).push(r);
}
const agg = Object.entries(folders).map(([folder, rs]) => ({
  folder, files: rs.length,
  sha256: createHash("sha256").update(rs.map((r) => `${r.sha256}  ${r.path}\n`).sort().join("")).digest("hex"),
}));
writeFileSync(outCsv, "path,sha256,bytes\n" + rows.map((r) => `${r.path},${r.sha256},${r.bytes}`).join("\n") + "\n");
writeFileSync(outCsv.replace(/\.csv$/, "-folders.csv"), "folder,files,aggregate_sha256\n" + agg.map((a) => `${a.folder},${a.files},${a.sha256}`).join("\n") + "\n");
console.log(`${rows.length} files, ${agg.length} asset folders`);
