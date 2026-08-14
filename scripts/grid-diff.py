"""Dense grid diff: browser screenshot vs reconstructed composite from layers."""
import numpy as np
from PIL import Image

DIR = r"C:\Users\djlet\Skillz-V1-Website\public\assets"
shot = np.asarray(Image.open(r"C:\Users\djlet\AppData\Local\Temp\hero2-1440.png").convert("RGB"), dtype=np.float64)

layers = [
    "hero2-archival-layer.png",
    "hero2-skillz-layer.png",
    "hero2-dj-lethal-layer.png",
    "hero2-eoto-layer.png",
    "hero2-supporting-copy-layer.png",
    "hero2-cta-layer.png",
]
layer_imgs = [np.asarray(Image.open(f"{DIR}\\{f}").convert("RGBA"), dtype=np.float64) for f in layers]
master = np.asarray(Image.open(f"{DIR}\\skillz-hero2-master.png").convert("RGB"), dtype=np.float64)
L, H = 1200, 900  # hero region in shot coords (shot: x 120..1320)

# Precompute layer maps at hero scale (bilinear-ish by indexing)
step = 8
xs = np.arange(0, L, step)
ys = np.arange(0, H, step)
X, Y = np.meshgrid(xs, ys)
lx = (X / L * 1448).astype(int)
ly = (Y / H * 1086).astype(int)
mx = (X / L * 4624).astype(int)
my = (Y / H * 3468).astype(int)

acc = np.zeros((len(ys), len(xs), 4))  # premultiplied RGBA accumulators
for img in layer_imgs:
    c = img[ly, lx]  # (R,G,B,A)
    sa = (c[:, :, 3] / 255.0)[:, :, None]
    da = acc[:, :, 3:4]
    na = sa + da * (1 - sa)
    k = np.where(na > 0, (1 - sa) * da / np.maximum(na, 1e-9), 0)
    rgb = c[:, :, :3]
    acc[:, :, :3] = rgb * sa + acc[:, :, :3] * k
    acc[:, :, 3:4] = na

# master, white-keyed (opaque where lum < 239)
mc = master[my, lx]
lum = 0.299 * mc[:, :, 0] + 0.587 * mc[:, :, 1] + 0.114 * mc[:, :, 2]
sa = (lum < 239).astype(np.float64)[:, :, None]
da = acc[:, :, 3:4]
na = sa + da * (1 - sa)
k = np.where(na > 0, (1 - sa) * da / np.maximum(na, 1e-9), 0)
acc[:, :, :3] = mc * sa + acc[:, :, :3] * k
acc[:, :, 3:4] = na

# live marquee band y >= 858
mask = (Y >= 858)[:, :, None].astype(np.float64)
sa = mask
da = acc[:, :, 3:4]
na = sa + da * (1 - sa)
k = np.where(na > 0, (1 - sa) * da / np.maximum(na, 1e-9), 0)
yellow = np.array([255, 230, 0], dtype=np.float64)
acc[:, :, :3] = yellow[None, None, :] * sa + acc[:, :, :3] * k
acc[:, :, 3:4] = na

recon = acc[:, :, :3]
s_region = shot[ys, :][:, 120 + xs]  # [y, x, 3]

diff = np.abs(s_region - recon).mean(axis=2)  # per-cell mean RGB diff
worst = np.unravel_index(np.argmax(diff), diff.shape)
print(f"worst: hero({xs[worst[1]]},{ys[worst[0]]}) shot={s_region[worst]} recon={recon[worst]} diff={diff[worst]:.0f}")

for r in range(len(ys)):
    m = diff[r].mean()
    v = int(m / 12)
    spark = "#" * min(v, 30) + " " * max(0, 30 - min(v, 30))
    print(f"{r:3d} y{ys[r]:4d}-{ys[r]+step:4d} diff={m:5.1f} |{spark}|")
