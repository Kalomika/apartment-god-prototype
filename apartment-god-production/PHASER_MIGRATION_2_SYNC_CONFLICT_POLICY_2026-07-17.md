# Phaser Migration 2 Sync Conflict Policy

Status: ACTIVE FOR MAIN GAMEPLAY SYNC
Date: 2026-07-17

Source gameplay branch: main
Target native renderer branch: phaser-migration-2

When files overlap, preserve current gameplay behavior and data from main unless doing so would replace the native Phaser renderer or branch specific P2 assets.

P2 protected architecture:

1. src/phaserMigration2Runtime.js remains the runtime target.
2. src/main.js must boot Phaser Migration 2 on this branch.
3. assets/phaser-migration-2 remains available and referenced.
4. Native Phaser room, object, actor, effects, depth, input, and animation ownership must not be replaced by Canvas compatibility textures.
5. Character motion remains intentionally authored for 8 FPS presentation.
6. Dedicated activity sheets and object sprites should replace generic transforms and placeholders incrementally.

Main systems to carry forward:

Current state shape, actions, autonomy, world and layout corrections, routing, front yard and driveway, vehicles, gate traversal, arcade, basketball, offsite continuity, calendar, career, life quality, tidiness, saves, mobile protections, runtime guards, pool cleanup, tests, and build configuration.

Visual acceptance:

Native Phaser structure alone is not visual completion. Generic one file SVG stand ins, repeated room panels, undifferentiated fixtures, and pose simulation through scaling or rotation remain temporary. The target is true top down, grounded proportion, no outlines, color and lighting separation, painterly environment treatment, and unique readable animation for activities.