# OpenSCAD Asset Pipeline

## Purpose

This pipeline gives the wrestling sim editable procedural source assets.

Instead of treating early models as one off images, ring pieces and simple wrestler bases can be generated from `.scad` files with exposed variables.

## Why OpenSCAD

OpenSCAD is useful here because it lets us define hard surface and primitive based assets with code.

Good targets:

```text
ring
ropes
posts
corner pads
apron
steps
barricades
tables
chairs
belts
simple props
simple wrestler proxy bodies
collision body references
```

Less ideal targets:

```text
final organic wrestler anatomy
cloth wrinkles
hair cards
facial likeness
high quality deformation meshes
```

For wrestlers, OpenSCAD is best for early body type proxies and top down gameplay silhouettes. Later, Blender or another mesh workflow should refine final characters.

## Folder Layout

```text
wrestling_sim/assets/scad/
  ring_low_poly_top_down_v1.scad
  wrestler_powerhouse_proxy_v1.scad

wrestling_sim/tools/
  export_openscad_assets.mjs
```

## Expected Exports

When OpenSCAD is installed locally, run:

```bash
cd wrestling_sim
npm run export:scad
```

Expected output folders:

```text
wrestling_sim/assets/generated/stl/
wrestling_sim/assets/generated/3mf/
```

## Design Rule

The `.scad` files are the source of truth for parametric hard assets. Generated STL, OBJ, GLB, or PNG renders can be added later when we choose a stable version.

## Current Prototype Direction

```text
absolute top down match view
low poly 3D ring source
white mat
black ropes
black posts
white corner pads
see through gaps between rope lines
simple wrestler proxy models
manager choice interface below match view
```
