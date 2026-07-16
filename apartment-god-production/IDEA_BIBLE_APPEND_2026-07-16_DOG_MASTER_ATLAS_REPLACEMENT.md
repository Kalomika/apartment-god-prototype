# Idea Bible Append, Dog Master Atlas Replacement

Date: 2026-07-16
Status: IMPLEMENTING
Branch: phaser-migration

## Directive

Replace the failed four-frame dog asset with a real transparent PNG master atlas and make it the only active dog visual path.

## Required visual rules

- true top-down dog anatomy
- brown and off-white coat
- flat anime color treatment
- clear head-to-tail movement axis
- head faces travel direction
- tail points opposite travel direction
- no old fallback dog underneath
- no procedural bug-like silhouette
- readable at mobile game scale

## Required state coverage

- idle
- walk A and B
- run A and B
- sit
- lie
- sleep
- eat
- drink
- fetch carry
- play bow
- bark
- kennel rest
- passage travel

Every state requires north, south, east, and west frames in the atlas. Runtime must map activities to their specific atlas row rather than using one standing frame for every dog action.
