"""Pixel-check sync-frames vs f000, print per-frame face diff + peak frame."""
from PIL import Image
from glob import glob

FACE = (600, 339, 840, 499)
TOL = 18

frames = sorted(glob("scripts/_evi/sync-frames/f*.png"))
ref = Image.open(frames[0]).convert("RGB")
vals = []
for fp in frames:
    img = Image.open(fp).convert("RGB")
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
peak = max(range(len(vals)), key=lambda i: vals[i])
print(f"face diff: min {min(vals):.1f}% max {max(vals):.1f}% mean {sum(vals)/len(vals):.1f}%")
print(f"peak frame: f{peak:03d} = {vals[peak]:.1f}%  (census taken ~14s later, note drift)")
for i, v in enumerate(vals):
    if v > 20:
        print(f"  f{i:03d}: {v:.1f}%")
