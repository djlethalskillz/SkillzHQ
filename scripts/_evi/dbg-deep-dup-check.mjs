// Duplicate check: every rendered figure img vs every other (dhash Hamming).
import { readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createCanvas, loadImage } from "canvas";
const H = (a, b) => a.reduce((n, x, i) => n + (x !== b[i] ? 1 : 0), 0);
async function dhash(p) {
  const img = await loadImage(p);
  const c = createCanvas(9, 8); const g = c.getContext("2d");
  g.drawImage(img, 0, 0, 9, 8); const d = g.getImageData(0, 0, 9, 8).data;
  const rows = [];
  for (let y = 0; y < 8; y++) { let row = 0;
    for (let x = 0; x < 8; x++) row = (row << 1) | (d[(y*9+x)*4] > d[(y*9+x+1)*4] ? 1 : 0);
    rows.push(row); }
  return rows;
}
const files = readdirSync("public/assets/fragments").filter(f => /\.(jpg|png)$/i.test(f));
const hashes = {};
for (const f of files) { try { hashes[f] = await dhash("public/assets/fragments/" + f); } catch (e) { console.log("ERR", f, e.message); } }
const names = Object.keys(hashes);
let worst = 64, worstPair = null, dups = [];
for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
  const h = H(hashes[names[i]], hashes[names[j]]);
  if (h < worst) { worst = h; worstPair = [names[i], names[j]]; }
  if (h < 14) dups.push([names[i], names[j], h]);
}
console.log("assets checked:", names.length);
console.log("worst pairwise distance:", worst, "between", worstPair);
console.log("duplicates (dist<14):", dups.length ? JSON.stringify(dups) : "NONE");
// rendered set only
const rendered = JSON.parse(readFileSync("src/lib/fragments.ts","utf8").match(/media: "[^"]+"/g)).map(m => m.match(/fragments\/[^"]+/)[0]).filter(v => !v.includes("hero"));
const rSet = [...new Set(rendered)];
let minR = 64;
for (const f of rSet) for (const g of Object.keys(hashes)) {
  if (f === g) continue;
  const h = H(hashes[f], hashes[g]);
  if (h < minR) minR = h;
}
console.log("rendered unique media count:", rSet.length, "| min cross distance vs all:", minR);
