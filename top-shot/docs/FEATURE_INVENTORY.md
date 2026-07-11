# Top Shot Feature Inventory

This is the canonical feature checklist for Top Shot. Future refactors must preserve these player-facing purposes unless Kam explicitly asks for replacement.

## Production rule

Every change must be additive, corrective, or an explicitly approved replacement. If a feature existed before, it must keep working after refactor. If a new system changes an older feature, the new version must preserve or improve the same gameplay purpose.

## Current v0.1 baseline

- One top down arena test.
- One on one AI versus AI matches.
- Fighter selection before match start.
- Coach style support for Fighter A.
- Commander ethos selector.
- CQC Lab mode.
- Top down Three.js renderer.
- Canvas fallback style is not the strategic target, but the game must still load and stay readable.

## Fighter and archetype baseline

- Marine style ranged combat.
- Ninja or shadow fighter style stealth/blade combat.
- Archer or projectile style combat.
- Martial artist style CQC combat.
- Suit operative and survival commando style 3D actor presentations where present.
- Fighter stats such as hp, stamina, block, dodge, bleed, awareness, trust, ammo, heat, resources, limbs, and memory.

## Combat baseline

- Ranged fire and projectile effects.
- Bullet tracer or projectile visualization.
- Melee attacks.
- Knife/blade attacks.
- Punches, kicks, elbows, knees, sweeps, trips, throws, headbutts, disarms, and blocks where implemented.
- CQC hitboxes.
- Body zones.
- Grounded states.
- Mounting without clipping through bodies.
- Mount escape attempts.
- Limb grabs and disarms.
- Damage, bleeding, recovery caps, and incapacitation.
- Respectful and ruthless finish logic where implemented.

## AI baseline

- AI movement.
- Cover seeking.
- Line of sight.
- Hiding and stealth search behavior.
- Crouch/prone states.
- Investigation of last seen locations.
- Patrol or scanning behavior.
- Tactical decisions based on health, stamina, visibility, sound, and archetype.
- Coach suggestions and command influence.

## 3D baseline

- `topShot3D.js` creates the Three.js world.
- `actors3D.js` creates segmented placeholder actors with readable body parts.
- `effects3D.js` handles effects and CQC pose stabilization.
- `debugOverlay3D.js` handles dev visualization on branches where it exists.
- Top down camera remains the primary view.
- Terrain, cover, shadow zones, collision visuals, markers, and actors must remain readable.

## Debug baseline

- Collision debug toggles with `C` where implemented.
- Debug overlay toggles with `D` where implemented.
- Debug tools must be dev-only and must not alter gameplay logic.
- Starshot debug overlay telemetry now includes a timing/snapshot line and per-fighter animation, motion, combat, and AI snapshot lines on the experimental branch.

## Starshot Meta-System baseline

Current experimental scaffold:

- Event bus for inspectable cross-system messages.
- Timing controller for real time, slow motion, impact pause, and cinematic slow snapshots.
- Actor runtime state derivation from existing fighter/actor data.
- Debug snapshot formatter for overlays and tooling.
- Actor update pipeline scaffold with profile, AI, combat, motion, animation, rendering, and debug stages.
- Standalone `npm run starshot-smoke` test path.

## Long term Starshot target features

- Visual motion smoothing and inertia.
- Animation state machine.
- Micro-motion layer.
- Combat timing profiles.
- Hit frames and impact pauses.
- Combo and counter windows.
- Character profiles and power scaling.
- Smarter AI style profiles.
- Procedural or prompt driven arenas.
- Tournament and repeated simulation logs.
- More robust debug telemetry.

## Regression rule

Before merging a branch, verify the current QA checklist. Do not merge if match mode, CQC Lab, core movement, combat, debug toggles, or 3D rendering are broken unless the branch is explicitly a broken experimental checkpoint and is not going into stable.
