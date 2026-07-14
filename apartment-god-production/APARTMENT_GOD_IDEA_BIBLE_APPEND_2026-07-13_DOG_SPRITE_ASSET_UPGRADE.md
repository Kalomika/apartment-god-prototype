# Idea Bible Append: Dog Sprite Asset Upgrade

Status: PARTIAL_RUNTIME_ASSET_PASS
Date: 2026-07-13

## Kam directive

The dog cannot remain a crude procedural shape. The dog should be treated as a real sprite-quality asset test for the project. It needs an actual top-down design with every major part accounted for:

- ears
- head
- snout
- body
- four legs
- tail
- collar
- markings
- readable top-down direction
- walk/rest/fetch/eat/bath/petting animation identity over time

Kam explicitly rejected the current procedural shape approach and asked for a real dog sprite direction using the available PNG/asset pipeline and Adobe/Photoshop-style tooling if needed.

## Current immediate implementation

A first asset-backed dog atlas was added at:

`assets/sprites/characters/dog/top_down_dog_atlas.svg`

It includes four directional frames:

- south/front
- north/back
- east/right
- west/left

The runtime renderer now uses `src/renderEntitiesTopDown.js` to draw the dog from that asset atlas instead of drawing the old procedural dog body.

## Honest limitation

This is an asset-backed SVG atlas committed as a repo file so the browser can load it immediately. It is a first runtime asset pass, not the final PNG sprite sheet. Final dog production still needs real PNG frames and a manifest when binary PNG upload is available and audited.

## Future required dog work

- Produce final PNG sprite atlas in `assets/sprites/characters/dog/`.
- Add frame manifest in `assets/manifests/`.
- Add walk, run, sit, lie, sleep, eat, fetch, petting, wash/bath, and alert states.
- Stop all fallback/procedural dog rendering once PNG states are complete and browser verified.
- Audit the dog against true top-down visual rules.
