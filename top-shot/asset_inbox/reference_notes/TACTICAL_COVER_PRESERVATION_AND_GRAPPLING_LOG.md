# Top Shot Tactical Cover, Preservation, and Grappling Log

Date: 2026-07-09
Branch: top-shot-v0-1
Purpose: Preserve the requested tactical behavior correction for any AI or human agent working on Top Shot.

## User correction

The user reported that fighters were still standing in the open and endlessly shooting at one another. The desired behavior is not simple circling or ring-around shooting. Fighters need to value survival, dive or roll to cover, pin themselves to cover, peek out, fire, recover, and preserve health, stamina, bleed limit, and life while looking for a smart path to win.

The user also clarified that cover behavior should feel closer to a Metal Gear/Splinter Cell style cover contact system: actual pinning against an object, not merely running behind an object. Bullets should hit the wall or object when a fighter is behind cover. Characters should only expose themselves briefly to shoot or reposition.

## Tactical study direction

The implementation direction follows broad fire and movement principles: take cover, suppress, move under cover, do not stay exposed in the kill zone, and alternate exposure with protected movement. This is adapted into one-on-one stylized AI rather than copied from any proprietary game.

## Implementation completed

This pass adds or changes:

- Cover material tags in arena data, including metal, concrete, stone, and wood.
- `solidAt` surface lookup so projectiles can react to what they hit.
- Preservation-first brain planning. Ranged fighters now try to reach cover before firing instead of orbit-shooting in the open.
- Pinned cover state through `coverPinned`, `wallLean`, `cover`, `peekT`, and `peekCooldown` behavior.
- Gun users only fire from cover, wall lean, shadow, or explicit ranged command instead of constantly shooting while exposed.
- Fighters under fire now create dive/roll cover behavior and get `diveT` and `rollT` windows so the animation system can show diving and rolling.
- Suppressed fighters get roll-to-cover commands and do not keep attacking in the open unless already pinned and peeking.
- Ninja and shadow ninja can now fire a grappling hook to nearby climbable/elevated objects, launch toward high cover, and then hide low.
- Grappling hook effects with a visible line.
- Smoke behavior fixed so ninja can use smoke under pressure before the suppression early return blocks action.
- Projectiles now react by surface material:
  - bullets create surface impact flash, spark on metal, and shrapnel/chips on hard surfaces.
  - arrows lodge into non-metal surfaces and bounce/spark off metal.
  - shuriken and debris stick or chip softer surfaces and spark/bounce on metal.
- Bullet body hits create blood spray unless armor absorbs the hit.
- Armor hits create spark reactions instead of blood.
- Bleeding can create visible trail drops through the wound system.
- Readable pose overlays for cover pinning, peeking, diving, rolling, crawling, grappling, wounded reactions, jab, cross, kicks, and blade attacks.
- Smoke test coverage for cover/evasion behavior under fire and shadow ninja grappling hook behavior.

## Runtime files changed

- `top-shot/src/arena.js`
- `top-shot/src/brain.js`
- `top-shot/src/perception.js`
- `top-shot/src/combat.js`
- `top-shot/src/systems.js`
- `top-shot/src/three/effects3D.js`
- `top-shot/tests/simSmoke.js`
- `top-shot/asset_inbox/reference_notes/TACTICAL_COVER_PRESERVATION_AND_GRAPPLING_LOG.md`

## Remaining work

This is still procedural animation and AI. The next quality pass should add real authored motion states: dive start, shoulder roll, wall contact, cover peek left/right, crouched reload, wounded kneel, hand-on-wound, slow stagger, true foot planted punches, hip/waist twist on strikes, and sidekick anticipation/contact/recovery timing.
