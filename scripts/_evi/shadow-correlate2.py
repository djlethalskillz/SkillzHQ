"""Correlate face diff with z-20 figure proximity; map WHERE the diff sits."""
import json, re
from PIL import Image

FACE = (600, 339, 840, 499)
TOL = 18
BANDS = ["top", "mid", "bottom", "left-col", "right-col", "centre"]

frames = [Image.open(f"scripts/_evi/shadow-frames/f{i:03d}.png").convert("RGB") for i in range(0, 121, 3)]
ref = frames[0]
log = json.load(open("scripts/_evi/shadow-census.json"))

def face_regions(img):
    a, b = img.crop(FACE), ref.crop(FACE)
    pa, pb = a.load(), b.load()
    w, h = a.size
    counts = dict.fromkeys(BANDS, 0)
    for y in range(h):
        for x in range(w):
            if pa[x, y] == pb[x, y]:
                continue
            d = sum(abs(c - d_) for c, d_ in zip(pa[x, y][:3], pb[x, y][:3]))
            if d <= TOL:
                continue
            if y < h // 4: counts["top"] += 1
            elif y > 3 * h // 4: counts["bottom"] += 1
            else: counts["mid"] += 1
            if x < w // 4: counts["left-col"] += 1
            elif x > 3 * w // 4: counts["right-col"] += 1
            else: counts["centre"] += 1
    n = w * h
    return {k: 100.0 * v / n for k, v in counts.items()}

def reach(s):
    m = re.findall(r"(\d+)px", s or "")
    v = [int(x) for x in m]
    return (max(v[:4], default=0) + 6) if v else 0

for i, entry in enumerate(log):
    regs = face_regions(frames[i])
    if max(regs.values()) < 0.4:
        continue
    fx0, fy0, fx1, fy1 = entry["fx0"], entry["fy0"], entry["fx1"], entry["fy1"]
    near = []
    for fr in entry["fronts"]:
        dx = max(fx0 - (fr["x"] + fr["w"]), fr["x"] - fx1, 0)
        dy = max(fy0 - (fr["y"] + fr["h"]), fr["y"] - fy1, 0)
        dist = max(dx, dy)
        near.append((dist, fr["img"], fr["x"], fr["y"], fr["w"], fr["h"], reach(fr["shadow"]), fr["shadow"][:40]))
    near.sort()
    print(f"frame {entry['f']} diff {max(regs.values()):.1f}% top {regs['top']:.1f} mid {regs['mid']:.1f} "
          f"bottom {regs['bottom']:.1f} L {regs['left-col']:.1f} R {regs['right-col']:.1f} C {regs['centre']:.1f}")
    for dist, img, x, y, w, h, r, sh in near[:3]:
        print(f"   z20 {img} at ({x},{y} {w}x{h}) gap {dist} reach ~{r} shadow '{sh}'")
