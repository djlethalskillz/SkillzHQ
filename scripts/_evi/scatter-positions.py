"""
WALL SCATTER — deterministic territory placement for the Fragments field.
Replaces the manifest pos values with a reference-style wall distribution:
full-canvas, corners/edges populated, hero exclusion zone with breathing
room, minimum edge separation between fragments (no piles).

Ordering matters (that is the whole trick):
1. mobile:true entries first (biggest first) — they must be legal in BOTH
   viewports, so they get first pick of the 4 edge bands (x<8 / x>92 /
   y<12 / y>88) plus any other mobile-legal spot.
2. Next-largest remaining prints anchor the left/right edge strips.
3. Everything else scatters zone-weighted across the full canvas.

Deterministic: every position derives from the fragment id hash.
Idempotent: reruns produce the same layout.
"""
import re
import random
import math
from collections import Counter

SRC = "src/lib/fragments.ts"

# ── read manifest ────────────────────────────────────────────────────────
src = open(SRC, encoding="utf8").read()
fi = src.index("field: [")
nxt = src.find("items:", fi)
if nxt < 0:
    nxt = src.find("\n  ] satisfies", fi)
field_body = src[fi + len("field: [") : nxt]

entries = []
segments = re.split(r"\n    \{", field_body)
for seg in segments:
    if not seg.lstrip().startswith("id:"):
        continue
    body = "{\n    " + seg.rstrip().rstrip(",")
    idm = re.search(r'id:\s*"([^"]+)"', body)
    wm = re.search(r"w:\s*([\d.]+)", body)
    lm = re.search(r'layer:\s*"(\w+)"', body)
    tm = re.search(r'tier:\s*"(\w+)"', body)
    mm = re.search(r"mobile:\s*true", body)
    ab = re.search(r"above:\s*true", body)
    vm = re.search(r'variant:\s*"(\w+)"', body)
    entries.append(
        {
            "id": idm.group(1),
            "w": float(wm.group(1)) if wm else 5.0,
            "layer": lm.group(1) if lm else ("primary" if tm and tm.group(1) == "primary" else ("secondary" if tm and tm.group(1) == "supporting" else "primary")),
            "mobile": bool(mm),
            "above": bool(ab),
            "variant": vm.group(1) if vm else "instant",
            "body": body,
        }
    )
print("entries:", len(entries))
print("  layers:", Counter(e["layer"] for e in entries))
print("  mobile:", sum(1 for e in entries if e["mobile"]))
print("  above:", sum(1 for e in entries if e["above"]))

# ── deterministic rng per id ─────────────────────────────────────────────
def hash01(s):
    h = 0
    for c in s:
        h = (h * 31 + ord(c)) & 0xFFFFFFFF
    return h / 4294967296


# ── geometry (scene-relative %) ──────────────────────────────────────────
# hero mount ~ [34.5, 65.5] x [23.7, 74.7]; breathing exclusion around it
EX = (26, 74)   # exclusion rect x0, x1
EY = (18, 82)   # exclusion rect y0, y1
GAP = 1.8       # min edge gap between fragments, scene %

# mobile hero rect: mount ~70% wide on phone -> frame bands x<15, x>85,
# y<22, y>78. Mobile-legal = box+margin clear of this rect.
MF = (15, 85, 22, 78)

def box_h_est(f):
    # conservative height estimate from variant (before natural-ratio fix)
    return {"instant": 1.25, "flyer": 0.9, "pass": 1.33, "jcard": 0.7}.get(f["variant"], 1.2) * f["w"]


def placed(f, x, y, placed_list, excl_rect, gap):
    w = f["w"]; h = box_h_est(f)
    if x - w / 2 < excl_rect[1] and x + w / 2 > excl_rect[0] and y - h / 2 < excl_rect[3] and y + h / 2 > excl_rect[2]:
        return False
    for (px, py, pw, ph) in placed_list:
        if x - w / 2 < px + pw / 2 + gap and x + w / 2 > px - pw / 2 - gap and y - h / 2 < py + ph / 2 + gap and y + h / 2 > py - ph / 2 - gap:
            return False
    return True


def mobile_ok(f, x, y):
    w = f["w"]; h = box_h_est(f)
    mx = w * 0.25 + 2.5; my = h * 0.25 + 2.5
    if x - w / 2 < MF[1] + mx and x + w / 2 > MF[0] - mx and y - h / 2 < MF[3] + my and y + h / 2 > MF[2] - my:
        return False
    return True


rng = random.Random(20260816)
placed_list = []  # (x, y, w, h)
pos = {}
id_map = {e["id"]: e for e in entries}

ordered = sorted(entries, key=lambda e: hash01(e["id"] + ":order"))
mob = sorted([e for e in entries if e["mobile"]], key=lambda e: -e["w"])
mob_ids = {e["id"] for e in mob}
non_mob = [e for e in ordered if e["id"] not in mob_ids]


def place(f, ok_label, legal_check, darts, relaxes, snap_p, edge_label):
    """dart-throw placement; snap_p fraction of darts snap to the nearest
    canvas edge band; legal_check must pass before gap/exclusion checks."""
    for relax in relaxes:
        g = GAP * relax
        for _ in range(darts):
            cx = rng.uniform(3, 97); cy = rng.uniform(3, 94)
            if hash01(f["id"] + edge_label) < snap_p:
                edges = [(cx, 2.5), (cx, 97.5), (2.5, cy), (97.5, cy)]
                cx, cy = min(edges, key=lambda p: math.hypot(p[0] - cx, p[1] - cy))
            cx = min(97, max(3, cx)); cy = min(94, max(3, cy))
            if not legal_check(f, cx, cy):
                continue
            if not placed(f, cx, cy, placed_list, (EX[0], EX[1], EY[0], EY[1]), g):
                continue
            pos[f["id"]] = (cx, cy)
            placed_list.append((cx, cy, f["w"], box_h_est(f)))
            return True
    print(f"  {ok_label}:", f["id"])
    return False


