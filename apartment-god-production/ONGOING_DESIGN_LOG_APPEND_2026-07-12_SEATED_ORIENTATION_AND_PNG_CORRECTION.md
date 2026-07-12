## 2026-07-12, Seated Orientation Fix and PNG Asset Correction

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: latest implementation before this append 9ff2c0e293304ddb79b696fee40c54a1c8de471d
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-vehicle-sprite-asset-integration-2026-07-12

Summary:
Kam identified that the couch sitting sprite was facing the wrong way and challenged the previous PNG handling explanation. This entry corrects the diagnosis and logs the immediate runtime fix.

Implementation details:
- The couch issue came from broad seated pose logic. `Couch: relax`, TV watching, desk use, eating, and other sitting actions were still sharing one front facing seated actor pose.
- Updated `src/afterEntityOverlays.js` so couch, relax, TV, and watch actions draw a back facing seated overlay aimed toward the relevant screen or TV target.
- The couch seated overlay now covers the generic front facing sprite and shows the back of the head, back, shoulders, arms, bent legs, and a viewing cone toward the target.
- Removed the vehicle contrast label overlay that was still drawing text labels such as SUV, CONV, BIKE, MOTO, and ATV over vehicles.

PNG correction:
- The earlier claim that generated PNGs could not be handled was incomplete. The exact generated vehicle files exist in the working environment at `/mnt/data/vehicle_assets/`.
- The remaining task is to attach the exact generated vehicle PNG content to the repo/runtime through a binary commit path or exact image data module, then switch `vehicleSpriteRenderer.js` to draw those images as source of truth instead of canvas reconstruction.

Testing performed:
GitHub file inspection only. No browser test and no Render update.

Testing requested:
Check couch relaxing or TV watching on the main floor. The actor should no longer appear to face the player while sitting on the couch. Check garage vehicles and confirm text labels are gone once this branch is mirrored to main for Render.

Known risks:
The seated correction is an overlay above the current actor renderer rather than a full replacement of the base seated pose. A future animation pass should move this into the core pose renderer for all four directions.
