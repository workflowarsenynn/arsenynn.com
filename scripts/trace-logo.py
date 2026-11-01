"""Векторизует одноцветный логотип с прозрачным фоном в SVG.
Запуск: python3 scripts/trace-logo.py <in.png|webp> <out.svg> <#hex>
Нужен пакет potracer (pip install potracer)."""
import sys
import numpy as np
import potrace
from PIL import Image

src, out, color = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert('RGBA')
im = im.crop(im.getbbox())
mask = np.array(im)[..., 3] > 128
# potracer трассирует нулевые пиксели, поэтому маска инвертируется.
bmp = potrace.Bitmap(~mask)
path = bmp.trace(turdsize=8, alphamax=1.0, opticurve=True, opttolerance=0.2)
d = []
for curve in path:
    s = curve.start_point
    d.append(f'M{s.x:.1f},{s.y:.1f}')
    for seg in curve.segments:
        if seg.is_corner:
            d.append(f'L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}')
        else:
            d.append(f'C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}')
    d.append('Z')
w, h = im.size
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><path fill="{color}" fill-rule="evenodd" d="{"".join(d)}"/></svg>\n'
open(out, 'w').write(svg)
print(out, w, h, len(svg))
