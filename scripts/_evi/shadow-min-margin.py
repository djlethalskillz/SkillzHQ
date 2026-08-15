"""Min shadow-overlap margin of any z-20 figure across the probe window."""
import json, re

log = json.load(open("scripts/_evi/shadow-census.json"))

def reach(s):
    m = re.findall(r"(\d+)px", s or "")
    v = [int(x) for x in m]
    return (max(v[:4], default=0) + 6) if v else 0

worst = []
for e in log:
    for fr in e["fronts"]:
        dx = max(e["fx0"] - (fr["x"] + fr["w"]), fr["x"] - e["fx1"], 0)
        dy = max(e["fy0"] - (fr["y"] + fr["h"]), fr["y"] - e["fy1"], 0)
        dist = max(dx, dy)
        r = reach(fr["shadow"])
        worst.append((dist - r, e["f"], fr["img"], dist, r))

worst.sort()
print("front figure shadow-overlap margin across window (most negative = over face):")
for w in worst[:10]:
    print(f"  frame {int(w[1]):3d} {w[2]:22s} gap {int(w[3]):3d}px reach {int(w[4]):3d}px  margin {int(w[0]):+d}px")
