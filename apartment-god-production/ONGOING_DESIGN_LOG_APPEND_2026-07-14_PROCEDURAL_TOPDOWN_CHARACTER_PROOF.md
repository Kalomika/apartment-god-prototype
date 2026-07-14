# Ongoing Design Log Append, 2026-07-14, Procedural Top Down Character Proof

Status: NEEDS_BROWSER_TESTING
Branch: phaser-migration
Commit:
- 70ade7be4d3ad0161668b72d1017c497b8bcd2fb, Log procedural top down character proof idea
- e87c7925e58c8fc24933cc3ebc8c0be0b1623a01, Add procedural top down character Bible
- 33ed7e85149eaff5fb08dce48226b2b8bb2e2cb8, Add female and dog to secret lab test proof
- 6c638c4316717d70f54d7ca7e5d1940195eb02b3, Add flat top down procedural lab character proof
- 0aa98d65dcb8490bc8fa66be5e9b06cedddae527, Add matrix patch for procedural top down character proof
Files changed:
- docs/APARTMENT_GOD_TRUE_TOP_DOWN_PROCEDURAL_CHARACTER_BIBLE.md
- src/state.js
- src/renderEntities.js
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-14_PROCEDURAL_TOPDOWN_CHARACTER_PROOF.md
- apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-14_PROCEDURAL_TOPDOWN_CHARACTER_PROOF.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_PROCEDURAL_TOPDOWN_CHARACTER_PROOF.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-procedural-topdown-character-proof-2026-07-14

## Summary

Created a focused Secret Sprite Test Lab proof for Kam's requested flat true top down procedural character look. This does not generate PNGs and does not broaden the style to the real household yet.

## Implementation details

- Added a procedural character Bible that defines the allowed flat true top down Canvas style.
- Added `lab_test_woman` and `lab_test_dog` to the Secret Sprite Test Lab alongside the existing male test actor.
- Reworked the entity renderer so lab-only characters use the new flatter overhead shape language.
- The lab proof uses adult proportions, flat vector color blocking, small hair/head shapes, simple torso wedges, capsule limbs, prop-ready hands, and a non-mascot overhead dog.
- The lab dog renderer is intentionally limited to the lab-only dog in this pass.
- Normal household broad conversion is deferred until Kam visually approves the lab proof.

## Testing performed

Code inspection through GitHub connector only. Local clone failed because the container could not resolve github.com, so npm checks and browser tests were not run in this environment.

## Testing requested

When this branch is testable in browser, open the Secret Lab and verify:

```txt
1. Game boots without blank canvas.
2. Secret Lab button still works.
3. Test Man, Test Woman, and Test Dog are visible.
4. Characters read closer to the provided flat overhead reference.
5. They are not chibi, mascot, toy-like, emoji-like, side view, or toilet door symbols.
6. Normal household still boots and remains playable.
```

## Known risks

`src/renderEntities.js` is a renderer file, so browser boot and selection behavior must be verified before calling this complete. This is a lab proof only, not a final production cast replacement.

## Follow ups

If Kam approves the lab look, expand the style to Resident, Girlfriend, and Dog in a separate pass with activity-specific poses and safe fallbacks.
