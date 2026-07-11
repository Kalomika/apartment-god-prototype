# 2026-07-11 03:17 PM CT, Test Actor top down sprite pipeline first pass

Status: PARTIAL IMPLEMENTED
Branch: phaser-migration
Implementation commit: b29e9d0664ec1d6743506b2c610429b2cb848b13
Tracking commit: this append entry commit
Runtime files changed: yes
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-test-actor-sprite-pipeline-2026-07-11

## Files changed

```txt
src/renderEntities.js
src/testActorPoseManifest.js
src/testActorSpriteRenderer.js
apartment-god-production/reference/characters/test-actor-top-down-sprite-pipeline-2026-07-11.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-11_TEST_ACTOR_SPRITE_PIPELINE.md
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-11_TEST_ACTOR_SPRITE_PIPELINE.md
```

## Summary

Added the first Test Subject only true top down activity pose pipeline. The new path replaces the crude shared person presentation for `lab_test_subject` with a full color Canvas vector sprite renderer driven by an activity pose manifest.

## Implementation details

`src/testActorPoseManifest.js` maps Test Subject actions and action text to activity pose families, including idle, walk, chair sit, couch sit, TV watch, laptop desk work, laptop lap use, reading, phone use, eating, coffee, bed sleep, lying awake, floor lounging, pool table, console gaming, cooking, cleaning, changing clothes, workout, pet interaction, reaction, and cuddle fallback.

`src/testActorSpriteRenderer.js` draws the first production direction Test Subject sprite poses in full color. The renderer uses adult overhead proportions, separated shoulders, torso, hips, legs, hands, head direction, clothing color, shadow, and activity props. It includes simple low frame rate timing for walk, idle, typing, eating, coffee, cleaning, workout, pool cue, console, and pet interaction motion.

`src/renderEntities.js` now tries `drawTestActorSprite` before the old procedural person renderer. The hook is isolated to `lab_test_subject`, so Resident, Girlfriend, Dog, and existing systems keep their current safe behavior.

The reference production note records the audit, activity inventory, pose family mapping, design standard, upgraded activities, fallback activities, and second pass needs.

## Testing performed

```txt
node --check /mnt/data/ag_work/testActorPoseManifest.js
node --check /mnt/data/ag_work/testActorSpriteRenderer.js
node --check /mnt/data/ag_work/renderEntities.js
GitHub fetch verification for committed manifest, renderer, and renderEntities integration hook
```

## Testing requested

Browser test on `phaser-migration` after the branch is pulled or previewed. Navigate to the Secret Lab floor, select or observe the Test Subject, then trigger lab bed, laptop desk, pose chair, motion review screen, lab pool table, lab console, treadmill, weight bench, heavy bag, and any mapped social or pet activities.

## Known risks

The first batch is Canvas vector sprite production rather than external PNG sprite sheets. It materially improves the Test Subject pipeline and full color activity specificity, but the next pass should convert the strongest poses into real sprite-sheet assets or an atlas pipeline after visual approval.

The uploaded top down human and pet pose sheet files were not discoverable through the accessible File Library in this run. The implementation uses the enforced matrix law, reference archive, current screenshot feedback, and the explicit pose family requirements as the reference brief. Future agents should reattach or locate the actual pose sheets and compare this implementation against them.

## Follow ups

```txt
Browser test the Test Subject poses at actual game scale.
Add a debug pose cycling command for Test Subject visual review.
Create real PNG sheets from approved vector poses.
Split cuddle, shower, toilet, swim, darts, and arcade into object specific second pass poses.
Align pet_interaction to the live dog entity when both are nearby.
Update shared resident and girlfriend pipeline only after Test Subject proves stable.
```
