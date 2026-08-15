"""Probe Scratcher Dubai batch + equipment photo: faces, brightness, sharpness, orientation."""
import os, sys, math
import numpy as np
import cv2

ARC = r"C:\Users\djlet\Documents\00- Knowledge\Skillz HQ (Site)\_Claude_References\Speaking\Turntablism"
ONNX = os.path.abspath("scripts/_evi/face_detection_yunet_2023mar.onnx")

detector = cv2.FaceDetectorYN_create(
    ONNX, "", (320, 320), 0.6, 0.3, 5000
)

FILES = [
    "Scratcher Dubai THIS ONE.jpg",
    "Skratcher Dubai 1.jpg",
    "Skratcher Dubai 2.jpg",
    "Skratcher Dubai 3.jpg",
    "IMG20240406183601.jpg",
]

for fn in FILES:
    p = os.path.join(ARC, fn)
    im = cv2.imread(p)
    if im is None:
        print(fn, "READ FAIL")
        continue
    h, w = im.shape[:2]
    small = im if w <= 800 else cv2.resize(im, (800, round(h * 800 / w)), interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    bright = float(gray.mean())
    lap = cv2.Laplacian(gray, cv2.CV_64F).var()
    detector.setInputSize((small.shape[1], small.shape[0]))
    ok, faces = detector.detect(small)
    areas = []
    if faces is not None and len(faces) > 0:
        for f in faces:
            areas.append(int(f[2] * f[3]))
    maxf = max(areas) if areas else 0
    print(f"{fn} | {w}x{h} | bright {bright:.0f} | sharp {lap:.0f} | faces {len(areas)} maxF {maxf}")
