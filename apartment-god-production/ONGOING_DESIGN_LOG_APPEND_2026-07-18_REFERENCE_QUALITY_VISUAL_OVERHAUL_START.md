## 2026-07-18, Reference Quality Native Phaser Visual Overhaul Start

Status: PLANNED
Branch: phaser-migration-2
Commit: pending implementation commits
Files changed: idea bible directive, this log append, future native Phaser assets and runtime mapping
Runtime files changed: planned
Render playable branch updated: no
Backup branch: pending creation from current phaser-migration-2 head

Summary:
Kam directed that Apartment God must be rebuilt to the quality level of the supplied high angle top down anime apartment reference, not merely approximated. The current room footprints, gameplay, object purposes, routes, and native Phaser architecture should be preserved while procedural blocks, generic category sprites, weak furniture construction, and low quality character models are replaced throughout the game.

Implementation details:
- Treat the supplied mockup as the locked quality, material, character, lighting, furniture, architecture, and interface target rather than an exact floor plan.
- Preserve native Phaser scene, layers, images, sprites, graphics, depth, input, collision, and exactly 8 FPS character timing.
- Do not restore the old Canvas compatibility renderer or offscreen Canvas texture bridge.
- Preserve object IDs, actions, room uses, routes, and click targets unless a specific physical form requires correction.
- Build object specific top down furniture and architectural assets instead of category wide generic placeholders.
- Begin with a safe complete native asset mapping foundation and the main floor quality anchor, then continue in audited batches across every floor, exterior area, character, dog, vehicle, effect, activity, and interface surface.
- Keep every unfinished area honestly marked temporary until browser approved.

Testing performed:
Directive logging and current branch inspection only. No runtime changes have been made by this entry.

Testing requested:
After each implementation batch, use the isolated P2 AppDeploy preview to inspect boot, mobile scale, room fidelity, object placement, character anatomy, directional animation, object alignment, depth, interactions, and performance.

Known risks:
This is a major visual and renderer-adjacent overhaul that can break boot, asset loading, object click alignment, collision readability, depth, mobile performance, and activity placement if implemented broadly without specific assets and fallbacks.

Follow ups:
Create a real backup branch from the current phaser-migration-2 head before runtime or asset replacement. Then implement the first audited reference-quality native Phaser asset batch, tests, matrix patch, build verification, and AppDeploy preview update without touching main or Render.
