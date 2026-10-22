"""Make the web copy of the EPK: public/assets/DJ_LETHAL_SKILLZ_EPK-web.pdf.

usage (from the repo root):
  python scripts/epk-web-copy.py public/assets/DJ_LETHAL_SKILLZ_EPK.pdf public/assets/DJ_LETHAL_SKILLZ_EPK-web.pdf
Needs: pip install pymupdf pillow

Only images change: each image stream is re-encoded where it is (downsampled to 200 dpi on the page,
JPEG quality 82; soft masks resized and kept lossless), and byte-identical objects are merged.
Pages, text, fonts, vectors, gradients and links are not touched, and the original is never written.
2026-10-22: 5,394,537 -> 1,453,666 bytes; page renders PSNR 45.5 / 47.9 / 35.5 dB, text identical.
"""
import io
import os
import sys

import pymupdf
from PIL import Image

DPI, QUALITY = 200, 82
src, dst = sys.argv[1:3]
assert os.path.abspath(src) != os.path.abspath(dst), "refusing to overwrite the original"
doc = pymupdf.open(src)
done = set()
for page in doc:
    for img in page.get_images(full=True):
        xref, smask, w, h = img[0], img[1], img[2], img[3]
        if xref in done:
            continue
        done.add(xref)
        eff = max((w / (r.width / 72) for r in page.get_image_rects(xref) if r.width), default=0)
        scale = min(1.0, DPI / eff) if eff else 1.0
        nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
        pix = pymupdf.Pixmap(doc, xref)
        if pix.alpha:
            pix = pymupdf.Pixmap(pix, 0)
        if pix.n not in (1, 3):
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        mode = "L" if pix.n == 1 else "RGB"
        im = Image.frombytes(mode, (pix.width, pix.height), pix.samples)
        if (nw, nh) != im.size:
            im = im.resize((nw, nh), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=QUALITY, optimize=True)
        if len(buf.getvalue()) >= len(doc.xref_stream_raw(xref)) and (nw, nh) == (w, h):
            continue
        doc.update_stream(xref, buf.getvalue(), compress=False)
        for key, val in (("Filter", "/DCTDecode"), ("Width", str(nw)), ("Height", str(nh)), ("BitsPerComponent", "8"),
                         ("ColorSpace", "/DeviceGray" if mode == "L" else "/DeviceRGB"), ("DecodeParms", "null"), ("Decode", "null")):
            doc.xref_set_key(xref, key, val)
        if smask and smask not in done:
            done.add(smask)
            mpix = pymupdf.Pixmap(doc, smask)
            m = Image.frombytes("L", (mpix.width, mpix.height), mpix.samples)
            if m.size != (nw, nh):
                m = m.resize((nw, nh), Image.LANCZOS)
            doc.update_stream(smask, m.tobytes(), compress=True)
            for key, val in (("Filter", "/FlateDecode"), ("Width", str(nw)), ("Height", str(nh)), ("BitsPerComponent", "8"),
                             ("ColorSpace", "/DeviceGray"), ("DecodeParms", "null"), ("Decode", "null")):
                doc.xref_set_key(smask, key, val)
doc.save(dst, garbage=4, deflate=True)
print(f"{src}: {os.path.getsize(src):,} -> {dst}: {os.path.getsize(dst):,} bytes")
