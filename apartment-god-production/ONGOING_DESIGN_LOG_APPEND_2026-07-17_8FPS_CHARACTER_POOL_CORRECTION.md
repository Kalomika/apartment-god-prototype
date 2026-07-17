## 2026-07-17, Grounded 8 FPS Character and Pool Circling Correction

Status: NEEDS_TESTING
Branch: phaser-migration-2
Commit: implementation range caaa27e7b0f7c3de2fa6667dad7914f93275022a through 725a21318297d233c454f0f8ea3250e1aa4236e9, regression test c41431d512976f47ba9ff9d43967c4ac29c9c40e, matrix patch c60f6bbe65a8cda3d8c4480f78c038a1049d0681
Files changed: assets/phaser-migration-2/sprites/characters/resident_8fps_sheet.svg, assets/phaser-migration-2/sprites/characters/girlfriend_8fps_sheet.svg, assets/phaser-migration-2/sprites/characters/lab_subject_8fps_sheet.svg, assets/phaser-migration-2/sprites/characters/dog_8fps_sheet.svg, assets/manifests/phaser-migration-2-character-sprite-manifest.json, src/phaserCharacterAnimationSystem.js, src/phaserMigration2Runtime.js, src/poolActivitySystem.js, tests/phaser-migration-2-animation-pool.test.js, apartment-god-production/PHASER_MIGRATION_2_8FPS_CHARACTER_AND_POOL_ANIMATION_SPEC.md, Render workflow documentation, and migration status append files
Runtime files changed: yes
Render playable branch updated: yes, previous Canvas main restored at 1ebc880bdf550faac16f6d4383ef9da18689efc4
Backup branch: backup/phaser-migration-2-before-8fps-character-pool-overhaul-2026-07-17
Main backup used for restore: backup/main-before-phaser-render-sync-2026-07-17

Summary:
Kam rejected the Phaser Migration 2 pool running in place and the static bridge character art. Main was restored immediately. On the isolated migration branch, the static actor rebuild was replaced with a persistent four direction sprite system running at 8 FPS, and pool choreography was changed to move actors physically around the table perimeter before aiming and shooting.

Implementation details:
- Added complete 512 by 512 directional sprite sheets for Resident, Girlfriend, Lab Test Subject, and an adult shepherd mix dog.
- Each sheet contains south, west, east, and north rows, with four frames per direction.
- Added a persistent Phaser character animation manager. Actor sprites, shadows, rings, cues, and labels are retained and synchronized instead of destroyed and recreated every frame.
- Walk animations run at exactly 8 FPS.
- A walk animation only starts after measurable world coordinate movement. An action label alone can no longer create running in place.
- Added direction resolution from actual frame displacement and grounded contact shadows for every active actor.
- Added pool cue and hand alignment overlays for pool states.
- Replaced general movement path dependence during active pool choreography with explicit perimeter waypoints and direct simulation movement.
- The shooter walks outside the pool table collision boundary to a frozen stance, stops, faces the cue ball, shoots, watches the balls, then yields the turn.
- Non shooting players move to separate waiting stations and stop.
- Added native Phaser pool ball, cue line, and cue thrust rendering.
- Added regression coverage for the 8 FPS law, no movement means no walk animation, directional movement, perimeter routing, and actual actor coordinate changes.
- Added an asset manifest and an entry, loop, exit, alignment, interruption, and test specification for the character and pool systems.

Testing performed:
Node syntax checks passed for `src/phaserMigration2Runtime.js`, `src/phaserCharacterAnimationSystem.js`, and `src/poolActivitySystem.js` using locally reconstructed copies of the committed source. GitHub source inspection was completed. The new Vitest file, full repository check, build, and browser behavior were not executed in this connector session.

Testing requested:
Do not promote this branch to main yet. In a runnable checkout or isolated preview, run `npm run check`, `npm test`, and `npm run build`. Then test Resident, Girlfriend, Lab Test Subject, and Dog in all four directions. Start pool together and verify that the current shooter changes world position around the table, the waiting actor uses a separate station, neither crosses the table, walking stops at the stance, the cue aligns through both hands, the balls move, and turn changes create purposeful repositioning without jitter.

Known risks:
The directional sprite sheets are committed and wired, but they still need mobile browser visual approval. Unique activity sheets beyond the pool stance remain incomplete. Phaser Migration 2 still lacks full parity with the restored Canvas main and must not replace main until browser tests pass.

Follow ups:
Run the full test and build suite, inspect the sprite sheets at actual game scale, correct any frame crop, depth, or route issue, then provide an isolated preview for Kam before any future main promotion.
