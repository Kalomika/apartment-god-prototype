# Development Matrix Append, Main Dining And Kitchen Layout Mirror

Date: 2026-07-14
Branch: main
Status: NEEDS_TESTING
Backup branch: backup/main-before-dining-kitchen-layout-mirror-2026-07-14

## Render Playable Dining And Kitchen Fix
Status: NEEDS_TESTING

Update:
- The phaser-migration dining and kitchen layout correction has been mirrored to `main` for Render-visible testing.
- Main now has the separated dining table/chair pieces, L shaped kitchen counter redraw, separated sink and coffee maker positions, and cache-busted module chain.
- Main was not force-synced wholesale from phaser-migration because the branches are diverged.

Required test:
- Open https://apartment-god-phaser.onrender.com after Render rebuilds.
- Hard refresh.
- Confirm dining table and chairs appear as separate pieces.
- Confirm the Resident eating aligns with a visible chair.
- Confirm old table/chair visuals are cleared underneath.
- Confirm the sink and coffee maker no longer overlap.
- Confirm the kitchen reads as a continuous L counter from the stove/sink run around the right side.

Risk note:
- If the link still shows the old layout, inspect the served JS and deployed commit before changing the runtime code again.
