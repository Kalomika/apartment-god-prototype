# Ongoing Design Log Append, Full Phaser Audit

## 2026-07-21, Main and Phaser Migration Full Audit

Status: NEEDS_TESTING
Branch: repair/phaser-full-audit-2026-07-21
Source branch: phaser-migration
Source head: 3e8722052e7dc4fbf781b11979f339327b8b6b06
Main head inspected: ad80f363422778e1e700045a75273854bc32a30b
Backup branch: backup/phaser-migration-before-full-audit-repair-2026-07-21
Render playable branch updated: no
Render settings changed: no

Runtime and test commits:

- 7314c6d0d934be50a768b6c44a815699712ef094, managed camera swipe lifecycle
- 566452f6f0582034e5ab1275b8eb0f433d721625, Phaser scene lifecycle and stale activity cleanup
- 1ca7a707af8917b96591b70f8e6a0d7c4b98ac9c, activity progress, world input, and object facing
- cafb04052b98e7b1807d1e36db2c68903e263fc6, kitchen sink visual and collision alignment
- 358aac8b564227afcb680653197e9b61b2023399, defaults aware old save loading
- f358683db5a68659233ecf3fb634102744e7d383, Phaser runtime cache bust
- 56ea94ea34b6439880a0a353772eb42b9735c479, behavioral regression tests
- fc39558fcf7fc7ce4854d45884213d699b2598ad, HTML entry cache bust
- 7c1c37f1cad1298a867386e5b0298b2d68e8cf88, canonical Idea Bible restoration
- 6c7a5cca2ae64f6daf5e54f1539a3d0527570ab7, full audit directive append

Files changed:

- src/managedCameraSwipeNavigation.js
- src/phaserParityRuntime.js
- src/phaserParityCorrections.js
- src/runtimeObjectCorrections.js
- src/saveSystem.js
- src/main.js
- index.html
- tests/phaser-full-audit-regressions.test.js
- apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-21_FULL_PHASER_AUDIT.md
- this log append
- related matrix, backup, and build log append files

Summary:

The recorded previous audit heads had not moved. `main` remained at ad80f363422778e1e700045a75273854bc32a30b and `phaser-migration` remained at 3e8722052e7dc4fbf781b11979f339327b8b6b06. No force move or hidden divergence occurred since that recorded successful run. The active development branch is still ten commits ahead of `main`, so the Render branch does not include the mobile scale conflict fix.

A full current-state audit nevertheless found verified defects in scene lifecycle cleanup, camera swipe rebinding, stale activity metadata, activity progress compatibility, arcade world hit testing, kitchen sink visual and collision authority, and regular old-save loading. These were repaired on an isolated branch without modifying `main` or Render settings.

Implementation details:

- Replaced the unmanaged camera swipe installation with a removable listener set that rebinds to the active scene state.
- Phaser scene shutdown now removes global listeners, clears the hidden simulation interval, removes the scene pointer callback, and clears managed swipe listeners.
- The runtime records the object being approached before movement arrival clears the target.
- Inactive timed metadata is normalized away so old activities cannot control later travel or animation.
- Stationary actors use the preserved active object to face the object they are using, while intentional sleep, swim, and dog rest states retain their specialized orientation.
- Progress rendering establishes a per action baseline when `actionTotal` is absent and resets the baseline when the action changes.
- Arcade cabinet hit testing uses `pointer.worldX` and `pointer.worldY`, with screen coordinate fallback.
- The kitchen sink runtime correction now uses the same preferred diagonal sink position and footprint as the Phaser overlay, aligning collision and visual rendering without painting over the kitchen.
- Version 3 regular saves now merge older saved values into current nested defaults, merge entities by ID, and merge saved world objects into the current object list rather than deleting newly added systems and objects.
- Version 2 saves remain accepted through the defaults aware path.

Other agent work reviewed:

- PR 33 contains useful progress and arcade ideas, but its duplicate sink repair paints floor over the old object and its facing logic depends on movement targets that no longer exist during most timed activities. It remains open and was not merged or overwritten.
- PR 30 is a large native Phaser Migration 2 draft and remains separate from the active parity branch.
- PR 34 is Top Shot work on separate branches and does not modify the audited Apartment God heads.

Testing performed:

- Exact branch head comparisons completed through GitHub.
- Existing Phaser migration head documentation records successful Phaser Parity CI run 29681106298 before this repair.
- New behavioral tests were added for progress, stale state cleanup, save merging, object merging, sink alignment, swipe map preservation, and listener cleanup.
- The exact repaired head still requires GitHub Actions completion and browser testing.

Browser tests required:

1. Hard refresh the Render or future branch preview.
2. Start several timed activities and confirm the bar advances and resets for the next activity.
3. Confirm actors face sinks, desks, televisions, consoles, tables, and other used objects without changing intentional sleeping or swimming orientation.
4. Confirm exactly one preferred diagonal kitchen sink appears and actor collision matches it.
5. Rotate Android portrait to landscape and back, background and return, then confirm one simulation tick stream and correct touch alignment.
6. Restart the Phaser scene in a development preview and confirm swipe gestures, autosave, and background time do not double.
7. Load a version 2 save missing wardrobe, careers, cleaning, newer entities, and newer world objects. Confirm the save values remain while modern defaults are present.
8. Test one traveler leaving, everyone leaving, vehicle return, actor visibility, garage door closure, parked vehicle restoration, and selection recovery.

Known limitations:

- Current character sheets still provide four cardinal directions and four generic frames per direction. Eight direction modular outfit sprites remain a production asset requirement, not completed by this code audit.
- Local checkout and local test execution were unavailable because the execution runtime could not resolve GitHub hosts. GitHub connector reads and writes remained available, and GitHub Actions is the authoritative automated test path for the repair branch.
