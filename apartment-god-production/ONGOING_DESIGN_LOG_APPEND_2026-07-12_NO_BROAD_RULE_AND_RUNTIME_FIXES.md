# 2026-07-12, No Broad Rule and Runtime Specificity Fixes

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-no-broad-visual-rules-and-room-fixes-2026-07-12

## Commits

```txt
79df59229f64a9e68057621326340c46507f5269  Add dog bath action config
a5581e399349ef0de422d22bc63f99d39e552064  Move closet and add backyard dog bath
6dc487328818d8d22fc907a96daf320c67b907fc  Add backyard wash dog mechanic
46ff961875b8da7644797cabdeb42f5046969d03  Render corrected bed and backyard dog bath
add99d245c4aeb1d0841f7cae511e4695a58ce13  Apply specific top down main character core poses
e2c0530bb8f77afe08a1a4a383ced90eae439db0  Add no broad implementation rule document
31655ffeededcbb47428b89c48596520929b8f24  Add matrix append for no broad rule and runtime fixes
```

## Files changed

```txt
src/config.js
src/world.js
src/actions.js
src/renderObjects.js
src/renderEntities.js
docs/APARTMENT_GOD_NO_BROAD_IMPLEMENTATION_RULE.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-12_NO_BROAD_RULE_AND_RUNTIME_FIXES.md
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-12_NO_BROAD_RULE_AND_RUNTIME_FIXES.md
```

Runtime files changed: yes
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Summary

Added the No Broad Implementation Rule and applied a focused runtime pass to reduce broad visual behavior. Main characters now use a cleaner Test Subject inspired visual standard for idle, walking, and sitting, while rejected broad workout waddles were not carried over as the approved character upgrade. Bed, shower, closet, dog bath, and wash dog logic were moved toward object specific behavior.

## Implementation details

- Added a dedicated no broad implementation production rule document.
- Added a matrix append tracking the rule and runtime fixes.
- Added dog bath support to action config.
- Kept the dog bath in the backyard kennel area as the wash dog target.
- Added wash dog arrival behavior that syncs the dog to the bath and gives the dog a washing state.
- Added finish logic that improves dog freshness after washing.
- Updated object rendering for the corrected bed and dog bath.
- Updated main character render path for cleaner idle, walk, sitting, bed sleep cover, sliding shower/privacy/clothes cue, and wash dog pose.

## Testing performed

```txt
Local syntax check was performed on generated JS files before GitHub write:
node --check renderEntities_compact.js
node --check actions.js
node --check world.js
node --check renderObjects.js

GitHub compare was run against the backup branch after runtime writes.
```

No browser or Render test was performed.

## Testing requested

```txt
Test upstairs bedroom bed scale and blanket coverage.
Test bedroom closet behavior.
Test main character idle, walk, and sitting.
Test shower no longer uses blur censorship.
Test shower sliding/privacy/clothes cue.
Test backyard dog bath and Wash Dog.
Test boot and all floors for layout regressions.
```

## Known risks

This remains a Canvas/vector implementation, not final PNG sprite art. The main matrix and handbook should directly absorb the no broad rule in a future line safe documentation sync. The current implementation creates the rule document and matrix append, but the canonical handbook was not rewritten in this pass to avoid replacing a long rulebook unsafely.

## Follow ups

```txt
Fold the new rule document directly into the handbook and canonical matrix.
Replace Canvas vector clothes pile with actual top down PNG asset.
Create true top down PNG sprite sheets for approved idle, walk, sit, bed, shower, dog bath, and dog wash states.
Browser test phaser-migration before any Render/main update.
```
