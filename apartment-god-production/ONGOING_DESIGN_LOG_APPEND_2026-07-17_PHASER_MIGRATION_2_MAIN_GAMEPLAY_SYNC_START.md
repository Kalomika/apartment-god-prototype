## 2026-07-17, Phaser Migration 2 Main Gameplay Sync Started

Status: INTEGRATION_IN_PROGRESS
Branch: phaser-migration-2
Source branch: main
Backup branches: backup/phaser-migration-2-before-main-sync-2026-07-17, backup/main-before-phaser-migration-2-sync-2026-07-17

Goal:
Bring current main gameplay systems, corrections, world data, routing, saves, activities, vehicles, arcade, basketball, offsite continuity, calendar, career, tests, and stability work into phaser-migration-2 while preserving the branch specific native Phaser runtime, native Phaser floor and object layers, 8 FPS character animation system, and migration assets.

Non regression rule:
Do not replace the phaser-migration-2 native runtime with the main Phaser compatibility Canvas texture runtime. Resolve overlapping runtime files in favor of the strongest current gameplay behavior while keeping Phaser native rendering ownership.

Visual target:
Use authored sprite assets and dedicated Phaser objects where available. Avoid procedural Canvas fallback for rooms, objects, actors, effects, and activities. Maintain true top down presentation, no outlines, color and lighting based separation, painterly environment direction, grounded proportions, and 8 FPS anime styled character motion.

Testing status:
NEEDS_TESTING. A separate Render service may target phaser-migration-2 directly after the integration branch builds and passes repository checks. Main remains the stable fallback.