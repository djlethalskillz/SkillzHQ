"""Correlate face pixel diff with z-20 figure proximity (shadow reach test)."""
import json, re
from PIL import Image

FACE = (600, 339, 840, 499)
TOL = 18

frames = [Image.open(f"scripts/_evi/shadow-frames/f{i:03d}.png").convert("RGB") for i in range(0, 121, 3)]
ref = frames[0]

def face_diff(img):
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
    return 100.0 * n / (w * h)

def shadow_reach(shadow_str):
    """approx max reach of the box-shadow string (blur + largest offset)."""
    m = re.findall(r"(\d+)px", shadow_str or "")
    vals = [int(v) for v in m]
    if not vals:
        return 0
    return max(vals[:1] + vals[1:2] + vals[2:3] + vals[3:4], default=0) + 6

log = json.load(open("scripts/_evi/shadow-census.json"))
for i, entry in enumerate(log):
    d = face_diff(frames[i])
    if d < 2.0:
        continue
    fx0, fy0, fx1, fy1 = entry["fx0"], entry["fy0"], entry["fx1"], entry["fy1"]
    print(f"frame {entry['f']} diff {d:.1f}%")
    for fr in entry["fronts"]:
        # distance from figure box to face rect (0 if touching)
        dx = max(fx0 - (fr["x"] + fr["w"]), fr["x"] - fx1, 0)
        dy = max(fy0 - (fr["y"] + fr["h"]), fr["y"] - fy1, 0)
        dist = max(dx, dy)
        reach = shadow_reach(fr["shadow"])
        if dist < reach + 12:
            print(
                f"   z20 {fr['img']} at ({fr['x']},{fr['y']} {fr['w']}x{fr['h']}) "
                f"gap {dist}px shadow-reach ~{reach}px shadow='{fr['shadow']}'"
            )
