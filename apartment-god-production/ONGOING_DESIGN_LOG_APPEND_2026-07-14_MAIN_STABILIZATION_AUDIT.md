# Ongoing Design Log Append: Main Stabilization Audit

## 2026-07-14, Main Stabilization Audit

Status: NEEDS_BROWSER_CONFIRMATION
Branch: main
Runtime files changed: yes
Render playable branch updated: yes, direct main stabilization commits
Render settings changed: no
Manual Render deploy triggered: no
Protected repo touched: no
Backup branches:
- backup/main-before-main-stabilization-audit-2026-07-14
- backup/phaser-migration-before-main-stabilization-audit-2026-07-14

## Kam directive

Kam asked for a thorough, surgical audit of the current `main` branch before the dedicated Phaser rebuild continues. The goal was to leave main in a decent playable state so Kam and another AI can test and work with the current playable while the full Phaser rebuild is handled separately.

## Audit findings

- `main` had already been restored to `bootCanvasGame()` before this audit, which is safer for the playable branch than the Phaser host that previously caused a black play canvas while the HUD loaded.
- Sleep visuals were still anchored to the actor's side-of-bed approach point, which made sleeping appear on the floor between the primary bed and primary TV.
- Bathroom routing was not strongly prioritizing the upstairs private/master bathroom for upstairs actors.
- The dog renderer on main was still a runtime shape renderer, even though a committed dog atlas asset existed at `assets/sprites/characters/dog/top_down_dog_atlas.svg`.
- The action lifecycle needed to preserve existing features such as fetch, offsite completion, trash continuation, book completion, queued tasks, and life activity recording while adding bed sleep anchors.

## Files changed on main

- `src/renderEntities.js`
- `src/actions.js`
- `src/autonomy.js`
- `src/dogSpriteOverlay.js`
- `apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_MAIN_STABILIZATION_AUDIT.md`

## Implementation details

### Sleep floor bug

`src/renderEntities.js` now uses a sleep render anchor. When an actor is in a sleep, nap, waking, king bed, or bed together state, the actor is visually drawn on the bed object instead of at the actor's side-of-bed approach point. The actor movement position can remain beside the bed for routing, while the sleep visual is anchored onto the mattress.

`src/actions.js` now records `sleepObjectId` when a sleep-like action starts and clears it after the sleep-like action finishes.

### Bathroom routing

`src/autonomy.js` now ranks bathroom objects through a private bathroom preference function. Upstairs actors strongly prefer same-floor master bathroom objects first. Downstairs actors prefer the downstairs bath before cross-floor alternatives. This should stop the resident from going downstairs for bathroom needs when their own upstairs bathroom is available.

`src/actions.js` hand washing also uses private bathroom preference when choosing a sink after toilet or standing pee.

### Dog sprite usage

`src/dogSpriteOverlay.js` now draws the committed dog atlas asset from:

`assets/sprites/characters/dog/top_down_dog_atlas.svg`

This replaces the runtime-only dog shape renderer on main with an asset-backed dog draw path.

### Action lifecycle preservation

`src/actions.js` keeps the established action lifecycle pieces:

- fetch ball export
- offsite job update and return
- trash run continuation
- book completion
- meal cleanup
- robot vacuum update
- reaction update
- investment update
- queued task execution
- life activity recording

## Testing performed

- Verified by GitHub file inspection only.
- Browser and Render behavior were not available from this connector environment.

## Testing requested

Open and hard refresh:

https://apartment-god-phaser.onrender.com

Test:

1. Confirm the game boots and the play canvas is not black.
2. Confirm `main` is using the playable Canvas boot, not the failed Phaser-host black screen path.
3. Put a resident to sleep or wait for sleep. The sleep visual should appear on the primary bed, not on the floor between the bed and TV.
4. Trigger bathroom need upstairs. The resident should use the upstairs/master bathroom first when available.
5. Confirm they only go downstairs when the same-floor/private bathroom is busy, blocked, or unusable.
6. Test fetch, trash, reading, offsite/work, and eating once to confirm action lifecycle still works.
7. Confirm the dog appears from the committed dog atlas and not the prior runtime-only dog shape renderer.

## Known risks

- This was code-inspected but not browser-tested.
- `actions.js` and `autonomy.js` were compacted during stabilization. They need future cleanup for readability, but the exported lifecycle functions were preserved by inspection.
- The dog atlas is still an SVG asset bridge, not the final PNG dog animation sheet.
- Full Phaser-native rendering remains deferred to a separate rebuild branch.

## Follow ups

- After Kam confirms main is decent enough to play/test, stop changing main except for critical fixes.
- Start the full Phaser/native asset rebuild on a separate branch.
- Build Phaser systems with real assets, sprite atlases, manifests, and staged approvals instead of extending the current procedural bridge.
