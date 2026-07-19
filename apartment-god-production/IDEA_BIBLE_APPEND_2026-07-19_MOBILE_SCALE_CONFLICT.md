# Idea Bible Append, Mobile Scale Conflict

Date: 2026-07-19
Status: ACTIVE BUG DIRECTIVE
Branch: work/mobile-scale-conflict-fix-2026-07-19

Kam supplied a live Android screenshot showing that the prior mobile sizing change did not fix the playfield. The Phaser game canvas is still centered vertically inside a much taller dark region, leaving most of the game wrapper blank while only the bottom strip of the 960 by 720 scene remains visible above the control bar.

Required result:
- The complete 4:3 Phaser scene must begin directly beneath the browser chrome and HUD pill.
- No Phaser auto-centering margin may push the canvas downward inside the wrapper.
- The canvas must not be simultaneously sized by conflicting Phaser Scale Manager and CSS rules.
- The whole scene must remain visible and tappable above the control bar on Android portrait screens.
- Desktop layout must remain intact.
- Do not change Render settings or manually trigger Render.

Likely root cause to verify:
The runtime currently combines Phaser.Scale.FIT plus Phaser.Scale.CENTER_BOTH with custom CSS and JavaScript sizing. Phaser's injected centering margins can conflict with the wrapper sizing and create the large blank region seen in the screenshot.
