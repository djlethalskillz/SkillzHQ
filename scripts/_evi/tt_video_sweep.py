"""Fast sweep of the 5 turntablism video candidates: 1fps, 320w, brightness + faces per frame."""
import os, subprocess, tempfile
import numpy as np
import cv2

ARC = r"C:\Users\djlet\Documents\00- Knowledge\Skillz HQ (Site)\_Claude_References\Speaking\Turntablism"
ONNX = os.path.abspath("scripts/_evi/face_detection_yunet_2023mar.onnx")
FFMPEG = "ffmpeg"

FILES = [
    "VID_133720217_053443_831.mp4",
    "VID20240406183644.mp4",
    "VID20240929182450.mp4",
    "Skratching and Dancing.mp4",
    "VID20241110161854.mp4",
]

detector = cv2.FaceDetectorYN_create(ONNX, "", (320, 320), 0.6, 0.3, 5000)

for fn in FILES:
    src = os.path.join(ARC, fn)
    with tempfile.TemporaryDirectory() as td:
        pat = os.path.join(td, "f%03d.jpg")
        subprocess.run(
            [FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", src,
             "-vf", "fps=1,scale=320:-2", "-q:v", "5", pat],
            check=True,
        )
        frames = sorted(os.listdir(td))
        print(f"\n== {fn} | {len(frames)} frames ==")
        for f in frames:
            im = cv2.imread(os.path.join(td, f))
            if im is None:
                continue
            gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
            b = float(gray.mean())
            detector.setInputSize((im.shape[1], im.shape[0]))
            ok, faces = detector.detect(im)
            n = 0
            mf = 0
            if faces is not None and len(faces) > 0:
                n = len(faces)
                mf = int(max(f[2] * f[3] for f in faces))
            t = frames.index(f)
            print(f"  t={t}s bright={b:5.1f} faces={n} maxF={mf}")
