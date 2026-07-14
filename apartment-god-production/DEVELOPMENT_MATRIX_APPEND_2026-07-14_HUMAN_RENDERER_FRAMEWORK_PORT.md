# Development Matrix Append, Human Renderer Framework Port

Date: 2026-07-14
Branch: main
Runtime commit: 9a075860520fe121a09f557a356a21528d8e5ed9
Status: NEEDS_TESTING
Backup branch: backup/main-before-human-renderer-framework-port-2026-07-14

## Affected Matrix Areas

### Human Renderer
Status: NEEDS_TESTING

Update:
- Current playable human renderer has been revised to drop the back-facing human feature.
- Walking now uses a stronger visible procedural walk cycle plus frame-to-frame movement detection.
- Normal human poses are front-facing again to match Kam's requested last-known-good direction.
- Visible eye details were restored/added so the characters do not read as back-of-head hair blobs.

### Activity Animation Identity
Status: NEEDS_TESTING

Preserved or added in the current human renderer:
- Walking
- Lift weights
- Treadmill
- Heavy bag
- Shower
- Wash dog
- Sleep anchored to bed
- Standing pee
- Seated toilet
- Brush teeth

### Branch Risk
Status: NEEDS_TESTING

Notes:
- This change was made on `main` because Kam is reviewing the playable Render branch.
- `main` and `phaser-migration` remain diverged.
- Do not blindly fast-forward or force sync branches after this change.
- Port this renderer fix to `phaser-migration` only after checking the latest branch state and preserving the other agent's Phaser/stabilization work.

### Required Browser Test
Status: PENDING

Test at:
https://apartment-god-phaser.onrender.com

Test cases:
- Resident walking to several objects.
- Girlfriend walking to several objects.
- Girlfriend should not show the dropped back-of-head feature.
- Sink brush teeth action should show a brushing pose.
- Toilet standing pee and seated toilet should show distinct poses.
- Shower, wash dog, lift weights, treadmill, heavy bag, and sleep should still display.
- Sleeping heads should remain visible and bed anchoring should hold.
