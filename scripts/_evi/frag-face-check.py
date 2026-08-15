"""Post-fix face-occlusion verification. QA artifact only.

Face zone at 1440x900 (measured from hero photo rect): x 600-840, y 274-514.
"Changed" = pixel differs from REST reference beyond tolerance — paper-toned
fragments over the dark photo register as change. Signature check: yellow
bottom strip (landing marquee) must be 0%.
"""
import sys
from PIL import Image
from glob import glob

# Measured live (dbg-paint30): hero photo rect l:480 t:218.56 w:400 h:400 →
# face (central 60%) = x 600-840, y 338.6-498.6. Earlier rect y274-514 sat
# 64px too high — covered open field where paper fragments drift (false +).
FACE = (600, 339, 840, 499)
TOL = 18

def face_changed(img, ref):
    a = img.crop(FACE)
    b = ref.crop(FACE)
    px_a, px_b = a.load(), b.load()
    w, h = a.size
    n = 0
    for y in range(h):
        for x in range(w):
            pa, pb = px_a[x, y], px_b[x, y]
            if pa != pb:
                d = sum(abs(c - d_) for c, d_ in zip(pa[:3], pb[:3]))
                if d > TOL:
                    n += 1
    return 100.0 * n / (w * h)

def bottom_yellow(img):
    # bottom 60px band of the 1440x900 page capture
    band = img.crop((0, 900 - 60, 1440, 900))
    px = band.load()
    w, h = band.size
    n = 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y][:3]
            if r > 180 and g > 140 and b < 100:
                n += 1
    return 100.0 * n / (w * h)

def field_changed(img, ref):
    # whole 1440x900 minus the face zone — motion aliveness
    full = img.crop((0, 0, 1440, 900))
    full_r = ref.crop((0, 0, 1440, 900))
    px, pr = full.load(), full_r.load()
    n = 0
    for y in range(0, 900, 4):
        for x in range(0, 1440, 4):
            if FACE[0] <= x < FACE[2] and FACE[1] <= y < FACE[3]:
                continue
            pa, pb = px[x, y], pr[x, y]
            if pa != pb and sum(abs(c - d_) for c, d_ in zip(pa[:3], pb[:3])) > TOL:
                n += 1
    return 100.0 * n / (360 * 225)

OUT = "scripts/_evi"
ref = Image.open(f"{OUT}/FRAGMENTS_REST.png").convert("RGB")

print("== stills (vs REST) ==")
for name in ["FRAGMENTS_EARLY.png", "FRAGMENTS_ACTIVE.png", "FRAGMENTS_REORGANIZED.png"]:
    img = Image.open(f"{OUT}/{name}").convert("RGB")
    fc = face_changed(img, ref)
    sy = bottom_yellow(img)
    print(f"{name}: face {fc:.1f}%  bottom-yellow {sy:.1f}%")

print("== GIF frames (t 30-45s window) ==")
frames = sorted(glob(f"{OUT}/frag-fresh-frames/f*.png"))
ref_f = Image.open(frames[0]).convert("RGB")
vals = []
for fp in frames:
    img = Image.open(fp).convert("RGB")
    vals.append(face_changed(img, ref_f))
mx = max(vals)
mean = sum(vals) / len(vals)
runs = []
i = 0
while i < len(vals):
    if vals[i] > 6:
        j = i
        while j < len(vals) and vals[j] > 6:
            j += 1
        runs.append((round(i / 8, 1), round(j / 8, 1), round(max(vals[i:j]), 1)))
        i = j
    else:
        i += 1
print(f"face: min {min(vals):.1f}% max {mx:.1f}% mean {mean:.1f}%  runs>6%: {runs}")

print("== motion aliveness ==")
last = Image.open(frames[-1]).convert("RGB")
print(f"field displacement f000 vs f120: {field_changed(last, ref_f):.1f}%")
