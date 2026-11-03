#!/usr/bin/env python3
"""Cut tools/guide/contact-sheet.png (3x3 head poses on black) into the guide's pose images.

    python3 tools/guide/build-poses.py

Writes assets/guide/<pose>.webp (with transparency: the black backdrop is cut away so the head can stand out of its
frame in the page). Each pose is aligned on the hat (top edge and centre) so that swapping between poses reads as
one head turning, not as different photos. Right-facing poses are NOT files: js/guide.js mirrors
the left-facing ones. Needs Pillow + numpy.
"""
import os, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'contact-sheet.png')
OUT = os.path.join(HERE, '..', '..', 'assets', 'guide')
SIZE = 420           # output px (square); the guide shows it at ~124-180 css px, so this is retina-safe
TOP = 0.035          # where the hat's top edge lands, as a share of the height
# pose name -> (row, col) of its tile in the sheet
POSES = {
    'c':  (0, 0),   # facing the camera
    'l1': (0, 1),   # three-quarter turn toward the image's left
    'l2': (0, 2),   # profile toward the image's left
    'uc': (1, 1),   # looking up, facing the camera
    'ur': (1, 0),   # looking up and to the right
    'ul': (1, 2),   # looking up and to the left
}

def anchor(tile):
    """(x_centre, y_top) of the hat: the bright blob on the black backdrop."""
    a = np.asarray(tile.convert('L'), dtype=np.int16)
    ys, xs = np.where(a > 70)
    top = ys.min()
    band = xs[ys < top + 0.16 * a.shape[0]]          # the crown of the hat, not the shoulders
    return (band.min() + band.max()) / 2, top

DARK = 30            # a pixel this dark (max of R,G,B) counts as backdrop

def cut_out(img):
    """Return img as RGBA with the black backdrop transparent. The backdrop is found by flood-filling dark pixels
    from the top, left and right edges only (never the bottom): the black T-shirt at the bottom edge is enclosed
    by the white hoodie, so it is never reached and stays opaque."""
    a = np.asarray(img)
    h, w, _ = a.shape
    dark = a.max(axis=2) < DARK
    bg = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        q.append((0, x))
    for y in range(h):
        q.append((y, 0)); q.append((y, w - 1))
    while q:
        y, x = q.popleft()
        if 0 <= y < h and 0 <= x < w and dark[y, x] and not bg[y, x]:
            bg[y, x] = True
            q.extend(((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)))
    alpha = Image.fromarray(np.where(bg, 0, 255).astype('uint8'))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))   # trim the dark fringe, soften
    out = img.convert('RGBA'); out.putalpha(alpha)
    return out

def main():
    sheet = Image.open(SRC).convert('RGB')
    n = sheet.width // 3
    os.makedirs(OUT, exist_ok=True)
    for name, (r, c) in POSES.items():
        tile = sheet.crop((c * n, r * n, (c + 1) * n, (r + 1) * n))
        cx, top = anchor(tile)
        dx, dy = round(n / 2 - cx), round(TOP * n - top)
        canvas = Image.new('RGB', (n, n), (0, 0, 0))
        canvas.paste(tile, (dx, dy))
        cut_out(canvas).resize((SIZE, SIZE), Image.LANCZOS).save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=84, method=6)
        print(f'{name}: shift ({dx:+d},{dy:+d})')

if __name__ == '__main__':
    main()
