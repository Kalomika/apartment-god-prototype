# Ongoing Design Log Append, Couch Porch Dining Correction

## 2026-07-13 05:45 AM CT, Main Floor Couch Porch And Dining Correction

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: c29f5ba5e3540d01640659eed9e4ad1142e5fbeb
Files changed: src/visualRegressionFixes.js
Runtime files changed: yes
Render playable branch updated: pending main fast forward after matrix patch
Backup branch: backup/phaser-before-couch-porch-dining-correction-2026-07-13, backup/main-before-couch-porch-dining-render-2026-07-13

Summary:
Corrected the main floor screenshot issues Kam flagged on Render: the L couch still read as facing the wrong way, the chaise was on the porch side instead of the TV side, the dining side chair/table clearance was crowding the stair/service entrance, and the earlier porch green overlay had been duplicated across the lower house on main.

Implementation details:
- Updated `src/visualRegressionFixes.js` to run after the active realism correction pass and overwrite the wrong main floor couch geometry with a precise TV-facing L sectional.
- The couch is now pushed left and redrawn with the chaise projecting toward the TV side rather than toward the porch side.
- The dining correction now narrows the table runtime footprint and redraws only four chairs, removing the side chairs that crowded the right-side circulation path.
- The broad porch grass overlay is not reintroduced in this layer. The previous duplicate porch redraw was already removed from this file on phaser-migration, and syncing main will remove the green band that was visible on Render.
- Coffee table remains between TV and couch but is slightly aligned with the corrected couch position.

Testing performed:
- GitHub fetch/compare was used to verify current branch state and detect concurrent work after the last Render sync.
- Code was written to a focused runtime file only. Full browser testing is still needed on Render.

Testing requested:
Open https://apartment-god-phaser.onrender.com after main is fast forwarded and Render rebuilds. Hard refresh. Verify the couch is against the left living wall, the L/chaise projects toward the TV side not the porch, the dining table no longer blocks the stair/service entry, and the green porch land no longer cuts across the house or stair zone.

Known risks:
- This is still a Canvas correction layer, not the final sprite and layout system.
- Because realismCorrectionPass still owns earlier couch and dining drawing, this layer deliberately clears and redraws the corrected main floor furniture after realism draws. Future cleanup should consolidate the final geometry into one source instead of layered corrections.

Follow ups:
- Replace the stacked correction layers with one clean canonical main floor layout pass.
- Build proper seating anchors for couch and dining rather than relying on visual correction layers.
- Continue character sprite scale and sitting pose improvement after layout stops shifting.
