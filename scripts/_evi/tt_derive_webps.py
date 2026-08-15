"""Turntablism collage — derive webp tiles from the archive (q82, LANCZOS)."""
import os
from PIL import Image

ARC = r"C:\Users\djlet\Documents\00- Knowledge\Skillz HQ (Site)\_Claude_References\Speaking\Turntablism"
OUT = r"C:\Users\djlet\Skillz-V1-Website\public\assets\turntablism"
os.makedirs(OUT, exist_ok=True)

JOBS = [
    ("DSC00117.jpg", "TURN_CLOSEUP.webp", 800),          # portrait closeup
    ("IMG20221113190629.jpg", "TURN_JAM_2022.webp", 800),  # community jam, 8 faces
    ("IMG20230715164857.jpg", "TURN_2023.webp", 800),      # performance 2023
    ("kl skratch.jpg", "TURN_KL_SCRATCH.webp", 700),       # Scratcher KL identity
    ("SaveClip.App_621583892_18084382823468224_4765945408341578410_n.jpg",
     "TURN_FLYER.webp", 640),                              # archival flyer graphic
]

for src, name, maxw in JOBS:
    im = Image.open(os.path.join(ARC, src)).convert("RGB")
    w, h = im.size
    if w > maxw:
        im = im.resize((maxw, round(h * maxw / w)), Image.LANCZOS)
    out = os.path.join(OUT, name)
    im.save(out, "WEBP", quality=82, method=6)
    print(name, im.size, os.path.getsize(out) // 1024, "KB")
