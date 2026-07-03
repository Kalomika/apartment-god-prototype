# Ring Assets

## Active editable source

```text
wrestling_sim/assets/scad/ring_low_poly_top_down_v1.scad
```

This is now the source of truth for the low poly top down ring.

## Current generated asset files

```text
low_poly_top_down_ring_v1.obj
low_poly_top_down_ring_v1.mtl
```

These are the current checked in prototype mesh files.

## Export path

When OpenSCAD is installed locally, run from the `wrestling_sim` folder:

```bash
npm run export:scad
```

That exports `.scad` files into:

```text
wrestling_sim/assets/generated/stl/
wrestling_sim/assets/generated/3mf/
```

## Current visual direction

```text
strict top down camera
low poly 3D ring
white mat
black ropes
black posts
white corner pads with black backing
three ropes per side
open spaces between rope lines
simple geometry for fast prototype testing
```

The model is designed to be rendered from an orthographic top down camera first.