# ── pass 1: mobile:true entries, biggest first ───────────────────────────
for f in mob:
    place(f, "MOBILE UNPLACED", mobile_ok, 800, (1.0, 0.8, 0.6), 0.7, ":medge")

# ── pass 2: remaining desktop-only prints, zone-weighted scatter ─────────
ZONES = [(0, 0, 1.1), (1, 0, 0.8), (2, 0, 1.1),
         (0, 1, 0.8), (1, 1, 0.0), (2, 1, 0.8),
         (0, 2, 1.1), (1, 2, 0.8), (2, 2, 1.1)]
scatter = sorted(non_mob, key=lambda e: -e["w"])
total_w = sum(z for (_, _, z) in ZONES)
weighted = []
fracs = []
for (zx, zy, wgt) in ZONES:
    if wgt == 0:
        continue
    exact = wgt * len(scatter) / total_w
    weighted += [(zx, zy)] * int(exact)
    fracs.append(((exact - int(exact), hash01(f"{zx}:{zy}:frac")), (zx, zy)))
leftover = len(scatter) - len(weighted)
fracs.sort(key=lambda t: (-t[0][0], t[0][1]))
for i in range(leftover):
    weighted.append(fracs[i % len(fracs)][1])
assert len(weighted) == len(scatter), f"cell count mismatch {len(weighted)} vs {len(scatter)}"
rng.shuffle(weighted)

def always_ok(f, x, y):
    return True

for i, f in enumerate(scatter):
    zx, zy = weighted[i]
    ok = False
    # 1) zone cell darts
    for relax in (1.0, 0.8, 0.6, 0.4):
        g = GAP * relax
        for _ in range(600):
            x = rng.uniform(zx * 33.3, (zx + 1) * 33.3)
            y = rng.uniform(zy * 33.3, (zy + 1) * 33.3)
            if hash01(f["id"] + ":edge") < 0.3:
                edges = [(x, 1.5), (x, 98.5), (1.5, y), (98.5, y)]
                x, y = min(edges, key=lambda p: math.hypot(p[0] - x, p[1] - y))
            x = min(97, max(3, x)); y = min(94, max(3, y))
            if placed(f, x, y, placed_list, (EX[0], EX[1], EY[0], EY[1]), g):
                pos[f["id"]] = (x, y)
                placed_list.append((x, y, f["w"], box_h_est(f)))
                ok = True
                break
        if ok:
            break
    if ok:
        continue
    # 2) global darts (zone-locked cells can never fit big boxes)
    if place(f, "UNPLACED", always_ok, 400, (1.0, 0.8), 0.25, ":global"):
        continue
    # 3) loose: gap 1.0 anywhere
    for _ in range(400):
        x = rng.uniform(3, 97); y = rng.uniform(3, 94)
        if placed(f, x, y, placed_list, (EX[0], EX[1], EY[0], EY[1]), 1.0):
            pos[f["id"]] = (x, y)
            placed_list.append((x, y, f["w"], box_h_est(f)))
            ok = True
            break
    if not ok:
        print("  UNPLACED:", f["id"])

# ── apply ────────────────────────────────────────────────────────────────
out = field_body
n_applied = 0
for e in entries:
    pm = re.search(r"pos:\s*\{[^}]*\},?", e["body"])
    if not pm:
        continue
    x, y = pos.get(e["id"])
    if x is None:
        continue
    newpos = f'pos: {{ left: {x:.3g}, top: {y:.3g} }},'
    out = out.replace(pm.group(0), newpos, 1)
    n_applied += 1
print("positions rewritten:", n_applied, "of", len(entries))

# ── verify ───────────────────────────────────────────────────────────────
xs = [v[0] for v in pos.values()]; ys = [v[1] for v in pos.values()]
print("x range:", round(min(xs), 1), "-", round(max(xs), 1))
print("y range:", round(min(ys), 1), "-", round(max(ys), 1))
cells = [0] * 9
for (x, y) in pos.values():
    cells[int(x // 33.4) + 3 * int(y // 33.4)] += 1
print("3x3 cell counts:", cells)
# boxes whose EDGES intersect the exclusion rect (visual breathing check)
bad = []
for (fid, (x, y)) in pos.items():
    e = id_map[fid]; w = e["w"]; h = box_h_est(e)
    if x - w / 2 < EX[1] and x + w / 2 > EX[0] and y - h / 2 < EY[1] and y + h / 2 > EY[0]:
        bad.append(fid)
print("box edges inside hero exclusion:", bad or "none")
# mobile legality
mbad = [f["id"] for f in mob if not mobile_ok(f, *pos[f["id"]])]
print("mobile:true entries failing mobile_ok:", mbad or "none")
minds = []
pos_items = list(pos.items())
for i in range(len(pos_items)):
    for j in range(i + 1, len(pos_items)):
        a, (ax, ay) = pos_items[i]; c, (cx, cy) = pos_items[j]
        ea = id_map[a]; ec = id_map[c]
        dx = abs(ax - cx) - (ea["w"] + ec["w"]) / 2
        dy = abs(ay - cy) - (box_h_est(ea) + box_h_est(ec)) / 2
        minds.append(max(dx, dy))
minds.sort()
print("min edge gaps (%, 10 smallest):", [round(g, 2) for g in minds[:10]])

field_start = fi + len("field: [")
src_new = src[:field_start] + out + src[nxt:]
open(SRC, "w", encoding="utf8", newline="\n").write(src_new)
print("WROTE", SRC)
