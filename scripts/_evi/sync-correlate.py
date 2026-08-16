"""Correlate sync-frames face diff with the recorded per-frame census."""
import json
from PIL import Image

FACE = (600, 339, 840, 499)
TOL = 18

frames = [Image.open(f"scripts/_evi/sync-frames/f{i:03d}.png").convert("RGB") for i in range(0, 361, 3)]
ref = frames[0]
vals = []
for img in frames:
    a, b = img.crop(FACE), ref.crop(FACE)
    pa, pb = a.load(), b.load()
    w, h = a.size
    n = 0
    for y in range(h):
        for x in range(w):
            if pa[x, y] != pb[x, y]:
                d = sum(abs(c - d_) for c, d_ in zip(pa[x, y][:3], pb[x, y][:3]))
                if d > TOL:
                    n += 1
    vals.append(100.0 * n / (w * h))
log = json.load(open("scripts/_evi/sync-census.json"))
print(f"face diff (every 3rd frame, t≈28-73s): min {min(vals):.1f}% max {max(vals):.1f}% mean {sum(vals)/len(vals):.1f}%")
for i, v in enumerate(vals):
    if v > 10:
        t = 28 + i * 0.375
        print(f"  t≈{t:.1f}s f{i*3:03d}: {v:.1f}%  census={log[i]['c']}")
