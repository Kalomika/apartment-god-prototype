# Top Shot Fighter Redesign Model Integrity Log

Date: 2026-07-08
Branch: top-shot-v0-1
Purpose: Preserve the model redesign target for any AI or human agent working on Top Shot.

## User request

Push the exact fighter redesign concept into the playable game models. The redesign target is a low-poly tactical infiltration style between late PS1 and early PS2 realism, closer to Metal Gear Solid 1.5 or early Metal Gear Solid 2 readability, without copying any existing character.

## Concept target

Two core fighters should stop reading as simple block mannequins and start reading as game-ready tactical humans:

### Fighter A, Suit Operative

- Lean stealth operative silhouette.
- Dark fitted tactical suit.
- Dress shirt and tie.
- Sharp jaw, brow, nose bridge, cheek planes, ears, and styled dark hair.
- Thigh holster, belt, belt buckle, subtle pocket square, jacket lapels, cuffs, dress shoes.
- Pistol should holster during fist fighting and come forward for pistol or gun-butt actions.
- Slimmer shoulders and waist than the commando.

### Fighter B, Survival Commando

- Rugged but believable human build, not a square armor blob.
- Olive field shirt with bare forearms.
- Tactical vest with front plate, straps, mag pouches, shoulder straps, belt, cargo pockets, gloves, combat boots.
- Stronger head, jaw, brow, nose bridge, cheek planes, ears, and short dark hair.
- Rifle should be held naturally or slung cleanly to avoid CQC clipping.
- Broader chest and stance than the suit operative, but still anatomically believable.

## Implementation intent

The in-game placeholder actor system should keep its procedural Three.js construction, but it should now use more realistic human proportions, readable face planes, gear layering, weapon staging, and low-poly faceted model treatment.

## Files for this pass

- `top-shot/src/three/actors3D.js`
- `top-shot/asset_inbox/reference_notes/FIGHTER_REDESIGN_MODEL_INTEGRITY_LOG.md`
- `top-shot/asset_inbox/ASSET_MANIFEST.md`
- `top-shot/docs/CHANGELOG.md`
