# Backup Manifest: Upstairs Extension Repair

Status: BACKUP_MANIFEST
Date: 2026-07-13
Branch protected: phaser-migration
Reason: Repairing a playability regression in upstairs architecture where the previous extension pass crammed the extension and primary side into one maze-like map without a readable foyer connection.

## Protected baseline

Current shared head before repair:

`68e78a7be8f57efd527a57c7d729924f03215bd1`

## Files protected before repair

- `src/world.js`
- `src/blueprint.js`
- `src/upstairsExtensionLayout.js`
- `src/rendering.js`
- `tests/upstairs-extension-layout.test.js`
- `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md`

## Repair intent

- Restore a connected playable upstairs immediately.
- Keep the new stairs in the extension side.
- Keep two new bedrooms, closets, TVs, shared upstairs bath, and storage room.
- Reconnect the extension to the primary suite through a visible upper hall/foyer.
- Mark the true multi-screen master-over-garage slide/pull extension as pending, not falsely complete.
