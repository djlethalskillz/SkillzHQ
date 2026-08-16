"""FRAGMENTS_ARCHIVE_CONTACT_SHEET_v1 — labeled grid of every archive asset. Read-only on source."""
import os
import cv2
import numpy as np

ARC = r"C:\Users\djlet\Documents\00- Knowledge\Skillz HQ (Site)\_Claude_References\Fragments\ARCHIVE"
OUT_DIR = r"C:\Users\djlet\Skillz-V1-Website\scripts\_evi"
OUT = os.path.join(OUT_DIR, "FRAGMENTS_ARCHIVE_CONTACT_SHEET_v1.png")

IMG_EXT = {".jpg", ".jpeg", ".png", ".jfif", ".webp", ".bmp"}
files = sorted(os.listdir(ARC))
TILE_W, TILE_H = 300, 300
COLS = 7
ROWS = int(np.ceil(len(files) / COLS))
LABEL_H = 44
sheet = np.full((ROWS * (TILE_H + LABEL_H), COLS * TILE_W, 3), 18, np.uint8)

for i, fn in enumerate(files):
    r, c = divmod(i, COLS)
    x, y = c * TILE_W, r * (TILE_H + LABEL_H)
    p = os.path.join(ARC, fn)
    ext = os.path.splitext(fn)[1].lower()
    tile = np.full((TILE_H, TILE_W, 3), 10, np.uint8)
    if ext in IMG_EXT:
        im = cv2.imread(p)
        if im is not None:
            h, w = im.shape[:2]
            s = min(TILE_W / w, TILE_H / h)
            nw, nh = int(w * s), int(h * s)
            im = cv2.resize(im, (nw, nh), interpolation=cv2.INTER_AREA)
            ox, oy = (TILE_W - nw) // 2, (TILE_H - nh) // 2
            tile[oy:oy + nh, ox:ox + nw] = im
    sheet[y:y + TILE_H, x:x + TILE_W] = tile
    label = fn if len(fn) <= 34 else fn[:31] + "..."
    cv2.putText(sheet, label, (x + 6, y + TILE_H + 16),
                cv2.FONT_HERSHEY_SIMPLEX, 0.4, (220, 220, 220), 1, cv2.LINE_AA)
    cv2.putText(sheet, f"{im.shape[1]}x{im.shape[0]}" if im is not None else "N/A",
                (x + 6, y + TILE_H + 32), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (150, 150, 150), 1, cv2.LINE_AA)

cv2.imwrite(OUT, sheet)
print(f"contact sheet -> {OUT} ({sheet.shape[1]}x{sheet.shape[0]})")
