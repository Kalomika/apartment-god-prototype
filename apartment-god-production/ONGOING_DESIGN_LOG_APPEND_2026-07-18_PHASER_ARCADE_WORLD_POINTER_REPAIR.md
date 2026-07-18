# Ongoing Design Log Append, Phaser Arcade World Pointer Repair

## 2026-07-18, Automated Repository Audit

Status: NEEDS_CI_AND_BROWSER_TESTING
Repair branch: repair/phaser-arcade-world-pointer-2026-07-18
Audited source head: ad80f363422778e1e700045a75273854bc32a30b

New synchronized history reviewed:

The previous successful audit recorded main at 3d255b14ff7225fab44908f280f1db3693da1850. Main and phaser-migration now point to ad80f363422778e1e700045a75273854bc32a30b after a 15 commit Phaser regression repair series and synchronization.

Verified regression:

src/phaserParityCorrections.js used pointer.x and pointer.y to call objectAt for arcade cabinet double tap detection. These are screen coordinates, while objectAt evaluates world object bounds. Camera movement, scaling, or canvas fitting could therefore cause missed or incorrect arcade cabinet hit detection.

Repair:

Runtime commit: 0f6f1f06c8fe5eb0c7966030e34ea57fd392f278
Test commit: 37821193288b0701656b90d8624b4d7e0201f7ec

The correction now prefers Phaser pointer.worldX and pointer.worldY for world object hit testing. Screen coordinates remain the fallback when world coordinates are unavailable. Expanded arcade controls intentionally continue using pointer.x and pointer.y because that interface is screen space.

Tests added:

tests/phaser-arcade-pointer-world.test.js verifies world coordinate preference and compatibility fallback.

Protected branch state:

main unchanged by this repair.
phaser-migration unchanged by this repair.
Render settings unchanged.
No force update or merge performed.

Browser verification required:

1. Hard refresh the Phaser Render build.
2. Pan or move the camera so the arcade cabinet is not at its original screen coordinate.
3. Double tap the visible cabinet and confirm expanded arcade controls open.
4. Resize the browser and repeat.
5. Repeat on mobile after the playfield scales.
6. Confirm the expanded controls still use screen aligned close, joystick, and button hit zones.
