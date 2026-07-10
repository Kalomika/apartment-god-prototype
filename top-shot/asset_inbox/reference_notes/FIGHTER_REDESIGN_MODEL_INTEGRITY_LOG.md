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

## Implementation completed

The concept has been pushed into the procedural Three.js actor system in `top-shot/src/three/actors3D.js`.

The update adds:

- Separate proportional model profiles for suit operative, survival commando, and supporting archetypes.
- Low-poly faceted material treatment for a tactical PS1 to PS2 era readability target.
- More human torso, waist, hip, shoulder, limb, hand, boot, and head proportions.
- Head construction with jaw, brow, nose, cheek planes, ears, eyes, and hair pieces instead of a single smooth sphere.
- Suit operative details: lapels, tie, shirt panel, pocket square, belt, buckle, jacket tails, cuffs, thigh holster, dress shoes, and holstered pistol staging.
- Survival commando details: vest plate, vest center, shoulder straps, magazine pouches, belt, cargo pockets, knee pads, gloves, boots, bandana, bare forearms, and a more detailed rifle.
- Weapon staging rules preserved: pistols holster during bare hand moves, rifles sling to the back during fist fighting and ground states, blades come forward only during blade actions.
- Named hurt zones and limb volumes preserved for CQC and stealth/combat systems.

## Validation added

Added `top-shot/tests/modelSmoke.js` and included it in `npm run smoke`.

The smoke test checks:

- Suit and commando actor creation.
- Required redesign details, including holster, lapel, jaw, brow, vest plate, mag pouch, and cargo pocket.
- Minimum model mesh counts so the redesign does not regress to simple mannequins.
- Body hurt zones and limb hit volumes still exist after the visual remodel.

## Files for this pass

- `top-shot/src/three/actors3D.js`
- `top-shot/tests/modelSmoke.js`
- `top-shot/package.json`
- `top-shot/asset_inbox/reference_notes/FIGHTER_REDESIGN_MODEL_INTEGRITY_LOG.md`
- `top-shot/asset_inbox/ASSET_MANIFEST.md`
- `top-shot/docs/CHANGELOG.md`

## Remaining art direction

This is still a procedural model pass, not a hand-authored GLB pass. The next quality jump should come from real modeled and skinned assets with UVs, texture sheets, deliberate facial planes, and animation-ready topology, but this pass gets the generated redesign integrity into live gameplay now.
