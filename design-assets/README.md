# design-assets

Source material that must not be served to visitors, so it deliberately lives
outside `public/`.

## `products-original/`

The product shots exactly as the client supplied them: 1000×1000 PNGs on an
opaque white studio backdrop.

The copies in `public/images/products/` are the same files with that backdrop
knocked out, because the cards paint a gold glow *behind* the bottle — an opaque
photo covers 88% of the frame and hides the glow completely. Keep these
originals: `public/images/products/` is not in git, so a bad re-cut cannot be
recovered from history.

The cut-out floods in from the image border and only clears white that is
connected to the edge, with a soft 216–249 band for the anti-aliased outline.
Clearing *every* white pixel instead would punch holes through the white labels
and the white `access-gear` tubes.
