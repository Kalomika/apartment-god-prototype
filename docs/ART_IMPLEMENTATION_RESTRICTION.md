# Art Implementation Restriction

Procedural primitives are fallback only. Do not add new production object art here.

Real objects must use image assets, PNG, WebP, SVG, or dedicated imported sprite/vector assets.

Allowed primitive use: debug overlays, temporary hitboxes, progress bars, selection rings, simple UI shapes, and emergency fallback only when a real asset is missing.

If an asset is missing, show a clearly labeled fallback and log it as missing art. Do not pretend fallback art is final.
