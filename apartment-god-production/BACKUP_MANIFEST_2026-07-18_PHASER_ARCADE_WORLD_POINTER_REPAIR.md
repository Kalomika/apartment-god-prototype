# Backup Manifest, Phaser Arcade World Pointer Repair

Date: 2026-07-18
Status: REPAIR_BRANCH_ONLY

Repository: Kalomika/apartment-god-prototype
Audited synchronized head: ad80f363422778e1e700045a75273854bc32a30b
Repair branch: repair/phaser-arcade-world-pointer-2026-07-18
Repair branch base: ad80f363422778e1e700045a75273854bc32a30b

Protected branches were not modified during this audit. Both main and phaser-migration remained at the synchronized audited head when the repair branch was created.

Runtime repair commit: 0f6f1f06c8fe5eb0c7966030e34ea57fd392f278
Regression test commit: 37821193288b0701656b90d8624b4d7e0201f7ec

Files changed:

1. src/phaserParityCorrections.js
2. tests/phaser-arcade-pointer-world.test.js

Reason:
The new arcade double tap correction passed pointer screen coordinates into world object hit testing. Phaser supplies worldX and worldY for camera aware world interaction. The repair uses those world coordinates, with the original x and y values retained only as a compatibility fallback.

Merge state:
Not merged. Requires available automated checks and browser verification before promotion.