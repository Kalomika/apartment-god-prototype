# Top Shot Asset Inbox Manifest

Branch: `top-shot-combat-pose-states`

This branch only adds support material. It does not touch live gameplay runtime files.

## Added reference notes

### `top-shot/asset_inbox/reference_notes/COMBAT_POSE_STATES.md`

Captured the uploaded soldier pose references as combat animation state targets. Covers standing low ready, tactical trot, standing aim, kneeling cover, wall pinned hide, corner lean fire, prone dive recovery, prone crawl, boulder or trench cover, and autonomous weapon pickup behavior.

### `top-shot/asset_inbox/animation_blueprints/soldier_combat_state_machine.json`

Machine-readable animation and autonomy blueprint for Codex. Includes state names, transitions, IK targets, cover alignment needs, and fighter profile weights for generic soldier, John Wick style fighter, and Rambo style fighter.

## Asset policy

The uploaded images are treated as pose and behavior references only. Do not copy watermarked or licensed image content into final game art. Use them to guide silhouette, body mechanics, animation timing, tactical decision making, and cover staging.

## Runtime boundary

Do not edit these live files from this support pass unless Kam explicitly asks for runtime integration:

- `top-shot/src/main.js`
- `top-shot/src/render.js`
- `top-shot/src/systems.js`
- `top-shot/src/state.js`
- `top-shot/src/arena.js`

Codex should wire this into the active Render-connected branch only after checking the latest repository state, current logs, current animation/model format, and any recently implemented combat autonomy work.
