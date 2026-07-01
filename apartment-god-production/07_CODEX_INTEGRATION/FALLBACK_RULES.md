# Fallback Rules

Purpose: keep the current prototype running until real approved production assets exist.

Runtime files changed in this branch: no

## Core Rule

The current procedural canvas visuals are the default runtime fallback. They must remain active unless all asset safety gates pass.

## Asset Gate

A future runtime renderer may use a production PNG only when all of these are true:

1. The manifest entry exists.
2. The mapped `state_id` matches the current runtime intent.
3. Every required frame file exists in the matching production asset folder or approved runtime asset folder.
4. The file is an original transparent PNG where a sprite is expected.
5. The asset is QA-approved under Art Bible rules.
6. The asset is not from `REFERENCE_LIBRARY/`.
7. The asset is not a placeholder, `.gitkeep`, screenshot, contact sheet, prompt output preview, or unapproved generation.

If any condition fails, the renderer must use the existing procedural visual.

## Reference Library Rule

Never load these as gameplay assets:

- `apartment-god-production/REFERENCE_LIBRARY/00_contact_sheets/`
- `apartment-god-production/REFERENCE_LIBRARY/01_environment_references/`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/`
- `apartment-god-production/REFERENCE_LIBRARY/03_dog_references/`
- `apartment-god-production/REFERENCE_LIBRARY/04_legacy_simple_character_refs/`
- `apartment-god-production/REFERENCE_LIBRARY/05_current_game_context/`

Reference Library files are guidance only.

## Environment Fallbacks

Current procedural environment systems must continue to work:

- Floor switching.
- Room rendering.
- Doorway routing.
- Window open/close interactions.
- Room light toggles.
- Object clicks.
- Object movement.
- Build placement.
- Collision and pathfinding.
- TV, stove, fridge, stereo, stairs, bed, shower, toilet, dog bowl, bookshelf, workout gear, and light visuals.

Future environment PNGs may be layered only when they do not break collision, interactions, or readable pathing. If a layer is missing, keep the procedural layer.

## Character Fallbacks

Current procedural character drawing must remain available for:

- `resident`.
- `girlfriend`.
- `dog`.
- All movement.
- All timed actions.
- All social actions.
- Offsite hide/show.
- Speech bubbles.
- Mood icons.
- Action progress bars.

If a manifest-mapped state is missing one frame in an A/B/C set, the whole state falls back to procedural drawing. Do not mix partial approved frames with procedural limbs.

## Joint State Fallbacks

Joint states must be atomic.

Only hide solo procedural sprites and draw a combined joint sprite when:

- Both actors are present and not hidden.
- Both actors are on the same floor.
- Both actors reached the shared anchor.
- The joint state manifest entry exists.
- All required joint frames exist.
- The joint frames are QA-approved.

If any condition fails, draw the current separate procedural sprites.

## Dog Fallbacks

Dog manifest integration must preserve:

- Current fetch state machine.
- Current dog movement.
- Current dog bowl and hunger effects.
- Current pet/train/fetch social actions.
- Current procedural dog drawing and ball positioning.

If dog manifest parsing fails because entries are array-shaped, skip dog PNG rendering and use the procedural dog.

## Error Handling Rule

Future loaders must fail closed:

- Missing manifest: procedural fallback.
- Invalid manifest JSON: procedural fallback plus developer warning.
- Missing asset file: procedural fallback.
- Unapproved asset: procedural fallback.
- Reference Library path: procedural fallback and hard warning.
- Partial frame set: procedural fallback.

No user-facing gameplay flow should stop because a production asset is missing.

## Deployment Rule

Do not deploy fallback work from this branch. Do not change Render settings. Do not modify `main` directly.
