# Test Actor Top Down Sprite Pipeline, 2026-07-11

Status: PARTIAL, implemented first runtime slice and needs browser testing.

Branch: phaser-migration

Scope: Test Subject / `lab_test_subject` only. Resident, Girlfriend, and Dog keep their current procedural fallback renderers.

## Current state audit

The current actor renderer lives in `src/renderEntities.js`. It draws visible entities on the active floor, translates to the entity position, rotates by a shared heading helper, then calls either the dog renderer or the generic person renderer. The current person path is procedural Canvas drawing, not a production sprite pipeline.

The existing renderer already has some color and some activity branches, but it is still rudimentary because many different actions share one broad seated body. Desk, phone, game, ordering, reading, study, and eating are all routed through the same generic sitting body with small prop overlays. That is the exact problem this pass starts correcting for the Test Subject.

The Test Subject exists in `src/state.js` as `lab_test_subject`, name `Test Subject`, type `person`, floor 5, Secret Lab East. The Secret Lab floor and test objects exist in `src/world.js`, including lab bed, laptop desk, pose chair, motion review screen, lab shower, lab toilet, lab pool table, lab console station, treadmill, weight bench, and heavy bag.

## Activity inventory

First pass upgraded or routed through an activity specific Test Subject pose:

```txt
idle
walk
chair sit
couch sit
desk sit
laptop desk work
laptop on lap
reading
phone use
watching TV
eating at table
drinking coffee
sleeping in bed
lying in bed awake
floor lounging
pool table use
console or game use
cooking
cleaning or chore posture
changing clothes
light workout or stretch
pet interaction
basic emotional reaction
bed or cuddle fallback
```

Still fallback or second pass:

```txt
full directional sheets
true PNG sprite sheets
separate bed versus couch cuddle variants
full couple pose system
full pet pose with live dog alignment
post shower towel pose beyond existing privacy and towel systems
specific toilet and shower character sprites
proper swim sprite for Test Subject
separate darts and arcade cabinet contact poses
entry and exit animation for every activity
```

## Reference to activity mapping

The uploaded top down pose family requirements were used as the implementation brief where the actual uploaded pose-sheet files were not accessible in this run.

```txt
overhead anatomy references -> idle, walk, reaction, all fallback checks
seated desk work references -> desk sit, laptop desk work
laptop on lap references -> laptop_lap
seated reading references -> reading
seated phone references -> phone_use
table posture references -> eating_table and coffee_drink
bed posture references -> sleep_bed and lying_bed_awake
floor lounging references -> floor_lounging
couch posture references -> couch_sit, tv_watch, console_game
couple and cuddle references -> cuddle_bed fallback for later shared pose expansion
pet resting and interaction references -> pet_interaction
```

## Test Actor design standard

The first Test Subject style is full color, adult proportioned, true top down, and drawn with a consistent origin at entity center. Head direction is shown through hair mass, neck placement, shoulder wedge, and arm lead. The body avoids icon construction by separating shoulders, torso, hips, limbs, hands, feet, clothing panels, shadow, props, and activity contact shapes.

Palette:

```txt
ink outline: #071018
skin: #5a372f
skin light: #7a4a3d
hair: #05070a
shirt: #172235
shirt lit: #263f63
trim accent: #74e6ff
pants: #111820
blanket: #24324a
props: muted off whites, warm golds, laptop cyan glow
```

## Runtime pipeline

`src/testActorPoseManifest.js` is the activity mapping layer.

`src/testActorSpriteRenderer.js` is the first Test Subject sprite renderer. It draws full color top down vector sprite poses in Canvas from the manifest. These are runtime assets in code form, not reference files.

`src/renderEntities.js` now tries the Test Subject renderer first for `lab_test_subject`. If that renderer returns false, the old procedural person renderer still runs. Dogs and the normal household characters are unchanged.

Pipeline order:

```txt
entity.currentActionId or action text
-> TEST_ACTOR_ACTION_TO_POSE
-> TEST_ACTOR_POSE_LIBRARY
-> drawTestActorSprite pose function
-> safe fallback to idle or old procedural renderer if unavailable
```

## First pass quality notes

This pass does not claim final asset quality. It proves the game can route the Test Subject through a dedicated full color top down pose system with object aware activity identities while keeping the existing game playable.

The old generic resident renderer remains intentionally untouched for safety. Broad actor replacement stays planned until the Test Subject pipeline is browser tested and expanded into real sprite sheets.
