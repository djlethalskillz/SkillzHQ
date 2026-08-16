"""Fragments archive probe: dims, brightness, sharpness, faces, dhash. Read-only, JSON out."""
import os, json, subprocess
import numpy as np
import cv2

ARC = r"C:\Users\djlet\Documents\00- Knowledge\Skillz HQ (Site)\_Claude_References\Fragments\ARCHIVE"
ONNX = os.path.abspath("scripts/_evi/face_detection_yunet_2023mar.onnx")
OUT = os.path.abspath("scripts/_evi/frag_audit.json")

detector = cv2.FaceDetectorYN_create(ONNX, "", (320, 320), 0.6, 0.3, 5000)
IMG_EXT = {".jpg", ".jpeg", ".png", ".jfif", ".webp", ".bmp"}
VID_EXT = {".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"}

def dhash64(im, size=8):
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    g = cv2.resize(g, (size + 1, size))
    d = g[:, 1:] > g[:, :-1]
    bits = d.flatten()
    return int("".join("1" if b else "0" for b in bits), 2)

def probe_image(p):
    im = cv2.imread(p)
    if im is None:
        return {"read": False}
    h, w = im.shape[:2]
    small = im if w <= 900 else cv2.resize(im, (900, round(h * 900 / w)), interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    bright = float(gray.mean())
    lap = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    detector.setInputSize((small.shape[1], small.shape[0]))
    ok, faces = detector.detect(small)
    n = 0
    mf = 0
    if faces is not None and len(faces) > 0:
        n = len(faces)
        mf = int(max(f[2] * f[3] for f in faces))
    return {"read": True, "w": w, "h": h, "bright": round(bright, 1),
            "sharp": round(lap, 0), "faces": n, "maxF": mf,
            "dhash": dhash64(small)}

def probe_video(p):
    try:
        r = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height:format=duration",
             "-of", "json", p], capture_output=True, text=True, timeout=60)
        j = json.loads(r.stdout)
        w = j["streams"][0].get("width", 0)
        h = j["streams"][0].get("height", 0)
        dur = float(j["format"].get("duration", 0))
        return {"w": w, "h": h, "dur": round(dur, 1)}
    except Exception as e:
        return {"err": str(e)}

rows = []
for root, _, fns in os.walk(ARC):
    for fn in sorted(fns):
        p = os.path.join(root, fn)
        rel = os.path.relpath(p, ARC)
        ext = os.path.splitext(fn)[1].lower()
        rec = {"file": rel, "ext": ext, "kb": round(os.path.getsize(p) / 1024, 1)}
        if ext in IMG_EXT:
            rec.update(probe_image(p))
        elif ext in VID_EXT:
            rec.update(probe_video(p))
        rows.append(rec)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=1)
print(f"{len(rows)} files probed -> {OUT}")
